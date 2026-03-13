import * as React from 'react'
import { Home, TrendingUp, Settings, ChevronLeft } from 'lucide-react'
import { useNav } from '../../context/NavContext'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const SCREEN_TITLES = {
  home: 'KoiKata',
  progress: 'Progress',
  settings: 'Settings',
  kana_quiz: 'Kana Quiz',
  kana_quiz_settings: 'Quiz Settings',
  word_search: 'Word Search',
  writing: 'Writing',
  verb_drill: 'Verb Dojo',
  sentence_builder: 'Sentence Builder',
}

const ROOT_SCREENS = new Set(['home', 'progress', 'settings'])

export default function AppShell({ children }) {
  const { screen, navigate, goBack, canGoBack } = useNav()
  const title = SCREEN_TITLES[screen] ?? 'KoiKata'
  const isRoot = ROOT_SCREENS.has(screen)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface shadow-md3-1">
        <div className="app-container">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Back Button or Spacer */}
            <div className="w-10">
              {!isRoot && canGoBack && (
                <button
                  onClick={goBack}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10 active:scale-95 transition-all"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Title */}
            <h1 className="text-title-large font-medium text-center flex-1">
              {title}
            </h1>

            {/* Spacer for balance */}
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="app-container h-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 bg-surface border-t border-border">
        <div className="app-container">
          <div className="flex items-center justify-around h-16">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = screen === id || (!ROOT_SCREENS.has(screen) && id === 'home' && screen !== 'progress' && screen !== 'settings')
              
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all relative min-w-[64px]',
                    'hover:bg-primary/10 active:scale-95',
                    isActive && 'text-primary'
                  )}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className={cn(
                    'text-label-small',
                    isActive && 'font-medium'
                  )}>
                    {label}
                  </span>
                  
                  {/* Active indicator pill */}
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
