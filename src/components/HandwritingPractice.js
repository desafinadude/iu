import React, { useState, useEffect, useRef, useCallback } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import '../styles/HandwritingPractice.css';

function HandwritingPractice({ settings }) {
  const canvasRef = useRef(null);
  const [currentChar, setCurrentChar] = useState(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [candidates, setCandidates] = useState('Draw the character, and I\'ll show you what I recognize!');
  // eslint-disable-next-line no-unused-vars
  const [candidateClass, setCandidateClass] = useState('candidates');

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

    const char = availableChars[Math.floor(Math.random() * availableChars.length)];
    setCurrentChar(char);
    clearCanvas();
    setShowHint(false);
    setShowResult(false);
    setIsCorrect(false);
    
    // Update question count
    setTotalQuestions(prev => prev + 1);
    
    // Speak the character immediately
    speak(char.char);
  }, [getEnabledChars]);

  useEffect(() => {
    generateQuestion();
    setupCanvas();
  }, [generateQuestion]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 12; // Thicker strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2c3e50'; // Dark ink-like color
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowColor = 'rgba(44, 62, 80, 0.3)'; // Subtle shadow for ink effect
    ctx.shadowBlur = 2;
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
        ctx.beginPath();
        const prevPoint = newStroke[newStroke.length - 2];
        ctx.moveTo(prevPoint[0], prevPoint[1]);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
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

      if (position !== -1 && position < strictness) {
        // Correct!
        const newScore = score + 1;
        setScore(newScore);
        setIsCorrect(true);
        setShowResult(true);
        setCandidateClass('candidates correct');
        setCandidates(`✅ Correct! ${correctChar} (${currentChar.romaji})`);
      } else {
        // Wrong - just show hint
        setIsCorrect(false);
        setShowResult(true);
        setShowHint(true);
        setCandidateClass('candidates incorrect');
        setCandidates(`❌ Try again! Looking for: ${correctChar} (${currentChar.romaji})`);
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
    setShowHint(true);
    setTimeout(() => setShowHint(false), 8000);
  };

  const handleClearCanvas = () => {
    clearCanvas();
    setShowHint(false);
    setCandidates('Draw the character, and I\'ll show you what I recognize!');
    setCandidateClass('candidates');
  };

  const handleNext = () => {
    setQuestionNumber(questionNumber + 1);
    generateQuestion();
  };

  const getCorrectPercentage = () => {
    return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  };

  const getAccuracyColor = () => {
    const percentage = getCorrectPercentage();
    if (percentage >= 80) return '#C8E9E7'; // Quiz green
    if (percentage >= 60) return '#E9F4C8'; // Light green
    if (percentage >= 40) return '#F4E9C8'; // Yellow
    if (percentage >= 20) return '#F4D5C8'; // Orange
    return '#EAA3A4'; // Quiz red
  };

  if (!currentChar) {
    return <div className="handwriting-loading">Loading...</div>;
  }

  return (
    <div className="handwriting-practice">
      <div className="handwriting-question">
        <div className="accuracy-display" style={{backgroundColor: getAccuracyColor()}}>
          {getCorrectPercentage()}%
        </div>
        <div className="score-display">
          <div className="question-number">{questionNumber + 1}</div>
          <div className="score-fraction">{score}/{totalQuestions}</div>
        </div>
        <button
          className={`speaker-button ${settings.fontStyle}`}
          onClick={handleSpeakerClick}
          title="Click to hear pronunciation"
        >
          {currentChar.romaji}
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
          <div className={`hint-overlay ${showHint ? 'show' : ''} ${settings.fontStyle}`}>
            {currentChar?.char}
          </div>
          <button className="canvas-corner-btn top-left" onClick={handleShowHint} title="Show Hint">
            💡
          </button>
          <button className="canvas-corner-btn top-right" onClick={handleClearCanvas} title="Clear Canvas">
            🗑️
          </button>
        </div>
      </div>

      <div className="handwriting-controls">
        <button 
          className={`handwriting-btn check-btn ${showResult ? (isCorrect ? 'correct' : 'wrong') : ''}`} 
          onClick={checkAnswer}
        >
          Check Answer
        </button>
        <button 
          className={`handwriting-btn next-btn ${showResult ? (isCorrect ? 'correct' : 'wrong') : ''}`} 
          onClick={handleNext}
        >
          Next Character
        </button>
      </div>
    </div>
  );
}

export default HandwritingPractice;
