import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getUnlockedWords } from '../data/vocabPacks';
import { speak } from '../utils/speech';
import { getRandomElement } from '../utils/helpers';
import '../styles/VocabularyPractice.css';

// Helper functions to detect script type
const isHiragana = (char) => {
  const code = char.charCodeAt(0);
  return code >= 0x3041 && code <= 0x3096;
};

const isKatakana = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 0x30A1 && code <= 0x30FC) || char === '・' || char === 'ー';
};

const getWordScriptType = (word) => {
  let hasHiragana = false;
  let hasKatakana = false;

  for (const char of word) {
    if (isHiragana(char)) hasHiragana = true;
    if (isKatakana(char)) hasKatakana = true;
  }

  if (hasHiragana && !hasKatakana) return 'hiragana';
  if (hasKatakana && !hasHiragana) return 'katakana';
  return 'mixed';
};

function VocabularyPractice({ settings, unlockedPacks = [] }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [scriptFilter, setScriptFilter] = useState('both'); // 'both', 'hiragana', 'katakana'
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Get words from purchased packs only
  const availableWords = useMemo(() => getUnlockedWords(unlockedPacks), [unlockedPacks]);

  // Get unique categories from available words
  const allCategories = useMemo(() => {
    const categories = new Set(availableWords.map(item => item.category).filter(Boolean));
    return ['all', ...Array.from(categories).sort()];
  }, [availableWords]);

  const generateWord = useCallback(() => {
    // No words available if no packs purchased
    if (availableWords.length === 0) {
      setCurrentWord(null);
      return;
    }

    // Start with purchased words
    let filteredVocab = availableWords;

    // Filter by script type
    if (scriptFilter !== 'both') {
      filteredVocab = filteredVocab.filter(word => {
        const wordScript = getWordScriptType(word.word);
        if (scriptFilter === 'hiragana') {
          return wordScript === 'hiragana';
        } else if (scriptFilter === 'katakana') {
          return wordScript === 'katakana' || wordScript === 'mixed';
        }
        return true;
      });
    }

    // Filter by selected categories
    if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
      filteredVocab = filteredVocab.filter(word =>
        selectedCategories.some(category => word.category === category)
      );
    }

    // If no words match the filter, fall back to all available words
    if (filteredVocab.length === 0) {
      filteredVocab = availableWords;
    }

    const word = getRandomElement(filteredVocab);
    setCurrentWord(word);
    setShowTranslation(false); // Hide translation for new word
  }, [availableWords, selectedCategories, scriptFilter]);

  useEffect(() => {
    generateWord();
  }, [generateWord]);

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const newSelection = prev.filter(cat => cat !== 'all');
        if (newSelection.includes(category)) {
          // Remove if already selected
          return newSelection.filter(cat => cat !== category);
        } else {
          // Add to selection
          return [...newSelection, category];
        }
      });
    }
  };

  const getCategoryDisplayText = () => {
    if (selectedCategories.includes('all') || selectedCategories.length === 0) {
      return 'All Categories';
    }
    if (selectedCategories.length === 1) {
      return selectedCategories[0].charAt(0).toUpperCase() + selectedCategories[0].slice(1);
    }
    return `${selectedCategories.length} Categories`;
  };

  const getScriptDisplayText = () => {
    switch (scriptFilter) {
      case 'hiragana': return 'ひらがな';
      case 'katakana': return 'カタカナ';
      default: return 'Both';
    }
  };

  const handleWordClick = () => {
    if (currentWord) {
      speak(currentWord.word);
      setShowTranslation(true); // Show translation after speaking
    }
  };

  if (availableWords.length === 0) {
    return (
      <div className="vocab-empty">
        <div className="vocab-empty-icon">📚</div>
        <h3>No Words Yet!</h3>
        <p>Visit the Vocab Shop to buy word packs and start practicing.</p>
      </div>
    );
  }

  if (!currentWord) {
    return <div className="vocab-loading">Loading...</div>;
  }

  return (
    <div className="vocabulary-practice">
      {showCategoryModal && (
        <div className="category-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>Filters</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="category-list">
              {/* Script Type Filter */}
              <div className="filter-section">
                <h4>Script Type</h4>
                <div
                  className={`category-list-item ${scriptFilter === 'both' ? 'selected' : ''}`}
                  onClick={() => setScriptFilter('both')}
                >
                  Both (ひらがな + カタカナ)
                </div>
                <div
                  className={`category-list-item ${scriptFilter === 'hiragana' ? 'selected' : ''}`}
                  onClick={() => setScriptFilter('hiragana')}
                >
                  Hiragana (ひらがな)
                </div>
                <div
                  className={`category-list-item ${scriptFilter === 'katakana' ? 'selected' : ''}`}
                  onClick={() => setScriptFilter('katakana')}
                >
                  Katakana (カタカナ)
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-section">
                <h4>Categories</h4>
                <div
                  className={`category-list-item ${selectedCategories.includes('all') ? 'selected' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All Categories
                </div>
                {allCategories.filter(cat => cat !== 'all').map(category => (
                  <div
                    key={category}
                    className={`category-list-item ${selectedCategories.includes(category) ? 'selected' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="vocab-main-area">
        <button
          className="vocab-word-button"
          onClick={handleWordClick}
        >
          <div className={`vocab-word-text font-${settings.fontStyle}`}>{currentWord.word}</div>
        </button>
      </div>

      <div className="vocab-translation-area">
        {showTranslation && (
          <div className="vocab-translation-text">{currentWord.translation}</div>
        )}
      </div>

      <div className="vocab-controls">
        <button className="next-word-button" onClick={generateWord}>
          Next Word
        </button>
        <button
          className="category-icon-button"
          onClick={() => setShowCategoryModal(true)}
          title={`${getScriptDisplayText()} | ${getCategoryDisplayText()}`}
        >
          ☰
        </button>
      </div>
    </div>
  );
}

export default VocabularyPractice;
