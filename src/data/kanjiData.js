// Basic kanji for learning - organized by grade level and common usage
export const kanjiData = [
  // Grade 1 Kanji (most basic)
  { kanji: '一', meaning: 'One', reading: 'いち', grade: 1, category: 'numbers' },
  { kanji: '二', meaning: 'Two', reading: 'に', grade: 1, category: 'numbers' },
  { kanji: '三', meaning: 'Three', reading: 'さん', grade: 1, category: 'numbers' },
  { kanji: '四', meaning: 'Four', reading: 'よん', grade: 1, category: 'numbers' },
  { kanji: '五', meaning: 'Five', reading: 'ご', grade: 1, category: 'numbers' },
  { kanji: '六', meaning: 'Six', reading: 'ろく', grade: 1, category: 'numbers' },
  { kanji: '七', meaning: 'Seven', reading: 'なな', grade: 1, category: 'numbers' },
  { kanji: '八', meaning: 'Eight', reading: 'はち', grade: 1, category: 'numbers' },
  { kanji: '九', meaning: 'Nine', reading: 'きゅう', grade: 1, category: 'numbers' },
  { kanji: '十', meaning: 'Ten', reading: 'じゅう', grade: 1, category: 'numbers' },
  
  { kanji: '人', meaning: 'Person', reading: 'ひと', grade: 1, category: 'people' },
  { kanji: '大', meaning: 'Big', reading: 'おおきい', grade: 1, category: 'size' },
  { kanji: '小', meaning: 'Small', reading: 'ちいさい', grade: 1, category: 'size' },
  { kanji: '上', meaning: 'Up/Above', reading: 'うえ', grade: 1, category: 'direction' },
  { kanji: '下', meaning: 'Down/Below', reading: 'した', grade: 1, category: 'direction' },
  { kanji: '中', meaning: 'Middle/Inside', reading: 'なか', grade: 1, category: 'direction' },
  { kanji: '右', meaning: 'Right', reading: 'みぎ', grade: 1, category: 'direction' },
  { kanji: '左', meaning: 'Left', reading: 'ひだり', grade: 1, category: 'direction' },
  
  { kanji: '日', meaning: 'Sun/Day', reading: 'ひ', grade: 1, category: 'time' },
  { kanji: '月', meaning: 'Moon/Month', reading: 'つき', grade: 1, category: 'time' },
  { kanji: '火', meaning: 'Fire', reading: 'ひ', grade: 1, category: 'elements' },
  { kanji: '水', meaning: 'Water', reading: 'みず', grade: 1, category: 'elements' },
  { kanji: '木', meaning: 'Tree/Wood', reading: 'き', grade: 1, category: 'nature' },
  { kanji: '金', meaning: 'Gold/Money', reading: 'きん', grade: 1, category: 'materials' },
  { kanji: '土', meaning: 'Earth/Soil', reading: 'つち', grade: 1, category: 'elements' },
  
  { kanji: '山', meaning: 'Mountain', reading: 'やま', grade: 1, category: 'nature' },
  { kanji: '川', meaning: 'River', reading: 'かわ', grade: 1, category: 'nature' },
  { kanji: '田', meaning: 'Rice field', reading: 'た', grade: 1, category: 'nature' },
  { kanji: '花', meaning: 'Flower', reading: 'はな', grade: 1, category: 'nature' },
  
  // Grade 2 Kanji
  { kanji: '雨', meaning: 'Rain', reading: 'あめ', grade: 2, category: 'weather' },
  { kanji: '雲', meaning: 'Cloud', reading: 'くも', grade: 2, category: 'weather' },
  { kanji: '雪', meaning: 'Snow', reading: 'ゆき', grade: 2, category: 'weather' },
  { kanji: '風', meaning: 'Wind', reading: 'かぜ', grade: 2, category: 'weather' },
  
  { kanji: '春', meaning: 'Spring', reading: 'はる', grade: 2, category: 'seasons' },
  { kanji: '夏', meaning: 'Summer', reading: 'なつ', grade: 2, category: 'seasons' },
  { kanji: '秋', meaning: 'Autumn', reading: 'あき', grade: 2, category: 'seasons' },
  { kanji: '冬', meaning: 'Winter', reading: 'ふゆ', grade: 2, category: 'seasons' },
  
  { kanji: '朝', meaning: 'Morning', reading: 'あさ', grade: 2, category: 'time' },
  { kanji: '昼', meaning: 'Noon', reading: 'ひる', grade: 2, category: 'time' },
  { kanji: '夜', meaning: 'Night', reading: 'よる', grade: 2, category: 'time' },
  { kanji: '今', meaning: 'Now', reading: 'いま', grade: 2, category: 'time' },
  
  { kanji: '学', meaning: 'Study', reading: 'がく', grade: 1, category: 'education' },
  { kanji: '校', meaning: 'School', reading: 'こう', grade: 1, category: 'education' },
  { kanji: '先', meaning: 'Before/Teacher', reading: 'せん', grade: 1, category: 'education' },
  { kanji: '生', meaning: 'Life/Student', reading: 'せい', grade: 1, category: 'education' },
  
  { kanji: '家', meaning: 'House/Family', reading: 'いえ', grade: 2, category: 'family' },
  { kanji: '父', meaning: 'Father', reading: 'ちち', grade: 2, category: 'family' },
  { kanji: '母', meaning: 'Mother', reading: 'はは', grade: 2, category: 'family' },
  { kanji: '子', meaning: 'Child', reading: 'こ', grade: 1, category: 'family' },
  
  { kanji: '犬', meaning: 'Dog', reading: 'いぬ', grade: 1, category: 'animals' },
  { kanji: '猫', meaning: 'Cat', reading: 'ねこ', grade: 1, category: 'animals' },
  { kanji: '魚', meaning: 'Fish', reading: 'さかな', grade: 1, category: 'animals' },
  { kanji: '鳥', meaning: 'Bird', reading: 'とり', grade: 1, category: 'animals' },
  
  { kanji: '車', meaning: 'Car', reading: 'くるま', grade: 1, category: 'transportation' },
  { kanji: '電', meaning: 'Electric', reading: 'でん', grade: 2, category: 'technology' },
  { kanji: '話', meaning: 'Talk/Story', reading: 'はなし', grade: 2, category: 'communication' },
  { kanji: '聞', meaning: 'Listen/Hear', reading: 'きく', grade: 2, category: 'communication' },
  { kanji: '見', meaning: 'See/Look', reading: 'みる', grade: 1, category: 'senses' },
  
  // Grade 3 Kanji (slightly more advanced)
  { kanji: '友', meaning: 'Friend', reading: 'とも', grade: 2, category: 'people' },
  { kanji: '手', meaning: 'Hand', reading: 'て', grade: 1, category: 'body' },
  { kanji: '足', meaning: 'Foot/Leg', reading: 'あし', grade: 1, category: 'body' },
  { kanji: '頭', meaning: 'Head', reading: 'あたま', grade: 2, category: 'body' },
  { kanji: '目', meaning: 'Eye', reading: 'め', grade: 1, category: 'body' },
  { kanji: '口', meaning: 'Mouth', reading: 'くち', grade: 1, category: 'body' },
  
  { kanji: '食', meaning: 'Eat/Food', reading: 'たべる', grade: 2, category: 'food' },
  { kanji: '飲', meaning: 'Drink', reading: 'のむ', grade: 3, category: 'food' },
  { kanji: '米', meaning: 'Rice', reading: 'こめ', grade: 2, category: 'food' },
  { kanji: '肉', meaning: 'Meat', reading: 'にく', grade: 2, category: 'food' },
  
  { kanji: '行', meaning: 'Go', reading: 'いく', grade: 2, category: 'actions' },
  { kanji: '来', meaning: 'Come', reading: 'くる', grade: 2, category: 'actions' },
  { kanji: '帰', meaning: 'Return', reading: 'かえる', grade: 2, category: 'actions' },
  { kanji: '入', meaning: 'Enter', reading: 'はいる', grade: 1, category: 'actions' },
  { kanji: '出', meaning: 'Exit/Go out', reading: 'でる', grade: 1, category: 'actions' },
  
  { kanji: '国', meaning: 'Country', reading: 'くに', grade: 2, category: 'places' },
  { kanji: '町', meaning: 'Town', reading: 'まち', grade: 1, category: 'places' },
  { kanji: '村', meaning: 'Village', reading: 'むら', grade: 1, category: 'places' },
  { kanji: '駅', meaning: 'Station', reading: 'えき', grade: 3, category: 'places' },
  
  { kanji: '白', meaning: 'White', reading: 'しろ', grade: 1, category: 'colors' },
  { kanji: '黒', meaning: 'Black', reading: 'くろ', grade: 2, category: 'colors' },
  { kanji: '赤', meaning: 'Red', reading: 'あか', grade: 1, category: 'colors' },
  { kanji: '青', meaning: 'Blue', reading: 'あお', grade: 1, category: 'colors' },
  
  { kanji: '本', meaning: 'Book', reading: 'ほん', grade: 1, category: 'objects' },
  { kanji: '紙', meaning: 'Paper', reading: 'かみ', grade: 2, category: 'objects' },
  { kanji: '机', meaning: 'Desk', reading: 'つくえ', grade: 2, category: 'objects' },
  { kanji: '椅', meaning: 'Chair', reading: 'いす', grade: 3, category: 'objects' },
];