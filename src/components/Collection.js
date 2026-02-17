import React, { useState, useMemo } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { kanjiData } from '../data/kanjiData';
import { getUnlockedWords } from '../data/vocabPacks';
import { speak } from '../utils/speech';
import { getProgressStats, getWordProgressStats, getStarCount, getStarDetail, getStarThreshold, QUIZ_TYPES, KANJI_QUIZ_TYPES, MAX_WORD_LEVEL, STAR_THRESHOLD, getKanjiStarCount, getKanjiStarDetail } from '../utils/progressHelpers';
import '../styles/Collection.css';

function Collection({ kanaProgress, kanjiProgress = {}, wordProgress = {}, coins, unlockedPacks = [] }) {
  const [activeTab, setActiveTab] = useState('hiragana');
  const [selectedWord, setSelectedWord] = useState(null);
  const [showLearningOnly, setShowLearningOnly] = useState(false);

  const kanaStats = useMemo(() => getProgressStats(kanaProgress), [kanaProgress]);
  const wordStats = useMemo(() => getWordProgressStats(wordProgress), [wordProgress]);

  // Get full word data from unlocked packs
  const allWords = useMemo(() => getUnlockedWords(unlockedPacks), [unlockedPacks]);
  const wordLookup = useMemo(() => {
    const map = {};
    allWords.forEach(w => { map[w.word] = w; });
    return map;
  }, [allWords]);

  const kanjiMastered = useMemo(() => Object.values(kanjiProgress).filter(p => getKanjiStarCount(p) === KANJI_QUIZ_TYPES.length).length, [kanjiProgress]);
  const kanjiInProgress = useMemo(() => Object.values(kanjiProgress).filter(p => { const s = getKanjiStarCount(p); return s > 0 && s < KANJI_QUIZ_TYPES.length; }).length, [kanjiProgress]);

  const totalMastered = kanaStats.mastered + wordStats.mastered + kanjiMastered;
  const totalInProgress = kanaStats.inProgress + wordStats.learning + wordStats.proficient + kanjiInProgress;

  // Check if a kana has been attempted in any quiz type
  const isKanaAttempted = (progress) => {
    if (!progress) return false;
    return QUIZ_TYPES.some(qt => progress[qt]?.totalAttempts > 0);
  };

  const isKanjiAttempted = (progress) => {
    if (!progress) return false;
    return KANJI_QUIZ_TYPES.some(qt => progress[qt]?.totalAttempts > 0);
  };

  // Get background class based on progress state
  const getItemClass = (progress) => {
    if (!progress) return 'stars-none';
    const starCount = getStarCount(progress);
    if (starCount === QUIZ_TYPES.length) return 'stars-four'; // all mastered
    if (isKanaAttempted(progress)) return 'stars-one'; // learning (yellow)
    return 'stars-none'; // unseen
  };

  const getKanjiItemClass = (progress) => {
    if (!progress) return 'stars-none';
    const starCount = getKanjiStarCount(progress);
    if (starCount === KANJI_QUIZ_TYPES.length) return 'stars-four';
    if (isKanjiAttempted(progress)) return 'stars-one';
    return 'stars-none';
  };

  const getVocabItemClass = (wordProg) => {
    if (!wordProg || wordProg.level === 0) {
      if (wordProg && wordProg.totalAttempts > 0) return 'stars-one'; // attempted but level 0
      return 'stars-none';
    }
    if (wordProg.level >= MAX_WORD_LEVEL) return 'stars-three'; // mastered
    return 'stars-one'; // learning (yellow)
  };

  // Get consecutive correct count for a quiz type (this is what drives progress)
  const getConsecutiveCount = (charProgress, quizType) => {
    if (!charProgress || !charProgress[quizType]) return 0;
    if (charProgress[quizType].earned) return getStarThreshold(quizType);
    return charProgress[quizType].consecutiveCorrect || 0;
  };

  // Format as percentage
  const formatPercent = (count, threshold) => {
    const pct = Math.round((count / threshold) * 100);
    return Math.min(pct, 100);
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
      case 'kanji':
        return { type: 'kanji', data: kanjiData };
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

  const toggleLearningFilter = () => {
    setShowLearningOnly(prev => !prev);
  };

  const currentData = getCurrentData();

  // Filter data based on learning toggle
  const filteredData = useMemo(() => {
    if (!showLearningOnly) return currentData.data;

    if (currentData.type === 'kana') {
      return currentData.data.filter(kana => {
        const progress = kanaProgress[kana.char];
        return isKanaAttempted(progress);
      });
    } else if (currentData.type === 'kanji') {
      return currentData.data.filter(k => {
        return isKanjiAttempted(kanjiProgress[k.char]);
      });
    } else {
      return currentData.data.filter(item => {
        return item.totalAttempts > 0;
      });
    }
  }, [currentData.data, currentData.type, showLearningOnly, kanaProgress, kanjiProgress]);

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
          <div
            className={`stat-item stat-clickable ${showLearningOnly ? 'stat-active' : ''}`}
            onClick={toggleLearningFilter}
          >
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
          className={`tab-button ${activeTab === 'kanji' ? 'active' : ''}`}
          onClick={() => setActiveTab('kanji')}
        >
          Kanji
        </button>
        <button
          className={`tab-button ${activeTab === 'words' ? 'active' : ''}`}
          onClick={() => setActiveTab('words')}
        >
          Vocab
        </button>
      </div>

      <div className="collection-list">
        {filteredData.length === 0 ? (
          <div className="collection-empty">
            {showLearningOnly
              ? 'No items being learned yet. Start a quiz!'
              : activeTab === 'words'
                ? 'No words yet! Buy vocab packs from the Shop.'
                : 'Nothing here yet'}
          </div>
        ) : currentData.type === 'kana' ? (
          filteredData.map(kana => {
            const progress = kanaProgress[kana.char];
            const stars = getStarDetail(progress);
            return (
              <div
                key={kana.char}
                className={`kana-list-item ${getItemClass(progress)}`}
              >
                <span className="kana-list-char">{kana.char}</span>
                <span className="kana-list-romaji">{kana.romaji}</span>
                <span className="kana-list-stars">
                  {QUIZ_TYPES.map(qt => {
                    const count = getConsecutiveCount(progress, qt);
                    const threshold = getStarThreshold(qt);
                    const pct = formatPercent(count, threshold);
                    const isEarned = stars[qt];
                    return (
                      <span key={qt} className="star-with-count">
                        {isEarned ? (
                          <span className="earned">{'\u2605'}</span>
                        ) : (
                          <span className="progress-pct">{pct}%</span>
                        )}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })
        ) : currentData.type === 'kanji' ? (
          filteredData.map(k => {
            const progress = kanjiProgress[k.char];
            const stars = getKanjiStarDetail(progress);
            return (
              <div
                key={k.char}
                className={`kana-list-item ${getKanjiItemClass(progress)}`}
                onClick={() => speak(k.char)}
                title={`${k.onyomi}${k.kunyomi ? ' / ' + k.kunyomi : ''}`}
              >
                <span className="kana-list-char">{k.char}</span>
                <span className="kana-list-romaji" style={{ fontSize: '12px' }}>{k.meanings[0]}</span>
                <span className="kana-list-stars">
                  {KANJI_QUIZ_TYPES.map(qt => {
                    const qp = progress?.[qt];
                    const count = qp?.earned ? STAR_THRESHOLD : (qp?.consecutiveCorrect || 0);
                    const pct = formatPercent(count, STAR_THRESHOLD);
                    const isEarned = stars[qt];
                    return (
                      <span key={qt} className="star-with-count">
                        {isEarned ? (
                          <span className="earned">{'\u2605'}</span>
                        ) : (
                          <span className="progress-pct">{pct}%</span>
                        )}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })
        ) : (
          filteredData.map(item => {
            const level = item.level || 0;
            const pct = Math.round((level / MAX_WORD_LEVEL) * 100);
            const isMastered = level >= MAX_WORD_LEVEL;
            const wordProg = wordProgress[item.word];
            return (
              <div
                key={item.word}
                className={`kana-list-item vocab-list-item ${getVocabItemClass(wordProg)} clickable`}
                onClick={() => handleWordClick(item.word)}
              >
                <span className="kana-list-char vocab-char">{item.word}</span>
                <span className="kana-list-romaji vocab-translation">{item.translation}</span>
                <span className="kana-list-stars">
                  <span className="star-with-count">
                    {isMastered ? (
                      <span className="earned">{'\u2605'}</span>
                    ) : (
                      <span className="progress-pct">{pct}%</span>
                    )}
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
