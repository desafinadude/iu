import { useState, useEffect, useCallback } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import {
  initializeProgress,
  processAnswer,
  createDefaultKanaProgress,
  createDefaultWordProgress,
  processWordAnswer,
  getWeightForQuizType,
  getWeightForWordLevel,
  getProgressStats,
  getWordProgressStats,
  VOCAB_PACK_PRICE,
} from '../utils/progressHelpers';

const STORAGE_KEY = 'koikataProgress';

function needsMigration(parsed) {
  // Detect old v1 format: kana progress has 'level' field instead of quiz-type sub-objects
  if (parsed.version === 2) return false;
  if (!parsed.kanaProgress) return false;
  const firstChar = Object.values(parsed.kanaProgress)[0];
  if (!firstChar) return false;
  // Old format has { level, consecutiveCorrect, ... } directly
  // New format has { kana: { ... }, reverse: { ... }, handwriting: { ... } }
  return typeof firstChar.level === 'number' || !firstChar.kana;
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      if (needsMigration(parsed)) {
        // Fresh start: reset kana progress, keep coins and word/pack data
        const defaultProgress = initializeProgress(hiraganaData, katakanaData);
        return {
          ...defaultProgress,
          coins: parsed.coins || 0,
          unlockedPacks: parsed.unlockedPacks || [],
          wordProgress: parsed.wordProgress || {},
        };
      }

      // v2 format - merge with defaults to handle newly added kana
      const defaultProgress = initializeProgress(hiraganaData, katakanaData);
      return {
        ...defaultProgress,
        ...parsed,
        kanaProgress: {
          ...defaultProgress.kanaProgress,
          ...parsed.kanaProgress,
        },
        unlockedPacks: parsed.unlockedPacks || [],
        wordProgress: parsed.wordProgress || {},
      };
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  const base = initializeProgress(hiraganaData, katakanaData);
  return {
    ...base,
    unlockedPacks: [],
    wordProgress: {},
  };
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress());

  // Save to localStorage whenever progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Kana answer recording - now requires quizType
  const recordAnswer = useCallback((char, isCorrect, quizType) => {
    let result = { starEarned: false, quizType, coinsEarned: 0 };

    setProgress(prev => {
      const currentKanaProgress = prev.kanaProgress[char] || createDefaultKanaProgress();
      const answerResult = processAnswer(currentKanaProgress, quizType, isCorrect);

      result = answerResult;

      return {
        ...prev,
        coins: prev.coins + answerResult.coinsEarned,
        kanaProgress: {
          ...prev.kanaProgress,
          [char]: answerResult.newProgress,
        },
      };
    });

    return result;
  }, []);

  // Word answer recording (no coins awarded per answer - coins awarded at quiz end)
  const recordWordAnswer = useCallback((wordKey, isCorrect) => {
    let result = { leveledUp: false, leveledDown: false, newLevel: 0 };

    setProgress(prev => {
      const currentWordProgress = prev.wordProgress[wordKey] || createDefaultWordProgress();
      const answerResult = processWordAnswer(currentWordProgress, isCorrect);

      result = answerResult;

      return {
        ...prev,
        wordProgress: {
          ...prev.wordProgress,
          [wordKey]: answerResult.newProgress,
        },
      };
    });

    return result;
  }, []);

  const getKanaProgress = useCallback((char) => {
    return progress.kanaProgress[char] || createDefaultKanaProgress();
  }, [progress.kanaProgress]);

  const getKanaWeight = useCallback((char, quizType) => {
    const kanaProgress = progress.kanaProgress[char] || createDefaultKanaProgress();
    return getWeightForQuizType(kanaProgress, quizType);
  }, [progress.kanaProgress]);

  const getWordProgress = useCallback((wordKey) => {
    return progress.wordProgress[wordKey] || createDefaultWordProgress();
  }, [progress.wordProgress]);

  const getWordWeight = useCallback((wordKey) => {
    const wordProg = progress.wordProgress[wordKey] || createDefaultWordProgress();
    return getWeightForWordLevel(wordProg.level);
  }, [progress.wordProgress]);

  const getStats = useCallback(() => {
    return getProgressStats(progress.kanaProgress);
  }, [progress.kanaProgress]);

  const getWordStats = useCallback(() => {
    return getWordProgressStats(progress.wordProgress);
  }, [progress.wordProgress]);

  // Purchase a vocab pack
  const purchasePack = useCallback((packId, price = VOCAB_PACK_PRICE) => {
    let success = false;

    setProgress(prev => {
      if (prev.unlockedPacks.includes(packId)) {
        return prev;
      }
      if (prev.coins < price) {
        return prev;
      }

      success = true;
      return {
        ...prev,
        coins: prev.coins - price,
        unlockedPacks: [...prev.unlockedPacks, packId],
      };
    });

    return success;
  }, []);

  const isPackUnlocked = useCallback((packId) => {
    return progress.unlockedPacks.includes(packId);
  }, [progress.unlockedPacks]);

  const spendCoins = useCallback((amount) => {
    let success = false;

    setProgress(prev => {
      if (prev.coins < amount) {
        return prev;
      }
      success = true;
      return {
        ...prev,
        coins: prev.coins - amount,
      };
    });

    return success;
  }, []);

  const awardCoins = useCallback((amount) => {
    setProgress(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = initializeProgress(hiraganaData, katakanaData);
    setProgress({
      ...fresh,
      unlockedPacks: [],
      wordProgress: {},
    });
  }, []);

  return {
    coins: progress.coins,
    kanaProgress: progress.kanaProgress,
    wordProgress: progress.wordProgress,
    unlockedPacks: progress.unlockedPacks,
    recordAnswer,
    recordWordAnswer,
    getKanaProgress,
    getKanaWeight,
    getWordProgress,
    getWordWeight,
    getStats,
    getWordStats,
    purchasePack,
    isPackUnlocked,
    spendCoins,
    awardCoins,
    resetProgress,
  };
}
