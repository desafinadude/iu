import './Button.css'

export default function Button({
  children,
  variant = 'primary',  // primary | secondary | ghost
  size = 'md',          // sm | md | lg
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <LoadingDots /> : children}
    </button>
  )
}

function LoadingDots() {
  return (
    <span className="btn__dots" aria-label="Loading">
      <span /><span /><span />
    </span>
  )
}
