/*
  # Create profiles table for user data

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `display_name` (text, required)
      - `avatar_url` (text, optional)
      - `bio` (text, optional)
      - `location` (text, optional)
      - `website` (text, optional)
      - `github_username` (text, optional)
      - `twitter_username` (text, optional)
      - `linkedin_username` (text, optional)
      - `instagram_username` (text, optional)
      - `company` (text, optional)
      - `position` (text, optional)
      - `education` (text, optional)
      - `skills` (text array, default empty)
      - `interests` (text array, default empty)
      - `user_type` (text, default 'solo')
      - `is_mentor` (boolean, default false)
      - `total_points` (integer, default 0)
      - `projects_count` (integer, default 0)
      - `votes_given` (integer, default 0)
      - `votes_received` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to read all profiles
    - Add policy for users to update their own profile
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  website text,
  github_username text,
  twitter_username text,
  linkedin_username text,
  instagram_username text,
  company text,
  position text,
  education text,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  user_type text DEFAULT 'solo' CHECK (user_type IN ('solo', 'team', 'mentor')),
  is_mentor boolean DEFAULT false,
  total_points integer DEFAULT 0,
  projects_count integer DEFAULT 0,
  votes_given integer DEFAULT 0,
  votes_received integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();