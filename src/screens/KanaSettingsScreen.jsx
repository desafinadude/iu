import { useTheme, THEMES } from '../hooks/useTheme'
import './KanaSettingsScreen.css'

export default function KanaSettingsScreen() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="kana-settings">
      <section className="kana-settings__section">
        <h2 className="kana-settings__section-title">Theme</h2>
        <div className="kana-settings__theme-grid">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`kana-settings__theme-card ${theme === t.id ? 'kana-settings__theme-card--active' : ''}`}
              onClick={() => setTheme(t.id)}
              aria-pressed={theme === t.id}
            >
              <span
                className="kana-settings__theme-swatch"
                style={{ background: t.preview.bg, borderColor: t.preview.fg }}
              >
                <span
                  className="kana-settings__theme-dot"
                  style={{ background: t.preview.accent }}
                />
              </span>
              <span className="kana-settings__theme-name">{t.name}</span>
              <span className="kana-settings__theme-desc">{t.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
