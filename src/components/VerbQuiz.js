import React, { useState, useCallback, useMemo } from 'react';
import {
  verbData,
  FORM_LABELS,
  ALL_FORM_IDS,
  POLITE_FORMS,
  PLAIN_FORMS,
  TE_FORMS,
  TYPE_COLORS,
} from '../data/verbData';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import '../styles/VerbQuiz.css';

// ── helpers ──────────────────────────────────────────────────────────────────

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(verbs, formIds) {
  const cards = [];
  verbs.forEach((verb, vi) => {
    formIds.forEach(formId => {
      cards.push({ verbIndex: vi, formId });
    });
  });
  return shuffleArray(cards);
}

function getFormIdsFromFilter(filter) {
  if (filter === 'polite') return POLITE_FORMS;
  if (filter === 'plain') return PLAIN_FORMS;
  if (filter === 'te') return TE_FORMS;
  return ALL_FORM_IDS;
}

function getVerbsByType(typeFilter, allVerbs) {
  if (typeFilter === 'all') return allVerbs;
  if (typeFilter === 'adjective') return allVerbs.filter(v => v.type === 'i-adjective' || v.type === 'na-adjective');
  return allVerbs.filter(v => v.type === typeFilter);
}

// Build 4 multiple-choice options for a given verb + form (all kanji answers)
function buildMultipleChoiceOptions(correctVerb, formId, filteredVerbs) {
  const correct = correctVerb.forms[formId].kanji;
  const pool = filteredVerbs
    .filter(v => v !== correctVerb && v.forms[formId])
    .map(v => v.forms[formId].kanji)
    .filter(k => k !== correct);
  const wrong = shuffleArray(pool).slice(0, 3);
  return shuffleArray([correct, ...wrong]);
}

// ── sub-components ───────────────────────────────────────────────────────────

function TypeTag({ type }) {
  const colors = TYPE_COLORS[type] || {};
  return (
    <span
      className="verb-type-tag"
      style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
    >
      {colors.label || type}
    </span>
  );
}

function VerbCard({ verb, formId, formLabel }) {
  return (
    <div className="verb-card">
      <div className="verb-card-top">
        <TypeTag type={verb.type} />
        <div className="verb-dict-form">{verb.verb}</div>
        <div className="verb-hiragana">{verb.hiragana}</div>
        <div className="verb-meaning">{verb.meaning}</div>
      </div>
      {formLabel && (
        <div className="verb-card-prompt">
          <span className="verb-prompt-label">What is the</span>
          <span className="verb-prompt-form">{formLabel}</span>
          <span className="verb-prompt-label">form?</span>
        </div>
      )}
    </div>
  );
}

function AnswerReveal({ verb, formId }) {
  const form = verb.forms[formId];
  return (
    <div className="verb-answer-reveal">
      <div className="verb-answer-kanji">{form.kanji}</div>
      <div className="verb-answer-romaji">{form.romaji}</div>
    </div>
  );
}

// ── Config Screen ─────────────────────────────────────────────────────────────

function ConfigScreen({ onStart }) {
  const [quizMode, setQuizMode] = useState('challenge');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');

  const MODES = [
    { id: 'flashcard', label: 'Flashcard', desc: 'Flip to see all forms' },
    { id: 'challenge', label: 'Challenge', desc: 'Recall & self-rate' },
    { id: 'multipleChoice', label: 'Multiple Choice', desc: 'Pick the correct form' },
  ];

  const TYPE_FILTERS = [
    { id: 'all', label: 'All types' },
    { id: 'ichidan', label: 'Ichidan' },
    { id: 'godan', label: 'Godan' },
    { id: 'irregular', label: 'Irregular' },
    { id: 'adjective', label: 'Adjectives' },
  ];

  const FORM_FILTERS = [
    { id: 'all', label: 'All forms' },
    { id: 'polite', label: 'Polite only' },
    { id: 'plain', label: 'Plain only' },
    { id: 'te', label: 'て-form only' },
  ];

  const verbCount = getVerbsByType(typeFilter, verbData).length;

  return (
    <div className="verb-config">
      <h2 className="verb-config-title">Verb Quiz</h2>

      <div className="verb-config-section">
        <div className="verb-config-section-label">Mode</div>
        <div className="verb-mode-grid">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`verb-mode-btn ${quizMode === m.id ? 'active' : ''}`}
              onClick={() => setQuizMode(m.id)}
            >
              <span className="verb-mode-btn-label">{m.label}</span>
              <span className="verb-mode-btn-desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="verb-config-section">
        <div className="verb-config-section-label">Verb type</div>
        <div className="verb-filter-row">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.id}
              className={`verb-filter-btn ${typeFilter === f.id ? 'active' : ''}`}
              onClick={() => setTypeFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="verb-config-section">
        <div className="verb-config-section-label">Forms to drill</div>
        <div className="verb-filter-row">
          {FORM_FILTERS.map(f => (
            <button
              key={f.id}
              className={`verb-filter-btn ${formFilter === f.id ? 'active' : ''}`}
              onClick={() => setFormFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="verb-config-summary">
        {verbCount} verb{verbCount !== 1 ? 's' : ''} selected
      </div>

      <button
        className="verb-start-btn"
        onClick={() => onStart({ quizMode, typeFilter, formFilter })}
        disabled={verbCount === 0}
      >
        START
      </button>
    </div>
  );
}

// ── Flashcard Mode ─────────────────────────────────────────────────────────────

function FlashcardMode({ deck, verbs, onResult, onFinish, progress }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const card = deck[cardIndex];
  const verb = verbs[card.verbIndex];

  const handleFlip = () => {
    if (!flipped) setFlipped(true);
  };

  const handleRate = (correct) => {
    if (isAnimating) return;
    setIsAnimating(true);
    onResult(correct);
    if (correct) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    setTimeout(() => {
      if (cardIndex + 1 >= deck.length) {
        onFinish();
      } else {
        setCardIndex(i => i + 1);
        setFlipped(false);
        setIsAnimating(false);
      }
    }, 300);
  };

  return (
    <div className="verb-quiz-screen">
      <div className="verb-progress-bar-wrap">
        <div className="verb-progress-bar-fill" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
      </div>
      <div className="verb-progress-text">{progress.done} / {progress.total}</div>

      <div className={`verb-flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="verb-flashcard-front">
          <TypeTag type={verb.type} />
          <div className="verb-dict-form">{verb.verb}</div>
          <div className="verb-hiragana">{verb.hiragana}</div>
          <div className="verb-meaning">{verb.meaning}</div>
          {!flipped && <div className="verb-tap-hint">Tap to reveal all forms</div>}
        </div>
        {flipped && (
          <div className="verb-flashcard-back">
            <div className="verb-forms-grid">
              {ALL_FORM_IDS.map(fid => (
                <div key={fid} className="verb-form-row">
                  <span className="verb-form-row-label">{FORM_LABELS[fid]}</span>
                  <span className="verb-form-row-kanji">{verb.forms[fid].kanji}</span>
                  <span className="verb-form-row-romaji">{verb.forms[fid].romaji}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {flipped && (
        <div className="verb-rate-buttons">
          <button className="verb-rate-btn wrong" onClick={() => handleRate(false)}>
            ✗ Again
          </button>
          <button className="verb-rate-btn correct" onClick={() => handleRate(true)}>
            ✓ Got it
          </button>
        </div>
      )}
    </div>
  );
}

// ── Challenge Mode ─────────────────────────────────────────────────────────────

function ChallengeMode({ initialDeck, verbs, onFinish, progress: initialProgress }) {
  const [queue, setQueue] = useState(initialDeck);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState({ correct: 0, total: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [done, setDone] = useState(0);

  const card = queue[cardIndex];
  const verb = verbs[card.verbIndex];
  const formLabel = FORM_LABELS[card.formId];

  const handleReveal = () => setRevealed(true);

  const handleRate = (correct) => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (correct) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    setResults(r => ({ correct: r.correct + (correct ? 1 : 0), total: r.total + 1 }));
    const nextDone = done + 1;
    setDone(nextDone);

    if (!correct) {
      // Reinsert the card ~5 positions later
      const newQueue = [...queue];
      const insertAt = Math.min(cardIndex + 1 + Math.floor(Math.random() * 4 + 2), newQueue.length);
      newQueue.splice(insertAt, 0, { ...card });
      setTimeout(() => {
        setQueue(newQueue);
        setCardIndex(i => i + 1);
        setRevealed(false);
        setIsAnimating(false);
      }, 350);
    } else {
      setTimeout(() => {
        if (cardIndex + 1 >= queue.length) {
          onFinish(results.correct + (correct ? 1 : 0), results.total + 1, nextDone);
        } else {
          setCardIndex(i => i + 1);
          setRevealed(false);
          setIsAnimating(false);
        }
      }, 350);
    }
  };

  const totalInDeck = initialProgress.total;
  const progressPct = Math.min((done / totalInDeck) * 100, 100);

  return (
    <div className="verb-quiz-screen">
      <div className="verb-progress-bar-wrap">
        <div className="verb-progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="verb-progress-text">{done} / {totalInDeck}</div>

      <VerbCard verb={verb} formId={card.formId} formLabel={formLabel} />

      {!revealed ? (
        <button className="verb-reveal-btn" onClick={handleReveal}>
          Reveal
        </button>
      ) : (
        <>
          <AnswerReveal verb={verb} formId={card.formId} />
          <div className="verb-rate-buttons">
            <button className="verb-rate-btn wrong" onClick={() => handleRate(false)}>
              ✗ Try again
            </button>
            <button className="verb-rate-btn correct" onClick={() => handleRate(true)}>
              ✓ Got it
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Multiple Choice Mode ───────────────────────────────────────────────────────

function MultipleChoiceMode({ deck, verbs, filteredVerbs, onResult, onFinish, progress }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const card = deck[cardIndex];
  const verb = verbs[card.verbIndex];
  const formLabel = FORM_LABELS[card.formId];
  const correctKanji = verb.forms[card.formId].kanji;

  const options = useMemo(
    () => buildMultipleChoiceOptions(verb, card.formId, filteredVerbs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardIndex]
  );

  const handleSelect = (option) => {
    if (selected || isAnimating) return;
    setSelected(option);
    const correct = option === correctKanji;
    if (correct) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    onResult(correct);
    setIsAnimating(true);
    setTimeout(() => {
      if (cardIndex + 1 >= deck.length) {
        onFinish();
      } else {
        setCardIndex(i => i + 1);
        setSelected(null);
        setIsAnimating(false);
      }
    }, 900);
  };

  return (
    <div className="verb-quiz-screen">
      <div className="verb-progress-bar-wrap">
        <div className="verb-progress-bar-fill" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
      </div>
      <div className="verb-progress-text">{progress.done} / {progress.total}</div>

      <VerbCard verb={verb} formId={card.formId} formLabel={formLabel} />

      <div className="verb-mc-options">
        {options.map((opt, i) => {
          let cls = 'verb-mc-btn';
          if (selected) {
            if (opt === correctKanji) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(opt)} disabled={!!selected}>
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="verb-mc-romaji">
          {verb.forms[card.formId].romaji}
        </div>
      )}
    </div>
  );
}

// ── Summary Screen ─────────────────────────────────────────────────────────────

function SummaryScreen({ correct, total, onPlayAgain, onBack }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="verb-summary">
      <div className="verb-summary-title">Session complete!</div>
      <div className="verb-summary-score">{pct}%</div>
      <div className="verb-summary-detail">{correct} / {total} correct</div>
      <div className="verb-summary-buttons">
        <button className="verb-start-btn" onClick={onPlayAgain}>Play again</button>
        <button className="back-to-modes-button" onClick={onBack}>Change settings</button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

function VerbQuiz() {
  const [phase, setPhase] = useState('config'); // config | quiz | summary
  const [config, setConfig] = useState(null);
  const [deck, setDeck] = useState([]);
  const [filteredVerbs, setFilteredVerbs] = useState([]);
  const [sessionResults, setSessionResults] = useState({ correct: 0, total: 0 });
  // For flashcard/multipleChoice simple tracking
  const [mcResults, setMcResults] = useState({ correct: 0, total: 0 });

  const handleStart = useCallback(({ quizMode, typeFilter, formFilter }) => {
    const verbs = getVerbsByType(typeFilter, verbData);
    const formIds = getFormIdsFromFilter(formFilter);
    const newDeck = buildDeck(verbs, formIds);
    setConfig({ quizMode, typeFilter, formFilter, verbs, formIds });
    setDeck(newDeck);
    setFilteredVerbs(verbs);
    setMcResults({ correct: 0, total: 0 });
    setSessionResults({ correct: 0, total: 0 });
    setPhase('quiz');
  }, []);

  const handleFinish = useCallback((correct, total) => {
    setSessionResults({ correct: correct ?? mcResults.correct, total: total ?? mcResults.total });
    setPhase('summary');
  }, [mcResults]);

  const handleChallengeFinish = useCallback((correct, total) => {
    setSessionResults({ correct, total });
    setPhase('summary');
  }, []);

  const handlePlayAgain = () => {
    handleStart(config);
  };

  const handleBack = () => {
    setPhase('config');
  };

  if (phase === 'config') {
    return <ConfigScreen onStart={handleStart} />;
  }

  if (phase === 'summary') {
    return (
      <SummaryScreen
        correct={sessionResults.correct}
        total={sessionResults.total}
        onPlayAgain={handlePlayAgain}
        onBack={handleBack}
      />
    );
  }

  const { quizMode, verbs } = config;
  const progress = { done: mcResults.total, total: deck.length };

  if (quizMode === 'flashcard') {
    return (
      <FlashcardMode
        deck={deck}
        verbs={verbs}
        onResult={(correct) => setMcResults(r => ({ correct: r.correct + (correct ? 1 : 0), total: r.total + 1 }))}
        onFinish={() => handleFinish(mcResults.correct, mcResults.total)}
        progress={progress}
      />
    );
  }

  if (quizMode === 'challenge') {
    return (
      <ChallengeMode
        initialDeck={deck}
        verbs={verbs}
        onFinish={handleChallengeFinish}
        progress={{ total: deck.length }}
      />
    );
  }

  if (quizMode === 'multipleChoice') {
    return (
      <MultipleChoiceMode
        deck={deck}
        verbs={verbs}
        filteredVerbs={filteredVerbs}
        onResult={(correct) => setMcResults(r => ({ correct: r.correct + (correct ? 1 : 0), total: r.total + 1 }))}
        onFinish={() => handleFinish(mcResults.correct, mcResults.total)}
        progress={progress}
      />
    );
  }

  return null;
}

export default VerbQuiz;
