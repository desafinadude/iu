import { useState, useEffect, useCallback } from 'react'
import { useNav } from '../context/NavContext'
import { VERB_LIST } from '../data/vocabData'
import './VerbDrillScreen.css'

const STYLES = ['polite', 'casual']
const TENSES = ['present_pos', 'present_neg', 'past_pos', 'past_neg']

const TENSE_LABELS = {
  present_pos: 'Present +',
  present_neg: 'Present −',
  past_pos:    'Past +',
  past_neg:    'Past −',
}

const TYPE_LABELS = {
  ichidan:   'Ichidan',
  godan:     'Godan',
  irregular: 'Irregular',
}

// Drill order: all polite tenses top-to-bottom, then all casual
const DRILL_ORDER = STYLES.flatMap(style =>
  TENSES.map(tense => ({ style, tense }))
)

function getDistractors(verb, style, tense, count = 3) {
  const correct = verb[style][tense].word
  const pool = VERB_LIST
    .filter(v => v !== verb)
    .map(v => v[style][tense].word)
    .filter(w => w !== correct)
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

function buildOptions(verb, style, tense) {
  const correct = verb[style][tense].word
  const distractors = getDistractors(verb, style, tense, 3)
  const all = [correct, ...distractors]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

// ── Verb Picker ───────────────────────────────────────────────────────────────

function VerbPicker({ onSelect }) {
  return (
    <div className="vp">
      <div className="vp__hero">
        <div className="vp__hero-halftone" aria-hidden="true" />
        <span className="vp__hero-kanji" aria-hidden="true">動</span>
        <div className="vp__hero-text">
          <h2 className="vp__title">Verb Dojo</h2>
          <p className="vp__subtitle">Drill every tense and form — see the patterns</p>
        </div>
      </div>

      <button
        className="vp__random"
        onClick={() => onSelect(VERB_LIST[Math.floor(Math.random() * VERB_LIST.length)])}
        aria-label="Pick a random verb"
      >
        ⚡ Random Verb
      </button>

      <div className="vp__list" role="list">
        {VERB_LIST.map((verb, i) => (
          <button
            key={i}
            className="vp__item"
            onClick={() => onSelect(verb)}
            role="listitem"
            aria-label={`${verb.dict} — ${verb.meaning}`}
          >
            <span className="vp__item-dict">{verb.dict}</span>
            <span className="vp__item-kana">{verb.kana}</span>
            <span className="vp__item-meaning">{verb.meaning}</span>
            <span className={`vp__item-type vp__item-type--${verb.type}`}>
              {TYPE_LABELS[verb.type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Conjugation Table ─────────────────────────────────────────────────────────

function ConjTable({ verb, phase, currentIdx, revealed }) {
  function getCellState(style, tense) {
    const key = `${style}_${tense}`
    if (revealed[key]) return revealed[key].correct ? 'correct' : 'wrong'
    if (phase === 'study') return 'study'
    const activeCell = DRILL_ORDER[currentIdx]
    if (activeCell && activeCell.style === style && activeCell.tense === tense) return 'active'
    return 'hidden'
  }

  return (
    <div className="conj-table" aria-label="Conjugation table">
      {/* Column headers */}
      <div className="conj-table__row conj-table__row--head">
        <div className="conj-table__cell conj-table__cell--corner" />
        <div className="conj-table__cell conj-table__cell--col-head">Polite</div>
        <div className="conj-table__cell conj-table__cell--col-head">Casual</div>
      </div>

      {TENSES.map(tense => (
        <div key={tense} className="conj-table__row">
          <div className="conj-table__cell conj-table__cell--row-head">
            {TENSE_LABELS[tense]}
          </div>

          {STYLES.map(style => {
            const state = getCellState(style, tense)
            const form = verb[style][tense]
            const show = state === 'correct' || state === 'wrong' || state === 'study'

            return (
              <div
                key={style}
                className={`conj-table__cell conj-table__cell--form conj-table__cell--${state}`}
                aria-label={show ? `${style} ${tense}: ${form.word}` : undefined}
              >
                {show ? (
                  <>
                    <span className="conj-table__word">{form.word}</span>
                    <span className="conj-table__kana">{form.kana}</span>
                  </>
                ) : (
                  <span className="conj-table__placeholder" aria-hidden="true">
                    {state === 'active' ? '？' : '・・'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ── Verb Drill ────────────────────────────────────────────────────────────────

function VerbDrill({ verb, onBack }) {
  const [phase, setPhase] = useState('study')       // 'study' | 'drill' | 'complete'
  const [countdown, setCountdown] = useState(4)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState({})      // key → { correct: bool }
  const [options, setOptions] = useState([])
  const [feedback, setFeedback] = useState(null)    // null | 'correct' | 'wrong'
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  const startDrill = useCallback(() => {
    setPhase('drill')
    setCurrentIdx(0)
    setRevealed({})
    setOptions(buildOptions(verb, DRILL_ORDER[0].style, DRILL_ORDER[0].tense))
    setFeedback(null)
    setSelectedOpt(null)
    setCorrectCount(0)
  }, [verb])

  // Study countdown
  useEffect(() => {
    if (phase !== 'study') return
    if (countdown <= 0) { startDrill(); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown, startDrill])

  function handleAnswer(opt) {
    if (feedback) return
    const { style, tense } = DRILL_ORDER[currentIdx]
    const correct = verb[style][tense].word
    const isCorrect = opt === correct

    setSelectedOpt(opt)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setRevealed(prev => ({
      ...prev,
      [`${style}_${tense}`]: { correct: isCorrect },
    }))
    if (isCorrect) setCorrectCount(c => c + 1)

    setTimeout(() => {
      setFeedback(null)
      setSelectedOpt(null)
      const next = currentIdx + 1
      if (next >= DRILL_ORDER.length) {
        setPhase('complete')
      } else {
        setCurrentIdx(next)
        setOptions(buildOptions(verb, DRILL_ORDER[next].style, DRILL_ORDER[next].tense))
      }
    }, 900)
  }

  // ── Complete
  if (phase === 'complete') {
    const perfect = correctCount === DRILL_ORDER.length
    return (
      <div className="vd-complete">
        <div className="vd-complete__card">
          <div className="vd-complete__halftone" aria-hidden="true" />
          <p className="vd-complete__dict">{verb.dict}</p>
          <p className="vd-complete__kana">{verb.kana}</p>
          <p className="vd-complete__meaning">{verb.meaning}</p>
          <div className="vd-complete__score-wrap">
            <span className="vd-complete__score">{correctCount}</span>
            <span className="vd-complete__denom">/ {DRILL_ORDER.length}</span>
          </div>
          <p className="vd-complete__label">{perfect ? 'Perfect!' : 'Keep practising!'}</p>
          <div className="vd-complete__actions">
            <button className="vd-btn vd-btn--primary" onClick={startDrill}>
              Drill Again
            </button>
            <button className="vd-btn vd-btn--ghost" onClick={onBack}>
              Pick Another Verb
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentCell = phase === 'drill' ? DRILL_ORDER[currentIdx] : null

  return (
    <div className="vd">
      {/* Verb header */}
      <div className="vd__header">
        <div className="vd__header-main">
          <span className="vd__dict">{verb.dict}</span>
          <span className="vd__kana">{verb.kana}</span>
          <span className={`vd__type vd__type--${verb.type}`}>{TYPE_LABELS[verb.type]}</span>
        </div>
        <p className="vd__meaning">{verb.meaning}</p>
        <p className="vd__example">
          <span className="vd__example-jp">{verb.example.jp}</span>
          <span className="vd__example-en">{verb.example.en}</span>
        </p>
      </div>

      {/* Table — always visible */}
      <ConjTable
        verb={verb}
        phase={phase}
        currentIdx={currentIdx}
        revealed={revealed}
      />

      {/* Study phase banner */}
      {phase === 'study' && (
        <div className="vd__study-banner">
          <p className="vd__study-label">Study the pattern!</p>
          <div className="vd__study-countdown" aria-live="polite">{countdown}</div>
          <button className="vd-btn vd-btn--ghost" onClick={startDrill}>
            Start Drill →
          </button>
        </div>
      )}

      {/* Drill phase */}
      {phase === 'drill' && currentCell && (
        <div className={`vd__quiz ${feedback ? `vd__quiz--${feedback}` : ''}`}>
          <p className="vd__prompt" aria-live="polite">
            <span className="vd__prompt-style">
              {currentCell.style === 'polite' ? 'Polite' : 'Casual'}
            </span>
            {' · '}
            <span className="vd__prompt-tense">{TENSE_LABELS[currentCell.tense]}</span>
          </p>

          <div className="vd__options" role="group" aria-label="Choose the correct form">
            {options.map((opt, i) => {
              const correctWord = verb[currentCell.style][currentCell.tense].word
              let state = ''
              if (feedback) {
                if (opt === correctWord) state = 'correct'
                else if (opt === selectedOpt) state = 'wrong'
              }
              return (
                <button
                  key={i}
                  className={`vd__option ${state ? `vd__option--${state}` : ''}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                  aria-label={opt}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Progress dots */}
          <div className="vd__dots" aria-label={`Question ${currentIdx + 1} of ${DRILL_ORDER.length}`}>
            {DRILL_ORDER.map((_, i) => {
              const key = `${DRILL_ORDER[i].style}_${DRILL_ORDER[i].tense}`
              const done = revealed[key]
              const active = i === currentIdx
              return (
                <div
                  key={i}
                  className={`vd__dot ${active ? 'vd__dot--active' : ''} ${done ? (revealed[key].correct ? 'vd__dot--correct' : 'vd__dot--wrong') : ''}`}
                  aria-hidden="true"
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Screen root ───────────────────────────────────────────────────────────────

export default function VerbDrillScreen() {
  const [selectedVerb, setSelectedVerb] = useState(null)

  if (!selectedVerb) {
    return <VerbPicker onSelect={setSelectedVerb} />
  }

  return <VerbDrill verb={selectedVerb} onBack={() => setSelectedVerb(null)} />
}
