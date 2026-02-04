import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import '../styles/KanaQuiz.css';

const TIMER_DURATION = 10;
const MAX_LIVES = 3;

function KanaMatching({ settings, onAnswerRecorded, getKanaWeight }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [questionType, setQuestionType] = useState('hiragana');
  const timerRef = useRef(null);

  // Create mapping between hiragana and katakana
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

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const generateQuestion = useCallback(() => {
    const enabledHiragana = Array.from(settings.enabledHiragana);
    const enabledKatakana = Array.from(settings.enabledKatakana);
    
    // Only include characters that exist in both hiragana and katakana mappings
    const validHiragana = enabledHiragana.filter(char => kanaMapping[char]);
    const validKatakana = enabledKatakana.filter(char => kanaMapping[char]);
    
    if (validHiragana.length < 4 || validKatakana.length < 4) {
      alert('Please enable at least 4 characters for both hiragana and katakana in settings!');
      return;
    }

    // Randomly choose question type
    const types = ['hiragana', 'katakana'];
    const questionType = types[Math.floor(Math.random() * types.length)];
    setQuestionType(questionType);

    let questionChar, availableChars, correctAnswer;
    
    if (questionType === 'hiragana') {
      // Show hiragana, ask for katakana
      availableChars = validHiragana;
      questionChar = availableChars[Math.floor(Math.random() * availableChars.length)];
      correctAnswer = kanaMapping[questionChar];
      availableChars = validKatakana;
    } else {
      // Show katakana, ask for hiragana
      availableChars = validKatakana;
      questionChar = availableChars[Math.floor(Math.random() * availableChars.length)];
      correctAnswer = kanaMapping[questionChar];
      availableChars = validHiragana;
    }

    // Generate wrong answers - use more options like the original quiz
    const wrongAnswers = shuffle(
      availableChars.filter(char => char !== correctAnswer)
    ).slice(0, 9);
    
    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    setCurrentQuestion({
      char: questionChar,
      correct: correctAnswer,
      type: questionType
    });
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
    
    // Start timer and speak character
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

    // Don't speak the character automatically to maintain difficulty
    // speak(questionChar);
  }, [settings.enabledHiragana, settings.enabledKatakana, kanaMapping]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Only generate question when game starts
  useEffect(() => {
    if (hasStarted && !gameOver && !currentQuestion) {
      generateQuestion();
    }
  }, [hasStarted, gameOver, currentQuestion, generateQuestion]);

  const handleStart = () => {
    setHasStarted(true);
  };

  // Handle timer running out
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentQuestion && !gameOver) {
      setSelectedAnswer(null);
      setShowResult(true);
      playWrongSound();

      // Record as wrong answer for mastery tracking (both kana)
      if (onAnswerRecorded) {
        onAnswerRecorded(currentQuestion.char, false);
        onAnswerRecorded(currentQuestion.correct, false);
      }

      const newLives = lives - 1;
      setLives(newLives);
      speak(currentQuestion.char);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  }, [timeLeft, showResult, currentQuestion, lives, gameOver, onAnswerRecorded]);

  const handleAnswer = (answer) => {
    if (showResult || !currentQuestion || gameOver) return;

    stopTimer();
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.correct;

    // Record answer for mastery tracking (both the question and answer kana)
    if (onAnswerRecorded) {
      onAnswerRecorded(currentQuestion.char, isCorrect);
      onAnswerRecorded(currentQuestion.correct, isCorrect);
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
    setHasStarted(false);
    setCurrentQuestion(null); // Reset current question
  };

  const isCorrect = selectedAnswer === currentQuestion?.correct;

  const handleSpeakerClick = () => {
    if (currentQuestion) {
      speak(currentQuestion.char);
    }
  };

  if (!hasStarted) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Kana Matching</h2>
          <p>Match the kana characters between hiragana and katakana</p>
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
          quizType="Kana Matching"
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
          {currentQuestion.char}
        </button>
        
        <div className="question-prompt">
          {questionType === 'hiragana' 
            ? 'in Katakana'
            : 'in Hiragana'
          }
        </div>
      </div>

      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
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

export default KanaMatching;