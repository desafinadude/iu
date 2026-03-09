// writingData.js — Characters for writing practice
// Three sets: hiragana, katakana, JLPT N5 kanji.
//
// isKana: true  → self-assessment mode (no hanzi-writer stroke data available)
// isKana: false → full hanzi-writer quiz mode (stroke validation)

export const WRITING_SETS = [
  { id: 'hiragana', label: 'Hiragana', kana: 'ひらがな', icon: 'あ', isKana: true  },
  { id: 'katakana', label: 'Katakana', kana: 'カタカナ',  icon: 'ア', isKana: true  },
  { id: 'kanji_n5', label: 'Kanji N5', kana: '漢字',     icon: '字', isKana: false },
]

// ─── Hiragana ───────────────────────────────────────────────────────────────
const HIRAGANA = [
  { char: 'あ', reading: 'a'   }, { char: 'い', reading: 'i'   },
  { char: 'う', reading: 'u'   }, { char: 'え', reading: 'e'   },
  { char: 'お', reading: 'o'   }, { char: 'か', reading: 'ka'  },
  { char: 'き', reading: 'ki'  }, { char: 'く', reading: 'ku'  },
  { char: 'け', reading: 'ke'  }, { char: 'こ', reading: 'ko'  },
  { char: 'さ', reading: 'sa'  }, { char: 'し', reading: 'shi' },
  { char: 'す', reading: 'su'  }, { char: 'せ', reading: 'se'  },
  { char: 'そ', reading: 'so'  }, { char: 'た', reading: 'ta'  },
  { char: 'ち', reading: 'chi' }, { char: 'つ', reading: 'tsu' },
  { char: 'て', reading: 'te'  }, { char: 'と', reading: 'to'  },
  { char: 'な', reading: 'na'  }, { char: 'に', reading: 'ni'  },
  { char: 'ぬ', reading: 'nu'  }, { char: 'ね', reading: 'ne'  },
  { char: 'の', reading: 'no'  }, { char: 'は', reading: 'ha'  },
  { char: 'ひ', reading: 'hi'  }, { char: 'ふ', reading: 'fu'  },
  { char: 'へ', reading: 'he'  }, { char: 'ほ', reading: 'ho'  },
  { char: 'ま', reading: 'ma'  }, { char: 'み', reading: 'mi'  },
  { char: 'む', reading: 'mu'  }, { char: 'め', reading: 'me'  },
  { char: 'も', reading: 'mo'  }, { char: 'や', reading: 'ya'  },
  { char: 'ゆ', reading: 'yu'  }, { char: 'よ', reading: 'yo'  },
  { char: 'ら', reading: 'ra'  }, { char: 'り', reading: 'ri'  },
  { char: 'る', reading: 'ru'  }, { char: 'れ', reading: 're'  },
  { char: 'ろ', reading: 'ro'  }, { char: 'わ', reading: 'wa'  },
  { char: 'を', reading: 'wo'  }, { char: 'ん', reading: 'n'   },
].map(c => ({ ...c, set: 'hiragana' }))

// ─── Katakana ───────────────────────────────────────────────────────────────
const KATAKANA = [
  { char: 'ア', reading: 'a'   }, { char: 'イ', reading: 'i'   },
  { char: 'ウ', reading: 'u'   }, { char: 'エ', reading: 'e'   },
  { char: 'オ', reading: 'o'   }, { char: 'カ', reading: 'ka'  },
  { char: 'キ', reading: 'ki'  }, { char: 'ク', reading: 'ku'  },
  { char: 'ケ', reading: 'ke'  }, { char: 'コ', reading: 'ko'  },
  { char: 'サ', reading: 'sa'  }, { char: 'シ', reading: 'shi' },
  { char: 'ス', reading: 'su'  }, { char: 'セ', reading: 'se'  },
  { char: 'ソ', reading: 'so'  }, { char: 'タ', reading: 'ta'  },
  { char: 'チ', reading: 'chi' }, { char: 'ツ', reading: 'tsu' },
  { char: 'テ', reading: 'te'  }, { char: 'ト', reading: 'to'  },
  { char: 'ナ', reading: 'na'  }, { char: 'ニ', reading: 'ni'  },
  { char: 'ヌ', reading: 'nu'  }, { char: 'ネ', reading: 'ne'  },
  { char: 'ノ', reading: 'no'  }, { char: 'ハ', reading: 'ha'  },
  { char: 'ヒ', reading: 'hi'  }, { char: 'フ', reading: 'fu'  },
  { char: 'ヘ', reading: 'he'  }, { char: 'ホ', reading: 'ho'  },
  { char: 'マ', reading: 'ma'  }, { char: 'ミ', reading: 'mi'  },
  { char: 'ム', reading: 'mu'  }, { char: 'メ', reading: 'me'  },
  { char: 'モ', reading: 'mo'  }, { char: 'ヤ', reading: 'ya'  },
  { char: 'ユ', reading: 'yu'  }, { char: 'ヨ', reading: 'yo'  },
  { char: 'ラ', reading: 'ra'  }, { char: 'リ', reading: 'ri'  },
  { char: 'ル', reading: 'ru'  }, { char: 'レ', reading: 're'  },
  { char: 'ロ', reading: 'ro'  }, { char: 'ワ', reading: 'wa'  },
  { char: 'ヲ', reading: 'wo'  }, { char: 'ン', reading: 'n'   },
].map(c => ({ ...c, set: 'katakana' }))

// ─── JLPT N5 Kanji ──────────────────────────────────────────────────────────
const KANJI_N5 = [
  { char: '日', reading: 'nichi / hi',     meaning: 'sun, day'      },
  { char: '月', reading: 'getsu / tsuki',  meaning: 'moon, month'   },
  { char: '火', reading: 'ka / hi',        meaning: 'fire'          },
  { char: '水', reading: 'sui / mizu',     meaning: 'water'         },
  { char: '木', reading: 'moku / ki',      meaning: 'tree, wood'    },
  { char: '金', reading: 'kin / kane',     meaning: 'gold, money'   },
  { char: '土', reading: 'do / tsuchi',    meaning: 'earth, soil'   },
  { char: '山', reading: 'san / yama',     meaning: 'mountain'      },
  { char: '川', reading: 'sen / kawa',     meaning: 'river'         },
  { char: '田', reading: 'den / ta',       meaning: 'rice field'    },
  { char: '人', reading: 'jin / hito',     meaning: 'person'        },
  { char: '口', reading: 'kou / kuchi',    meaning: 'mouth'         },
  { char: '手', reading: 'shu / te',       meaning: 'hand'          },
  { char: '目', reading: 'moku / me',      meaning: 'eye'           },
  { char: '耳', reading: 'ji / mimi',      meaning: 'ear'           },
  { char: '足', reading: 'soku / ashi',    meaning: 'foot, leg'     },
  { char: '力', reading: 'ryoku / chikara',meaning: 'power, force'  },
  { char: '大', reading: 'dai / oo',       meaning: 'big'           },
  { char: '小', reading: 'shou / ko',      meaning: 'small'         },
  { char: '中', reading: 'chuu / naka',    meaning: 'middle'        },
  { char: '上', reading: 'jou / ue',       meaning: 'above, up'     },
  { char: '下', reading: 'ka / shita',     meaning: 'below, down'   },
  { char: '左', reading: 'sa / hidari',    meaning: 'left'          },
  { char: '右', reading: 'u / migi',       meaning: 'right'         },
  { char: '本', reading: 'hon',            meaning: 'book, origin'  },
  { char: '年', reading: 'nen / toshi',    meaning: 'year'          },
  { char: '一', reading: 'ichi',           meaning: 'one'           },
  { char: '二', reading: 'ni',             meaning: 'two'           },
  { char: '三', reading: 'san',            meaning: 'three'         },
  { char: '四', reading: 'shi / yon',      meaning: 'four'          },
  { char: '五', reading: 'go',             meaning: 'five'          },
  { char: '六', reading: 'roku',           meaning: 'six'           },
  { char: '七', reading: 'shichi / nana',  meaning: 'seven'         },
  { char: '八', reading: 'hachi',          meaning: 'eight'         },
  { char: '九', reading: 'ku / kyuu',      meaning: 'nine'          },
  { char: '十', reading: 'juu',            meaning: 'ten'           },
  { char: '百', reading: 'hyaku',          meaning: 'hundred'       },
  { char: '千', reading: 'sen',            meaning: 'thousand'      },
  { char: '万', reading: 'man',            meaning: 'ten thousand'  },
].map(c => ({ ...c, set: 'kanji_n5' }))

export const ALL_WRITING_CHARS = [...HIRAGANA, ...KATAKANA, ...KANJI_N5]

export function getCharsForSet(setId) {
  return ALL_WRITING_CHARS.filter(c => c.set === setId)
}

export function getSetDef(setId) {
  return WRITING_SETS.find(s => s.id === setId)
}

// Mastery: streak of 10 correct in a row = mastered; wrong resets to 0
export const WRITING_MASTERY_MAX = 10
export const WRITING_STORAGE_KEY = 'koikata_writing_mastery_v1'

export function loadWritingMastery() {
  try { return JSON.parse(localStorage.getItem(WRITING_STORAGE_KEY)) ?? {} }
  catch { return {} }
}

export function saveWritingMastery(mastery) {
  localStorage.setItem(WRITING_STORAGE_KEY, JSON.stringify(mastery))
}
