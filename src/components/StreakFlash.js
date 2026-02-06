import React, { useState, useEffect, useCallback } from 'react';
import '../styles/StreakFlash.css';

function StreakFlash({ flash }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!flash) return;
    setCurrent(flash);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, [flash]);

  if (!visible || !current) return null;

  const isReset = current.type === 'reset';

  return (
    <div className={`streak-flash ${isReset ? 'reset' : 'progress'} ${visible ? 'show' : ''}`}>
      <div className="streak-flash-burst">
        {isReset ? (
          <>
            <div className="streak-flash-label">RESET!</div>
            <div className="streak-flash-value">0/{current.threshold}</div>
          </>
        ) : (
          <>
            <div className="streak-flash-label">+1</div>
            <div className="streak-flash-value">{current.count}/{current.threshold}</div>
          </>
        )}
      </div>
    </div>
  );
}

// Hook to manage flash state with unique keys
export function useStreakFlash() {
  const [flash, setFlash] = useState(null);

  const showProgress = useCallback((count, threshold) => {
    setFlash({ type: 'progress', count, threshold, key: Date.now() });
  }, []);

  const showReset = useCallback((threshold) => {
    setFlash({ type: 'reset', threshold, key: Date.now() });
  }, []);

  return { flash, showProgress, showReset };
}

export default StreakFlash;
