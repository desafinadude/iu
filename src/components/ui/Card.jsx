import './Card.css'

export default function Card({
  children,
  variant = 'base',     // base | panel | postit | callout
  decoration,           // tape | tack | undefined
  className = '',
  onClick,
  ...props
}) {
  const classes = [
    'card',
    `card--${variant}`,
    onClick && 'card--interactive',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} {...props}>
      {decoration === 'tape' && <span className="card__tape" aria-hidden="true" />}
      {decoration === 'tack' && <span className="card__tack" aria-hidden="true" />}
      <div className="card__halftone" aria-hidden="true" />
      {children}
    </div>
  )
}
