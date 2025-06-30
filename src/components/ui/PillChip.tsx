import React from 'react';

export function PillChip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full bg-accent-400/20 text-accent-400 font-semibold text-xs shadow-sm backdrop-blur ${className}`}>
      {children}
    </span>
  );
} 