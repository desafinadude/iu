import React from 'react';
import '../styles/KoiPond.css';

function KoiPond({ coins, ownedFish = [] }) {
  return (
    <div className="koi-pond-page">
      <div className="pond-header">
        <h2>Koi Pond</h2>
        <div className="pond-coins">
          <span className="coin-icon">&#x1FA99;</span>
          <span className="coin-total">{coins}</span>
        </div>
      </div>

      <div className="pond-container">
        <div className="pond">
          {ownedFish.length === 0 ? (
            <div className="pond-empty">
              <div className="pond-empty-icon">&#x1F41F;</div>
              <p>Your pond is empty!</p>
              <p className="pond-hint">Visit the Fish Shop to buy koi fish</p>
            </div>
          ) : (
            <div className="pond-fish">
              {ownedFish.map((fish, index) => (
                <div
                  key={index}
                  className={`koi-fish koi-${fish.type}`}
                  style={{
                    animationDelay: `${index * 0.5}s`,
                    left: `${20 + (index % 3) * 30}%`,
                    top: `${20 + Math.floor(index / 3) * 25}%`
                  }}
                >
                  &#x1F41F;
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pond-stats">
        <div className="stat-bubble">
          <span className="stat-number">{ownedFish.length}</span>
          <span className="stat-label">Fish</span>
        </div>
      </div>

      <div className="pond-coming-soon">
        <p>More features coming soon!</p>
        <ul>
          <li>Feed your koi</li>
          <li>Watch them grow</li>
          <li>Unlock rare varieties</li>
        </ul>
      </div>
    </div>
  );
}

export default KoiPond;
