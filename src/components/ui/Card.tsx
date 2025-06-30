import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'dark';
  glow?: boolean;
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  onClick, 
  variant = 'default',
  glow = false 
}: CardProps) {
  const Component = onClick ? motion.button : motion.div;

  const baseClasses = clsx(
    'rounded-xl border transition-all duration-200',
    {
      // Variants - ChatGPT style
      'bg-dark-800 border-dark-700 shadow-sm': variant === 'default',
      'bg-dark-800/80 backdrop-blur-sm border-dark-700/50 shadow-sm': variant === 'glass',
      'bg-dark-900 border-dark-800 shadow-sm': variant === 'dark',
      // Hover effects
      'hover:scale-[1.02] cursor-pointer hover:border-accent-600/50 hover:shadow-md': hover || onClick,
      'text-left w-full': onClick,
      // Glow effect
      'shadow-lg shadow-accent-500/10': glow,
    }
  );

  return (
    <Component
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={clsx(baseClasses, className)}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('p-6 pb-0', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('p-6 pt-0', className)}>{children}</div>;
}