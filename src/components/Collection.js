import React, { useState, useMemo } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { getUnlockedWords } from '../data/vocabPacks';
import { speak } from '../utils/speech';
import { getProgressStats, getWordProgressStats, getStarCount, getStarDetail, getStarThreshold } from '../utils/progressHelpers';
import '../styles/Collection.css';

const VOCAB_STAR_THRESHOLD = 10;

function Collection({ kanaProgress, wordProgress = {}, coins, unlockedPacks = [] }) {
  const [activeTab, setActiveTab] = useState('hiragana');
  const [selectedWord, setSelectedWord] = useState(null);

  const kanaStats = useMemo(() => getProgressStats(kanaProgress), [kanaProgress]);
  const wordStats = useMemo(() => getWordProgressStats(wordProgress), [wordProgress]);

  // Get full word data from unlocked packs
  const allWords = useMemo(() => getUnlockedWords(unlockedPacks), [unlockedPacks]);
  const wordLookup = useMemo(() => {
    const map = {};
    allWords.forEach(w => { map[w.word] = w; });
    return map;
  }, [allWords]);

  const totalMastered = kanaStats.mastered + wordStats.mastered;
  const totalInProgress = kanaStats.inProgress + wordStats.learning + wordStats.proficient;

  const getStarClass = (starCount) => {
    if (starCount === 0) return 'stars-none';
    if (starCount === 1) return 'stars-one';
    if (starCount === 2) return 'stars-two';
    if (starCount === 3) return 'stars-three';
    return 'stars-four';
  };

  const getVocabStarClass = (totalCorrect) => {
    if (totalCorrect === 0) return 'stars-none';
    if (totalCorrect < VOCAB_STAR_THRESHOLD) return 'stars-one';
    return 'stars-three';
  };

  const getCorrectCount = (charProgress, quizType) => {
    if (!charProgress || !charProgress[quizType]) return 0;
    const threshold = getStarThreshold(quizType);
    if (charProgress[quizType].earned) return threshold;
    return charProgress[quizType].totalCorrect || 0;
  };

  const getThresholdForType = (quizType) => {
    return getStarThreshold(quizType);
  };

  // Build vocab list data from all unlocked words, merged with progress
  const getVocabData = () => {
    return allWords.map(w => {
      const progress = wordProgress[w.word] || { level: 0, consecutiveCorrect: 0, totalCorrect: 0, totalAttempts: 0 };
      return { ...w, ...progress };
    });
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'hiragana':
        return { type: 'kana', data: hiraganaData };
      case 'katakana':
        return { type: 'kana', data: katakanaData };
      case 'words':
        return { type: 'words', data: getVocabData() };
      default:
        return { type: 'kana', data: hiraganaData };
    }
  };

  const handleWordClick = (wordKey) => {
    const fullWord = wordLookup[wordKey];
    if (fullWord) {
      setSelectedWord(fullWord);
    }
  };

  const handleCardClose = () => {
    setSelectedWord(null);
  };

  const handleExampleClick = (e) => {
    e.stopPropagation();
    if (selectedWord && selectedWord.example) {
      speak(selectedWord.example);
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="collection-page">
      {/* Word detail card modal */}
      {selectedWord && (
        <div className="word-detail-overlay" onClick={handleCardClose}>
          <div className="word-detail-card" onClick={(e) => e.stopPropagation()}>
            <button className="word-detail-close" onClick={handleCardClose}>
              &times;
            </button>
            <div
              className="word-detail-word"
              onClick={() => speak(selectedWord.word)}
              title="Tap to hear"
            >
              {selectedWord.word}
            </div>
            <div className="word-detail-translation">{selectedWord.translation}</div>
            {selectedWord.romaji && (
              <div className="word-detail-romaji">{selectedWord.romaji}</div>
            )}
            {selectedWord.example && (
              <div className="word-detail-example" onClick={handleExampleClick}>
                <div className="example-label">Example (tap to hear):</div>
                <div className="example-jp">{selectedWord.example}</div>
                {selectedWord.exampleEN && (
                  <div className="example-en">{selectedWord.exampleEN}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="collection-header">
        <div className="collection-stats">
          <div className="stat-item">
            <span className="stat-value">{totalMastered}</span>
            <span className="stat-label">Mastered</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalInProgress}</span>
            <span className="stat-label">Learning</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{allWords.length}</span>
            <span className="stat-label">Words</span>
          </div>
        </div>

        <div className="collection-coins">
          <span className="coin-icon">&#x1FA99;</span>
          <span className="coin-total">{coins}</span>
        </div>
      </div>

      <div className="collection-tabs">
        <button
          className={`tab-button ${activeTab === 'hiragana' ? 'active' : ''}`}
          onClick={() => setActiveTab('hiragana')}
        >
          Hiragana
        </button>
        <button
          className={`tab-button ${activeTab === 'katakana' ? 'active' : ''}`}
          onClick={() => setActiveTab('katakana')}
        >
          Katakana
        </button>
        <button
          className={`tab-button ${activeTab === 'words' ? 'active' : ''}`}
          onClick={() => setActiveTab('words')}
        >
          Vocab
        </button>
      </div>

      <div className="collection-list">
        {currentData.data.length === 0 ? (
          <div className="collection-empty">
            {activeTab === 'words'
              ? 'No words yet! Buy vocab packs from the Shop.'
              : 'Nothing here yet'}
          </div>
        ) : currentData.type === 'kana' ? (
          currentData.data.map(kana => {
            const progress = kanaProgress[kana.char];
            const stars = getStarDetail(progress);
            const starCount = getStarCount(progress);
            return (
              <div
                key={kana.char}
                className={`kana-list-item ${getStarClass(starCount)}`}
              >
                <span className="kana-list-char">{kana.char}</span>
                <span className="kana-list-romaji">{kana.romaji}</span>
                <span className="kana-list-stars">
                  <span className="star-with-count">
                    <span className={stars.kana ? 'earned' : 'empty'}>{'\u2605'}</span>
                    <span className="star-progress-num">{getCorrectCount(progress, 'kana')}/{getThresholdForType('kana')}</span>
                  </span>
                  <span className="star-with-count">
                    <span className={stars.reverse ? 'earned' : 'empty'}>{'\u2605'}</span>
                    <span className="star-progress-num">{getCorrectCount(progress, 'reverse')}/{getThresholdForType('reverse')}</span>
                  </span>
                  <span className="star-with-count">
                    <span className={stars.handwriting ? 'earned' : 'empty'}>{'\u2605'}</span>
                    <span className="star-progress-num">{getCorrectCount(progress, 'handwriting')}/{getThresholdForType('handwriting')}</span>
                  </span>
                  <span className="star-with-count">
                    <span className={stars.matching ? 'earned' : 'empty'}>{'\u2605'}</span>
                    <span className="star-progress-num">{getCorrectCount(progress, 'matching')}/{getThresholdForType('matching')}</span>
                  </span>
                </span>
              </div>
            );
          })
        ) : (
          currentData.data.map(item => {
            const totalCorrect = item.totalCorrect || 0;
            const isEarned = totalCorrect >= VOCAB_STAR_THRESHOLD;
            const displayCount = Math.min(totalCorrect, VOCAB_STAR_THRESHOLD);
            return (
              <div
                key={item.word}
                className={`kana-list-item vocab-list-item ${getVocabStarClass(totalCorrect)} clickable`}
                onClick={() => handleWordClick(item.word)}
              >
                <span className="kana-list-char vocab-char">{item.word}</span>
                <span className="kana-list-romaji vocab-translation">{item.translation}</span>
                <span className="kana-list-stars">
                  <span className="star-with-count">
                    <span className={isEarned ? 'earned' : 'empty'}>{'\u2605'}</span>
                    <span className="star-progress-num">{displayCount}/{VOCAB_STAR_THRESHOLD}</span>
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Collection;
