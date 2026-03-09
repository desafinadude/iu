// wordSearchData.js — Word Search puzzle builder
// Draws from VOCAB_LIST nouns (with theme field) and generated numbers.
// Each noun's theme comes directly from vocabData — no duplicate mapping here.

import { VOCAB_LIST } from './vocabData'
import { generateNumberWords } from '../utils/japaneseNumbers'

const _NUMBER_WORDS = generateNumberWords()

// ─── Theme definitions ────────────────────────────────────────────────────────
export const THEMES = [
  { id: 'animal',    label: 'Animals',      kana: '動物',    iconName: 'PawPrint'       },
  { id: 'transport', label: 'Transport',    kana: '交通',    iconName: 'Train'          },
  { id: 'places',    label: 'Places',       kana: '場所',    iconName: 'MapPin'         },
  { id: 'clothing',  label: 'Clothing',     kana: '服',      iconName: 'Shirt'          },
  { id: 'people',    label: 'People',       kana: '人',      iconName: 'Users'          },
  { id: 'food',      label: 'Food & Drink', kana: '食べ物',  iconName: 'Utensils'       },
  { id: 'home',      label: 'Home',         kana: '家',      iconName: 'House'          },
  { id: 'body',      label: 'Body',         kana: '体',      iconName: 'PersonStanding' },
  { id: 'nature',    label: 'Nature',       kana: '自然',    iconName: 'Leaf'           },
  { id: 'calendar',  label: 'Calendar',     kana: '暦',      iconName: 'CalendarDays'   },
  { id: 'time',      label: 'Time',         kana: '時間',    iconName: 'Clock'          },
  { id: null,        label: 'Random',       kana: 'ランダム', iconName: 'Shuffle'        },
]

// Word search uses only nouns — theme comes directly from the vocab entry.
// Single-kanji words use kana as display so they fit in the grid.
// Deduplicate by display form to avoid collisions (e.g. 花/鼻 both → はな).
const _seenDisplay = new Set()
const _nounPool = VOCAB_LIST
  .filter(v => v.type === 'noun')
  .map(v => {
    const display = (v.word.length >= 2 && v.word.length <= 7) ? v.word : v.kana
    return { display, kana: v.kana, meaning: v.meaning, example: v.example, theme: v.theme }
  })
  .filter(w => {
    if (w.display.length < 2 || w.display.length > 7) return false
    if (_seenDisplay.has(w.display)) return false
    _seenDisplay.add(w.display)
    return true
  })

// theme: null = random (include one number); string = themed nouns only
function weightedSelection(wordCount, theme = null) {
  if (theme) {
    const themed  = shuffle(_nounPool.filter(w => w.theme === theme))
    const surplus = shuffle(_nounPool.filter(w => w.theme !== theme))
    // Use themed words first; pad with random nouns if the pool is too small
    const pool = themed.length >= wordCount
      ? themed
      : [...themed, ...surplus.slice(0, wordCount - themed.length + 3)]
    return shuffle(pool).slice(0, wordCount)
  }
  // Random: one number + nouns
  const nouns  = shuffle([..._nounPool])
  const number = _NUMBER_WORDS[Math.floor(Math.random() * _NUMBER_WORDS.length)]
  return shuffle([number, ...nouns.slice(0, wordCount - 1)])
}

// ─── Grid constants ────────────────────────────────────────────────────────
const SIZE = 8

const DIRS = [
  [0,  1],  // right →
  [1,  0],  // down ↓
  [1,  1],  // diagonal ↘
  [1, -1],  // diagonal ↙
]

const FILLER = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('')

// ─── Helpers ───────────────────────────────────────────────────────────────
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

// ─── Puzzle builder ────────────────────────────────────────────────────────
function tryBuild(wordCount, theme) {
  const selected = weightedSelection(wordCount, theme)
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

  // Fill remaining cells
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = FILLER[Math.floor(Math.random() * FILLER.length)]
      }
    }
  }

  return { grid, words: placements.map(p => p.word), placements, size: SIZE }
}

export function buildPuzzle(wordCount = 5, theme = null) {
  for (let i = 0; i < 10; i++) {
    const puzzle = tryBuild(wordCount, theme)
    if (puzzle.placements.length === wordCount) return puzzle
  }
  return tryBuild(wordCount, theme)
}
