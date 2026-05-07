import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
  leftIcon?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 disabled:bg-indigo-300',
  secondary:
    'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 disabled:bg-rose-300',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300',
}

export const Button = ({
  variant = 'primary',
  loading = false,
  leftIcon,
  className,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-60',
      variantClass[variant],
      className,
    )}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <span
        className={cn(
          'size-4 animate-spin rounded-full border-2 border-t-transparent',
          variant === 'primary' || variant === 'danger'
            ? 'border-white/40 border-t-white'
            : 'border-slate-300 border-t-slate-800',
        )}
        aria-hidden
      />
    ) : (
      leftIcon
    )}
    {children}
  </button>
)
