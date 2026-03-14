import { useState, useRef, useEffect } from 'react'
import {
  Volume2, Copy, Check, ChevronRight, ChevronLeft, Loader,
  Sparkles, User, Users, MapPin, Utensils, PawPrint, Home,
  Shirt, Heart, Leaf, Train, Clock, Wind, BookOpen,
  Zap, Smile,
} from 'lucide-react'
import { VOCAB_LIST, ADJ_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'
import { speak } from '../utils/speech'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import {
  generateVerbChallenges,
  checkAnswer,
  checkFreeSentence,
  VERB_CHALLENGES_PER_GAME,
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
  { id: 'particles',    Icon: Sparkles, label: 'Particles',        opts: PARTICLES },
  { id: 'pronouns',     Icon: User,     label: 'Pronouns',          opts: fromVocab(w => w.type === 'pronoun', 'pronoun') },
  { id: 'people',       Icon: Users,    label: 'Nouns — People',    opts: fromVocab(w => w.type === 'noun' && w.theme === 'people') },
  { id: 'places',       Icon: MapPin,   label: 'Nouns — Places',    opts: fromVocab(w => w.type === 'noun' && w.theme === 'places') },
  { id: 'food',         Icon: Utensils, label: 'Nouns — Food',      opts: fromVocab(w => w.type === 'noun' && w.theme === 'food') },
  { id: 'animals',      Icon: PawPrint, label: 'Nouns — Animals',   opts: fromVocab(w => w.type === 'noun' && w.theme === 'animal') },
  { id: 'home',         Icon: Home,     label: 'Nouns — Home',      opts: fromVocab(w => w.type === 'noun' && w.theme === 'home') },
  { id: 'clothing',     Icon: Shirt,    label: 'Nouns — Clothing',  opts: fromVocab(w => w.type === 'noun' && w.theme === 'clothing') },
  { id: 'body',         Icon: Heart,    label: 'Nouns — Body',      opts: fromVocab(w => w.type === 'noun' && w.theme === 'body') },
  { id: 'nature',       Icon: Leaf,     label: 'Nouns — Nature',    opts: fromVocab(w => w.type === 'noun' && w.theme === 'nature') },
  { id: 'transport',    Icon: Train,    label: 'Nouns — Transport', opts: fromVocab(w => w.type === 'noun' && w.theme === 'transport') },
  { id: 'time',         Icon: Clock,    label: 'Time',              opts: fromVocab(w => w.type === 'noun' && (w.theme === 'time' || w.theme === 'calendar'), 'time') },
  { id: 'adverbs',      Icon: Wind,     label: 'Adverbs',           opts: fromVocab(w => w.type === 'adverb', 'adverb') },
  {
    id: 'verbs_polite', Icon: BookOpen, label: 'Verbs — Polite',
    opts: VERB_LIST.flatMap(v => [
      { word: v.polite.present_pos.word, kana: v.polite.present_pos.kana, meaning: `${v.meaning} · pres +`, type: 'verb' },
      { word: v.polite.present_neg.word, kana: v.polite.present_neg.kana, meaning: `${v.meaning} · pres −`, type: 'verb' },
      { word: v.polite.past_pos.word,    kana: v.polite.past_pos.kana,    meaning: `${v.meaning} · past +`, type: 'verb' },
      { word: v.polite.past_neg.word,    kana: v.polite.past_neg.kana,    meaning: `${v.meaning} · past −`, type: 'verb' },
    ]),
  },
  {
    id: 'verbs_casual', Icon: Zap,      label: 'Verbs — Casual',
    opts: VERB_LIST.flatMap(v => [
      { word: v.casual.present_pos.word, kana: v.casual.present_pos.kana, meaning: `${v.meaning} · pres +`, type: 'verb' },
      { word: v.casual.present_neg.word, kana: v.casual.present_neg.kana, meaning: `${v.meaning} · pres −`, type: 'verb' },
      { word: v.casual.past_pos.word,    kana: v.casual.past_pos.kana,    meaning: `${v.meaning} · past +`, type: 'verb' },
      { word: v.casual.past_neg.word,    kana: v.casual.past_neg.kana,    meaning: `${v.meaning} · past −`, type: 'verb' },
    ]),
  },
  {
    id: 'adjectives',   Icon: Smile,    label: 'Adjectives',
    opts: ADJ_LIST.flatMap(a => [
      { word: a.polite.present_pos.word, kana: a.polite.present_pos.kana, meaning: `${a.meaning} · pres +`, type: 'adj' },
      { word: a.polite.present_neg.word, kana: a.polite.present_neg.kana, meaning: `${a.meaning} · pres −`, type: 'adj' },
    ]),
  },
]

// ─── Tense badge helpers ────────────────────────────────────────────────────

const TENSE_SET = new Set(['pres +', 'pres −', 'past +', 'past −'])
const TENSE_CLASS = { 'pres +': 'pres-pos', 'pres −': 'pres-neg', 'past +': 'past-pos', 'past −': 'past-neg' }

// ─── Two-step dropdown ─────────────────────────────────────────────────────

function WordDropdown({ onSelect, showEnglish }) {
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
    speak(opt.kana)
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
              {category.opts.map((opt, i) => {
                const parts = opt.meaning.split(' · ')
                const lastPart = parts[parts.length - 1]
                const tenseSuffix = TENSE_SET.has(lastPart) ? lastPart : null
                const baseMeaning = tenseSuffix ? parts.slice(0, -1).join(' · ') : opt.meaning
                return (
                  <button key={i} className="sb-dropdown__item" onClick={() => pickWord(opt)}>
                    <div className="sb-dropdown__item-inner">
                      <div className="sb-dropdown__item-header">
                        <span className="sb-dropdown__item-word">{opt.word}</span>
                        {tenseSuffix && (
                          <span className={`sb-tense-badge sb-tense-badge--${TENSE_CLASS[tenseSuffix]}`}>
                            {tenseSuffix}
                          </span>
                        )}
                      </div>
                      <span className="sb-dropdown__item-meta">
                        {opt.kana !== opt.word && <>{opt.kana}<span className="sb-dropdown__sep"> · </span></>}
                        {kanaToRomaji(opt.kana)}
                        {showEnglish && baseMeaning && <><span className="sb-dropdown__sep"> · </span>{baseMeaning}</>}
                      </span>
                    </div>
                  </button>
                )
              })}
            </>
          ) : (
            CATEGORIES.map(cat => (
              <button key={cat.id} className="sb-dropdown__cat" onClick={() => setCategory(cat)}>
                <cat.Icon size={16} className="sb-dropdown__cat-icon" aria-hidden="true" />
                <span>{cat.label}</span>
                <ChevronRight size={14} className="sb-dropdown__cat-chevron" aria-hidden="true" />
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
      className={`sb-chip${chip.type ? ` sb-chip--${chip.type}` : ''}${isDragging ? ' sb-chip--dragging' : ''}`}
      onPointerDown={onPointerDown}
      onClick={onTap}
      data-chip-id={chip.id}
    >
      <span className="sb-chip__word">{chip.word}</span>
      <span className="sb-chip__kana" style={chip.word === chip.kana ? { visibility: 'hidden' } : undefined}>
        {chip.kana}
      </span>
    </div>
  )
}

// ─── Verb picker modal ─────────────────────────────────────────────────────

function VerbPickerModal({ onSelect, onClose }) {
  return (
    <div className="vp-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="vp-modal">
        <div className="vp-header">
          <h2 className="vp-header__title">Pick a verb to practise</h2>
          <button className="vp-header__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="vp-list">
          {VERB_LIST.map(verb => (
            <button key={verb.kana} className="vp-verb-btn" onClick={() => onSelect(verb)}>
              <span className="vp-verb-btn__dict">{verb.dict}</span>
              <span className="vp-verb-btn__kana">{verb.kana}</span>
              <span className="vp-verb-btn__meaning">{verb.meaning}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Challenge word tray (curated tiles for challenge mode) ─────────────────

function ChallengeWordTray({ wordPool, onSelect, showEnglish }) {
  function pickWord(opt) {
    speak(opt.kana)
    onSelect(opt)
  }
  return (
    <div className="sb-word-tray">
      {wordPool.map((opt, i) => (
        <button
          key={i}
          className={`sb-word-tile sb-word-tile--${opt.type}`}
          onClick={() => pickWord(opt)}
        >
          <span className="sb-word-tile__word">{opt.word}</span>
          {opt.word !== opt.kana && (
            <span className="sb-word-tile__kana">{opt.kana}</span>
          )}
          {showEnglish && opt.meaning && (
            <span className="sb-word-tile__meaning">{opt.meaning}</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────

const CHALLENGE_TIME = 120

export default function SentenceBuilderScreen() {
  const [sentence,    setSentence]    = useState([])
  const [checkResult, setCheckResult] = useState(null)
  const [copied,      setCopied]      = useState(false)
  const [showEnglish, setShowEnglish] = useState(false)
  const [showHint,    setShowHint]    = useState(false)

  // Challenge mode
  const [mode,            setMode]            = useState('free')
  const [selectedVerb,    setSelectedVerb]    = useState(null)
  const [verbPickerOpen,  setVerbPickerOpen]  = useState(false)
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
    setShowHint(false)
  }

  // ── Mode helpers ───────────────────────────────────────────────────────

  function enterChallenge() {
    setMode('challenge')
    setSentence([])
    setCheckResult(null)
    setChallengeResult(null)
    setLlmError(null)
    setGameOver(false)
    setAllDone(false)
    setChallenges([])
    setVerbPickerOpen(true)
  }

  async function startVerbChallenge(verb) {
    setVerbPickerOpen(false)
    setSelectedVerb(verb)
    setChallengeIdx(0)
    setTimeLeft(CHALLENGE_TIME)
    setLives(3)
    setGameOver(false)
    setAllDone(false)
    setSentence([])
    setChallengeResult(null)
    setChallenges([])
    setLlmError(null)
    setGeneratedCount(0)
    setGeneratingChallenges(true)

    try {
      const picked = await generateVerbChallenges(verb, (done) => {
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
    setCheckingAnswer(true)
    try {
      if (mode === 'challenge') {
        const userKana = sentence.map(c => c.kana).join('')
        const result = await checkAnswer(challenges[challengeIdx].en, userKana)
        setChallengeResult(result)
        if (result?.valid) {
          playCorrectSound()
        } else {
          playWrongSound()
          const newLives = lives - 1
          setLives(newLives)
          if (newLives <= 0) setGameOver(true)
        }
      } else {
        const result = await checkFreeSentence(sentence)
        setCheckResult(result)
        if (result?.valid) playCorrectSound()
        else               playWrongSound()
      }
    } catch (err) {
      setLlmError(err.message)
    } finally {
      setCheckingAnswer(false)
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

  const hasChips         = sentence.length > 0
  const draggingChip     = draggingId ? sentence.find(c => c.id === draggingId) : null
  const inChallenge      = mode === 'challenge'
  const timerPct         = (timeLeft / CHALLENGE_TIME) * 100
  const timerUrgent      = timeLeft <= 30
  const currentChallenge = challenges[challengeIdx]
  const challengeActive  = inChallenge && !verbPickerOpen && !generatingChallenges && !gameOver && !allDone

  return (
    <div className="sb-screen">

      {/* ── Verb picker modal (challenge mode entry) ──────────────────── */}
      {verbPickerOpen && (
        <VerbPickerModal
          onSelect={startVerbChallenge}
          onClose={() => { setVerbPickerOpen(false); setMode('free') }}
        />
      )}

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
            Building challenges for {selectedVerb?.dict}… {generatedCount}/{VERB_CHALLENGES_PER_GAME}
          </p>
        </div>
      )}

      {/* ── Challenge prompt card (post-it) ──────────────────────────── */}
      {challengeActive && currentChallenge && (
        <div className="sb-prompt-card">
          <span className="sb-tape" aria-hidden="true" />
          <div className="sb-halftone" aria-hidden="true" />
          <div className="sb-challenge-header">
            <span className="sb-challenge-num">{challengeIdx + 1} / {challenges.length}</span>
            {selectedVerb && (
              <span className="sb-challenge-tag">{selectedVerb.dict}</span>
            )}
            <span className={`sb-tense-badge sb-tense-badge--${currentChallenge.tenseClass}`}>
              {currentChallenge.formLabel}
            </span>
            <button
              className="sb-hint-btn"
              onClick={() => setShowHint(v => !v)}
              aria-label={showHint ? 'Hide hint' : 'Show hint'}
            >
              ?
            </button>
          </div>
          <p className="sb-challenge-en">{currentChallenge.en}</p>
          {showHint && (
            <p className="sb-challenge-hint">
              Verb: {currentChallenge.verbWord}（{currentChallenge.verbKana}）
            </p>
          )}
        </div>
      )}

      {/* ── Timer + lives ─────────────────────────────────────────────── */}
      {challengeActive && (
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
      {inChallenge && !verbPickerOpen && gameOver && (
        <div className="sb-overlay">
          <p className="sb-overlay__title">Game Over</p>
          <p className="sb-overlay__sub">No lives remaining</p>
          <button className="sb-btn sb-btn--check" onClick={enterChallenge}>Try Again</button>
        </div>
      )}

      {/* ── All done ──────────────────────────────────────────────────── */}
      {inChallenge && !verbPickerOpen && allDone && (
        <div className="sb-overlay">
          <p className="sb-overlay__title">All Done!</p>
          <p className="sb-overlay__sub">You completed all {challenges.length} challenges for {selectedVerb?.dict}</p>
          <button className="sb-btn sb-btn--check" onClick={enterChallenge}>Play Again</button>
        </div>
      )}

      {/* ── Word selector ────────────────────────────────────────────── */}
      {/* Free mode: full hierarchical dropdown. Challenge: curated word tray. */}
      {!verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        inChallenge
          ? <ChallengeWordTray
              wordPool={currentChallenge?.wordPool ?? []}
              onSelect={handleSelect}
              showEnglish={showEnglish}
            />
          : <WordDropdown onSelect={handleSelect} showEnglish={showEnglish} />
      )}

      {/* ── Sentence area ────────────────────────────────────────────── */}
      {!verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
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
      {hasChips && !verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
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
            {!challengeResult.valid && challengeResult.correct && (
              <p className="sb-result__row sb-result__row--correct">
                <span className="sb-result__correct-label">Correct: </span>
                <span className="sb-result__correct-kana">{challengeResult.correct}</span>
              </p>
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
      {!verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <div className="sb-actions">
          {inChallenge && challengeResult && !gameOver ? (
            <button className="sb-btn sb-btn--check" onClick={advanceChallenge}>
              Next →
            </button>
          ) : (
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
          )}
          <button
            className={`sb-btn sb-btn--english${showEnglish ? ' sb-btn--english-on' : ''}`}
            onClick={() => setShowEnglish(v => !v)}
            aria-label={showEnglish ? 'Hide English' : 'Show English'}
          >
            EN
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
        <div className={`sb-chip sb-chip--ghost${draggingChip.type ? ` sb-chip--${draggingChip.type}` : ''}`} style={ghostStyle} aria-hidden="true">
          <span className="sb-chip__word">{draggingChip.word}</span>
          {draggingChip.word !== draggingChip.kana && (
            <span className="sb-chip__kana">{draggingChip.kana}</span>
          )}
        </div>
      )}

    </div>
  )
}
