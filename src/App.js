import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Menu from './components/Menu';
import KanaQuiz from './components/KanaQuiz';
import ReverseKanaQuiz from './components/ReverseKanaQuiz';
import KanjiQuiz from './components/KanjiQuiz';
import VocabularyPractice from './components/VocabularyPractice';
import HandwritingPractice from './components/HandwritingPractice';
import FallingKana from './components/FallingKana';
import WordSearch from './components/WordSearch';
import CardGame from './components/CardGame';
import Settings from './components/Settings';
import Resources from './components/Resources';
import './styles/App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('kana'); // kana, reverseKana, vocab, handwriting, fallingKana, settings, resources
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    enabledHiragana: new Set([
      // Basic vowels
      'あ', 'い', 'う', 'え', 'お',
      // K row + dakuten
      'か', 'き', 'く', 'け', 'こ',
      'が', 'ぎ', 'ぐ', 'げ', 'ご',
      // S row + dakuten
      'さ', 'し', 'す', 'せ', 'そ',
      'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
      // T row + dakuten
      'た', 'ち', 'つ', 'て', 'と',
      'だ', 'ぢ', 'づ', 'で', 'ど'
    ]),
    enabledKatakana: new Set([
      // Basic vowels
      'ア', 'イ', 'ウ', 'エ', 'オ',
      // K row + dakuten
      'カ', 'キ', 'ク', 'ケ', 'コ',
      'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
      // S row + dakuten
      'サ', 'シ', 'ス', 'セ', 'ソ',
      'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
      // T row + dakuten
      'タ', 'チ', 'ツ', 'テ', 'ト',
      'ダ', 'ヂ', 'ヅ', 'デ', 'ド'
    ]),
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
        enabledHiragana: new Set(parsed.enabledHiragana || [
          // Basic vowels
          'あ', 'い', 'う', 'え', 'お',
          // K row + dakuten
          'か', 'き', 'く', 'け', 'こ',
          'が', 'ぎ', 'ぐ', 'げ', 'ご',
          // S row + dakuten
          'さ', 'し', 'す', 'せ', 'そ',
          'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
          // T row + dakuten
          'た', 'ち', 'つ', 'て', 'と',
          'だ', 'ぢ', 'づ', 'で', 'ど'
        ]),
        enabledKatakana: new Set(parsed.enabledKatakana || [
          // Basic vowels
          'ア', 'イ', 'ウ', 'エ', 'オ',
          // K row + dakuten
          'カ', 'キ', 'ク', 'ケ', 'コ',
          'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
          // S row + dakuten
          'サ', 'シ', 'ス', 'セ', 'ソ',
          'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
          // T row + dakuten
          'タ', 'チ', 'ツ', 'テ', 'ト',
          'ダ', 'ヂ', 'ヅ', 'デ', 'ド'
        ]),
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
  }, []); // Empty dependency array is correct here - we only want this to run once on mount

  // Add/remove quiz-active class based on current view
  useEffect(() => {
    const quizViews = ['kana', 'reverseKana', 'kanji', 'vocab', 'handwriting', 'fallingKana', 'wordSearch', 'cardGame'];
    if (quizViews.includes(currentView)) {
      document.body.classList.add('quiz-active');
    } else {
      document.body.classList.remove('quiz-active');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('quiz-active');
    };
  }, [currentView]);

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
          <div className="title-japanese">こい<span>かた</span></div>
          <div className="title-english">{currentView}</div>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className="app-content">
        {currentView === 'kana' && <KanaQuiz settings={settings} />}
        {currentView === 'reverseKana' && <ReverseKanaQuiz settings={settings} />}
        {currentView === 'kanji' && <KanjiQuiz settings={settings} />}
        {currentView === 'vocab' && <VocabularyPractice settings={settings} />}
        {currentView === 'handwriting' && <HandwritingPractice settings={settings} />}
        {currentView === 'fallingKana' && <FallingKana settings={settings} />}
        {currentView === 'wordSearch' && <WordSearch settings={settings} />}
        {currentView === 'cardGame' && <CardGame />}
        {currentView === 'settings' && <Settings settings={settings} onSave={saveSettings} />}
        {currentView === 'resources' && <Resources />}
      </div>
    </div>
  );
}

export default App;
