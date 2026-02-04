import React, { useState, useMemo } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { getProgressStats, getWordProgressStats } from '../utils/progressHelpers';
import '../styles/Collection.css';

function Collection({ kanaProgress, wordProgress = {}, coins }) {
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('hiragana');

  const kanaStats = useMemo(() => getProgressStats(kanaProgress), [kanaProgress]);
  const wordStats = useMemo(() => getWordProgressStats(wordProgress), [wordProgress]);

  // Combine stats for header
  const totalMastered = kanaStats.mastered + wordStats.mastered;
  const totalLearning = kanaStats.learning + kanaStats.proficient + wordStats.learning + wordStats.proficient;

  const filterKana = (kanaList) => {
    return kanaList.filter(kana => {
      const progress = kanaProgress[kana.char] || { level: 0 };
      switch (filter) {
        case 'unseen':
          return progress.level === 0;
        case 'learning':
          return progress.level >= 1 && progress.level <= 4;
        case 'mastered':
          return progress.level === 5;
        default:
          return true;
      }
    });
  };

  const filterWords = () => {
    const words = Object.entries(wordProgress).map(([word, progress]) => ({
      word,
      ...progress
    }));

    return words.filter(item => {
      switch (filter) {
        case 'unseen':
          return item.level === 0;
        case 'learning':
          return item.level >= 1 && item.level <= 4;
        case 'mastered':
          return item.level === 5;
        default:
          return true;
      }
    });
  };

  const getLevelClass = (level) => {
    if (level === 0) return 'level-unseen';
    if (level <= 2) return 'level-learning';
    if (level <= 4) return 'level-proficient';
    return 'level-mastered';
  };

  const getLevelStars = (level) => {
    return '\u2605'.repeat(level) + '\u2606'.repeat(5 - level);
  };

  const filteredHiragana = filterKana(hiraganaData);
  const filteredKatakana = filterKana(katakanaData);
  const filteredWords = filterWords();

  const getCurrentData = () => {
    switch (activeTab) {
      case 'hiragana':
        return { type: 'kana', data: filteredHiragana };
      case 'katakana':
        return { type: 'kana', data: filteredKatakana };
      case 'words':
        return { type: 'words', data: filteredWords };
      default:
        return { type: 'kana', data: filteredHiragana };
    }
  };

  const currentData = getCurrentData();
  const wordCount = Object.keys(wordProgress).length;

  return (
    <div className="collection-page">
      <div className="collection-header">
        <div className="collection-stats">
          <div className="stat-item">
            <span className="stat-value">{totalMastered}</span>
            <span className="stat-label">Mastered</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalLearning}</span>
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
          Words
        </button>
      </div>

      <div className="collection-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'unseen' ? 'active' : ''}`}
          onClick={() => setFilter('unseen')}
        >
          Unseen
        </button>
        <button
          className={`filter-button ${filter === 'learning' ? 'active' : ''}`}
          onClick={() => setFilter('learning')}
        >
          Learning
        </button>
        <button
          className={`filter-button ${filter === 'mastered' ? 'active' : ''}`}
          onClick={() => setFilter('mastered')}
        >
          Mastered
        </button>
      </div>

      <div className="collection-grid">
        {currentData.data.length === 0 ? (
          <div className="collection-empty">
            {activeTab === 'words' && wordCount === 0
              ? 'No words yet! Buy vocab packs from the Shop.'
              : 'Nothing matches this filter'}
          </div>
        ) : currentData.type === 'kana' ? (
          currentData.data.map(kana => {
            const progress = kanaProgress[kana.char] || { level: 0, consecutiveCorrect: 0 };
            return (
              <div
                key={kana.char}
                className={`kana-card ${getLevelClass(progress.level)}`}
              >
                <div className="kana-char">{kana.char}</div>
                <div className="kana-romaji">{kana.romaji}</div>
                <div className="kana-stars">{getLevelStars(progress.level)}</div>
                {progress.level > 0 && progress.level < 5 && (
                  <div className="kana-progress-bar">
                    <div
                      className="kana-progress-fill"
                      style={{
                        width: `${(progress.consecutiveCorrect / getRequiredForLevel(progress.level)) * 100}%`
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          currentData.data.map(item => (
            <div
              key={item.word}
              className={`kana-card word-card ${getLevelClass(item.level)}`}
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
