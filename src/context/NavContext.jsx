import { createContext, useContext, useState } from 'react'

const NavContext = createContext(null)

export function NavProvider({ children }) {
  const [screen, setScreen] = useState('home')
  const [params, setParams] = useState({})
  const [history, setHistory] = useState([])

  function navigate(screenName, screenParams = {}) {
    setHistory(h => [...h, { screen, params }])
    setScreen(screenName)
    setParams(screenParams)
  }

  function goBack() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setScreen(prev.screen)
    setParams(prev.params)
  }

  const canGoBack = history.length > 0

  return (
    <NavContext.Provider value={{ screen, params, navigate, goBack, canGoBack }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used within NavProvider')
  return ctx
}
