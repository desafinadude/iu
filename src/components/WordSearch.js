import React, { useState, useCallback, useEffect } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { playCorrectSound } from '../utils/soundEffects';
import '../styles/WordSearch.css';

// Word list for word search - short words work best
const WORD_LIST = [
  { word: 'いぬ', translation: 'Dog' },
  { word: 'ねこ', translation: 'Cat' },
  { word: 'あめ', translation: 'Rain' },
  { word: 'そら', translation: 'Sky' },
  { word: 'やま', translation: 'Mountain' },
  { word: 'うみ', translation: 'Sea' },
  { word: 'はな', translation: 'Flower' },
  { word: 'とり', translation: 'Bird' },
  { word: 'さかな', translation: 'Fish' },
  { word: 'みず', translation: 'Water' },
  { word: 'ほん', translation: 'Book' },
  { word: 'いえ', translation: 'House' },
  { word: 'あお', translation: 'Blue' },
  { word: 'あか', translation: 'Red' },
  { word: 'つき', translation: 'Moon' },
  { word: 'ゆき', translation: 'Snow' },
  { word: 'かぜ', translation: 'Wind' },
  { word: 'くも', translation: 'Cloud' },
  { word: 'ひと', translation: 'Person' },
  { word: 'あさ', translation: 'Morning' },
];

const GRID_SIZE = 8;
const WORDS_PER_PUZZLE = 5;

// Directions: right, down, diagonal down-right
const DIRECTIONS = [
  { dx: 1, dy: 0 },  // right
  { dx: 0, dy: 1 },  // down
  { dx: 1, dy: 1 },  // diagonal down-right
];

function WordSearch() {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);
  const [wordPositions, setWordPositions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);

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
  }, [canPlaceWord, placeWord, getRandomHiragana]);

  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

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
          playCorrectSound();

          // Check if puzzle is complete
          if (newFound.size === words.length) {
            setPuzzleComplete(true);
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

  return (
    <div className="word-search">
      <div className="word-search-header">
        <h2>Word Search</h2>
        <p>Find the hidden Japanese words!</p>
      </div>

      <div className="word-list">
        {words.map((wordObj, index) => (
          <div
            key={index}
            className={`word-item ${foundWords.has(wordObj.word) ? 'found' : ''}`}
          >
            <span className="word-japanese">{wordObj.word}</span>
            <span className="word-translation">{wordObj.translation}</span>
          </div>
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
                } ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''}`}
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

      {puzzleComplete && (
        <div className="puzzle-complete">
          <h3>Congratulations!</h3>
          <p>You found all the words!</p>
          <button className="new-puzzle-btn" onClick={generatePuzzle}>
            New Puzzle
          </button>
        </div>
      )}

      {!puzzleComplete && (
        <button className="new-puzzle-btn" onClick={generatePuzzle}>
          New Puzzle
        </button>
      )}
    </div>
  );
}

export default WordSearch;
