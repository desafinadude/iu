import React, { useState, useEffect, useCallback } from 'react';
import { vocabularyData } from '../data/vocabularyData';
import { speak } from '../utils/speech';
import { getRandomElement } from '../utils/helpers';
import '../styles/VocabularyPractice.css';

function VocabularyPractice({ settings }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Get unique categories from vocabulary data
  const allCategories = ['all', ...Array.from(new Set(vocabularyData
    .map(item => item.category)
    .filter(category => category)
  )).sort()];

  const generateWord = useCallback(() => {
    // Filter vocabulary by selected categories
    let filteredVocab = vocabularyData;
    if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
      filteredVocab = vocabularyData.filter(word => 
        selectedCategories.some(category => word.category === category)
      );
    }
    
    // If no words match the filter, fall back to all words
    if (filteredVocab.length === 0) {
      filteredVocab = vocabularyData;
    }
    
    const word = getRandomElement(filteredVocab);
    setCurrentWord(word);
    setShowTranslation(false); // Hide translation for new word
  }, [selectedCategories]);

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

  const handleWordClick = () => {
    if (currentWord) {
      speak(currentWord.word);
      setShowTranslation(true); // Show translation after speaking
    }
  };

  if (!currentWord) {
    return <div className="vocab-loading">Loading...</div>;
  }

  return (
    <div className="vocabulary-practice">
      {showCategoryModal && (
        <div className="category-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>Select Categories</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="category-list">
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
      )}

      <div className="vocab-main-area">
        <button
          className="vocab-word-bubble"
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
          title={`Categories: ${getCategoryDisplayText()}`}
        >
          ☰
        </button>
      </div>
    </div>
  );
}

export default VocabularyPractice;
