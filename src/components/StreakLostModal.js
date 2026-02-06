import React, { useEffect } from 'react';
import '../styles/StreakLostModal.css';

const QUIZ_TYPE_LABELS = {
  kana: 'Kana Quiz',
  reverse: 'Reverse Quiz',
  handwriting: 'Handwriting',
};

function StreakLostModal({ kana, quizType, lostStreak, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="streak-lost-overlay" onClick={onClose}>
      <div className="streak-lost-modal" onClick={e => e.stopPropagation()}>
        <div className="streak-lost-kana">{kana}</div>
        <div className="streak-lost-text">STREAK LOST!</div>
        <div className="streak-lost-detail">
          {QUIZ_TYPE_LABELS[quizType] || quizType}
        </div>
        <div className="streak-lost-count">
          {lostStreak}/20 reset to 0
        </div>
      </div>
    </div>
  );
}

export default StreakLostModal;
