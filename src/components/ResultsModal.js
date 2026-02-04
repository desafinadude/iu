import React, { useEffect, useState } from 'react';
import '../styles/ResultsModal.css';

function ResultsModal({ score, questionsAnswered, onPlayAgain, quizType, onCoinsAwarded }) {
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  const getMessage = () => {
    if (accuracy >= 90) return "Amazing!";
    if (accuracy >= 70) return "Great job!";
    if (accuracy >= 50) return "Good effort!";
    return "Keep practicing!";
  };

  // Calculate coins earned based on questions answered
  const calculateCoins = () => {
    const baseCoins = Math.floor(questionsAnswered / 10); // 1 coin per 10 questions
    const bonus = questionsAnswered >= 30 ? 3 : 0; // Bonus for 30+ questions
    return baseCoins + bonus;
  };

  const coinsEarned = calculateCoins();

  // Award coins once when modal is shown
  useEffect(() => {
    if (!coinsAwarded && onCoinsAwarded && coinsEarned > 0) {
      onCoinsAwarded(coinsEarned);
      setCoinsAwarded(true);
    }
  }, [coinsAwarded, onCoinsAwarded, coinsEarned]);

  return (
    <div className="results-modal-overlay">
      <div className="results-modal">
        <div className="results-header">
          <h2>Game Over</h2>
          <p className="quiz-type">{quizType} Quiz</p>
        </div>

        <div className="results-message">{getMessage()}</div>

        <div className="results-stats">
          <div className="stat-item">
            <div className="stat-value">{score}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">{questionsAnswered}</div>
            <div className="stat-label">Questions</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>

        {coinsEarned > 0 && (
          <div className="coins-earned">
            <span className="coin-icon">&#x1FA99;</span>
            <span className="coins-amount">+{coinsEarned}</span>
          </div>
        )}

        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default ResultsModal;
