import { useState, useEffect, useRef } from 'react'
import * as LucideIcons from 'lucide-react'
import { buildPuzzle, THEMES } from '../data/wordSearchData'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import { speak } from '../utils/speech'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import { MenuCard, MenuCardList } from '../components/ui/menu-card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { cn } from '../lib/utils'

const WORD_COUNT = 7
const TIMER_MAX = 180 // 3 minutes

// Pastel rainbow colors for found words
const CHIP_COLORS = [
  '#ffd6d6', '#ffdfc2', '#fff4b3', '#d4f5d4', '#c2dcff',
  '#e0c8ff', '#ffc8ec', '#c2f5ee', '#ffe8c2', '#d4ffc2',
]

// ─── Helper Functions ─────────────────────────────────────────────

function getSelectedCells(start, current) {
  if (!start) return []
  if (!current || (current.row === start.row && current.col === start.col)) return [start]
  const dr = current.row - start.row
  const dc = current.col - start.col
  const len = Math.max(Math.abs(dr), Math.abs(dc))
  const stepR = Math.round(dr / len)
  const stepC = Math.round(dc / len)
  return Array.from({ length: len + 1 }, (_, i) => ({
    row: start.row + i * stepR,
    col: start.col + i * stepC,
  }))
}

// ─── Components ───────────────────────────────────────────────────

function GameHUD({ lives, timeLeft, foundCount, totalCount }) {
  const timerPct = (timeLeft / TIMER_MAX) * 100
  const isUrgent = timeLeft < 30

  return (
    <div className="space-y-2">
      {/* Lives and Progress */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-container rounded-xl">
        <div className="flex items-center gap-2" aria-label={`${lives} lives remaining`}>
          {[...Array(3)].map((_, i) => (
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
        <div className="text-title-medium">
          <span className="font-bold">{foundCount}</span>
          <span className="text-muted-foreground"> / {totalCount}</span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isUrgent ? 'bg-destructive' : 'bg-primary'
          )}
          style={{ width: `${timerPct}%` }}
        />
      </div>
    </div>
  )
}

function WordChips({ words, found, onSpeak, hiddenWords }) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {words.map((word, i) => {
        const isFound = found.includes(i)
        const isHidden = hiddenWords.has(i) && !isFound
        const color = CHIP_COLORS[i % CHIP_COLORS.length]
        
        return (
          <button
            key={i}
            onClick={() => onSpeak(word.kana)}
            className={cn(
              'px-3 py-1.5 rounded-full text-body-small font-medium transition-all',
              'hover:scale-105 active:scale-95',
              isFound ? 'opacity-100' : 'opacity-40'
            )}
            style={{ backgroundColor: color }}
            aria-label={isHidden ? 'hidden word, tap to hear' : `${word.meaning}, tap to hear`}
          >
            <div className="flex items-center gap-1">
              <span>{isHidden ? '????' : word.meaning}</span>
              {!isHidden && word.script === 'kana' && word.hasKanji && (
                <span className="text-label-small opacity-70">か</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function ResultDialog({ open, status, foundCount, totalCount, placements, onPlayAgain, onNewTheme }) {
  const complete = status === 'complete'
  const failed = status === 'failed'
  const icon = complete ? '★' : failed ? '♡' : '⏰'
  const title = complete ? 'Complete!' : failed ? 'Out of Hearts!' : "Time's Up!"
  const subtitle = complete ? 'All words found' : `${foundCount} of ${totalCount} words found`

  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          <div className={cn(
            'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md3-2',
            complete ? 'bg-gradient-to-br from-green-500 to-green-700' :
            failed ? 'bg-gradient-to-br from-red-500 to-red-700' :
            'bg-gradient-to-br from-orange-500 to-orange-700'
          )}>
            <span className="text-4xl">{icon}</span>
          </div>
          
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
        </div>

        {/* Word List */}
        <div className="space-y-3 mt-4">
          {placements.map((p, i) => {
            const color = CHIP_COLORS[i % CHIP_COLORS.length]
            return (
              <div
                key={i}
                className="p-3 rounded-xl space-y-2"
                style={{ backgroundColor: color }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-title-medium font-japanese">{p.word.display}</span>
                  <span className="text-body-small text-muted-foreground">{p.word.kana}</span>
                </div>
                <div className="text-body-small">{p.word.meaning}</div>
                
                {p.word.example && (
                  <button
                    onClick={() => speak(p.word.example.kana)}
                    className="w-full p-2 bg-background/50 rounded-lg text-left hover:bg-background/70 transition-colors"
                  >
                    <div className="text-body-small font-japanese">{p.word.example.jp}</div>
                    <div className="text-body-small text-muted-foreground">
                      {kanaToRomaji(p.word.example.kana)}
                    </div>
                    <div className="text-body-small text-muted-foreground">{p.word.example.en}</div>
                    <div className="text-label-small text-primary mt-1">Tap to hear</div>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="filled" fullWidth onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button variant="text" fullWidth onClick={onNewTheme}>
            New Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ThemePicker({ onSelect }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-title-large px-2">Choose a theme</h2>
      
      <MenuCardList>
        {THEMES.map((t) => {
          const Icon = LucideIcons[t.iconName]
          return (
            <MenuCard
              key={t.id ?? 'random'}
              icon={Icon ? <Icon /> : null}
              title={t.label}
              meta={t.kana}
              onClick={() => onSelect(t.id)}
            />
          )
        })}
      </MenuCardList>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────

export default function WordSearchScreen() {
  const [phase, setPhase] = useState('pick') // 'pick' | 'play'
  const [theme, setTheme] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const [dragCurrent, setDragCurrent] = useState(null)
  const [found, setFound] = useState([])
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX)
  const [status, setStatus] = useState('playing')
  const [hiddenWords, setHiddenWords] = useState(new Set())
  const gridRef = useRef(null)

  function buildHiddenSet(count) {
    const indices = Array.from({ length: count }, (_, i) => i)
    const shuffled = indices.sort(() => Math.random() - 0.5)
    return new Set(shuffled.slice(0, Math.round(count * 0.5)))
  }

  // Timer countdown
  useEffect(() => {
    if (phase !== 'play' || status !== 'playing') return
    if (timeLeft <= 0) {
      setStatus('timeout')
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, timeLeft, status])

  // Check for completion
  useEffect(() => {
    if (!puzzle) return
    if (found.length > 0 && found.length === puzzle.placements.length) {
      setStatus('complete')
    }
  }, [found, puzzle])

  const selectedCells = getSelectedCells(dragStart, dragCurrent)
  const selectedSet = new Set(selectedCells.map(({ row, col }) => `${row},${col}`))

  // Map found cells to colors
  const foundCellColors = new Map()
  if (puzzle) {
    found.forEach((i) => {
      const color = CHIP_COLORS[i % CHIP_COLORS.length]
      puzzle.placements[i].cells.forEach(({ row, col }) =>
        foundCellColors.set(`${row},${col}`, color)
      )
    })
  }

  function getCellFromPointer(e) {
    const el = gridRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const col = Math.floor(((e.clientX - rect.left) / rect.width) * puzzle.size)
    const row = Math.floor(((e.clientY - rect.top) / rect.height) * puzzle.size)
    if (row < 0 || row >= puzzle.size || col < 0 || col >= puzzle.size) return null
    return { row, col }
  }

  function onPointerDown(e) {
    const cell = getCellFromPointer(e)
    if (cell) {
      setDragStart(cell)
      setDragCurrent(cell)
    }
    e.preventDefault()
  }

  function onPointerMove(e) {
    if (!dragStart) return
    const cell = getCellFromPointer(e)
    if (cell) setDragCurrent(cell)
    e.preventDefault()
  }

  function onPointerUp() {
    if (!dragStart || !puzzle) {
      setDragStart(null)
      setDragCurrent(null)
      return
    }

    const sel = getSelectedCells(dragStart, dragCurrent)
    const key = sel.map(({ row, col }) => `${row},${col}`).join('|')

    let matchIdx = -1
    puzzle.placements.forEach((p, i) => {
      if (found.includes(i)) return
      const placeKey = p.cells.map(({ row, col }) => `${row},${col}`).join('|')
      const revKey = [...p.cells].reverse().map(({ row, col }) => `${row},${col}`).join('|')
      if (key === placeKey || key === revKey) matchIdx = i
    })

    if (matchIdx !== -1) {
      playCorrectSound()
      setFound([...found, matchIdx])
      speak(puzzle.placements[matchIdx].word.kana)
    } else if (sel.length > 1) {
      playWrongSound()
      const newLives = lives - 1
      setLives(newLives)
      if (newLives <= 0) setStatus('failed')
    }

    setDragStart(null)
    setDragCurrent(null)
  }

  function startGame(themeId) {
    const p = buildPuzzle(WORD_COUNT, themeId)
    setPuzzle(p)
    setHiddenWords(buildHiddenSet(p.placements.length))
    setTheme(themeId)
    setFound([])
    setLives(3)
    setTimeLeft(TIMER_MAX)
    setStatus('playing')
    setPhase('play')
  }

  function restart() {
    startGame(theme)
  }

  function newTheme() {
    setPhase('pick')
    setTheme(null)
    setPuzzle(null)
  }

  if (phase === 'pick') {
    return <ThemePicker onSelect={startGame} />
  }

  const isGameOver = status !== 'playing'

  return (
    <div className="flex flex-col h-full">
      {/* HUD */}
      <div className="p-4">
        <GameHUD
          lives={lives}
          timeLeft={timeLeft}
          foundCount={found.length}
          totalCount={puzzle.placements.length}
        />
      </div>

      {/* Word Chips */}
      <WordChips
        words={puzzle.words}
        found={found}
        onSpeak={speak}
        hiddenWords={hiddenWords}
      />

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          ref={gridRef}
          className="relative aspect-square w-full max-w-md bg-surface rounded-2xl shadow-md3-2 select-none touch-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${puzzle.size}, 1fr)`,
            gridTemplateRows: `repeat(${puzzle.size}, 1fr)`,
            gap: '1px',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {puzzle.grid.map((row, r) =>
            row.map((char, c) => {
              const key = `${r},${c}`
              const isSelected = selectedSet.has(key)
              const foundColor = foundCellColors.get(key)
              
              return (
                <div
                  key={key}
                  className={cn(
                    'flex items-center justify-center text-body-large font-japanese font-medium transition-colors',
                    isSelected && !foundColor && 'bg-primary/20',
                    foundColor && 'text-foreground'
                  )}
                  style={{ backgroundColor: foundColor || undefined }}
                >
                  {char}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Result Dialog */}
      <ResultDialog
        open={isGameOver}
        status={status}
        foundCount={found.length}
        totalCount={puzzle.placements.length}
        placements={puzzle.placements}
        onPlayAgain={restart}
        onNewTheme={newTheme}
      />
    </div>
  )
}
