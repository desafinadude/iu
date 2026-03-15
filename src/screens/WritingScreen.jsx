import { useState, useEffect, useRef, useCallback } from 'react'
import { Pencil, PenLine } from 'lucide-react'
import { speak } from '../utils/speech'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import {
  WRITING_SETS,
  getCharsForSet,
  getSetDef,
  WRITING_MASTERY_MAX,
  loadWritingMastery,
  saveWritingMastery,
} from '../data/writingData'
import './WritingScreen.css'

const TIMER_MAX          = 30
const LIVES_MAX          = 5
const RECOGNIZE_DELAY_MS = 600   // ms debounce after last stroke
const ACCEPT_TOP_N       = 10    // char must appear in top N candidates

// ─── Google InputTools handwriting recognition ────────────────────────────
async function recognizeInk(strokes, w, h) {
  const ink = strokes.map(s => [s.map(p => Math.round(p[0])), s.map(p => Math.round(p[1]))])
  const body = JSON.stringify({
    options: 'enable_pre_space',
    requests: [{ writing_guide: { writing_area_width: w, writing_area_height: h }, ink, language: 'ja' }],
  })
  const res  = await fetch(
    'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body },
  )
  const data = await res.json()
  return data?.[1]?.[0]?.[1] ?? []
}

// ─── Shared sub-components ─────────────────────────────────────────────────
function Hearts({ lives }) {
  return (
    <div className="wr-hearts" aria-label={`${lives} hearts remaining`}>
      {Array.from({ length: LIVES_MAX }, (_, i) => (
        <span key={i} className={`wr-heart${i < lives ? '' : ' wr-heart--lost'}`}>
          {i < lives ? '♥' : '♡'}
        </span>
      ))}
    </div>
  )
}

function TimerBar({ timeLeft }) {
  const pct    = (timeLeft / TIMER_MAX) * 100
  const urgent = timeLeft < 10
  return (
    <div className="wr-timer-bar">
      <div className={`wr-timer-fill${urgent ? ' wr-timer-fill--urgent' : ''}`}
           style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── Set picker ────────────────────────────────────────────────────────────
function SetPicker({ onSelect }) {
  return (
    <div className="wr-set-picker">
      <p className="wr-set-subtitle">Choose a character set</p>
      <div className="wr-set-list">
        {WRITING_SETS.map(s => (
          <button key={s.id} className="wr-set-card" onClick={() => onSelect(s.id)}>
            <div className="wr-set-card__halftone" aria-hidden="true" />
            <span className="wr-set-icon">{s.icon}</span>
            <div className="wr-set-card__body">
              <span className="wr-set-name">{s.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Mode picker ───────────────────────────────────────────────────────────
function ModePicker({ setId, onStart, onBack }) {
  const setDef = getSetDef(setId)
  return (
    <div className="wr-mode-picker">
      <p className="wr-mode-set-name">{setDef?.label}</p>
      <p className="wr-mode-subtitle">Choose difficulty</p>
      <div className="wr-mode-cards">
        <button className="wr-mode-card" onClick={() => onStart('trace')}>
          <div className="wr-mode-card__halftone" aria-hidden="true" />
          <span className="wr-mode-card__icon"><Pencil size={40} strokeWidth={1.5} aria-hidden="true" /></span>
          <div className="wr-mode-card__body">
            <span className="wr-mode-card__title">Trace</span>
            <span className="wr-mode-card__desc">Character shown — trace it on the canvas</span>
          </div>
        </button>
        <button className="wr-mode-card" onClick={() => onStart('free')}>
          <div className="wr-mode-card__halftone" aria-hidden="true" />
          <span className="wr-mode-card__icon"><PenLine size={40} strokeWidth={1.5} aria-hidden="true" /></span>
          <div className="wr-mode-card__body">
            <span className="wr-mode-card__title">Write</span>
            <span className="wr-mode-card__desc">Reading shown — draw from memory</span>
          </div>
        </button>
      </div>
      <button className="wr-back-btn" onClick={onBack}>← Back</button>
    </div>
  )
}

// ─── Result overlay ────────────────────────────────────────────────────────
function ResultOverlay({ lives, score, total, onPlayAgain, onNewSet }) {
  const complete = lives > 0
  return (
    <div className="wr-overlay" role="dialog" aria-modal="true">
      <div className="wr-result">
        <span className="wr-result__icon">{complete ? '★' : '♡'}</span>
        <h2 className="wr-result__title">{complete ? 'Complete!' : 'Out of Hearts!'}</h2>
        <p className="wr-result__sub">{score} of {total} correct</p>
        <div className="wr-result__actions">
          <button className="wr-result__btn" onClick={onPlayAgain}>Play Again</button>
          <button className="wr-result__btn wr-result__btn--secondary" onClick={onNewSet}>New Set</button>
        </div>
      </div>
    </div>
  )
}

// ─── Writing quiz (canvas + Google recognition) ────────────────────────────
function WritingQuiz({ chars, mode, onComplete }) {
  const canvasRef      = useRef(null)
  const timerRef       = useRef(null)
  const recTimerRef    = useRef(null)
  const livesRef       = useRef(LIVES_MAX)
  const strokesRef     = useRef([])       // sync ref for async recognition
  const phaseRef       = useRef('question')

  const [idx,          setIdx]         = useState(0)
  const [lives,        setLives]       = useState(LIVES_MAX)
  const [score,        setScore]       = useState(0)
  const [timeLeft,     setTimeLeft]    = useState(TIMER_MAX)
  const [phase,        setPhase]       = useState('question') // question | feedback | done
  const [feedback,     setFeedback]    = useState(null)       // null | 'correct' | 'wrong'
  const [mastery,      setMastery]     = useState(loadWritingMastery)
  const [isDrawing,    setIsDrawing]   = useState(false)
  const [strokes,      setStrokes]     = useState([])
  const [curStroke,    setCurStroke]   = useState([])
  const [candidates,   setCandidates]  = useState([])
  const [recognizing,  setRecognizing] = useState(false)
  const [showHint,     setShowHint]    = useState(false)

  const current    = chars[idx]
  const isLastChar = idx >= chars.length - 1
  const streak     = mastery[current.char] ?? 0

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { saveWritingMastery(mastery) }, [mastery])

  const handleTimeoutRef = useRef(null)
  useEffect(() => { handleTimeoutRef.current = handleTimeout })

  // Timer
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeoutRef.current?.(); return 0 }
        return t - 1
      })
    }, 1000)
  }, [])

  // Reset + start timer on new character
  useEffect(() => {
    resetCanvas()
    setShowHint(false)
    setCandidates([])
    setRecognizing(false)
    startTimer()
    speak(current.char)
    return () => {
      clearInterval(timerRef.current)
      clearTimeout(recTimerRef.current)
    }
  }, [idx, startTimer]) // eslint-disable-line

  function resetCanvas() {
    strokesRef.current = []
    setStrokes([])
    setCurStroke([])
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function getPos(e) {
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const src    = e.touches?.[0] ?? e
    return [
      (src.clientX - rect.left) * (canvas.width  / rect.width),
      (src.clientY - rect.top)  * (canvas.height / rect.height),
    ]
  }

  function setupCtx() {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    ctx.lineWidth   = Math.max(8, canvas.width * 0.04)
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
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
    setCurStroke(prev => {
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
    setCurStroke(prev => {
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
      if (phaseRef.current !== 'question') { setRecognizing(false); return }
      try {
        const canvas = canvasRef.current
        const result = await recognizeInk(strokesToUse, canvas?.width ?? 280, canvas?.height ?? 280)
        if (phaseRef.current !== 'question') { setRecognizing(false); return }
        setCandidates(result.slice(0, 10))
      } catch { /* network error — ignore */ }
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
      setScore(s => s + 1)
      setMastery(m => ({ ...m, [current.char]: Math.min(WRITING_MASTERY_MAX, (m[current.char] ?? 0) + 1) }))
      setPhase('feedback')
      setTimeout(advance, 1500)
    } else {
      playWrongSound()
      setFeedback('wrong')
      setMastery(m => ({ ...m, [current.char]: 0 }))
      livesRef.current -= 1
      setLives(livesRef.current)
      setPhase('feedback')
      if (livesRef.current <= 0) {
        speak(current.char)
        setTimeout(() => setPhase('done'), 1500)
      } else {
        // Stay on same char — reset canvas and let them retry
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
    setMastery(m => ({ ...m, [current.char]: 0 }))
    livesRef.current -= 1
    setLives(livesRef.current)
    setPhase('feedback')
    if (livesRef.current <= 0) setTimeout(() => setPhase('done'), 1500)
    else                       setTimeout(advance, 1500)
  }

  function advance() {
    if (isLastChar) { setPhase('done'); return }
    setIdx(i => i + 1)
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

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  function handleHint() {
    setShowHint(true)
    setTimeout(() => setShowHint(false), 3000)
  }

  function handleClear() {
    resetCanvas()
    setCandidates([])
  }

  return (
    <div className="wr-quiz">
      <div className="wr-hud">
        <Hearts lives={lives} />
        <span className="wr-hud__count">{score}/{chars.length}</span>
      </div>
      <TimerBar timeLeft={timeLeft} />
      <span className="wr-hud__time">{formatTime(timeLeft)}</span>

      {/* Character info — postit style */}
      <div className={`wr-char-info${feedback ? ` wr-char-info--${feedback}` : ''}`}>
        <span className="wr-char-reading">{current.reading}</span>
        {current.meaning && <span className="wr-char-meaning">{current.meaning}</span>}
        {streak > 0 && (
          <span className="wr-char-streak">
            {'●'.repeat(streak)}{'○'.repeat(WRITING_MASTERY_MAX - streak)}
          </span>
        )}
      </div>

      {/* Canvas with corner buttons */}
      <div className={`wr-canvas-wrap${feedback ? ` wr-canvas-wrap--${feedback}` : ''}`}>
        {showHint && (
          <div className="wr-canvas-hint" aria-hidden="true">{current.char}</div>
        )}
        {feedback === 'wrong' && (
          <div className="wr-canvas-reveal" aria-live="polite">{current.char}</div>
        )}
        {phase === 'question' && (
          <button className="wr-canvas-btn wr-canvas-btn--tl" onClick={handleHint} title="Show hint">
            ?
          </button>
        )}
        {phase === 'question' && (
          <button className="wr-canvas-btn wr-canvas-btn--tr" onClick={handleClear} title="Clear">
            ✕
          </button>
        )}
        <canvas
          ref={canvasRef}
          className="wr-canvas"
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

      {/* Recognition candidates */}
      <div className="wr-candidates">
        {recognizing
          ? <span className="wr-candidates-hint">Recognizing…</span>
          : candidates.length > 0
            ? candidates.map((c, i) => (
                <span key={i} className={`wr-candidate${c === current.char ? ' wr-candidate--match' : ''}`}>
                  {c}
                </span>
              ))
            : <span className="wr-candidates-hint">Draw the character above</span>
        }
      </div>

      {/* Check + Skip only */}
      <div className="wr-hint-row">
        {phase === 'question' && strokes.length > 0 && (
          <button className="wr-check-btn" onClick={handleCheck} disabled={recognizing}>
            Check
          </button>
        )}
        {phase === 'question' && (
          <button className="wr-skip-btn" onClick={handleTimeout}>Skip</button>
        )}
      </div>
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────
export default function WritingScreen() {
  const [phase,  setPhase]  = useState('pick_set')
  const [setId,  setSetId]  = useState(null)
  const [mode,   setMode]   = useState(null)
  const [chars,  setChars]  = useState([])
  const [result, setResult] = useState(null)

  function handleSelectSet(id) {
    setSetId(id)
    setChars(shuffle(getCharsForSet(id)))
    setMode('free')
    setResult(null)
    setPhase('quiz')
  }

  function handleSelectMode(m) {
    setChars(shuffle(getCharsForSet(setId)))
    setMode(m)
    setResult(null)
    setPhase('quiz')
  }

  function handleQuizComplete(res) {
    setResult(res)
    setPhase('done')
  }

  if (phase === 'pick_set') return <SetPicker onSelect={handleSelectSet} />

  return (
    <div className="writing-screen">
      {phase === 'quiz' && (
        <WritingQuiz
          key={`${setId}-${mode}`}
          chars={chars}
          mode={mode}
          onComplete={handleQuizComplete}
        />
      )}
      {phase === 'done' && result && (
        <ResultOverlay
          lives={result.lives}
          score={result.score}
          total={result.total}
          onPlayAgain={() => handleSelectMode(mode)}
          onNewSet={() => setPhase('pick_set')}
        />
      )}
    </div>
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
