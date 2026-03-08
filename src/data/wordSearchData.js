// wordSearchData.js — Word Search puzzle builder
// Draws from all three vocabData exports:
//   VOCAB_LIST  → nouns, phrases, etc (display + kana + meaning as-is)
//   VERB_LIST   → all polite + casual conjugated forms
//   ADJ_LIST    → all polite + casual conjugated forms
//
// Wordsearch clues show the English meaning (e.g. "watched / saw")
// and the learner finds the Japanese form (e.g. 見ました) in the grid.
// This makes the conjugated form the thing being actively recalled.

import { VOCAB_LIST, VERB_LIST, ADJ_LIST } from './vocabData'

// ─── Number generator ─────────────────────────────────────────────────────
// Produces Japanese kanji + kana for integers 11–999.
const _D = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const _R = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
const _HYAKU = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく']

function numToJP(n) {
  let kanji = '', kana = ''
  const h = Math.floor(n / 100)
  const t = Math.floor((n % 100) / 10)
  const o = n % 10
  if (h > 0) { kanji += (h === 1 ? '' : _D[h]) + '百'; kana += _HYAKU[h] }
  if (t > 0) { kanji += (t === 1 ? '' : _D[t]) + '十'; kana += (t === 1 ? '' : _R[t]) + 'じゅう' }
  if (o > 0) { kanji += _D[o]; kana += _R[o] }
  return { kanji, kana }
}

function generateNumberWords() {
  const nums = []
  for (let n = 11; n <= 19; n++) nums.push(n)
  for (let n = 20; n <= 90; n += 10) nums.push(n)
  for (let t = 2; t <= 9; t++) {
    for (let o = 1; o <= 9; o++) {
      if (o !== 5) continue
      nums.push(t * 10 + o)
    }
    nums.push(t * 10 + t)
  }
  for (let h = 1; h <= 9; h++) nums.push(h * 100)
  ;[123, 149, 256, 365, 480, 537, 604, 718, 825, 999].forEach(n => nums.push(n))

  return [...new Set(nums)].sort((a, b) => a - b).map(n => {
    const { kanji, kana } = numToJP(n)
    return { kana, display: kanji, meaning: String(n) }
  }).filter(w => w.display.length >= 2 && w.display.length <= 7)
}

const _NUMBER_WORDS = generateNumberWords()

// ─── Build the word pool from all three exports ────────────────────────────
//
// Each entry in WORD_LIST must have:
//   display  — the Japanese string placed in the grid (kanji/kana)
//   kana     — hiragana/katakana reading (for display in clue list)
//   meaning  — English clue shown to the learner
//
// Verb and adjective conjugations:
//   We expand every polite AND casual form from VERB_LIST and ADJ_LIST.
//   The grid shows the conjugated form; the clue shows its English meaning.
//   This means the learner is actively recalling e.g. 見ました for "watched".
//
//   Length filter (2–7 chars) is applied AFTER expansion, so longer forms
//   like 飲みませんでした (8 chars) are naturally excluded.
//   Casual forms tend to be shorter and provide excellent shorter-word variety.

function expandConjugations(list) {
  return list.flatMap(entry =>
    ['polite', 'casual'].flatMap(register =>
      Object.values(entry[register]).map(form => ({
        display: form.word,
        kana:    form.kana,
        meaning: form.meaning,
        example: entry.example,
        register,
        source:  entry.dict,
      }))
    )
  )
}

export const WORD_LIST = [
  // Core vocabulary (nouns, phrases, adverbs, etc.)
  ...VOCAB_LIST
    .filter(v => v.word.length >= 2 && v.word.length <= 7)
    .map(v => ({ display: v.word, kana: v.kana, meaning: v.meaning })),

  // All verb conjugations (polite + casual, all four tenses)
  ...expandConjugations(VERB_LIST)
    .filter(f => f.display.length >= 2 && f.display.length <= 7),

  // All adjective conjugations (polite + casual, all four tenses)
  ...expandConjugations(ADJ_LIST)
    .filter(f => f.display.length >= 2 && f.display.length <= 7),

  // Generated compound numbers
  ..._NUMBER_WORDS,
]

// Deduplicate by display form (same kanji may appear with different meanings
// across casual/polite — keep first occurrence to avoid clue ambiguity)
const _seen = new Set()
export const WORD_LIST_DEDUPED = WORD_LIST.filter(w => {
  if (_seen.has(w.display)) return false
  _seen.add(w.display)
  return true
})

// Separate pools for weighted sampling
const _vocabPool = VOCAB_LIST
  .filter(v => v.word.length >= 2 && v.word.length <= 7)
  .map(v => ({ display: v.word, kana: v.kana, meaning: v.meaning, example: v.example }))

const _verbPool = expandConjugations(VERB_LIST)
  .filter(f => f.display.length >= 2 && f.display.length <= 7)

const _adjPool = expandConjugations(ADJ_LIST)
  .filter(f => f.display.length >= 2 && f.display.length <= 7)

// Weighted selection: ~60% nouns/vocab, ~25% verbs, ~15% adjectives
// For wordCount=7: 4 vocab, 2 verbs, 1 adj
function weightedSelection(wordCount) {
  const nVerb = Math.max(1, Math.round(wordCount * 0.25))
  const nAdj  = Math.max(1, Math.round(wordCount * 0.15))
  const nVocab = wordCount - nVerb - nAdj

  const pick = (pool, n) => shuffle([...pool]).slice(0, n)

  return [
    ...pick(_vocabPool, nVocab),
    ...pick(_verbPool,  nVerb),
    ...pick(_adjPool,   nAdj),
  ]
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
function tryBuild(wordCount) {
  const selected = weightedSelection(wordCount)
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

export function buildPuzzle(wordCount = 5) {
  for (let i = 0; i < 10; i++) {
    const puzzle = tryBuild(wordCount)
    if (puzzle.placements.length === wordCount) return puzzle
  }
  return tryBuild(wordCount)
}
