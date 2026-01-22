import React, { useState } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import '../styles/Settings.css';

function Settings({ settings, onSave }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const hiraganaGrid = [
    ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'],
    ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', '', 'り', ''],
    ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'ゆ', 'る', 'ん'],
    ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', '', 'れ', ''],
    ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'よ', 'ろ', 'を']
  ];

  const katakanaGrid = [
    ['ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ'],
    ['イ', 'キ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ', '', 'リ', ''],
    ['ウ', 'ク', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ', 'ル', 'ン'],
    ['エ', 'ケ', 'セ', 'テ', 'ネ', 'ヘ', 'メ', '', 'レ', ''],
    ['オ', 'コ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ', 'ロ', 'ヲ']
  ];

  const columnHeaders = ['', '•', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W'];
  const rowHeaders = ['A', 'I', 'U', 'E', 'O'];

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
      <div className="settings-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-section">
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
      </div>

      <div className="settings-section">
        <div className="section-header">
          <h3>Hiragana Characters</h3>
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
          <h3>Katakana Characters</h3>
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
