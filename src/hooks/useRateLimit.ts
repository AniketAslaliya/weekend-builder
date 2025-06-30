import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix: string;
}

interface RateLimitState {
  isLimited: boolean;
  remainingRequests: number;
  resetTime: number;
}

export function useRateLimit(config: RateLimitConfig) {
  const { user } = useAuth();
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remainingRequests: config.maxRequests,
    resetTime: Date.now() + config.windowMs
  });

  const checkRateLimit = useCallback(async (action: string): Promise<boolean> => {
    if (!user) return false;

    const key = `${config.keyPrefix}:${user.id}:${action}`;
    const now = Date.now();

    try {
      // Get current rate limit state from localStorage (in production, use Redis)
      const stored = localStorage.getItem(key);
      const rateLimitData = stored ? JSON.parse(stored) : {
        count: 0,
        resetTime: now + config.windowMs
      };

      // Reset if window has expired
      if (now > rateLimitData.resetTime) {
        rateLimitData.count = 0;
        rateLimitData.resetTime = now + config.windowMs;
      }

      // Check if limit exceeded
      if (rateLimitData.count >= config.maxRequests) {
        setState({
          isLimited: true,
          remainingRequests: 0,
          resetTime: rateLimitData.resetTime
        });
        return false;
      }

      // Increment count
      rateLimitData.count += 1;
      localStorage.setItem(key, JSON.stringify(rateLimitData));

      setState({
        isLimited: false,
        remainingRequests: config.maxRequests - rateLimitData.count,
        resetTime: rateLimitData.resetTime
      });

      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error
    }
  }, [user, config]);

  const getRemainingTime = useCallback(() => {
    const now = Date.now();
    return Math.max(0, state.resetTime - now);
  }, [state.resetTime]);

  return {
    ...state,
    checkRateLimit,
    getRemainingTime
  };
}

// Specialized rate limit hooks
export function useVoteRateLimit() {
  return useRateLimit({
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'vote'
  });
}

export function useCommentRateLimit() {
  return useRateLimit({
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'comment'
  });
}

export function useSubmissionRateLimit() {
  return useRateLimit({
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'submission'
  });
}