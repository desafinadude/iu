import React from 'react';
import '../styles/LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-circle"></div>
      <div className="loading-content">
        <div className="loading-icon">
          {/* Refresh/circular arrows icon - you can replace with actual image */}
          <svg viewBox="0 0 100 100" width="80" height="80">
            <path
              d="M50 10 A 40 40 0 1 1 30 15"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <polygon points="25,10 35,20 25,20" fill="currentColor" />
            <path
              d="M50 90 A 40 40 0 1 1 70 85"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <polygon points="75,90 65,80 75,80" fill="currentColor" />
          </svg>
        </div>
        <div className="loading-text-japanese">こいかた</div>
        <div className="loading-text-english">KOIKATA</div>
      </div>
    </div>
  );
}

export default LoadingScreen;
