import * as React from 'react'
import { cn } from '../../lib/utils'

const QuizHUD = ({ lives, maxLives = 3, score, streak, className }) => {
  return (
    <div className={cn('flex items-center justify-between p-4 bg-surface-container', className)}>
      {/* Lives Display */}
      <div className="flex items-center gap-2" aria-label={`${lives} lives remaining`}>
        {[...Array(maxLives)].map((_, i) => (
          <span
            key={i}
            className={cn(
              'text-2xl transition-all duration-200',
              i < lives 
                ? 'text-destructive scale-100' 
                : 'text-muted-foreground/30 scale-75'
            )}
            aria-hidden="true"
          >
            ♥
          </span>
        ))}
      </div>
      
      {/* Score and Streak */}
      <div className="flex items-center gap-3">
        <span className="text-title-large font-bold" aria-label={`Score: ${score}`}>
          {score}
        </span>
        {streak >= 3 && (
          <span className="text-title-medium" aria-label={`${streak} streak`}>
            🔥 {streak}
          </span>
        )}
      </div>
    </div>
  )
}

const QuizTimer = ({ timeLeft, maxTime = 10, urgent = 3, className }) => {
  const isUrgent = timeLeft <= urgent
  
  return (
    <div
      className={cn('h-1 w-full bg-muted overflow-hidden', className)}
      role="progressbar"
      aria-valuenow={timeLeft}
      aria-valuemin={0}
      aria-valuemax={maxTime}
      aria-label="Time remaining"
    >
      <div
        className={cn(
          'h-full transition-all duration-300 ease-linear',
          isUrgent ? 'bg-destructive' : 'bg-primary'
        )}
        style={{ width: `${(timeLeft / maxTime) * 100}%` }}
      />
    </div>
  )
}

const QuizPromptCard = ({ 
  children, 
  japanese = true, 
  feedback = null,
  className 
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div
        className={cn(
          'w-full max-w-sm p-8 text-center transition-all duration-300',
          'bg-surface rounded-3xl shadow-md3-2',
          feedback === 'correct' && 'animate-pulse-success bg-green-50',
          feedback === 'wrong' && 'animate-shake bg-red-50',
          className
        )}
      >
        <div
          className={cn(
            'text-6xl font-bold',
            japanese ? 'font-japanese' : 'font-sans'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

const QuizOption = ({ 
  children, 
  onClick, 
  disabled, 
  selected = false,
  correct = false,
  wrong = false,
  japanese = false,
  className 
}) => {
  let variant = 'default'
  if (correct) variant = 'correct'
  else if (wrong) variant = 'wrong'
  else if (selected) variant = 'selected'
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-4 rounded-2xl transition-all duration-200',
        'active:scale-95',
        japanese ? 'text-3xl font-japanese' : 'text-xl font-sans',
        variant === 'default' && 'bg-surface shadow-md3-1 hover:shadow-md3-2',
        variant === 'selected' && 'bg-primary/10 shadow-md3-1 border-2 border-primary',
        variant === 'correct' && 'bg-green-500 text-white shadow-md3-2',
        variant === 'wrong' && 'bg-destructive text-destructive-foreground shadow-md3-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}

const QuizOptionsGrid = ({ children, className }) => {
  return (
    <div 
      className={cn('p-4 pb-8 grid grid-cols-2 gap-3', className)}
      role="group" 
      aria-label="Answer options"
    >
      {children}
    </div>
  )
}

export {
  QuizHUD,
  QuizTimer,
  QuizPromptCard,
  QuizOption,
  QuizOptionsGrid,
}
