import React, { useState, useEffect, useCallback, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import { shuffle, createKanaDeck } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import StreakFlash, { useStreakFlash } from './StreakFlash';
import { STAR_THRESHOLD } from '../utils/progressHelpers';
import '../styles/KanaQuiz.css';

const TIMER_DURATION = 10;
const MAX_LIVES = 3;

function KanaQuiz({ settings, onAnswerRecorded, getKanaWeight }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionDeck, setQuestionDeck] = useState([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [roundEvents, setRoundEvents] = useState([]);
  const timerRef = useRef(null);
  const { flash, showProgress, showReset } = useStreakFlash();

  const getEnabledChars = useCallback(() => {
    const allChars = [...hiraganaData, ...katakanaData];
    return allChars.filter(char => {
      if (hiraganaData.includes(char)) {
        if (!settings.includeDakutenHiragana && !char.basic) return false;
        return settings.enabledHiragana.has(char.char);
      } else {
        if (!settings.includeDakutenKatakana && !char.basic) return false;
        return settings.enabledKatakana.has(char.char);
      }
    });
  }, [settings]);

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
    const availableChars = getEnabledChars();
    if (availableChars.length === 0) {
      alert('Please enable at least one character in settings!');
      return;
    }

    // Check if we need to regenerate the deck
    if (questionDeck.length === 0 || deckIndex >= questionDeck.length) {
      const newDeck = createKanaDeck(availableChars);
      setQuestionDeck(newDeck);
      setDeckIndex(0);
      // Use the first card from the new deck
      const correctAnswer = newDeck[0];

      // Filter out characters with the same romaji to avoid showing both hiragana and katakana for the same sound
      const wrongAnswers = shuffle(
        availableChars.filter(h => h.char !== correctAnswer.char && h.romaji !== correctAnswer.romaji)
      ).slice(0, 9);
      const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

      setCurrentQuestion(correctAnswer);
      setOptions(allOptions);
      setShowResult(false);
      setSelectedAnswer(null);
      startTimer();
      speak(correctAnswer.char);
      return;
    }

    // Draw from the existing deck
    const correctAnswer = questionDeck[deckIndex];
    setDeckIndex(deckIndex + 1);

    // Filter out characters with the same romaji to avoid showing both hiragana and katakana for the same sound
    const wrongAnswers = shuffle(
      availableChars.filter(h => h.char !== correctAnswer.char && h.romaji !== correctAnswer.romaji)
    ).slice(0, 9);
    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    setCurrentQuestion(correctAnswer);
    setOptions(allOptions);
    setShowResult(false);
    setSelectedAnswer(null);
    startTimer();

    // Speak the character automatically
    speak(correctAnswer.char);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnabledChars, startTimer, questionDeck, deckIndex]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (hasStarted && !gameOver) {
      generateQuestion();
    }
  }, [generateQuestion, gameOver, hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
  };

  // Handle timer running out
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentQuestion && !gameOver) {
      setSelectedAnswer(null);
      setShowResult(true);
      playWrongSound();

      // Record as wrong answer for mastery tracking
      if (onAnswerRecorded) {
        const result = onAnswerRecorded(currentQuestion.char, false, 'kana');

        // Show flash and track event
        if (result.streakLost) {
          showReset(STAR_THRESHOLD);
          setRoundEvents(prev => [...prev, {
            kana: currentQuestion.char,
            type: 'reset',
            lostStreak: result.lostStreak
          }]);
        }
      }

      const newLives = lives - 1;
      setLives(newLives);
      speak(currentQuestion.char);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  }, [timeLeft, showResult, currentQuestion, lives, gameOver, onAnswerRecorded, showReset]);

  const handleAnswer = (option) => {
    if (showResult || !currentQuestion || gameOver) return;

    stopTimer();
    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option.char === currentQuestion.char;

    // Record answer for mastery tracking
    if (onAnswerRecorded) {
      const result = onAnswerRecorded(currentQuestion.char, isCorrect, 'kana');

      // Show flash and track events
      if (result.starEarned) {
        setRoundEvents(prev => [...prev, {
          kana: currentQuestion.char,
          type: 'star'
        }]);
      } else if (isCorrect && result.newConsecutive > 0) {
        showProgress(result.newConsecutive, STAR_THRESHOLD);
      } else if (result.streakLost) {
        showReset(STAR_THRESHOLD);
        setRoundEvents(prev => [...prev, {
          kana: currentQuestion.char,
          type: 'reset',
          lostStreak: result.lostStreak
        }]);
      }
    }

    if (isCorrect) {
      setScore(score + 1);
      playCorrectSound();
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      playWrongSound();
      if (newLives <= 0) {
        setGameOver(true);
      }
    }

    // Speak the correct pronunciation
    speak(currentQuestion.char);
  };

  const handleNext = () => {
    if (gameOver) return;
    setQuestionNumber(questionNumber + 1);
    generateQuestion();
  };

  const handlePlayAgain = () => {
    setQuestionNumber(0);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setQuestionDeck([]);
    setDeckIndex(0);
    setHasStarted(false);
    setRoundEvents([]);
  };

  const isCorrect = selectedAnswer?.char === currentQuestion?.char;

  const handleSpeakerClick = () => {
    if (currentQuestion) {
      speak(currentQuestion.char);
    }
  };

  if (!hasStarted) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Kana Quiz</h2>
          <p>Listen and select the correct kana</p>
          <button className="start-button" onClick={handleStart}>
            START
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="quiz-loading">Loading...</div>;
  }

  return (
    <div className="kana-quiz">
      <StreakFlash flash={flash} />

      {gameOver && (
        <ResultsModal
          score={score}
          questionsAnswered={questionNumber + 1}
          onPlayAgain={handlePlayAgain}
          quizType="Kana"
          roundEvents={roundEvents}
        />
      )}

      <div className="quiz-question">
        <div className="timer-lives-row">
          <div className="question-number">{questionNumber + 1}</div>
          <div className="lives-display">
            {'❤️'.repeat(lives)}{'🖤'.repeat(MAX_LIVES - lives)}
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
        <button
          className={`speaker-button font-${settings.fontStyle}`}
          onClick={handleSpeakerClick}
          title="Click to hear pronunciation"
        >
          {currentQuestion.romaji}
        </button>
      </div>

      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              showResult && currentQuestion
                ? option.char === currentQuestion.char
                  ? 'correct'
                  : option === selectedAnswer
                  ? 'wrong'
                  : ''
                : ''
            } font-${settings.fontStyle}`}
            onClick={() => handleAnswer(option)}
            disabled={showResult || gameOver}
          >
            {option.char}
          </button>
        ))}
      </div>

      <div className="button-area">
        {showResult && !gameOver && (
          <button className={`next-button ${isCorrect ? 'correct' : 'wrong'}`} onClick={handleNext}>
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}

export default KanaQuiz;
