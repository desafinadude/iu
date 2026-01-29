import React from 'react';
import '../styles/HomePage.css';

function HomePage({ onActivitySelect }) {
  const activities = [
    { id: 'kana', label: 'Kana Quiz' },
    { id: 'reverseKana', label: 'Reverse Kana Quiz' },
    { id: 'kanji', label: 'Kanji Quiz' },
    { id: 'vocab', label: 'Vocabulary' },
    { id: 'handwriting', label: 'Handwriting' },
    { id: 'wordSearch', label: 'Word Search' }
  ];

  return (
    <div className="home-page">
      <div className="activities-grid">
        {activities.map((activity) => (
          <button
            key={activity.id}
            className="activity-button"
            onClick={() => onActivitySelect(activity.id)}
          >
            {activity.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;