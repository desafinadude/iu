import React, { useState, useEffect, useCallback } from 'react';
import { kanjiData } from '../data/kanjiData';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import '../styles/KanaQuiz.css';

function KanjiQuiz({ settings }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [characterWeights, setCharacterWeights] = useState(new Map());
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [selectedGrades, setSelectedGrades] = useState(['all']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const totalQuestions = 20;

  // Get unique categories and grades from kanji data
  const allCategories = ['all', ...Array.from(new Set(kanjiData.map(item => item.category))).sort()];
  const allGrades = ['all', ...Array.from(new Set(kanjiData.map(item => item.grade))).sort()];

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
      const weightedKanji = availableKanji.map(kanji => ({
        ...kanji,
        weight: characterWeights.get(kanji.kanji) || 1.0
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
  }, [getFilteredKanji, characterWeights]);

  const handleAnswer = (selectedKanji) => {
    if (selectedAnswer) return;
    
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
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (questionNumber + 1 >= totalQuestions) {
      // Show final results
      const percentage = Math.round((score / totalQuestions) * 100);
      alert(`Quiz Complete! Score: ${score}/${totalQuestions} (${percentage}%)`);
      resetQuiz();
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
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

  const resetQuiz = () => {
    setQuestionNumber(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setCharacterWeights(new Map());
    generateQuestion();
  };

  const handleKanjiClick = () => {
    if (currentQuestion) {
      speak(currentQuestion.reading);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [selectedCategories, selectedGrades]);

  const isCorrect = selectedAnswer && selectedAnswer.kanji === currentQuestion?.kanji;

  if (!currentQuestion) {
    return <div className="quiz-loading">Loading...</div>;
  }

  return (
    <div className="kana-quiz">
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
        <div className="score-display">
          <div className="question-number">{questionNumber + 1}</div>
          <div className="score-fraction">{score}/{totalQuestions}</div>
        </div>
        <div className="character-with-hint">
          <button
            className={`character-display font-${settings?.fontStyle || 'noto'}`}
            onClick={handleKanjiClick}
            title="Click to hear pronunciation"
          >
            {currentQuestion.kanji}
          </button>
          <div className="reading-hint">{currentQuestion.reading}</div>
        </div>
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
            disabled={showResult}
          >
            {option.meaning}
          </button>
        ))}
      </div>

      <div className="button-area">
        {showResult && (
          <button className={`next-button ${isCorrect ? 'correct' : 'wrong'}`} onClick={handleNext}>
            {questionNumber + 1 >= totalQuestions ? 'Finish' : 'Next Question'}
          </button>
        )}
        
        {!showResult && (
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