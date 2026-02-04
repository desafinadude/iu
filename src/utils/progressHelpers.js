// Level thresholds: consecutive correct answers needed to advance
const LEVEL_THRESHOLDS = {
  0: 2,  // 0→1: 2 consecutive correct
  1: 3,  // 1→2: 3 consecutive correct
  2: 4,  // 2→3: 4 consecutive correct
  3: 5,  // 3→4: 5 consecutive correct
  4: 6,  // 4→5: 6 consecutive correct
};

// Coins awarded when reaching each level
const LEVEL_COINS = {
  1: 5,
  2: 10,
  3: 15,
  4: 20,
  5: 30,
};

// Selection weights by mastery level (higher = more likely to appear)
const LEVEL_WEIGHTS = {
  0: 3.0,  // Unseen - high priority
  1: 2.5,  // Learning
  2: 2.0,  // Familiar
  3: 1.5,  // Proficient
  4: 1.0,  // Advanced
  5: 0.3,  // Mastered - rare
};

export const MAX_LEVEL = 5;

export function getRequiredCorrectForLevel(level) {
  return LEVEL_THRESHOLDS[level] ?? 0;
}

export function getCoinsForLevelUp(newLevel) {
  return LEVEL_COINS[newLevel] ?? 0;
}

export function getWeightForLevel(level) {
  return LEVEL_WEIGHTS[level] ?? 1.0;
}

export function createDefaultKanaProgress() {
  return {
    level: 0,
    consecutiveCorrect: 0,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}

export function initializeProgress(hiraganaData, katakanaData) {
  const kanaProgress = {};

  [...hiraganaData, ...katakanaData].forEach(kana => {
    kanaProgress[kana.char] = createDefaultKanaProgress();
  });

  return {
    version: 1,
    coins: 0,
    kanaProgress,
  };
}

export function processAnswer(currentProgress, isCorrect) {
  const { level, consecutiveCorrect, totalCorrect, totalAttempts } = currentProgress;

  if (isCorrect) {
    const newConsecutive = consecutiveCorrect + 1;
    const threshold = getRequiredCorrectForLevel(level);

    // Check if we should level up
    if (level < MAX_LEVEL && newConsecutive >= threshold) {
      const newLevel = level + 1;
      const coinsEarned = getCoinsForLevelUp(newLevel);

      return {
        newProgress: {
          level: newLevel,
          consecutiveCorrect: 0, // Reset after level up
          totalCorrect: totalCorrect + 1,
          totalAttempts: totalAttempts + 1,
        },
        leveledUp: true,
        newLevel,
        coinsEarned,
      };
    }

    // Just increment consecutive, no level up
    return {
      newProgress: {
        level,
        consecutiveCorrect: newConsecutive,
        totalCorrect: totalCorrect + 1,
        totalAttempts: totalAttempts + 1,
      },
      leveledUp: false,
      newLevel: level,
      coinsEarned: 0,
    };
  }

  // Wrong answer - drop 1 level, reset consecutive
  const newLevel = Math.max(0, level - 1);

  return {
    newProgress: {
      level: newLevel,
      consecutiveCorrect: 0,
      totalCorrect,
      totalAttempts: totalAttempts + 1,
    },
    leveledUp: false,
    leveledDown: level > newLevel,
    newLevel,
    coinsEarned: 0,
  };
}

export function getProgressStats(kanaProgress) {
  const stats = {
    total: 0,
    unseen: 0,     // level 0
    learning: 0,   // level 1-2
    proficient: 0, // level 3-4
    mastered: 0,   // level 5
  };

  Object.values(kanaProgress).forEach(progress => {
    stats.total++;
    if (progress.level === 0) stats.unseen++;
    else if (progress.level <= 2) stats.learning++;
    else if (progress.level <= 4) stats.proficient++;
    else stats.mastered++;
  });

  return stats;
}

// Word/Vocab helpers
export function createDefaultWordProgress() {
  return {
    level: 0,
    consecutiveCorrect: 0,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}

export function getWordProgressStats(wordProgress) {
  const stats = {
    total: 0,
    unseen: 0,
    learning: 0,
    proficient: 0,
    mastered: 0,
  };

  Object.values(wordProgress).forEach(progress => {
    stats.total++;
    if (progress.level === 0) stats.unseen++;
    else if (progress.level <= 2) stats.learning++;
    else if (progress.level <= 4) stats.proficient++;
    else stats.mastered++;
  });

  return stats;
}

// Vocab pack pricing
export const VOCAB_PACK_PRICE = 15; // coins per pack of 5 words
