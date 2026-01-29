import React, { useState } from 'react';
import '../styles/Resources.css';

function Resources() {
  const [currentChapter, setCurrentChapter] = useState(null);

  // Hardcoded data for now to fix the loading issue
  const videoId = '6p9Il_j0zjc';
  const chapters = [
    { title: 'Introduction', time: 0, description: 'Welcome and overview' },
    { title: 'Hiragana Basics', time: 120, description: 'Basic hiragana characters' },
    { title: 'Katakana Basics', time: 300, description: 'Basic katakana characters' },
    { title: 'Dakuten & Handakuten', time: 480, description: 'Modified characters with marks' },
    { title: 'Common Words', time: 660, description: 'Practical vocabulary examples' },
    { title: 'Practice Tips', time: 840, description: 'How to practice effectively' }
  ];

  const learningTips = [
    {
      title: 'Practice Daily',
      description: 'Consistent daily practice, even just 10-15 minutes, is more effective than long irregular sessions.'
    },
    {
      title: 'Write by Hand',
      description: 'Use the handwriting practice feature to reinforce muscle memory and character recognition.'
    },
    {
      title: 'Learn in Groups',
      description: 'Master one row at a time (あかさた...) before moving to the next for better retention.'
    },
    {
      title: 'Use Context',
      description: 'Practice with vocabulary words to see how characters work together in real usage.'
    }
  ];

  const jumpToChapter = (timeInSeconds) => {
    setCurrentChapter(timeInSeconds);
    // The iframe will be recreated with the new timestamp
  };

  const getYouTubeEmbedUrl = () => {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams({
      autoplay: 1,
      start: currentChapter || 0
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="resources">
      <div className="resources-header">
        <h2>Learning Resources</h2>
        <p>Educational videos and materials to help you learn Japanese kana</p>
      </div>

      <div className="video-section">
        <h3>Learn Hiragana and Katakana</h3>
        <div className="video-container">
          <iframe
            key={currentChapter} // Force re-render when chapter changes
            width="100%"
            height="315"
            src={getYouTubeEmbedUrl()}
            title="Learn Hiragana and Katakana"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <div className="chapters-section">
          <h4>Video Chapters</h4>
          <select 
            className="chapters-dropdown"
            value={currentChapter || 0}
            onChange={(e) => jumpToChapter(parseInt(e.target.value))}
          >
            {chapters.map((chapter, index) => (
              <option key={index} value={chapter.time}>
                {chapter.title} ({Math.floor(chapter.time / 60)}:{(chapter.time % 60).toString().padStart(2, '0')}) - {chapter.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="additional-resources">
        <h3>Additional Learning Tips</h3>
        <div className="tips-grid">
          {learningTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Resources;