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
    id: 'sakura',
    name: 'Sakura',
    description: 'Soft pink & blossom',
    preview: { bg: '#fdf0f4', accent: '#c94070', fg: '#2d1a23' },
  },
  {
    id: 'dojo',
    name: 'Dojo',
    description: 'Dark ink & red',
    preview: { bg: '#1a1a1f', accent: '#e8002d', fg: '#e8e0d0' },
  },
  {
    id: 'shizen',
    name: 'Shizen',
    description: 'Natural green & earth',
    preview: { bg: '#f0f4ec', accent: '#3a8a42', fg: '#1a2e1c' },
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
