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
    setShowTranslation(false);
    speak(word.word);
  };

  const handleWordClick = () => {
    if (currentWord) {
      speak(currentWord.word);
      setShowTranslation(true);
    }
  };

  if (!currentWord) {
    return <div className="vocab-loading">Loading...</div>;
  }

  return (
    <div className="vocabulary-practice">
      <div className="vocab-header">
        <h2>Vocabulary Practice</h2>
        <p>Click the word to hear pronunciation</p>
      </div>

      <button
        className={`vocab-word ${settings.fontStyle}`}
        onClick={handleWordClick}
      >
        {currentWord.word}
      </button>

      <div className="vocab-romaji">{currentWord.romaji}</div>

      {showTranslation && (
        <div className="vocab-translation">
          {currentWord.translation}
        </div>
      )}

      <button className="next-word-button" onClick={generateWord}>
        Next Word
      </button>
    </div>
  );
}

export default VocabularyPractice;
