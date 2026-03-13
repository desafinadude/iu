import { Settings } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { useQuiz } from '../hooks/useQuiz'
import { useSettings } from '../hooks/useSettings'
import { Button } from '../components/ui/button'
import { MenuCard, MenuCardList } from '../components/ui/menu-card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { QuizHUD, QuizTimer, QuizPromptCard, QuizOption, QuizOptionsGrid } from '../components/ui/quiz'

const MODES = [
  {
    mode: 'kana_to_romaji',
    title: 'Kana to Romaji',
    subtitle: 'See a kana character — pick the romaji reading',
    kana: 'あ',
  },
  {
    mode: 'romaji_to_kana',
    title: 'Romaji to Kana',
    subtitle: 'See a romaji reading — pick the kana character',
    kana: 'ka',
  },
  {
    mode: 'kana_match',
    title: 'Kana to Kana',
    subtitle: 'See hiragana — pick katakana, or vice versa',
    kana: 'ア',
  },
]

function ModeSelect({ onSelect, onSettings }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-title-large">Choose a mode</h2>
        <button
          onClick={onSettings}
          className="p-2 rounded-full hover:bg-primary/10 active:scale-95 transition-all"
          aria-label="Quiz settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      <MenuCardList>
        {MODES.map((m) => (
          <MenuCard
            key={m.mode}
            icon={m.kana}
            title={m.title}
            subtitle={m.subtitle}
            onClick={() => onSelect(m.mode)}
          />
        ))}
      </MenuCardList>
    </div>
  )
}

function GameOverDialog({ open, score, bestStreak, onPlayAgain, onHome }) {
  return (
    <Dialog open={open}>
      <DialogContent className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md3-2">
          <span className="text-4xl">★</span>
        </div>
        
        <DialogHeader>
          <DialogTitle>Game Over</DialogTitle>
          <DialogDescription>
            <div className="text-4xl font-bold text-foreground my-4">{score}</div>
            <div className="text-body-medium">correct answers</div>
            {bestStreak >= 3 && (
              <div className="text-body-small mt-2">Best streak: {bestStreak} 🔥</div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="filled" size="lg" fullWidth onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button variant="text" size="md" fullWidth onClick={onHome}>
            Back to Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    return (
      <ModeSelect
        onSelect={(m) => navigate('kana_quiz', { mode: m })}
        onSettings={() => navigate('kana_quiz_settings')}
      />
    )
  }

  const isGameOver = phase === 'gameover'
  const isJapanesePrompt = question.promptIsJapanese || mode !== 'romaji_to_kana'
  const isJapaneseOptions = question.isJapanese && mode !== 'kana_to_romaji'

  return (
    <div className="flex flex-col h-full">
      {/* HUD */}
      <QuizHUD lives={lives} score={score} streak={streak} />

      {/* Timer */}
      <QuizTimer timeLeft={timeLeft} maxTime={10} urgent={3} />

      {/* Question Card */}
      <QuizPromptCard japanese={isJapanesePrompt} feedback={feedback}>
        {question.prompt}
      </QuizPromptCard>

      {/* Options */}
      <QuizOptionsGrid>
        {question.options.map((opt) => {
          const isSelected = selected === opt.value
          const isCorrect = opt.value === question.correctValue
          const showCorrect = feedback && isCorrect
          const showWrong = feedback && isSelected && !isCorrect

          return (
            <QuizOption
              key={opt.value}
              onClick={() => answer(opt)}
              disabled={phase !== 'question'}
              correct={showCorrect}
              wrong={showWrong}
              japanese={isJapaneseOptions}
              aria-label={opt.label}
            >
              {opt.label}
            </QuizOption>
          )
        })}
      </QuizOptionsGrid>

      {/* Game Over Dialog */}
      <GameOverDialog
        open={isGameOver}
        score={score}
        bestStreak={bestStreak}
        onPlayAgain={restart}
        onHome={() => navigate('home')}
      />
    </div>
  )
}
