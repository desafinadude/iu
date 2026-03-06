import React from 'react';
import '../styles/HomePage.css';

function HomePage({ onActivitySelect }) {
  const activities = [
    { id: 'kana', label: 'Kana Quiz', emoji: '📝' },
    { id: 'kanji', label: 'Kanji Quiz', emoji: '漢' },
    { id: 'wordQuiz', label: 'Word Quiz', emoji: '💬' },
    { id: 'vocab', label: 'Vocabulary', emoji: '📚' },
    { id: 'handwriting', label: 'Handwriting', emoji: '✍️' },
    { id: 'wordSearch', label: 'Word Search', emoji: '🔍' },
    { id: 'letterTile', label: 'Letter Tiles', emoji: '🔤' },
    { id: 'verbQuiz', label: 'Verb Quiz', emoji: '動' },
    { id: 'shop', label: 'Vocab Shop', emoji: '🏪' },
    { id: 'collection', label: 'Collection', emoji: '⭐' },
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
            <span className="activity-emoji">{activity.emoji}</span>
            <span className="activity-label">{activity.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;