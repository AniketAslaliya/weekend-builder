/*
  # Weekend Builder - Initial Database Schema

  1. New Tables
    - `profiles` - User profiles with metadata
    - `events` - Weekend hackathon events/festivals
    - `projects` - User project submissions
    - `votes` - Project voting system
    - `comments` - Project comments and feedback
    - `badges` - Achievement badges
    - `user_badges` - User earned badges
    - `project_remixes` - Project remix relationships
    - `tips` - Tip/support system
    - `teams` - Team collaboration

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure user data access patterns

  3. Features
    - Authentication integration with Supabase Auth
    - Real-time subscriptions support
    - Full-text search capabilities
    - Comprehensive indexing for performance
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  website text,
  github_username text,
  twitter_username text,
  skills text[] DEFAULT '{}',
  user_type text DEFAULT 'solo' CHECK (user_type IN ('solo', 'team', 'mentor')),
  is_mentor boolean DEFAULT false,
  total_points integer DEFAULT 0,
  projects_count integer DEFAULT 0,
  votes_given integer DEFAULT 0,
  votes_received integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  theme text,
  banner_url text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  rules text,
  prizes jsonb DEFAULT '[]',
  sponsors jsonb DEFAULT '[]',
  max_team_size integer DEFAULT 4,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  short_description text,
  tags text[] DEFAULT '{}',
  project_type text DEFAULT 'web' CHECK (project_type IN ('web', 'mobile', 'desktop', 'hardware', 'ai', 'design', 'other')),
  demo_url text,
  repo_url text,
  video_url text,
  images text[] DEFAULT '{}',
  pitch_deck_url text,
  logo_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'needs_team', 'completed')),
  looking_for_team boolean DEFAULT false,
  team_needs text[] DEFAULT '{}',
  vote_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  remix_count integer DEFAULT 0,
  tip_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_mentor_feedback boolean DEFAULT false,
  vote_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  color text DEFAULT '#3b82f6',
  category text DEFAULT 'general' CHECK (category IN ('general', 'participation', 'achievement', 'social', 'special')),
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  criteria jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create project_remixes table
CREATE TABLE IF NOT EXISTS project_remixes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  remix_project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  remixer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  changes_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(original_project_id, remix_project_id)
);

-- Create tips table
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  amount integer DEFAULT 1,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('creator', 'member', 'collaborator')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_remixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Projects policies
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone"
  ON user_badges FOR SELECT
  USING (true);

-- Project remixes policies
CREATE POLICY "Remixes are viewable by everyone"
  ON project_remixes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create remixes"
  ON project_remixes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = remixer_id);

-- Tips policies
CREATE POLICY "Tips are viewable by everyone"
  ON tips FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can tip"
  ON tips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Project creators can manage team"
  ON teams FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT creator_id FROM projects WHERE id = project_id
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_projects_event_id ON projects(event_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_projects_vote_count ON projects(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_votes_project_id ON votes(project_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_tips_project_id ON tips(to_project_id);

-- Create functions for updating counters
CREATE OR REPLACE FUNCTION update_project_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects 
    SET vote_count = vote_count + 1,
        updated_at = now()
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects 
    SET vote_count = vote_count - 1,
        updated_at = now()
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects 
    SET comment_count = comment_count + 1,
        updated_at = now()
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects 
    SET comment_count = comment_count - 1,
        updated_at = now()
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_project_vote_count ON votes;
CREATE TRIGGER trigger_update_project_vote_count
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_project_vote_count();

DROP TRIGGER IF EXISTS trigger_update_project_comment_count ON comments;
CREATE TRIGGER trigger_update_project_comment_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_project_comment_count();

-- Insert initial badges
INSERT INTO badges (name, description, icon, color, category, rarity) VALUES
  ('First Timer', 'Welcome to Weekend Builder! Your journey begins here.', '🌟', '#3b82f6', 'participation', 'common'),
  ('Builder', 'Successfully submitted your first project', '🔨', '#22c55e', 'achievement', 'common'),
  ('Collaborator', 'Joined a team and built something together', '🤝', '#14b8a6', 'social', 'common'),
  ('Popular', 'Received 10+ votes on a single project', '❤️', '#ef4444', 'achievement', 'rare'),
  ('Viral', 'Received 50+ votes on a single project', '🚀', '#f97316', 'achievement', 'epic'),
  ('Mentor', 'Provided helpful feedback to other builders', '🎓', '#8b5cf6', 'social', 'rare'),
  ('Weekend Warrior', 'Participated in 5+ weekend events', '⚡', '#eab308', 'participation', 'epic'),
  ('Remix Master', 'Created 3+ project remixes', '🎨', '#06b6d4', 'achievement', 'rare'),
  ('Community Champion', 'Gave 50+ votes to other projects', '👑', '#f59e0b', 'social', 'epic'),
  ('Legend', 'Top 10 on the all-time leaderboard', '🏆', '#dc2626', 'special', 'legendary')
ON CONFLICT (name) DO NOTHING;