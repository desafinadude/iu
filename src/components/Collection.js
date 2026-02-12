import React, { useState, useMemo } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { getUnlockedWords } from '../data/vocabPacks';
import { speak } from '../utils/speech';
import { getProgressStats, getWordProgressStats, getStarCount, getStarDetail, STAR_THRESHOLD } from '../utils/progressHelpers';
import '../styles/Collection.css';

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
    return 'stars-three';
  };

  const getLevelClass = (level) => {
    if (level === 0) return 'stars-none';
    if (level <= 2) return 'stars-one';
    if (level <= 4) return 'stars-two';
    return 'stars-three';
  };

  const getLevelStars = (level) => {
    return '\u2605'.repeat(level) + '\u2606'.repeat(5 - level);
  };

  const getCorrectCount = (charProgress, quizType) => {
    if (!charProgress || !charProgress[quizType]) return 0;
    if (charProgress[quizType].earned) return STAR_THRESHOLD;
    return charProgress[quizType].totalCorrect || 0;
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'hiragana':
        return { type: 'kana', data: hiraganaData };
      case 'katakana':
        return { type: 'kana', data: katakanaData };
      case 'words':
        return { type: 'words', data: Object.entries(wordProgress).map(([word, progress]) => ({ word, ...progress })) };
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
  const wordCount = Object.keys(wordProgress).length;

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
            <span className="stat-value">{wordCount}</span>
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

      <div className={currentData.type === 'kana' ? 'collection-list' : 'collection-grid'}>
        {currentData.data.length === 0 ? (
          <div className="collection-empty">
            {activeTab === 'words' && wordCount === 0
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
                    <span className="star-progress-num">{getCorrectCount(progress, 'kana')}/{STAR_THRESHOLD}</span>
                  </span>
                  <span className="star-with-count">
                    <span className={stars.reverse ? 'earned' : 'empty'}>{'\u2605'}</span>
                    <span className="star-progress-num">{getCorrectCount(progress, 'reverse')}/{STAR_THRESHOLD}</span>
                  </span>
                  <span className="star-with-count">
                    <span className={stars.handwriting ? 'earned' : 'empty'}>{'\u2605'}</span>
                    <span className="star-progress-num">{getCorrectCount(progress, 'handwriting')}/{STAR_THRESHOLD}</span>
                  </span>
                </span>
              </div>
            );
          })
        ) : (
          currentData.data.map(item => (
            <div
              key={item.word}
              className={`kana-card word-card ${getLevelClass(item.level)} clickable`}
              onClick={() => handleWordClick(item.word)}
            >
              <div className="kana-char" style={{ fontSize: item.word.length > 3 ? '20px' : '28px' }}>
                {item.word}
              </div>
              <div className="kana-stars">{getLevelStars(item.level)}</div>
              {item.level > 0 && item.level < 5 && (
                <div className="kana-progress-bar">
                  <div
                    className="kana-progress-fill"
                    style={{
                      width: `${(item.consecutiveCorrect / getRequiredForLevel(item.level)) * 100}%`
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getRequiredForLevel(level) {
  const thresholds = { 0: 2, 1: 3, 2: 4, 3: 5, 4: 6 };
  return thresholds[level] || 2;
}

export default Collection;
