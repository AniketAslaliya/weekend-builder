import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className = '' }: StatCardProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg rounded-xl shadow border border-accent-400/20 px-6 py-4 min-w-[120px] ${className}`}>
      {icon && <div className="mb-2 text-2xl">{icon}</div>}
      <div className="text-3xl font-bold text-accent-400 drop-shadow-glow">{value}</div>
      <div className="text-xs font-semibold text-primary/80 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
} 