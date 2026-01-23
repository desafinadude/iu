import React, { useState } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import '../styles/Settings.css';

function Settings({ settings, onSave }) {
  const [localSettings, setLocalSettings] = useState(settings);

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

  const handleSave = () => {
    onSave(localSettings);
    alert('Settings saved!');
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

      <button className="save-button" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
}

export default Settings;
