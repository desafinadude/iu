import { vocabularyData } from './vocabularyData';

// Theme-based vocabulary packs
// Words are organized by themes like colors, greetings, time, numbers, etc.

// Helper function to find words by their translations
function findWordsByTranslations(translations) {
  return vocabularyData.filter(word =>
    translations.some(trans =>
      word.translation.toLowerCase().includes(trans.toLowerCase())
    )
  );
}

// Helper function to find words by their Japanese text
function findWordsByJapanese(japaneseWords) {
  return vocabularyData.filter(word =>
    japaneseWords.includes(word.word)
  );
}

// Define theme packs with manually curated words
export const vocabPacks = [
  // COLORS
  {
    id: 'pack_colors',
    name: 'Colors',
    category: 'basics',
    words: findWordsByTranslations([
      'red', 'blue', 'white', 'black', 'yellow',
      'green', 'brown', 'color', 'pink'
    ]),
    price: 15,
  },

  // GREETINGS & BASIC EXPRESSIONS
  {
    id: 'pack_greetings',
    name: 'Greetings',
    category: 'basics',
    words: findWordsByJapanese([
      'おはよう', 'こんにちは', 'こんばんは', 'おやすみ', 'さようなら',
      'ありがとう', 'すみません', 'ごめんなさい', 'はい', 'いいえ'
    ]).concat(findWordsByTranslations([
      'hello', 'good morning', 'good night', 'goodbye', 'thank you',
      'excuse me', 'sorry', 'yes', 'no', 'please'
    ])).filter((word, index, self) =>
      index === self.findIndex(w => w.word === word.word)
    ).slice(0, 10),
    price: 10,
  },

  // NUMBERS 1-10
  {
    id: 'pack_numbers_basic',
    name: 'Numbers 1-10',
    category: 'numbers',
    words: findWordsByJapanese([
      'いち', 'に', 'さん', 'し', 'よん', 'ご', 'ろく', 'なな', 'しち', 'はち', 'きゅう', 'く', 'じゅう'
    ]).concat(findWordsByTranslations([
      'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
    ])).filter((word, index, self) =>
      index === self.findIndex(w => w.word === word.word)
    ).slice(0, 12),
    price: 15,
  },

  // TIME EXPRESSIONS
  {
    id: 'pack_time',
    name: 'Time',
    category: 'time',
    words: findWordsByTranslations([
      'morning', 'afternoon', 'evening', 'night', 'today', 'yesterday',
      'tomorrow', 'now', 'when', 'time', 'hour', 'minute', 'day after tomorrow'
    ]).slice(0, 12),
    price: 15,
  },

  // DAYS & MONTHS
  {
    id: 'pack_days_months',
    name: 'Days & Months',
    category: 'time',
    words: findWordsByTranslations([
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'january', 'february', 'march', 'april', 'may', 'june', 'month', 'week', 'year'
    ]).slice(0, 15),
    price: 20,
  },

  // FAMILY
  {
    id: 'pack_family',
    name: 'Family',
    category: 'people',
    words: findWordsByTranslations([
      'mother', 'father', 'sister', 'brother', 'family',
      'grandfather', 'grandmother', 'child', 'children', 'parent'
    ]).slice(0, 12),
    price: 15,
  },

  // FOOD - BASICS
  {
    id: 'pack_food_basic',
    name: 'Food Basics',
    category: 'food',
    words: findWordsByTranslations([
      'rice', 'bread', 'water', 'tea', 'coffee', 'milk',
      'egg', 'meat', 'fish', 'vegetable', 'fruit'
    ]).slice(0, 12),
    price: 15,
  },

  // FOOD - MEALS
  {
    id: 'pack_meals',
    name: 'Meals & Eating',
    category: 'food',
    words: findWordsByTranslations([
      'breakfast', 'lunch', 'dinner', 'meal', 'to eat', 'to drink',
      'delicious', 'tasty', 'restaurant', 'food', 'cuisine'
    ]).slice(0, 12),
    price: 15,
  },

  // DRINKS & SNACKS
  {
    id: 'pack_drinks_snacks',
    name: 'Drinks & Snacks',
    category: 'food',
    words: findWordsByJapanese([
      'みず', 'おちゃ', 'コーヒー', 'ぎゅうにゅう', 'ジュース', 'ビール', 'さけ'
    ]).concat(findWordsByTranslations([
      'water', 'tea', 'coffee', 'milk', 'juice', 'beer', 'sake',
      'cake', 'candy', 'butter', 'soup', 'curry'
    ])).filter((word, index, self) =>
      index === self.findIndex(w => w.word === word.word)
    ).slice(0, 12),
    price: 15,
  },

  // BODY PARTS
  {
    id: 'pack_body',
    name: 'Body Parts',
    category: 'body',
    words: findWordsByTranslations([
      'head', 'face', 'eye', 'ear', 'mouth', 'nose', 'hand',
      'foot', 'leg', 'arm', 'body', 'hair'
    ]).slice(0, 12),
    price: 15,
  },

  // PLACES
  {
    id: 'pack_places',
    name: 'Places',
    category: 'places',
    words: findWordsByTranslations([
      'house', 'home', 'school', 'station', 'restaurant',
      'shop', 'store', 'hospital', 'bank', 'post office', 'library'
    ]).slice(0, 12),
    price: 15,
  },

  // SCHOOL
  {
    id: 'pack_school',
    name: 'School',
    category: 'learning',
    words: findWordsByTranslations([
      'school', 'teacher', 'student', 'class', 'study', 'test',
      'book', 'pen', 'pencil', 'notebook', 'desk', 'paper'
    ]).slice(0, 12),
    price: 15,
  },

  // WEATHER
  {
    id: 'pack_weather',
    name: 'Weather',
    category: 'nature',
    words: findWordsByTranslations([
      'weather', 'rain', 'snow', 'cloud', 'sun', 'wind',
      'hot', 'cold', 'warm', 'cool', 'sunny', 'cloudy'
    ]).slice(0, 10),
    price: 15,
  },

  // SEASONS
  {
    id: 'pack_seasons',
    name: 'Seasons',
    category: 'nature',
    words: findWordsByTranslations([
      'spring', 'summer', 'autumn', 'fall', 'winter', 'season'
    ]),
    price: 10,
  },

  // TRANSPORTATION
  {
    id: 'pack_transport',
    name: 'Transportation',
    category: 'travel',
    words: findWordsByTranslations([
      'car', 'bus', 'train', 'bicycle', 'airplane', 'station',
      'taxi', 'motorcycle', 'to go', 'to come', 'to ride'
    ]).slice(0, 12),
    price: 15,
  },

  // CLOTHING
  {
    id: 'pack_clothing',
    name: 'Clothing',
    category: 'items',
    words: findWordsByTranslations([
      'shirt', 'pants', 'dress', 'shoes', 'hat', 'coat',
      'jacket', 'clothes', 'to wear', 'socks'
    ]).slice(0, 10),
    price: 15,
  },

  // HOUSEHOLD ITEMS
  {
    id: 'pack_household',
    name: 'Household Items',
    category: 'items',
    words: findWordsByTranslations([
      'table', 'chair', 'bed', 'door', 'window', 'room',
      'kitchen', 'bathroom', 'toilet', 'television', 'phone', 'camera'
    ]).slice(0, 12),
    price: 15,
  },

  // ADJECTIVES - DESCRIPTIONS
  {
    id: 'pack_adjectives',
    name: 'Adjectives',
    category: 'descriptors',
    words: findWordsByTranslations([
      'big', 'small', 'new', 'old', 'good', 'bad',
      'beautiful', 'pretty', 'ugly', 'tall', 'short', 'long'
    ]).slice(0, 12),
    price: 15,
  },

  // VERBS - BASIC ACTIONS
  {
    id: 'pack_verbs_basic',
    name: 'Basic Verbs',
    category: 'actions',
    words: findWordsByTranslations([
      'to go', 'to come', 'to eat', 'to drink', 'to see', 'to do',
      'to make', 'to buy', 'to sell', 'to read', 'to write', 'to speak'
    ]).slice(0, 12),
    price: 15,
  },

  // DIRECTIONS & POSITIONS
  {
    id: 'pack_directions',
    name: 'Directions',
    category: 'basics',
    words: findWordsByTranslations([
      'left', 'right', 'front', 'back', 'inside', 'outside',
      'top', 'bottom', 'above', 'below', 'near', 'far'
    ]).slice(0, 12),
    price: 15,
  },

  // KATAKANA LOANWORDS 1
  {
    id: 'pack_katakana_1',
    name: 'Katakana Words 1',
    category: 'katakana',
    words: vocabularyData.filter(word =>
      /^[\u30A0-\u30FF]+$/.test(word.word)
    ).slice(0, 12),
    price: 15,
  },

  // KATAKANA LOANWORDS 2
  {
    id: 'pack_katakana_2',
    name: 'Katakana Words 2',
    category: 'katakana',
    words: vocabularyData.filter(word =>
      /^[\u30A0-\u30FF]+$/.test(word.word)
    ).slice(12, 24),
    price: 15,
  },

  // KATAKANA LOANWORDS 3
  {
    id: 'pack_katakana_3',
    name: 'Katakana Words 3',
    category: 'katakana',
    words: vocabularyData.filter(word =>
      /^[\u30A0-\u30FF]+$/.test(word.word)
    ).slice(24, 36),
    price: 15,
  },
].filter(pack => pack.words.length > 0); // Only include packs with words

// Get pack by ID
export function getPackById(packId) {
  return vocabPacks.find(pack => pack.id === packId);
}

// Get all unique categories
export function getCategories() {
  const categories = [...new Set(vocabPacks.map(pack => pack.category))];
  return categories.sort();
}

// Get packs by category
export function getPacksByCategory(category) {
  if (!category || category === 'all') {
    return vocabPacks;
  }
  return vocabPacks.filter(pack => pack.category === category);
}

// Get all words from unlocked packs
export function getUnlockedWords(unlockedPackIds) {
  const words = [];
  const seenWords = new Set();

  unlockedPackIds.forEach(packId => {
    const pack = getPackById(packId);
    if (pack) {
      pack.words.forEach(word => {
        // Avoid duplicates
        if (!seenWords.has(word.word)) {
          seenWords.add(word.word);
          words.push(word);
        }
      });
    }
  });

  return words;
}

export default vocabPacks;
