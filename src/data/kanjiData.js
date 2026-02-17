// JLPT N5 Kanji – 112 characters
// Fields: char, meanings (array), onyomi (string), kunyomi (string), category
// kunyomi is '' when none exists

export const kanjiData = [
  // ── Numbers ──────────────────────────────────────────────────
  { char: '一', meanings: ['one'], onyomi: 'いち・いつ', kunyomi: 'ひと-つ', category: 'numbers' },
  { char: '二', meanings: ['two'], onyomi: 'に', kunyomi: 'ふた-つ', category: 'numbers' },
  { char: '三', meanings: ['three'], onyomi: 'さん', kunyomi: 'みっ-つ', category: 'numbers' },
  { char: '四', meanings: ['four'], onyomi: 'し', kunyomi: 'よっ-つ', category: 'numbers' },
  { char: '五', meanings: ['five'], onyomi: 'ご', kunyomi: 'いつ-つ', category: 'numbers' },
  { char: '六', meanings: ['six'], onyomi: 'ろく', kunyomi: 'むっ-つ', category: 'numbers' },
  { char: '七', meanings: ['seven'], onyomi: 'しち', kunyomi: 'なな-つ', category: 'numbers' },
  { char: '八', meanings: ['eight'], onyomi: 'はち', kunyomi: 'やっ-つ', category: 'numbers' },
  { char: '九', meanings: ['nine'], onyomi: 'く・きゅう', kunyomi: 'ここの-つ', category: 'numbers' },
  { char: '十', meanings: ['ten'], onyomi: 'じゅう', kunyomi: 'とお', category: 'numbers' },
  { char: '百', meanings: ['hundred'], onyomi: 'ひゃく', kunyomi: '', category: 'numbers' },
  { char: '千', meanings: ['thousand'], onyomi: 'せん', kunyomi: '', category: 'numbers' },
  { char: '万', meanings: ['ten thousand'], onyomi: 'まん・ばん', kunyomi: '', category: 'numbers' },
  { char: '円', meanings: ['yen', 'circle'], onyomi: 'えん', kunyomi: 'まる-い', category: 'numbers' },

  // ── Time ─────────────────────────────────────────────────────
  { char: '年', meanings: ['year'], onyomi: 'ねん', kunyomi: 'とし', category: 'time' },
  { char: '月', meanings: ['month', 'moon'], onyomi: 'げつ・がつ', kunyomi: 'つき', category: 'time' },
  { char: '日', meanings: ['day', 'sun'], onyomi: 'にち・じつ', kunyomi: 'ひ・か', category: 'time' },
  { char: '時', meanings: ['time', 'hour'], onyomi: 'じ', kunyomi: 'とき', category: 'time' },
  { char: '分', meanings: ['minute', 'part'], onyomi: 'ふん・ぶん', kunyomi: 'わ-かる', category: 'time' },
  { char: '半', meanings: ['half'], onyomi: 'はん', kunyomi: 'なか-ば', category: 'time' },
  { char: '今', meanings: ['now'], onyomi: 'こん・きん', kunyomi: 'いま', category: 'time' },
  { char: '毎', meanings: ['every', 'each'], onyomi: 'まい', kunyomi: '', category: 'time' },
  { char: '週', meanings: ['week'], onyomi: 'しゅう', kunyomi: '', category: 'time' },
  { char: '曜', meanings: ['day of the week'], onyomi: 'よう', kunyomi: '', category: 'time' },
  { char: '前', meanings: ['before', 'front'], onyomi: 'ぜん', kunyomi: 'まえ', category: 'time' },
  { char: '後', meanings: ['after', 'behind'], onyomi: 'ご・こう', kunyomi: 'あと・のち', category: 'time' },
  { char: '午', meanings: ['noon'], onyomi: 'ご', kunyomi: '', category: 'time' },
  { char: '朝', meanings: ['morning'], onyomi: 'ちょう', kunyomi: 'あさ', category: 'time' },
  { char: '夕', meanings: ['evening'], onyomi: 'せき', kunyomi: 'ゆう', category: 'time' },
  { char: '夜', meanings: ['night'], onyomi: 'や', kunyomi: 'よる・よ', category: 'time' },
  { char: '何', meanings: ['what', 'how many'], onyomi: 'か', kunyomi: 'なに・なん', category: 'time' },

  // ── People & Family ──────────────────────────────────────────
  { char: '人', meanings: ['person', 'people'], onyomi: 'じん・にん', kunyomi: 'ひと', category: 'people' },
  { char: '男', meanings: ['man', 'male'], onyomi: 'だん・なん', kunyomi: 'おとこ', category: 'people' },
  { char: '女', meanings: ['woman', 'female'], onyomi: 'じょ・にょ', kunyomi: 'おんな', category: 'people' },
  { char: '子', meanings: ['child'], onyomi: 'し・す', kunyomi: 'こ', category: 'people' },
  { char: '父', meanings: ['father'], onyomi: 'ふ', kunyomi: 'ちち', category: 'people' },
  { char: '母', meanings: ['mother'], onyomi: 'ぼ', kunyomi: 'はは', category: 'people' },
  { char: '親', meanings: ['parent', 'intimate'], onyomi: 'しん', kunyomi: 'おや', category: 'people' },
  { char: '友', meanings: ['friend'], onyomi: 'ゆう', kunyomi: 'とも', category: 'people' },
  { char: '先', meanings: ['previous', 'ahead', 'tip'], onyomi: 'せん', kunyomi: 'さき', category: 'people' },
  { char: '生', meanings: ['life', 'birth', 'raw'], onyomi: 'せい・しょう', kunyomi: 'い-きる・なま', category: 'people' },

  // ── Language & Study ─────────────────────────────────────────
  { char: '字', meanings: ['character', 'letter'], onyomi: 'じ', kunyomi: 'あざ', category: 'study' },
  { char: '文', meanings: ['writing', 'sentence', 'culture'], onyomi: 'ぶん・もん', kunyomi: 'ふみ', category: 'study' },
  { char: '語', meanings: ['language', 'word'], onyomi: 'ご', kunyomi: 'かた-る', category: 'study' },
  { char: '国', meanings: ['country'], onyomi: 'こく', kunyomi: 'くに', category: 'study' },
  { char: '外', meanings: ['outside', 'foreign'], onyomi: 'がい・げ', kunyomi: 'そと・ほか', category: 'study' },
  { char: '学', meanings: ['study', 'learn'], onyomi: 'がく', kunyomi: 'まな-ぶ', category: 'study' },
  { char: '校', meanings: ['school'], onyomi: 'こう', kunyomi: '', category: 'study' },
  { char: '本', meanings: ['book', 'origin', 'main'], onyomi: 'ほん', kunyomi: 'もと', category: 'study' },
  { char: '読', meanings: ['read'], onyomi: 'どく・とく', kunyomi: 'よ-む', category: 'study' },
  { char: '書', meanings: ['write'], onyomi: 'しょ', kunyomi: 'か-く', category: 'study' },
  { char: '話', meanings: ['talk', 'speak', 'story'], onyomi: 'わ', kunyomi: 'はな-す', category: 'study' },
  { char: '聞', meanings: ['hear', 'listen', 'ask'], onyomi: 'ぶん・もん', kunyomi: 'き-く', category: 'study' },
  { char: '見', meanings: ['see', 'look'], onyomi: 'けん', kunyomi: 'み-る', category: 'study' },

  // ── Actions ──────────────────────────────────────────────────
  { char: '食', meanings: ['eat', 'food'], onyomi: 'しょく', kunyomi: 'た-べる', category: 'actions' },
  { char: '飲', meanings: ['drink'], onyomi: 'いん', kunyomi: 'の-む', category: 'actions' },
  { char: '買', meanings: ['buy'], onyomi: 'ばい', kunyomi: 'か-う', category: 'actions' },
  { char: '来', meanings: ['come'], onyomi: 'らい', kunyomi: 'く-る', category: 'actions' },
  { char: '行', meanings: ['go', 'travel'], onyomi: 'こう・ぎょう', kunyomi: 'い-く・ゆ-く', category: 'actions' },
  { char: '帰', meanings: ['return', 'go home'], onyomi: 'き', kunyomi: 'かえ-る', category: 'actions' },
  { char: '起', meanings: ['wake up', 'rise'], onyomi: 'き', kunyomi: 'お-きる', category: 'actions' },
  { char: '入', meanings: ['enter', 'insert'], onyomi: 'にゅう', kunyomi: 'い-る・はい-る', category: 'actions' },
  { char: '出', meanings: ['exit', 'put out'], onyomi: 'しゅつ・すい', kunyomi: 'で-る・だ-す', category: 'actions' },

  // ── Transport & Technology ───────────────────────────────────
  { char: '車', meanings: ['car', 'vehicle'], onyomi: 'しゃ', kunyomi: 'くるま', category: 'transport' },
  { char: '電', meanings: ['electricity', 'electric'], onyomi: 'でん', kunyomi: '', category: 'transport' },
  { char: '気', meanings: ['spirit', 'energy', 'air', 'mood'], onyomi: 'き・け', kunyomi: '', category: 'transport' },

  // ── Nature ───────────────────────────────────────────────────
  { char: '山', meanings: ['mountain'], onyomi: 'さん', kunyomi: 'やま', category: 'nature' },
  { char: '川', meanings: ['river'], onyomi: 'せん', kunyomi: 'かわ', category: 'nature' },
  { char: '空', meanings: ['sky', 'empty', 'vacant'], onyomi: 'くう', kunyomi: 'そら・から', category: 'nature' },
  { char: '海', meanings: ['sea', 'ocean'], onyomi: 'かい', kunyomi: 'うみ', category: 'nature' },
  { char: '天', meanings: ['heaven', 'sky', 'weather'], onyomi: 'てん', kunyomi: 'あめ・あま', category: 'nature' },
  { char: '木', meanings: ['tree', 'wood'], onyomi: 'もく・ぼく', kunyomi: 'き', category: 'nature' },
  { char: '花', meanings: ['flower', 'blossom'], onyomi: 'か', kunyomi: 'はな', category: 'nature' },

  // ── Elements & Colors ────────────────────────────────────────
  { char: '水', meanings: ['water'], onyomi: 'すい', kunyomi: 'みず', category: 'elements' },
  { char: '火', meanings: ['fire'], onyomi: 'か', kunyomi: 'ひ', category: 'elements' },
  { char: '土', meanings: ['earth', 'soil', 'ground'], onyomi: 'ど・と', kunyomi: 'つち', category: 'elements' },
  { char: '金', meanings: ['gold', 'money', 'metal'], onyomi: 'きん・こん', kunyomi: 'かね', category: 'elements' },
  { char: '白', meanings: ['white'], onyomi: 'はく・びゃく', kunyomi: 'しろ', category: 'elements' },
  { char: '赤', meanings: ['red'], onyomi: 'せき・しゃく', kunyomi: 'あか', category: 'elements' },
  { char: '青', meanings: ['blue', 'green'], onyomi: 'せい・しょう', kunyomi: 'あお', category: 'elements' },

  // ── Size & Quality ───────────────────────────────────────────
  { char: '大', meanings: ['big', 'large', 'great'], onyomi: 'だい・たい', kunyomi: 'おお-きい', category: 'adjectives' },
  { char: '小', meanings: ['small', 'little'], onyomi: 'しょう', kunyomi: 'ちい-さい', category: 'adjectives' },
  { char: '高', meanings: ['tall', 'high', 'expensive'], onyomi: 'こう', kunyomi: 'たか-い', category: 'adjectives' },
  { char: '安', meanings: ['cheap', 'peaceful', 'safe'], onyomi: 'あん', kunyomi: 'やす-い', category: 'adjectives' },
  { char: '新', meanings: ['new'], onyomi: 'しん', kunyomi: 'あたら-しい', category: 'adjectives' },
  { char: '古', meanings: ['old'], onyomi: 'こ', kunyomi: 'ふる-い', category: 'adjectives' },
  { char: '長', meanings: ['long', 'leader', 'chief'], onyomi: 'ちょう', kunyomi: 'なが-い', category: 'adjectives' },
  { char: '多', meanings: ['many', 'much'], onyomi: 'た', kunyomi: 'おお-い', category: 'adjectives' },
  { char: '少', meanings: ['few', 'little', 'a bit'], onyomi: 'しょう', kunyomi: 'すく-ない', category: 'adjectives' },
  { char: '好', meanings: ['like', 'fond of'], onyomi: 'こう', kunyomi: 'す-き', category: 'adjectives' },

  // ── Directions & Position ────────────────────────────────────
  { char: '右', meanings: ['right'], onyomi: 'う・ゆう', kunyomi: 'みぎ', category: 'directions' },
  { char: '左', meanings: ['left'], onyomi: 'さ', kunyomi: 'ひだり', category: 'directions' },
  { char: '上', meanings: ['up', 'above', 'top'], onyomi: 'じょう', kunyomi: 'うえ', category: 'directions' },
  { char: '下', meanings: ['down', 'below', 'under'], onyomi: 'か・げ', kunyomi: 'した', category: 'directions' },
  { char: '中', meanings: ['middle', 'inside', 'during'], onyomi: 'ちゅう', kunyomi: 'なか', category: 'directions' },
  { char: '北', meanings: ['north'], onyomi: 'ほく', kunyomi: 'きた', category: 'directions' },
  { char: '南', meanings: ['south'], onyomi: 'なん', kunyomi: 'みなみ', category: 'directions' },
  { char: '東', meanings: ['east'], onyomi: 'とう', kunyomi: 'ひがし', category: 'directions' },
  { char: '西', meanings: ['west'], onyomi: 'せい・さい', kunyomi: 'にし', category: 'directions' },
  { char: '間', meanings: ['interval', 'between', 'space'], onyomi: 'かん・けん', kunyomi: 'あいだ・ま', category: 'directions' },

  // ── Body ─────────────────────────────────────────────────────
  { char: '口', meanings: ['mouth', 'opening'], onyomi: 'こう・く', kunyomi: 'くち', category: 'body' },
  { char: '手', meanings: ['hand', 'arm'], onyomi: 'しゅ', kunyomi: 'て', category: 'body' },
  { char: '目', meanings: ['eye', 'look'], onyomi: 'もく・ぼく', kunyomi: 'め', category: 'body' },
  { char: '耳', meanings: ['ear'], onyomi: 'じ', kunyomi: 'みみ', category: 'body' },
  { char: '足', meanings: ['foot', 'leg', 'enough'], onyomi: 'そく', kunyomi: 'あし', category: 'body' },

  // ── Other ────────────────────────────────────────────────────
  { char: '力', meanings: ['power', 'strength', 'ability'], onyomi: 'りょく・りき', kunyomi: 'ちから', category: 'other' },
  { char: '名', meanings: ['name', 'fame'], onyomi: 'めい・みょう', kunyomi: 'な', category: 'other' },
  { char: '会', meanings: ['meet', 'meeting', 'society'], onyomi: 'かい・え', kunyomi: 'あ-う', category: 'other' },
  { char: '立', meanings: ['stand', 'rise'], onyomi: 'りつ・りゅう', kunyomi: 'た-つ', category: 'other' },
  { char: '休', meanings: ['rest', 'vacation', 'absent'], onyomi: 'きゅう', kunyomi: 'やす-む', category: 'other' },
  { char: '工', meanings: ['work', 'craft', 'construction'], onyomi: 'こう・く', kunyomi: '', category: 'other' },
  { char: '店', meanings: ['shop', 'store'], onyomi: 'てん', kunyomi: 'みせ', category: 'other' },
];

// Subset that has kunyomi readings
export const kanjiWithKunyomi = kanjiData.filter(k => k.kunyomi !== '');

export default kanjiData;
