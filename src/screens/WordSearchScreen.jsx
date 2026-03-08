import { useState, useEffect, useRef } from 'react'
import { buildPuzzle } from '../data/wordSearchData'
import { playCorrectSound } from '../utils/soundEffects'
import { speak } from '../utils/speech'
import './WordSearchScreen.css'

const WORD_COUNT = 7
const TIMER_MAX  = 180 // 3 minutes

// ─── Selection helpers ────────────────────────────────────────────

function getSelectedCells(start, current) {
  if (!start) return []
  if (!current || (current.row === start.row && current.col === start.col)) return [start]

  const dr  = current.row - start.row
  const dc  = current.col - start.col
  const len = Math.max(Math.abs(dr), Math.abs(dc))

  const stepR = Math.round(dr / len)
  const stepC = Math.round(dc / len)

  return Array.from({ length: len + 1 }, (_, i) => ({
    row: start.row + i * stepR,
    col: start.col + i * stepC,
  }))
}

// ─── Components ───────────────────────────────────────────────────

function TimerBar({ timeLeft }) {
  const pct = (timeLeft / TIMER_MAX) * 100
  const urgent = timeLeft < 30
  return (
    <div className="ws-timer-bar">
      <div
        className={`ws-timer-fill ${urgent ? 'ws-timer-fill--urgent' : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function WordDetailModal({ word, onClose }) {
  return (
    <div className="ws-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ws-detail" onClick={e => e.stopPropagation()}>

        <div className="ws-detail__word">
          <span className="ws-detail__jp">{word.display}</span>
          <span className="ws-detail__kana">{word.kana}</span>
          <span className="ws-detail__meaning">{word.meaning}</span>
        </div>

        {word.example && (
          <button className="ws-detail__sentence" onClick={() => speak(word.example.kana)}>
            <p className="ws-detail__s-jp">{word.example.jp}</p>
            <p className="ws-detail__s-kana">{word.example.kana}</p>
            <p className="ws-detail__s-en">{word.example.en}</p>
            <span className="ws-detail__s-hint">tap to hear</span>
          </button>
        )}

        {word.related?.length > 0 && (
          <div className="ws-detail__related">
            {word.related.map((s, i) => (
              <button
                key={i}
                className={`ws-detail__rel ws-detail__rel--${s.sign === '+' ? 'pos' : 'neg'}`}
                onClick={() => speak(s.kana)}
              >
                <span className="ws-detail__sign">{s.sign === '+' ? '＋' : '－'}</span>
                <div className="ws-detail__rel-text">
                  <p className="ws-detail__rel-jp">{s.jp}</p>
                  <p className="ws-detail__rel-en">{s.en}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <button className="ws-detail__close" onClick={onClose}>close</button>
      </div>
    </div>
  )
}

function ResultOverlay({ status, foundCount, totalCount, placements, onPlayAgain }) {
  const complete = status === 'complete'
  return (
    <div className="ws-overlay" role="dialog" aria-modal="true">
      <div className="ws-result">
        <span className="ws-result__icon" aria-hidden="true">{complete ? '★' : '⏰'}</span>
        <h2 className="ws-result__title">{complete ? 'Complete!' : "Time's Up!"}</h2>
        <p className="ws-result__sub">
          {complete
            ? 'All words found'
            : `${foundCount} of ${totalCount} words found`}
        </p>

        <div className="ws-result__words">
          {placements.map((p, i) => (
            <div key={i} className="ws-result__word-item">
              <div className="ws-result__word-header">
                <span className="ws-result__word-jp">{p.word.display}</span>
                <span className="ws-result__word-meaning">{p.word.meaning}</span>
              </div>
              {p.word.example && (
                <div className="ws-result__word-example">
                  <p className="ws-result__example-jp">{p.word.example.jp}</p>
                  <p className="ws-result__example-en">{p.word.example.en}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="ws-result__btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────

export default function WordSearchScreen() {
  const [puzzle,          setPuzzle]          = useState(() => buildPuzzle(WORD_COUNT))
  const [dragStart,       setDragStart]       = useState(null)
  const [dragCurrent,     setDragCurrent]     = useState(null)
  const [found,           setFound]           = useState([])
  const [timeLeft,        setTimeLeft]        = useState(TIMER_MAX)
  const [status,          setStatus]          = useState('playing')
  const [exampleSentence, setExampleSentence] = useState(null)
  const [detailWord,      setDetailWord]      = useState(null)

  const gridRef        = useRef(null)
  const longPressRef   = useRef(null)
  const didLongPress   = useRef(false)

  // Timer countdown
  useEffect(() => {
    if (status !== 'playing') return
    if (timeLeft <= 0) { setStatus('timeout'); return }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, status])

  // Check for completion
  useEffect(() => {
    if (found.length > 0 && found.length === puzzle.placements.length) {
      setStatus('complete')
    }
  }, [found, puzzle.placements.length])

  const selectedCells = getSelectedCells(dragStart, dragCurrent)
  const selectedSet   = new Set(selectedCells.map(({ row, col }) => `${row},${col}`))

  const foundCells = new Set()
  found.forEach(i => {
    puzzle.placements[i].cells.forEach(({ row, col }) => foundCells.add(`${row},${col}`))
  })

  function getCellFromPointer(e) {
    const el = gridRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const col = Math.floor(((e.clientX - rect.left) / rect.width)  * puzzle.size)
    const row = Math.floor(((e.clientY - rect.top)  / rect.height) * puzzle.size)
    if (row < 0 || row >= puzzle.size || col < 0 || col >= puzzle.size) return null
    return { row, col }
  }

  function handlePointerDown(e) {
    if (status !== 'playing') return
    e.currentTarget.setPointerCapture(e.pointerId)
    const cell = getCellFromPointer(e)
    if (cell) { setDragStart(cell); setDragCurrent(cell) }
  }

  function handlePointerMove(e) {
    if (!dragStart || status !== 'playing') return
    const cell = getCellFromPointer(e)
    if (cell) setDragCurrent(cell)
  }

  function finalizeSelection() {
    if (!dragStart) return
    const cells = getSelectedCells(dragStart, dragCurrent)
    if (cells.length >= 2) {
      const text = cells.map(({ row, col }) => puzzle.grid[row][col]).join('')
      const idx  = puzzle.placements.findIndex((p, i) =>
        !found.includes(i) && p.word.display === text
      )
      if (idx !== -1) {
        const word = puzzle.placements[idx].word
        playCorrectSound()
        // Speak the example sentence, falling back to the word itself
        speak(word.example?.kana ?? word.kana)
        setFound(prev => [...prev, idx])
        if (word.example) setExampleSentence(word.example)
      }
    }
    setDragStart(null)
    setDragCurrent(null)
  }

  // Long-press on chip to preview example; regular tap differs by found state
  function handleChipPointerDown(word) {
    didLongPress.current = false
    longPressRef.current = setTimeout(() => {
      didLongPress.current = true
      if (word.example) setExampleSentence(word.example)
    }, 500)
  }

  function handleChipPointerUp() {
    clearTimeout(longPressRef.current)
    longPressRef.current = null
  }

  function handleChipClick(word, isFound) {
    if (didLongPress.current) { didLongPress.current = false; return }
    if (isFound) {
      setDetailWord(word)
    } else {
      speak(word.kana)
    }
  }

  function handleNewGame() {
    setPuzzle(buildPuzzle(WORD_COUNT))
    setFound([])
    setTimeLeft(TIMER_MAX)
    setStatus('playing')
    setDragStart(null)
    setDragCurrent(null)
    setExampleSentence(null)
    setDetailWord(null)
  }

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="word-search">

      <div className="ws-top">
        <TimerBar timeLeft={timeLeft} />
        <div className="ws-status">
          <span className="ws-status__time">{formatTime(timeLeft)}</span>
          <span className="ws-status__count">
            {found.length}/{puzzle.words.length} found
          </span>
        </div>
      </div>

      <div className="ws-body">

        {/* Word chips — unfound: tap to hear / long-press for example
                        found (yellow): tap to open detail modal         */}
        <div className="ws-words" aria-label="Words to find">
          {puzzle.words.map((word, i) => {
            const isFound = found.includes(i)
            return (
              <button
                key={i}
                className={`ws-chip${isFound ? ' ws-chip--found' : ''}`}
                onClick={() => handleChipClick(word, isFound)}
                onPointerDown={() => handleChipPointerDown(word)}
                onPointerUp={handleChipPointerUp}
                onPointerLeave={handleChipPointerUp}
                onPointerCancel={handleChipPointerUp}
                aria-label={`${word.meaning}${isFound ? ', found — tap for details' : ', tap to hear'}`}
              >
                {word.meaning}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="ws-grid"
          style={{ '--grid-size': puzzle.size }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finalizeSelection}
          onPointerCancel={finalizeSelection}
        >
          {puzzle.grid.flat().map((char, idx) => {
            const row   = Math.floor(idx / puzzle.size)
            const col   = idx % puzzle.size
            const key   = `${row},${col}`
            const isSel   = selectedSet.has(key)
            const isFound = foundCells.has(key)
            return (
              <div
                key={key}
                className={`ws-cell${isSel ? ' ws-cell--selected' : ''}${isFound ? ' ws-cell--found' : ''}`}
                aria-hidden="true"
              >
                {char}
              </div>
            )
          })}
        </div>

      </div>

      {/* Floating example — shows on find or long-press; tap to dismiss */}
      {exampleSentence && !detailWord && status === 'playing' && (
        <div className="ws-example" onClick={() => setExampleSentence(null)}>
          <p className="ws-example__jp">{exampleSentence.jp}</p>
          <p className="ws-example__kana">{exampleSentence.kana}</p>
          <p className="ws-example__en">{exampleSentence.en}</p>
        </div>
      )}

      {/* Word detail modal — tap found chip to open */}
      {detailWord && (
        <WordDetailModal word={detailWord} onClose={() => setDetailWord(null)} />
      )}

      {status !== 'playing' && (
        <ResultOverlay
          status={status}
          foundCount={found.length}
          totalCount={puzzle.words.length}
          placements={puzzle.placements}
          onPlayAgain={handleNewGame}
        />
      )}
    </div>
  )
}
