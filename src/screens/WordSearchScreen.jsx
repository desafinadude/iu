import { useState, useEffect, useRef } from 'react'
import { buildPuzzle } from '../data/wordSearchData'
import { playCorrectSound } from '../utils/soundEffects'
import { speak } from '../utils/speech'
import './WordSearchScreen.css'

const WORD_COUNT = 7
const TIMER_MAX  = 120 // 2 minutes

// ─── Selection helpers ────────────────────────────────────────────

function getSelectedCells(start, current) {
  if (!start) return []
  if (!current || (current.row === start.row && current.col === start.col)) return [start]

  const dr  = current.row - start.row
  const dc  = current.col - start.col
  const len = Math.max(Math.abs(dr), Math.abs(dc))

  // Snap to the nearest of 8 directions
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

function ResultOverlay({ status, foundCount, totalCount, onPlayAgain }) {
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
  const [found,       setFound]       = useState([])   // word indices
  const [timeLeft,    setTimeLeft]    = useState(TIMER_MAX)
  const [status,      setStatus]      = useState('playing') // 'playing' | 'complete' | 'timeout'
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

  // Compute highlighted cell sets
  const selectedCells = getSelectedCells(dragStart, dragCurrent)
  const selectedSet   = new Set(selectedCells.map(({ row, col }) => `${row},${col}`))

  const foundCells = new Set()
  found.forEach(i => {
    puzzle.placements[i].cells.forEach(({ row, col }) => foundCells.add(`${row},${col}`))
  })

  // Pointer interaction helpers
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
        playCorrectSound()
        speak(puzzle.placements[idx].word.kana)
        setFound(prev => [...prev, idx])
      }
    }
    setDragStart(null)
    setDragCurrent(null)
  }

  function handleNewGame() {
    setPuzzle(buildPuzzle(WORD_COUNT))
    setFound([])
    setTimeLeft(TIMER_MAX)
    setStatus('playing')
    setDragStart(null)
    setDragCurrent(null)
  }

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="word-search">

      {/* Top: timer + score — always pinned at top */}
      <div className="ws-top">
        <TimerBar timeLeft={timeLeft} />
        <div className="ws-status">
          <span className="ws-status__time">{formatTime(timeLeft)}</span>
          <span className="ws-status__count">
            {found.length}/{puzzle.words.length} found
          </span>
        </div>
      </div>

      {/* Body: chips + grid — vertically centered in remaining space */}
      <div className="ws-body">

        {/* Word chips — tap to hear the word */}
        <div className="ws-words" aria-label="Words to find">
          {puzzle.words.map((word, i) => {
            const isFound = found.includes(i)
            return (
              <button
                key={i}
                className={`ws-chip${isFound ? ' ws-chip--found' : ''}`}
                onClick={() => speak(word.kana)}
                aria-label={`${word.meaning}${isFound ? ', found' : ', tap to hear'}`}
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

      {status !== 'playing' && (
        <ResultOverlay
          status={status}
          foundCount={found.length}
          totalCount={puzzle.words.length}
          onPlayAgain={handleNewGame}
        />
      )}
    </div>
  )
}
