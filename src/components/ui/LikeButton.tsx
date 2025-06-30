import React, { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface LikeButtonProps {
  projectId: string;
  className?: string;
}

export function LikeButton({ projectId, className = '' }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch like count and user like status
  useEffect(() => {
    let mounted = true;
    async function fetchLikes() {
      setLoading(true);
      // Get like count
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);
      if (mounted && typeof count === 'number') setLikeCount(count);
      // Get user like
      if (user) {
        const { data } = await supabase
          .from('votes')
          .select('id')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .single();
        setLiked(!!data);
      } else {
        setLiked(false);
      }
      setLoading(false);
    }
    fetchLikes();
    return () => { mounted = false; };
  }, [projectId, user]);

  // Like/unlike handler
  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like projects!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);
        if (!error) {
          setLiked(false);
          setLikeCount((c) => Math.max(0, c - 1));
        } else {
          toast.error('Failed to unlike.');
        }
      } else {
        // Like
        const { error } = await supabase
          .from('votes')
          .insert([{ project_id: projectId, user_id: user.id }]);
        if (!error) {
          setLiked(true);
          setLikeCount((c) => c + 1);
        } else {
          toast.error('Failed to like.');
        }
      }
    } catch (err) {
      setError('Failed to like. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async () => {
    setLoading(true);
    setError(null);
    try {
      // Unlike
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', user.id);
      if (!error) {
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        toast.error('Failed to unlike.');
      }
    } catch (err) {
      setError('Failed to unlike. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={liked ? 'primary' : 'outline'}
      size="sm"
      onClick={liked ? handleUnlike : handleLike}
      disabled={loading}
      icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (liked ? <Heart className="w-4 h-4 text-red-500" /> : <Heart className="w-4 h-4" />)}
    >
      {likeCount}
    </Button>
  );
} 