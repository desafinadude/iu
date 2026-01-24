import React, { useState, useEffect } from 'react';
import { vocabularyData } from '../data/vocabularyData';
import { speak } from '../utils/speech';
import { getRandomElement } from '../utils/helpers';
import '../styles/VocabularyPractice.css';

function VocabularyPractice({ settings }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    generateWord();
  }, []);

  const generateWord = () => {
    const word = getRandomElement(vocabularyData);
    setCurrentWord(word);
    setShowTranslation(false); // Hide translation for new word
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
      <div className="vocab-main-area">
        <button
          className="vocab-word-bubble"
          onClick={handleWordClick}
        >
          <div className={`vocab-word-text ${settings.fontStyle}`}>{currentWord.word}</div>
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
      </div>
    </div>
  );
}

export default VocabularyPractice;
