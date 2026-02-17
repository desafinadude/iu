import React, { useState, useEffect, useCallback, useRef } from 'react';
import { kanjiData, kanjiWithKunyomi } from '../data/kanjiData';
import { speak } from '../utils/speech';
import { shuffle } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import ResultsModal from './ResultsModal';
import StreakFlash, { useStreakFlash } from './StreakFlash';
import { STAR_THRESHOLD } from '../utils/progressHelpers';
import '../styles/KanaQuiz.css';

const TIMER_DURATION = 12;
const MAX_LIVES = 3;
const NUM_OPTIONS = 4;

const MODES = [
  { id: 'meaning', label: 'Meaning', desc: 'See kanji → pick the meaning' },
  { id: 'reverse', label: 'Reverse', desc: 'See meaning → pick the kanji' },
  { id: 'onyomi', label: 'On-yomi', desc: 'See kanji → pick the on-reading' },
  { id: 'kunyomi', label: 'Kun-yomi', desc: 'See kanji → pick the kun-reading' },
  { id: 'mixed', label: 'Mixed', desc: 'All modes shuffled together' },
];

function pickWeightedKanji(deck, getWeight) {
  const weighted = deck.map(k => ({ ...k, w: getWeight ? getWeight(k.char) : 1 }));
  const total = weighted.reduce((s, k) => s + k.w, 0);
  let r = Math.random() * total;
  for (const k of weighted) {
    r -= k.w;
    if (r <= 0) return k;
  }
  return weighted[weighted.length - 1];
}

function buildOptions(correct, pool, field, count = NUM_OPTIONS) {
  const others = shuffle(pool.filter(k => k[field] !== correct[field])).slice(0, count - 1);
  return shuffle([correct, ...others]);
}

function KanjiQuiz({ onAnswerRecorded, getKanjiWeight }) {
  const [quizMode, setQuizMode] = useState(null);
  const [currentSubMode, setCurrentSubMode] = useState(null);
  const [currentKanji, setCurrentKanji] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [roundEvents, setRoundEvents] = useState([]);
  const timerRef = useRef(null);
  const { flash, showProgress, showReset } = useStreakFlash();

  const getActiveDeck = useCallback((mode) => {
    if (mode === 'kunyomi') return kanjiWithKunyomi;
    return kanjiData;
  }, []);

  const pickSubMode = useCallback(() => {
    const subs = ['meaning', 'reverse', 'onyomi', 'kunyomi'];
    return subs[Math.floor(Math.random() * subs.length)];
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); timerRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const generateQuestion = useCallback((mode) => {
    const activeMode = mode || quizMode;
    const sub = activeMode === 'mixed' ? pickSubMode() : activeMode;
    setCurrentSubMode(sub);

    const deck = getActiveDeck(sub);
    if (deck.length < NUM_OPTIONS) return;

    const correct = pickWeightedKanji(deck, getKanjiWeight ? (char) => getKanjiWeight(char, sub) : null);

    let opts;
    if (sub === 'meaning') {
      opts = buildOptions(correct, deck, 'meanings[0]' /* dummy, we build manually */);
      // build meaning options manually
      const wrongKanji = shuffle(deck.filter(k => k.char !== correct.char)).slice(0, NUM_OPTIONS - 1);
      opts = shuffle([correct, ...wrongKanji]);
    } else if (sub === 'reverse') {
      const wrongKanji = shuffle(deck.filter(k => k.char !== correct.char)).slice(0, NUM_OPTIONS - 1);
      opts = shuffle([correct, ...wrongKanji]);
    } else if (sub === 'onyomi') {
      const wrongKanji = shuffle(deck.filter(k => k.onyomi !== correct.onyomi)).slice(0, NUM_OPTIONS - 1);
      opts = shuffle([correct, ...wrongKanji]);
    } else { // kunyomi
      const wrongKanji = shuffle(deck.filter(k => k.char !== correct.char && k.kunyomi)).slice(0, NUM_OPTIONS - 1);
      opts = shuffle([correct, ...wrongKanji]);
    }

    setCurrentKanji(correct);
    setOptions(opts);
    setSelectedAnswer(null);
    setShowResult(false);
    startTimer();

    // Speak kanji for meaning/onyomi/kunyomi modes
    if (sub !== 'reverse') {
      speak(correct.char);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizMode, pickSubMode, getActiveDeck, startTimer, getKanjiWeight]);

  useEffect(() => { return () => stopTimer(); }, [stopTimer]);

  useEffect(() => {
    if (hasStarted && !gameOver && quizMode) {
      generateQuestion(quizMode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, gameOver]);

  // Timer expiry
  useEffect(() => {
    if (timeLeft === 0 && !showResult && currentKanji && !gameOver) {
      setShowResult(true);
      playWrongSound();
      speak(currentKanji.char);

      if (onAnswerRecorded) {
        const result = onAnswerRecorded(currentKanji.char, false, currentSubMode);
        if (result.streakLost) {
          showReset(STAR_THRESHOLD);
          setRoundEvents(prev => [...prev, { kana: currentKanji.char, type: 'reset', lostStreak: result.lostStreak }]);
        }
      }

      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) setGameOver(true);
    }
  }, [timeLeft, showResult, currentKanji, lives, gameOver, onAnswerRecorded, currentSubMode, showReset]);

  const handleAnswer = (option) => {
    if (showResult || !currentKanji || gameOver) return;
    stopTimer();
    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option.char === currentKanji.char;

    if (onAnswerRecorded) {
      const result = onAnswerRecorded(currentKanji.char, isCorrect, currentSubMode);
      if (result.starEarned) {
        setRoundEvents(prev => [...prev, { kana: currentKanji.char, type: 'star' }]);
      } else if (isCorrect && result.newConsecutive > 0) {
        showProgress(result.newConsecutive, STAR_THRESHOLD);
      } else if (result.streakLost) {
        showReset(STAR_THRESHOLD);
        setRoundEvents(prev => [...prev, { kana: currentKanji.char, type: 'reset', lostStreak: result.lostStreak }]);
      }
    }

    if (isCorrect) {
      setScore(s => s + 1);
      playCorrectSound();
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      playWrongSound();
      if (newLives <= 0) setGameOver(true);
    }

    speak(currentKanji.char);
  };

  const handleNext = () => {
    if (gameOver) return;
    setQuestionNumber(n => n + 1);
    generateQuestion(quizMode);
  };

  const handlePlayAgain = () => {
    setQuestionNumber(0);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setHasStarted(false);
    setRoundEvents([]);
  };

  const handleBackToModes = () => {
    stopTimer();
    setQuizMode(null);
    setHasStarted(false);
    setGameOver(false);
    setQuestionNumber(0);
    setScore(0);
    setLives(MAX_LIVES);
    setRoundEvents([]);
    setCurrentKanji(null);
  };

  const isCorrect = selectedAnswer?.char === currentKanji?.char;

  // ── Mode selection screen ───────────────────────────────────────────────────
  if (!quizMode) {
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>Kanji Quiz</h2>
          <p>Choose your mode</p>
          <div className="mode-selector">
            {MODES.map(mode => (
              <button
                key={mode.id}
                className="mode-button"
                onClick={() => setQuizMode(mode.id)}
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

  // ── Start screen ────────────────────────────────────────────────────────────
  if (!hasStarted) {
    const modeInfo = MODES.find(m => m.id === quizMode);
    return (
      <div className="kana-quiz">
        <div className="quiz-instructions">
          <h2>{modeInfo.label} Mode</h2>
          <p>{modeInfo.desc}</p>
          <button className="start-button" onClick={() => setHasStarted(true)}>START</button>
          <button className="back-to-modes-button" onClick={handleBackToModes}>Back</button>
        </div>
      </div>
    );
  }

  if (!currentKanji) return <div className="quiz-loading">Loading...</div>;

  const getModeLabel = () => {
    if (quizMode !== 'mixed') return null;
    const labels = { meaning: 'MEANING', reverse: 'REVERSE', onyomi: 'ON-YOMI', kunyomi: 'KUN-YOMI' };
    return labels[currentSubMode] || null;
  };
  const modeLabel = getModeLabel();

  // What to show in the question area
  const renderQuestion = () => {
    if (currentSubMode === 'reverse') {
      // Show English meaning, pick kanji
      return (
        <div className="character-display" style={{ fontSize: 'min(24px, 5vw)', padding: '12px 20px' }}>
          {currentKanji.meanings[0]}
        </div>
      );
    }
    // Show kanji character (meaning / onyomi / kunyomi modes)
    return (
      <button className="speaker-button" onClick={() => speak(currentKanji.char)} title="Tap to hear">
        {currentKanji.char}
      </button>
    );
  };

  // What label to show in each option button
  const getOptionLabel = (option) => {
    if (currentSubMode === 'meaning') return option.meanings[0];
    if (currentSubMode === 'reverse') return option.char;
    if (currentSubMode === 'onyomi') return option.onyomi;
    if (currentSubMode === 'kunyomi') return option.kunyomi;
    return option.char;
  };

  // Prompt text shown below the question
  const getPrompt = () => {
    if (currentSubMode === 'meaning') return 'Pick the meaning';
    if (currentSubMode === 'reverse') return 'Pick the kanji';
    if (currentSubMode === 'onyomi') return 'Pick the on-yomi';
    if (currentSubMode === 'kunyomi') return 'Pick the kun-yomi';
    return '';
  };

  return (
    <div className="kana-quiz">
      <StreakFlash flash={flash} />

      {gameOver && (
        <ResultsModal
          score={score}
          questionsAnswered={questionNumber + 1}
          onPlayAgain={handlePlayAgain}
          quizType={quizMode === 'mixed' ? 'Mixed Kanji' : MODES.find(m => m.id === quizMode)?.label + ' Kanji'}
          roundEvents={roundEvents}
        />
      )}

      <div className="quiz-question">
        <div className="timer-lives-row">
          <div className="question-number">{questionNumber + 1}</div>
          {modeLabel && <div className="mode-badge">{modeLabel}</div>}
          <div className="lives-display">
            {'\u2764\uFE0F'.repeat(lives)}{'\uD83D\uDDA4'.repeat(MAX_LIVES - lives)}
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

        {renderQuestion()}

        {!showResult && (
          <div className="question-prompt" style={{ position: 'static', transform: 'none', marginTop: '4px', fontSize: '12px' }}>
            {getPrompt()}
          </div>
        )}

        {showResult && (
          <div className="kanji-with-reading" style={{ marginTop: '6px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            <div><strong>{currentKanji.char}</strong> — {currentKanji.meanings[0]}</div>
            <div>音: {currentKanji.onyomi}{currentKanji.kunyomi ? `　訓: ${currentKanji.kunyomi}` : ''}</div>
          </div>
        )}
      </div>

      <div className="options-grid" style={{ gridTemplateRows: 'repeat(2, 1fr)', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {options.map((option, index) => {
          const isSelected = selectedAnswer?.char === option.char;
          const isCorrectOpt = option.char === currentKanji.char;
          let cls = 'option-button';
          if (showResult) {
            if (isCorrectOpt) cls += ' correct';
            else if (isSelected) cls += ' wrong';
          }
          const label = getOptionLabel(option);
          const isKanjiLabel = currentSubMode === 'reverse';
          return (
            <button
              key={index}
              className={`${cls}${isKanjiLabel ? '' : ' romaji'}`}
              style={isKanjiLabel ? { fontSize: 'min(40px, 9vw)' } : { fontSize: 'min(16px, 3.5vw)', lineHeight: 1.2 }}
              onClick={() => handleAnswer(option)}
              disabled={showResult || gameOver}
            >
              {label}
            </button>
          );
        })}
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

export default KanjiQuiz;
