import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
}

export function Badge({ 
  children, 
  variant = 'gray', 
  size = 'md', 
  className,
  glow = false 
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'inline-flex items-center font-medium rounded-md border',
        {
          // Variants - ChatGPT style
          'bg-accent-100 text-accent-800 border-accent-200': variant === 'primary',
          'bg-light-100 text-dark-800 border-light-200': variant === 'secondary',
          'bg-success-100 text-success-800 border-success-200': variant === 'success',
          'bg-warning-100 text-warning-800 border-warning-200': variant === 'warning',
          'bg-error-100 text-error-800 border-error-200': variant === 'error',
          'bg-dark-700 text-light-300 border-dark-600': variant === 'gray',
          // Sizes
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
          'px-3 py-1.5 text-base': size === 'lg',
          // Glow effect
          'shadow-sm': glow,
        },
        className
      )}
    >
      {children}
    </motion.span>
  );
}