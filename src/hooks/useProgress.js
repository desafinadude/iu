import { useState, useEffect, useCallback } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import kanjiData from '../data/kanjiData';
import { getDefaultUnlockedPacks } from '../data/vocabPacks';
import {
  initializeProgress,
  processAnswer,
  createDefaultKanaProgress,
  createDefaultKanjiProgress,
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

function initializeKanjiProgress() {
  const kanjiProgress = {};
  kanjiData.forEach(k => {
    kanjiProgress[k.char] = createDefaultKanjiProgress();
  });
  return kanjiProgress;
}

function loadProgress() {
  const defaultUnlockedPacks = getDefaultUnlockedPacks();
  const defaultKanjiProgress = initializeKanjiProgress();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      if (needsMigration(parsed)) {
        // Fresh start: reset kana progress, keep coins and word/pack data
        const defaultProgress = initializeProgress(hiraganaData, katakanaData);
        // Merge existing unlocked packs with default ones (no duplicates)
        const unlockedPacks = [...new Set([...defaultUnlockedPacks, ...(parsed.unlockedPacks || [])])];
        return {
          ...defaultProgress,
          coins: parsed.coins || 0,
          unlockedPacks,
          wordProgress: parsed.wordProgress || {},
          kanjiProgress: defaultKanjiProgress,
        };
      }

      // v2 format - merge with defaults to handle newly added kana/kanji
      const defaultProgress = initializeProgress(hiraganaData, katakanaData);
      // Merge existing unlocked packs with default ones (no duplicates)
      const unlockedPacks = [...new Set([...defaultUnlockedPacks, ...(parsed.unlockedPacks || [])])];
      return {
        ...defaultProgress,
        ...parsed,
        kanaProgress: {
          ...defaultProgress.kanaProgress,
          ...parsed.kanaProgress,
        },
        kanjiProgress: {
          ...defaultKanjiProgress,
          ...(parsed.kanjiProgress || {}),
        },
        unlockedPacks,
        wordProgress: parsed.wordProgress || {},
      };
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  const base = initializeProgress(hiraganaData, katakanaData);
  return {
    ...base,
    unlockedPacks: defaultUnlockedPacks,
    wordProgress: {},
    kanjiProgress: defaultKanjiProgress,
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

  // Kanji answer recording
  const recordKanjiAnswer = useCallback((char, isCorrect, quizType) => {
    let result = { starEarned: false, quizType, coinsEarned: 0 };

    setProgress(prev => {
      const currentKanjiProgress = (prev.kanjiProgress || {})[char] || createDefaultKanjiProgress();
      const answerResult = processAnswer(currentKanjiProgress, quizType, isCorrect);

      result = answerResult;

      return {
        ...prev,
        coins: prev.coins + answerResult.coinsEarned,
        kanjiProgress: {
          ...(prev.kanjiProgress || {}),
          [char]: answerResult.newProgress,
        },
      };
    });

    return result;
  }, []);

  const getKanjiWeight = useCallback((char, quizType) => {
    const kp = (progress.kanjiProgress || {})[char] || createDefaultKanjiProgress();
    return getWeightForQuizType(kp, quizType);
  }, [progress.kanjiProgress]);

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
      unlockedPacks: getDefaultUnlockedPacks(),
      wordProgress: {},
    });
  }, []);

  // Export progress as JSON file
  const exportProgress = useCallback(() => {
    const exportData = {
      version: 2, // Format version for future migrations
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0', // Could be from package.json
      data: {
        coins: progress.coins,
        unlockedPacks: progress.unlockedPacks,
        kanaProgress: progress.kanaProgress,
        wordProgress: progress.wordProgress,
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `koikata-progress-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [progress]);

  // Import progress from JSON file
  const importProgress = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);

          // Validate the import
          if (!imported.version || !imported.data) {
            reject(new Error('Invalid progress file format'));
            return;
          }

          // Version-specific migration logic
          let importedData = imported.data;
          if (imported.version === 1) {
            // Handle v1 format if needed in the future
            importedData = migrateV1ToV2(importedData);
          }

          // Merge with default unlocked packs (ensure new starter packs are unlocked)
          const defaultUnlockedPacks = getDefaultUnlockedPacks();
          const mergedUnlockedPacks = [...new Set([
            ...defaultUnlockedPacks,
            ...(importedData.unlockedPacks || [])
          ])];

          // Set the imported progress
          setProgress({
            version: 2,
            coins: importedData.coins || 0,
            unlockedPacks: mergedUnlockedPacks,
            kanaProgress: importedData.kanaProgress || {},
            wordProgress: importedData.wordProgress || {},
          });

          resolve({
            success: true,
            exportDate: imported.exportDate,
            version: imported.version
          });
        } catch (error) {
          reject(new Error('Failed to parse progress file: ' + error.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }, []);

  return {
    coins: progress.coins,
    kanaProgress: progress.kanaProgress,
    kanjiProgress: progress.kanjiProgress || {},
    wordProgress: progress.wordProgress,
    unlockedPacks: progress.unlockedPacks,
    recordAnswer,
    recordKanjiAnswer,
    recordWordAnswer,
    getKanaProgress,
    getKanaWeight,
    getKanjiWeight,
    getWordProgress,
    getWordWeight,
    getStats,
    getWordStats,
    purchasePack,
    isPackUnlocked,
    spendCoins,
    awardCoins,
    resetProgress,
    exportProgress,
    importProgress,
  };
}

// Helper function for future v1 to v2 migration
function migrateV1ToV2(v1Data) {
  // Currently no v1 format, but this is here for future use
  return v1Data;
}
