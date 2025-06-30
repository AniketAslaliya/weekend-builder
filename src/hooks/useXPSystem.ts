import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface XPAction {
  type: 'comment' | 'vote' | 'project_submit' | 'team_join' | 'mentor_feedback';
  points: number;
  description: string;
}

const XP_ACTIONS: Record<string, XPAction> = {
  comment: { type: 'comment', points: 10, description: 'Constructive comment' },
  vote: { type: 'vote', points: 2, description: 'Project vote' },
  project_submit: { type: 'project_submit', points: 50, description: 'Project submission' },
  team_join: { type: 'team_join', points: 25, description: 'Joined a team' },
  mentor_feedback: { type: 'mentor_feedback', points: 20, description: 'Mentor feedback' }
};

export function useXPSystem() {
  const { user, updateProfile } = useAuth();
  const [isAwarding, setIsAwarding] = useState(false);

  const awardXP = useCallback(async (actionType: keyof typeof XP_ACTIONS, multiplier: number = 1) => {
    if (!user || isAwarding) return;

    const action = XP_ACTIONS[actionType];
    if (!action) return;

    setIsAwarding(true);

    try {
      const points = action.points * multiplier;
      
      // Update user's XP in database
      const { error } = await updateProfile({
        total_points: (user.user_metadata?.total_points || 0) + points
      });

      if (error) {
        console.error('Failed to award XP:', error);
        return;
      }

      // Show XP notification
      toast.success(`+${points} XP - ${action.description}`, {
        icon: '⭐',
        duration: 3000,
        style: {
          background: '#0ea5e9',
          color: '#ffffff',
        }
      });

      // Check for level up
      const newTotal = (user.user_metadata?.total_points || 0) + points;
      const oldLevel = Math.floor((user.user_metadata?.total_points || 0) / 100);
      const newLevel = Math.floor(newTotal / 100);

      if (newLevel > oldLevel) {
        toast.success(`🎉 Level Up! You're now level ${newLevel}!`, {
          duration: 5000,
          style: {
            background: '#22c55e',
            color: '#ffffff',
          }
        });
      }

    } catch (error) {
      console.error('XP award failed:', error);
    } finally {
      setIsAwarding(false);
    }
  }, [user, updateProfile, isAwarding]);

  const getLevel = useCallback((xp: number) => {
    return Math.floor(xp / 100);
  }, []);

  const getXPForNextLevel = useCallback((xp: number) => {
    const currentLevel = getLevel(xp);
    const nextLevelXP = (currentLevel + 1) * 100;
    return nextLevelXP - xp;
  }, [getLevel]);

  const getXPProgress = useCallback((xp: number) => {
    const currentLevel = getLevel(xp);
    const levelStartXP = currentLevel * 100;
    const levelEndXP = (currentLevel + 1) * 100;
    return ((xp - levelStartXP) / (levelEndXP - levelStartXP)) * 100;
  }, [getLevel]);

  return {
    awardXP,
    getLevel,
    getXPForNextLevel,
    getXPProgress,
    isAwarding,
    XP_ACTIONS
  };
}