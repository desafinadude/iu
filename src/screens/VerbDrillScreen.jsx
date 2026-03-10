import { useState, useEffect, useCallback } from 'react'
import {
  Eye, Ear, Utensils, Sparkles, MessageCircle, ArrowRight, ArrowLeft,
  Coffee, Zap, ShoppingBag, MessageSquare, BookOpen, PenLine, Lightbulb,
  PersonStanding, Armchair, Car, Moon, Home, AlarmClock, Clock,
  Users, Wrench, Hammer, DoorOpen, Shuffle,
} from 'lucide-react'
import { VERB_LIST } from '../data/verbData'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import { speak } from '../utils/speech'
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

const VERB_ICON_MAP = {
  '見る':    Eye,
  '聞く':    Ear,
  '味わう':  Utensils,
  '感じる':  Sparkles,
  '言う':    MessageCircle,
  '行く':    ArrowRight,
  '来る':    ArrowLeft,
  '食べる':  Utensils,
  '飲む':    Coffee,
  'する':    Zap,
  '買う':    ShoppingBag,
  '話す':    MessageSquare,
  '読む':    BookOpen,
  '書く':    PenLine,
  '考える':  Lightbulb,
  '歩く':    PersonStanding,
  '座る':    Armchair,
  '運転する': Car,
  '寝る':    Moon,
  '帰る':    Home,
  '起きる':  AlarmClock,
  '待つ':    Clock,
  '会う':    Users,
  '分かる':  Lightbulb,
  '使う':    Wrench,
  '作る':    Hammer,
  '開ける':  DoorOpen,
}

function VerbIcon({ verb, size = 24, className = '' }) {
  const Icon = VERB_ICON_MAP[verb.dict] ?? Zap
  return <Icon size={size} strokeWidth={2} className={className} aria-hidden="true" />
}

const DRILL_ORDER = STYLES.flatMap(style =>
  TENSES.map(tense => ({ style, tense }))
)

function buildOptions(verb, style, tense) {
  const correct = verb[style][tense].word
  const pool = VERB_LIST
    .filter(v => v !== verb)
    .map(v => v[style][tense].word)
    .filter(w => w !== correct)
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
  function pickRandom() {
    const v = VERB_LIST[Math.floor(Math.random() * VERB_LIST.length)]
    onSelect(v)
  }

  return (
    <div className="vp">
      <p className="vp__subtitle">Choose a verb</p>
      <div className="vp__list">
        {VERB_LIST.map((verb, i) => (
          <button
            key={i}
            className="vp__item"
            onClick={() => { onSelect(verb) }}
          >
            <div className="vp__item-halftone" aria-hidden="true" />
            <div className={`vp__item-tape vp__item-tape--${verb.type}`}>
              {TYPE_LABELS[verb.type]}
            </div>
            <span className="vp__item-icon">
              <VerbIcon verb={verb} size={32} />
            </span>
            <div className="vp__item-body">
              <span className="vp__item-dict">{verb.dict}</span>
              <span className="vp__item-meaning">{verb.meaning}</span>
              <span className="vp__item-kana">{verb.kana} · {kanaToRomaji(verb.kana)}</span>
            </div>
          </button>
        ))}

        {/* Random tile at the bottom */}
        <button className="vp__item vp__item--random" onClick={pickRandom}>
          <div className="vp__item-halftone" aria-hidden="true" />
          <span className="vp__item-icon"><Shuffle size={32} strokeWidth={1.5} /></span>
          <div className="vp__item-body">
            <span className="vp__item-label">Random</span>
            <span className="vp__item-kana">ランダム</span>
          </div>
        </button>
      </div>
    </div>
  )
}


// ── Form Cards — scrapbook style vertical list for study phase ────────────────

const FORM_LABELS = {
  polite_present: 'Polite · Present',
  casual_past:    'Casual · Past',
  te:             'て-form',
}

function FormCards({ verb }) {
  return (
    <div className="fc">
      {STYLES.map(style => (
        <div key={style} className="fc__group">

          {/* Section header tape */}
          <div className={`fc__section-tape fc__section-tape--${style}`}>
            {style === 'polite' ? 'Polite Forms' : 'Casual Forms'}
          </div>

          {/* 4 tense cards */}
          {TENSES.map((tense, ti) => {
            const form = verb[style][tense]
            return (
              <button
                key={tense}
                className={`fc__card fc__card--${style} fc__card--tilt${ti % 3}`}
                onClick={() => speak(form.kana)}
              >
                <div className="fc__card-row1">
                  <span className="fc__card-tense">{TENSE_LABELS[tense]}</span>
                  <span className="fc__card-word">{form.word}</span>
                </div>
                <div className="fc__card-row2">
                  <span className="fc__card-kana">{form.kana}</span>
                  <span className="fc__card-dot">·</span>
                  <span className="fc__card-romaji">{kanaToRomaji(form.kana)}</span>
                  <span className="fc__card-meaning">{form.meaning}</span>
                </div>
              </button>
            )
          })}
        </div>
      ))}

      {/* ── て-form (register-neutral connecting form) ── */}
      {verb.casual.te && (
        <div className="fc__group">
          <div className="fc__section-tape fc__section-tape--te">
            て-form
          </div>
          <button
            className="fc__card fc__card--te fc__card--tilt0"
            onClick={() => speak(verb.casual.te.kana)}
          >
            <div className="fc__card-row1">
              <span className="fc__card-tense">て-form</span>
              <span className="fc__card-word">{verb.casual.te.word}</span>
            </div>
            <div className="fc__card-row2">
              <span className="fc__card-kana">{verb.casual.te.kana}</span>
              <span className="fc__card-dot">·</span>
              <span className="fc__card-romaji">{kanaToRomaji(verb.casual.te.kana)}</span>
              <span className="fc__card-meaning">{verb.casual.te.meaning} · connecting / request form</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}


// ── Drill mini-strip — compact, always visible during quiz ────────────────────

function DrillStrip({ verb, currentIdx, revealed }) {
  function cellState(style, tense) {
    const key = `${style}_${tense}`
    if (revealed[key]) return revealed[key].correct ? 'correct' : 'wrong'
    const active = DRILL_ORDER[currentIdx]
    if (active && active.style === style && active.tense === tense) return 'active'
    return 'hidden'
  }

  return (
    <div className="ds">
      {STYLES.map(style => (
        <div key={style} className="ds__col">
          <div className={`ds__col-head ds__col-head--${style}`}>
            {style === 'polite' ? 'Polite' : 'Casual'}
          </div>
          {TENSES.map(tense => {
            const state = cellState(style, tense)
            const form  = verb[style][tense]
            const show  = state === 'correct' || state === 'wrong'
            return (
              <div key={tense} className={`ds__chip ds__chip--${state}`}>
                <span className="ds__chip-tense">{TENSE_LABELS[tense]}</span>
                {show ? (
                  <span className="ds__chip-word">{form.word}</span>
                ) : (
                  <span className="ds__chip-placeholder">
                    {state === 'active' ? '？' : '· ·'}
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
  const [phase, setPhase]           = useState('study')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed]     = useState({})
  const [options, setOptions]       = useState([])
  const [feedback, setFeedback]     = useState(null)
  const [selected, setSelected]     = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => { speak(verb.dict) }, [verb.dict])

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
    const correct = verb[style][tense].word
    const isRight = opt === correct

    setSelected(opt)
    setFeedback(isRight ? 'correct' : 'wrong')
    setRevealed(prev => ({
      ...prev,
      [`${style}_${tense}`]: { correct: isRight },
    }))

    if (isRight) { playCorrectSound(); setCorrectCount(c => c + 1) }
    else         { playWrongSound() }

    setTimeout(() => speak(correct), 350)

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

  // ── Complete
  if (phase === 'complete') {
    const perfect = correctCount === DRILL_ORDER.length
    return (
      <div className="vd-result">
        <div className="vd-result__card">
          <div className="vd-result__halftone" aria-hidden="true" />
          <p className="vd-result__overline">Complete</p>
          <div className="vd-result__icon"><VerbIcon verb={verb} size={52} /></div>
          <p className="vd-result__dict">{verb.dict}</p>
          <p className="vd-result__reading">{verb.kana} · {kanaToRomaji(verb.kana)}</p>
          <p className="vd-result__meaning">{verb.meaning}</p>
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

      {/* ── STUDY PHASE ── */}
      {phase === 'study' && (
        <>
          {/* Big postit verb card */}
          <div className="vd__verb-card">
            <span className="vd__tape" aria-hidden="true" />
            <div className="vd__halftone" aria-hidden="true" />
            {/* Type badge as corner tape */}
            <div className={`vd__type-tape vd__type-tape--${verb.type}`}>
              {TYPE_LABELS[verb.type]}
            </div>
            <div className="vd__verb-card-inner">
              <span className="vd__verb-icon">
                <VerbIcon verb={verb} size={40} />
              </span>
              <span className="vd__verb-dict">{verb.dict}</span>
              <div className="vd__verb-readings">
                <span className="vd__verb-kana">{verb.kana}</span>
                <span className="vd__verb-sep">·</span>
                <span className="vd__verb-romaji">{kanaToRomaji(verb.kana)}</span>
              </div>
              <span className="vd__verb-meaning">{verb.meaning}</span>
            </div>
          </div>

          {/* Scrapbook form cards */}
          <FormCards verb={verb} />

          {/* Example sentences */}
          <div className="vd__examples-label">Examples · tap to hear</div>
          {verb.examples.map((ex, i) => (
            <button
              key={i}
              className={`vd__example vd__example--tilt${i % 3}`}
              onClick={() => speak(ex.jp)}
            >
              <span className="vd__example-form">{FORM_LABELS[ex.form] ?? ex.form}</span>
              <span className="vd__example-jp">{ex.jp}</span>
              <span className="vd__example-kana">{ex.kana}</span>
              <span className="vd__example-en">{ex.en}</span>
            </button>
          ))}

          <button className="vd-btn vd-btn--primary" onClick={startDrill}>
            Start Drill →
          </button>
        </>
      )}

      {/* ── DRILL PHASE ── */}
      {phase === 'drill' && cell && (
        <>
          {/* Compact header */}
          <div className="vd__header">
            <div className="vd__header-jp">
              <span className="vd__header-icon"><VerbIcon verb={verb} size={20} /></span>
              <span className="vd__dict">{verb.dict}</span>
              <span className="vd__kana">{verb.kana} · {kanaToRomaji(verb.kana)}</span>
            </div>
            <div className="vd__header-right">
              <span className={`vd__badge vd__badge--${verb.type}`}>{TYPE_LABELS[verb.type]}</span>
              <span className="vd__meaning">{verb.meaning}</span>
            </div>
          </div>

          {/* Mini drill strip */}
          <DrillStrip verb={verb} currentIdx={currentIdx} revealed={revealed} />

          {/* Prompt card */}
          <div className={`vd__prompt-card ${feedback ? `vd__prompt-card--${feedback}` : ''}`}>
            <span className="vd__tape" aria-hidden="true" />
            <div className="vd__halftone" aria-hidden="true" />
            <div className="vd__prompt-inner">
              <span className="vd__prompt-style">
                {cell.style === 'polite' ? 'Polite' : 'Casual'}
              </span>
              <span className="vd__prompt-tense">{TENSE_LABELS[cell.tense]}</span>
              <span className="vd__prompt-hint">
                {verb[cell.style][cell.tense].meaning}
              </span>
            </div>
          </div>

          {/* 2×2 options */}
          <div className="vd__options" role="group" aria-label="Choose the correct form">
            {options.map((opt, i) => {
              const correctWord = verb[cell.style][cell.tense].word
              const optVerb = VERB_LIST.find(v => v[cell.style][cell.tense].word === opt)
              const optKana = optVerb ? optVerb[cell.style][cell.tense].kana : ''

              let state = ''
              if (feedback) {
                if (opt === correctWord)   state = 'correct'
                else if (opt === selected) state = 'wrong'
              }
              return (
                <button
                  key={i}
                  className={`vd__option ${state ? `vd__option--${state}` : ''}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                >
                  <span className="vd__option-word">{opt}</span>
                  {optKana && (
                    <>
                      <span className="vd__option-kana">{optKana}</span>
                      <span className="vd__option-romaji">{kanaToRomaji(optKana)}</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          {/* Progress dots with gap at polite/casual boundary */}
          <div className="vd__dots">
            {DRILL_ORDER.map((d, i) => {
              const key  = `${d.style}_${d.tense}`
              const done = revealed[key]
              return (
                <div
                  key={i}
                  className={[
                    'vd__dot',
                    i === 4                        ? 'vd__dot--gap'     : '',
                    i === currentIdx               ? 'vd__dot--active'  : '',
                    done &&  revealed[key].correct ? 'vd__dot--correct' : '',
                    done && !revealed[key].correct ? 'vd__dot--wrong'   : '',
                  ].filter(Boolean).join(' ')}
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
