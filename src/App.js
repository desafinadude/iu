import React, { useState, useEffect, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import KanaQuiz from './components/KanaQuiz';
import KanjiQuiz from './components/KanjiQuiz';
import VocabularyPractice from './components/VocabularyPractice';
import HandwritingPractice from './components/HandwritingPractice';
import WordSearch from './components/WordSearch';
import Settings from './components/Settings';
import Resources from './components/Resources';
import Collection from './components/Collection';
import Shop from './components/Shop';
import WordQuiz from './components/WordQuiz';
import LetterTile from './components/LetterTile';
import CoinDisplay from './components/CoinDisplay';
import LevelUpModal from './components/LevelUpModal';
import StreakLostModal from './components/StreakLostModal';
import KoiPond from './components/KoiPond';
import FishShop from './components/FishShop';
import { useProgress } from './hooks/useProgress';
import './styles/App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // home, kana, vocab, handwriting, wordSearch, wordQuiz, letterTile, settings, resources
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

  // Progress tracking
  const {
    coins,
    kanaProgress,
    kanjiProgress,
    wordProgress,
    unlockedPacks,
    recordAnswer,
    recordKanjiAnswer,
    recordWordAnswer,
    getKanaWeight,
    getKanjiWeight,
    getWordWeight,
    purchasePack,
    awardCoins,
    exportProgress,
    importProgress,
  } = useProgress();
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [streakLostInfo, setStreakLostInfo] = useState(null);

  // Callback for quiz components to record answers (now with quizType)
  const handleAnswerRecorded = useCallback((char, isCorrect, quizType) => {
    const result = recordAnswer(char, isCorrect, quizType);
    if (result.starEarned) {
      setLevelUpInfo({
        kana: char,
        quizType: result.quizType,
        coinsEarned: result.coinsEarned,
      });
    } else if (result.streakLost) {
      setStreakLostInfo({
        kana: char,
        quizType: result.quizType,
        lostStreak: result.lostStreak,
      });
    }
    return result;
  }, [recordAnswer]);

  // Callback for kanji quiz answers
  const handleKanjiAnswerRecorded = useCallback((char, isCorrect, quizType) => {
    const result = recordKanjiAnswer(char, isCorrect, quizType);
    if (result.starEarned) {
      setLevelUpInfo({
        kana: char,
        quizType: result.quizType,
        coinsEarned: result.coinsEarned,
      });
    } else if (result.streakLost) {
      setStreakLostInfo({
        kana: char,
        quizType: result.quizType,
        lostStreak: result.lostStreak,
      });
    }
    return result;
  }, [recordKanjiAnswer]);

  // Callback for word quiz to record answers (no level-up modal for words)
  const handleWordAnswerRecorded = useCallback((word, isCorrect) => {
    const result = recordWordAnswer(word, isCorrect);
    // Don't show level-up modal for words - coins awarded at quiz end
    return result;
  }, [recordWordAnswer]);

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
    const quizViews = ['kana', 'kanji', 'vocab', 'handwriting', 'wordSearch', 'wordQuiz', 'letterTile'];
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
        <div className="header-right">
          <CoinDisplay coins={coins} />
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </div>

      <div className="app-content">
        {currentView === 'home' && <HomePage onActivitySelect={handleActivitySelect} />}
        {currentView === 'kana' && (
          <KanaQuiz
            settings={settings}
            onAnswerRecorded={handleAnswerRecorded}
            getKanaWeight={getKanaWeight}
          />
        )}
        {currentView === 'kanji' && (
          <KanjiQuiz
            onAnswerRecorded={handleKanjiAnswerRecorded}
            getKanjiWeight={getKanjiWeight}
          />
        )}
        {currentView === 'vocab' && (
          <VocabularyPractice settings={settings} unlockedPacks={unlockedPacks} />
        )}
        {currentView === 'handwriting' && (
          <HandwritingPractice
            settings={settings}
            onAnswerRecorded={handleAnswerRecorded}
            getKanaWeight={(char) => getKanaWeight(char, 'handwriting')}
            onKanjiAnswerRecorded={handleKanjiAnswerRecorded}
            getKanjiWeight={(char, qt) => getKanjiWeight(char, qt || 'handwriting')}
          />
        )}
        {currentView === 'wordSearch' && (
          <WordSearch settings={settings} unlockedPacks={unlockedPacks} />
        )}
        {currentView === 'settings' && (
          <Settings
            settings={settings}
            onSave={saveSettings}
            onExportProgress={exportProgress}
            onImportProgress={importProgress}
            coins={coins}
            unlockedPacksCount={unlockedPacks.length}
          />
        )}
        {currentView === 'resources' && <Resources />}
        {currentView === 'collection' && (
          <Collection
            kanaProgress={kanaProgress}
            kanjiProgress={kanjiProgress}
            wordProgress={wordProgress}
            coins={coins}
            unlockedPacks={unlockedPacks}
          />
        )}
        {currentView === 'shop' && (
          <Shop
            coins={coins}
            unlockedPacks={unlockedPacks}
            purchasePack={purchasePack}
          />
        )}
        {currentView === 'wordQuiz' && (
          <WordQuiz
            settings={settings}
            unlockedPacks={unlockedPacks}
            onWordAnswerRecorded={handleWordAnswerRecorded}
            getWordWeight={getWordWeight}
            onCoinsAwarded={awardCoins}
          />
        )}
        {currentView === 'letterTile' && (
          <LetterTile
            settings={settings}
            unlockedPacks={unlockedPacks}
            onWordAnswerRecorded={handleWordAnswerRecorded}
            getWordWeight={getWordWeight}
            onCoinsAwarded={awardCoins}
          />
        )}
        {currentView === 'koiPond' && (
          <KoiPond coins={coins} ownedFish={[]} />
        )}
        {currentView === 'fishShop' && (
          <FishShop coins={coins} ownedFish={[]} />
        )}
        {currentView === 'about' && (
          <div className="about-page">
            <h2>About KoiKata</h2>
            <p>A fun way to learn Japanese kana and vocabulary!</p>
            <p>Version 1.0</p>
          </div>
        )}
      </div>

      {levelUpInfo && (
        <LevelUpModal
          kana={levelUpInfo.kana}
          quizType={levelUpInfo.quizType}
          coinsEarned={levelUpInfo.coinsEarned}
          onClose={() => setLevelUpInfo(null)}
        />
      )}

      {streakLostInfo && (
        <StreakLostModal
          kana={streakLostInfo.kana}
          quizType={streakLostInfo.quizType}
          lostStreak={streakLostInfo.lostStreak}
          onClose={() => setStreakLostInfo(null)}
        />
      )}
    </div>
  );
}

export default App;
