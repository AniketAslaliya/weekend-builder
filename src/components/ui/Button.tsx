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
      // Variants - Fixed contrast
      'bg-accent-600 hover:bg-accent-700 text-white focus:ring-accent-500 border border-accent-600 shadow-lg':
        variant === 'primary',
      'bg-white hover:bg-gray-100 text-dark-900 focus:ring-gray-300 border border-gray-200 shadow-lg':
        variant === 'secondary',
      'border-2 border-accent-500 text-accent-400 hover:bg-accent-500 hover:text-white bg-transparent focus:ring-accent-500 shadow-lg':
        variant === 'outline',
      'text-white hover:text-accent-400 hover:bg-dark-800 focus:ring-accent-500 bg-transparent':
        variant === 'ghost',
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-red-600 shadow-lg':
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
      {...(props as any)}
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