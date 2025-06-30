import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface LikeButtonProps {
  projectId: string;
  className?: string;
}

export function LikeButton({ projectId }: LikeButtonProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchLikeStatus = async () => {
      try {
        const { data: existingLike } = await supabase
          .from('project_likes')
          .select('*')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .single();

        setIsLiked(!!existingLike);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    const fetchLikeCount = async () => {
      try {
        const { count } = await supabase
          .from('project_likes')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);

        setLikeCount(count || 0);
      } catch (error) {
        console.error('Error fetching like count:', error);
      }
    };

    fetchLikeStatus();
    fetchLikeCount();
  }, [projectId, user]);

  const handleLike = async () => {
    if (!user) {
      // Handle not logged in state
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);

        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Like
        await supabase
          .from('project_likes')
          .insert({
            project_id: projectId,
            user_id: user.id,
          });

        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading || !user}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isLiked
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={user && !isLoading ? { scale: 1.05 } : {}}
      whileTap={user && !isLoading ? { scale: 0.95 } : {}}
      aria-label={isLiked ? 'Unlike project' : 'Like project'}
    >
      <Heart
        className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{likeCount}</span>
    </motion.button>
  );
} 