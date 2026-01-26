import React, { useState, useCallback } from 'react';
import { shuffle } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';
import {
  CARD_TYPES,
  VALID_TRANSITIONS,
  VALID_ENDINGS,
  buildDeck,
  validateSentence,
  scoreSentence,
  EXAMPLE_SENTENCES,
} from '../data/cardGameData';
import '../styles/CardGame.css';

const TARGET_SCORE = 20;
const HAND_SIZE = 7;

function CardGame() {
  const [gameState, setGameState] = useState('start'); // start, playing, gameover
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [sentence, setSentence] = useState([]);
  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(0);
  const [completedSentences, setCompletedSentences] = useState([]);
  const [lastSentence, setLastSentence] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [scorePopup, setScorePopup] = useState(null);
  const [discardMode, setDiscardMode] = useState(false);
  const [markedForDiscard, setMarkedForDiscard] = useState(new Set());

  const drawCards = useCallback((currentDeck, currentHand, count) => {
    const needed = Math.min(count, currentDeck.length);
    const drawn = currentDeck.slice(0, needed);
    const remaining = currentDeck.slice(needed);
    return {
      newHand: [...currentHand, ...drawn],
      newDeck: remaining,
    };
  }, []);

  const startGame = useCallback(() => {
    const newDeck = shuffle(buildDeck());
    const { newHand, newDeck: remaining } = drawCards(newDeck, [], HAND_SIZE);
    setDeck(remaining);
    setHand(newHand);
    setSentence([]);
    setScore(0);
    setTurn(1);
    setCompletedSentences([]);
    setLastSentence(null);
    setScorePopup(null);
    setDiscardMode(false);
    setMarkedForDiscard(new Set());
    setGameState('playing');
  }, [drawCards]);

  const playCardFromHand = (cardIndex) => {
    if (discardMode) {
      // Toggle discard mark
      const newMarked = new Set(markedForDiscard);
      const cardId = hand[cardIndex].id;
      if (newMarked.has(cardId)) {
        newMarked.delete(cardId);
      } else {
        newMarked.add(cardId);
      }
      setMarkedForDiscard(newMarked);
      return;
    }

    const card = hand[cardIndex];

    // Check if this card type is valid after the last card in sentence
    const prevType = sentence.length === 0 ? 'start' : sentence[sentence.length - 1].type;
    const allowed = VALID_TRANSITIONS[prevType];
    if (!allowed || !allowed.includes(card.type)) {
      playWrongSound();
      return;
    }

    const newHand = [...hand];
    newHand.splice(cardIndex, 1);
    setHand(newHand);
    setSentence([...sentence, card]);
  };

  const returnCardToHand = (cardIndex) => {
    if (discardMode) return;

    // Only allow removing from end of sentence
    if (cardIndex !== sentence.length - 1) return;

    const card = sentence[cardIndex];
    const newSentence = [...sentence];
    newSentence.splice(cardIndex, 1);
    setSentence(newSentence);
    setHand([...hand, card]);
  };

  const clearSentence = () => {
    setHand([...hand, ...sentence]);
    setSentence([]);
  };

  const submitSentence = () => {
    const result = validateSentence(sentence);
    if (!result.valid) {
      playWrongSound();
      return;
    }

    const pts = scoreSentence(sentence);
    const newScore = score + pts;

    playCorrectSound();

    // Show score popup
    setScorePopup(pts);
    setTimeout(() => setScorePopup(null), 1200);

    // Build sentence text
    const sentenceText = sentence.map(c => c.word).join(' ');
    const sentenceMeaning = sentence.map(c => c.meaning).join(' ');

    const completedEntry = {
      text: sentenceText,
      meaning: sentenceMeaning,
      points: pts,
    };

    setLastSentence(completedEntry);
    setCompletedSentences(prev => [...prev, completedEntry]);

    // Draw new cards
    const { newHand, newDeck } = drawCards(deck, hand, HAND_SIZE - hand.length);
    setHand(newHand);
    setDeck(newDeck);
    setSentence([]);
    setScore(newScore);
    setTurn(t => t + 1);
    setDiscardMode(false);
    setMarkedForDiscard(new Set());

    // Check win or deck empty
    if (newScore >= TARGET_SCORE) {
      setTimeout(() => setGameState('gameover'), 800);
    } else if (newDeck.length === 0 && newHand.length === 0) {
      setTimeout(() => setGameState('gameover'), 800);
    }
  };

  const confirmDiscard = () => {
    if (markedForDiscard.size === 0) return;

    const keptCards = hand.filter(c => !markedForDiscard.has(c.id));
    const discardCount = hand.length - keptCards.length;
    const { newHand, newDeck } = drawCards(deck, keptCards, discardCount);

    setHand(newHand);
    setDeck(newDeck);
    setDiscardMode(false);
    setMarkedForDiscard(new Set());
    setTurn(t => t + 1);

    // If deck ran out
    if (newDeck.length === 0 && newHand.length === 0) {
      setTimeout(() => setGameState('gameover'), 500);
    }
  };

  const cancelDiscard = () => {
    setDiscardMode(false);
    setMarkedForDiscard(new Set());
  };

  const getValidation = () => {
    if (sentence.length === 0) return null;
    return validateSentence(sentence);
  };

  const canSubmit = () => {
    if (sentence.length < 2) return false;
    const result = validateSentence(sentence);
    return result.valid;
  };

  const getNextAllowedTypes = () => {
    if (sentence.length === 0) return VALID_TRANSITIONS.start;
    const lastType = sentence[sentence.length - 1].type;
    return VALID_TRANSITIONS[lastType] || [];
  };

  const isCardPlayable = (card) => {
    if (discardMode) return true;
    const allowed = getNextAllowedTypes();
    return allowed.includes(card.type);
  };

  const canEndHere = () => {
    if (sentence.length < 2) return false;
    const lastType = sentence[sentence.length - 1].type;
    return VALID_ENDINGS.includes(lastType);
  };

  // --- RENDER ---

  if (gameState === 'start') {
    return (
      <div className="card-game">
        <div className="cg-start-screen">
          <div className="cg-start-title">Sentence Builder</div>
          <div className="cg-start-title-jp">文カードゲーム</div>
          <p className="cg-start-desc">
            Build Japanese sentences using color-coded cards.
            Each card is a different part of speech. Combine them
            in the right order to form valid sentences and score points.
            Reach {TARGET_SCORE} points to win!
          </p>
          <button className="cg-btn cg-btn-start" onClick={startGame}>
            Play
          </button>
          <span className="cg-start-rules" onClick={() => setShowHelp(true)}>
            How to play
          </span>
        </div>
        {showHelp && renderHelpModal()}
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="card-game">
        <div className="cg-game-over">
          <div className="cg-game-over-content">
            <div className="cg-game-over-title">
              {score >= TARGET_SCORE ? 'You Win!' : 'Game Over'}
            </div>
            <div className="cg-game-over-subtitle">
              {score >= TARGET_SCORE
                ? `You reached ${TARGET_SCORE} points!`
                : 'The deck ran out!'}
            </div>

            <div className="cg-game-over-stats">
              <div className="cg-stat">
                <div className="cg-stat-value">{score}</div>
                <div className="cg-stat-label">Points</div>
              </div>
              <div className="cg-stat">
                <div className="cg-stat-value">{completedSentences.length}</div>
                <div className="cg-stat-label">Sentences</div>
              </div>
              <div className="cg-stat">
                <div className="cg-stat-value">{turn - 1}</div>
                <div className="cg-stat-label">Turns</div>
              </div>
            </div>

            {completedSentences.length > 0 && (
              <div className="cg-game-over-sentences">
                {completedSentences.map((s, i) => (
                  <div key={i} className="cg-completed-sentence">
                    <span className="cg-completed-sentence-jp">{s.text}</span>
                    {' '}
                    <span className="cg-completed-sentence-en">({s.meaning})</span>
                    {' '}
                    <span className="cg-completed-sentence-pts">+{s.points}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="cg-btn cg-btn-play-again" onClick={startGame}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validation = getValidation();
  const validClass = validation
    ? validation.valid ? 'valid' : (canEndHere() ? '' : 'invalid')
    : '';

  function renderHelpModal() {
    return (
      <div className="cg-modal-overlay" onClick={() => setShowHelp(false)}>
        <div className="cg-modal" onClick={e => e.stopPropagation()}>
          <h2>How to Play</h2>

          <h3>Goal</h3>
          <p>Reach {TARGET_SCORE} points by building valid Japanese sentences from cards in your hand.</p>

          <h3>Card Types</h3>
          <div className="cg-legend">
            {Object.entries(CARD_TYPES).map(([type, info]) => (
              <div key={type} className="cg-legend-item">
                <div className="cg-legend-dot" style={{ background: info.color }} />
                <span>{info.label}</span>
              </div>
            ))}
          </div>

          <h3>Rules</h3>
          <ul>
            <li>You have {HAND_SIZE} cards in your hand</li>
            <li>Tap cards to add them to your sentence</li>
            <li>Cards must follow Japanese grammar order</li>
            <li>Sentences must end with a verb, adjective, or copula (です)</li>
            <li>Each card in a sentence = 1 point, bonus for 4+ cards</li>
            <li>You can discard unwanted cards to draw new ones</li>
            <li>Tap the last card in your sentence to remove it</li>
          </ul>

          <h3>Valid Patterns</h3>
          <ul>
            <li><strong>Noun + Particle + Verb</strong> (e.g. cat + subj + eat)</li>
            <li><strong>Noun + Particle + Noun + Copula</strong> (e.g. I + topic + student + is)</li>
            <li><strong>Adjective + Noun + Particle + Verb</strong></li>
            <li><strong>Noun + Particle + Adverb + Verb</strong></li>
          </ul>

          <h3>Examples</h3>
          {EXAMPLE_SENTENCES.map((ex, i) => (
            <div key={i} className="cg-example">
              <div className="cg-example-cards">
                {ex.cards.map((c, j) => (
                  <span key={j} className="cg-example-chip" style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ddd'
                  }}>
                    {c}
                  </span>
                ))}
              </div>
              <span className="cg-example-translation">{ex.translation}</span>
              {' '}
              <span className="cg-example-points">+{ex.points} pts</span>
            </div>
          ))}

          <button className="cg-modal-close" onClick={() => setShowHelp(false)}>
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-game">
      {/* Score popup */}
      {scorePopup && (
        <div className="cg-score-popup">+{scorePopup}</div>
      )}

      {/* Help modal */}
      {showHelp && renderHelpModal()}

      {/* Top bar */}
      <div className="cg-top-bar">
        <div className="cg-score-section">
          <div className="cg-score">
            Score: <span>{score}</span>
            <span className="cg-target"> / {TARGET_SCORE}</span>
          </div>
          <div className="cg-turn">Turn {turn}</div>
          <div className="cg-deck-count">Deck: {deck.length}</div>
        </div>
        <div className="cg-actions">
          <button className="cg-btn cg-btn-help" onClick={() => setShowHelp(true)}>?</button>
          <button className="cg-btn cg-btn-new" onClick={startGame}>New</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="cg-progress-wrap">
        <div className="cg-progress-bar">
          <div
            className="cg-progress-fill"
            style={{ width: `${Math.min(100, (score / TARGET_SCORE) * 100)}%` }}
          />
        </div>
      </div>

      {/* Last completed sentence */}
      {lastSentence && (
        <div className="cg-history">
          <div className="cg-last-sentence">
            <span className="cg-last-sentence-text">
              {lastSentence.text} — <em>{lastSentence.meaning}</em>
            </span>
            <span className="cg-last-sentence-pts">+{lastSentence.points}</span>
          </div>
        </div>
      )}

      {/* Sentence building area */}
      <div className="cg-sentence-area">
        <div className="cg-sentence-label">Your Sentence</div>

        <div className={`cg-sentence-cards ${sentence.length > 0 ? 'has-cards' : ''} ${validClass}`}>
          {sentence.length === 0 ? (
            <div className="cg-sentence-empty">
              Tap cards from your hand to build a sentence
            </div>
          ) : (
            sentence.map((card, index) => (
              <div
                key={card.id}
                className={`cg-card in-sentence type-${card.type} cg-card-enter`}
                onClick={() => returnCardToHand(index)}
                title={index === sentence.length - 1 ? 'Tap to return to hand' : ''}
                style={{ opacity: index === sentence.length - 1 ? 1 : 0.85 }}
              >
                <div className="cg-card-type">{CARD_TYPES[card.type].label}</div>
                <div className="cg-card-word">{card.word}</div>
                <div className="cg-card-meaning">{card.meaning}</div>
              </div>
            ))
          )}
        </div>

        {/* Sentence reading */}
        {sentence.length > 0 && (
          <div className="cg-sentence-reading">
            {sentence.map(c => c.word).join(' ')}
            {canEndHere() && ' ✓'}
          </div>
        )}

        {/* Validation message */}
        {validation && !validation.valid && sentence.length >= 2 && (
          <div className={`cg-validation invalid`}>
            {validation.reason}
          </div>
        )}

        {/* Sentence actions */}
        <div className="cg-sentence-actions">
          <button
            className="cg-btn cg-btn-submit"
            disabled={!canSubmit()}
            onClick={submitSentence}
          >
            Submit ({sentence.length > 0 ? scoreSentence(sentence) : 0} pts)
          </button>
          {sentence.length > 0 && (
            <button className="cg-btn cg-btn-clear" onClick={clearSentence}>
              Clear
            </button>
          )}
          {!discardMode && sentence.length === 0 && (
            <button className="cg-btn cg-btn-discard" onClick={() => setDiscardMode(true)}>
              Discard
            </button>
          )}
        </div>
      </div>

      {/* Hand area */}
      <div className="cg-hand-area">
        {discardMode && (
          <div className="cg-discard-banner">
            Tap cards to mark for discard, then confirm
            <div className="cg-discard-actions">
              <button
                className="cg-btn cg-btn-discard-confirm"
                onClick={confirmDiscard}
                disabled={markedForDiscard.size === 0}
              >
                Discard ({markedForDiscard.size})
              </button>
              <button className="cg-btn cg-btn-discard-cancel" onClick={cancelDiscard}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="cg-hand-label">
          Your Hand ({hand.length})
        </div>

        <div className="cg-hand-cards">
          {hand.map((card, index) => {
            const playable = isCardPlayable(card);
            const isMarked = markedForDiscard.has(card.id);
            return (
              <div
                key={card.id}
                className={`cg-card type-${card.type} cg-card-enter ${
                  discardMode ? 'discard-mode' : ''
                } ${isMarked ? 'marked-discard' : ''} ${
                  !playable && !discardMode ? '' : ''
                }`}
                style={{
                  opacity: !discardMode && !playable ? 0.4 : 1,
                  cursor: !discardMode && !playable ? 'not-allowed' : 'pointer',
                  animationDelay: `${index * 0.05}s`,
                }}
                onClick={() => playCardFromHand(index)}
              >
                <div className="cg-card-type">{CARD_TYPES[card.type].label}</div>
                <div className="cg-card-word">{card.word}</div>
                <div className="cg-card-romaji">{card.romaji}</div>
                <div className="cg-card-meaning">{card.meaning}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CardGame;
