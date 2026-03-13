import * as React from 'react'
import { Card } from './card'
import { Label } from './label'
import { cn } from '../../lib/utils'

const SettingItem = React.forwardRef(({ 
  label, 
  description, 
  children,
  className,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('flex items-center justify-between gap-4', className)}
      {...props}
    >
      <div className="flex-1 space-y-0.5">
        <Label className="text-body-large">{label}</Label>
        {description && (
          <p className="text-body-small text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  )
})
SettingItem.displayName = 'SettingItem'

const SettingsGroup = React.forwardRef(({ 
  title, 
  children,
  className,
  ...props 
}, ref) => {
  return (
    <div ref={ref} className={cn('space-y-4', className)} {...props}>
      {title && (
        <h3 className="text-title-medium px-2">{title}</h3>
      )}
      <Card variant="filled" className="divide-y divide-border">
        {React.Children.map(children, (child, index) => (
          <div className="p-4">
            {child}
          </div>
        ))}
      </Card>
    </div>
  )
})
SettingsGroup.displayName = 'SettingsGroup'

export { SettingItem, SettingsGroup }
