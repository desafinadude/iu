import React, { useState, useEffect, useCallback, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { speak } from '../utils/speech';
import { playExplosionSound, playCorrectSound, playWrongSound } from '../utils/soundEffects';
import '../styles/FallingKana.css';

function FallingKana({ settings }) {
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [fallingChars, setFallingChars] = useState([]);
  const [targetChar, setTargetChar] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [waitingForNextRound, setWaitingForNextRound] = useState(false);
  const [screenFlash, setScreenFlash] = useState(null);
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const idCounterRef = useRef(0);
  const targetResolvedRef = useRef(false);

  const FALL_SPEED = 0.8; // pixels per frame (slower)
  const FALL_SPEED_INCREMENT = 0.05; // speed increase per correct answer
  const MAX_FALL_SPEED = 2.0; // maximum fall speed
  const BATCH_SIZE = 6; // characters per round (reduced to prevent crowding)
  const DAMAGE_PER_MISS = 5;
  const DAMAGE_PER_WRONG = 5;
  const POINTS_PER_CORRECT = 10;
  const POINTS_LOST_PER_MISS = 5; // points lost when missing target
  const SPAWN_DELAY = 800; // ms between each character spawn in batch (more spaced out)

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

  const getCurrentFallSpeed = useCallback(() => {
    const correctAnswers = Math.floor(score / POINTS_PER_CORRECT);
    const currentSpeed = FALL_SPEED + (correctAnswers * FALL_SPEED_INCREMENT);
    return Math.min(currentSpeed, MAX_FALL_SPEED);
  }, [score]);

  const spawnBatch = useCallback(() => {
    const availableChars = getEnabledChars();
    if (availableChars.length === 0) return;

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const areaWidth = gameArea.offsetWidth;
    // Responsive character size - larger on mobile for better touch targets
    const charSize = areaWidth < 768 ? 65 : 60;
    const padding = Math.max(30, areaWidth * 0.08); // Dynamic padding based on screen width

    // Calculate available positions using grid approach - much better spacing
    const availableWidth = areaWidth - padding * 2 - charSize;
    const numColumns = Math.min(BATCH_SIZE, Math.floor(availableWidth / (charSize + 40)) + 1);
    const columnWidth = availableWidth / numColumns;

    // Pick the target character first
    const targetCharData = availableChars[Math.floor(Math.random() * availableChars.length)];

    // Set target and announce FIRST
    setTargetChar(targetCharData);
    targetResolvedRef.current = false;
    speak(targetCharData.char);

    // Create batch with guaranteed target (after announcing)
    const batch = [];

    // Decide where in the batch the target will appear
    const targetIndex = Math.floor(Math.random() * BATCH_SIZE);

    for (let i = 0; i < BATCH_SIZE; i++) {
      let charData;
      if (i === targetIndex) {
        charData = targetCharData;
      } else {
        // Pick a random character that is NOT the target
        let otherChar;
        do {
          otherChar = availableChars[Math.floor(Math.random() * availableChars.length)];
        } while (otherChar.char === targetCharData.char && availableChars.length > 1);
        charData = otherChar;
      }

      // Use grid-based positioning with randomness within each column
      // Shuffle column assignments for variety
      const columnIndex = i % numColumns;
      const columnStart = padding + columnIndex * columnWidth;
      const randomOffset = Math.random() * Math.max(0, columnWidth - charSize - 20);
      const x = columnStart + randomOffset;

      // Stagger Y positions randomly to prevent vertical bunching
      const randomYOffset = Math.random() * 100;

      batch.push({
        id: idCounterRef.current++,
        char: charData.char,
        romaji: charData.romaji,
        x,
        y: -charSize - randomYOffset,
        isTarget: charData.char === targetCharData.char,
        spawnDelay: i * SPAWN_DELAY
      });
    }

    // Spawn characters with staggered timing AFTER announcing
    setTimeout(() => {
      batch.forEach((char) => {
        setTimeout(() => {
          setFallingChars(prev => [...prev, char]);
        }, char.spawnDelay);
      });
    }, 800); // Delay after voice announcement

  }, [getEnabledChars]);

  const handleCharClick = useCallback((clickedChar) => {
    if (gameOver || !targetChar || targetResolvedRef.current) return;

    if (clickedChar.char === targetChar.char) {
      // Correct!
      targetResolvedRef.current = true;
      playCorrectSound();
      setScore(prev => prev + POINTS_PER_CORRECT);
      setFeedback({ type: 'correct', message: 'Correct!' });
      setFallingChars(prev => prev.filter(c => c.id !== clickedChar.id));

      // Wait a moment then start next round
      setTimeout(() => {
        setFeedback(null);
        setWaitingForNextRound(true);
      }, 600);
    } else {
      // Wrong!
      playWrongSound();
      setHealth(prev => {
        const newHealth = Math.max(0, prev - DAMAGE_PER_WRONG);
        if (newHealth === 0) setGameOver(true);
        return newHealth;
      });
      setScore(prev => {
        const newScore = Math.max(0, prev - POINTS_LOST_PER_MISS);
        console.log('Wrong click! Score reduced from', prev, 'to', newScore);
        return newScore;
      });
      setFeedback({ type: 'wrong', message: `Wrong! -${POINTS_LOST_PER_MISS} points` });
      setTimeout(() => setFeedback(null), 400);
    }
  }, [gameOver, targetChar]);

  const gameLoop = useCallback(() => {
    if (gameOver || !gameStarted) return;

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const areaHeight = gameArea.offsetHeight;
    const currentSpeed = getCurrentFallSpeed();

    // Update falling characters
    setFallingChars(prev => {
      const updated = [];
      let targetMissed = false;

      for (const char of prev) {
        const newY = char.y + currentSpeed;

        if (newY > areaHeight - 100) { // Account for skyline height
          // Character hit the ground
          if (char.isTarget && !targetResolvedRef.current) {
            targetMissed = true;
            targetResolvedRef.current = true;
          }
        } else {
          updated.push({
            ...char,
            y: newY
          });
        }
      }

      if (targetMissed) {
        // Play explosion sound and flash screen red
        playExplosionSound();
        setScreenFlash('red');
        setTimeout(() => setScreenFlash(null), 200);

        setHealth(prev => {
          const newHealth = Math.max(0, prev - DAMAGE_PER_MISS);
          if (newHealth === 0) {
            setGameOver(true);
          }
          return newHealth;
        });
        // Explicitly lose points when missing target
        setScore(prev => {
          const newScore = Math.max(0, prev - POINTS_LOST_PER_MISS);
          console.log('Target missed! Score reduced from', prev, 'to', newScore);
          return newScore;
        });
        setFeedback({ type: 'wrong', message: `Missed! -${POINTS_LOST_PER_MISS} points` });
        setTimeout(() => {
          setFeedback(null);
          setWaitingForNextRound(true);
        }, 600);
      }

      return updated;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver, gameStarted, getCurrentFallSpeed]);

  // Handle starting next round when all chars have fallen or target resolved
  useEffect(() => {
    if (waitingForNextRound && !gameOver) {
      // Clear remaining characters and start new batch
      setFallingChars([]);
      setWaitingForNextRound(false);

      setTimeout(() => {
        spawnBatch();
      }, 500);
    }
  }, [waitingForNextRound, gameOver, spawnBatch]);

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
    setWaitingForNextRound(false);
    setScreenFlash(null);
    idCounterRef.current = 0;
    targetResolvedRef.current = false;

    setGameStarted(true);

    // Spawn first batch after a short delay
    setTimeout(() => {
      spawnBatch();
    }, 500);
  };

  const replaySound = () => {
    if (targetChar) {
      speak(targetChar.char);
    }
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
        <div className="skyline"></div>
      </div>
    );
  }

  return (
    <div className="falling-kana">
      {screenFlash && <div className={`screen-flash ${screenFlash}`} />}

      <div className="target-display">
        <div className="star-bubble" onClick={replaySound} style={{ cursor: 'pointer' }}>
          {targetChar && <div className="target-letter">{targetChar.romaji}</div>}
        </div>
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
            className={`falling-char ${settings.fontStyle}`}
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

      <div className="health-circle">
        <div className="health-text">{health}</div>
      </div>

      <div className="score-circle">{score}</div>

      <div className="skyline"></div>
    </div>
  );
}

export default FallingKana;
