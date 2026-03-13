import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  // Base styles - Material You button foundation
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-label-large font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        // Filled button (Primary CTA)
        filled: 'bg-primary text-primary-foreground shadow-md3-1 hover:shadow-md3-2 hover:bg-primary/90',
        // Tonal button (Secondary actions)
        tonal: 'bg-secondary text-secondary-foreground shadow-sm hover:shadow-md3-1 hover:bg-secondary/90',
        // Outlined button
        outlined: 'border-2 border-border bg-background hover:bg-primary/10',
        // Text button (tertiary actions)
        text: 'hover:bg-primary/10',
        // Elevated button (floating)
        elevated: 'bg-surface shadow-md3-1 hover:shadow-md3-2 hover:bg-surface-container',
        // Filled tonal (tertiary color)
        'filled-tonal': 'bg-tertiary text-tertiary-foreground shadow-md3-1 hover:shadow-md3-2 hover:bg-tertiary/90',
        // Ghost (minimal)
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        // Destructive
        destructive: 'bg-destructive text-destructive-foreground shadow-md3-1 hover:shadow-md3-2 hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-4 text-label-small',
        md: 'h-11 px-6 text-label-medium',
        lg: 'h-14 px-8 text-label-large',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, fullWidth, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
