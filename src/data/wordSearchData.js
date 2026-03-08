// Word list derived from the shared VOCAB_LIST (nouns, greetings — no verb forms)
// Only hiragana-only readings, length 2–7 chars (fits the 8×8 grid).
// display is the kana reading so the grid stays a pure hiragana puzzle.
import { VOCAB_LIST } from './vocabData'

export const WORD_LIST = VOCAB_LIST
  .filter(v => v.word.length >= 2 && v.word.length <= 7)
  .map(v => ({ kana: v.kana, display: v.word, meaning: v.meaning }))

// ─── Grid constants ───────────────────────────────────────────────
const SIZE = 8

// Placement directions: right, down, diagonal down-right, diagonal down-left
const DIRS = [
  [0,  1],  // right
  [1,  0],  // down
  [1,  1],  // diagonal ↘
  [1, -1],  // diagonal ↙
]

// Filler pool: basic hiragana + katakana (no small kana to avoid confusion)
const FILLER = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('')

// ─── Helpers ──────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function canPlace(grid, chars, row, col, dir) {
  const [dr, dc] = dir
  for (let i = 0; i < chars.length; i++) {
    const r = row + i * dr
    const c = col + i * dc
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return false
    if (grid[r][c] !== null && grid[r][c] !== chars[i]) return false
  }
  return true
}

function placeWord(grid, chars, row, col, dir) {
  const [dr, dc] = dir
  for (let i = 0; i < chars.length; i++) {
    grid[row + i * dr][col + i * dc] = chars[i]
  }
}

function getCells(row, col, dir, length) {
  const [dr, dc] = dir
  return Array.from({ length }, (_, i) => ({ row: row + i * dr, col: col + i * dc }))
}

// ─── Puzzle builder ───────────────────────────────────────────────
function tryBuild(wordCount) {
  const selected = shuffle(WORD_LIST).slice(0, wordCount)
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  const placements = []

  for (const word of selected) {
    const chars = [...word.display]
    const positions = shuffle(
      Array.from({ length: SIZE * SIZE * DIRS.length }, (_, idx) => {
        const d = idx % DIRS.length
        const cell = Math.floor(idx / DIRS.length)
        return { r: Math.floor(cell / SIZE), c: cell % SIZE, dir: DIRS[d] }
      })
    )

    for (const { r, c, dir } of positions) {
      if (canPlace(grid, chars, r, c, dir)) {
        placeWord(grid, chars, r, c, dir)
        placements.push({ word, cells: getCells(r, c, dir, chars.length) })
        break
      }
    }
  }

  // Fill remaining cells with random filler
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = FILLER[Math.floor(Math.random() * FILLER.length)]
      }
    }
  }

  return { grid, words: placements.map(p => p.word), placements, size: SIZE }
}

export function buildPuzzle(wordCount = 5) {
  // Retry up to 10 times to ensure all words are placed
  for (let i = 0; i < 10; i++) {
    const puzzle = tryBuild(wordCount)
    if (puzzle.placements.length === wordCount) return puzzle
  }
  return tryBuild(wordCount)
}
