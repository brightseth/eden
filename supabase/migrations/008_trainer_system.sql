-- Migration: Trainer System
-- Creates trainer profiles, agent-trainer relationships, and attribution tracking

-- 1) Trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,                -- 'kristi', 'seth', 'genekogan'
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Agent↔Trainer join table
CREATE TABLE IF NOT EXISTS agent_trainers (
  agent_id TEXT NOT NULL,
  trainer_id TEXT NOT NULL REFERENCES trainers(id),
  role TEXT DEFAULT 'primary',        -- primary, assistant, guest
  started_at DATE,
  PRIMARY KEY (agent_id, trainer_id)
);

-- 3) Add attribution columns to archives
ALTER TABLE agent_archives
  ADD COLUMN IF NOT EXISTS created_by_user TEXT,   -- raw user id from JSON
  ADD COLUMN IF NOT EXISTS trainer_id TEXT;        -- normalized trainer id

-- 4) Mapping raw user IDs → trainer IDs
CREATE TABLE IF NOT EXISTS user_trainer_map (
  user_id TEXT PRIMARY KEY,
  trainer_id TEXT NOT NULL REFERENCES trainers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_archives_trainer ON agent_archives(trainer_id);
CREATE INDEX IF NOT EXISTS idx_archives_agent_type ON agent_archives(agent_id, archive_type);
CREATE INDEX IF NOT EXISTS idx_agent_trainers_trainer ON agent_trainers(trainer_id);

-- 6) Seed initial trainers
INSERT INTO trainers (id, display_name, bio, socials)
VALUES 
  ('kristi', 'Kristi Coronado', 'Fashion curator and AI artist exploring digital couture and aesthetic intelligence', 
   '{"x": "kristicoronado", "site": "https://kristi.art"}'::jsonb),
  ('seth', 'Seth Goldstein', 'Founder of Eden, building autonomous creative agents',
   '{"x": "sethgoldstein", "site": "https://sethgoldstein.com"}'::jsonb),
  ('genekogan', 'Gene Kogan', 'Artist and researcher working with machine learning and generative systems',
   '{"x": "genekogan", "site": "https://genekogan.com"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- 7) Initial agent-trainer relationships
INSERT INTO agent_trainers (agent_id, trainer_id, role)
VALUES 
  ('abraham', 'genekogan', 'primary'),
  ('solienne', 'kristi', 'primary')
ON CONFLICT (agent_id, trainer_id) DO NOTHING;

-- 8) Map Seth's user ID (from the samples provided)
INSERT INTO user_trainer_map (user_id, trainer_id)
VALUES ('67b89e92a7ea02717c1ea36d', 'seth')
ON CONFLICT (user_id) DO UPDATE SET trainer_id = EXCLUDED.trainer_id;

-- Note: Kristi's user IDs will be discovered after import and mapped