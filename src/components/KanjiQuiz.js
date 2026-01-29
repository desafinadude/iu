import React, { useState, useEffect, useCallback, useRef } from 'react';
import { kanjiData } from '../data/kanjiData';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import '../styles/KanaQuiz.css';

const TIMER_DURATION = 10;
const MAX_LIVES = 3;

function KanjiQuiz({ settings }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [characterWeights, setCharacterWeights] = useState(new Map());
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);
  const characterWeightsRef = useRef(characterWeights);
  characterWeightsRef.current = characterWeights;
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [selectedGrades, setSelectedGrades] = useState(['all']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Get unique categories and grades from kanji data
  const allCategories = ['all', ...Array.from(new Set(kanjiData.map(item => item.category))).sort()];
  const allGrades = ['all', ...Array.from(new Set(kanjiData.map(item => item.grade))).sort()];

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

  const getFilteredKanji = useCallback(() => {
    let filtered = kanjiData;

    // Filter by categories
    if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
      filtered = filtered.filter(kanji =>
        selectedCategories.includes(kanji.category)
      );
    }

    // Filter by grades
    if (!selectedGrades.includes('all') && selectedGrades.length > 0) {
      filtered = filtered.filter(kanji =>
        selectedGrades.includes(kanji.grade)
      );
    }

    return filtered.length > 0 ? filtered : kanjiData;
  }, [selectedCategories, selectedGrades]);

  const generateQuestion = useCallback(() => {
    const availableKanji = getFilteredKanji();
    if (availableKanji.length === 0) {
      alert('Please select at least one category or grade!');
      return;
    }

    let correctAnswer;

    if (availableKanji.length >= 10) {
      // Use weighted selection for larger pools
      const weights = characterWeightsRef.current;
      const weightedKanji = availableKanji.map(kanji => ({
        ...kanji,
        weight: weights.get(kanji.kanji) || 1.0
      }));

      const totalWeight = weightedKanji.reduce((sum, kanji) => sum + kanji.weight, 0);
      let random = Math.random() * totalWeight;

      for (const kanji of weightedKanji) {
        random -= kanji.weight;
        if (random <= 0) {
          correctAnswer = kanji;
          break;
        }
      }
    } else {
      // Random selection for smaller pools
      correctAnswer = availableKanji[Math.floor(Math.random() * availableKanji.length)];
    }

    if (!correctAnswer) {
      correctAnswer = availableKanji[0];
    }

    // Generate wrong answers from the same filtered pool
    const wrongAnswers = shuffle(
      availableKanji.filter(k => k.kanji !== correctAnswer.kanji)
    ).slice(0, 3);

    // If we don't have enough wrong answers from filtered pool, add from all kanji
    while (wrongAnswers.length < 3) {
      const randomKanji = kanjiData[Math.floor(Math.random() * kanjiData.length)];
      if (randomKanji.kanji !== correctAnswer.kanji &&
          !wrongAnswers.some(w => w.kanji === randomKanji.kanji)) {
        wrongAnswers.push(randomKanji);
      }
    }

    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    setCurrentQuestion(correctAnswer);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
    startTimer();

    // Speak the kanji reading automatically
    speak(correctAnswer.reading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFilteredKanji, startTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Handle timer running out
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentQuestion && !gameOver) {
      setSelectedAnswer(null);
      setShowResult(true);
      playWrongSound();
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  }, [timeLeft, showResult, currentQuestion, lives, gameOver]);

  const handleAnswer = (selectedKanji) => {
    if (selectedAnswer || gameOver) return;

    stopTimer();
    setSelectedAnswer(selectedKanji);

    const isCorrect = selectedKanji.kanji === currentQuestion.kanji;

    // Update character weights
    setCharacterWeights(prev => {
      const newWeights = new Map(prev);
      const currentWeight = newWeights.get(currentQuestion.kanji) || 1.0;

      if (isCorrect) {
        // Reduce weight for correct answers (less likely to appear again soon)
        newWeights.set(currentQuestion.kanji, Math.max(0.1, currentWeight * 0.7));
      } else {
        // Increase weight for incorrect answers (more likely to appear again)
        newWeights.set(currentQuestion.kanji, Math.min(3.0, currentWeight * 1.5));
      }

      return newWeights;
    });

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

    setShowResult(true);
  };

  const handleNext = () => {
    if (gameOver) return;
    setQuestionNumber(questionNumber + 1);
    generateQuestion();
  };

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const newSelection = prev.filter(cat => cat !== 'all');
        if (newSelection.includes(category)) {
          return newSelection.filter(cat => cat !== category);
        } else {
          return [...newSelection, category];
        }
      });
    }
  };

  const handleGradeChange = (grade) => {
    if (grade === 'all') {
      setSelectedGrades(['all']);
    } else {
      setSelectedGrades(prev => {
        const newSelection = prev.filter(g => g !== 'all');
        if (newSelection.includes(grade)) {
          return newSelection.filter(g => g !== grade);
        } else {
          return [...newSelection, grade];
        }
      });
    }
  };

  const handlePlayAgain = () => {
    setQuestionNumber(0);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setShowResult(false);
    setSelectedAnswer(null);
    setCharacterWeights(new Map());
    setHasStarted(false);
  };

  const handleKanjiClick = () => {
    if (currentQuestion) {
      speak(currentQuestion.reading);
    }
  };

  useEffect(() => {
    if (hasStarted && !gameOver) {
      generateQuestion();
    }
  }, [selectedCategories, selectedGrades, generateQuestion, gameOver, hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
  };

  const isCorrect = selectedAnswer && selectedAnswer.kanji === currentQuestion?.kanji;

  if (!hasStarted) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Kanji Quiz</h2>
          <p>See the kanji, select the meaning</p>
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
          quizType="Kanji"
        />
      )}

      {showCategoryModal && (
        <div className="category-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>Filter Kanji</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="category-list">
              <div className="filter-section">
                <h4>Categories:</h4>
                <div
                  className={`category-list-item ${selectedCategories.includes('all') ? 'selected' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All Categories
                </div>
                {allCategories.filter(cat => cat !== 'all').map(category => (
                  <div
                    key={category}
                    className={`category-list-item ${selectedCategories.includes(category) ? 'selected' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                ))}
              </div>
              <div className="filter-section">
                <h4>Grade Level:</h4>
                <div
                  className={`category-list-item ${selectedGrades.includes('all') ? 'selected' : ''}`}
                  onClick={() => handleGradeChange('all')}
                >
                  All Grades
                </div>
                {allGrades.filter(grade => grade !== 'all').map(grade => (
                  <div
                    key={grade}
                    className={`category-list-item ${selectedGrades.includes(grade) ? 'selected' : ''}`}
                    onClick={() => handleGradeChange(grade)}
                  >
                    Grade {grade}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
          className={`speaker-button font-${settings?.fontStyle || 'noto'}`}
          onClick={handleKanjiClick}
          title="Click to hear pronunciation"
        >
          <div className="kanji-with-reading">
            <div className="kanji-char">{currentQuestion.kanji}</div>
            <div className="reading-hint">{currentQuestion.reading}</div>
          </div>
        </button>
      </div>

      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              showResult && currentQuestion
                ? option.kanji === currentQuestion.kanji
                  ? 'correct'
                  : option === selectedAnswer
                  ? 'wrong'
                  : ''
                : ''
            }`}
            onClick={() => handleAnswer(option)}
            disabled={showResult || gameOver}
          >
            {option.meaning}
          </button>
        ))}
      </div>

      <div className="button-area">
        {showResult && !gameOver && (
          <button className={`next-button ${isCorrect ? 'correct' : 'wrong'}`} onClick={handleNext}>
            Next Question
          </button>
        )}

        {!showResult && !gameOver && (
          <button
            className="category-icon-button"
            onClick={() => setShowCategoryModal(true)}
            title="Filter kanji by category and grade"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  );
}

export default KanjiQuiz;
