import React, { useState, useEffect, useRef, useCallback } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { kanjiData } from '../data/kanjiData';
import { speak } from '../utils/speech';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import StreakFlash, { useStreakFlash } from './StreakFlash';
import { STAR_THRESHOLD } from '../utils/progressHelpers';
import '../styles/HandwritingPractice.css';

const TIMER_DURATION = 10;
const MAX_LIVES = 3;

const SCRIPT_MODES = [
  { id: 'kana', label: 'Kana', desc: 'Hiragana & Katakana' },
  { id: 'kanji', label: 'Kanji', desc: 'JLPT N5 Kanji' },
];

function HandwritingPractice({ settings, onAnswerRecorded, getKanaWeight, onKanjiAnswerRecorded, getKanjiWeight }) {
  const [scriptMode, setScriptMode] = useState(null); // null = script selection screen
  const canvasRef = useRef(null);
  const [currentChar, setCurrentChar] = useState(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [characterAttempts, setCharacterAttempts] = useState(0);
  const [characterCorrect, setCharacterCorrect] = useState(false);
  const [characterWeights, setCharacterWeights] = useState(new Map());
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [roundEvents, setRoundEvents] = useState([]);
  const timerRef = useRef(null);
  const { flash, showProgress, showReset } = useStreakFlash();
  // eslint-disable-next-line no-unused-vars
  const [candidates, setCandidates] = useState('Draw the character, and I\'ll show you what I recognize!');
  // eslint-disable-next-line no-unused-vars
  const [candidateClass, setCandidateClass] = useState('candidates');

  const getEnabledChars = useCallback(() => {
    if (scriptMode === 'kanji') {
      // All 112 N5 kanji — map to same shape as kana { char, romaji/label }
      return kanjiData.map(k => ({ char: k.char, romaji: k.meanings[0], isKanji: true, kanjiData: k }));
    }
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
  }, [settings, scriptMode]);

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

    let char;

    if (availableChars.length >= 10) {
      // Use weighted selection combining mastery level and session weights
      const weightedChars = availableChars.map(character => {
        let masteryWeight = 1.0;
        if (scriptMode === 'kanji' && getKanjiWeight) {
          masteryWeight = getKanjiWeight(character.char, 'handwriting');
        } else if (getKanaWeight) {
          masteryWeight = getKanaWeight(character.char);
        }
        const sessionWeight = characterWeights.get(character.char) || 1.0;
        return {
          ...character,
          weight: masteryWeight * sessionWeight
        };
      });

      const totalWeight = weightedChars.reduce((sum, character) => sum + character.weight, 0);
      let random = Math.random() * totalWeight;

      char = weightedChars.find(character => {
        random -= character.weight;
        return random <= 0;
      });

      // Fallback in case of rounding errors
      if (!char) {
        char = weightedChars[weightedChars.length - 1];
      }
    } else {
      // Use simple random selection for small pools
      char = availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    // Update session weights
    if (availableChars.length >= 10) {
      setCharacterWeights(prev => {
        const updated = new Map(prev);
        updated.set(char.char, 0.3); // Much less likely to repeat in this session
        // Slowly increase weights of other characters
        availableChars.forEach(character => {
          if (character.char !== char.char) {
            const current = updated.get(character.char) || 1.0;
            updated.set(character.char, Math.min(current + 0.1, 1.5));
          }
        });
        return updated;
      });
    }

    setCurrentChar(char);
    clearCanvas();
    setShowCharacter(false);
    setShowResult(false);
    
    // Reset per-character tracking
    setCharacterAttempts(0);
    setCharacterCorrect(false);
    
    // Start timer for this question
    startTimer();
    
    // Speak the character immediately
    speak(char.char);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnabledChars]);

  useEffect(() => {
    generateQuestion();
    setupCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle timer running out
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentChar && !gameOver) {
      setShowResult(true);
      setShowCharacter(true);
      playWrongSound();

      // Record as wrong answer for mastery tracking
      const recorder = (scriptMode === 'kanji' && onKanjiAnswerRecorded) ? onKanjiAnswerRecorded : onAnswerRecorded;
      if (recorder) {
        const result = recorder(currentChar.char, false, 'handwriting');

        // Show flash and track event
        if (result.streakLost) {
          showReset(STAR_THRESHOLD);
          setRoundEvents(prev => [...prev, {
            kana: currentChar.char,
            type: 'reset',
            lostStreak: result.lostStreak
          }]);
        }
      }

      const newLives = lives - 1;
      setLives(newLives);
      speak(currentChar.char);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  }, [timeLeft, showResult, currentChar, lives, gameOver, onAnswerRecorded, onKanjiAnswerRecorded, scriptMode, showReset]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 14; // More moderate thickness for ink-like feel
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a1a1a'; // Deeper black ink color
    ctx.globalCompositeOperation = 'source-over';
    
    // Enhanced ink effect with multiple shadows
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setCurrentStroke([]);
  };

  const getCanvasPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasPosition(e);
    setCurrentStroke([[pos.x, pos.y]]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getCanvasPosition(e);

    setCurrentStroke(prev => {
      const newStroke = [...prev, [pos.x, pos.y]];
      
      if (newStroke.length >= 2) {
        const prevPoint = newStroke[newStroke.length - 2];
        
        // Calculate speed for pressure variation
        const distance = Math.sqrt(
          Math.pow(pos.x - prevPoint[0], 2) + Math.pow(pos.y - prevPoint[1], 2)
        );
        
        // Vary line width based on drawing speed for ink-like effect
        const speed = Math.min(distance, 20);
        const pressureVariation = Math.max(0.7, 1 - (speed / 40));
        const currentLineWidth = 14 * pressureVariation;
        
        ctx.save();
        ctx.lineWidth = currentLineWidth;
        
        // Add slight opacity variation for ink bleeding effect
        ctx.globalAlpha = 0.85 + (pressureVariation * 0.15);
        
        ctx.beginPath();
        ctx.moveTo(prevPoint[0], prevPoint[1]);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.restore();
      }
      
      return newStroke;
    });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
      
      // Auto-recognize after a delay
      setTimeout(() => recognizeDrawing([...strokes, currentStroke]), 500);
    }
  };

  const recognizeDrawing = async (strokesToRecognize = strokes) => {
    if (!strokesToRecognize || strokesToRecognize.length === 0) return;

    try {
      // Format strokes for Google InputTools API
      const ink = strokesToRecognize.map(stroke => {
        const xCoords = stroke.map(point => Math.round(point[0]));
        const yCoords = stroke.map(point => Math.round(point[1]));
        return [xCoords, yCoords];
      });

      const requestData = {
        "options": "enable_pre_space",
        "requests": [{
          "writing_guide": {
            "writing_area_width": 280,
            "writing_area_height": 240
          },
          "ink": ink,
          "language": "ja"
        }]
      };

      const response = await fetch('https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data && data[1] && data[1][0] && data[1][0][1]) {
        const results = data[1][0][1];
        const topCandidates = results.slice(0, 8).join('  ');
        setCandidateClass('candidates');
        setCandidates(<div><div style={{marginBottom: '8px'}}>Recognized:</div>{topCandidates}</div>);
      } else {
        setCandidateClass('candidates');
        setCandidates('No character recognized. Try drawing more clearly!');
      }
    } catch (error) {
      console.error('Recognition error:', error);
      setCandidateClass('candidates');
      setCandidates('Recognition error. Please try again.');
    }
  };

  const checkAnswer = async () => {
    if (!currentChar || strokes.length === 0) {
      setCandidates('❓ Please draw something first!');
      return;
    }

    // Stop timer and show the character when checking answer
    stopTimer();
    setShowCharacter(true);

    try {
      // Format strokes for Google InputTools API
      const ink = strokes.map(stroke => {
        const xCoords = stroke.map(point => Math.round(point[0]));
        const yCoords = stroke.map(point => Math.round(point[1]));
        return [xCoords, yCoords];
      });

      const requestData = {
        "options": "enable_pre_space",
        "requests": [{
          "writing_guide": {
            "writing_area_width": 280,
            "writing_area_height": 240
          },
          "ink": ink,
          "language": "ja"
        }]
      };

      const response = await fetch('https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!data || !data[1] || !data[1][0] || !data[1][0][1]) {
        setCandidates('❓ No character recognized. Please draw more clearly!');
        return;
      }

      const result = data[1][0][1];
      const correctChar = currentChar.char;
      const position = result.indexOf(correctChar);
      const strictness = settings.recognitionStrictness || 10;

      // Update attempts for this character
      setCharacterAttempts(prev => prev + 1);

      if (position !== -1 && position < strictness) {
        // Correct!
        const newScore = score + 1;
        setScore(newScore);
        setShowResult(true);
        setCharacterCorrect(true);
        playCorrectSound();
        setCandidateClass('candidates correct');
        setCandidates(`✅ Correct! ${correctChar} (${currentChar.romaji})`);

        // Record correct answer for mastery tracking
        const recorderCorrect = (scriptMode === 'kanji' && onKanjiAnswerRecorded) ? onKanjiAnswerRecorded : onAnswerRecorded;
        if (recorderCorrect) {
          const result = recorderCorrect(currentChar.char, true, 'handwriting');

          // Show flash and track events
          if (result.starEarned) {
            setRoundEvents(prev => [...prev, {
              kana: currentChar.char,
              type: 'star'
            }]);
          } else if (result.newConsecutive > 0) {
            showProgress(result.newConsecutive, STAR_THRESHOLD);
          }
        }
      } else {
        // Wrong - lose a life
        setShowResult(true);
        playWrongSound();
        const newLives = lives - 1;
        setLives(newLives);
        setCandidateClass('candidates incorrect');
        setCandidates(`❌ Try again! Looking for: ${correctChar} (${currentChar.romaji})`);

        // Record wrong answer for mastery tracking
        const recorderWrong = (scriptMode === 'kanji' && onKanjiAnswerRecorded) ? onKanjiAnswerRecorded : onAnswerRecorded;
        if (recorderWrong) {
          const result = recorderWrong(currentChar.char, false, 'handwriting');

          // Show flash and track event
          if (result.streakLost) {
            showReset(STAR_THRESHOLD);
            setRoundEvents(prev => [...prev, {
              kana: currentChar.char,
              type: 'reset',
              lostStreak: result.lostStreak
            }]);
          }
        }

        if (newLives <= 0) {
          setGameOver(true);
        }
      }
    } catch (error) {
      console.error('Recognition error:', error);
      setCandidateClass('candidates incorrect');
      setCandidates('❌ Recognition error. Please try again!');
    }
  };

  const handleSpeakerClick = () => {
    if (currentChar) {
      speak(currentChar.char);
    }
  };

  const handleShowHint = () => {
    setShowCharacter(!showCharacter);
    if (!showCharacter) {
      // If we're showing the character, hide it after a shorter timeout
      setTimeout(() => setShowCharacter(false), 4000);
    }
  };

  const handleClearCanvas = () => {
    clearCanvas();
    setCandidates('Draw the character, and I\'ll show you what I recognize!');
    setCandidateClass('candidates');
  };

  const getScriptType = () => {
    if (!currentChar) return '';
    if (scriptMode === 'kanji') return 'Kanji';
    return hiraganaData.some(h => h.char === currentChar.char) ? 'Hiragana' : 'Katakana';
  };

  const handleNext = () => {
    setQuestionNumber(questionNumber + 1);
    generateQuestion();
  };

  const handlePlayAgain = () => {
    setScore(0);
    setQuestionNumber(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setShowResult(false);
    setShowCharacter(false);
    setRoundEvents([]);
    generateQuestion();
  };

  const getCorrectPercentage = () => {
    // Show character-specific accuracy: 0% if no attempts, otherwise based on if they got it right
    if (characterAttempts === 0) return 0;
    return characterCorrect ? 100 : 0;
  };

  const getAccuracyColor = () => {
    const percentage = getCorrectPercentage();
    if (percentage === 0 && characterAttempts === 0) return '#f8f9fa'; // Light grey for no attempts
    if (percentage === 100) return '#C8E9E7'; // Quiz green for correct
    return '#EAA3A4'; // Quiz red for incorrect
  };

  // Script mode selection screen
  if (!scriptMode) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Handwriting</h2>
          <p>Choose what to practice</p>
          <div className="mode-selector">
            {SCRIPT_MODES.map(mode => (
              <button
                key={mode.id}
                className="mode-button"
                onClick={() => setScriptMode(mode.id)}
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

  if (!currentChar) {
    return <div className="handwriting-loading">Loading...</div>;
  }

  return (
    <div className="handwriting-practice">
      <StreakFlash flash={flash} />

      {gameOver && (
        <ResultsModal
          score={score}
          questionsAnswered={questionNumber + 1}
          onPlayAgain={handlePlayAgain}
          quizType="Handwriting"
          roundEvents={roundEvents}
        />
      )}

      <div className="handwriting-question">
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
        <div className="accuracy-display" style={{backgroundColor: getAccuracyColor()}}>
          {getCorrectPercentage()}%
        </div>
        <div style={{fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold'}}>
          {getScriptType()}
        </div>
        <button
          className={`speaker-button font-${settings.fontStyle}`}
          onClick={handleSpeakerClick}
          title="Click to hear pronunciation"
        >
          {showCharacter ? currentChar.char : currentChar.romaji}
        </button>
      </div>

      <div className="canvas-area">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width="280"
            height="240"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <button className="canvas-corner-btn top-left" onClick={handleShowHint} title="Toggle Hint">
            💡
          </button>
          <button className="canvas-corner-btn top-right" onClick={handleClearCanvas} title="Clear Canvas">
            🗑️
          </button>
        </div>
      </div>

      <div className="handwriting-controls">
        <button 
          className={`handwriting-btn check-btn ${showResult ? (getCorrectPercentage() > 50 ? 'correct' : 'wrong') : ''}`} 
          onClick={checkAnswer}
        >
          Check Answer
        </button>
        <button 
          className={`handwriting-btn next-btn ${showResult ? (getCorrectPercentage() > 50 ? 'correct' : 'wrong') : ''}`} 
          onClick={handleNext}
        >
          Next Character
        </button>
      </div>
    </div>
  );
}

export default HandwritingPractice;
