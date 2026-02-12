import React, { useState, useEffect, useRef } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import { getAvailableJapaneseVoices, setJapaneseVoice } from '../utils/speech';
import '../styles/Settings.css';

function Settings({ settings, onSave, onExportProgress, onImportProgress, coins, unlockedPacksCount }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveIndicator, setSaveIndicator] = useState('');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [importMessage, setImportMessage] = useState('');
  const [importStatus, setImportStatus] = useState(''); // 'success', 'error', or ''
  const fileInputRef = useRef(null);
  const isFirstRender = useRef(true);

  // Auto-save whenever settings change (except on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    onSave(localSettings);
    setSaveIndicator('Settings saved automatically ✓');
    const timer = setTimeout(() => setSaveIndicator(''), 2000);
    return () => clearTimeout(timer);
  }, [localSettings, onSave]);

  // Load available voices and set up voice change handling
  useEffect(() => {
    const loadVoices = () => {
      const voices = getAvailableJapaneseVoices();
      setAvailableVoices(voices);
    };

    // Load voices initially
    loadVoices();

    // Listen for voice changes (voices might load asynchronously)
    const speechSynthesis = window.speechSynthesis;
    if (speechSynthesis) {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }
  }, []);

  // Update speech voice when selection changes
  useEffect(() => {
    if (localSettings.selectedVoice !== undefined) {
      setJapaneseVoice(localSettings.selectedVoice);
    }
  }, [localSettings.selectedVoice]);

  // Transposed grids - now columns are vowels (A,I,U,E,O) and rows are consonants
  const hiraganaGrid = [
    ['あ', 'い', 'う', 'え', 'お'], // • row
    ['か', 'き', 'く', 'け', 'こ'], // K row  
    ['さ', 'し', 'す', 'せ', 'そ'], // S row
    ['た', 'ち', 'つ', 'て', 'と'], // T row
    ['な', 'に', 'ぬ', 'ね', 'の'], // N row
    ['は', 'ひ', 'ふ', 'へ', 'ほ'], // H row
    ['ま', 'み', 'む', 'め', 'も'], // M row
    ['や', '', 'ゆ', '', 'よ'],     // Y row
    ['ら', 'り', 'る', 'れ', 'ろ'], // R row
    ['わ', '', 'ん', '', 'を']      // W row
  ];

  const katakanaGrid = [
    ['ア', 'イ', 'ウ', 'エ', 'オ'], // • row
    ['カ', 'キ', 'ク', 'ケ', 'コ'], // K row
    ['サ', 'シ', 'ス', 'セ', 'ソ'], // S row
    ['タ', 'チ', 'ツ', 'テ', 'ト'], // T row
    ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'], // N row
    ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'], // H row
    ['マ', 'ミ', 'ム', 'メ', 'モ'], // M row
    ['ヤ', '', 'ユ', '', 'ヨ'],     // Y row
    ['ラ', 'リ', 'ル', 'レ', 'ロ'], // R row
    ['ワ', '', 'ン', '', 'ヲ']      // W row
  ];

  const columnHeaders = ['', 'A', 'I', 'U', 'E', 'O']; // Vowels as columns
  const rowHeaders = ['•', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W']; // Consonants as rows

  const toggleCharacter = (char, isHiragana) => {
    if (isHiragana) {
      const newSet = new Set(localSettings.enabledHiragana);
      if (newSet.has(char)) {
        newSet.delete(char);
      } else {
        newSet.add(char);
      }
      setLocalSettings({ ...localSettings, enabledHiragana: newSet });
    } else {
      const newSet = new Set(localSettings.enabledKatakana);
      if (newSet.has(char)) {
        newSet.delete(char);
      } else {
        newSet.add(char);
      }
      setLocalSettings({ ...localSettings, enabledKatakana: newSet });
    }
  };

  const selectAllHiragana = () => {
    let newSet = new Set();
    if (localSettings.includeDakutenHiragana) {
      newSet = new Set(hiraganaData.map(h => h.char));
    } else {
      newSet = new Set(hiraganaData.filter(h => h.basic).map(h => h.char));
    }
    setLocalSettings({ ...localSettings, enabledHiragana: newSet });
  };

  const deselectAllHiragana = () => {
    setLocalSettings({ ...localSettings, enabledHiragana: new Set() });
  };

  const selectAllKatakana = () => {
    let newSet = new Set();
    if (localSettings.includeDakutenKatakana) {
      newSet = new Set(katakanaData.map(k => k.char));
    } else {
      newSet = new Set(katakanaData.filter(k => k.basic).map(k => k.char));
    }
    setLocalSettings({ ...localSettings, enabledKatakana: newSet });
  };

  const deselectAllKatakana = () => {
    setLocalSettings({ ...localSettings, enabledKatakana: new Set() });
  };

  const handleExport = () => {
    onExportProgress();
    setSaveIndicator('Progress exported successfully ✓');
    setTimeout(() => setSaveIndicator(''), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await onImportProgress(file);
      setImportStatus('success');
      setImportMessage(`Progress restored successfully! (exported ${new Date(result.exportDate).toLocaleString()})`);
      setTimeout(() => {
        setImportMessage('');
        setImportStatus('');
      }, 5000);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error.message || 'Failed to import progress');
      setTimeout(() => {
        setImportMessage('');
        setImportStatus('');
      }, 5000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderKanaTable = (grid, isHiragana) => {
    const enabledSet = isHiragana ? localSettings.enabledHiragana : localSettings.enabledKatakana;

    return (
      <div className="kana-table">
        {/* Header row */}
        <div className="kana-table-row header-row">
          {columnHeaders.map((header, idx) => (
            <div key={idx} className="kana-header">
              {header}
            </div>
          ))}
        </div>
        {/* Character rows */}
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="kana-table-row">
            <div className="kana-header row-header">{rowHeaders[rowIdx]}</div>
            {row.map((char, colIdx) => (
              <div key={colIdx} className="kana-cell">
                {char && char !== '' ? (
                  <button
                    className={`kana-char-btn ${enabledSet.has(char) ? 'active' : 'inactive'}`}
                    onClick={() => toggleCharacter(char, isHiragana)}
                  >
                    {char}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="settings">
      {saveIndicator && (
        <div className="save-indicator">
          {saveIndicator}
        </div>
      )}

      {importMessage && (
        <div className={`import-message ${importStatus}`}>
          {importMessage}
        </div>
      )}

      {/* Progress Management Section */}
      <div className="settings-section">
        <h3>Progress Management</h3>
        <div className="progress-info">
          <div className="progress-stat">
            <span className="stat-label">Coins:</span>
            <span className="stat-value">{coins}</span>
          </div>
          <div className="progress-stat">
            <span className="stat-label">Unlocked Packs:</span>
            <span className="stat-value">{unlockedPacksCount}</span>
          </div>
        </div>
        <div className="progress-controls">
          <button className="export-btn" onClick={handleExport}>
            📥 Export Progress
          </button>
          <button className="import-btn" onClick={handleImportClick}>
            📤 Import Progress
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <div className="progress-help">
          <p><strong>Export:</strong> Save your progress to a JSON file for backup.</p>
          <p><strong>Import:</strong> Restore progress from a previously exported file.</p>
          <p className="warning-text">⚠️ Importing will replace your current progress. Export first to be safe!</p>
        </div>
      </div>

      {/* <div className="settings-section">
        <h3>Handwriting Recognition Strictness</h3>
        <div className="strictness-slider">
          <input
            type="range"
            min="1"
            max="50"
            value={localSettings.recognitionStrictness}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                recognitionStrictness: parseInt(e.target.value)
              })
            }
          />
          <span className="strictness-value">
            {localSettings.recognitionStrictness <= 5
              ? 'Very Strict'
              : localSettings.recognitionStrictness <= 15
              ? 'Strict'
              : localSettings.recognitionStrictness <= 30
              ? 'Moderate'
              : 'Lenient'}
          </span>
        </div>
      </div> */}

      <div className="settings-section">
        <div className="section-header">
          <h3>Hiragana</h3>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={!localSettings.includeDakutenHiragana}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  includeDakutenHiragana: !e.target.checked
                })
              }
            />
            <span>Basic Only</span>
          </label>
        </div>
        <div className="char-controls">
          <button onClick={selectAllHiragana}>Select All</button>
          <button onClick={deselectAllHiragana}>Deselect All</button>
        </div>
        {renderKanaTable(hiraganaGrid, true)}
      </div>

      <div className="settings-section">
        <div className="section-header">
          <h3>Katakana</h3>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={!localSettings.includeDakutenKatakana}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  includeDakutenKatakana: !e.target.checked
                })
              }
            />
            <span>Basic Only</span>
          </label>
        </div>
        <div className="char-controls">
          <button onClick={selectAllKatakana}>Select All</button>
          <button onClick={deselectAllKatakana}>Deselect All</button>
        </div>
        {renderKanaTable(katakanaGrid, false)}
      </div>

      <div className="settings-section">
        <h3>Japanese Font Style</h3>
        <div className="font-selector">
          {[
            { value: 'noto', label: 'Noto Sans JP', description: 'Clean and modern' },
            { value: 'maru', label: 'Zen Maru Gothic', description: 'Rounded and friendly' },
            { value: 'mincho', label: 'Shippori Mincho', description: 'Traditional serif' },
            { value: 'kosugi', label: 'Kosugi Maru', description: 'Soft and rounded' },
            { value: 'rounded', label: 'M PLUS Rounded 1c', description: 'Modern rounded' },
            { value: 'sawarabi-gothic', label: 'Sawarabi Gothic', description: 'Simple gothic' },
            { value: 'sawarabi-mincho', label: 'Sawarabi Mincho', description: 'Traditional mincho' },
            { value: 'yusei', label: 'Yusei Magic', description: 'Handwritten style' },
            { value: 'klee', label: 'Klee One', description: 'Textbook style' },
            { value: 'hachi', label: 'Hachi Maru Pop', description: 'Playful and bold' },
            { value: 'rocknroll', label: 'RocknRoll One', description: 'Dynamic and energetic' },
            { value: 'dela', label: 'Dela Gothic One', description: 'Bold gothic' },
            { value: 'rampart', label: 'Rampart One', description: 'Decorative' },
            { value: 'kaisei-decol', label: 'Kaisei Decol', description: 'Decorative serif' },
            { value: 'kaisei-opti', label: 'Kaisei Opti', description: 'Optical serif' }
          ].map(font => (
            <button
              key={font.value}
              className={`font-option ${localSettings.fontStyle === font.value ? 'active' : ''} font-${font.value}`}
              onClick={() => setLocalSettings({ ...localSettings, fontStyle: font.value })}
            >
              <div className="font-sample">あいうえお</div>
              <div className="font-info">
                <div className="font-name">{font.label}</div>
                <div className="font-desc">{font.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection Section */}
      <div className="settings-section">
        <h3>Japanese Voice</h3>
        <div className="voice-selector">
          {availableVoices.length > 0 ? (
            availableVoices.map((voice, index) => (
              <button
                key={index}
                className={`voice-option ${localSettings.selectedVoice === index ? 'active' : ''}`}
                onClick={() => setLocalSettings({ ...localSettings, selectedVoice: index })}
              >
                <div className="voice-info">
                  <div className="voice-name">{voice.name}</div>
                  <div className="voice-details">
                    {voice.lang} • {voice.localService ? 'Local' : 'Remote'}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="no-voices">No Japanese voices available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
