import jlptN5Data from './jlptN5Data.json';
import katakanaVocab from './katakanaVocab.json';

// Transform JLPT N5 data to match existing component expectations
const transformedVocabulary = jlptN5Data.vocabulary.map(entry => ({
  word: entry.word,
  romaji: entry.romaji,
  translation: entry.meaning, // Map 'meaning' to 'translation' for compatibility
  furigana: entry.furigana,
  category: entry.category,
  level: entry.level,
  is_essential_kanji: entry.is_essential_kanji
}));

// Filter for only hiragana and katakana words (no kanji)
const isOnlyKanaCharacters = (text) => {
  // Check if string contains only hiragana, katakana, or common punctuation
  return /^[\u3041-\u3096\u30A1-\u30FC・ー]+$/.test(text);
};

// Add transformed katakana vocabulary
const katakanaVocabulary = katakanaVocab.map(entry => ({
  word: entry.word,
  romaji: entry.romaji,
  translation: entry.meaning,
  furigana: entry.furigana,
  category: entry.category,
  level: entry.level,
  is_essential_kanji: entry.is_essential_kanji
}));

// Filter JLPT N5 data for kana-only words
const kanaOnlyJlptWords = transformedVocabulary.filter(entry => 
  isOnlyKanaCharacters(entry.word)
);

// Combine kana-only JLPT words with katakana vocabulary, removing duplicates
const combinedVocabulary = [...kanaOnlyJlptWords, ...katakanaVocabulary];
const seenWords = new Set();
export const vocabularyData = combinedVocabulary.filter(entry => {
  if (seenWords.has(entry.word)) {
    return false;
  }
  seenWords.add(entry.word);
  return true;
});

// Export essential kanji list for kanji-specific quizzes  
export const essentialKanji = jlptN5Data.essentialKanji;

// Export combined data for components that need full data structure
export const jlptN5VocabularyData = jlptN5Data;

// Legacy export for backwards compatibility
export default vocabularyData;
