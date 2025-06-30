import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  glow?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export function AccessibleButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  glow = false,
  fullWidth = false,
  ariaLabel,
  ariaDescribedBy,
  ...props
}: AccessibleButtonProps) {
  const baseClasses = clsx(
    // Base styles
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-[1.02] active:scale-[0.98]',
    // Minimum touch target size (44x44px)
    'min-w-[44px] min-h-[44px]',
    {
      // Variants with enhanced contrast ratios
      'bg-accent-600 hover:bg-accent-700 text-white focus-visible:ring-accent-500 border border-accent-600 shadow-lg':
        variant === 'primary',
      'bg-light-100 hover:bg-light-200 text-dark-900 focus-visible:ring-light-300 border border-light-200 shadow-md':
        variant === 'secondary',
      'border-2 border-light-300 text-light-100 hover:bg-light-300 hover:text-dark-900 bg-transparent focus-visible:ring-light-300':
        variant === 'outline',
      'text-light-200 hover:text-accent-400 hover:bg-dark-800 focus-visible:ring-accent-500 bg-transparent':
        variant === 'ghost',
      'bg-error-600 hover:bg-error-700 text-white focus-visible:ring-error-500 border border-error-600 shadow-lg':
        variant === 'danger',
      // Sizes
      'px-3 py-2 text-sm gap-2': size === 'sm',
      'px-4 py-2.5 text-sm gap-2': size === 'md',
      'px-6 py-3 text-base gap-3': size === 'lg',
      'px-8 py-4 text-lg gap-3': size === 'xl',
      // Full width
      'w-full': fullWidth,
      // Glow effect
      'shadow-lg shadow-accent-500/25': glow && variant === 'primary',
    }
  );

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={clsx(baseClasses, className)}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </>
      ) : icon ? (
        <span className="flex items-center" aria-hidden="true">{icon}</span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}

// Icon-only button with proper accessibility
export function IconButton({
  icon,
  ariaLabel,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}: Omit<AccessibleButtonProps, 'children'> & {
  icon: React.ReactNode;
  ariaLabel: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3',
    xl: 'w-14 h-14 p-4'
  };

  return (
    <AccessibleButton
      variant={variant}
      className={clsx(
        'rounded-full',
        sizeClasses[size],
        className
      )}
      ariaLabel={ariaLabel}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </AccessibleButton>
  );
}