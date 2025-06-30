/*
  # Enhanced Events System Migration

  1. New Tables
    - `events` - Core event information with enhanced fields
    - `event_announcements` - Event-specific announcements
    - `event_mini_challenges` - Gamification challenges for events
    - `event_winners` - Winner announcements and prizes
    - `user_event_participation` - Track user participation in events
    - `user_mini_challenge_progress` - Track user progress on challenges

  2. Security
    - Enable RLS on all new tables
    - Add policies for public viewing and admin management
    - Admin access restricted to specific email

  3. Sample Data
    - 6 diverse sample events with full details
    - Announcements and challenges for active events
    - Proper JSON structure for prizes and sponsors
*/

-- First, let's check and add missing columns to existing events table if it exists
DO $$ 
BEGIN
  -- Add missing columns to events table if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'category') THEN
      ALTER TABLE events ADD COLUMN category text DEFAULT 'general';
    END IF;
    
    -- Add emoji column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'emoji') THEN
      ALTER TABLE events ADD COLUMN emoji text;
    END IF;
    
    -- Add featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'featured') THEN
      ALTER TABLE events ADD COLUMN featured boolean DEFAULT false;
    END IF;
    
    -- Add total_prize_pool column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'total_prize_pool') THEN
      ALTER TABLE events ADD COLUMN total_prize_pool integer DEFAULT 0;
    END IF;
    
    -- Add participant_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'participant_count') THEN
      ALTER TABLE events ADD COLUMN participant_count integer DEFAULT 0;
    END IF;
    
    -- Add project_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'project_count') THEN
      ALTER TABLE events ADD COLUMN project_count integer DEFAULT 0;
    END IF;
    
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'location') THEN
      ALTER TABLE events ADD COLUMN location text DEFAULT 'Global (Online)';
    END IF;
    
    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'created_by') THEN
      ALTER TABLE events ADD COLUMN created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Add theme column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'theme') THEN
      ALTER TABLE events ADD COLUMN theme text;
    END IF;
    
    -- Add banner_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'banner_url') THEN
      ALTER TABLE events ADD COLUMN banner_url text;
    END IF;
  END IF;
END $$;

-- Create events table if it doesn't exist (with all required columns)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  theme text,
  emoji text,
  banner_url text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  category text DEFAULT 'general',
  rules text,
  prizes jsonb DEFAULT '[]',
  sponsors jsonb DEFAULT '[]',
  max_team_size integer DEFAULT 4,
  featured boolean DEFAULT false,
  total_prize_pool integer DEFAULT 0,
  participant_count integer DEFAULT 0,
  project_count integer DEFAULT 0,
  location text DEFAULT 'Global (Online)',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event announcements table
CREATE TABLE IF NOT EXISTS event_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'important', 'reminder', 'warning')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create event mini challenges table
CREATE TABLE IF NOT EXISTS event_mini_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  reward text NOT NULL,
  total_required integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create event winners table
CREATE TABLE IF NOT EXISTS event_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  place text NOT NULL, -- 'grand_prize', 'runner_up', 'third_place', etc.
  prize_amount text,
  prize_description text,
  announced_at timestamptz DEFAULT now(),
  announced_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create user event participation table
CREATE TABLE IF NOT EXISTS user_event_participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Create user mini challenge progress table
CREATE TABLE IF NOT EXISTS user_mini_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES event_mini_challenges(id) ON DELETE CASCADE NOT NULL,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, challenge_id)
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_mini_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_event_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mini_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones

-- Events policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can create events" ON events;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admins can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'admin@weekendbuilder.com'
    )
  );

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can update events" ON events;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'admin@weekendbuilder.com'
    )
  );

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can delete events" ON events;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'admin@weekendbuilder.com'
    )
  );

-- Event announcements policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON event_announcements;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Announcements are viewable by everyone"
  ON event_announcements FOR SELECT
  USING (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can create announcements" ON event_announcements;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admins can create announcements"
  ON event_announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'admin@weekendbuilder.com'
    )
  );

-- Event mini challenges policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Mini challenges are viewable by everyone" ON event_mini_challenges;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Mini challenges are viewable by everyone"
  ON event_mini_challenges FOR SELECT
  USING (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage mini challenges" ON event_mini_challenges;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admins can manage mini challenges"
  ON event_mini_challenges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'admin@weekendbuilder.com'
    )
  );

-- Event winners policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Winners are viewable by everyone" ON event_winners;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Winners are viewable by everyone"
  ON event_winners FOR SELECT
  USING (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can announce winners" ON event_winners;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admins can announce winners"
  ON event_winners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email = 'admin@weekendbuilder.com'
    )
  );

-- User event participation policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Participation is viewable by everyone" ON user_event_participation;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Participation is viewable by everyone"
  ON user_event_participation FOR SELECT
  USING (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can join events" ON user_event_participation;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can join events"
  ON user_event_participation FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User mini challenge progress policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Progress is viewable by everyone" ON user_mini_challenge_progress;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Progress is viewable by everyone"
  ON user_mini_challenge_progress FOR SELECT
  USING (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update their progress" ON user_mini_challenge_progress;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can update their progress"
  ON user_mini_challenge_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance (only if columns exist)
DO $$ 
BEGIN
  -- Check if columns exist before creating indexes
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
    CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'category') THEN
    CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'featured') THEN
    CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'start_date') THEN
    CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_event_announcements_event_id ON event_announcements(event_id);
CREATE INDEX IF NOT EXISTS idx_event_mini_challenges_event_id ON event_mini_challenges(event_id);
CREATE INDEX IF NOT EXISTS idx_event_winners_event_id ON event_winners(event_id);
CREATE INDEX IF NOT EXISTS idx_user_event_participation_user_id ON user_event_participation(user_id);
CREATE INDEX IF NOT EXISTS idx_user_event_participation_event_id ON user_event_participation(event_id);

-- Create functions for updating counters
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET participant_count = participant_count + 1,
        updated_at = now()
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET participant_count = participant_count - 1,
        updated_at = now()
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_event_project_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.event_id IS NOT NULL THEN
    UPDATE events 
    SET project_count = project_count + 1,
        updated_at = now()
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.event_id IS NOT NULL THEN
    UPDATE events 
    SET project_count = project_count - 1,
        updated_at = now()
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_event_participant_count ON user_event_participation;
CREATE TRIGGER trigger_update_event_participant_count
  AFTER INSERT OR DELETE ON user_event_participation
  FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();

-- Only create project trigger if projects table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    DROP TRIGGER IF EXISTS trigger_update_event_project_count ON projects;
    CREATE TRIGGER trigger_update_event_project_count
      AFTER INSERT OR DELETE ON projects
      FOR EACH ROW EXECUTE FUNCTION update_event_project_count();
  END IF;
END $$;

-- Insert sample events (only if they don't exist)
INSERT INTO events (
  title, 
  description, 
  theme, 
  emoji,
  start_date, 
  end_date, 
  status, 
  category,
  rules,
  prizes,
  sponsors,
  max_team_size,
  featured,
  total_prize_pool,
  location,
  banner_url
) 
SELECT * FROM (VALUES
  (
    'AI-Powered Solutions Weekend',
    'Create innovative solutions using artificial intelligence to solve real-world problems and win amazing prizes.',
    'Build the future with AI 🤖',
    '🤖',
    '2025-01-18T09:00:00Z'::timestamptz,
    '2025-01-19T21:00:00Z'::timestamptz,
    'active',
    'AI',
    '# Event Rules & Guidelines

## 🎯 Objective
Build innovative AI-powered solutions that solve real-world problems.

## 📋 Requirements
- Projects must incorporate AI/ML technologies
- All code must be original work created during the event
- Teams can have 1-4 members
- Must include a demo video (max 3 minutes)

## 🏆 Judging Criteria
- Innovation (25%)
- Technical Excellence (25%)
- Impact (25%)
- Presentation (25%)',
    '[
      {"place": "Grand Prize", "amount": "$5,000", "description": "Best overall AI solution"},
      {"place": "Runner-up", "amount": "$2,500", "description": "Second best solution"},
      {"place": "Third Place", "amount": "$1,000", "description": "Third best solution"}
    ]'::jsonb,
    '[
      {"name": "OpenAI", "logo": "🤖", "tier": "Platinum"},
      {"name": "Google Cloud", "logo": "☁️", "tier": "Gold"}
    ]'::jsonb,
    4,
    true,
    15000,
    'Global (Online)',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ),
  (
    'Startup MVP Weekend',
    'Launch a minimum viable product, solo or as a team. Build the next big thing in just 48 hours.',
    'Launch your startup dream 🚀',
    '🚀',
    '2025-01-25T09:00:00Z'::timestamptz,
    '2025-01-26T21:00:00Z'::timestamptz,
    'upcoming',
    'Startup',
    '# Startup MVP Rules

## 🎯 Build Your MVP
Create a minimum viable product that solves a real problem.

## 📋 Requirements
- Must be a viable business idea
- Include business model canvas
- Create working prototype
- Pitch presentation required',
    '[
      {"place": "Grand Prize", "amount": "$3,000", "description": "Best MVP"},
      {"place": "Runner-up", "amount": "$1,500", "description": "Second best MVP"}
    ]'::jsonb,
    '[
      {"name": "Y Combinator", "logo": "🚀", "tier": "Platinum"},
      {"name": "Stripe", "logo": "💳", "tier": "Gold"}
    ]'::jsonb,
    5,
    false,
    8000,
    'Global (Online)',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ),
  (
    'Wellness & Self-Care Builders',
    'Build technology solutions for well-being, mental health, and self-care to help people live better lives.',
    'Tech for wellness and health 🌱',
    '🌱',
    '2025-02-01T09:00:00Z'::timestamptz,
    '2025-02-02T21:00:00Z'::timestamptz,
    'upcoming',
    'Health',
    '# Wellness Tech Guidelines

## 🎯 Focus on Well-being
Create solutions that promote mental and physical health.

## 📋 Requirements
- Focus on wellness, mental health, or self-care
- Evidence-based approaches preferred
- User privacy and safety paramount',
    '[
      {"place": "Grand Prize", "amount": "$2,500", "description": "Best wellness solution"},
      {"place": "Runner-up", "amount": "$1,000", "description": "Second best solution"}
    ]'::jsonb,
    '[
      {"name": "Headspace", "logo": "🧘", "tier": "Platinum"},
      {"name": "Calm", "logo": "🌸", "tier": "Gold"}
    ]'::jsonb,
    3,
    true,
    6000,
    'Global (Online)',
    'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ),
  (
    'Hack for Good',
    'Create solutions for social, environmental, or community impact. Build technology that makes the world better.',
    'Technology for social impact 🌏',
    '🌏',
    '2025-02-08T09:00:00Z'::timestamptz,
    '2025-02-09T21:00:00Z'::timestamptz,
    'upcoming',
    'Social Impact',
    '# Social Impact Guidelines

## 🎯 Make a Difference
Build solutions that create positive social or environmental impact.

## 📋 Requirements
- Focus on social good or environmental sustainability
- Demonstrate clear impact potential
- Consider accessibility and inclusivity',
    '[
      {"place": "Grand Prize", "amount": "$4,000", "description": "Best impact solution"},
      {"place": "Runner-up", "amount": "$2,000", "description": "Second best impact"}
    ]'::jsonb,
    '[
      {"name": "UN Global Goals", "logo": "🌍", "tier": "Platinum"},
      {"name": "Greenpeace", "logo": "🌱", "tier": "Gold"}
    ]'::jsonb,
    4,
    false,
    10000,
    'Global (Online)',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ),
  (
    'No-Code Magic',
    'Create anything with no-code tools and AI. No programming required - just creativity and innovation.',
    'Build without code ✨',
    '✨',
    '2025-02-15T09:00:00Z'::timestamptz,
    '2025-02-16T21:00:00Z'::timestamptz,
    'upcoming',
    'No-Code',
    '# No-Code Challenge Rules

## 🎯 Code-Free Creation
Build amazing solutions using no-code tools and platforms.

## 📋 Requirements
- Must use no-code/low-code tools only
- Focus on creativity and user experience
- Demonstrate practical value',
    '[
      {"place": "Grand Prize", "amount": "$2,000", "description": "Best no-code solution"},
      {"place": "Runner-up", "amount": "$1,000", "description": "Second best creation"}
    ]'::jsonb,
    '[
      {"name": "Bubble", "logo": "🫧", "tier": "Platinum"},
      {"name": "Zapier", "logo": "⚡", "tier": "Gold"}
    ]'::jsonb,
    2,
    true,
    5000,
    'Global (Online)',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ),
  (
    'Web3 & Blockchain Builder Weekend',
    'Explore the future of decentralized applications and blockchain technology. Build the next generation of web.',
    'Decentralized future 🔗',
    '🔗',
    '2025-01-11T09:00:00Z'::timestamptz,
    '2025-01-12T21:00:00Z'::timestamptz,
    'completed',
    'Blockchain',
    '# Web3 & Blockchain Rules

## 🎯 Decentralized Innovation
Build applications using blockchain and Web3 technologies.

## 📋 Requirements
- Must use blockchain technology
- Focus on decentralization benefits
- Consider user experience and adoption',
    '[
      {"place": "Grand Prize", "amount": "$6,000", "description": "Best Web3 solution"},
      {"place": "Runner-up", "amount": "$3,000", "description": "Second best dApp"},
      {"place": "Third Place", "amount": "$1,500", "description": "Third best blockchain project"}
    ]'::jsonb,
    '[
      {"name": "Ethereum Foundation", "logo": "⟠", "tier": "Platinum"},
      {"name": "Polygon", "logo": "🔷", "tier": "Gold"}
    ]'::jsonb,
    4,
    false,
    18000,
    'Global (Online)',
    'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=1200'
  )
) AS new_events(title, description, theme, emoji, start_date, end_date, status, category, rules, prizes, sponsors, max_team_size, featured, total_prize_pool, location, banner_url)
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE events.title = new_events.title
);

-- Insert sample announcements for active event (only if event exists and announcement doesn't exist)
DO $$
DECLARE
  event_uuid uuid;
BEGIN
  SELECT id INTO event_uuid FROM events WHERE title = 'AI-Powered Solutions Weekend' LIMIT 1;
  
  IF event_uuid IS NOT NULL THEN
    INSERT INTO event_announcements (event_id, title, content, type) 
    SELECT 
      event_uuid,
      '🎉 Event is now LIVE!',
      'Welcome to AI-Powered Solutions Weekend! The event has officially started. You can now submit your projects and start building amazing AI solutions.',
      'important'
    WHERE NOT EXISTS (
      SELECT 1 FROM event_announcements 
      WHERE event_id = event_uuid AND title = '🎉 Event is now LIVE!'
    );

    INSERT INTO event_announcements (event_id, title, content, type) 
    SELECT 
      event_uuid,
      '⏰ Submission Deadline Reminder',
      'Don''t forget! Project submissions close tomorrow at 9 PM UTC. Make sure to submit your project with a demo video and complete documentation.',
      'reminder'
    WHERE NOT EXISTS (
      SELECT 1 FROM event_announcements 
      WHERE event_id = event_uuid AND title = '⏰ Submission Deadline Reminder'
    );

    INSERT INTO event_announcements (event_id, title, content, type) 
    SELECT 
      event_uuid,
      '🤝 Mentor Office Hours',
      'Join our AI experts for office hours today from 2-4 PM UTC. Get help with your projects, ask technical questions, and receive valuable feedback.',
      'info'
    WHERE NOT EXISTS (
      SELECT 1 FROM event_announcements 
      WHERE event_id = event_uuid AND title = '🤝 Mentor Office Hours'
    );
  END IF;
END $$;

-- Insert sample mini challenges for active event (only if event exists and challenges don't exist)
DO $$
DECLARE
  event_uuid uuid;
BEGIN
  SELECT id INTO event_uuid FROM events WHERE title = 'AI-Powered Solutions Weekend' LIMIT 1;
  
  IF event_uuid IS NOT NULL THEN
    INSERT INTO event_mini_challenges (event_id, title, description, reward, total_required)
    SELECT 
      event_uuid,
      'First Submission',
      'Be among the first 50 to submit a project',
      '50 bonus points',
      50
    WHERE NOT EXISTS (
      SELECT 1 FROM event_mini_challenges 
      WHERE event_id = event_uuid AND title = 'First Submission'
    );

    INSERT INTO event_mini_challenges (event_id, title, description, reward, total_required)
    SELECT 
      event_uuid,
      'Community Helper',
      'Help 3 other participants with feedback or votes',
      'Helper badge + 25 points',
      3
    WHERE NOT EXISTS (
      SELECT 1 FROM event_mini_challenges 
      WHERE event_id = event_uuid AND title = 'Community Helper'
    );

    INSERT INTO event_mini_challenges (event_id, title, description, reward, total_required)
    SELECT 
      event_uuid,
      'Social Sharer',
      'Share your project on social media',
      'Influencer badge + 15 points',
      1
    WHERE NOT EXISTS (
      SELECT 1 FROM event_mini_challenges 
      WHERE event_id = event_uuid AND title = 'Social Sharer'
    );
  END IF;
END $$;