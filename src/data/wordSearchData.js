// Word list: nouns and greetings (no conjugating forms)
// kana  — hiragana reading (used for speech)
// display — characters that appear in the grid (kana or kanji)
// meaning — English clue shown to the player
export const WORD_LIST = [
  { kana: 'さくら',     display: 'さくら',     meaning: 'cherry blossom' },
  { kana: 'さかな',     display: 'さかな',     meaning: 'fish'           },
  { kana: 'かばん',     display: 'かばん',     meaning: 'bag'            },
  { kana: 'きもの',     display: '着物',       meaning: 'kimono'         },
  { kana: 'まつり',     display: 'まつり',     meaning: 'festival'       },
  { kana: 'でんわ',     display: '電話',       meaning: 'telephone'      },
  { kana: 'おちゃ',     display: 'おちゃ',     meaning: 'tea'            },
  { kana: 'ごはん',     display: 'ごはん',     meaning: 'rice / meal'    },
  { kana: 'にほん',     display: '日本',       meaning: 'Japan'          },
  { kana: 'こども',     display: '子供',       meaning: 'child'          },
  { kana: 'くるま',     display: 'くるま',     meaning: 'car'            },
  { kana: 'みかん',     display: 'みかん',     meaning: 'tangerine'      },
  { kana: 'はなび',     display: '花火',       meaning: 'fireworks'      },
  { kana: 'おかし',     display: 'おかし',     meaning: 'snack'          },
  { kana: 'なまえ',     display: '名前',       meaning: 'name'           },
  { kana: 'てがみ',     display: '手紙',       meaning: 'letter'         },
  { kana: 'みんな',     display: 'みんな',     meaning: 'everyone'       },
  { kana: 'おはよう',   display: 'おはよう',   meaning: 'good morning'   },
  { kana: 'ともだち',   display: 'ともだち',   meaning: 'friend'         },
  { kana: 'でんしゃ',   display: '電車',       meaning: 'train'          },
  { kana: 'にほんご',   display: 'にほんご',   meaning: 'Japanese'       },
  { kana: 'ひらがな',   display: 'ひらがな',   meaning: 'hiragana'       },
  { kana: 'かたかな',   display: 'かたかな',   meaning: 'katakana'       },
  { kana: 'こんにちは', display: 'こんにちは', meaning: 'hello'          },
  { kana: 'ありがとう', display: 'ありがとう', meaning: 'thank you'      },
  { kana: 'さようなら', display: 'さようなら', meaning: 'goodbye'        },
  { kana: 'おかあさん', display: 'おかあさん', meaning: 'mother'         },
  { kana: 'おとうさん', display: 'おとうさん', meaning: 'father'         },
]

// ─── Grid constants ───────────────────────────────────────────────
const SIZE = 8

// Placement directions: right, down, diagonal down-right, diagonal down-left
const DIRS = [
  [0,  1],  // right
  [1,  0],  // down
  [1,  1],  // diagonal ↘
  [1, -1],  // diagonal ↙
]

// Filler pool: basic hiragana (no small kana to avoid confusion)
const FILLER = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split('')

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
