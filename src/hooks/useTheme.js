import { useState, useEffect } from 'react'

const STORAGE_KEY = 'koikata_theme_v1'

export const THEMES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Warm paper & ink',
    preview: { bg: '#f2ece0', accent: '#8B1A1A', fg: '#2d2d2d' },
  },
]

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? 'classic'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'classic') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return { theme, setTheme: setThemeState, themes: THEMES }
}
