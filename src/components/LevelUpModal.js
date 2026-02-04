import React, { useEffect } from 'react';
import '../styles/LevelUpModal.css';

function LevelUpModal({ kana, newLevel, coinsEarned, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getLevelStars = (level) => {
    return '\u2605'.repeat(level) + '\u2606'.repeat(5 - level);
  };

  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-modal" onClick={e => e.stopPropagation()}>
        <div className="level-up-burst">
          <div className="level-up-kana">{kana}</div>
        </div>
        <div className="level-up-text">LEVEL UP!</div>
        <div className="level-up-stars">{getLevelStars(newLevel)}</div>
        <div className="level-up-coins">
          <span className="coin-icon">&#x1FA99;</span>
          <span>+{coinsEarned}</span>
        </div>
      </div>
    </div>
  );
}

export default LevelUpModal;
