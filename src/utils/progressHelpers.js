// Star system: 10 consecutive correct answers per quiz type to earn a star
export const STAR_THRESHOLD = 10;
export const MATCHING_STAR_THRESHOLD = 5; // Matching only needs 5 (seen 10 times with matching kana)
export const COINS_PER_STAR = 5;
export const QUIZ_TYPES = ['kana', 'reverse', 'handwriting', 'matching'];

// Kanji quiz types
export const KANJI_QUIZ_TYPES = ['meaning', 'reverse', 'onyomi', 'kunyomi'];

// Selection weights by quiz-type mastery (higher = more likely to appear)
const WEIGHTS = {
  earned: 0.3,      // Already mastered for this quiz type - rare
  unseen: 3.0,      // Never attempted - high priority
  hasStreak: 1.5,   // Has a streak going - moderate
  default: 2.0,     // Attempted but no streak
};

function createDefaultQuizTypeProgress() {
  return {
    consecutiveCorrect: 0,
    earned: false,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}

export function createDefaultKanaProgress() {
  return {
    kana: createDefaultQuizTypeProgress(),
    reverse: createDefaultQuizTypeProgress(),
    handwriting: createDefaultQuizTypeProgress(),
    matching: createDefaultQuizTypeProgress(),
  };
}

export function createDefaultKanjiProgress() {
  return {
    meaning: createDefaultQuizTypeProgress(),
    reverse: createDefaultQuizTypeProgress(),
    onyomi: createDefaultQuizTypeProgress(),
    kunyomi: createDefaultQuizTypeProgress(),
  };
}

export function initializeProgress(hiraganaData, katakanaData) {
  const kanaProgress = {};

  [...hiraganaData, ...katakanaData].forEach(kana => {
    kanaProgress[kana.char] = createDefaultKanaProgress();
  });

  return {
    version: 2,
    coins: 0,
    kanaProgress,
  };
}

export function processAnswer(currentProgress, quizType, isCorrect) {
  const quizProgress = currentProgress[quizType] || createDefaultQuizTypeProgress();
  const threshold = quizType === 'matching' ? MATCHING_STAR_THRESHOLD : STAR_THRESHOLD;

  if (isCorrect) {
    const newTotalCorrect = quizProgress.totalCorrect + 1;
    // Award 1 coin for every 2 correct answers
    const coinsForCorrect = newTotalCorrect % 2 === 0 ? 1 : 0;

    if (quizProgress.earned) {
      // Already earned this star - just track stats and award coins for correct answers
      return {
        newProgress: {
          ...currentProgress,
          [quizType]: {
            ...quizProgress,
            totalCorrect: newTotalCorrect,
            totalAttempts: quizProgress.totalAttempts + 1,
          },
        },
        starEarned: false,
        newConsecutive: 0,
        quizType,
        coinsEarned: coinsForCorrect,
      };
    }

    const newConsecutive = quizProgress.consecutiveCorrect + 1;

    if (newConsecutive >= threshold) {
      // Star earned! Award bonus coins plus coins for correct answer
      return {
        newProgress: {
          ...currentProgress,
          [quizType]: {
            consecutiveCorrect: 0,
            earned: true,
            totalCorrect: newTotalCorrect,
            totalAttempts: quizProgress.totalAttempts + 1,
          },
        },
        starEarned: true,
        newConsecutive: threshold,
        quizType,
        coinsEarned: COINS_PER_STAR + coinsForCorrect,
      };
    }

    // Increment streak
    return {
      newProgress: {
        ...currentProgress,
        [quizType]: {
          ...quizProgress,
          consecutiveCorrect: newConsecutive,
          totalCorrect: newTotalCorrect,
          totalAttempts: quizProgress.totalAttempts + 1,
        },
      },
      starEarned: false,
      newConsecutive,
      quizType,
      coinsEarned: coinsForCorrect,
    };
  }

  // Wrong answer - reset streak
  const hadStreak = !quizProgress.earned && quizProgress.consecutiveCorrect > 0;
  return {
    newProgress: {
      ...currentProgress,
      [quizType]: {
        ...quizProgress,
        consecutiveCorrect: 0,
        totalCorrect: quizProgress.totalCorrect,
        totalAttempts: quizProgress.totalAttempts + 1,
      },
    },
    starEarned: false,
    streakLost: hadStreak,
    lostStreak: hadStreak ? quizProgress.consecutiveCorrect : 0,
    newConsecutive: 0,
    quizType,
    coinsEarned: 0,
  };
}

export function getStarCount(charProgress) {
  if (!charProgress || !charProgress.kana) return 0;
  return QUIZ_TYPES.filter(qt => charProgress[qt]?.earned).length;
}

export function getStarDetail(charProgress) {
  if (!charProgress || !charProgress.kana) {
    return { kana: false, reverse: false, handwriting: false, matching: false };
  }
  return {
    kana: charProgress.kana?.earned || false,
    reverse: charProgress.reverse?.earned || false,
    handwriting: charProgress.handwriting?.earned || false,
    matching: charProgress.matching?.earned || false,
  };
}

export function getWeightForQuizType(charProgress, quizType) {
  if (!charProgress || !charProgress[quizType]) return WEIGHTS.unseen;
  const qt = charProgress[quizType];
  if (qt.earned) return WEIGHTS.earned;
  if (qt.totalAttempts === 0) return WEIGHTS.unseen;
  if (qt.consecutiveCorrect > 0) return WEIGHTS.hasStreak;
  return WEIGHTS.default;
}

export function getProgressStats(kanaProgress) {
  const stats = {
    total: 0,
    noStars: 0,
    inProgress: 0,
    mastered: 0,
  };

  Object.values(kanaProgress).forEach(progress => {
    stats.total++;
    const stars = getStarCount(progress);
    if (stars === 0) {
      // Check if any attempts have been made
      const hasAttempts = QUIZ_TYPES.some(qt => progress[qt]?.totalAttempts > 0);
      if (hasAttempts) {
        stats.inProgress++;
      } else {
        stats.noStars++;
      }
    } else if (stars === QUIZ_TYPES.length) {
      stats.mastered++;
    } else {
      stats.inProgress++;
    }
  });

  return stats;
}

// Word/Vocab helpers (unchanged)
export function createDefaultWordProgress() {
  return {
    level: 0,
    consecutiveCorrect: 0,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}

// Word level thresholds (kept for word system)
const WORD_LEVEL_THRESHOLDS = {
  0: 2,
  1: 3,
  2: 4,
  3: 5,
  4: 6,
};

const WORD_LEVEL_WEIGHTS = {
  0: 3.0,
  1: 2.5,
  2: 2.0,
  3: 1.5,
  4: 1.0,
  5: 0.3,
};

export const MAX_WORD_LEVEL = 5;

export function getWeightForWordLevel(level) {
  return WORD_LEVEL_WEIGHTS[level] ?? 1.0;
}

export function processWordAnswer(currentProgress, isCorrect) {
  const { level, consecutiveCorrect, totalCorrect, totalAttempts } = currentProgress;

  if (isCorrect) {
    const newConsecutive = consecutiveCorrect + 1;
    const threshold = WORD_LEVEL_THRESHOLDS[level] ?? 0;

    if (level < MAX_WORD_LEVEL && newConsecutive >= threshold) {
      const newLevel = level + 1;
      return {
        newProgress: {
          level: newLevel,
          consecutiveCorrect: 0,
          totalCorrect: totalCorrect + 1,
          totalAttempts: totalAttempts + 1,
        },
        leveledUp: true,
        newLevel,
      };
    }

    return {
      newProgress: {
        level,
        consecutiveCorrect: newConsecutive,
        totalCorrect: totalCorrect + 1,
        totalAttempts: totalAttempts + 1,
      },
      leveledUp: false,
      newLevel: level,
    };
  }

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

export function getStarThreshold(quizType) {
  return quizType === 'matching' ? MATCHING_STAR_THRESHOLD : STAR_THRESHOLD;
}

// Vocab pack pricing
export const VOCAB_PACK_PRICE = 15; // coins per pack of 5 words

// ── Kanji progress helpers ────────────────────────────────────────────────────

export function getKanjiStarCount(kanjiProgress) {
  if (!kanjiProgress || !kanjiProgress.meaning) return 0;
  return KANJI_QUIZ_TYPES.filter(qt => kanjiProgress[qt]?.earned).length;
}

export function getKanjiStarDetail(kanjiProgress) {
  if (!kanjiProgress || !kanjiProgress.meaning) {
    return { meaning: false, reverse: false, onyomi: false, kunyomi: false };
  }
  return {
    meaning: kanjiProgress.meaning?.earned || false,
    reverse: kanjiProgress.reverse?.earned || false,
    onyomi: kanjiProgress.onyomi?.earned || false,
    kunyomi: kanjiProgress.kunyomi?.earned || false,
  };
}

export function getKanjiProgressStats(kanjiProgress) {
  const stats = { total: 0, noStars: 0, inProgress: 0, mastered: 0 };
  Object.values(kanjiProgress).forEach(progress => {
    stats.total++;
    const stars = getKanjiStarCount(progress);
    if (stars === 0) {
      const hasAttempts = KANJI_QUIZ_TYPES.some(qt => progress[qt]?.totalAttempts > 0);
      hasAttempts ? stats.inProgress++ : stats.noStars++;
    } else if (stars === KANJI_QUIZ_TYPES.length) {
      stats.mastered++;
    } else {
      stats.inProgress++;
    }
  });
  return stats;
}
