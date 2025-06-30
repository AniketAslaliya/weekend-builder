import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import { useXPSystem } from '@/hooks/useXPSystem';
import { clsx } from 'clsx';

interface XPProgressBarProps {
  currentXP: number;
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function XPProgressBar({ 
  currentXP, 
  showLevel = true, 
  size = 'md',
  className 
}: XPProgressBarProps) {
  const { getLevel, getXPForNextLevel, getXPProgress } = useXPSystem();
  
  const level = getLevel(currentXP);
  const xpForNext = getXPForNextLevel(currentXP);
  const progress = getXPProgress(currentXP);

  const sizeClasses = {
    sm: 'h-2 text-xs',
    md: 'h-3 text-sm',
    lg: 'h-4 text-base'
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {showLevel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-warning-500" />
            <span className={clsx('font-bold text-white', sizeClasses[size])}>
              Level {level}
            </span>
          </div>
          <span className={clsx('text-light-400', sizeClasses[size])}>
            {xpForNext} XP to next level
          </span>
        </div>
      )}
      
      <div className="relative">
        <div className={clsx(
          'w-full bg-dark-700 rounded-full overflow-hidden',
          sizeClasses[size]
        )}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full relative"
          >
            {/* Animated shine effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3,
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
        
        {/* XP indicator */}
        {progress > 10 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx(
              'font-bold text-white drop-shadow-sm',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm'
            )}>
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-light-400">
        <span>{currentXP} XP</span>
        <span>{(level + 1) * 100} XP</span>
      </div>
    </div>
  );
}

// Compact XP display for cards
export function XPBadge({ xp, className }: { xp: number; className?: string }) {
  const { getLevel } = useXPSystem();
  const level = getLevel(xp);

  return (
    <div className={clsx(
      'inline-flex items-center space-x-1 px-2 py-1 bg-warning-600 text-white rounded-full text-xs font-bold',
      className
    )}>
      <Zap className="w-3 h-3" />
      <span>L{level}</span>
      <span className="text-warning-200">({xp} XP)</span>
    </div>
  );
}