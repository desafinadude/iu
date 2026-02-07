import React, { useState, useMemo } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { getProgressStats, getWordProgressStats, getStarCount, getStarDetail, STAR_THRESHOLD } from '../utils/progressHelpers';
import '../styles/Collection.css';

function Collection({ kanaProgress, wordProgress = {}, coins }) {
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('hiragana');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'kana-progress', 'reverse-progress', 'handwriting-progress'

  const kanaStats = useMemo(() => getProgressStats(kanaProgress), [kanaProgress]);
  const wordStats = useMemo(() => getWordProgressStats(wordProgress), [wordProgress]);

  const totalMastered = kanaStats.mastered + wordStats.mastered;
  const totalInProgress = kanaStats.inProgress + wordStats.learning + wordStats.proficient;

  const filterKana = (kanaList) => {
    return kanaList.filter(kana => {
      const progress = kanaProgress[kana.char];
      const stars = getStarDetail(progress);
      const starCount = getStarCount(progress);

      switch (filter) {
        case 'no-stars':
          return starCount === 0;
        case 'missing-kana':
          return !stars.kana;
        case 'missing-reverse':
          return !stars.reverse;
        case 'missing-handwriting':
          return !stars.handwriting;
        case 'mastered':
          return starCount === 3;
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
        case 'no-stars':
          return item.level === 0;
        case 'mastered':
          return item.level === 5;
        case 'missing-kana':
        case 'missing-reverse':
        case 'missing-handwriting':
          return true; // Quiz-type filters don't apply to words
        default:
          return true;
      }
    });
  };

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

  const getStreaks = (progress) => {
    if (!progress || !progress.kana) return { kana: 0, reverse: 0, handwriting: 0 };
    return {
      kana: progress.kana.consecutiveCorrect,
      reverse: progress.reverse.consecutiveCorrect,
      handwriting: progress.handwriting.consecutiveCorrect,
    };
  };

  const sortKana = (kanaList) => {
    if (sortBy === 'default') return kanaList;

    const quizType = sortBy.replace('-progress', ''); // 'kana', 'reverse', or 'handwriting'

    return [...kanaList].sort((a, b) => {
      const progressA = kanaProgress[a.char]?.[quizType];
      const progressB = kanaProgress[b.char]?.[quizType];

      // If star is earned, progress is 100%, otherwise calculate percentage
      const percentA = progressA?.earned ? 100 :
        ((progressA?.consecutiveCorrect || 0) / STAR_THRESHOLD) * 100;
      const percentB = progressB?.earned ? 100 :
        ((progressB?.consecutiveCorrect || 0) / STAR_THRESHOLD) * 100;

      // Sort descending (highest progress first)
      return percentB - percentA;
    });
  };

  const filteredHiragana = sortKana(filterKana(hiraganaData));
  const filteredKatakana = sortKana(filterKana(katakanaData));
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

  const isKanaTab = activeTab === 'hiragana' || activeTab === 'katakana';

  return (
    <div className="collection-page">
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
          Words
        </button>
      </div>

      {isKanaTab && (
        <div className="collection-sort">
          <span className="sort-label">Sort by:</span>
          <button
            className={`sort-button ${sortBy === 'default' ? 'active' : ''}`}
            onClick={() => setSortBy('default')}
          >
            Default
          </button>
          <button
            className={`sort-button ${sortBy === 'kana-progress' ? 'active' : ''}`}
            onClick={() => setSortBy('kana-progress')}
          >
            Kana
          </button>
          <button
            className={`sort-button ${sortBy === 'reverse-progress' ? 'active' : ''}`}
            onClick={() => setSortBy('reverse-progress')}
          >
            Reverse
          </button>
          <button
            className={`sort-button ${sortBy === 'handwriting-progress' ? 'active' : ''}`}
            onClick={() => setSortBy('handwriting-progress')}
          >
            Writing
          </button>
        </div>
      )}

      <div className="collection-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'no-stars' ? 'active' : ''}`}
          onClick={() => setFilter('no-stars')}
        >
          No Stars
        </button>
        {isKanaTab && (
          <>
            <button
              className={`filter-button ${filter === 'missing-kana' ? 'active' : ''}`}
              onClick={() => setFilter('missing-kana')}
            >
              Needs Kana
            </button>
            <button
              className={`filter-button ${filter === 'missing-reverse' ? 'active' : ''}`}
              onClick={() => setFilter('missing-reverse')}
            >
              Needs Reverse
            </button>
            <button
              className={`filter-button ${filter === 'missing-handwriting' ? 'active' : ''}`}
              onClick={() => setFilter('missing-handwriting')}
            >
              Needs Writing
            </button>
          </>
        )}
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
            const progress = kanaProgress[kana.char];
            const stars = getStarDetail(progress);
            const starCount = getStarCount(progress);
            const streaks = getStreaks(progress);
            return (
              <div
                key={kana.char}
                className={`kana-card ${getStarClass(starCount)}`}
              >
                <div className="kana-char">{kana.char}</div>
                <div className="kana-romaji">{kana.romaji}</div>
                <div className="kana-stars-row">
                  <div className="star-col" title="Kana Quiz">
                    <div className="star-wrapper">
                      <span
                        className={`star-icon ${stars.kana ? 'earned' : 'empty'}`}
                      >
                        {'\u2605'}
                      </span>
                      {!stars.kana && (
                        <span
                          className="star-fill"
                          style={{ height: `${(streaks.kana / STAR_THRESHOLD) * 100}%` }}
                        >
                          {'\u2605'}
                        </span>
                      )}
                    </div>
                    <span className="star-count">
                      {stars.kana ? '\u2713' : STAR_THRESHOLD - streaks.kana}
                    </span>
                  </div>
                  <div className="star-col" title="Reverse Quiz">
                    <div className="star-wrapper">
                      <span
                        className={`star-icon ${stars.reverse ? 'earned' : 'empty'}`}
                      >
                        {'\u2605'}
                      </span>
                      {!stars.reverse && (
                        <span
                          className="star-fill"
                          style={{ height: `${(streaks.reverse / STAR_THRESHOLD) * 100}%` }}
                        >
                          {'\u2605'}
                        </span>
                      )}
                    </div>
                    <span className="star-count">
                      {stars.reverse ? '\u2713' : STAR_THRESHOLD - streaks.reverse}
                    </span>
                  </div>
                  <div className="star-col" title="Handwriting">
                    <div className="star-wrapper">
                      <span
                        className={`star-icon ${stars.handwriting ? 'earned' : 'empty'}`}
                      >
                        {'\u2605'}
                      </span>
                      {!stars.handwriting && (
                        <span
                          className="star-fill"
                          style={{ height: `${(streaks.handwriting / STAR_THRESHOLD) * 100}%` }}
                        >
                          {'\u2605'}
                        </span>
                      )}
                    </div>
                    <span className="star-count">
                      {stars.handwriting ? '\u2713' : STAR_THRESHOLD - streaks.handwriting}
                    </span>
                  </div>
                </div>
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
