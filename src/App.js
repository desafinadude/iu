import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import KanaQuiz from './components/KanaQuiz';
import ReverseKanaQuiz from './components/ReverseKanaQuiz';
import KanaMatching from './components/KanaMatching';
// import KanjiQuiz from './components/KanjiQuiz'; // Disabled for now
import VocabularyPractice from './components/VocabularyPractice';
import HandwritingPractice from './components/HandwritingPractice';
import WordSearch from './components/WordSearch';
import Settings from './components/Settings';
import Resources from './components/Resources';
import './styles/App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // home, kana, reverseKana, kanaMatch, vocab, handwriting, wordSearch, settings, resources
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
    fontStyle: 'noto',
    selectedVoice: 0  // Index of selected Japanese voice
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
        fontStyle: parsed.fontStyle || 'noto',
        selectedVoice: parsed.selectedVoice || 0
      });
    }

    // Show loading screen for 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []); // Empty dependency array is correct here - we only want this to run once on mount

  // Add/remove quiz-active class based on current view
  useEffect(() => {
    const quizViews = ['kana', 'reverseKana', 'kanaMatch', 'vocab', 'handwriting', 'wordSearch'];
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

  const handleActivitySelect = (activity) => {
    setCurrentView(activity);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
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
        onBackToHome={handleBackToHome}
      />

      <div className="app-header">
        <div className="app-title">
          <div className="title-japanese">こい<span>かた</span></div>
          <div className="title-english">{currentView === 'home' ? 'home' : currentView}</div>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className="app-content">
        {currentView === 'home' && <HomePage onActivitySelect={handleActivitySelect} />}
        {currentView === 'kana' && <KanaQuiz settings={settings} />}
        {currentView === 'reverseKana' && <ReverseKanaQuiz settings={settings} />}
        {currentView === 'kanaMatch' && <KanaMatching settings={settings} />}
        {/* currentView === 'kanji' && <KanjiQuiz settings={settings} /> */}
        {currentView === 'vocab' && <VocabularyPractice settings={settings} />}
        {currentView === 'handwriting' && <HandwritingPractice settings={settings} />}
        {currentView === 'wordSearch' && <WordSearch settings={settings} />}
        {currentView === 'settings' && <Settings settings={settings} onSave={saveSettings} />}
        {currentView === 'resources' && <Resources />}
      </div>
    </div>
  );
}

export default App;
