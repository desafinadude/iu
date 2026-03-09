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
// Always use the original word form (kanji where applicable, kana for katakana words).
// Single-kanji words (length 1) are allowed — finding one cell is still a challenge.
// script: 'kanji' if the display contains kanji, 'kana' otherwise — used as chip hint.
const KANJI_RE = /[\u4e00-\u9faf\u3400-\u4dbf]/
const _seenDisplay = new Set()
const _nounPool = VOCAB_LIST
  .filter(v => v.type === 'noun' && v.word.length <= 7)
  .map(v => ({
    display:   v.word,
    kana:      v.kana,
    meaning:   v.meaning,
    example:   v.example,
    theme:     v.theme,
    hasKanji:  KANJI_RE.test(v.word),
    script:    KANJI_RE.test(v.word) ? 'kanji' : 'kana',
  }))
  .filter(w => {
    if (_seenDisplay.has(w.display)) return false
    _seenDisplay.add(w.display)
    return true
  })

// For kanji words, randomly show kana instead ~40% of the time,
// reinforcing the kanji↔kana association. Chip hint updates to match.
function randomiseScript(word) {
  if (word.script !== 'kanji') return word
  if (Math.random() < 0.4 && word.kana.length <= 7) {
    return { ...word, display: word.kana, script: 'kana' } // hasKanji stays true
  }
  return word
}

// theme: null = random (include one number); string = themed nouns only
function weightedSelection(wordCount, theme = null) {
  if (theme) {
    const themed  = shuffle(_nounPool.filter(w => w.theme === theme))
    const surplus = shuffle(_nounPool.filter(w => w.theme !== theme))
    const pool = themed.length >= wordCount
      ? themed
      : [...themed, ...surplus.slice(0, wordCount - themed.length + 3)]
    return shuffle(pool).slice(0, wordCount).map(randomiseScript)
  }
  // Random: one number + nouns
  const nouns  = shuffle([..._nounPool])
  const number = _NUMBER_WORDS[Math.floor(Math.random() * _NUMBER_WORDS.length)]
  return shuffle([number, ...nouns.slice(0, wordCount - 1)]).map(randomiseScript)
}

// ─── Grid constants ────────────────────────────────────────────────────────
const SIZE = 8

const DIRS = [
  [0,  1],  // right →
  [1,  0],  // down ↓
  [1,  1],  // diagonal ↘
  [1, -1],  // diagonal ↙
]

const KANA_FILLER  = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('')
const KANJI_FILLER = '人山川木火水土金日月年時間大小中上下左右前後長新古高安白黒赤青半本今外内東西南北気手目口足耳心空海地星雲雨風雪花草石'.split('')

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

  // Fill remaining cells — mix kana + kanji, excluding chars from all forms of answers
  // (display may be kana e.g. やま, but the kanji 山 should also be excluded as filler)
  const placedChars = new Set(placements.flatMap(p => [
    ...[...p.word.display],
    ...[...p.word.kana],
  ]))
  const fillerPool  = [
    ...KANA_FILLER,
    ...KANJI_FILLER.filter(c => !placedChars.has(c)),
  ]
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = fillerPool[Math.floor(Math.random() * fillerPool.length)]
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
