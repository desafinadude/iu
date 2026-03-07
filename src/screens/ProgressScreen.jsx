import { useState, useCallback } from 'react'
import { ALL_CHARS, GOJUON_ROWS, DAKUTEN_ROWS, HANDAKUTEN_ROWS } from '../data/kana.js'
import { MASTERY_MAX } from '../hooks/useQuiz.js'
import { VOCAB_LIST } from '../data/vocabData.js'
import { speak } from '../utils/speech.js'
import './ProgressScreen.css'

const TABS = [
  { id: 'kana_to_romaji', label: 'Kana → Romaji' },
  { id: 'romaji_to_kana', label: 'Romaji → Kana' },
  { id: 'kana_match',     label: 'Kana → Kana'   },
  { id: 'vocab',          label: 'Vocab'          },
]

function readMastery(mode) {
  try {
    return JSON.parse(localStorage.getItem(`koikata_mastery_v1_${mode}`)) ?? {}
  } catch {
    return {}
  }
}

// All chars from all rows, in order
const ALL_KANA = [
  ...GOJUON_ROWS.flatMap(r => r.chars.filter(Boolean)),
  ...DAKUTEN_ROWS.flatMap(r => r.chars.filter(Boolean)),
  ...HANDAKUTEN_ROWS.flatMap(r => r.chars.filter(Boolean)),
]

function getCards(mode, mastery) {
  if (mode === 'romaji_to_kana') {
    // Two cards per char — one hiragana, one katakana
    const cards = [
      ...ALL_KANA.map(c => ({ display: c.hiragana, romaji: c.romaji, key: `${c.romaji}_hiragana` })),
      ...ALL_KANA.map(c => ({ display: c.katakana, romaji: c.romaji, key: `${c.romaji}_katakana` })),
    ]
    return cards
      .map(c => ({ ...c, mastery: mastery[c.key] ?? 0 }))
      .sort((a, b) => a.mastery - b.mastery)
  }

  if (mode === 'kana_match') {
    return ALL_KANA
      .map(c => ({ display: c.hiragana, display2: c.katakana, romaji: c.romaji, key: c.romaji, mastery: mastery[c.romaji] ?? 0 }))
      .sort((a, b) => a.mastery - b.mastery)
  }

  // kana_to_romaji — one card per char (hiragana displayed)
  return ALL_KANA
    .map(c => ({ display: c.hiragana, romaji: c.romaji, key: c.romaji, mastery: mastery[c.romaji] ?? 0 }))
    .sort((a, b) => a.mastery - b.mastery)
}

function KanaCard({ card }) {
  const mastered = card.mastery >= MASTERY_MAX
  return (
    <div className={`progress-card ${mastered ? 'progress-card--mastered' : ''} ${card.mastery === 0 ? 'progress-card--untouched' : ''}`}>
      {mastered && <span className="progress-card__star" aria-label="Mastered">★</span>}
      <span className="progress-card__kana">{card.display}</span>
      {card.display2 && (
        <span className="progress-card__kana2">{card.display2}</span>
      )}
      <span className="progress-card__romaji">{card.romaji}</span>
      <div className="progress-card__mastery" aria-label={`Mastery: ${card.mastery} of ${MASTERY_MAX}`}>
        <span className="progress-card__mastery-label">{card.mastery}/{MASTERY_MAX}</span>
        <div className="progress-card__dots">
          {Array.from({ length: MASTERY_MAX }, (_, i) => (
            <span key={i} className={`progress-card__dot ${i < card.mastery ? 'progress-card__dot--filled' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function readSeenVocab() {
  try {
    return new Set(JSON.parse(localStorage.getItem('koikata_vocab_seen_v1')) ?? [])
  } catch {
    return new Set()
  }
}

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState('kana_to_romaji')
  const [seenVocab, setSeenVocab] = useState(readSeenVocab)

  const isVocab = activeTab === 'vocab'
  const mastery = isVocab ? {} : readMastery(activeTab)
  const cards   = isVocab ? [] : getCards(activeTab, mastery)

  const handleVocabTap = useCallback((item) => {
    speak(item.kana)
    setSeenVocab(prev => {
      if (prev.has(item.kana)) return prev
      const next = new Set(prev)
      next.add(item.kana)
      localStorage.setItem('koikata_vocab_seen_v1', JSON.stringify([...next]))
      return next
    })
  }, [])

  const masteredCount = cards.filter(c => c.mastery >= MASTERY_MAX).length
  const touchedCount  = cards.filter(c => c.mastery > 0).length

  return (
    <div className="progress-screen">
      {/* Tabs */}
      <div className="progress-screen__tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`progress-screen__tab ${activeTab === t.id ? 'progress-screen__tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            aria-pressed={activeTab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isVocab ? (
        /* ── Vocab list ── */
        <div className="progress-screen__vocab">
          {VOCAB_LIST.map((item, i) => (
            <button
              key={i}
              className={`vocab-row${seenVocab.has(item.kana) ? '' : ' vocab-row--unseen'}`}
              onClick={() => handleVocabTap(item)}
              aria-label={`${item.meaning} — tap to hear`}
            >
              <span className="vocab-row__japanese">{item.word}</span>
              {item.word !== item.kana && (
                <span className="vocab-row__kana">{item.kana}</span>
              )}
              <span className="vocab-row__meaning">{item.meaning}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="progress-screen__summary">
            <span className="progress-screen__stat">
              <strong>{masteredCount}</strong> mastered
            </span>
            <span className="progress-screen__stat-sep">·</span>
            <span className="progress-screen__stat">
              <strong>{touchedCount - masteredCount}</strong> in progress
            </span>
            <span className="progress-screen__stat-sep">·</span>
            <span className="progress-screen__stat">
              <strong>{cards.length - touchedCount}</strong> not started
            </span>
          </div>

          {/* Grid */}
          <div className="progress-screen__grid">
            {cards.map(card => (
              <KanaCard key={card.key} card={card} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
