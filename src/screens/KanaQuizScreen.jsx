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

function ModeSelect({ onSelect }) {
  return (
    <div className="quiz-mode-select">
      <p className="quiz-mode-select__subtitle">Choose a mode</p>
      {MODES.map(m => (
        <button
          key={m.mode}
          className="mode-card"
          onClick={() => onSelect(m.mode)}
          aria-label={`Start ${m.title}`}
        >
          <div className="mode-card__halftone" aria-hidden="true" />
          <span className="mode-card__kana" aria-hidden="true">{m.kana}</span>
          <div className="mode-card__body">
            <h2 className="mode-card__title">{m.title}</h2>
            <p className="mode-card__subtitle">{m.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
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
    return <ModeSelect onSelect={m => navigate('kana_quiz', { mode: m })} />
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
