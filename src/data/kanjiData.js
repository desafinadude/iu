import jlptN5Data from './jlptN5Data.json';

// Get essential kanji characters for kanji quiz
export const essentialKanjiChars = jlptN5Data.essentialKanji;

// Get essential kanji vocabulary entries (those marked as essential)
export const essentialKanjiVocab = jlptN5Data.vocabulary.filter(entry => entry.is_essential_kanji);

// Create kanji data structure for kanji quiz component
export const kanjiData = essentialKanjiChars.map(kanjiChar => {
  // Find vocabulary entries that contain this kanji
  const relatedVocab = jlptN5Data.vocabulary.filter(entry => 
    entry.word.includes(kanjiChar)
  );
  
  // Get the first related vocabulary as primary example
  const primaryExample = relatedVocab[0];
  
  return {
    kanji: kanjiChar,
    meaning: primaryExample ? primaryExample.meaning : 'Essential kanji',
    reading: primaryExample ? primaryExample.furigana : '',
    category: primaryExample ? primaryExample.category : 'general',
    grade: 'N5', // All are JLPT N5 level essential kanji
    level: 'N5',
    isEssential: true,
    examples: relatedVocab.slice(0, 3) // First 3 examples
  };
});

// Legacy export for backward compatibility
export default kanjiData;

// Export combined JLPT N5 data for components that need full context
export const jlptN5KanjiData = jlptN5Data;
