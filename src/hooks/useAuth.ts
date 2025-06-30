import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Check if Supabase is properly configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
                              import.meta.env.VITE_SUPABASE_ANON_KEY &&
                              import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured properly');
      setLoading(false);
      return;
    }

    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Create profile when user signs up
        if (session?.user && event === 'SIGNED_UP') {
          await createUserProfile(session.user);
        }

        // Show appropriate messages
        if (event === 'SIGNED_IN' && session?.user) {
          toast.success('🚀 Welcome back, builder!');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Signed out successfully');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured]);

  const createUserProfile = useCallback(async (user: User) => {
    if (!isSupabaseConfigured) return;
    
    try {
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', checkError);
        return;
      }

      if (existingProfile) {
        console.log('Profile already exists');
        return;
      }

      // Create new profile
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'builder',
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: 'passionate builder creating amazing projects',
            user_type: 'solo',
            is_mentor: false,
            total_points: 0,
            projects_count: 0,
            votes_given: 0,
            votes_received: 0
          }
        ]);
      
      if (error) {
        console.error('Error creating profile:', error);
        toast.error('Failed to create user profile');
      } else {
        console.log('Profile created successfully');
        toast.success('Profile created successfully!');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create user profile');
    }
  }, [isSupabaseConfigured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const error = new Error('Supabase not configured. Please check your environment variables.');
      return { data: null, error };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }

      // After successful sign in, ensure profile exists
      if (data?.user) {
        await createUserProfile(data.user);
      }

      return { data, error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign in error:', authError);
      return { data: null, error: authError };
    }
  }, [isSupabaseConfigured, createUserProfile]);

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    if (!isSupabaseConfigured) {
      const error = new Error('Supabase not configured. Please check your environment variables.');
      return { data: null, error };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: metadata?.display_name || email.split('@')[0],
            ...metadata,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign up error:', authError);
      return { data: null, error: authError };
    }
  }, [isSupabaseConfigured]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign out error:', authError);
      return { error: authError };
    }
  }, [isSupabaseConfigured]);

  const updateProfile = useCallback(async (updates: any) => {
    if (!user || !isSupabaseConfigured) {
      return { error: new Error('No user logged in or Supabase not configured') };
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Profile update error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error };
    }
  }, [user, isSupabaseConfigured]);

  const getProfile = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      return { data: null, error: new Error('No user logged in or Supabase not configured') };
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Get profile error:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return { data: null, error };
    }
  }, [user, isSupabaseConfigured]);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getProfile,
    isSupabaseConfigured,
  };
}