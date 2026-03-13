import { useState, useEffect, useRef } from 'react'
import * as LucideIcons from 'lucide-react'
import { WRITING_SETS, getCharsForSet } from '../data/writingData'
import { recognizeInk } from '../utils/googleInputTools'
import { speak } from '../utils/speech'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import { MenuCard, MenuCardList } from '../components/ui/menu-card'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { cn } from '../lib/utils'

// ─── Constants ────────────────────────────────────────────────────

const TIMER_MAX = 30
const WRITING_MASTERY_MAX = 5
const RECOGNIZE_DELAY_MS = 400
const ACCEPT_TOP_N = 3

// ─── Helpers ──────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Components ───────────────────────────────────────────────────

function Hearts({ lives }) {
  return (
    <div className="flex items-center gap-2" aria-label={`${lives} lives remaining`}>
      {[...Array(5)].map((_, i) => (
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
  )
}

function TimerBar({ timeLeft }) {
  const pct = (timeLeft / TIMER_MAX) * 100
  const isUrgent = timeLeft < 10

  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div
        className={cn(
          'h-full transition-all duration-300',
          isUrgent ? 'bg-destructive' : 'bg-primary'
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function SetPicker({ onSelect }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-1 px-2">
        <h2 className="text-title-large">Choose a character set</h2>
        <p className="text-body-medium text-muted-foreground">Practice handwriting recognition</p>
      </div>

      <MenuCardList>
        {WRITING_SETS.map((s) => {
          const chars = getCharsForSet(s.id)
          return (
            <MenuCard
              key={s.id}
              icon={<span className="text-3xl font-japanese">{s.icon}</span>}
              title={s.label}
              subtitle={s.kana}
              meta={`${chars.length} characters`}
              onClick={() => onSelect(s.id)}
            />
          )
        })}
      </MenuCardList>
    </div>
  )
}

function ResultOverlay({ lives, score, total, onPlayAgain, onNewSet }) {
  const failed = lives <= 0
  const perfect = score === total
  const icon = perfect ? '★' : failed ? '♡' : '✓'
  const title = perfect ? 'Perfect!' : failed ? 'Out of Hearts!' : 'Complete!'
  const subtitle = `${score} of ${total} correct`

  return (
    <Dialog open>
      <DialogContent>
        <div className="text-center">
          <div
            className={cn(
              'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md3-2',
              perfect ? 'bg-gradient-to-br from-green-500 to-green-700' :
              failed ? 'bg-gradient-to-br from-red-500 to-red-700' :
              'bg-gradient-to-br from-blue-500 to-purple-700'
            )}
          >
            <span className="text-4xl">{icon}</span>
          </div>

          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter>
          <Button variant="filled" fullWidth onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button variant="text" fullWidth onClick={onNewSet}>
            New Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function WritingQuiz({ chars, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(5)
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX)
  const [phase, setPhase] = useState('question')
  const [feedback, setFeedback] = useState(null)
  const [mastery, setMastery] = useState({})
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState([])
  const [curStroke, setCurStroke] = useState([])
  const [candidates, setCandidates] = useState([])
  const [recognizing, setRecognizing] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const canvasRef = useRef(null)
  const timerRef = useRef(null)
  const recTimerRef = useRef(null)
  const phaseRef = useRef(phase)
  const livesRef = useRef(lives)
  const strokesRef = useRef(strokes)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  useEffect(() => {
    livesRef.current = lives
  }, [lives])
  useEffect(() => {
    strokesRef.current = strokes
  }, [strokes])

  const current = chars[idx]
  const isLastChar = idx >= chars.length - 1
  const streak = mastery[current.char] ?? 0

  // Timer countdown
  function startTimer() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (phase === 'question') {
      resetCanvas()
      setCandidates([])
      startTimer()
    }
    return () => clearInterval(timerRef.current)
  }, [idx, phase]) // eslint-disable-line

  function resetCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setStrokes([])
    strokesRef.current = []
    setCurStroke([])
  }

  function getPos(src) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = src.touches ? src.touches[0].clientX : src.clientX
    const clientY = src.touches ? src.touches[0].clientY : src.clientY
    return [
      ((clientX - rect.left) * canvas.width) / rect.width,
      ((clientY - rect.top) * canvas.height) / rect.height,
    ]
  }

  function setupCtx() {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = Math.max(8, canvas.width * 0.04)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#2d2d2d'
    return ctx
  }

  function onPointerDown(e) {
    if (phaseRef.current !== 'question') return
    e.preventDefault()
    setIsDrawing(true)
    setCurStroke([getPos(e)])
  }

  function onPointerMove(e) {
    if (!isDrawing || phaseRef.current !== 'question') return
    e.preventDefault()
    const pos = getPos(e)
    const ctx = setupCtx()
    if (!ctx) return
    setCurStroke((prev) => {
      if (prev.length >= 1) {
        ctx.beginPath()
        ctx.moveTo(prev[prev.length - 1][0], prev[prev.length - 1][1])
        ctx.lineTo(pos[0], pos[1])
        ctx.stroke()
      }
      return [...prev, pos]
    })
  }

  function onPointerUp(e) {
    if (!isDrawing) return
    e.preventDefault()
    setIsDrawing(false)
    setCurStroke((prev) => {
      if (prev.length > 0) {
        const next = [...strokesRef.current, prev]
        strokesRef.current = next
        setStrokes(next)
        scheduleRecognition(next)
      }
      return []
    })
  }

  function scheduleRecognition(strokesToUse) {
    clearTimeout(recTimerRef.current)
    setRecognizing(true)
    recTimerRef.current = setTimeout(async () => {
      if (phaseRef.current !== 'question') {
        setRecognizing(false)
        return
      }
      try {
        const canvas = canvasRef.current
        const result = await recognizeInk(
          strokesToUse,
          canvas?.width ?? 280,
          canvas?.height ?? 280
        )
        if (phaseRef.current !== 'question') {
          setRecognizing(false)
          return
        }
        setCandidates(result.slice(0, 10))
      } catch {
        /* network error — ignore */
      }
      setRecognizing(false)
    }, RECOGNIZE_DELAY_MS)
  }

  function handleCheck() {
    if (strokes.length === 0 || phaseRef.current !== 'question') return
    clearInterval(timerRef.current)
    const correct = candidates.slice(0, ACCEPT_TOP_N).includes(current.char)
    if (correct) {
      playCorrectSound()
      speak(current.char)
      setFeedback('correct')
      setScore((s) => s + 1)
      setMastery((m) => ({
        ...m,
        [current.char]: Math.min(WRITING_MASTERY_MAX, (m[current.char] ?? 0) + 1),
      }))
      setPhase('feedback')
      setTimeout(advance, 1500)
    } else {
      playWrongSound()
      setFeedback('wrong')
      setMastery((m) => ({ ...m, [current.char]: 0 }))
      livesRef.current -= 1
      setLives(livesRef.current)
      setPhase('feedback')
      if (livesRef.current <= 0) {
        speak(current.char)
        setTimeout(() => setPhase('done'), 1500)
      } else {
        setTimeout(() => {
          setFeedback(null)
          setPhase('question')
          resetCanvas()
          setCandidates([])
          setTimeLeft(TIMER_MAX)
          startTimer()
        }, 1500)
      }
    }
  }

  function handleTimeout() {
    if (livesRef.current <= 0) return
    clearInterval(timerRef.current)
    playWrongSound()
    speak(current.char)
    setFeedback('wrong')
    setMastery((m) => ({ ...m, [current.char]: 0 }))
    livesRef.current -= 1
    setLives(livesRef.current)
    setPhase('feedback')
    if (livesRef.current <= 0) setTimeout(() => setPhase('done'), 1500)
    else setTimeout(advance, 1500)
  }

  function advance() {
    if (isLastChar) {
      setPhase('done')
      return
    }
    setIdx((i) => i + 1)
    setFeedback(null)
    setTimeLeft(TIMER_MAX)
    setPhase('question')
  }

  useEffect(() => {
    if (phase === 'done') {
      clearInterval(timerRef.current)
      onComplete({ score, lives: livesRef.current, total: chars.length })
    }
  }, [phase]) // eslint-disable-line

  if (phase === 'done') return null

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  function handleHint() {
    setShowHint(true)
    setTimeout(() => setShowHint(false), 3000)
  }

  function handleClear() {
    resetCanvas()
    setCandidates([])
  }

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      {/* HUD */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-4 py-3 bg-surface-container rounded-xl">
          <Hearts lives={lives} />
          <div className="text-title-medium">
            <span className="font-bold">{score}</span>
            <span className="text-muted-foreground"> / {chars.length}</span>
          </div>
        </div>
        <TimerBar timeLeft={timeLeft} />
        <div className="text-center text-body-medium text-muted-foreground">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Character Info */}
      <div
        className={cn(
          'p-4 bg-surface-container rounded-2xl text-center space-y-2 transition-all shadow-md3-2',
          feedback === 'correct' && 'ring-2 ring-green-500',
          feedback === 'wrong' && 'ring-2 ring-destructive'
        )}
      >
        <div className="text-title-large">{current.reading}</div>
        {current.meaning && (
          <div className="text-body-medium text-muted-foreground">{current.meaning}</div>
        )}
        {streak > 0 && (
          <div className="text-body-small text-primary">
            {'●'.repeat(streak)}
            {'○'.repeat(WRITING_MASTERY_MAX - streak)}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {showHint && (
            <div
              className="absolute inset-0 flex items-center justify-center text-9xl font-japanese text-primary/20 pointer-events-none"
              aria-hidden="true"
            >
              {current.char}
            </div>
          )}
          {feedback === 'wrong' && (
            <div
              className="absolute inset-0 flex items-center justify-center text-9xl font-japanese text-destructive/60 pointer-events-none"
              aria-live="polite"
            >
              {current.char}
            </div>
          )}

          {phase === 'question' && (
            <>
              <button
                className="absolute top-2 left-2 w-10 h-10 rounded-full bg-surface-container-high shadow-md3-1 flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                onClick={handleHint}
                title="Show hint"
              >
                <LucideIcons.HelpCircle size={20} />
              </button>
              <button
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-surface-container-high shadow-md3-1 flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                onClick={handleClear}
                title="Clear"
              >
                <LucideIcons.X size={20} />
              </button>
            </>
          )}

          <canvas
            ref={canvasRef}
            className={cn(
              'bg-surface rounded-2xl shadow-md3-2 touch-none',
              feedback === 'correct' && 'ring-4 ring-green-500',
              feedback === 'wrong' && 'ring-4 ring-destructive'
            )}
            width={280}
            height={280}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          />
        </div>
      </div>

      {/* Recognition Candidates */}
      <div className="min-h-12 flex items-center justify-center gap-2 px-4 py-2 bg-surface-container rounded-xl">
        {recognizing ? (
          <span className="text-body-medium text-muted-foreground">Recognizing…</span>
        ) : candidates.length > 0 ? (
          candidates.map((c, i) => (
            <span
              key={i}
              className={cn(
                'text-title-large font-japanese transition-colors',
                c === current.char ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {c}
            </span>
          ))
        ) : (
          <span className="text-body-medium text-muted-foreground">
            Draw the character above
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {phase === 'question' && strokes.length > 0 && (
          <Button
            variant="filled"
            fullWidth
            onClick={handleCheck}
            disabled={recognizing}
          >
            Check
          </Button>
        )}
        {phase === 'question' && (
          <Button variant="text" fullWidth onClick={handleTimeout}>
            Skip
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function WritingScreen() {
  const [phase, setPhase] = useState('pick_set')
  const [setId, setSetId] = useState(null)
  const [chars, setChars] = useState([])
  const [result, setResult] = useState(null)

  function handleSelectSet(id) {
    setSetId(id)
    setChars(shuffle(getCharsForSet(id)))
    setResult(null)
    setPhase('quiz')
  }

  function handleQuizComplete(res) {
    setResult(res)
    setPhase('done')
  }

  if (phase === 'pick_set') return <SetPicker onSelect={handleSelectSet} />

  return (
    <>
      {phase === 'quiz' && (
        <WritingQuiz
          key={setId}
          chars={chars}
          onComplete={handleQuizComplete}
        />
      )}
      {phase === 'done' && result && (
        <ResultOverlay
          lives={result.lives}
          score={result.score}
          total={result.total}
          onPlayAgain={() => {
            setChars(shuffle(getCharsForSet(setId)))
            setPhase('quiz')
          }}
          onNewSet={() => setPhase('pick_set')}
        />
      )}
    </>
  )
}
