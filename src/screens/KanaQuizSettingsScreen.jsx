import { useSettings } from '../hooks/useSettings'
import { GOJUON_ROWS, VOWEL_HEADERS } from '../data/kana'
import './KanaSettingsScreen.css'

function KanaTable({ rows, activeRows, onToggleRow, script }) {
  return (
    <div className="kana-table">
      <div className="kana-table__header-row">
        <div className="kana-table__row-label" />
        {VOWEL_HEADERS.map(v => (
          <div key={v} className="kana-table__col-header">{v}</div>
        ))}
      </div>

      {rows.map(row => {
        const active = activeRows.has(row.id)
        return (
          <button
            key={row.id}
            className={`kana-table__row ${active ? 'kana-table__row--active' : ''}`}
            onClick={() => onToggleRow(row.id)}
            aria-pressed={active}
            aria-label={`${row.label || 'Vowel'} row — ${active ? 'active' : 'inactive'}`}
          >
            <div className="kana-table__row-label">{row.label}</div>
            {row.chars.map((c, i) => (
              <div key={i} className={`kana-table__cell ${!c ? 'kana-table__cell--empty' : ''}`}>
                {c ? (script === 'hiragana' ? c.hiragana : c.katakana) : ''}
              </div>
            ))}
          </button>
        )
      })}
    </div>
  )
}

export default function KanaQuizSettingsScreen() {
  const {
    settings,
    toggleRow,
    setScript,
    setIncludeDakuten,
    setIncludeHandakuten,
    selectAll,
    selectNone,
  } = useSettings()

  const { script, activeRows, includeDakuten, includeHandakuten } = settings

  return (
    <div className="kana-settings">

      {/* Script toggle */}
      <section className="kana-settings__section">
        <h2 className="kana-settings__section-title">Script</h2>
        <div className="kana-settings__script-toggle">
          {['hiragana', 'katakana'].map(s => (
            <button
              key={s}
              className={`kana-settings__script-btn ${script === s ? 'kana-settings__script-btn--active' : ''}`}
              onClick={() => setScript(s)}
              aria-pressed={script === s}
            >
              <span className="kana-settings__script-kana">
                {s === 'hiragana' ? 'あ' : 'ア'}
              </span>
              <span className="kana-settings__script-label">
                {s === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Gojūon table */}
      <section className="kana-settings__section">
        <div className="kana-settings__section-header">
          <h2 className="kana-settings__section-title">Basic Kana</h2>
          <div className="kana-settings__shortcuts">
            <button className="kana-settings__link" onClick={selectAll}>All</button>
            <button className="kana-settings__link" onClick={selectNone}>Reset</button>
          </div>
        </div>
        <p className="kana-settings__hint">Tap a row to toggle it on or off</p>
        <KanaTable
          rows={GOJUON_ROWS}
          activeRows={activeRows}
          onToggleRow={toggleRow}
          script={script}
        />
      </section>

      {/* Dakuten */}
      <section className="kana-settings__section">
        <div className="kana-settings__section-header">
          <h2 className="kana-settings__section-title">
            Dakuten <span className="kana-settings__section-mark">゛</span>
          </h2>
          <button
            className={`kana-settings__pill-toggle ${includeDakuten ? 'kana-settings__pill-toggle--on' : ''}`}
            onClick={() => setIncludeDakuten(!includeDakuten)}
            aria-pressed={includeDakuten}
          >
            {includeDakuten ? 'ON' : 'OFF'}
          </button>
        </div>
      </section>

      {/* Handakuten */}
      <section className="kana-settings__section">
        <div className="kana-settings__section-header">
          <h2 className="kana-settings__section-title">
            Handakuten <span className="kana-settings__section-mark">゜</span>
          </h2>
          <button
            className={`kana-settings__pill-toggle ${includeHandakuten ? 'kana-settings__pill-toggle--on' : ''}`}
            onClick={() => setIncludeHandakuten(!includeHandakuten)}
            aria-pressed={includeHandakuten}
          >
            {includeHandakuten ? 'ON' : 'OFF'}
          </button>
        </div>
      </section>

      <p className="kana-settings__footer">Settings are saved automatically</p>
    </div>
  )
}
