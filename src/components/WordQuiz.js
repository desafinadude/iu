import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getUnlockedWords } from '../data/vocabPacks';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import '../styles/KanaQuiz.css';

const TIMER_DURATION = 12;
const MAX_LIVES = 3;

function WordQuiz({ settings, unlockedPacks, onWordAnswerRecorded, getWordWeight, onCoinsAwarded }) {
  const [reverseMode, setReverseMode] = useState(true); // default: reverse (show English, pick Japanese)
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wordWeights, setWordWeights] = useState(new Map());
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);

  // Get unlocked words
  const availableWords = useMemo(() => {
    return getUnlockedWords(unlockedPacks);
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
    if (availableWords.length < 4) {
      return;
    }

    let correctWord;

    if (availableWords.length >= 10) {
      // Use weighted selection
      const weightedWords = availableWords.map(word => {
        const masteryWeight = getWordWeight ? getWordWeight(word.word) : 1.0;
        const sessionWeight = wordWeights.get(word.word) || 1.0;
        return {
          ...word,
          weight: masteryWeight * sessionWeight
        };
      });

      const totalWeight = weightedWords.reduce((sum, word) => sum + word.weight, 0);
      let random = Math.random() * totalWeight;

      correctWord = weightedWords.find(word => {
        random -= word.weight;
        return random <= 0;
      });

      if (!correctWord) {
        correctWord = weightedWords[weightedWords.length - 1];
      }
    } else {
      correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    }

    // Update session weights
    if (availableWords.length >= 10) {
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

    // Generate wrong answers
    const wrongAnswers = shuffle(
      availableWords.filter(w => w.word !== correctWord.word)
    ).slice(0, 3);

    const allOptions = shuffle([correctWord, ...wrongAnswers]);

    setCurrentQuestion(correctWord);
    setOptions(allOptions);
    setShowResult(false);
    setSelectedAnswer(null);
    startTimer();

    // Speak the word (only in normal mode, not reverse)
    if (!reverseMode) {
      speak(correctWord.word);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableWords, startTimer, reverseMode]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (hasStarted && !gameOver && availableWords.length >= 4) {
      generateQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, hasStarted, availableWords.length]);

  const handleStart = () => {
    setHasStarted(true);
  };

  // Handle timer running out
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentQuestion && !gameOver) {
      setSelectedAnswer(null);
      setShowResult(true);
      playWrongSound();

      if (onWordAnswerRecorded) {
        onWordAnswerRecorded(currentQuestion.word, false);
      }

      const newLives = lives - 1;
      setLives(newLives);
      speak(currentQuestion.word);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  }, [timeLeft, showResult, currentQuestion, lives, gameOver, onWordAnswerRecorded]);

  const handleAnswer = (option) => {
    if (showResult || !currentQuestion || gameOver) return;

    stopTimer();
    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option.word === currentQuestion.word;

    if (onWordAnswerRecorded) {
      onWordAnswerRecorded(currentQuestion.word, isCorrect);
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
      playCorrectSound();
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      playWrongSound();
      if (newLives <= 0) {
        setGameOver(true);
      }
    }

    speak(currentQuestion.word);
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
    setWordWeights(new Map());
    setHasStarted(false);
  };

  const handleSpeakerClick = () => {
    if (currentQuestion) {
      speak(currentQuestion.word);
    }
  };

  const isCorrect = selectedAnswer?.word === currentQuestion?.word;

  // Not enough words
  if (availableWords.length < 4) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Word Quiz</h2>
          <p>You need at least 4 words to play!</p>
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
          <h2>Word Quiz</h2>
          <p>{reverseMode ? 'See the English, select the Japanese' : 'See the word, select the English meaning'}</p>
          <p style={{ fontSize: '14px', marginTop: '10px', color: 'var(--color-text-muted)' }}>
            {availableWords.length} words available
          </p>
          <label className="reverse-toggle">
            <input
              type="checkbox"
              checked={reverseMode}
              onChange={(e) => setReverseMode(e.target.checked)}
            />
            <span className="reverse-toggle-label">Reverse Mode</span>
          </label>
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
      {gameOver && (
        <ResultsModal
          score={score}
          questionsAnswered={questionNumber + 1}
          onPlayAgain={handlePlayAgain}
          quizType={reverseMode ? 'Reverse Word' : 'Word'}
          onCoinsAwarded={onCoinsAwarded}
        />
      )}

      <div className="quiz-question">
        <div className="timer-lives-row">
          <div className="question-number">{questionNumber + 1}</div>
          {reverseMode && <div className="mode-badge">REVERSE</div>}
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

        {reverseMode ? (
          /* Reverse mode: show English translation */
          <div className="word-box-container">
            <div className="word-quiz-box reverse-word-box">
              <div className="word-quiz-text" style={{ fontSize: currentQuestion.translation.length > 15 ? '20px' : '28px' }}>
                {currentQuestion.translation}
              </div>
            </div>
          </div>
        ) : (
          /* Normal mode: show Japanese word */
          <div className="word-box-container">
            <button
              className={`word-quiz-box font-${settings.fontStyle}`}
              onClick={handleSpeakerClick}
              title="Click to hear pronunciation"
            >
              <div className="word-quiz-text" style={{ fontSize: currentQuestion.word.length > 4 ? '32px' : '48px' }}>
                {currentQuestion.word}
              </div>
            </button>
            {currentQuestion.furigana && currentQuestion.furigana !== currentQuestion.word && (
              <div className="furigana-hint" style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                {currentQuestion.furigana}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              showResult && currentQuestion
                ? option.word === currentQuestion.word
                  ? 'correct'
                  : option === selectedAnswer
                  ? 'wrong'
                  : ''
                : ''
            }${reverseMode ? ` font-${settings.fontStyle}` : ''}`}
            onClick={() => handleAnswer(option)}
            disabled={showResult || gameOver}
            style={{ fontSize: '14px', padding: '15px 10px' }}
          >
            {reverseMode ? option.word : option.translation}
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

export default WordQuiz;
