// kanaToRomaji.js — Hepburn romaji from hiragana/katakana.
// Non-kana (kanji, punctuation, spaces) passes through unchanged.

const COMBO = {
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'じゃ':'ja', 'じゅ':'ju', 'じょ':'jo',
  'ぢゃ':'ja', 'ぢゅ':'ju', 'ぢょ':'jo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'ふぁ':'fa', 'ふぃ':'fi', 'ふぇ':'fe', 'ふぉ':'fo',
  'てぃ':'ti', 'でぃ':'di', 'とぅ':'tu', 'どぅ':'du',
}

const SINGLE = {
  'あ':'a',  'い':'i',  'う':'u',  'え':'e',  'お':'o',
  'か':'ka', 'き':'ki', 'く':'ku', 'け':'ke', 'こ':'ko',
  'さ':'sa', 'し':'shi','す':'su', 'せ':'se', 'そ':'so',
  'た':'ta', 'ち':'chi','つ':'tsu','て':'te', 'と':'to',
  'な':'na', 'に':'ni', 'ぬ':'nu', 'ね':'ne', 'の':'no',
  'は':'ha', 'ひ':'hi', 'ふ':'fu', 'へ':'he', 'ほ':'ho',
  'ま':'ma', 'み':'mi', 'む':'mu', 'め':'me', 'も':'mo',
  'や':'ya', 'ゆ':'yu', 'よ':'yo',
  'ら':'ra', 'り':'ri', 'る':'ru', 'れ':'re', 'ろ':'ro',
  'わ':'wa', 'ゐ':'i',  'ゑ':'e',  'を':'o',  'ん':'n',
  'が':'ga', 'ぎ':'gi', 'ぐ':'gu', 'げ':'ge', 'ご':'go',
  'ざ':'za', 'じ':'ji', 'ず':'zu', 'ぜ':'ze', 'ぞ':'zo',
  'だ':'da', 'ぢ':'ji', 'づ':'zu', 'で':'de', 'ど':'do',
  'ば':'ba', 'び':'bi', 'ぶ':'bu', 'べ':'be', 'ぼ':'bo',
  'ぱ':'pa', 'ぴ':'pi', 'ぷ':'pu', 'ぺ':'pe', 'ぽ':'po',
  'ぁ':'a',  'ぃ':'i',  'ぅ':'u',  'ぇ':'e',  'ぉ':'o',
  'ゃ':'ya', 'ゅ':'yu', 'ょ':'yo', 'ゎ':'wa',
}

// Katakana → hiragana (ー is U+30FC, outside U+30A1–U+30F6, passes through)
function kataToHira(str) {
  return str.replace(/[\u30A1-\u30F6]/g, c =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  )
}

export function kanaToRomaji(text) {
  // Normalize Japanese punctuation first
  const normalised = text
    .replace(/。/g, '. ')
    .replace(/、/g, ', ')
    .replace(/！/g, '! ')
    .replace(/？/g, '? ')
    .replace(/　/g, ' ')  // full-width space
    .trim()

  const s = kataToHira(normalised)
  const chars = [...s]
  let out = ''
  let lastVowel = 'a'
  let i = 0

  while (i < chars.length) {
    const c = chars[i]

    // Long vowel mark (katakana ー passes through kataToHira unchanged)
    if (c === 'ー') {
      out += lastVowel
      i++; continue
    }

    // っ — double the first consonant of the next syllable
    if (c === 'っ') {
      const pair = (chars[i + 1] || '') + (chars[i + 2] || '')
      const next = COMBO[pair] || SINGLE[chars[i + 1]] || ''
      out += next[0] || ''
      i++; continue
    }

    // 2-char combo (e.g. きゃ → kya)
    const pair = c + (chars[i + 1] || '')
    if (COMBO[pair]) {
      out += COMBO[pair]
      lastVowel = COMBO[pair].slice(-1)
      i += 2; continue
    }

    // Single kana
    if (SINGLE[c]) {
      const rom = SINGLE[c]
      out += rom
      const v = rom.slice(-1)
      if ('aeiou'.includes(v)) lastVowel = v
      i++; continue
    }

    // Non-kana passthrough (kanji, ASCII, spaces, remaining punctuation)
    out += c
    i++
  }

  return out
}
