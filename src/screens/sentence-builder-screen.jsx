import { useState, useEffect, useRef } from 'react'
import {
  Loader, Volume2, Copy, Check, ChevronRight, ChevronDown,
  Sparkles, User, Users, MapPin, Utensils, PawPrint, Home,
  Shirt, Heart, Leaf, Train, Clock, Wind, BookOpen, Zap, Smile,
} from 'lucide-react'
import { VOCAB_LIST, ADJ_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import { speak } from '../utils/speech'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import {
  generateVerbChallenges,
  checkAnswer,
  VERB_CHALLENGES_PER_GAME,
} from '../utils/llmChallenge'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { Card, CardContent } from '../components/ui/card'
import { cn } from '../lib/utils'

// ─── Constants ────────────────────────────────────────────────────

const CHALLENGE_TIME = 120

// ─── Category Data ────────────────────────────────────────────────

const PARTICLES = [
  { word: 'は', kana: 'は', meaning: 'topic', type: 'particle' },
  { word: 'が', kana: 'が', meaning: 'subject', type: 'particle' },
  { word: 'を', kana: 'を', meaning: 'object', type: 'particle' },
  { word: 'に', kana: 'に', meaning: 'direction / time', type: 'particle' },
  { word: 'で', kana: 'で', meaning: 'location / means', type: 'particle' },
  { word: 'へ', kana: 'へ', meaning: 'direction', type: 'particle' },
  { word: 'と', kana: 'と', meaning: 'and / with', type: 'particle' },
  { word: 'の', kana: 'の', meaning: 'possession', type: 'particle' },
  { word: 'も', kana: 'も', meaning: 'also / too', type: 'particle' },
  { word: 'か', kana: 'か', meaning: 'question marker', type: 'particle' },
  { word: 'ね', kana: 'ね', meaning: "isn't it / right?", type: 'particle' },
  { word: 'よ', kana: 'よ', meaning: 'emphasis / assertion', type: 'particle' },
  { word: 'から', kana: 'から', meaning: 'from / because', type: 'particle' },
  { word: 'まで', kana: 'まで', meaning: 'until / up to', type: 'particle' },
  { word: 'だ', kana: 'だ', meaning: 'copula (casual)', type: 'particle' },
  { word: 'です', kana: 'です', meaning: 'copula (polite)', type: 'particle' },
]

function fromVocab(filter, type) {
  return VOCAB_LIST.filter(filter).map((w) => ({
    word: w.word,
    kana: w.kana,
    meaning: w.meaning,
    type: type ?? 'noun',
  }))
}

const WORD_CATEGORIES = [
  { id: 'particles', Icon: Sparkles, label: 'Particles', words: PARTICLES },
  { id: 'pronouns', Icon: User, label: 'Pronouns', words: fromVocab((w) => w.type === 'pronoun', 'pronoun') },
  { id: 'people', Icon: Users, label: 'Nouns — People', words: fromVocab((w) => w.type === 'noun' && w.theme === 'people') },
  { id: 'places', Icon: MapPin, label: 'Nouns — Places', words: fromVocab((w) => w.type === 'noun' && w.theme === 'places') },
  { id: 'food', Icon: Utensils, label: 'Nouns — Food', words: fromVocab((w) => w.type === 'noun' && w.theme === 'food') },
  { id: 'animals', Icon: PawPrint, label: 'Nouns — Animals', words: fromVocab((w) => w.type === 'noun' && w.theme === 'animal') },
  { id: 'home', Icon: Home, label: 'Nouns — Home', words: fromVocab((w) => w.type === 'noun' && w.theme === 'home') },
  { id: 'clothing', Icon: Shirt, label: 'Nouns — Clothing', words: fromVocab((w) => w.type === 'noun' && w.theme === 'clothing') },
  { id: 'body', Icon: Heart, label: 'Nouns — Body', words: fromVocab((w) => w.type === 'noun' && w.theme === 'body') },
  { id: 'nature', Icon: Leaf, label: 'Nouns — Nature', words: fromVocab((w) => w.type === 'noun' && w.theme === 'nature') },
  { id: 'transport', Icon: Train, label: 'Nouns — Transport', words: fromVocab((w) => w.type === 'noun' && w.theme === 'transport') },
  { id: 'time', Icon: Clock, label: 'Time', words: fromVocab((w) => w.type === 'noun' && (w.theme === 'time' || w.theme === 'calendar'), 'time') },
  { id: 'adverbs', Icon: Wind, label: 'Adverbs', words: fromVocab((w) => w.type === 'adverb', 'adverb') },
  {
    id: 'verbs_polite',
    Icon: BookOpen,
    label: 'Verbs — Polite',
    words: VERB_LIST.flatMap((v) => [
      { word: v.polite.present_pos.word, kana: v.polite.present_pos.kana, meaning: `${v.meaning} · pres +`, type: 'verb' },
      { word: v.polite.present_neg.word, kana: v.polite.present_neg.kana, meaning: `${v.meaning} · pres −`, type: 'verb' },
      { word: v.polite.past_pos.word, kana: v.polite.past_pos.kana, meaning: `${v.meaning} · past +`, type: 'verb' },
      { word: v.polite.past_neg.word, kana: v.polite.past_neg.kana, meaning: `${v.meaning} · past −`, type: 'verb' },
    ]),
  },
  {
    id: 'verbs_casual',
    Icon: Zap,
    label: 'Verbs — Casual',
    words: VERB_LIST.flatMap((v) => [
      { word: v.casual.present_pos.word, kana: v.casual.present_pos.kana, meaning: `${v.meaning} · pres +`, type: 'verb' },
      { word: v.casual.present_neg.word, kana: v.casual.present_neg.kana, meaning: `${v.meaning} · pres −`, type: 'verb' },
      { word: v.casual.past_pos.word, kana: v.casual.past_pos.kana, meaning: `${v.meaning} · past +`, type: 'verb' },
      { word: v.casual.past_neg.word, kana: v.casual.past_neg.kana, meaning: `${v.meaning} · past −`, type: 'verb' },
    ]),
  },
  {
    id: 'adjectives',
    Icon: Smile,
    label: 'Adjectives',
    words: ADJ_LIST.flatMap((a) => [
      { word: a.polite.present_pos.word, kana: a.polite.present_pos.kana, meaning: `${a.meaning} · pres +`, type: 'adj' },
      { word: a.polite.present_neg.word, kana: a.polite.present_neg.kana, meaning: `${a.meaning} · pres −`, type: 'adj' },
    ]),
  },
]

// ─── Grammar Validation ───────────────────────────────────────────

function validateSentence(chips) {
  if (chips.length === 0) return null
  const issues = []
  const passes = []
  const lastPredIdx = chips.findLastIndex((c) => c.type === 'verb' || c.type === 'adj')

  if (lastPredIdx === -1) {
    return {
      valid: false,
      issues: ['Add a verb or adjective to complete the sentence.'],
      passes: [],
    }
  }
  if (lastPredIdx === chips.length - 1) {
    passes.push('Predicate at the end — correct Japanese word order!')
  } else {
    issues.push('In Japanese, the verb or adjective comes at the end.')
  }

  const topicIdx = chips.findIndex((c) => c.word === 'は')
  if (topicIdx !== -1 && topicIdx > 0 && chips[topicIdx - 1].type === 'noun') {
    passes.push(`Good use of topic marker は after "${chips[topicIdx - 1].word}"`)
  }

  const hasSubject = chips.some((c) => c.word === 'が')
  if (hasSubject) passes.push('Subject marker が found')

  const hasObject = chips.some((c) => c.word === 'を')
  if (hasObject) passes.push('Object marker を found')

  return { valid: issues.length === 0, issues, passes }
}

// ─── Components ───────────────────────────────────────────────────

function WordDropdown({ onSelect, showEnglish }) {
  const [open, setOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(null)

  function pickWord(opt) {
    speak(opt.kana)
    onSelect(opt)
    setCatOpen(null)
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outlined"
        fullWidth
        onClick={() => setOpen(!open)}
        className="justify-between"
      >
        <span>Add a word</span>
        <ChevronDown className={cn('transition-transform', open && 'rotate-180')} size={18} />
      </Button>

      {open && (
        <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto bg-surface rounded-xl shadow-md3-3 z-10">
          {WORD_CATEGORIES.map((cat) => (
            <div key={cat.id} className="border-b border-outline-variant last:border-0">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors"
                onClick={() => setCatOpen(catOpen === cat.id ? null : cat.id)}
              >
                <div className="flex items-center gap-3">
                  <cat.Icon size={20} className="text-primary" />
                  <span className="text-body-large">{cat.label}</span>
                </div>
                <ChevronRight
                  size={16}
                  className={cn('transition-transform', catOpen === cat.id && 'rotate-90')}
                />
              </button>

              {catOpen === cat.id && (
                <div className="p-2 bg-surface-container-low space-y-1">
                  {cat.words.map((opt, i) => (
                    <button
                      key={i}
                      className="w-full p-3 text-left rounded-lg hover:bg-surface-container-high transition-colors"
                      onClick={() => pickWord(opt)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-body-large font-japanese">{opt.word}</span>
                        {opt.type && (
                          <Badge variant="secondary" size="sm">
                            {opt.type}
                          </Badge>
                        )}
                      </div>
                      {opt.word !== opt.kana && (
                        <div className="text-body-small text-muted-foreground">{opt.kana}</div>
                      )}
                      {showEnglish && opt.meaning && (
                        <div className="text-body-small text-muted-foreground">{opt.meaning}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Chip({ chip, isDragging, onPointerDown, onTap }) {
  return (
    <div
      className={cn(
        'px-3 py-2 bg-surface-container rounded-lg select-none cursor-move transition-all',
        'hover:bg-surface-container-high active:scale-95',
        isDragging && 'opacity-50'
      )}
      onPointerDown={onPointerDown}
      onClick={onTap}
      data-chip-id={chip.id}
    >
      <div className="text-body-large font-japanese">{chip.word}</div>
      {chip.word !== chip.kana && (
        <div className="text-label-small text-muted-foreground">{chip.kana}</div>
      )}
    </div>
  )
}

function VerbPickerModal({ onSelect, onClose }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Pick a verb to practice</DialogTitle>
          <DialogDescription>Build sentences using different conjugations</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 overflow-y-auto max-h-96">
          {VERB_LIST.map((verb) => (
            <button
              key={verb.kana}
              className="w-full p-4 text-left rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
              onClick={() => onSelect(verb)}
            >
              <div className="text-title-medium font-japanese">{verb.dict}</div>
              <div className="text-body-small text-muted-foreground">{verb.kana}</div>
              <div className="text-body-medium">{verb.meaning}</div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="text" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ChallengeWordTray({ wordPool, onSelect, showEnglish }) {
  function pickWord(opt) {
    speak(opt.kana)
    onSelect(opt)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4">
      {wordPool.map((opt, i) => (
        <button
          key={i}
          className="p-3 text-left rounded-xl bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all"
          onClick={() => pickWord(opt)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-body-large font-japanese">{opt.word}</span>
            {opt.type && (
              <Badge variant="secondary" size="sm">
                {opt.type}
              </Badge>
            )}
          </div>
          {opt.word !== opt.kana && (
            <div className="text-label-small text-muted-foreground">{opt.kana}</div>
          )}
          {showEnglish && opt.meaning && (
            <div className="text-body-small text-muted-foreground">{opt.meaning}</div>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function SentenceBuilderScreen() {
  const [sentence, setSentence] = useState([])
  const [checkResult, setCheckResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showEnglish, setShowEnglish] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Challenge mode
  const [mode, setMode] = useState('free')
  const [selectedVerb, setSelectedVerb] = useState(null)
  const [verbPickerOpen, setVerbPickerOpen] = useState(false)
  const [challenges, setChallenges] = useState([])
  const [challengeIdx, setChallengeIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_TIME)
  const [lives, setLives] = useState(3)
  const [challengeResult, setChallengeResult] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [allDone, setAllDone] = useState(false)

  // Loading states
  const [generatingChallenges, setGeneratingChallenges] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)
  const [checkingAnswer, setCheckingAnswer] = useState(false)
  const [llmError, setLlmError] = useState(null)

  // Drag state
  const [draggingId, setDraggingId] = useState(null)
  const [insertAt, setInsertAt] = useState(null)
  const [ghostStyle, setGhostStyle] = useState(null)

  const dragRef = useRef(null)
  const insertRef = useRef(null)
  const didDragRef = useRef(false)
  const sentRef = useRef(sentence)
  const chipsRef = useRef(null)
  const tapTimers = useRef({})

  useEffect(() => {
    sentRef.current = sentence
  }, [sentence])

  // Challenge timer
  useEffect(() => {
    if (
      mode !== 'challenge' ||
      gameOver ||
      allDone ||
      challengeResult?.valid ||
      generatingChallenges ||
      checkingAnswer
    )
      return
    if (challenges.length === 0) return
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000)
      return () => clearTimeout(t)
    }
    // Time's up
    const newLives = lives - 1
    if (newLives <= 0) {
      setLives(0)
      setGameOver(true)
      return
    }
    setLives(newLives)
    advanceChallenge()
  }, [mode, timeLeft, lives, challengeIdx, challenges, gameOver, allDone, challengeResult, generatingChallenges, checkingAnswer])

  function advanceChallenge() {
    const nextIdx = challengeIdx + 1
    if (nextIdx >= challenges.length) {
      setAllDone(true)
      return
    }
    setChallengeIdx(nextIdx)
    setTimeLeft(CHALLENGE_TIME)
    setSentence([])
    setChallengeResult(null)
    setShowHint(false)
  }

  // Mode helpers
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

  // Word selection
  function handleSelect(opt) {
    setSentence((prev) => [...prev, { ...opt, id: `${opt.word}-${Date.now()}` }])
    setCheckResult(null)
    setChallengeResult(null)
  }

  // Tap: speak (single) / remove (double)
  function handleChipTap(chip) {
    if (didDragRef.current) return
    if (tapTimers.current[chip.id]) {
      clearTimeout(tapTimers.current[chip.id])
      delete tapTimers.current[chip.id]
      setSentence((prev) => prev.filter((c) => c.id !== chip.id))
      setCheckResult(null)
      setChallengeResult(null)
    } else {
      tapTimers.current[chip.id] = setTimeout(() => {
        delete tapTimers.current[chip.id]
        speak(chip.kana)
      }, 280)
    }
  }

  // Drag
  function getInsertIdx(clientX, clientY, dragId) {
    if (!chipsRef.current) return null
    const els = Array.from(chipsRef.current.querySelectorAll('[data-chip-id]'))
    for (const el of els) {
      if (el.dataset.chipId === dragId) continue
      const r = el.getBoundingClientRect()
      if (Math.abs(clientY - (r.top + r.height / 2)) < r.height * 0.75) {
        const sentIdx = sentRef.current.findIndex((c) => c.id === el.dataset.chipId)
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
    setGhostStyle((prev) =>
      prev ? { ...prev, left: e.clientX - offsetX, top: e.clientY - offsetY } : prev
    )
    const idx = getInsertIdx(e.clientX, e.clientY, dragRef.current.id)
    insertRef.current = idx
    setInsertAt(idx)
  }

  function onPointerUp() {
    if (!dragRef.current) return
    const { id } = dragRef.current
    if (didDragRef.current && insertRef.current !== null) {
      setSentence((prev) => {
        const from = prev.findIndex((c) => c.id === id)
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
    dragRef.current = null
    insertRef.current = null
    setTimeout(() => {
      didDragRef.current = false
    }, 0)
    setDraggingId(null)
    setInsertAt(null)
    setGhostStyle(null)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  function handleChipPointerDown(e, chip) {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    dragRef.current = {
      id: chip.id,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    didDragRef.current = false
    setGhostStyle({ left: rect.left, top: rect.top, width: rect.width })
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  // Actions
  async function handleCheck() {
    if (mode === 'challenge') {
      const userKana = sentence.map((c) => c.kana).join('')
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
      else playWrongSound()
    }
  }

  function handleSpeak() {
    const text = sentence.map((c) => c.kana).join('')
    if (text) speak(text)
  }

  function handleCopy() {
    const text = sentence.map((c) => c.word).join('') + '。'
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const hasChips = sentence.length > 0
  const draggingChip = draggingId ? sentence.find((c) => c.id === draggingId) : null
  const inChallenge = mode === 'challenge'
  const timerPct = (timeLeft / CHALLENGE_TIME) * 100
  const timerUrgent = timeLeft <= 30
  const currentChallenge = challenges[challengeIdx]
  const challengeActive = inChallenge && !verbPickerOpen && !generatingChallenges && !gameOver && !allDone

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Verb Picker Modal */}
      {verbPickerOpen && (
        <VerbPickerModal
          onSelect={startVerbChallenge}
          onClose={() => {
            setVerbPickerOpen(false)
            setMode('free')
          }}
        />
      )}

      {/* Mode Tabs */}
      <div className="flex gap-2 p-4 border-b border-outline-variant">
        <Button
          variant={mode === 'free' ? 'filled' : 'text'}
          fullWidth
          onClick={enterFree}
        >
          Free Build
        </Button>
        <Button
          variant={mode === 'challenge' ? 'filled' : 'text'}
          fullWidth
          onClick={enterChallenge}
          disabled={generatingChallenges}
        >
          Challenge
        </Button>
      </div>

      {/* LLM Error */}
      {llmError && (
        <div className="m-4 p-4 bg-destructive/10 border border-destructive rounded-xl flex items-start justify-between">
          <div>
            <strong>Error:</strong> {llmError}
          </div>
          <button onClick={() => setLlmError(null)} className="text-destructive">
            ✕
          </button>
        </div>
      )}

      {/* Generating Challenges Loader */}
      {inChallenge && generatingChallenges && (
        <Card variant="filled" className="m-4">
          <CardContent className="pt-6 pb-6 text-center space-y-3">
            <Loader size={32} className="mx-auto animate-spin text-primary" />
            <p className="text-body-large">
              Building challenges for {selectedVerb?.dict}… {generatedCount}/{VERB_CHALLENGES_PER_GAME}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Challenge Prompt Card */}
      {challengeActive && currentChallenge && (
        <Card variant="filled" className="m-4 shadow-md3-2">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-label-medium text-muted-foreground">
                {challengeIdx + 1} / {challenges.length}
              </span>
              {selectedVerb && (
                <Badge variant="secondary">{selectedVerb.dict}</Badge>
              )}
              <Badge variant={currentChallenge.tenseClass === 'present' ? 'default' : 'secondary'}>
                {currentChallenge.formLabel}
              </Badge>
              <Button
                variant="text"
                size="icon"
                onClick={() => setShowHint((v) => !v)}
                aria-label={showHint ? 'Hide hint' : 'Show hint'}
              >
                ?
              </Button>
            </div>
            <p className="text-title-large">{currentChallenge.en}</p>
            {showHint && (
              <p className="text-body-medium text-muted-foreground">
                Verb: {currentChallenge.verbWord}（{currentChallenge.verbKana}）
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timer + Lives */}
      {challengeActive && (
        <div className="mx-4 mb-4 space-y-2">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-container rounded-xl">
            <div className="flex items-center gap-2" aria-label={`${lives} lives remaining`}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'text-2xl transition-all',
                    i < lives ? 'text-destructive scale-100' : 'text-muted-foreground/30 scale-75'
                  )}
                  aria-hidden="true"
                >
                  {i < lives ? '♥' : '♡'}
                </span>
              ))}
            </div>
            <span className="text-title-medium">{timeLeft}s</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-300',
                timerUrgent ? 'bg-destructive' : 'bg-primary'
              )}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Game Over Dialog */}
      {inChallenge && !verbPickerOpen && gameOver && (
        <Dialog open>
          <DialogContent>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md3-2">
                <span className="text-4xl">♡</span>
              </div>
              <DialogHeader>
                <DialogTitle>Game Over</DialogTitle>
                <DialogDescription>No lives remaining</DialogDescription>
              </DialogHeader>
            </div>
            <DialogFooter>
              <Button variant="filled" fullWidth onClick={enterChallenge}>
                Try Again
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* All Done Dialog */}
      {inChallenge && !verbPickerOpen && allDone && (
        <Dialog open>
          <DialogContent>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md3-2">
                <span className="text-4xl">★</span>
              </div>
              <DialogHeader>
                <DialogTitle>All Done!</DialogTitle>
                <DialogDescription>
                  You completed all {challenges.length} challenges for {selectedVerb?.dict}
                </DialogDescription>
              </DialogHeader>
            </div>
            <DialogFooter>
              <Button variant="filled" fullWidth onClick={enterChallenge}>
                Play Again
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Word Selector */}
      {!verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <div className="px-4">
          {inChallenge ? (
            <ChallengeWordTray
              wordPool={currentChallenge?.wordPool ?? []}
              onSelect={handleSelect}
              showEnglish={showEnglish}
            />
          ) : (
            <WordDropdown onSelect={handleSelect} showEnglish={showEnglish} />
          )}
        </div>
      )}

      {/* Sentence Area */}
      {!verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && hasChips && (
        <div className="px-4 mt-4">
          <div className="flex flex-wrap items-center gap-2" ref={chipsRef}>
            {sentence.map((chip, i) => (
              <div key={chip.id} className="relative">
                {insertAt === i && (
                  <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary rounded-full" />
                )}
                <Chip
                  chip={chip}
                  isDragging={chip.id === draggingId}
                  onPointerDown={(e) => handleChipPointerDown(e, chip)}
                  onTap={() => handleChipTap(chip)}
                />
              </div>
            ))}
            {insertAt === sentence.length && (
              <div className="w-1 h-8 bg-primary rounded-full" />
            )}
            <span className="text-title-large font-japanese">。</span>
          </div>
        </div>
      )}

      {/* Romaji */}
      {hasChips && !verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <p className="px-4 mt-2 text-body-medium text-muted-foreground">
          {sentence.map((c) => kanaToRomaji(c.kana)).join(' ')}。
        </p>
      )}

      {/* Validation Result */}
      {inChallenge ? (
        challengeResult && (
          <Card
            variant="filled"
            className={cn(
              'm-4',
              challengeResult.valid ? 'ring-2 ring-green-500' : 'ring-2 ring-destructive'
            )}
          >
            <CardContent className="pt-4 pb-4 space-y-2">
              <p className="text-title-medium">
                {challengeResult.valid ? '✓ Correct!' : '✗ Not quite'}
              </p>
              {challengeResult.feedback && (
                <p className="text-body-medium">{challengeResult.feedback}</p>
              )}
              {!challengeResult.valid && challengeResult.correct && (
                <div className="text-body-medium">
                  <span className="text-muted-foreground">Correct: </span>
                  <span className="font-japanese">{challengeResult.correct}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      ) : (
        checkResult && (
          <Card
            variant="filled"
            className={cn(
              'm-4',
              checkResult.valid ? 'ring-2 ring-green-500' : 'ring-2 ring-destructive'
            )}
          >
            <CardContent className="pt-4 pb-4 space-y-2">
              <p className="text-title-medium">
                {checkResult.valid ? '✓ Looks correct!' : 'A few things to check:'}
              </p>
              {checkResult.issues.map((m, i) => (
                <p key={i} className="text-body-medium text-destructive">
                  ✗ {m}
                </p>
              ))}
              {checkResult.passes.map((m, i) => (
                <p key={i} className="text-body-medium text-green-600">
                  ✓ {m}
                </p>
              ))}
            </CardContent>
          </Card>
        )
      )}

      {/* Actions */}
      {!verbPickerOpen && !(inChallenge && (gameOver || allDone || generatingChallenges)) && (
        <div className="flex gap-3 px-4 mt-4">
          <Button
            variant="filled"
            fullWidth
            onClick={handleCheck}
            disabled={!hasChips || checkingAnswer}
          >
            {checkingAnswer ? <Loader size={18} className="animate-spin" /> : 'Check'}
          </Button>
          <Button
            variant={showEnglish ? 'tonal' : 'outlined'}
            onClick={() => setShowEnglish((v) => !v)}
            aria-label={showEnglish ? 'Hide English' : 'Show English'}
          >
            EN
          </Button>
          <Button
            variant="outlined"
            size="icon"
            onClick={handleSpeak}
            disabled={!hasChips}
            aria-label="Speak all"
          >
            <Volume2 size={18} />
          </Button>
          <Button
            variant={copied ? 'tonal' : 'outlined'}
            size="icon"
            onClick={handleCopy}
            disabled={!hasChips}
            aria-label={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </Button>
        </div>
      )}

      {/* Drag Ghost */}
      {ghostStyle && draggingChip && didDragRef.current && (
        <div
          className="fixed px-3 py-2 bg-surface-container rounded-lg shadow-md3-3 opacity-70 pointer-events-none z-50"
          style={{ left: ghostStyle.left, top: ghostStyle.top, width: ghostStyle.width }}
          aria-hidden="true"
        >
          <div className="text-body-large font-japanese">{draggingChip.word}</div>
          {draggingChip.word !== draggingChip.kana && (
            <div className="text-label-small text-muted-foreground">{draggingChip.kana}</div>
          )}
        </div>
      )}
    </div>
  )
}
