import { motion } from 'framer-motion';

export function StartupLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="mb-4"
      >
        {/* Rocket SVG */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#shadow)">
            <path d="M32 6C33.1046 6 34 6.89543 34 8V40C34 41.1046 33.1046 42 32 42C30.8954 42 30 41.1046 30 40V8C30 6.89543 30.8954 6 32 6Z" fill="#fbbf24"/>
            <path d="M32 6C33.1046 6 34 6.89543 34 8V40C34 41.1046 33.1046 42 32 42C30.8954 42 30 41.1046 30 40V8C30 6.89543 30.8954 6 32 6Z" fill="#f59e42" fillOpacity="0.5"/>
            <ellipse cx="32" cy="48" rx="8" ry="4" fill="#60a5fa" fillOpacity="0.7"/>
            <ellipse cx="32" cy="48" rx="8" ry="4" fill="#3b82f6" fillOpacity="0.3"/>
            <path d="M32 42L36 54L32 52L28 54L32 42Z" fill="#f59e42"/>
            <path d="M32 42L36 54L32 52L28 54L32 42Z" fill="#fbbf24" fillOpacity="0.5"/>
          </g>
          <defs>
            <filter id="shadow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
            </filter>
          </defs>
        </svg>
      </motion.div>
      <div className="text-accent-400 font-bold text-lg tracking-wide animate-pulse">Launching your hustle...</div>
      <div className="text-light-400 text-xs mt-1">Startup mode: ON</div>
    </div>
  );
} 