import { useState, useEffect } from 'react'

const STORAGE_KEY = 'koikata_theme_v2'

export const THEMES = [
  {
    id: 'material',
    name: 'Material You',
    description: 'Personal & adaptive',
    preview: { bg: '#FFFBFE', accent: '#6750A4', fg: '#1C1B1F' },
  },
  {
    id: 'comic',
    name: 'Comic Book',
    description: 'Hand-drawn & playful',
    preview: { bg: '#fdfbf7', accent: '#ff4d4d', fg: '#2d2d2d' },
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
    return localStorage.getItem(STORAGE_KEY) ?? 'material'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'material') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return { theme, setTheme: setThemeState, themes: THEMES }
}
