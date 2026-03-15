import { useNav } from '../context/NavContext'
import { useQuiz } from '../hooks/useQuiz'
import { useSettings } from '../hooks/useSettings'
import Button from '../components/ui/Button'
import './KanaQuizScreen.css'

const MODES = [
  {
    mode:     'kana_to_romaji',
    title:    'Kana to Romaji',
    subtitle: 'See a kana character — pick the romaji reading',
    kana:     'あ',
    accent:   'red',
  },
  {
    mode:     'romaji_to_kana',
    title:    'Romaji to Kana',
    subtitle: 'See a romaji reading — pick the kana character',
    kana:     'ka',
    accent:   'blue',
  },
  {
    mode:     'kana_match',
    title:    'Kana to Kana',
    subtitle: 'See hiragana — pick katakana, or vice versa',
    kana:     'ア',
    accent:   'ink',
  },
]

function ModeSelect({ onSelect, onSettings }) {
  return (
    <div className="menu-list">
      <div className="quiz-mode-select__header">
        <button className="quiz-mode-select__settings-btn" onClick={onSettings} aria-label="Quiz settings">
          <SettingsIcon />
        </button>
      </div>
      {MODES.map(m => (
        <button
          key={m.mode}
          className="menu-card"
          onClick={() => onSelect(m.mode)}
          aria-label={`Start ${m.title}`}
        >
          <span className="menu-card__icon" aria-hidden="true">{m.kana}</span>
          <div className="menu-card__body">
            <h2 className="menu-card__title">{m.title}</h2>
            <p className="menu-card__subtitle">{m.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

export default function KanaQuizScreen() {
  const { params, navigate } = useNav()
  const mode = params?.mode
  const { settings } = useSettings()

  const {
    question,
    phase,
    feedback,
    selected,
    lives,
    score,
    streak,
    bestStreak,
    timeLeft,
    answer,
    restart,
  } = useQuiz(mode ?? 'kana_to_romaji', settings)

  if (!mode) {
    return <ModeSelect
      onSelect={m => navigate('kana_quiz', { mode: m })}
      onSettings={() => navigate('kana_quiz_settings')}
    />
  }

  if (phase === 'gameover') {
    return (
      <div className="quiz-results">
        <div className="quiz-results__card">
          <div className="quiz-results__halftone" aria-hidden="true" />
          <p className="quiz-results__over-label">GAME OVER</p>
          <p className="quiz-results__score">{score}</p>
          <p className="quiz-results__score-label">correct answers</p>
          {bestStreak >= 3 && (
            <p className="quiz-results__streak-note">Best streak: {bestStreak}</p>
          )}
          <div className="quiz-results__actions">
            <Button variant="primary" size="lg" fullWidth onClick={restart}>Play Again</Button>
            <Button variant="ghost"   size="md" fullWidth onClick={() => navigate('home')}>Back to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  const timerPct = (timeLeft / 10) * 100
  const isJapanesePrompt = question.promptIsJapanese || mode !== 'romaji_to_kana'
  const isJapaneseOptions = question.isJapanese && mode !== 'kana_to_romaji'

  return (
    <div className="quiz-play">

      {/* HUD */}
      <div className="quiz-play__hud">
        <div className="quiz-play__lives" aria-label={`${lives} lives remaining`}>
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`quiz-play__heart ${i < lives ? '' : 'quiz-play__heart--lost'}`} aria-hidden="true">
              ♥
            </span>
          ))}
        </div>
        <div className="quiz-play__score-wrap">
          <span className="quiz-play__score" aria-label={`Score: ${score}`}>{score}</span>
          {streak >= 3 && (
            <span className="quiz-play__streak" aria-label={`${streak} streak`}>🔥 {streak}</span>
          )}
        </div>
      </div>

      {/* Timer */}
      <div
        className="quiz-play__timer-track"
        role="progressbar"
        aria-valuenow={timeLeft}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label="Time remaining"
      >
        <div
          className={`quiz-play__timer-fill ${timeLeft <= 3 ? 'quiz-play__timer-fill--urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Kana prompt card — sticky note style */}
      <div className={`quiz-play__prompt-card ${feedback ? `quiz-play__prompt-card--${feedback}` : ''}`}>
        <span className="quiz-play__tape" aria-hidden="true" />
        <div className="quiz-play__halftone" aria-hidden="true" />
        <span
          className={isJapanesePrompt ? 'quiz-play__prompt-kana' : 'quiz-play__prompt-romaji'}
          aria-label={`Question: ${question.prompt}`}
        >
          {question.prompt}
        </span>
      </div>

      {/* Options */}
      <div className="quiz-play__options" role="group" aria-label="Answer options">
        {question.options.map(opt => {
          const isSelected = selected === opt.value
          const isCorrect  = opt.value === question.correctValue
          let state = ''
          if (feedback) {
            if (isCorrect)                     state = 'correct'
            else if (isSelected && !isCorrect) state = 'wrong'
          }

          return (
            <button
              key={opt.value}
              className={`quiz-play__option ${isJapaneseOptions ? 'quiz-play__option--kana' : ''} ${state ? `quiz-play__option--${state}` : ''}`}
              onClick={() => answer(opt)}
              disabled={phase !== 'question'}
              aria-label={opt.label}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
