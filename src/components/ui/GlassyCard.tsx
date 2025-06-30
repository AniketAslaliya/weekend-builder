import React from 'react';

interface GlassyCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

export function GlassyCard({ children, className = '', onClick, glow = false }: GlassyCardProps) {
  return (
    <div 
      className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-accent-400/20 p-6 ${className} ${glow ? 'shadow-accent-500/25' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 