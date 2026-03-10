import { useState, useEffect, useCallback } from 'react'
import { useNav } from '../context/NavContext'
import { VERB_LIST } from '../data/vocabData'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import { speak } from '../utils/speech'
import './VerbDrillScreen.css'

const STYLES  = ['polite', 'casual']
const TENSES  = ['present_pos', 'present_neg', 'past_pos', 'past_neg']

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

// Polite first (top → bottom), then casual
const DRILL_ORDER = STYLES.flatMap(style =>
  TENSES.map(tense => ({ style, tense }))
)

function buildOptions(verb, style, tense) {
  const correct = verb[style][tense].word
  const pool = VERB_LIST
    .filter(v => v !== verb)
    .map(v => v[style][tense].word)
    .filter(w => w !== correct)
  // Shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const opts = [correct, ...pool.slice(0, 3)]
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[opts[i], opts[j]] = [opts[j], opts[i]]
  }
  return opts
}


// ── Verb Picker ───────────────────────────────────────────────────────────────

function VerbPicker({ onSelect }) {
  return (
    <div className="vp">
      <div className="vp__hero">
        <div className="vp__hero-halftone" aria-hidden="true" />
        <span className="vp__hero-kanji" aria-hidden="true">動</span>
        <div className="vp__hero-body">
          <h2 className="vp__title">Verb Dojo</h2>
          <p className="vp__subtitle">Pick a verb — drill every tense to see the pattern</p>
        </div>
      </div>

      <button
        className="vp__random"
        onClick={() => {
          const v = VERB_LIST[Math.floor(Math.random() * VERB_LIST.length)]
          speak(v.dict)
          onSelect(v)
        }}
      >
        ⚡ Random Verb
      </button>

      <div className="vp__list">
        {VERB_LIST.map((verb, i) => (
          <button
            key={i}
            className="vp__item"
            onClick={() => { speak(verb.dict); onSelect(verb) }}
          >
            <span className="vp__item-dict">{verb.dict}</span>
            <span className="vp__item-kana">{verb.kana}</span>
            <span className="vp__item-meaning">{verb.meaning}</span>
            <span className={`vp__item-badge vp__item-badge--${verb.type}`}>
              {TYPE_LABELS[verb.type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}


// ── Form strip — shows revealed / hidden chips in 2 columns ──────────────────

function FormStrip({ verb, phase, currentIdx, revealed }) {
  function cellState(style, tense) {
    const key = `${style}_${tense}`
    if (revealed[key]) return revealed[key].correct ? 'correct' : 'wrong'
    if (phase === 'study') return 'show'
    const active = DRILL_ORDER[currentIdx]
    if (active && active.style === style && active.tense === tense) return 'active'
    return 'hidden'
  }

  return (
    <div className="vd-strip">
      {STYLES.map(style => (
        <div key={style} className="vd-strip__col">
          <div className="vd-strip__col-head">{style === 'polite' ? 'Polite' : 'Casual'}</div>
          {TENSES.map(tense => {
            const state = cellState(style, tense)
            const form  = verb[style][tense]
            const show  = state === 'show' || state === 'correct' || state === 'wrong'
            return (
              <div key={tense} className={`vd-strip__chip vd-strip__chip--${state}`}>
                {show   ? form.word
                        : state === 'active' ? '？' : '· · ·'}
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
  const [phase, setPhase]           = useState('study')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed]     = useState({})
  const [options, setOptions]       = useState([])
  const [feedback, setFeedback]     = useState(null)   // null | 'correct' | 'wrong'
  const [selected, setSelected]     = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  // Speak verb on mount
  useEffect(() => { speak(verb.dict) }, [verb])

  const startDrill = useCallback(() => {
    setPhase('drill')
    setCurrentIdx(0)
    setRevealed({})
    setOptions(buildOptions(verb, DRILL_ORDER[0].style, DRILL_ORDER[0].tense))
    setFeedback(null)
    setSelected(null)
    setCorrectCount(0)
  }, [verb])

  function handleAnswer(opt) {
    if (feedback) return
    const { style, tense } = DRILL_ORDER[currentIdx]
    const correct  = verb[style][tense].word
    const isRight  = opt === correct

    setSelected(opt)
    setFeedback(isRight ? 'correct' : 'wrong')
    setRevealed(prev => ({
      ...prev,
      [`${style}_${tense}`]: { correct: isRight },
    }))

    if (isRight) {
      playCorrectSound()
      setCorrectCount(c => c + 1)
    } else {
      playWrongSound()
    }

    // Speak the correct form after a beat
    setTimeout(() => speak(correct), 300)

    setTimeout(() => {
      setFeedback(null)
      setSelected(null)
      const next = currentIdx + 1
      if (next >= DRILL_ORDER.length) {
        setPhase('complete')
      } else {
        setCurrentIdx(next)
        setOptions(buildOptions(verb, DRILL_ORDER[next].style, DRILL_ORDER[next].tense))
      }
    }, 1000)
  }

  // ── Complete screen
  if (phase === 'complete') {
    const perfect = correctCount === DRILL_ORDER.length
    return (
      <div className="vd-result">
        <div className="vd-result__card">
          <div className="vd-result__halftone" aria-hidden="true" />
          <p className="vd-result__overline">Complete</p>
          <p className="vd-result__dict">{verb.dict}</p>
          <p className="vd-result__kana">{verb.kana}</p>
          <div className="vd-result__score-row">
            <span className="vd-result__score">{correctCount}</span>
            <span className="vd-result__denom">/ {DRILL_ORDER.length}</span>
          </div>
          <p className="vd-result__verdict">{perfect ? 'Perfect!' : 'Keep at it!'}</p>
          <button className="vd-btn vd-btn--primary" onClick={startDrill}>Drill Again</button>
          <button className="vd-btn vd-btn--ghost"   onClick={onBack}>Pick Another Verb</button>
        </div>
      </div>
    )
  }

  const cell = phase === 'drill' ? DRILL_ORDER[currentIdx] : null

  return (
    <div className="vd">

      {/* Compact verb header */}
      <div className="vd__header">
        <div className="vd__header-left">
          <span className="vd__dict">{verb.dict}</span>
          <span className="vd__kana">{verb.kana}</span>
        </div>
        <div className="vd__header-right">
          <span className={`vd__badge vd__badge--${verb.type}`}>{TYPE_LABELS[verb.type]}</span>
          <span className="vd__meaning">{verb.meaning}</span>
        </div>
      </div>

      {/* Form strip — always visible, fills in as you answer */}
      <FormStrip
        verb={verb}
        phase={phase}
        currentIdx={currentIdx}
        revealed={revealed}
      />

      {/* ── Study phase ── */}
      {phase === 'study' && (
        <>
          <div className="vd__example">
            <span className="vd__example-jp">{verb.example.jp}</span>
            <span className="vd__example-en">{verb.example.en}</span>
          </div>
          <button className="vd-btn vd-btn--primary vd-btn--start" onClick={startDrill}>
            Start Drill →
          </button>
        </>
      )}

      {/* ── Drill phase ── */}
      {phase === 'drill' && cell && (
        <>
          {/* Prompt card — postit style like kana quiz */}
          <div className={`vd__prompt-card ${feedback ? `vd__prompt-card--${feedback}` : ''}`}>
            <span className="vd__tape" aria-hidden="true" />
            <div className="vd__halftone" aria-hidden="true" />
            <div className="vd__prompt-inner">
              <span className="vd__prompt-style">
                {cell.style === 'polite' ? 'Polite' : 'Casual'}
              </span>
              <span className="vd__prompt-tense">{TENSE_LABELS[cell.tense]}</span>
            </div>
          </div>

          {/* 2×2 options */}
          <div className="vd__options" role="group" aria-label="Choose the correct form">
            {options.map((opt, i) => {
              const correct = verb[cell.style][cell.tense].word
              let state = ''
              if (feedback) {
                if (opt === correct)             state = 'correct'
                else if (opt === selected)       state = 'wrong'
              }
              return (
                <button
                  key={i}
                  className={`vd__option ${state ? `vd__option--${state}` : ''}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Progress dots */}
          <div className="vd__dots" aria-label={`${currentIdx + 1} of ${DRILL_ORDER.length}`}>
            {DRILL_ORDER.map((d, i) => {
              const key  = `${d.style}_${d.tense}`
              const done = revealed[key]
              return (
                <div
                  key={i}
                  className={[
                    'vd__dot',
                    i === currentIdx                       ? 'vd__dot--active'  : '',
                    done && revealed[key].correct          ? 'vd__dot--correct' : '',
                    done && !revealed[key].correct         ? 'vd__dot--wrong'   : '',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}


// ── Screen root ───────────────────────────────────────────────────────────────

export default function VerbDrillScreen() {
  const [verb, setVerb] = useState(null)

  if (!verb) return <VerbPicker onSelect={setVerb} />
  return <VerbDrill key={verb.dict} verb={verb} onBack={() => setVerb(null)} />
}
