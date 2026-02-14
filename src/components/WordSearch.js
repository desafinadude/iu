import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { getUnlockedWords } from '../data/vocabPacks';
import { playCorrectSound } from '../utils/soundEffects';
import { speak } from '../utils/speech';
import '../styles/WordSearch.css';

const GRID_SIZE = 8;
const WORDS_PER_PUZZLE = 5;
const TIMER_DURATION = 180; // 3 minutes in seconds

// Directions: right, down, diagonal down-right
const DIRECTIONS = [
  { dx: 1, dy: 0 },  // right
  { dx: 0, dy: 1 },  // down
  { dx: 1, dy: 1 },  // diagonal down-right
];

function WordSearch({ settings, unlockedPacks = [] }) {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);
  const [wordPositions, setWordPositions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showingKana, setShowingKana] = useState(new Set());
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [lastFoundWord, setLastFoundWord] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef(null);

  // Get words from purchased packs only
  const availableWords = useMemo(() => getUnlockedWords(unlockedPacks), [unlockedPacks]);

  // Get unique categories from available words
  const allCategories = useMemo(() => {
    const categories = new Set(availableWords.map(item => item.category).filter(Boolean));
    return ['all', ...Array.from(categories).sort()];
  }, [availableWords]);

  // Get filtered word list based on selected categories
  const getFilteredWordList = useCallback(() => {
    // No words available if no packs purchased
    if (availableWords.length === 0) {
      return [];
    }

    let filteredVocab = availableWords;
    if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
      filteredVocab = availableWords.filter(word =>
        selectedCategories.some(category => word.category === category)
      );
    }

    // If no words match the filter, fall back to all available words
    if (filteredVocab.length === 0) {
      filteredVocab = availableWords;
    }

    return filteredVocab.map(item => ({
      word: item.word,
      translation: item.translation,
      example: item.example || null,
      exampleEN: item.exampleEN || null
    }));
  }, [availableWords, selectedCategories]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_DURATION);
    setTimerExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setTimerExpired(true);
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getRandomHiragana = useCallback(() => {
    const basicHiragana = hiraganaData.filter(h => h.basic);
    return basicHiragana[Math.floor(Math.random() * basicHiragana.length)].char;
  }, []);

  const canPlaceWord = useCallback((grid, word, startRow, startCol, direction) => {
    const chars = word.split('');
    for (let i = 0; i < chars.length; i++) {
      const row = startRow + i * direction.dy;
      const col = startCol + i * direction.dx;

      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return false;
      }

      const cell = grid[row][col];
      if (cell !== null && cell !== chars[i]) {
        return false;
      }
    }
    return true;
  }, []);

  const placeWord = useCallback((grid, word, startRow, startCol, direction) => {
    const chars = word.split('');
    const positions = [];

    for (let i = 0; i < chars.length; i++) {
      const row = startRow + i * direction.dy;
      const col = startCol + i * direction.dx;
      grid[row][col] = chars[i];
      positions.push({ row, col });
    }

    return positions;
  }, []);

  const generatePuzzle = useCallback(() => {
    // Get current filtered word list
    const WORD_LIST = getFilteredWordList();
    
    // Create empty grid
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

    // Shuffle and select words
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    const selectedWords = [];
    const positions = [];

    for (const wordObj of shuffled) {
      if (selectedWords.length >= WORDS_PER_PUZZLE) break;

      // Try to place the word
      const shuffledDirections = [...DIRECTIONS].sort(() => Math.random() - 0.5);
      let placed = false;

      for (const direction of shuffledDirections) {
        if (placed) break;

        // Try random positions
        const attempts = 50;
        for (let attempt = 0; attempt < attempts; attempt++) {
          const startRow = Math.floor(Math.random() * GRID_SIZE);
          const startCol = Math.floor(Math.random() * GRID_SIZE);

          if (canPlaceWord(newGrid, wordObj.word, startRow, startCol, direction)) {
            const wordPositions = placeWord(newGrid, wordObj.word, startRow, startCol, direction);
            selectedWords.push(wordObj);
            positions.push({
              word: wordObj.word,
              positions: wordPositions
            });
            placed = true;
            break;
          }
        }
      }
    }

    // Fill remaining cells with random hiragana
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col] === null) {
          newGrid[row][col] = getRandomHiragana();
        }
      }
    }

    setGrid(newGrid);
    setWords(selectedWords);
    setWordPositions(positions);
    setFoundWords(new Set());
    setSelectedCells([]);
    setPuzzleComplete(false);
    setLastFoundWord(null);
    setTimerExpired(false);
    startTimer();
  }, [canPlaceWord, placeWord, getRandomHiragana, getFilteredWordList, startTimer]);

  useEffect(() => {
    generatePuzzle();
  }, [selectedCategories, generatePuzzle]); // Regenerate when categories change

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const newSelection = prev.filter(cat => cat !== 'all');
        if (newSelection.includes(category)) {
          // Remove if already selected
          return newSelection.filter(cat => cat !== category);
        } else {
          // Add to selection
          return [...newSelection, category];
        }
      });
    }
  };

  const getCategoryDisplayText = () => {
    if (selectedCategories.includes('all') || selectedCategories.length === 0) {
      return 'All Categories';
    }
    if (selectedCategories.length === 1) {
      return selectedCategories[0].charAt(0).toUpperCase() + selectedCategories[0].slice(1);
    }
    return `${selectedCategories.length} Categories`;
  };

  const getCellKey = (row, col) => `${row}-${col}`;

  const isCellInFoundWord = (row, col) => {
    for (const wp of wordPositions) {
      if (foundWords.has(wp.word)) {
        if (wp.positions.some(p => p.row === row && p.col === col)) {
          return true;
        }
      }
    }
    return false;
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(c => c.row === row && c.col === col);
  };

  const handleCellMouseDown = (row, col) => {
    if (timerExpired || puzzleComplete) return;
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row, col) => {
    if (!isSelecting) return;

    // Only allow straight lines (horizontal, vertical, diagonal)
    if (selectedCells.length > 0) {
      const first = selectedCells[0];

      // Check if this cell continues the line
      const dx = col - first.col;
      const dy = row - first.row;

      // Determine direction from first cell
      let isValid = false;
      if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
        // Valid direction - check if cell is on the line
        const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
        const stepY = dy === 0 ? 0 : dy / Math.abs(dy);

        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        if (first.col + stepX * steps === col && first.row + stepY * steps === row) {
          isValid = true;
        }
      }

      if (isValid) {
        // Build the line from first to current
        const newSelected = [];
        const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
        const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
        const steps = Math.max(Math.abs(dx), Math.abs(dy));

        for (let i = 0; i <= steps; i++) {
          newSelected.push({
            row: first.row + stepY * i,
            col: first.col + stepX * i
          });
        }
        setSelectedCells(newSelected);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    // Check if selection matches any word
    const selectedWord = selectedCells.map(c => grid[c.row][c.col]).join('');
    const reverseWord = selectedWord.split('').reverse().join('');

    for (const wordObj of words) {
      if (!foundWords.has(wordObj.word)) {
        if (selectedWord === wordObj.word || reverseWord === wordObj.word) {
          const newFound = new Set(foundWords);
          newFound.add(wordObj.word);
          setFoundWords(newFound);
          setLastFoundWord(wordObj);
          playCorrectSound();

          // Check if puzzle is complete
          if (newFound.size === words.length) {
            setPuzzleComplete(true);
            stopTimer();
          }
          break;
        }
      }
    }

    setSelectedCells([]);
  };

  const handleTouchStart = (e, row, col) => {
    e.preventDefault();
    handleCellMouseDown(row, col);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.row !== undefined) {
      handleCellMouseEnter(
        parseInt(element.dataset.row),
        parseInt(element.dataset.col)
      );
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  const handleLongPressStart = (wordObj) => {
    const timer = setTimeout(() => {
      setShowingKana(prev => new Set([...prev, wordObj.translation]));
      // Hide kana after 3 seconds
      setTimeout(() => {
        setShowingKana(prev => {
          const newSet = new Set(prev);
          newSet.delete(wordObj.translation);
          return newSet;
        });
      }, 3000);
    }, 500); // 500ms for long press detection
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleWordClick = (wordObj) => {
    speak(wordObj.word);
  };

  const handleSentenceClick = () => {
    if (lastFoundWord && lastFoundWord.example) {
      speak(lastFoundWord.example);
    }
  };

  // Show empty state if no words available
  if (availableWords.length === 0) {
    return (
      <div className="word-search">
        <div className="word-search-empty">
          <div className="word-search-empty-icon">🔍</div>
          <h3>No Words Yet!</h3>
          <p>Visit the Vocab Shop to buy word packs and play Word Search.</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="word-search">
      {showCategoryModal && (
        <div className="category-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>Select Categories</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="category-list">
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
          </div>
        </div>
      )}

      <div className="ws-timer-container">
        <div className="ws-timer-bar">
          <div
            className={`ws-timer-fill ${timeLeft <= 30 ? 'urgent' : ''}`}
            style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
          />
        </div>
        <span className={`ws-timer-text ${timeLeft <= 30 ? 'urgent' : ''}`}>{formatTime(timeLeft)}</span>
      </div>

      {timerExpired && !puzzleComplete && (
        <div className="puzzle-complete">
          <h3>Time's Up!</h3>
          <p>You found {foundWords.size} of {words.length} words.</p>
          <div className="puzzle-controls">
            <button className="new-puzzle-btn" onClick={generatePuzzle}>
              Try Again
            </button>
            <button
              className="category-icon-button"
              onClick={() => setShowCategoryModal(true)}
              title={`Categories: ${getCategoryDisplayText()}`}
            >
              ☰
            </button>
          </div>
        </div>
      )}

      <div className="word-list">
        {words.map((wordObj, index) => (
          <button
            key={index}
            className={`word-item ${foundWords.has(wordObj.word) ? 'found' : ''}`}
            onClick={() => handleWordClick(wordObj)}
            onMouseDown={() => handleLongPressStart(wordObj)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={() => handleLongPressStart(wordObj)}
            onTouchEnd={handleLongPressEnd}
            onTouchCancel={handleLongPressEnd}
          >
            {showingKana.has(wordObj.translation) ? wordObj.word : wordObj.translation}
          </button>
        ))}
      </div>

      <div
        className="puzzle-grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={getCellKey(rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
                className={`grid-cell ${
                  isCellInFoundWord(rowIndex, colIndex) ? 'found' : ''
                } ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''} font-${settings?.fontStyle || 'noto'}`}
                onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {lastFoundWord && lastFoundWord.example && !puzzleComplete && (
        <div className="found-word-sentence" onClick={handleSentenceClick}>
          <div className="sentence-jp">{lastFoundWord.example}</div>
          {lastFoundWord.exampleEN && (
            <div className="sentence-en">{lastFoundWord.exampleEN}</div>
          )}
        </div>
      )}

      {puzzleComplete && (
        <div className="puzzle-complete">
          <h3>Congratulations!</h3>
          <p>You found all the words!</p>
          <div className="puzzle-controls">
            <button className="new-puzzle-btn" onClick={generatePuzzle}>
              New Puzzle
            </button>
            <button 
              className="category-icon-button"
              onClick={() => setShowCategoryModal(true)}
              title={`Categories: ${getCategoryDisplayText()}`}
            >
              ☰
            </button>
          </div>
        </div>
      )}

      {!puzzleComplete && (
        <div className="puzzle-controls">
          <button className="new-puzzle-btn" onClick={generatePuzzle}>
            New Puzzle
          </button>
          <button 
            className="category-icon-button"
            onClick={() => setShowCategoryModal(true)}
            title={`Categories: ${getCategoryDisplayText()}`}
          >
            ☰
          </button>
        </div>
      )}
    </div>
  );
}

export default WordSearch;
