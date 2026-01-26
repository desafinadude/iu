import React from 'react';
import '../styles/Menu.css';

function Menu({ isOpen, onClose, onMenuClick, currentView }) {
  const menuItems = [
    { id: 'kana', label: 'Kana Quiz' },
    { id: 'reverseKana', label: 'Reverse Kana Quiz' },
    { id: 'kanji', label: 'Kanji Quiz' },
    { id: 'vocab', label: 'Vocabulary' },
    { id: 'handwriting', label: 'Handwriting' },
    { id: 'wordSearch', label: 'Word Search' },
    { id: 'cardGame', label: 'Card Game' },
    { id: 'resources', label: 'Resources' },
    { id: 'settings', label: 'Settings' },
    { id: 'about', label: 'About' }
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>

      {/* Slide-in Menu */}
      <div className={`menu-drawer ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="menu-title">こいかた</div>
          <button className="menu-close" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="menu-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onMenuClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="menu-footer">
          <p>KoiKata v1.0</p>
          <p>© 2025</p>
        </div>
      </div>
    </>
  );
}

export default Menu;
