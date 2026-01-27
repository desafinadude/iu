import React, { useState, useEffect, useCallback, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import '../styles/KanaQuiz.css';

const TIMER_DURATION = 10;

function ReverseKanaQuiz({ settings }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [characterWeights, setCharacterWeights] = useState(new Map());
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const timerRef = useRef(null);

  const totalQuestions = 20;

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

    let correctAnswer;

    if (availableChars.length >= 10) {
      // Use weighted selection for larger pools
      const weightedChars = availableChars.map(char => ({
        ...char,
        weight: characterWeights.get(char.char) || 1.0
      }));

      const totalWeight = weightedChars.reduce((sum, char) => sum + char.weight, 0);
      let random = Math.random() * totalWeight;

      correctAnswer = weightedChars.find(char => {
        random -= char.weight;
        return random <= 0;
      });

      // Fallback in case of rounding errors
      if (!correctAnswer) {
        correctAnswer = weightedChars[weightedChars.length - 1];
      }
    } else {
      // Use simple random selection for small pools
      correctAnswer = availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    // Update weights - reduce weight of selected character, increase others slightly
    if (availableChars.length >= 10) {
      setCharacterWeights(prev => {
        const updated = new Map(prev);
        updated.set(correctAnswer.char, 0.3); // Much less likely to repeat
        // Slowly increase weights of other characters
        availableChars.forEach(char => {
          if (char.char !== correctAnswer.char) {
            const current = updated.get(char.char) || 1.0;
            updated.set(char.char, Math.min(current + 0.1, 1.5));
          }
        });
        return updated;
      });
    }

    const wrongAnswers = shuffle(
      availableChars.filter(h => h.char !== correctAnswer.char)
    ).slice(0, 9);
    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    setCurrentQuestion(correctAnswer);
    setOptions(allOptions);
    setShowResult(false);
    setSelectedAnswer(null);
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnabledChars, startTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Handle timer running out
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentQuestion) {
      setSelectedAnswer(null);
      setShowResult(true);
      speak(currentQuestion.char);
    }
  }, [timeLeft, showResult, currentQuestion]);

  const handleAnswer = (option) => {
    if (showResult || !currentQuestion) return;

    stopTimer();
    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option.char === currentQuestion.char;
    if (isCorrect) {
      setScore(score + 1);
    }

    speak(currentQuestion.char);
  };

  const handleNext = () => {
    if (questionNumber + 1 >= totalQuestions) {
      alert(`Quiz Complete! Score: ${score + (selectedAnswer?.char === currentQuestion?.char ? 1 : 0)}/${totalQuestions}`);
      setQuestionNumber(0);
      setScore(0);
      generateQuestion();
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  const isCorrect = selectedAnswer?.char === currentQuestion?.char;

  if (!currentQuestion) {
    return <div className="quiz-loading">Loading...</div>;
  }

  return (
    <div className="kana-quiz">
      <div className="quiz-question">
        <div className="score-display">
          <div className="question-number">{questionNumber + 1}</div>
          <div className="score-fraction">{score}/{totalQuestions}</div>
        </div>
        {!showResult && (
          <div className="quiz-timer-bar">
            <div
              className={`quiz-timer-fill ${timeLeft <= 3 ? 'urgent' : ''}`}
              style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
            />
          </div>
        )}
        <div className={`character-display font-${settings.fontStyle}`}>
          {currentQuestion?.char}
        </div>
      </div>

      <div className="options-grid">
        {options.map((option, index) => (
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
            disabled={showResult}
          >
            {option.romaji}
          </button>
        ))}
      </div>

      <div className="button-area">
        {showResult && (
          <button className={`next-button ${isCorrect ? 'correct' : 'wrong'}`} onClick={handleNext}>
            {questionNumber + 1 >= totalQuestions ? 'Finish' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ReverseKanaQuiz;
