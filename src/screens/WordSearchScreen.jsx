import { useState, useEffect, useRef } from 'react'
import { buildPuzzle } from '../data/wordSearchData'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import { speak } from '../utils/speech'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import './WordSearchScreen.css'

const WORD_COUNT = 7
const TIMER_MAX  = 180 // 3 minutes

// Pastel rainbow — one per word chip / found cell / result card
const CHIP_COLORS = [
  '#ffd6d6', // blush
  '#ffdfc2', // peach
  '#fff4b3', // butter
  '#d4f5d4', // mint
  '#c2dcff', // sky
  '#e0c8ff', // lavender
  '#ffc8ec', // rose
  '#c2f5ee', // aqua
  '#ffe8c2', // apricot
  '#d4ffc2', // pistachio
]

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

function Hearts({ lives }) {
  return (
    <div className="ws-hearts" aria-label={`${lives} hearts remaining`}>
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={`ws-heart${i < lives ? '' : ' ws-heart--lost'}`}>
          {i < lives ? '♥' : '♡'}
        </span>
      ))}
    </div>
  )
}

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

function ResultOverlay({ status, foundCount, totalCount, placements, onPlayAgain }) {
  const complete = status === 'complete'
  const failed   = status === 'failed'
  const icon  = complete ? '★' : failed ? '♡' : '⏰'
  const title = complete ? 'Complete!' : failed ? 'Out of Hearts!' : "Time's Up!"
  const sub   = complete ? 'All words found' : `${foundCount} of ${totalCount} words found`
  return (
    <div className="ws-overlay" role="dialog" aria-modal="true">
      <div className="ws-result">
        <span className="ws-result__icon" aria-hidden="true">{icon}</span>
        <h2 className="ws-result__title">{title}</h2>
        <p className="ws-result__sub">{sub}</p>

        <div className="ws-result__words">
          {placements.map((p, i) => {
            const color = CHIP_COLORS[i % CHIP_COLORS.length]
            return (
              <div key={i} className="ws-result__word-item" style={{ background: color }}>
                <div className="ws-result__word-header">
                  <span className="ws-result__word-jp">{p.word.display}</span>
                  <span className="ws-result__word-kana">{p.word.kana}</span>
                  <span className="ws-result__word-meaning">{p.word.meaning}</span>
                </div>
                {p.word.example && (
                  <button
                    className="ws-result__example"
                    onClick={() => speak(p.word.example.kana)}
                  >
                    <p className="ws-result__example-jp">{p.word.example.jp}</p>
                    <p className="ws-result__example-romaji">{kanaToRomaji(p.word.example.kana)}</p>
                    <p className="ws-result__example-en">{p.word.example.en}</p>
                    <span className="ws-result__example-hint">tap to hear</span>
                  </button>
                )}
              </div>
            )
          })}
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
  const [puzzle,      setPuzzle]      = useState(() => buildPuzzle(WORD_COUNT))
  const [dragStart,   setDragStart]   = useState(null)
  const [dragCurrent, setDragCurrent] = useState(null)
  const [found,       setFound]       = useState([])
  const [lives,       setLives]       = useState(3)
  const [timeLeft,    setTimeLeft]    = useState(TIMER_MAX)
  const [status,      setStatus]      = useState('playing')
  const gridRef = useRef(null)

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

  // Map each found cell to its word's color
  const foundCellColors = new Map()
  found.forEach(i => {
    const color = CHIP_COLORS[i % CHIP_COLORS.length]
    puzzle.placements[i].cells.forEach(({ row, col }) =>
      foundCellColors.set(`${row},${col}`, color)
    )
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
        // Correct word found
        playCorrectSound()
        speak(puzzle.placements[idx].word.kana)
        setFound(prev => [...prev, idx])
      } else {
        // Only penalise if it's not a re-selection of an already-found word
        const alreadyFound = puzzle.placements.some((p, i) =>
          found.includes(i) && p.word.display === text
        )
        if (!alreadyFound) {
          playWrongSound()
          setLives(prev => {
            const next = prev - 1
            if (next <= 0) setStatus('failed')
            return next
          })
        }
      }
    }
    setDragStart(null)
    setDragCurrent(null)
  }

  function handleNewGame() {
    setPuzzle(buildPuzzle(WORD_COUNT))
    setFound([])
    setLives(3)
    setTimeLeft(TIMER_MAX)
    setStatus('playing')
    setDragStart(null)
    setDragCurrent(null)
  }

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="word-search">

      <div className="ws-top">
        <div className="ws-hud">
          <Hearts lives={lives} />
          <span className="ws-hud__count">{found.length}/{puzzle.words.length}</span>
        </div>
        <TimerBar timeLeft={timeLeft} />
        <span className="ws-hud__time">{formatTime(timeLeft)}</span>
      </div>

      <div className="ws-body">

        {/* Word chips — tap to hear */}
        <div className="ws-words" aria-label="Words to find">
          {puzzle.words.map((word, i) => {
            const isFound = found.includes(i)
            const color   = CHIP_COLORS[i % CHIP_COLORS.length]
            return (
              <button
                key={i}
                className={`ws-chip${isFound ? ' ws-chip--found' : ''}`}
                style={{ background: color }}
                onClick={() => speak(word.kana)}
                aria-label={`${word.meaning}, tap to hear`}
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
            const row        = Math.floor(idx / puzzle.size)
            const col        = idx % puzzle.size
            const key        = `${row},${col}`
            const isSel      = selectedSet.has(key)
            const foundColor = foundCellColors.get(key)
            return (
              <div
                key={key}
                className={`ws-cell${isSel ? ' ws-cell--selected' : ''}${foundColor ? ' ws-cell--found' : ''}`}
                style={foundColor ? { background: foundColor } : undefined}
                aria-hidden="true"
              >
                {char}
              </div>
            )
          })}
        </div>

      </div>

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
