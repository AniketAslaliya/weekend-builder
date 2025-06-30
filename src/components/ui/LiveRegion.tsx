import { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

export function LiveRegion({
  message,
  politeness = 'polite',
  atomic = true,
  relevant = 'all',
  className = 'sr-only'
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (regionRef.current && message) {
      // Clear and set the message to ensure screen readers announce it
      regionRef.current.textContent = '';
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
    />
  );
}

// Specialized live regions for common use cases
export function LeaderboardLiveRegion({ message }: { message: string }) {
  return (
    <LiveRegion
      message={message}
      politeness="polite"
      className="sr-only"
    />
  );
}

export function VoteLiveRegion({ message }: { message: string }) {
  return (
    <LiveRegion
      message={message}
      politeness="assertive"
      className="sr-only"
    />
  );
}

export function FormLiveRegion({ message }: { message: string }) {
  return (
    <LiveRegion
      message={message}
      politeness="assertive"
      className="sr-only"
    />
  );
}