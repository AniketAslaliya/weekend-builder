import { useState } from 'react';
import { clsx } from 'clsx';
import { generateSrcSet, generateWebPSrcSet } from '@/utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive image sources
  const webpSrcSet = generateWebPSrcSet(src);
  const fallbackSrcSet = generateSrcSet(src);

  if (hasError) {
    return (
      <div 
        className={clsx(
          'bg-dark-700 flex items-center justify-center text-light-400',
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture className={clsx('block', className)}>
      {/* WebP source for modern browsers */}
      <source
        srcSet={webpSrcSet}
        sizes={sizes}
        type="image/webp"
      />
      
      {/* Fallback for older browsers */}
      <img
        src={src}
        srcSet={fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={clsx(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className={clsx(
            'absolute inset-0 bg-dark-700 animate-pulse',
            className
          )}
          style={{ width, height }}
          aria-hidden="true"
        />
      )}
    </picture>
  );
}

// Specialized image components
export function HeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority
      loading="eager"
      sizes="100vw"
      className={clsx('w-full h-full object-cover', className)}
    />
  );
}

export function ProjectImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={clsx('w-full aspect-video object-cover rounded-lg', className)}
    />
  );
}

export function AvatarImage({ src, alt, size = 'md' }: { src: string; alt: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      loading="lazy"
      className={clsx('rounded-full object-cover', sizeClasses[size])}
    />
  );
}