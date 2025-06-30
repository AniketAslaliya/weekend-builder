import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

interface ConfettiAnimationProps {
  trigger: boolean;
  duration?: number;
  colors?: string[];
  particleCount?: number;
}

export function ConfettiAnimation({ 
  trigger, 
  duration = 3000,
  colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'],
  particleCount = 50
}: ConfettiAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 5 + 2
        }
      }));
      
      setConfetti(pieces);
      
      // Clean up after duration
      setTimeout(() => {
        setIsActive(false);
        setConfetti([]);
      }, duration);
    }
  }, [trigger, duration, colors, particleCount]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: piece.x,
                y: piece.y,
                rotate: piece.rotation,
                scale: 1,
                opacity: 1
              }}
              animate={{
                x: piece.x + piece.velocity.x * 100,
                y: window.innerHeight + 100,
                rotate: piece.rotation + 720,
                scale: 0.5,
                opacity: 0
              }}
              transition={{
                duration: duration / 1000,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%'
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Specialized confetti components
export function SubmissionConfetti({ trigger }: { trigger: boolean }) {
  return (
    <ConfettiAnimation
      trigger={trigger}
      duration={4000}
      particleCount={75}
      colors={['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444']}
    />
  );
}

export function VoteConfetti({ trigger }: { trigger: boolean }) {
  return (
    <ConfettiAnimation
      trigger={trigger}
      duration={2000}
      particleCount={30}
      colors={['#ef4444', '#f97316']}
    />
  );
}

export function WinnerConfetti({ trigger }: { trigger: boolean }) {
  return (
    <ConfettiAnimation
      trigger={trigger}
      duration={6000}
      particleCount={100}
      colors={['#fbbf24', '#f59e0b', '#d97706', '#92400e']}
    />
  );
}