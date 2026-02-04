import { useState, useEffect, useCallback } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import {
  initializeProgress,
  processAnswer,
  createDefaultKanaProgress,
  createDefaultWordProgress,
  getWeightForLevel,
  getProgressStats,
  getWordProgressStats,
  VOCAB_PACK_PRICE,
} from '../utils/progressHelpers';

const STORAGE_KEY = 'koikataProgress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all kana have progress entries (handles new kana added later)
      const defaultProgress = initializeProgress(hiraganaData, katakanaData);
      return {
        ...defaultProgress,
        ...parsed,
        kanaProgress: {
          ...defaultProgress.kanaProgress,
          ...parsed.kanaProgress,
        },
        // Ensure vocab fields exist
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

  // Kana answer recording
  const recordAnswer = useCallback((char, isCorrect) => {
    let result = { leveledUp: false, leveledDown: false, newLevel: 0, coinsEarned: 0 };

    setProgress(prev => {
      const currentKanaProgress = prev.kanaProgress[char] || createDefaultKanaProgress();
      const answerResult = processAnswer(currentKanaProgress, isCorrect);

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
    let result = { leveledUp: false, leveledDown: false, newLevel: 0, coinsEarned: 0 };

    setProgress(prev => {
      const currentWordProgress = prev.wordProgress[wordKey] || createDefaultWordProgress();
      const answerResult = processAnswer(currentWordProgress, isCorrect);

      result = answerResult;

      return {
        ...prev,
        // Don't add coins here - they're awarded at quiz completion
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

  const getKanaWeight = useCallback((char) => {
    const kanaProgress = progress.kanaProgress[char] || createDefaultKanaProgress();
    return getWeightForLevel(kanaProgress.level);
  }, [progress.kanaProgress]);

  const getWordProgress = useCallback((wordKey) => {
    return progress.wordProgress[wordKey] || createDefaultWordProgress();
  }, [progress.wordProgress]);

  const getWordWeight = useCallback((wordKey) => {
    const wordProg = progress.wordProgress[wordKey] || createDefaultWordProgress();
    return getWeightForLevel(wordProg.level);
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
      // Check if already owned
      if (prev.unlockedPacks.includes(packId)) {
        return prev;
      }
      // Check if enough coins
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
