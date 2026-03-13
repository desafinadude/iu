import * as React from 'react'
import { Card } from './card'
import { cn } from '../../lib/utils'

const MenuCard = React.forwardRef(({ 
  icon, 
  title, 
  subtitle, 
  meta,
  badge,
  onClick, 
  className,
  iconClassName,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn('w-full text-left group', className)}
      {...props}
    >
      <Card 
        variant="elevated"
        className={cn(
          'overflow-hidden transition-all duration-300',
          'hover:scale-[1.01] active:scale-[0.99]',
          'hover:shadow-md3-3'
        )}
      >
        <div className="relative p-4 flex items-center gap-4">
          {/* Icon */}
          {icon && (
            <div className={cn(
              'flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground',
              'group-hover:scale-110 transition-transform',
              iconClassName
            )}>
              {typeof icon === 'string' ? (
                <span className="text-2xl font-japanese font-medium">{icon}</span>
              ) : (
                React.cloneElement(icon, { className: 'w-6 h-6' })
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {badge && (
              <div className="mb-1">{badge}</div>
            )}
            <h3 className="text-title-medium mb-0.5 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-body-small text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
            {meta && (
              <p className="text-body-small text-muted-foreground mt-1">
                {meta}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Card>
    </button>
  )
})
MenuCard.displayName = 'MenuCard'

const MenuCardList = React.forwardRef(({ children, label, className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
    {label && (
      <h2 className="text-title-small text-muted-foreground px-2">
        {label}
      </h2>
    )}
    <div className="flex flex-col gap-2">
      {children}
    </div>
  </div>
))
MenuCardList.displayName = 'MenuCardList'

export { MenuCard, MenuCardList }
