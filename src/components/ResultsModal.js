import React from 'react';
import '../styles/ResultsModal.css';

function ResultsModal({ score, questionsAnswered, onPlayAgain, quizType }) {
  const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  const getMessage = () => {
    if (accuracy >= 90) return "Amazing!";
    if (accuracy >= 70) return "Great job!";
    if (accuracy >= 50) return "Good effort!";
    return "Keep practicing!";
  };

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

        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default ResultsModal;
