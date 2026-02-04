import { vocabularyData } from './vocabularyData';

// Group words into packs of 5 by category
function createVocabPacks(words) {
  // Group words by category
  const byCategory = {};
  words.forEach(word => {
    const category = word.category || 'general';
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push(word);
  });

  const packs = [];
  let packId = 1;

  // Create packs of 5 words from each category
  Object.entries(byCategory).forEach(([category, categoryWords]) => {
    for (let i = 0; i < categoryWords.length; i += 5) {
      const packWords = categoryWords.slice(i, i + 5);
      if (packWords.length > 0) {
        packs.push({
          id: `pack_${packId}`,
          name: `${formatCategoryName(category)} ${Math.floor(i / 5) + 1}`,
          category: category,
          words: packWords,
          price: 15, // coins
        });
        packId++;
      }
    }
  });

  return packs;
}

function formatCategoryName(category) {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Create all vocab packs from the vocabulary data
export const vocabPacks = createVocabPacks(vocabularyData);

// Get pack by ID
export function getPackById(packId) {
  return vocabPacks.find(pack => pack.id === packId);
}

// Get all unique categories
export function getCategories() {
  const categories = [...new Set(vocabPacks.map(pack => pack.category))];
  return categories;
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
  unlockedPackIds.forEach(packId => {
    const pack = getPackById(packId);
    if (pack) {
      words.push(...pack.words);
    }
  });
  return words;
}

export default vocabPacks;
