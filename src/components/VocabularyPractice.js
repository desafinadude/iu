import React, { useState, useEffect } from 'react';
import { vocabularyData } from '../data/vocabularyData';
import { speak } from '../utils/speech';
import { getRandomElement } from '../utils/helpers';
import '../styles/VocabularyPractice.css';

function VocabularyPractice({ settings }) {
  const [currentWord, setCurrentWord] = useState(null);

  useEffect(() => {
    generateWord();
  }, []);

  const generateWord = () => {
    const word = getRandomElement(vocabularyData);
    setCurrentWord(word);
  };

  const handleWordClick = () => {
    if (currentWord) {
      speak(currentWord.word);
    }
  };

  if (!currentWord) {
    return <div className="vocab-loading">Loading...</div>;
  }

  return (
    <div className="vocabulary-practice">
      <button
        className={`vocab-word ${settings.fontStyle}`}
        onClick={handleWordClick}
      >
        {currentWord.word}
      </button>

      <div className="vocab-translation">
        {currentWord.translation}
      </div>

      <button className="next-word-button" onClick={generateWord}>
        Next Word
      </button>
    </div>
  );
}

export default VocabularyPractice;
