import jlptN5Data from './jlptN5Data.json';

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

// Export the consolidated JLPT N5 vocabulary data with compatible structure
export const vocabularyData = transformedVocabulary;

// Export essential kanji list for kanji-specific quizzes  
export const essentialKanji = jlptN5Data.essentialKanji;

// Export combined data for components that need full data structure
export const jlptN5VocabularyData = jlptN5Data;

// Legacy export for backwards compatibility
export default transformedVocabulary;
