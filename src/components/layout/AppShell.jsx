import { useNav } from '../../context/NavContext'
import './AppShell.css'

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',    icon: HomeIcon },
  { id: 'progress', label: 'Progress', icon: ProgressIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

const SCREEN_TITLES = {
  home:        'KoiKata',
  progress:    'Progress',
  settings:    'Quiz Settings',
  kana_quiz:   'Kana Quiz',
  word_search: 'Word Search',
}

const ROOT_SCREENS = new Set(['home', 'progress', 'settings'])

export default function AppShell({ children }) {
  const { screen, navigate, goBack, canGoBack } = useNav()
  const title = SCREEN_TITLES[screen] ?? 'KoiKata'
  const isRoot = ROOT_SCREENS.has(screen)

  return (
    <div className="shell">
      <header className="shell__header">
        <div className="shell__inner">
          <div className="shell__header-inner">
            {!isRoot && canGoBack ? (
              <button className="shell__back" onClick={goBack} aria-label="Go back">
                <BackIcon />
              </button>
            ) : (
              <div className="shell__header-end" />
            )}
            <h1 className="shell__title">{title}</h1>
            <div className="shell__header-end" />
          </div>
        </div>
      </header>

      <main className="shell__content">
        <div className="shell__inner" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </main>

      <nav className="shell__bottom-nav" aria-label="Main navigation">
        <div className="shell__inner" style={{ display: 'flex', width: '100%' }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = screen === id || (!ROOT_SCREENS.has(screen) && id === 'home' && screen !== 'progress' && screen !== 'settings')
            return (
              <button
                key={id}
                className={`shell__nav-btn ${active ? 'shell__nav-btn--active' : ''}`}
                onClick={() => navigate(id)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon />
                <span className="shell__nav-label">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}
function ProgressIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}
