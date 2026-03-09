// japaneseNumbers.js — Japanese kanji + kana for integers.

const _D = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const _R = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
const _HYAKU = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく']

// Convert an integer (1–999) to { kanji, kana }.
export function numToJP(n) {
  let kanji = '', kana = ''
  const h = Math.floor(n / 100)
  const t = Math.floor((n % 100) / 10)
  const o = n % 10
  if (h > 0) { kanji += (h === 1 ? '' : _D[h]) + '百'; kana += _HYAKU[h] }
  if (t > 0) { kanji += (t === 1 ? '' : _D[t]) + '十'; kana += (t === 1 ? '' : _R[t]) + 'じゅう' }
  if (o > 0) { kanji += _D[o]; kana += _R[o] }
  return { kanji, kana }
}

// Returns an array of { display, kana, meaning } vocab entries for a
// curated set of compound numbers (11–999), filtered to 2–7 display chars.
export function generateNumberWords() {
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
