import React, { useState, useEffect, useCallback, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import '../styles/FallingKana.css';

function FallingKana({ settings }) {
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [fallingChars, setFallingChars] = useState([]);
  const [targetChar, setTargetChar] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const lastTargetRef = useRef(0);
  const idCounterRef = useRef(0);

  const FALL_SPEED = 1.5; // pixels per frame
  const SPAWN_INTERVAL = 1500; // ms between spawns
  const TARGET_INTERVAL = 3000; // ms between new target announcements
  const DAMAGE_PER_HIT = 5;
  const DAMAGE_PER_WRONG = 5;
  const POINTS_PER_CORRECT = 10;

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

  const pickNewTarget = useCallback(() => {
    const availableChars = getEnabledChars();
    if (availableChars.length === 0) return null;

    const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
    setTargetChar(randomChar);
    speak(randomChar.char);
    return randomChar;
  }, [getEnabledChars]);

  const spawnCharacter = useCallback(() => {
    const availableChars = getEnabledChars();
    if (availableChars.length === 0) return;

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const areaWidth = gameArea.offsetWidth;
    const charSize = 50;
    const x = Math.random() * (areaWidth - charSize);
    const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];

    const newChar = {
      id: idCounterRef.current++,
      char: randomChar.char,
      romaji: randomChar.romaji,
      x,
      y: -charSize,
      isTarget: targetChar && randomChar.char === targetChar.char
    };

    setFallingChars(prev => [...prev, newChar]);
  }, [getEnabledChars, targetChar]);

  const handleCharClick = useCallback((clickedChar) => {
    if (gameOver || !targetChar) return;

    if (clickedChar.char === targetChar.char) {
      // Correct!
      setScore(prev => prev + POINTS_PER_CORRECT);
      setFeedback({ type: 'correct', message: 'Correct!' });
      setFallingChars(prev => prev.filter(c => c.id !== clickedChar.id));
      // Pick new target immediately after correct answer
      pickNewTarget();
      lastTargetRef.current = Date.now();
    } else {
      // Wrong!
      setHealth(prev => {
        const newHealth = Math.max(0, prev - DAMAGE_PER_WRONG);
        if (newHealth === 0) setGameOver(true);
        return newHealth;
      });
      setFeedback({ type: 'wrong', message: 'Wrong!' });
    }

    setTimeout(() => setFeedback(null), 500);
  }, [gameOver, targetChar, pickNewTarget]);

  const gameLoop = useCallback(() => {
    if (gameOver || !gameStarted) return;

    const now = Date.now();
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const areaHeight = gameArea.offsetHeight;

    // Spawn new character
    if (now - lastSpawnRef.current > SPAWN_INTERVAL) {
      spawnCharacter();
      lastSpawnRef.current = now;
    }

    // Pick new target periodically
    if (now - lastTargetRef.current > TARGET_INTERVAL) {
      pickNewTarget();
      lastTargetRef.current = now;
    }

    // Update falling characters
    setFallingChars(prev => {
      const updated = [];
      let healthLoss = 0;

      for (const char of prev) {
        const newY = char.y + FALL_SPEED;

        if (newY > areaHeight) {
          // Character hit the ground
          if (targetChar && char.char === targetChar.char) {
            healthLoss += DAMAGE_PER_HIT;
          }
        } else {
          updated.push({
            ...char,
            y: newY,
            isTarget: targetChar && char.char === targetChar.char
          });
        }
      }

      if (healthLoss > 0) {
        setHealth(prev => {
          const newHealth = Math.max(0, prev - healthLoss);
          if (newHealth === 0) setGameOver(true);
          return newHealth;
        });
      }

      return updated;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver, gameStarted, spawnCharacter, pickNewTarget, targetChar]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]);

  const startGame = () => {
    const availableChars = getEnabledChars();
    if (availableChars.length < 3) {
      alert('Please enable at least 3 characters in settings!');
      return;
    }

    setHealth(100);
    setScore(0);
    setGameOver(false);
    setFallingChars([]);
    setFeedback(null);
    lastSpawnRef.current = Date.now();
    lastTargetRef.current = Date.now();
    idCounterRef.current = 0;

    const newTarget = pickNewTarget();
    if (newTarget) {
      setGameStarted(true);
    }
  };

  const replaySound = () => {
    if (targetChar) {
      speak(targetChar.char);
    }
  };

  const getHealthColor = () => {
    if (health > 60) return '#4CAF50';
    if (health > 30) return '#FFC107';
    return '#f44336';
  };

  if (!gameStarted || gameOver) {
    return (
      <div className="falling-kana">
        <div className="game-menu">
          {gameOver && (
            <div className="game-over-screen">
              <h2>Game Over!</h2>
              <div className="final-score">Score: {score}</div>
            </div>
          )}
          {!gameOver && (
            <div className="game-intro">
              <h2>Falling Kana</h2>
              <p>Tap the character you hear before it hits the ground!</p>
              <ul className="game-rules">
                <li>Health: 100</li>
                <li>Miss target: -5 health</li>
                <li>Wrong tap: -5 health</li>
                <li>Correct tap: +10 points</li>
              </ul>
            </div>
          )}
          <button className="start-button" onClick={startGame}>
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="falling-kana">
      <div className="game-header">
        <div className="health-bar-container">
          <div
            className="health-bar"
            style={{
              width: `${health}%`,
              backgroundColor: getHealthColor()
            }}
          />
          <span className="health-text">{health}</span>
        </div>
        <div className="score-badge">{score}</div>
      </div>

      <div className="target-display">
        <button className="target-button" onClick={replaySound}>
          <span className="speaker-icon">🔊</span>
          <span className="target-romaji">{targetChar?.romaji}</span>
        </button>
      </div>

      {feedback && (
        <div className={`feedback-popup ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <div className="game-area" ref={gameAreaRef}>
        {fallingChars.map(char => (
          <button
            key={char.id}
            className={`falling-char ${settings.fontStyle} ${char.isTarget ? 'is-target' : ''}`}
            style={{
              left: char.x,
              top: char.y
            }}
            onClick={() => handleCharClick(char)}
          >
            {char.char}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FallingKana;
