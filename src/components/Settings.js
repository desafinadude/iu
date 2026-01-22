import React, { useState } from 'react';
import { hiraganaData } from '../data/hiraganaData';
import { katakanaData } from '../data/katakanaData';
import '../styles/Settings.css';

function Settings({ settings, onSave }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const toggleHiragana = (char) => {
    const newSet = new Set(localSettings.enabledHiragana);
    if (newSet.has(char)) {
      newSet.delete(char);
    } else {
      newSet.add(char);
    }
    setLocalSettings({ ...localSettings, enabledHiragana: newSet });
  };

  const toggleKatakana = (char) => {
    const newSet = new Set(localSettings.enabledKatakana);
    if (newSet.has(char)) {
      newSet.delete(char);
    } else {
      newSet.add(char);
    }
    setLocalSettings({ ...localSettings, enabledKatakana: newSet });
  };

  const selectAllHiragana = () => {
    setLocalSettings({
      ...localSettings,
      enabledHiragana: new Set(hiraganaData.map(h => h.char))
    });
  };

  const deselectAllHiragana = () => {
    setLocalSettings({
      ...localSettings,
      enabledHiragana: new Set()
    });
  };

  const selectAllKatakana = () => {
    setLocalSettings({
      ...localSettings,
      enabledKatakana: new Set(katakanaData.map(k => k.char))
    });
  };

  const deselectAllKatakana = () => {
    setLocalSettings({
      ...localSettings,
      enabledKatakana: new Set()
    });
  };

  const handleSave = () => {
    onSave(localSettings);
    alert('Settings saved!');
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
          <label>
            <input
              type="checkbox"
              checked={localSettings.includeDakutenHiragana}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  includeDakutenHiragana: e.target.checked
                })
              }
            />
            Include Dakuten
          </label>
        </div>
        <div className="char-controls">
          <button onClick={selectAllHiragana}>Select All</button>
          <button onClick={deselectAllHiragana}>Deselect All</button>
        </div>
        <div className="char-grid">
          {hiraganaData.map((char) => (
            <button
              key={char.char}
              className={`char-button ${
                localSettings.enabledHiragana.has(char.char) ? 'active' : ''
              }`}
              onClick={() => toggleHiragana(char.char)}
            >
              {char.char}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="section-header">
          <h3>Katakana Characters</h3>
          <label>
            <input
              type="checkbox"
              checked={localSettings.includeDakutenKatakana}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  includeDakutenKatakana: e.target.checked
                })
              }
            />
            Include Dakuten
          </label>
        </div>
        <div className="char-controls">
          <button onClick={selectAllKatakana}>Select All</button>
          <button onClick={deselectAllKatakana}>Deselect All</button>
        </div>
        <div className="char-grid">
          {katakanaData.map((char) => (
            <button
              key={char.char}
              className={`char-button ${
                localSettings.enabledKatakana.has(char.char) ? 'active' : ''
              }`}
              onClick={() => toggleKatakana(char.char)}
            >
              {char.char}
            </button>
          ))}
        </div>
      </div>

      <button className="save-button" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
}

export default Settings;
