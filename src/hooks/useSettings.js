import { useState, useEffect } from 'react'
import { GOJUON_ROWS } from '../data/kana.js'

const STORAGE_KEY = 'koikata_quiz_settings_v1'

const DEFAULT_SETTINGS = {
  script:            'hiragana',
  activeRows:        new Set(GOJUON_ROWS.map(r => r.id)),
  includeDakuten:    true,
  includeHandakuten: true,
}

function serialize(s) {
  return JSON.stringify({ ...s, activeRows: [...s.activeRows] })
}

function deserialize(json) {
  try {
    const p = JSON.parse(json)
    return { ...p, activeRows: new Set(p.activeRows) }
  } catch {
    return null
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (deserialize(saved) ?? DEFAULT_SETTINGS) : DEFAULT_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, serialize(settings))
  }, [settings])

  function toggleRow(rowId) {
    setSettings(s => {
      const next = new Set(s.activeRows)
      if (next.has(rowId)) {
        if (next.size > 1) next.delete(rowId) // always keep at least one active
      } else {
        next.add(rowId)
      }
      return { ...s, activeRows: next }
    })
  }

  function setScript(script) {
    setSettings(s => ({ ...s, script }))
  }

  function setIncludeDakuten(v) {
    setSettings(s => ({ ...s, includeDakuten: v }))
  }

  function setIncludeHandakuten(v) {
    setSettings(s => ({ ...s, includeHandakuten: v }))
  }

  function selectAll() {
    setSettings(s => ({
      ...s,
      activeRows: new Set(GOJUON_ROWS.map(r => r.id)),
      includeDakuten: true,
      includeHandakuten: true,
    }))
  }

  function selectNone() {
    setSettings(s => ({ ...s, activeRows: new Set(['vowel']) }))
  }

  return { settings, toggleRow, setScript, setIncludeDakuten, setIncludeHandakuten, selectAll, selectNone }
}
