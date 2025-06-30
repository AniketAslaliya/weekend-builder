import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  glow?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  glow = false,
  ...props
}: ButtonProps) {
  const baseClasses = clsx(
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-[1.02] active:scale-[0.98]',
    {
      // Variants - ChatGPT style
      'bg-accent-600 hover:bg-accent-700 text-white focus:ring-accent-500 border border-accent-600':
        variant === 'primary',
      'bg-light-100 hover:bg-light-200 text-dark-900 focus:ring-light-300 border border-light-200':
        variant === 'secondary',
      'border border-light-300 text-light-300 hover:bg-light-300 hover:text-dark-900 bg-transparent focus:ring-light-300':
        variant === 'outline',
      'text-light-300 hover:text-accent-400 hover:bg-dark-800 focus:ring-accent-500 bg-transparent':
        variant === 'ghost',
      'bg-error-600 hover:bg-error-700 text-white focus:ring-error-500 border border-error-600':
        variant === 'danger',
      // Sizes
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
      'px-8 py-4 text-lg': size === 'xl',
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
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : icon ? (
        <span className="mr-2 flex items-center">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}