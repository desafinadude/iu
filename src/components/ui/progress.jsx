import * as React from 'react'
import { cn } from '../../lib/utils'

const Progress = React.forwardRef(({ className, value, max = 100, variant = 'primary', ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-tertiary',
    destructive: 'bg-destructive',
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-muted',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full transition-all duration-300 ease-out',
          variantClasses[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
})
Progress.displayName = 'Progress'

export { Progress }
