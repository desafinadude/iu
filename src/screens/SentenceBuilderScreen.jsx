import { useState, useRef, useEffect } from 'react'
import { Volume2, Copy, Check, ChevronRight, ChevronLeft, Loader } from 'lucide-react'
import { VOCAB_LIST, ADJ_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'
import { speak } from '../utils/speech'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import {
  generateGameChallenges,
  checkAnswer,
  CHALLENGES_PER_GAME,
} from '../utils/llmChallenge'
import './SentenceBuilderScreen.css'

// ─── Category data ─────────────────────────────────────────────────────────

const PARTICLES = [
  { word: 'は',   kana: 'は',   meaning: 'topic',               type: 'particle' },
  { word: 'が',   kana: 'が',   meaning: 'subject',             type: 'particle' },
  { word: 'を',   kana: 'を',   meaning: 'object',              type: 'particle' },
  { word: 'に',   kana: 'に',   meaning: 'direction / time',    type: 'particle' },
  { word: 'で',   kana: 'で',   meaning: 'location / means',    type: 'particle' },
  { word: 'へ',   kana: 'へ',   meaning: 'direction',           type: 'particle' },
  { word: 'と',   kana: 'と',   meaning: 'and / with',          type: 'particle' },
  { word: 'の',   kana: 'の',   meaning: 'possession',          type: 'particle' },
  { word: 'も',   kana: 'も',   meaning: 'also / too',          type: 'particle' },
  { word: 'か',   kana: 'か',   meaning: 'question marker',     type: 'particle' },
  { word: 'ね',   kana: 'ね',   meaning: "isn't it / right?",   type: 'particle' },
  { word: 'よ',   kana: 'よ',   meaning: 'emphasis / assertion',type: 'particle' },
  { word: 'から', kana: 'から', meaning: 'from / because',      type: 'particle' },
  { word: 'まで', kana: 'まで', meaning: 'until / up to',       type: 'particle' },
  { word: 'だ',   kana: 'だ',   meaning: 'copula (casual)',     type: 'particle' },
  { word: 'です', kana: 'です', meaning: 'copula (polite)',     type: 'particle' },
]

function fromVocab(filter, type) {
  return VOCAB_LIST.filter(filter).map(w => ({ word: w.word, kana: w.kana, meaning: w.meaning, type: type ?? 'noun' }))
}

const CATEGORIES = [
  { id: 'particles',  label: 'Particles',        opts: PARTICLES },
  { id: 'pronouns',   label: 'Pronouns',          opts: fromVocab(w => w.type === 'pronoun', 'pronoun') },
  { id: 'people',     label: 'Nouns — People',    opts: fromVocab(w => w.type === 'noun' && w.theme === 'people') },
  { id: 'places',     label: 'Nouns — Places',    opts: fromVocab(w => w.type === 'noun' && w.theme === 'places') },
  { id: 'food',       label: 'Nouns — Food',      opts: fromVocab(w => w.type === 'noun' && w.theme === 'food') },
  { id: 'animals',    label: 'Nouns — Animals',   opts: fromVocab(w => w.type === 'noun' && w.theme === 'animal') },
  { id: 'home',       label: 'Nouns — Home',      opts: fromVocab(w => w.type === 'noun' && w.theme === 'home') },
  { id: 'clothing',   label: 'Nouns — Clothing',  opts: fromVocab(w => w.type === 'noun' && w.theme === 'clothing') },
  { id: 'body',       label: 'Nouns — Body',      opts: fromVocab(w => w.type === 'noun' && w.theme === 'body') },
  { id: 'nature',     label: 'Nouns — Nature',    opts: fromVocab(w => w.type === 'noun' && w.theme === 'nature') },
  { id: 'transport',  label: 'Nouns — Transport', opts: fromVocab(w => w.type === 'noun' && w.theme === 'transport') },
  { id: 'time',       label: 'Time',              opts: fromVocab(w => w.type === 'noun' && (w.theme === 'time' || w.theme === 'calendar'), 'time') },
  { id: 'adverbs',    label: 'Adverbs',           opts: fromVocab(w => w.type === 'adverb', 'adverb') },
  {
    id: 'verbs_polite', label: 'Verbs — Polite',
    opts: VERB_LIST.flatMap(v => [
      { word: v.polite.present_pos.word, kana: v.polite.present_pos.kana, meaning: `${v.meaning} · pres +`, type: 'verb' },
      { word: v.polite.present_neg.word, kana: v.polite.present_neg.kana, meaning: `${v.meaning} · pres −`, type: 'verb' },
      { word: v.polite.past_pos.word,    kana: v.polite.past_pos.kana,    meaning: `${v.meaning} · past +`, type: 'verb' },
      { word: v.polite.past_neg.word,    kana: v.polite.past_neg.kana,    meaning: `${v.meaning} · past −`, type: 'verb' },
    ]),
  },
  {
    id: 'verbs_casual', label: 'Verbs — Casual',
    opts: VERB_LIST.flatMap(v => [
      { word: v.casual.present_pos.word, kana: v.casual.present_pos.kana, meaning: `${v.meaning} · pres +`, type: 'verb' },
      { word: v.casual.present_neg.word, kana: v.casual.present_neg.kana, meaning: `${v.meaning} · pres −`, type: 'verb' },
      { word: v.casual.past_pos.word,    kana: v.casual.past_pos.kana,    meaning: `${v.meaning} · past +`, type: 'verb' },
      { word: v.casual.past_neg.word,    kana: v.casual.past_neg.kana,    meaning: `${v.meaning} · past −`, type: 'verb' },
    ]),
  },
  {
    id: 'adjectives', label: 'Adjectives',
    opts: ADJ_LIST.flatMap(a => [
      { word: a.polite.present_pos.word, kana: a.polite.present_pos.kana, meaning: `${a.meaning} · pres +`, type: 'adj' },
      { word: a.polite.present_neg.word, kana: a.polite.present_neg.kana, meaning: `${a.meaning} · pres −`, type: 'adj' },
    ]),
  },
]

// ─── Free-mode grammar checker ────────────────────────────────────────────

function validateSentence(chips) {
  if (chips.length === 0) return null
  const issues = [], passes = []
  const lastPredIdx = chips.findLastIndex(c => c.type === 'verb' || c.type === 'adj')

  if (lastPredIdx === -1) {
    return { valid: false, issues: ['Add a verb or adjective to complete the sentence.'], passes: [] }
  }
  if (lastPredIdx === chips.length - 1) {
    passes.push('Predicate at the end — correct Japanese word order!')
  } else {
    issues.push('In Japanese, the verb or adjective comes at the end.')
  }

  const woIdx = chips.findLastIndex(c => c.word === 'を')
  if (woIdx !== -1) {
    if (woIdx < lastPredIdx) passes.push('Object particle (を) is before the verb.')
    else issues.push('The を particle should come before the verb.')
  }

  const negAdverb = chips.find(c => ['あまり', '全然'].includes(c.word))
  if (negAdverb) {
    const vk = chips[lastPredIdx]?.kana ?? ''
    if (vk.includes('ない') || vk.includes('ません')) {
      passes.push('Negative adverb paired correctly with negative verb form.')
    } else {
      issues.push(`「${negAdverb.word}」is used with negative forms (ない・ません).`)
    }
  }

  return { valid: issues.length === 0, issues, passes }
}

// ─── Two-step dropdown ─────────────────────────────────────────────────────

function WordDropdown({ onSelect }) {
  const [open,     setOpen]     = useState(false)
  const [category, setCategory] = useState(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (!panelRef.current?.parentElement?.contains(e.target)) {
        setOpen(false)
        setCategory(null)
      }
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function pickWord(opt) {
    onSelect(opt)
    setOpen(false)
    setCategory(null)
  }

  return (
    <div className="sb-dropdown">
      <button className="sb-dropdown__trigger" onClick={() => { setOpen(v => !v); setCategory(null) }} aria-expanded={open}>
        <span className="sb-dropdown__trigger-label">Add a word…</span>
        <ChevronRight
          size={16}
          className={`sb-dropdown__arrow${open ? ' sb-dropdown__arrow--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="sb-dropdown__panel" ref={panelRef}>
          {category ? (
            <>
              <button className="sb-dropdown__back" onClick={() => setCategory(null)}>
                <ChevronLeft size={14} aria-hidden="true" />
                <span>Back</span>
              </button>
              {category.opts.map((opt, i) => (
                <button key={i} className="sb-dropdown__item" onClick={() => pickWord(opt)}>
                  <span className="sb-dropdown__item-word">{opt.word}</span>
                  <span className="sb-dropdown__item-meta">
                    {opt.kana !== opt.word && <span className="sb-dropdown__item-kana">{opt.kana}</span>}
                    <span className="sb-dropdown__item-romaji">{kanaToRomaji(opt.kana)}</span>
                    <span className="sb-dropdown__item-meaning">{opt.meaning}</span>
                  </span>
                </button>
              ))}
            </>
          ) : (
            CATEGORIES.map(cat => (
              <button key={cat.id} className="sb-dropdown__cat" onClick={() => setCategory(cat)}>
                <span>{cat.label}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Chip ──────────────────────────────────────────────────────────────────

function Chip({ chip, isDragging, onPointerDown, onTap }) {
  return (
    <div
      className={`sb-chip${isDragging ? ' sb-chip--dragging' : ''}`}
      onPointerDown={onPointerDown}
      onClick={onTap}
      data-chip-id={chip.id}
    >
      <span className="sb-chip__word">{chip.word}</span>
      {chip.word !== chip.kana && <span className="sb-chip__kana">{chip.kana}</span>}
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────

const CHALLENGE_TIME = 90

export default function SentenceBuilderScreen() {
  const [sentence,    setSentence]    = useState([])
  const [checkResult, setCheckResult] = useState(null)
  const [copied,      setCopied]      = useState(false)

  // Challenge mode
  const [mode,            setMode]            = useState('free')
  const [challenges,      setChallenges]      = useState([])
  const [challengeIdx,    setChallengeIdx]    = useState(0)
  const [timeLeft,        setTimeLeft]        = useState(CHALLENGE_TIME)
  const [lives,           setLives]           = useState(3)
  const [challengeResult, setChallengeResult] = useState(null)
  const [gameOver,        setGameOver]        = useState(false)
  const [allDone,         setAllDone]         = useState(false)

  // Loading states
  const [generatingChallenges, setGeneratingChallenges] = useState(false)
  const [generatedCount,       setGeneratedCount]       = useState(0)
  const [checkingAnswer,       setCheckingAnswer]       = useState(false)
  const [llmError,             setLlmError]             = useState(null)

  // Drag state
  const [draggingId, setDraggingId] = useState(null)
  const [insertAt,   setInsertAt]   = useState(null)
  const [ghostStyle, setGhostStyle] = useState(null)

  const dragRef    = useRef(null)
  const insertRef  = useRef(null)
  const didDragRef = useRef(false)
  const sentRef    = useRef(sentence)
  const chipsRef   = useRef(null)
  const tapTimers  = useRef({})

  useEffect(() => { sentRef.current = sentence }, [sentence])

  // ── Challenge timer ────────────────────────────────────────────────────

  useEffect(() => {
    if (mode !== 'challenge' || gameOver || allDone || challengeResult?.valid || generatingChallenges || checkingAnswer) return
    if (challenges.length === 0) return
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
      return () => clearTimeout(t)
    }
    // Time's up
    const newLives = lives - 1
    if (newLives <= 0) { setLives(0); setGameOver(true); return }
    setLives(newLives)
    advanceChallenge()
  }, [mode, timeLeft, lives, challengeIdx, challenges, gameOver, allDone, challengeResult, generatingChallenges, checkingAnswer])

  function advanceChallenge() {
    const nextIdx = challengeIdx + 1
    if (nextIdx >= challenges.length) { setAllDone(true); return }
    setChallengeIdx(nextIdx)
    setTimeLeft(CHALLENGE_TIME)
    setSentence([])
    setChallengeResult(null)
  }

  // ── Mode helpers ───────────────────────────────────────────────────────

  async function enterChallenge() {
    setMode('challenge')
    setChallengeIdx(0)
    setTimeLeft(CHALLENGE_TIME)
    setLives(3)
    setGameOver(false)
    setAllDone(false)
    setSentence([])
    setCheckResult(null)
    setChallengeResult(null)
    setChallenges([])
    setLlmError(null)
    setGeneratedCount(0)
    setGeneratingChallenges(true)

    try {
      const picked = await generateGameChallenges((done, total) => {
        setGeneratedCount(done)
      })
      setChallenges(picked)
    } catch (err) {
      setLlmError(err.message)
    } finally {
      setGeneratingChallenges(false)
    }
  }

  function enterFree() {
    setMode('free')
    setSentence([])
    setCheckResult(null)
    setChallengeResult(null)
    setLlmError(null)
  }

  // ── Word selection ─────────────────────────────────────────────────────

  function handleSelect(opt) {
    setSentence(prev => [...prev, { ...opt, id: `${opt.word}-${Date.now()}` }])
    setCheckResult(null)
    setChallengeResult(null)
  }

  // ── Tap: speak (single) / remove (double) ─────────────────────────────

  function handleChipTap(chip) {
    if (didDragRef.current) return
    if (tapTimers.current[chip.id]) {
      clearTimeout(tapTimers.current[chip.id])
      delete tapTimers.current[chip.id]
      setSentence(prev => prev.filter(c => c.id !== chip.id))
      setCheckResult(null)
      setChallengeResult(null)
    } else {
      tapTimers.current[chip.id] = setTimeout(() => {
        delete tapTimers.current[chip.id]
        speak(chip.kana)
      }, 280)
    }
  }

  // ── Drag ───────────────────────────────────────────────────────────────

  function getInsertIdx(clientX, clientY, dragId) {
    if (!chipsRef.current) return null
    const els = Array.from(chipsRef.current.querySelectorAll('[data-chip-id]'))
    for (const el of els) {
      if (el.dataset.chipId === dragId) continue
      const r = el.getBoundingClientRect()
      if (Math.abs(clientY - (r.top + r.height / 2)) < r.height * 0.75) {
        const sentIdx = sentRef.current.findIndex(c => c.id === el.dataset.chipId)
        return clientX < r.left + r.width / 2 ? sentIdx : sentIdx + 1
      }
    }
    return null
  }

  function onPointerMove(e) {
    if (!dragRef.current) return
    const { offsetX, offsetY, startX, startY } = dragRef.current
    if (!didDragRef.current) {
      if (Math.abs(e.clientX - startX) < 6 && Math.abs(e.clientY - startY) < 6) return
      didDragRef.current = true
      setDraggingId(dragRef.current.id)
    }
    setGhostStyle(prev => prev ? { ...prev, left: e.clientX - offsetX, top: e.clientY - offsetY } : prev)
    const idx = getInsertIdx(e.clientX, e.clientY, dragRef.current.id)
    insertRef.current = idx
    setInsertAt(idx)
  }

  function onPointerUp() {
    if (!dragRef.current) return
    const { id } = dragRef.current
    if (didDragRef.current && insertRef.current !== null) {
      setSentence(prev => {
        const from = prev.findIndex(c => c.id === id)
        if (from === -1) return prev
        const next = [...prev]
        const [chip] = next.splice(from, 1)
        let to = insertRef.current
        if (to > from) to--
        next.splice(to, 0, chip)
        return next
      })
      setCheckResult(null)
      setChallengeResult(null)
    }
    dragRef.current   = null
    insertRef.current = null
    setTimeout(() => { didDragRef.current = false }, 0)
    setDraggingId(null)
    setInsertAt(null)
    setGhostStyle(null)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup',   onPointerUp)
  }

  function handleChipPointerDown(e, chip) {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    dragRef.current = {
      id:      chip.id,
      startX:  e.clientX,
      startY:  e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    didDragRef.current = false
    setGhostStyle({ left: rect.left, top: rect.top, width: rect.width })
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup',   onPointerUp)
  }

  // ── Actions ────────────────────────────────────────────────────────────

  async function handleCheck() {
    if (mode === 'challenge') {
      const userKana = sentence.map(c => c.kana).join('')
      setCheckingAnswer(true)
      try {
        const result = await checkAnswer(challenges[challengeIdx].en, userKana)
        setChallengeResult(result)
        if (result?.valid) {
          playCorrectSound()
          setTimeout(() => advanceChallenge(), 1800)
        } else {
          playWrongSound()
          const newLives = lives - 1
          setLives(newLives)
          if (newLives <= 0) setGameOver(true)
        }
      } catch (err) {
        setLlmError(err.message)
      } finally {
        setCheckingAnswer(false)
      }
    } else {
      const result = validateSentence(sentence)
      setCheckResult(result)
      if (result?.valid) playCorrectSound()
      else               playWrongSound()
    }
  }

  function handleSpeak() {
    const text = sentence.map(c => c.kana).join('')
    if (text) speak(text)
  }

  function handleCopy() {
    const text = sentence.map(c => c.word).join('') + '。'
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const hasChips       = sentence.length > 0
  const draggingChip   = draggingId ? sentence.find(c => c.id === draggingId) : null
  const inChallenge    = mode === 'challenge'
  const timerPct       = (timeLeft / CHALLENGE_TIME) * 100
  const timerUrgent    = timeLeft <= 20
  const currentChallenge = challenges[challengeIdx]

  return (
    <div className="sb-screen">

      {/* ── Mode tabs ────────────────────────────────────────────────── */}
      <div className="sb-mode-tabs">
        <button className={`sb-tab${mode === 'free' ? ' sb-tab--active' : ''}`} onClick={enterFree}>
          Free Build
        </button>
        <button className={`sb-tab${mode === 'challenge' ? ' sb-tab--active' : ''}`} onClick={enterChallenge} disabled={generatingChallenges}>
          Challenge
        </button>
      </div>

      {/* ── LLM error ────────────────────────────────────────────────── */}
      {llmError && (
        <div className="sb-error">
          <strong>Error:</strong> {llmError}
          <button className="sb-error__dismiss" onClick={() => setLlmError(null)}>✕</button>
        </div>
      )}

      {/* ── Generating challenges loader ─────────────────────────────── */}
      {inChallenge && generatingChallenges && (
        <div className="sb-loading-card">
          <Loader size={22} className="sb-loading-card__spinner" aria-hidden="true" />
          <p className="sb-loading-card__text">
            Generating challenges… {generatedCount}/{CHALLENGES_PER_GAME}
          </p>
        </div>
      )}

      {/* ── Challenge prompt card (post-it) ──────────────────────────── */}
      {inChallenge && !generatingChallenges && !gameOver && !allDone && currentChallenge && (
        <div className="sb-prompt-card">
          <span className="sb-tape" aria-hidden="true" />
          <div className="sb-halftone" aria-hidden="true" />
          <span className="sb-challenge-num">{challengeIdx + 1} / {challenges.length}</span>
          <p className="sb-challenge-en">{currentChallenge.en}</p>
        </div>
      )}

      {/* ── Timer + lives ─────────────────────────────────────────────── */}
      {inChallenge && !generatingChallenges && !gameOver && !allDone && (
        <div className="sb-status-row">
          <div className="sb-lives" aria-label={`${lives} lives remaining`}>
            {[0, 1, 2].map(i => (
              <span key={i} className={`sb-heart${i < lives ? '' : ' sb-heart--lost'}`} aria-hidden="true">♥</span>
            ))}
          </div>
          <div
            className="sb-timer-track"
            role="progressbar"
            aria-valuenow={timeLeft}
            aria-valuemin={0}
            aria-valuemax={CHALLENGE_TIME}
            aria-label="Time remaining"
          >
            <div
              className={`sb-timer-fill${timerUrgent ? ' sb-timer-fill--urgent' : ''}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
          <span className="sb-timer-num">{timeLeft}s</span>
        </div>
      )}

      {/* ── Game over ─────────────────────────────────────────────────── */}
      {inChallenge && gameOver && (
        <div className="sb-overlay">
          <p className="sb-overlay__title">Game Over</p>
          <p className="sb-overlay__sub">No lives remaining</p>
          <button className="sb-btn sb-btn--check" onClick={enterChallenge}>Try Again</button>
        </div>
      )}

      {/* ── All done ──────────────────────────────────────────────────── */}
      {inChallenge && allDone && (
        <div className="sb-overlay">
          <p className="sb-overlay__title">All Done!</p>
          <p className="sb-overlay__sub">You completed all {challenges.length} challenges</p>
          <button className="sb-btn sb-btn--check" onClick={enterChallenge}>Play Again</button>
        </div>
      )}

      {/* ── Dropdown ─────────────────────────────────────────────────── */}
      {!(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <WordDropdown onSelect={handleSelect} />
      )}

      {/* ── Sentence area ────────────────────────────────────────────── */}
      {!(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <div className="sb-sentence-area">
          {hasChips && (
            <div className="sb-chips" ref={chipsRef}>
              {sentence.map((chip, i) => (
                <div key={chip.id} className="sb-chip-slot">
                  {insertAt === i && <div className="sb-insert-bar" />}
                  <Chip
                    chip={chip}
                    isDragging={chip.id === draggingId}
                    onPointerDown={e => handleChipPointerDown(e, chip)}
                    onTap={() => handleChipTap(chip)}
                  />
                </div>
              ))}
              {insertAt === sentence.length && <div className="sb-insert-bar" />}
              <span className="sb-maru">。</span>
            </div>
          )}
        </div>
      )}

      {/* ── Romaji block ──────────────────────────────────────────────── */}
      {hasChips && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <p className="sb-romaji-line">
          {sentence.map(c => kanaToRomaji(c.kana)).join(' ')}。
        </p>
      )}

      {/* ── Validation result ─────────────────────────────────────────── */}
      {inChallenge ? (
        challengeResult && (
          <div className={`sb-result ${challengeResult.valid ? 'sb-result--ok' : 'sb-result--bad'}`}>
            <p className="sb-result__title">{challengeResult.valid ? 'Correct!' : 'Not quite'}</p>
            {challengeResult.feedback && (
              <p className="sb-result__row">{challengeResult.feedback}</p>
            )}
          </div>
        )
      ) : (
        checkResult && (
          <div className={`sb-result ${checkResult.valid ? 'sb-result--ok' : 'sb-result--bad'}`}>
            <p className="sb-result__title">
              {checkResult.valid ? 'Looks correct!' : 'A few things to check:'}
            </p>
            {checkResult.issues.map((m, i) => <p key={i} className="sb-result__row">✗ {m}</p>)}
            {checkResult.passes.map((m, i) => <p key={i} className="sb-result__row sb-result__row--pass">✓ {m}</p>)}
          </div>
        )
      )}

      {/* ── Actions ──────────────────────────────────────────────────── */}
      {!(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <div className="sb-actions">
          <button
            className="sb-btn sb-btn--check"
            onClick={handleCheck}
            disabled={!hasChips || checkingAnswer}
          >
            {checkingAnswer
              ? <Loader size={18} className="sb-loading-card__spinner" aria-hidden="true" />
              : 'Check'
            }
          </button>
          <button className="sb-btn sb-btn--icon" onClick={handleSpeak} disabled={!hasChips} aria-label="Speak all">
            <Volume2 size={18} aria-hidden="true" />
          </button>
          <button
            className={`sb-btn sb-btn--icon${copied ? ' sb-btn--copied' : ''}`}
            onClick={handleCopy} disabled={!hasChips} aria-label={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          </button>
        </div>
      )}

      {/* ── Drag ghost ────────────────────────────────────────────────── */}
      {ghostStyle && draggingChip && didDragRef.current && (
        <div className="sb-chip sb-chip--ghost" style={ghostStyle} aria-hidden="true">
          <span className="sb-chip__word">{draggingChip.word}</span>
          {draggingChip.word !== draggingChip.kana && (
            <span className="sb-chip__kana">{draggingChip.kana}</span>
          )}
        </div>
      )}

    </div>
  )
}
