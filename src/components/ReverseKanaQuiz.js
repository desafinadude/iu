import React, { useState, useEffect, useCallback } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import '../styles/KanaQuiz.css';

function ReverseKanaQuiz({ settings }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

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

  const generateQuestion = useCallback(() => {
    const availableChars = getEnabledChars();
    if (availableChars.length === 0) {
      alert('Please enable at least one character in settings!');
      return;
    }

    const correctAnswer = availableChars[Math.floor(Math.random() * availableChars.length)];
    const wrongAnswers = shuffle(
      availableChars.filter(h => h.char !== correctAnswer.char)
    ).slice(0, 9);
    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    setCurrentQuestion(correctAnswer);
    setOptions(allOptions);
    setShowResult(false);
    setSelectedAnswer(null);
  }, [getEnabledChars]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (option) => {
    if (showResult || !currentQuestion) return;

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
        <div className={`character-display ${settings.fontStyle}`}>
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
