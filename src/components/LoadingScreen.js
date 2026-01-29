import React, { useState } from 'react';
import '../styles/LoadingScreen.css';
import koikataLogo from '../styles/koikata.png';

function LoadingScreen() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="loading-screen">
      <div className="loading-circle"></div>
      <div className="loading-content">
        <div className={`loading-icon ${imageLoaded ? 'loaded' : 'loading'}`}>
          <img 
            src={koikataLogo} 
            alt="Koikata Logo" 
            className="loading-logo" 
            onLoad={handleImageLoad}
          />
        </div>
        <div className="loading-text-japanese">こいかた</div>
        <div className="loading-text-english">KOIKATA</div>
      </div>
    </div>
  );
}

export default LoadingScreen;
