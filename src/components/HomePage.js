import React from 'react';
import '../styles/HomePage.css';

function HomePage({ onActivitySelect }) {
  const activities = [
    { id: 'kana', label: 'Kana Quiz' },
    { id: 'reverseKana', label: 'Reverse Kana Quiz' },
    { id: 'kanaMatch', label: 'Kana Matching' },
    { id: 'wordQuiz', label: 'Word Quiz' },
    // { id: 'kanji', label: 'Kanji Quiz' }, // Disabled for now
    { id: 'vocab', label: 'Vocabulary' },
    { id: 'handwriting', label: 'Handwriting' },
    { id: 'wordSearch', label: 'Word Search' },
    { id: 'shop', label: 'Vocab Shop' },
    { id: 'collection', label: 'My Collection' },
    // { id: 'koiPond', label: 'Koi Pond' }, // Hidden for now
    // { id: 'fishShop', label: 'Fish Shop' } // Hidden for now
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