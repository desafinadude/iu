import { useState, useEffect } from 'react'

const STORAGE_KEY = 'koikata_theme_v1'

export const THEMES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Warm paper & ink',
    preview: { bg: '#f2ece0', accent: '#8B1A1A', fg: '#2d2d2d' },
  },
  {
    id: 'swiss',
    name: 'Swiss',
    description: 'International Typographic',
    preview: { bg: '#FFFFFF', accent: '#FF3000', fg: '#000000' },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Geometric pop & energy',
    preview: { bg: '#FFFDF5', accent: '#8B5CF6', fg: '#1E293B' },
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: 'Neon retro-future',
    preview: { bg: '#090014', accent: '#FF00FF', fg: '#00FFFF' },
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
