import React, { useEffect } from 'react';
import '../styles/LevelUpModal.css';

const QUIZ_TYPE_LABELS = {
  kana: 'Kana Quiz',
  reverse: 'Reverse Quiz',
  handwriting: 'Handwriting',
};

function LevelUpModal({ kana, quizType, coinsEarned, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-modal" onClick={e => e.stopPropagation()}>
        <div className="level-up-burst">
          <div className="level-up-kana">{kana}</div>
        </div>
        <div className="level-up-text">STAR EARNED!</div>
        <div className="level-up-quiz-type">{QUIZ_TYPE_LABELS[quizType] || quizType}</div>
        <div className="level-up-stars">{'\u2605'}</div>
        <div className="level-up-coins">
          <span className="coin-icon">&#x1FA99;</span>
          <span>+{coinsEarned}</span>
        </div>
      </div>
    </div>
  );
}

export default LevelUpModal;
