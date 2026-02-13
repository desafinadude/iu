import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getUnlockedWords } from '../data/vocabPacks';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import '../styles/LetterTile.css';

const TIMER_DURATION = 20;
const MAX_LIVES = 3;
const NUM_DISTRACTORS = 3;

// Check if a character is katakana
const isKatakana = (char) => /[\u30A1-\u30FC]/.test(char);

// Get distractor characters from the same script
function getDistractors(wordChars, count) {
  const useKatakana = wordChars.some(c => isKatakana(c));
  const pool = useKatakana ? katakanaData : hiraganaData;
  const wordSet = new Set(wordChars);

  const candidates = pool
    .map(k => k.char)
    .filter(c => !wordSet.has(c));

  return shuffle(candidates).slice(0, count);
}

function LetterTile({ settings, unlockedPacks, onWordAnswerRecorded, getWordWeight, onCoinsAwarded }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [slots, setSlots] = useState([]);        // placed chars: { char, tileId } or null
  const [pool, setPool] = useState([]);           // available tiles: { char, id, used }
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wordWeights, setWordWeights] = useState(new Map());
  const [hintUsed, setHintUsed] = useState(false);
  const timerRef = useRef(null);

  // Get unlocked words, filter to those with 2+ kana chars
  const availableWords = useMemo(() => {
    const words = getUnlockedWords(unlockedPacks);
    return words.filter(w => {
      const chars = [...w.word];
      return chars.length >= 2 && chars.length <= 8;
    });
  }, [unlockedPacks]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const generateQuestion = useCallback(() => {
    if (availableWords.length < 2) return;

    let correctWord;

    if (availableWords.length >= 6) {
      const weightedWords = availableWords.map(word => {
        const masteryWeight = getWordWeight ? getWordWeight(word.word) : 1.0;
        const sessionWeight = wordWeights.get(word.word) || 1.0;
        return { ...word, weight: masteryWeight * sessionWeight };
      });

      const totalWeight = weightedWords.reduce((sum, w) => sum + w.weight, 0);
      let random = Math.random() * totalWeight;

      correctWord = weightedWords.find(w => {
        random -= w.weight;
        return random <= 0;
      });

      if (!correctWord) correctWord = weightedWords[weightedWords.length - 1];
    } else {
      correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    }

    // Update session weights
    if (availableWords.length >= 6) {
      setWordWeights(prev => {
        const updated = new Map(prev);
        updated.set(correctWord.word, 0.3);
        availableWords.forEach(word => {
          if (word.word !== correctWord.word) {
            const current = updated.get(word.word) || 1.0;
            updated.set(word.word, Math.min(current + 0.1, 1.5));
          }
        });
        return updated;
      });
    }

    const wordChars = [...correctWord.word];
    const distractors = getDistractors(wordChars, Math.min(NUM_DISTRACTORS, 3));
    const allTiles = shuffle([...wordChars, ...distractors]).map((char, i) => ({
      char,
      id: i,
      used: false,
    }));

    setCurrentWord(correctWord);
    setSlots(new Array(wordChars.length).fill(null));
    setPool(allTiles);
    setShowResult(false);
    setIsCorrect(false);
    setHintUsed(false);
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableWords, startTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Start first question
  useEffect(() => {
    if (hasStarted && !gameOver && availableWords.length >= 2) {
      generateQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, hasStarted, availableWords.length]);

  // Check answer when all slots are filled
  useEffect(() => {
    if (!currentWord || showResult || gameOver) return;
    if (slots.some(s => s === null)) return;

    // All slots filled — check answer
    stopTimer();
    const attempt = slots.map(s => s.char).join('');
    const correct = attempt === currentWord.word;

    setShowResult(true);
    setIsCorrect(correct);

    if (onWordAnswerRecorded) {
      onWordAnswerRecorded(currentWord.word, correct);
    }

    if (correct) {
      setScore(prev => prev + 1);
      playCorrectSound();
      speak(currentWord.word);
    } else {
      playWrongSound();
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
      }
      // Speak correct word so they can hear it
      setTimeout(() => speak(currentWord.word), 500);
    }
  }, [slots, currentWord, showResult, gameOver, lives, stopTimer, onWordAnswerRecorded]);

  // Handle timer running out
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentWord && !gameOver) {
      setShowResult(true);
      setIsCorrect(false);
      playWrongSound();

      if (onWordAnswerRecorded) {
        onWordAnswerRecorded(currentWord.word, false);
      }

      const newLives = lives - 1;
      setLives(newLives);
      speak(currentWord.word);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  }, [timeLeft, showResult, currentWord, lives, gameOver, onWordAnswerRecorded]);

  const handleTileTap = (tile) => {
    if (showResult || gameOver || tile.used) return;

    // Find next empty slot
    const emptyIdx = slots.findIndex(s => s === null);
    if (emptyIdx === -1) return;

    const newSlots = [...slots];
    newSlots[emptyIdx] = { char: tile.char, tileId: tile.id };
    setSlots(newSlots);

    setPool(prev => prev.map(t =>
      t.id === tile.id ? { ...t, used: true } : t
    ));
  };

  const handleSlotTap = (slotIdx) => {
    if (showResult || gameOver) return;
    const slot = slots[slotIdx];
    if (!slot) return;

    // Return tile to pool
    setPool(prev => prev.map(t =>
      t.id === slot.tileId ? { ...t, used: false } : t
    ));

    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
  };

  const handleHint = () => {
    if (showResult || gameOver || !currentWord || hintUsed) return;

    // Find first empty slot and place the correct character
    const wordChars = [...currentWord.word];
    const emptyIdx = slots.findIndex(s => s === null);
    if (emptyIdx === -1) return;

    const correctChar = wordChars[emptyIdx];

    // Find matching unused tile in pool
    const matchingTile = pool.find(t => t.char === correctChar && !t.used);
    if (!matchingTile) return;

    const newSlots = [...slots];
    newSlots[emptyIdx] = { char: matchingTile.char, tileId: matchingTile.id };
    setSlots(newSlots);

    setPool(prev => prev.map(t =>
      t.id === matchingTile.id ? { ...t, used: true } : t
    ));

    setHintUsed(true);
  };

  const handleNext = () => {
    if (gameOver) return;
    setQuestionNumber(prev => prev + 1);
    generateQuestion();
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  const handlePlayAgain = () => {
    setQuestionNumber(0);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setWordWeights(new Map());
    setHasStarted(false);
  };

  const handleSpeakerClick = () => {
    if (currentWord) speak(currentWord.word);
  };

  // Not enough words
  if (availableWords.length < 2) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Letter Tiles</h2>
          <p>You need at least 2 words to play!</p>
          <p style={{ fontSize: '14px', marginTop: '10px', color: 'var(--color-text-muted)' }}>
            Visit the Shop to buy vocab packs with your coins.
          </p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Letter Tiles</h2>
          <p>See the meaning, spell the word by tapping the right tiles!</p>
          <p style={{ fontSize: '14px', marginTop: '10px', color: 'var(--color-text-muted)' }}>
            {availableWords.length} words available
          </p>
          <button className="start-button" onClick={handleStart}>
            START
          </button>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return <div className="quiz-loading">Loading...</div>;
  }

  const wordChars = [...currentWord.word];

  return (
    <div className="kana-quiz letter-tile-game">
      {gameOver && (
        <ResultsModal
          score={score}
          questionsAnswered={questionNumber + 1}
          onPlayAgain={handlePlayAgain}
          quizType="Letter Tile"
          onCoinsAwarded={onCoinsAwarded}
        />
      )}

      {/* Top section: clue + slots */}
      <div className="quiz-question letter-tile-question">
        <div className="timer-lives-row">
          <div className="question-number">{questionNumber + 1}</div>
          <div className="lives-display">
            {'\u2764\uFE0F'.repeat(lives)}{'\uD83D\uDDA4'.repeat(MAX_LIVES - lives)}
          </div>
          {!showResult && (
            <div className="quiz-timer-bar">
              <div
                className={`quiz-timer-fill ${timeLeft <= 3 ? 'urgent' : ''}`}
                style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Clue: English meaning */}
        <div className="lt-clue">
          <div className="lt-clue-text" style={{ fontSize: currentWord.translation.length > 20 ? '18px' : '24px' }}>
            {currentWord.translation}
          </div>
          {currentWord.romaji && (
            <div className="lt-romaji-hint">{currentWord.romaji}</div>
          )}
        </div>

        {/* Slots */}
        <div className="lt-slots">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              className={`lt-slot font-${settings.fontStyle} ${slot ? 'filled' : ''} ${
                showResult
                  ? isCorrect
                    ? 'correct'
                    : slot
                    ? slot.char === wordChars[idx]
                      ? 'char-correct'
                      : 'char-wrong'
                    : 'char-wrong'
                  : ''
              }`}
              onClick={() => handleSlotTap(idx)}
              disabled={showResult || gameOver}
            >
              {slot ? slot.char : ''}
            </button>
          ))}
        </div>

        {/* Show correct answer when wrong */}
        {showResult && !isCorrect && (
          <div className={`lt-correct-answer font-${settings.fontStyle}`}>
            <button className="lt-speaker-btn" onClick={handleSpeakerClick} title="Hear pronunciation">
              {currentWord.word}
            </button>
          </div>
        )}
      </div>

      {/* Middle section: tile pool */}
      <div className="lt-pool-area">
        {!showResult && (
          <button
            className={`lt-hint-btn ${hintUsed ? 'used' : ''}`}
            onClick={handleHint}
            disabled={hintUsed || showResult || gameOver}
            title="Reveal one letter"
          >
            {hintUsed ? 'Hint used' : 'Hint'}
          </button>
        )}
        <div className="lt-pool">
          {pool.map((tile) => (
            <button
              key={tile.id}
              className={`lt-tile font-${settings.fontStyle} ${tile.used ? 'used' : ''}`}
              onClick={() => handleTileTap(tile)}
              disabled={tile.used || showResult || gameOver}
            >
              {tile.char}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom section: next button */}
      <div className="button-area">
        {showResult && !gameOver && (
          <button className={`next-button ${isCorrect ? 'correct' : 'wrong'}`} onClick={handleNext}>
            Next Word
          </button>
        )}
      </div>
    </div>
  );
}

export default LetterTile;
