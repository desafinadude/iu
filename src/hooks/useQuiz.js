import { useState, useEffect, useRef } from 'react'
import { buildKanaDeck, buildMatchingDeck, pickWrongOptions } from '../data/kana.js'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects.js'
import { speak } from '../utils/speech.js'

const TIMER_SECONDS = 10
const LIVES_START   = 3
const OPTIONS_COUNT = 6

export const MASTERY_MAX = 10

function getMasteryKey(mode) {
  return `koikata_mastery_v1_${mode}`
}

// The key used to look up mastery/weights for a deck item
function itemKey(mode, item) {
  return mode === 'romaji_to_kana'
    ? `${item.romaji}_${item.script}`
    : item.romaji
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Mastered items appear proportionally less (mastery=10 → ~1/6 the weight)
function effectiveWeight(sessionWeight, mastery) {
  const masteryFactor = Math.max(0.15, 1 - mastery * 0.085)
  return sessionWeight * masteryFactor
}

function pickWeighted(mode, deck, weights, mastery) {
  const total = deck.reduce((sum, c) => {
    const key = itemKey(mode, c)
    return sum + effectiveWeight(weights[key] ?? 1, mastery[key] ?? 0)
  }, 0)
  let r = Math.random() * total
  for (const c of deck) {
    const key = itemKey(mode, c)
    r -= effectiveWeight(weights[key] ?? 1, mastery[key] ?? 0)
    if (r <= 0) return c
  }
  return deck[deck.length - 1]
}

function buildQuestion(mode, deck, weights, mastery) {
  const item = pickWeighted(mode, deck, weights, mastery)

  if (mode === 'kana_to_romaji') {
    const romajiPool = Object.values(
      deck.reduce((acc, c) => { acc[c.romaji] = acc[c.romaji] ?? c; return acc }, {})
    )
    const wrong = pickWrongOptions(item.romaji, romajiPool, c => c.romaji, OPTIONS_COUNT - 1)
    const options = shuffle([item, ...wrong]).map(c => ({ label: c.romaji, value: c.romaji }))
    return { prompt: item.kana, correctValue: item.romaji, options, itemKey: item.romaji, speakText: item.kana }

  } else if (mode === 'romaji_to_kana') {
    const sameScript = deck.filter(c => c.script === item.script)
    const wrong = pickWrongOptions(item.kana, sameScript, c => c.kana, OPTIONS_COUNT - 1)
    const options = shuffle([item, ...wrong]).map(c => ({ label: c.kana, value: c.kana }))
    return { prompt: item.romaji, correctValue: item.kana, options, itemKey: `${item.romaji}_${item.script}`, isJapanese: true, speakText: item.kana }

  } else {
    const showHiragana = Math.random() < 0.5
    if (showHiragana) {
      const wrong = pickWrongOptions(item.katakana, deck, c => c.katakana, OPTIONS_COUNT - 1)
      const options = shuffle([item, ...wrong]).map(c => ({ label: c.katakana, value: c.katakana }))
      return { prompt: item.hiragana, correctValue: item.katakana, options, itemKey: item.romaji, isJapanese: true, promptIsJapanese: true, speakText: item.hiragana }
    } else {
      const wrong = pickWrongOptions(item.hiragana, deck, c => c.hiragana, OPTIONS_COUNT - 1)
      const options = shuffle([item, ...wrong]).map(c => ({ label: c.hiragana, value: c.hiragana }))
      return { prompt: item.katakana, correctValue: item.hiragana, options, itemKey: item.romaji, isJapanese: true, promptIsJapanese: true, speakText: item.katakana }
    }
  }
}

export function useQuiz(mode, settings) {
  const { activeRows, includeDakuten, includeHandakuten } = settings

  const deck =
    mode === 'kana_match'
      ? buildMatchingDeck({ activeRows, includeDakuten, includeHandakuten })
      : buildKanaDeck({ activeRows, includeDakuten, includeHandakuten })

  // Persistent mastery (survives restarts)
  const [mastery, setMastery] = useState(() => {
    try { return JSON.parse(localStorage.getItem(getMasteryKey(mode))) ?? {} }
    catch { return {} }
  })
  const masteryRef = useRef(mastery)
  masteryRef.current = mastery

  useEffect(() => {
    localStorage.setItem(getMasteryKey(mode), JSON.stringify(mastery))
  }, [mastery])

  // Session weights (reset on restart)
  const [weights,       setWeights]      = useState({})
  const [lives,         setLives]        = useState(LIVES_START)
  const [score,         setScore]        = useState(0)
  const [streak,        setStreak]       = useState(0)
  const [bestStreak,    setBestStreak]   = useState(0)
  const [timeLeft,      setTimeLeft]     = useState(TIMER_SECONDS)
  const [phase,         setPhase]        = useState('question')
  const [question,      setQuestion]     = useState(() => buildQuestion(mode, deck, {}, mastery))
  const [feedback,      setFeedback]     = useState(null)
  const [selected,      setSelected]     = useState(null)
  const [totalAnswered, setTotalAnswered] = useState(0)

  const timerRef   = useRef(null)
  const weightsRef = useRef(weights)
  weightsRef.current = weights

  function startTimer() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleWrong(null, weightsRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (phase === 'question') startTimer()
    return () => clearInterval(timerRef.current)
  }, [phase, question.prompt])

  function updateMastery(key, isCorrect) {
    setMastery(m => {
      const cur = m[key] ?? 0
      const next = isCorrect ? Math.min(MASTERY_MAX, cur + 1) : 0
      return { ...m, [key]: next }
    })
  }

  function handleWrong(chosenValue, currentWeights) {
    setFeedback('wrong')
    setPhase('feedback')
    setStreak(0)
    setTotalAnswered(n => n + 1)

    playWrongSound()
    speak(question.speakText)

    const key = question.itemKey
    updateMastery(key, false)

    const nextWeights = { ...currentWeights, [key]: (currentWeights[key] ?? 1) + 2 }
    setWeights(nextWeights)

    setLives(l => {
      const remaining = l - 1
      if (remaining <= 0) {
        setTimeout(() => setPhase('gameover'), 1200)
      } else {
        setTimeout(() => advance(nextWeights), 1200)
      }
      return remaining
    })
  }

  function answer(option) {
    if (phase !== 'question') return
    clearInterval(timerRef.current)
    setSelected(option.value)
    setTotalAnswered(n => n + 1)

    const isCorrect = option.value === question.correctValue

    speak(question.speakText)

    if (isCorrect) {
      playCorrectSound()
      setFeedback('correct')
      setPhase('feedback')
      setScore(s => s + 1)
      setStreak(s => {
        const next = s + 1
        setBestStreak(b => Math.max(b, next))
        return next
      })
      const key = question.itemKey
      updateMastery(key, true)
      const nextWeights = { ...weightsRef.current, [key]: Math.max(1, (weightsRef.current[key] ?? 1) - 0.5) }
      setWeights(nextWeights)
      setTimeout(() => advance(nextWeights), 900)
    } else {
      playWrongSound()
      handleWrong(option.value, weightsRef.current)
    }
  }

  function advance(currentWeights) {
    setQuestion(buildQuestion(mode, deck, currentWeights, masteryRef.current))
    setSelected(null)
    setFeedback(null)
    setTimeLeft(TIMER_SECONDS)
    setPhase('question')
  }

  function restart() {
    clearInterval(timerRef.current)
    const w = {}
    setWeights(w)
    setLives(LIVES_START)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTotalAnswered(0)
    setSelected(null)
    setFeedback(null)
    setTimeLeft(TIMER_SECONDS)
    setQuestion(buildQuestion(mode, deck, w, masteryRef.current))
    setPhase('question')
  }

  return {
    question,
    phase,
    feedback,
    selected,
    lives,
    score,
    streak,
    bestStreak,
    timeLeft,
    totalAnswered,
    mastery,
    deckSize: deck.length,
    answer,
    restart,
  }
}
