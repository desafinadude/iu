import React from 'react';
import '../styles/CoinDisplay.css';

function CoinDisplay({ coins }) {
  return (
    <div className="coin-display">
      <span className="coin-icon">&#x1FA99;</span>
      <span className="coin-count">{coins}</span>
    </div>
  );
}

export default CoinDisplay;
