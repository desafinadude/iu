import { vocabularyData } from './vocabularyData';
import jpod101VocabPacks from './jpod101VocabPacks';
import essentialPhrasesData from './essentialPhrases';

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

// Helper function to filter essential phrases by category
function getEssentialPhrases(category) {
  return essentialPhrasesData.filter(phrase => phrase.category === category);
}

// Calculate price based on pack size
function calculatePrice(wordCount) {
  if (wordCount < 10) return 10;  // Minimum price
  if (wordCount < 15) return 10;
  if (wordCount < 20) return 15;
  if (wordCount < 25) return 20;
  return 25;
}

// ============================================
// ESSENTIAL PHRASE PACKS (UNLOCKED BY DEFAULT)
// ============================================
const essentialPacks = [
  {
    id: 'essential_survival',
    name: 'Essential Phrases 1',
    category: 'survival',
    words: getEssentialPhrases('survival'),
    price: 0, // Free - unlocked by default
    unlocked: true,
  },
  {
    id: 'essential_greetings',
    name: 'Greetings & Politeness',
    category: 'greetings',
    words: getEssentialPhrases('greetings'),
    price: 0, // Free - unlocked by default
    unlocked: true,
  },
  {
    id: 'essential_restaurant',
    name: 'Restaurant & Food',
    category: 'restaurant',
    words: getEssentialPhrases('restaurant'),
    price: calculatePrice(getEssentialPhrases('restaurant').length),
  },
  {
    id: 'essential_travel',
    name: 'Navigation & Travel',
    category: 'travel',
    words: getEssentialPhrases('travel'),
    price: calculatePrice(getEssentialPhrases('travel').length),
  },
  {
    id: 'essential_shopping',
    name: 'Shopping',
    category: 'shopping',
    words: getEssentialPhrases('shopping'),
    price: calculatePrice(getEssentialPhrases('shopping').length),
  },
];

// ============================================
// JLPT-BASED THEME PACKS
// ============================================
const jlptBasedPacks = [
  // COLORS
  {
    id: 'pack_colors',
    name: 'Colors',
    category: 'basics',
    words: findWordsByTranslations([
      'red', 'blue', 'white', 'black', 'yellow',
      'green', 'brown', 'color', 'pink', 'purple', 'orange'
    ]),
    price: 15,
  },

  // NUMBERS 1-10
  {
    id: 'pack_numbers_basic',
    name: 'Numbers 1-10',
    category: 'numbers',
    words: findWordsByJapanese([
      'いち', 'に', 'さん', 'し', 'よん', 'ご', 'ろく', 'なな', 'しち', 'はち', 'きゅう', 'く', 'じゅう', 'れい'
    ]).concat(findWordsByTranslations([
      'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'zero'
    ])).filter((word, index, self) =>
      index === self.findIndex(w => w.word === word.word)
    ).slice(0, 12),
    price: 15,
  },

  // TIME EXPRESSIONS
  {
    id: 'pack_time',
    name: 'Time Expressions',
    category: 'time',
    words: findWordsByTranslations([
      'morning', 'afternoon', 'evening', 'night', 'today', 'yesterday',
      'tomorrow', 'now', 'when', 'time', 'hour', 'minute', 'day after tomorrow'
    ]).slice(0, 12),
    price: 15,
  },

  // FAMILY
  {
    id: 'pack_family',
    name: 'Family',
    category: 'people',
    words: findWordsByTranslations([
      'mother', 'father', 'sister', 'brother', 'family',
      'grandfather', 'grandmother', 'child', 'children', 'parent',
      'husband', 'wife', 'son', 'daughter'
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
      'egg', 'meat', 'fish', 'vegetable', 'fruit', 'food', 'meal'
    ]).slice(0, 12),
    price: 15,
  },

  // FOOD - MEALS & EATING
  {
    id: 'pack_meals',
    name: 'Meals & Eating',
    category: 'food',
    words: findWordsByTranslations([
      'breakfast', 'lunch', 'dinner', 'meal', 'to eat', 'to drink',
      'delicious', 'tasty', 'restaurant', 'hungry', 'thirsty'
    ]).slice(0, 12),
    price: 15,
  },

  // DRINKS
  {
    id: 'pack_drinks',
    name: 'Drinks',
    category: 'food',
    words: findWordsByJapanese([
      'みず', 'おちゃ', 'コーヒー', 'ぎゅうにゅう', 'ジュース', 'ビール', 'さけ', 'ワイン'
    ]).concat(findWordsByTranslations([
      'water', 'tea', 'coffee', 'milk', 'juice', 'beer', 'sake', 'wine',
      'drink', 'beverage', 'soda'
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
      'foot', 'leg', 'arm', 'body', 'hair', 'finger', 'stomach', 'back'
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
      'shop', 'store', 'hospital', 'bank', 'post office', 'library', 'park'
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
      'book', 'pen', 'pencil', 'notebook', 'desk', 'paper', 'learn'
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
      'hot', 'cold', 'warm', 'cool', 'sunny', 'cloudy', 'temperature'
    ]).slice(0, 12),
    price: 15,
  },

  // SEASONS
  {
    id: 'pack_seasons',
    name: 'Seasons',
    category: 'nature',
    words: findWordsByTranslations([
      'spring', 'summer', 'autumn', 'fall', 'winter', 'season',
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]).slice(0, 12),
    price: 15,
  },

  // TRANSPORTATION
  {
    id: 'pack_transport',
    name: 'Transportation',
    category: 'travel',
    words: findWordsByTranslations([
      'car', 'bus', 'train', 'bicycle', 'airplane', 'station',
      'taxi', 'motorcycle', 'to go', 'to come', 'to ride', 'ticket'
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
      'jacket', 'clothes', 'to wear', 'socks', 'skirt', 'bag'
    ]).slice(0, 12),
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
    name: 'Common Adjectives',
    category: 'descriptors',
    words: findWordsByTranslations([
      'big', 'small', 'new', 'old', 'good', 'bad',
      'beautiful', 'pretty', 'ugly', 'tall', 'short', 'long',
      'cheap', 'expensive', 'easy', 'difficult'
    ]).slice(0, 15),
    price: 15,
  },

  // VERBS - BASIC ACTIONS
  {
    id: 'pack_verbs_basic',
    name: 'Basic Verbs',
    category: 'actions',
    words: findWordsByTranslations([
      'to go', 'to come', 'to eat', 'to drink', 'to see', 'to do',
      'to make', 'to buy', 'to sell', 'to read', 'to write', 'to speak',
      'to use', 'to take'
    ]).slice(0, 15),
    price: 15,
  },

  // DIRECTIONS & POSITIONS
  {
    id: 'pack_directions',
    name: 'Directions',
    category: 'basics',
    words: findWordsByTranslations([
      'left', 'right', 'front', 'back', 'inside', 'outside',
      'top', 'bottom', 'above', 'below', 'near', 'far', 'straight'
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
];

// Filter out JPod101 packs with less than 10 words and adjust pricing
const filteredJPod101Packs = jpod101VocabPacks
  .filter(pack => pack.words.length >= 10)
  .map(pack => ({
    ...pack,
    price: calculatePrice(pack.words.length)
  }));

// Filter JLPT packs to ensure they have at least 10 words
const filteredJLPTPacks = jlptBasedPacks.filter(pack => pack.words.length >= 10);

// Combine all vocab packs: Essential packs first, then JLPT packs, then JPod101 packs
export const allVocabPacks = [
  ...essentialPacks,
  ...filteredJLPTPacks,
  ...filteredJPod101Packs
];

// Export the combined packs as the default
export const vocabPacks = allVocabPacks;

// Get default unlocked pack IDs (the free essential packs)
export function getDefaultUnlockedPacks() {
  return essentialPacks
    .filter(pack => pack.unlocked === true)
    .map(pack => pack.id);
}

// Get pack by ID
export function getPackById(packId) {
  return allVocabPacks.find(pack => pack.id === packId);
}

// Get all unique categories
export function getCategories() {
  const categories = [...new Set(allVocabPacks.map(pack => pack.category))];
  return categories.sort();
}

// Get packs by category
export function getPacksByCategory(category) {
  if (!category || category === 'all') {
    return allVocabPacks;
  }
  return allVocabPacks.filter(pack => pack.category === category);
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
