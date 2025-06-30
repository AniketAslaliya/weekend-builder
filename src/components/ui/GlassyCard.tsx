import React from 'react';

export function GlassyCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-accent-400/20 p-6 ${className}`}>
      {children}
    </div>
  );
} 