import React, { useState } from 'react';
import { videosData, learningTips } from '../data/resourcesData';
import '../styles/Resources.css';

function Resources() {
  const [currentChapter, setCurrentChapter] = useState(null);
  
  // Use the first video from the data (you can extend this to support multiple videos)
  const primaryVideo = videosData[0];
  const chapters = primaryVideo.chapters;

  const jumpToChapter = (timeInSeconds) => {
    setCurrentChapter(timeInSeconds);
    // The iframe will be recreated with the new timestamp
  };

  const getYouTubeEmbedUrl = () => {
    const baseUrl = `https://www.youtube.com/embed/${primaryVideo.id}`;
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
        <h3>{primaryVideo.title}</h3>
        <div className="video-container">
          <iframe
            key={currentChapter} // Force re-render when chapter changes
            width="100%"
            height="315"
            src={getYouTubeEmbedUrl()}
            title={primaryVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <div className="chapters-section">
          <h4>Video Chapters</h4>
          <div className="chapters-grid">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                className={`chapter-button ${currentChapter === chapter.time ? 'active' : ''}`}
                onClick={() => jumpToChapter(chapter.time)}
              >
                <div className="chapter-title">{chapter.title}</div>
                <div className="chapter-time">{Math.floor(chapter.time / 60)}:{(chapter.time % 60).toString().padStart(2, '0')}</div>
                <div className="chapter-description">{chapter.description}</div>
              </button>
            ))}
          </div>
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