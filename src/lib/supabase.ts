import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const validateEnvVars = () => {
  const missingVars = [];
  
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    return false;
  }
  
  if (supabaseUrl === 'https://placeholder.supabase.co' || 
      supabaseUrl === 'your_supabase_project_url' ||
      supabaseAnonKey === 'your_supabase_anon_key') {
    console.warn('Using placeholder Supabase configuration. Please configure your environment variables.');
    return false;
  }
  
  return true;
};

let supabase: SupabaseClient;

if (!validateEnvVars()) {
  console.warn('Supabase environment variables not configured properly');
  // Provide fallback for development
  const fallbackUrl = 'https://placeholder.supabase.co';
  const fallbackKey = 'placeholder-key';
  
  supabase = createClient(fallbackUrl, fallbackKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} else {
  console.log('Supabase configured with:', { url: supabaseUrl, key: supabaseAnonKey?.substring(0, 20) + '...' });
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'X-Client-Info': 'weekend-builder-web',
      },
    },
  });
}

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return false;
  }
};

// Add error handling for network issues
supabase.auth.onAuthStateChange((event) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

export { supabase };

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          github_username: string | null;
          twitter_username: string | null;
          linkedin_username: string | null;
          instagram_username: string | null;
          company: string | null;
          position: string | null;
          education: string | null;
          skills: string[];
          interests: string[];
          user_type: 'solo' | 'team' | 'mentor';
          is_mentor: boolean;
          total_points: number;
          projects_count: number;
          votes_given: number;
          votes_received: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          linkedin_username?: string | null;
          instagram_username?: string | null;
          company?: string | null;
          position?: string | null;
          education?: string | null;
          skills?: string[];
          interests?: string[];
          user_type?: 'solo' | 'team' | 'mentor';
          is_mentor?: boolean;
          total_points?: number;
          projects_count?: number;
          votes_given?: number;
          votes_received?: number;
        };
        Update: {
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          linkedin_username?: string | null;
          instagram_username?: string | null;
          company?: string | null;
          position?: string | null;
          education?: string | null;
          skills?: string[];
          interests?: string[];
          user_type?: 'solo' | 'team' | 'mentor';
          is_mentor?: boolean;
          total_points?: number;
          projects_count?: number;
          votes_given?: number;
          votes_received?: number;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          theme: string | null;
          banner_url: string | null;
          start_date: string;
          end_date: string;
          status: 'upcoming' | 'active' | 'completed';
          rules: string | null;
          prizes: any[];
          sponsors: any[];
          max_team_size: number;
          created_at: string;
          updated_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          event_id: string | null;
          creator_id: string;
          title: string;
          description: string | null;
          short_description: string | null;
          tags: string[];
          project_type: string;
          demo_url: string | null;
          repo_url: string | null;
          video_url: string | null;
          images: string[];
          pitch_deck_url: string | null;
          logo_url: string | null;
          status: 'draft' | 'submitted' | 'needs_team' | 'completed';
          looking_for_team: boolean;
          team_needs: string[];
          vote_count: number;
          comment_count: number;
          remix_count: number;
          tip_count: number;
          is_featured: boolean;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};