import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { VOCAB_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'
import { speak } from '../utils/speech'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import './SentenceBuilderScreen.css'

// ─── Vocabulary buckets ────────────────────────────────────────────────────

const SUBJECTS  = VOCAB_LIST.filter(w => w.type === 'pronoun' || (w.type === 'noun' && w.theme === 'people'))
const OBJECTS   = VOCAB_LIST.filter(w => w.type === 'noun' && ['animal','food','home','clothing','body','nature','transport'].includes(w.theme))
const LOCATIONS = VOCAB_LIST.filter(w => w.type === 'noun' && w.theme === 'places')
const TIME_WORDS = VOCAB_LIST.filter(w => w.type === 'noun' && ['time','calendar'].includes(w.theme))
const ADVERBS   = VOCAB_LIST.filter(w => w.type === 'adverb')

// ─── Particles available per role ─────────────────────────────────────────

const ROLE_PARTICLES = {
  subject:  ['は', 'が'],
  object:   ['を', 'は'],
  location: ['で', 'に', 'へ', 'から', 'まで'],
  time:     ['に', 'は', 'から', 'まで'],
  adverb:   [],
  verb:     [],
}

const DEFAULT_PARTICLE = {
  subject:  'は',
  object:   'を',
  location: 'で',
  time:     'に',
  adverb:   null,
  verb:     null,
}

const CHIP_COLORS = {
  subject:  '#c2dcff',
  object:   '#ffd6d6',
  location: '#d4f5d4',
  time:     '#fff4b3',
  adverb:   '#e0c8ff',
  verb:     '#ffdfc2',
}

// ─── Tabs ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'subject',  label: 'Subject',  iconName: 'User',       words: SUBJECTS,   role: 'subject'  },
  { id: 'time',     label: 'Time',     iconName: 'Clock',      words: TIME_WORDS, role: 'time'     },
  { id: 'object',   label: 'Object',   iconName: 'Package',    words: OBJECTS,    role: 'object'   },
  { id: 'location', label: 'Location', iconName: 'MapPin',     words: LOCATIONS,  role: 'location' },
  { id: 'adverb',   label: 'Adverb',   iconName: 'Zap',        words: ADVERBS,    role: 'adverb'   },
  { id: 'verb',     label: 'Verb',     iconName: 'PlayCircle', words: VERB_LIST,  role: 'verb'     },
]

// ─── Grammar validator ─────────────────────────────────────────────────────

function validateSentence(chips) {
  if (chips.length === 0) return null

  const issues = []
  const passes = []

  const verbIdx = chips.findLastIndex(c => c.role === 'verb')

  if (verbIdx === -1) {
    return { valid: false, issues: ['Add a verb to complete the sentence.'], passes: [] }
  }

  // Verb last
  if (verbIdx === chips.length - 1) {
    passes.push('Verb is at the end — correct Japanese word order!')
  } else {
    issues.push('In Japanese the verb comes at the end of the sentence.')
  }

  // Objects before verb
  const lateObj = chips.findIndex((c, i) => c.particle === 'を' && i > verbIdx)
  if (lateObj !== -1) {
    issues.push('Objects marked with を must come before the verb.')
  } else if (chips.some(c => c.particle === 'を')) {
    passes.push('Object (を) is correctly placed before the verb.')
  }

  // Location before verb
  const lateLoc = chips.findIndex((c, i) => (c.particle === 'で' || c.particle === 'に') && c.role === 'location' && i > verbIdx)
  if (lateLoc !== -1) {
    issues.push('Location phrases (で / に) should come before the verb.')
  }

  // Time before subject
  const timeIdx  = chips.findIndex(c => c.role === 'time')
  const subjectIdx = chips.findIndex(c => c.role === 'subject')
  if (timeIdx !== -1 && subjectIdx !== -1) {
    if (timeIdx < subjectIdx) {
      passes.push('Time expression at the start — natural Japanese ordering.')
    } else {
      issues.push('Time expressions usually come at the start, before the subject.')
    }
  }

  // Negative adverbs need negative verb
  const negAdverbs = ['あまり', 'ぜんぜん']
  const negAdverbChip = chips.find(c => negAdverbs.includes(c.kana))
  if (negAdverbChip) {
    const verbChip = chips[verbIdx]
    const neg = verbChip?.kana?.includes('ない') || verbChip?.kana?.includes('ません')
    if (neg) {
      passes.push(`「${negAdverbChip.word}」correctly paired with a negative verb form.`)
    } else {
      issues.push(`「${negAdverbChip.word}」is used with negative verb forms (ない / ません).`)
    }
  }

  return { valid: issues.length === 0, issues, passes }
}

// ─── Verb form picker ──────────────────────────────────────────────────────

function VerbFormPicker({ verb, onSelect, onBack }) {
  const rows = [
    { register: 'polite', label: 'Polite' },
    { register: 'casual', label: 'Casual' },
  ]
  const cols = [
    { key: 'present_pos', label: 'Pres +' },
    { key: 'present_neg', label: 'Pres −' },
    { key: 'past_pos',    label: 'Past +' },
    { key: 'past_neg',    label: 'Past −' },
  ]

  return (
    <div className="sb-verb-picker">
      <div className="sb-verb-picker__header">
        <button className="sb-verb-picker__back" onClick={onBack} aria-label="Back to verb list">
          <LucideIcons.ChevronLeft size={16} aria-hidden="true" /> Back
        </button>
        <span className="sb-verb-picker__dict">{verb.dict}</span>
        <span className="sb-verb-picker__meaning">{verb.meaning}</span>
      </div>
      <div className="sb-verb-picker__grid">
        {rows.flatMap(row =>
          cols.map(col => {
            const form = verb[row.register][col.key]
            return (
              <button
                key={`${row.register}-${col.key}`}
                className="sb-verb-form-btn"
                style={{ '--chip-color': CHIP_COLORS.verb }}
                onClick={() => onSelect({ word: form.word, kana: form.kana, meaning: form.meaning })}
              >
                <span className="sb-verb-form-btn__word">{form.word}</span>
                <span className="sb-verb-form-btn__kana">{form.kana}</span>
                <span className="sb-verb-form-btn__label">{row.label} · {col.label}</span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── Word picker item ──────────────────────────────────────────────────────

function WordItem({ word, role, onClick }) {
  const showKana   = word.word !== word.kana
  const romaji     = kanaToRomaji(word.kana)
  const showRomaji = romaji !== word.kana

  return (
    <button
      className="sb-word-item"
      style={{ '--chip-color': CHIP_COLORS[role] }}
      onClick={() => onClick(word)}
    >
      <span className="sb-word-item__word">{word.word}</span>
      <span className="sb-word-item__meta">
        {showKana && <span className="sb-word-item__kana">{word.kana}</span>}
        {showRomaji && <span className="sb-word-item__romaji">{romaji}</span>}
        <span className="sb-word-item__meaning">{word.meaning}</span>
      </span>
    </button>
  )
}

// ─── Sentence chip ─────────────────────────────────────────────────────────

function SentenceChip({ chip, isSelected, onTap, onRemove, onCycleParticle }) {
  const particles = ROLE_PARTICLES[chip.role]

  return (
    <div
      className={`sb-chip${isSelected ? ' sb-chip--selected' : ''}`}
      style={{ '--chip-color': CHIP_COLORS[chip.role] }}
    >
      <button
        className="sb-chip__body"
        onClick={onTap}
        aria-label={`${chip.word}${chip.particle ?? ''} — tap to select for reordering`}
      >
        <span className="sb-chip__word">{chip.word}</span>
        {chip.word !== chip.kana && (
          <span className="sb-chip__kana">{chip.kana}</span>
        )}
        <span className="sb-chip__meaning">{chip.meaning}</span>
      </button>
      {particles.length > 0 && (
        <button
          className="sb-chip__particle"
          onClick={onCycleParticle}
          aria-label={`Particle ${chip.particle} — tap to change`}
        >
          {chip.particle}
        </button>
      )}
      <button className="sb-chip__remove" onClick={onRemove} aria-label="Remove word">
        <LucideIcons.X size={12} strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────

export default function SentenceBuilderScreen() {
  const [activeTab,   setActiveTab]   = useState('subject')
  const [sentence,    setSentence]    = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [activeVerb,  setActiveVerb]  = useState(null)
  const [checkResult, setCheckResult] = useState(null)
  const [copied,      setCopied]      = useState(false)

  const currentTab = TABS.find(t => t.id === activeTab)

  // ── Word / verb selection ──────────────────────────────────────────────

  function handleWordClick(word) {
    if (activeTab === 'verb') {
      setActiveVerb(word)
      return
    }
    const chip = {
      id:       `${word.word}-${Date.now()}`,
      word:     word.word,
      kana:     word.kana,
      meaning:  word.meaning,
      role:     activeTab,
      particle: DEFAULT_PARTICLE[activeTab],
    }
    setSentence(prev => [...prev, chip])
    setCheckResult(null)
    setSelectedIdx(null)
  }

  function handleVerbFormSelect(form) {
    const chip = {
      id:      `verb-${Date.now()}`,
      word:    form.word,
      kana:    form.kana,
      meaning: form.meaning,
      role:    'verb',
      particle: null,
    }
    setSentence(prev => [...prev, chip])
    setActiveVerb(null)
    setCheckResult(null)
    setSelectedIdx(null)
  }

  // ── Chip interactions ──────────────────────────────────────────────────

  function handleChipTap(idx) {
    if (selectedIdx === null) {
      setSelectedIdx(idx)
    } else if (selectedIdx === idx) {
      setSelectedIdx(null)
    } else {
      setSentence(prev => {
        const next = [...prev]
        ;[next[selectedIdx], next[idx]] = [next[idx], next[selectedIdx]]
        return next
      })
      setSelectedIdx(null)
      setCheckResult(null)
    }
  }

  function removeChip(idx) {
    setSentence(prev => prev.filter((_, i) => i !== idx))
    if (selectedIdx === idx) setSelectedIdx(null)
    setCheckResult(null)
  }

  function cycleParticle(idx) {
    setSentence(prev => {
      const chip    = prev[idx]
      const options = ROLE_PARTICLES[chip.role]
      if (!options.length) return prev
      const next = [...prev]
      const cur  = options.indexOf(chip.particle)
      next[idx]  = { ...chip, particle: options[(cur + 1) % options.length] }
      return next
    })
    setCheckResult(null)
  }

  // ── Actions ────────────────────────────────────────────────────────────

  function handleCheck() {
    const result = validateSentence(sentence)
    setCheckResult(result)
    if (result?.valid) playCorrectSound()
    else               playWrongSound()
  }

  function handleSpeak() {
    const kana = sentence.map(c => c.kana + (c.particle ?? '')).join('')
    if (kana) speak(kana)
  }

  function handleCopy() {
    const text = sentence.map(c => c.word + (c.particle ?? '')).join('') + '。'
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleClear() {
    setSentence([])
    setSelectedIdx(null)
    setCheckResult(null)
    setActiveVerb(null)
  }

  const hasChips = sentence.length > 0

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="sb-screen">

      {/* ── Sentence construction area ─────────────────────────────────── */}
      <div className="sb-sentence-area">
        {sentence.length === 0 ? (
          <p className="sb-sentence-hint">Pick words below to build a sentence</p>
        ) : (
          <div className="sb-sentence-chips">
            {sentence.map((chip, idx) => (
              <SentenceChip
                key={chip.id}
                chip={chip}
                isSelected={selectedIdx === idx}
                onTap={() => handleChipTap(idx)}
                onRemove={() => removeChip(idx)}
                onCycleParticle={() => cycleParticle(idx)}
              />
            ))}
            <span className="sb-sentence-maru">。</span>
          </div>
        )}
        {selectedIdx !== null && (
          <p className="sb-swap-hint">Tap another word to swap positions</p>
        )}
      </div>

      {/* ── Validation result ──────────────────────────────────────────── */}
      {checkResult && (
        <div className={`sb-result ${checkResult.valid ? 'sb-result--valid' : 'sb-result--invalid'}`}>
          {checkResult.valid
            ? <p className="sb-result__title">Looks correct!</p>
            : <p className="sb-result__title">A few things to check:</p>
          }
          {checkResult.issues.map((msg, i) => (
            <p key={i} className="sb-result__row sb-result__row--issue">✗ {msg}</p>
          ))}
          {checkResult.passes.map((msg, i) => (
            <p key={i} className="sb-result__row sb-result__row--pass">✓ {msg}</p>
          ))}
        </div>
      )}

      {/* ── Word picker ────────────────────────────────────────────────── */}
      <div className="sb-picker">

        {/* Tab bar */}
        <div className="sb-tabs" role="tablist">
          {TABS.map(tab => {
            const Icon = LucideIcons[tab.iconName]
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`sb-tab${activeTab === tab.id ? ' sb-tab--active' : ''}`}
                style={activeTab === tab.id ? { '--tab-color': CHIP_COLORS[tab.role] } : undefined}
                onClick={() => { setActiveTab(tab.id); setActiveVerb(null) }}
              >
                {Icon && <Icon size={13} strokeWidth={2} aria-hidden="true" />}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Word list / verb form picker */}
        <div className="sb-word-list">
          {activeTab === 'verb' && activeVerb ? (
            <VerbFormPicker
              verb={activeVerb}
              onSelect={handleVerbFormSelect}
              onBack={() => setActiveVerb(null)}
            />
          ) : (
            currentTab.words.map((word, i) => (
              <WordItem
                key={`${word.word ?? word.dict}-${i}`}
                word={activeTab === 'verb' ? { word: word.dict, kana: word.kana, meaning: word.meaning } : word}
                role={activeTab}
                onClick={handleWordClick}
              />
            ))
          )}
        </div>

      </div>

      {/* ── Action bar ─────────────────────────────────────────────────── */}
      <div className="sb-actions">
        <button
          className="sb-action-btn sb-action-btn--check"
          onClick={handleCheck}
          disabled={!hasChips}
        >
          Check
        </button>
        <button
          className="sb-action-btn sb-action-btn--icon"
          onClick={handleSpeak}
          disabled={!hasChips}
          aria-label="Speak sentence"
        >
          <LucideIcons.Volume2 size={18} aria-hidden="true" />
        </button>
        <button
          className={`sb-action-btn sb-action-btn--icon${copied ? ' sb-action-btn--copied' : ''}`}
          onClick={handleCopy}
          disabled={!hasChips}
          aria-label={copied ? 'Copied!' : 'Copy sentence'}
        >
          {copied
            ? <LucideIcons.Check size={18} aria-hidden="true" />
            : <LucideIcons.Copy  size={18} aria-hidden="true" />
          }
        </button>
        <button
          className="sb-action-btn sb-action-btn--icon sb-action-btn--clear"
          onClick={handleClear}
          disabled={!hasChips}
          aria-label="Clear sentence"
        >
          <LucideIcons.Trash2 size={18} aria-hidden="true" />
        </button>
      </div>

    </div>
  )
}
