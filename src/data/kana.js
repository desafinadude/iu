// ─── Column headers ───────────────────────────────────────────────
export const VOWEL_HEADERS = ['A', 'I', 'U', 'E', 'O']

// ─── Gojūon table (basic kana) ───────────────────────────────────
// null = empty cell (no character for that position in that row)
export const GOJUON_ROWS = [
  {
    id: 'vowel', label: '',
    chars: [
      { hiragana: 'あ', katakana: 'ア', romaji: 'a'  },
      { hiragana: 'い', katakana: 'イ', romaji: 'i'  },
      { hiragana: 'う', katakana: 'ウ', romaji: 'u'  },
      { hiragana: 'え', katakana: 'エ', romaji: 'e'  },
      { hiragana: 'お', katakana: 'オ', romaji: 'o'  },
    ],
  },
  {
    id: 'k', label: 'K',
    chars: [
      { hiragana: 'か', katakana: 'カ', romaji: 'ka'  },
      { hiragana: 'き', katakana: 'キ', romaji: 'ki'  },
      { hiragana: 'く', katakana: 'ク', romaji: 'ku'  },
      { hiragana: 'け', katakana: 'ケ', romaji: 'ke'  },
      { hiragana: 'こ', katakana: 'コ', romaji: 'ko'  },
    ],
  },
  {
    id: 's', label: 'S',
    chars: [
      { hiragana: 'さ', katakana: 'サ', romaji: 'sa'  },
      { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
      { hiragana: 'す', katakana: 'ス', romaji: 'su'  },
      { hiragana: 'せ', katakana: 'セ', romaji: 'se'  },
      { hiragana: 'そ', katakana: 'ソ', romaji: 'so'  },
    ],
  },
  {
    id: 't', label: 'T',
    chars: [
      { hiragana: 'た', katakana: 'タ', romaji: 'ta'  },
      { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
      { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
      { hiragana: 'て', katakana: 'テ', romaji: 'te'  },
      { hiragana: 'と', katakana: 'ト', romaji: 'to'  },
    ],
  },
  {
    id: 'n', label: 'N',
    chars: [
      { hiragana: 'な', katakana: 'ナ', romaji: 'na'  },
      { hiragana: 'に', katakana: 'ニ', romaji: 'ni'  },
      { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu'  },
      { hiragana: 'ね', katakana: 'ネ', romaji: 'ne'  },
      { hiragana: 'の', katakana: 'ノ', romaji: 'no'  },
    ],
  },
  {
    id: 'h', label: 'H',
    chars: [
      { hiragana: 'は', katakana: 'ハ', romaji: 'ha'  },
      { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi'  },
      { hiragana: 'ふ', katakana: 'フ', romaji: 'fu'  },
      { hiragana: 'へ', katakana: 'ヘ', romaji: 'he'  },
      { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho'  },
    ],
  },
  {
    id: 'm', label: 'M',
    chars: [
      { hiragana: 'ま', katakana: 'マ', romaji: 'ma'  },
      { hiragana: 'み', katakana: 'ミ', romaji: 'mi'  },
      { hiragana: 'む', katakana: 'ム', romaji: 'mu'  },
      { hiragana: 'め', katakana: 'メ', romaji: 'me'  },
      { hiragana: 'も', katakana: 'モ', romaji: 'mo'  },
    ],
  },
  {
    id: 'y', label: 'Y',
    chars: [
      { hiragana: 'や', katakana: 'ヤ', romaji: 'ya'  },
      null,
      { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu'  },
      null,
      { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo'  },
    ],
  },
  {
    id: 'r', label: 'R',
    chars: [
      { hiragana: 'ら', katakana: 'ラ', romaji: 'ra'  },
      { hiragana: 'り', katakana: 'リ', romaji: 'ri'  },
      { hiragana: 'る', katakana: 'ル', romaji: 'ru'  },
      { hiragana: 'れ', katakana: 'レ', romaji: 're'  },
      { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro'  },
    ],
  },
  {
    id: 'w', label: 'W',
    chars: [
      { hiragana: 'わ', katakana: 'ワ', romaji: 'wa'  },
      null,
      null,
      null,
      { hiragana: 'を', katakana: 'ヲ', romaji: 'wo'  },
    ],
  },
  {
    id: 'nn', label: 'N',
    // ん is special — display it centred in the table (A column position)
    chars: [
      { hiragana: 'ん', katakana: 'ン', romaji: 'n'  },
      null, null, null, null,
    ],
  },
]

// ─── Dakuten rows (voiced: ゛) ─────────────────────────────────────
export const DAKUTEN_ROWS = [
  {
    id: 'g', label: 'G',
    chars: [
      { hiragana: 'が', katakana: 'ガ', romaji: 'ga'  },
      { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi'  },
      { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu'  },
      { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge'  },
      { hiragana: 'ご', katakana: 'ゴ', romaji: 'go'  },
    ],
  },
  {
    id: 'z', label: 'Z',
    chars: [
      { hiragana: 'ざ', katakana: 'ザ', romaji: 'za'  },
      { hiragana: 'じ', katakana: 'ジ', romaji: 'ji'  },
      { hiragana: 'ず', katakana: 'ズ', romaji: 'zu'  },
      { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze'  },
      { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo'  },
    ],
  },
  {
    id: 'd', label: 'D',
    chars: [
      { hiragana: 'だ', katakana: 'ダ', romaji: 'da'  },
      { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'di'  },
      { hiragana: 'づ', katakana: 'ヅ', romaji: 'du'  },
      { hiragana: 'で', katakana: 'デ', romaji: 'de'  },
      { hiragana: 'ど', katakana: 'ド', romaji: 'do'  },
    ],
  },
  {
    id: 'b', label: 'B',
    chars: [
      { hiragana: 'ば', katakana: 'バ', romaji: 'ba'  },
      { hiragana: 'び', katakana: 'ビ', romaji: 'bi'  },
      { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu'  },
      { hiragana: 'べ', katakana: 'ベ', romaji: 'be'  },
      { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo'  },
    ],
  },
]

// ─── Handakuten rows (semi-voiced: ゜) ────────────────────────────
export const HANDAKUTEN_ROWS = [
  {
    id: 'p', label: 'P',
    chars: [
      { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa'  },
      { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi'  },
      { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu'  },
      { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe'  },
      { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po'  },
    ],
  },
]

// ─── Flat arrays derived from the table ──────────────────────────
// Used by the quiz engine as a flat pool of characters

function rowsToFlat(rows) {
  return rows.flatMap(row =>
    row.chars
      .filter(Boolean)
      .map(c => ({ ...c, group: row.id }))
  )
}

export const ALL_CHARS = [
  ...rowsToFlat(GOJUON_ROWS),
  ...rowsToFlat(DAKUTEN_ROWS),
  ...rowsToFlat(HANDAKUTEN_ROWS),
]

// ─── Build deck for quiz ──────────────────────────────────────────

export function buildKanaDeck({ activeRows, includeDakuten, includeHandakuten }) {
  // Gojuon rows filtered by activeRows; dakuten/handakuten fully included when toggled on
  const chars = [
    ...GOJUON_ROWS.filter(row => activeRows.has(row.id))
      .flatMap(row => row.chars.filter(Boolean).map(c => ({ ...c, group: row.id }))),
    ...(includeDakuten
      ? DAKUTEN_ROWS.flatMap(row => row.chars.filter(Boolean).map(c => ({ ...c, group: row.id })))
      : []),
    ...(includeHandakuten
      ? HANDAKUTEN_ROWS.flatMap(row => row.chars.filter(Boolean).map(c => ({ ...c, group: row.id })))
      : []),
  ]
  // Always mix both scripts so quizzes show hiragana and katakana together
  return [
    ...chars.map(c => ({ kana: c.hiragana, romaji: c.romaji, group: c.group, script: 'hiragana' })),
    ...chars.map(c => ({ kana: c.katakana, romaji: c.romaji, group: c.group, script: 'katakana' })),
  ]
}

export function buildMatchingDeck({ activeRows, includeDakuten, includeHandakuten }) {
  return [
    ...GOJUON_ROWS.filter(row => activeRows.has(row.id))
      .flatMap(row => row.chars.filter(Boolean).map(c => ({ hiragana: c.hiragana, katakana: c.katakana, romaji: c.romaji, group: row.id }))),
    ...(includeDakuten
      ? DAKUTEN_ROWS.flatMap(row => row.chars.filter(Boolean).map(c => ({ hiragana: c.hiragana, katakana: c.katakana, romaji: c.romaji, group: row.id })))
      : []),
    ...(includeHandakuten
      ? HANDAKUTEN_ROWS.flatMap(row => row.chars.filter(Boolean).map(c => ({ hiragana: c.hiragana, katakana: c.katakana, romaji: c.romaji, group: row.id })))
      : []),
  ]
}

// ─── Wrong option helpers ─────────────────────────────────────────

export function pickWrongOptions(correctValue, pool, getVal, count) {
  const seen = new Set([correctValue])
  const wrong = []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  for (const item of shuffled) {
    const v = getVal(item)
    if (!seen.has(v)) {
      seen.add(v)
      wrong.push(item)
      if (wrong.length === count) break
    }
  }
  return wrong
}
