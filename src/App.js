import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Menu from './components/Menu';
import KanaQuiz from './components/KanaQuiz';
import ReverseKanaQuiz from './components/ReverseKanaQuiz';
import VocabularyPractice from './components/VocabularyPractice';
import HandwritingPractice from './components/HandwritingPractice';
import Settings from './components/Settings';
import './styles/App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('kana'); // kana, reverseKana, vocab, handwriting, settings
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    enabledHiragana: new Set(['あ', 'い', 'う', 'え', 'お']),
    enabledKatakana: new Set(['ア', 'イ', 'ウ', 'エ', 'オ']),
    includeDakutenHiragana: true,
    includeDakutenKatakana: true,
    recognitionStrictness: 50,
    fontStyle: 'noto'
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('koikataSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({
        ...settings,
        enabledHiragana: new Set(parsed.enabledHiragana || ['あ', 'い', 'う', 'え', 'お']),
        enabledKatakana: new Set(parsed.enabledKatakana || ['ア', 'イ', 'ウ', 'エ', 'オ']),
        includeDakutenHiragana: parsed.includeDakutenHiragana ?? true,
        includeDakutenKatakana: parsed.includeDakutenKatakana ?? true,
        recognitionStrictness: parsed.recognitionStrictness || 50,
        fontStyle: parsed.fontStyle || 'noto'
      });
    }

    // Show loading screen for 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('koikataSettings', JSON.stringify({
      ...newSettings,
      enabledHiragana: Array.from(newSettings.enabledHiragana),
      enabledKatakana: Array.from(newSettings.enabledKatakana)
    }));
  };

  const handleMenuClick = (view) => {
    setCurrentView(view);
    setMenuOpen(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onMenuClick={handleMenuClick}
        currentView={currentView}
      />

      <div className="app-header">
        <div className="app-title">
          <div className="title-japanese">こいかた</div>
          <div className="title-english">KANA</div>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className="app-content">
        {currentView === 'kana' && <KanaQuiz settings={settings} />}
        {currentView === 'reverseKana' && <ReverseKanaQuiz settings={settings} />}
        {currentView === 'vocab' && <VocabularyPractice settings={settings} />}
        {currentView === 'handwriting' && <HandwritingPractice settings={settings} />}
        {currentView === 'settings' && <Settings settings={settings} onSave={saveSettings} />}
      </div>
    </div>
  );
}

export default App;
