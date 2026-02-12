import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import { shuffle, createKanaDeck } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import StreakFlash, { useStreakFlash } from './StreakFlash';
import { STAR_THRESHOLD, MATCHING_STAR_THRESHOLD } from '../utils/progressHelpers';
import '../styles/KanaQuiz.css';

const TIMER_DURATION = 10;
const MAX_LIVES = 3;

const isKatakanaChar = (char) => /^[\u30A0-\u30FF]+$/.test(char);

const MODES = [
  { id: 'kana', label: 'Kana', desc: 'Listen & select the kana' },
  { id: 'reverse', label: 'Reverse', desc: 'See kana, select the sound' },
  { id: 'match', label: 'Match', desc: 'Match hiragana & katakana' },
  { id: 'mixed', label: 'Mixed', desc: 'All modes shuffled together' },
];

function KanaQuiz({ settings, onAnswerRecorded, getKanaWeight }) {
  const [quizMode, setQuizMode] = useState(null); // null = mode selection screen
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
  // For mixed mode: track which sub-mode the current question is
  const [currentSubMode, setCurrentSubMode] = useState(null);
  // For match mode: track question type (hiragana or katakana)
  const [matchQuestionType, setMatchQuestionType] = useState('hiragana');
  const timerRef = useRef(null);
  const { flash, showProgress, showReset } = useStreakFlash();

  // Create mapping between hiragana and katakana for match mode
  const kanaMapping = useMemo(() => {
    const mapping = {};
    hiraganaData.forEach((hira, index) => {
      const kata = katakanaData[index];
      if (hira && kata && hira.romaji === kata.romaji) {
        mapping[hira.char] = kata.char;
        mapping[kata.char] = hira.char;
      }
    });
    return mapping;
  }, []);

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

  // Pick which sub-mode to use for mixed mode
  const pickMixedSubMode = useCallback(() => {
    const subModes = ['kana', 'reverse', 'match'];
    return subModes[Math.floor(Math.random() * subModes.length)];
  }, []);

  // Generate a match-mode question
  const generateMatchQuestion = useCallback(() => {
    const enabledHiragana = Array.from(settings.enabledHiragana);
    const enabledKatakana = Array.from(settings.enabledKatakana);

    const validHiragana = enabledHiragana.filter(char => kanaMapping[char]);
    const validKatakana = enabledKatakana.filter(char => kanaMapping[char]);

    if (validHiragana.length < 4 || validKatakana.length < 4) {
      return null; // Not enough chars for match mode
    }

    const types = ['hiragana', 'katakana'];
    const qType = types[Math.floor(Math.random() * types.length)];
    setMatchQuestionType(qType);

    let questionChar, availableChars, correctAnswer;

    if (qType === 'hiragana') {
      availableChars = validHiragana;
      questionChar = availableChars[Math.floor(Math.random() * availableChars.length)];
      correctAnswer = kanaMapping[questionChar];
      availableChars = validKatakana;
    } else {
      availableChars = validKatakana;
      questionChar = availableChars[Math.floor(Math.random() * availableChars.length)];
      correctAnswer = kanaMapping[questionChar];
      availableChars = validHiragana;
    }

    const wrongAnswers = shuffle(
      availableChars.filter(char => char !== correctAnswer)
    ).slice(0, 9);

    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    return {
      question: { char: questionChar, correct: correctAnswer, type: qType, isMatch: true },
      options: allOptions,
    };
  }, [settings.enabledHiragana, settings.enabledKatakana, kanaMapping]);

  const generateQuestion = useCallback(() => {
    const activeMode = quizMode === 'mixed' ? pickMixedSubMode() : quizMode;
    setCurrentSubMode(activeMode);

    if (activeMode === 'match') {
      const matchData = generateMatchQuestion();
      if (!matchData) {
        alert('Please enable at least 4 characters for both hiragana and katakana in settings!');
        return;
      }
      setCurrentQuestion(matchData.question);
      setOptions(matchData.options);
      setShowResult(false);
      setSelectedAnswer(null);
      startTimer();
      return;
    }

    // kana or reverse mode
    const availableChars = getEnabledChars();
    if (availableChars.length === 0) {
      alert('Please enable at least one character in settings!');
      return;
    }

    if (questionDeck.length === 0 || deckIndex >= questionDeck.length) {
      const newDeck = createKanaDeck(availableChars, currentQuestion);
      setQuestionDeck(newDeck);
      setDeckIndex(1);
      const correctAnswer = newDeck[0];

      const wrongAnswers = shuffle(
        availableChars.filter(h => h.char !== correctAnswer.char && h.romaji !== correctAnswer.romaji)
      ).slice(0, 9);
      const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

      setCurrentQuestion({ ...correctAnswer, isMatch: false });
      setOptions(allOptions);
      setShowResult(false);
      setSelectedAnswer(null);
      startTimer();
      if (activeMode === 'kana') {
        speak(correctAnswer.char);
      }
      return;
    }

    const correctAnswer = questionDeck[deckIndex];
    setDeckIndex(deckIndex + 1);

    const wrongAnswers = shuffle(
      availableChars.filter(h => h.char !== correctAnswer.char && h.romaji !== correctAnswer.romaji)
    ).slice(0, 9);
    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    setCurrentQuestion({ ...correctAnswer, isMatch: false });
    setOptions(allOptions);
    setShowResult(false);
    setSelectedAnswer(null);
    startTimer();

    if (activeMode === 'kana') {
      speak(correctAnswer.char);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnabledChars, startTimer, questionDeck, deckIndex, quizMode, pickMixedSubMode, generateMatchQuestion]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (hasStarted && !gameOver) {
      generateQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, hasStarted]);

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
        const quizType = currentSubMode === 'match' ? 'matching' : currentSubMode === 'reverse' ? 'reverse' : 'kana';
        const threshold = quizType === 'matching' ? MATCHING_STAR_THRESHOLD : STAR_THRESHOLD;
        const result = onAnswerRecorded(currentQuestion.char, false, quizType);

        if (result.streakLost) {
          showReset(threshold);
          setRoundEvents(prev => [...prev, {
            kana: currentQuestion.char,
            type: 'reset',
            lostStreak: result.lostStreak
          }]);
        }
      }

      const newLives = lives - 1;
      setLives(newLives);
      if (currentQuestion.char) speak(currentQuestion.char);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  }, [timeLeft, showResult, currentQuestion, lives, gameOver, onAnswerRecorded, showReset, currentSubMode]);

  const handleAnswer = (option) => {
    if (showResult || !currentQuestion || gameOver) return;

    stopTimer();
    setSelectedAnswer(option);
    setShowResult(true);

    const isMatch = currentQuestion.isMatch;
    let isCorrect;

    if (isMatch) {
      isCorrect = option === currentQuestion.correct;
    } else {
      isCorrect = option.char === currentQuestion.char;
    }

    // Record answer for mastery tracking
    if (onAnswerRecorded) {
      const quizType = currentSubMode === 'match' ? 'matching' : currentSubMode === 'reverse' ? 'reverse' : 'kana';
      const threshold = quizType === 'matching' ? MATCHING_STAR_THRESHOLD : STAR_THRESHOLD;
      const result = onAnswerRecorded(currentQuestion.char, isCorrect, quizType);

      if (result.starEarned) {
        setRoundEvents(prev => [...prev, {
          kana: currentQuestion.char,
          type: 'star'
        }]);
      } else if (isCorrect && result.newConsecutive > 0) {
        showProgress(result.newConsecutive, threshold);
      } else if (result.streakLost) {
        showReset(threshold);
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

    if (currentQuestion.char) speak(currentQuestion.char);
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

  const handleBackToModes = () => {
    stopTimer();
    setQuizMode(null);
    setHasStarted(false);
    setGameOver(false);
    setQuestionNumber(0);
    setScore(0);
    setLives(MAX_LIVES);
    setQuestionDeck([]);
    setDeckIndex(0);
    setRoundEvents([]);
    setCurrentQuestion(null);
  };

  const isCorrect = currentQuestion?.isMatch
    ? selectedAnswer === currentQuestion?.correct
    : selectedAnswer?.char === currentQuestion?.char;

  const handleSpeakerClick = () => {
    if (currentQuestion) {
      speak(currentQuestion.char);
    }
  };

  // Mode selection screen
  if (!quizMode) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Kana Quiz</h2>
          <p>Choose your mode</p>
          <div className="mode-selector">
            {MODES.map(mode => (
              <button
                key={mode.id}
                className="mode-button"
                onClick={() => setQuizMode(mode.id)}
              >
                <span className="mode-label">{mode.label}</span>
                <span className="mode-desc">{mode.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Start screen (after mode selected)
  if (!hasStarted) {
    const modeInfo = MODES.find(m => m.id === quizMode);
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>{modeInfo.label} Mode</h2>
          <p>{modeInfo.desc}</p>
          {quizMode === 'mixed' && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '-10px' }}>
              All modes track mastery: kana, reverse, handwriting & matching
            </p>
          )}
          <button className="start-button" onClick={handleStart}>
            START
          </button>
          <button className="back-to-modes-button" onClick={handleBackToModes}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="quiz-loading">Loading...</div>;
  }

  // Determine what to show based on current sub-mode
  const isMatchQuestion = currentQuestion.isMatch;
  const isReverseQuestion = currentSubMode === 'reverse' && !isMatchQuestion;
  const isKanaQuestion = currentSubMode === 'kana' && !isMatchQuestion;

  const getModeLabel = () => {
    if (quizMode !== 'mixed') return null;
    if (isMatchQuestion) return 'MATCH';
    if (isReverseQuestion) return 'REVERSE';
    return 'KANA';
  };

  const modeLabel = getModeLabel();

  return (
    <div className="kana-quiz">
      <StreakFlash flash={flash} />

      {gameOver && (
        <ResultsModal
          score={score}
          questionsAnswered={questionNumber + 1}
          onPlayAgain={handlePlayAgain}
          quizType={quizMode === 'mixed' ? 'Mixed Kana' : MODES.find(m => m.id === quizMode)?.label + ' Kana'}
          roundEvents={roundEvents}
        />
      )}

      <div className="quiz-question">
        <div className="timer-lives-row">
          <div className="question-number">{questionNumber + 1}</div>
          {modeLabel && <div className="mode-badge">{modeLabel}</div>}
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

        {/* Kana mode: show romaji in speech bubble */}
        {isKanaQuestion && (
          <button
            className={`speaker-button font-${settings.fontStyle}`}
            onClick={handleSpeakerClick}
            title="Click to hear pronunciation"
          >
            {currentQuestion.romaji}
          </button>
        )}

        {/* Reverse mode: show character */}
        {isReverseQuestion && (
          <div className={`character-display font-${settings.fontStyle}`}>
            {currentQuestion.char}
          </div>
        )}

        {/* Match mode: show character + prompt */}
        {isMatchQuestion && (
          <>
            <button
              className={`speaker-button font-${settings.fontStyle}`}
              onClick={handleSpeakerClick}
              title="Click to hear pronunciation"
            >
              {currentQuestion.char}
            </button>
            <div className="question-prompt">
              {matchQuestionType === 'hiragana' ? 'in Katakana' : 'in Hiragana'}
            </div>
          </>
        )}
      </div>

      <div className="options-grid">
        {isMatchQuestion ? (
          options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${isKatakanaChar(option) ? 'katakana-char' : 'hiragana-char'} ${
                showResult && currentQuestion
                  ? option === currentQuestion.correct
                    ? 'correct'
                    : option === selectedAnswer
                    ? 'wrong'
                    : ''
                  : ''
              } font-${settings.fontStyle}`}
              onClick={() => handleAnswer(option)}
              disabled={showResult || gameOver}
            >
              {option}
            </button>
          ))
        ) : isReverseQuestion ? (
          options.map((option, index) => (
            <button
              key={index}
              className={`option-button romaji ${
                showResult && currentQuestion
                  ? option.char === currentQuestion.char
                    ? 'correct'
                    : option === selectedAnswer
                    ? 'wrong'
                    : ''
                  : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={showResult || gameOver}
            >
              {option.romaji}
            </button>
          ))
        ) : (
          options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${isKatakanaChar(option.char) ? 'katakana-char' : ''} ${
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
          ))
        )}
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
