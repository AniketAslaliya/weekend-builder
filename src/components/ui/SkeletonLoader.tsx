import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'image';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function SkeletonLoader({ 
  variant = 'text', 
  width, 
  height, 
  className,
  count = 1 
}: SkeletonLoaderProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'w-full h-64 rounded-xl';
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'button':
        return 'w-24 h-10 rounded-lg';
      case 'image':
        return 'w-full h-48 rounded-lg';
      default:
        return 'h-4 rounded';
    }
  };

  const skeletonElement = (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={clsx(
        'bg-gradient-to-r from-dark-700 via-dark-600 to-dark-700 bg-[length:200%_100%] animate-gradient',
        getVariantClasses(),
        className
      )}
      style={{ width, height }}
      role="status"
      aria-label="Loading content"
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {skeletonElement}
        </div>
      ))}
    </div>
  );
}

// Specialized skeleton components
export function ProjectCardSkeleton() {
  return (
    <div className="bg-dark-800 rounded-xl p-6 space-y-4" role="status" aria-label="Loading project">
      <SkeletonLoader variant="image" className="aspect-video" />
      <SkeletonLoader width="75%" height="1.5rem" />
      <SkeletonLoader count={2} />
      <div className="flex items-center space-x-3">
        <SkeletonLoader variant="avatar" />
        <SkeletonLoader width="40%" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <SkeletonLoader width="3rem" />
          <SkeletonLoader width="3rem" />
          <SkeletonLoader width="3rem" />
        </div>
        <SkeletonLoader variant="button" />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="bg-dark-800 rounded-xl overflow-hidden" role="status" aria-label="Loading event">
      <SkeletonLoader variant="image" className="aspect-video" />
      <div className="p-6 space-y-4">
        <SkeletonLoader width="60%" height="1.5rem" />
        <SkeletonLoader count={3} />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
        <SkeletonLoader variant="button" className="w-full" />
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading leaderboard">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="bg-dark-800 rounded-xl p-6 flex items-center space-x-6">
          <SkeletonLoader width="3rem" height="3rem" className="rounded-full" />
          <SkeletonLoader variant="avatar" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader width="50%" />
            <SkeletonLoader width="30%" />
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <SkeletonLoader width="3rem" />
            <SkeletonLoader width="3rem" />
            <SkeletonLoader width="3rem" />
            <SkeletonLoader width="3rem" />
          </div>
        </div>
      ))}
    </div>
  );
}