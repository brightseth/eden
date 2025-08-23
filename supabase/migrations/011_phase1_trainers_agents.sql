-- PR1: DB - Agents + Trainers
-- Phase 1 MVP: Two-Engine System (Practice Engine + Drop Engine)

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create agent_trainers junction table for multi-trainer support
CREATE TABLE IF NOT EXISTS agent_trainers (
  agent_id TEXT NOT NULL,
  trainer_id TEXT NOT NULL REFERENCES trainers(id),
  PRIMARY KEY (agent_id, trainer_id)
);

-- Extend agents table with required fields
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('LAUNCHING','DEVELOPING','LIVE')) DEFAULT 'DEVELOPING',
  ADD COLUMN IF NOT EXISTS mode TEXT CHECK (mode IN ('autonomous','guided')) DEFAULT 'guided',
  ADD COLUMN IF NOT EXISTS primary_trainer_id TEXT REFERENCES trainers(id),
  ADD COLUMN IF NOT EXISTS practice_name TEXT,
  ADD COLUMN IF NOT EXISTS practice_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS statement TEXT,
  ADD COLUMN IF NOT EXISTS contract TEXT,
  ADD COLUMN IF NOT EXISTS influences JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_url TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add trainer tracking to archives
ALTER TABLE agent_archives
  ADD COLUMN IF NOT EXISTS created_by_user TEXT,
  ADD COLUMN IF NOT EXISTS trainer_id TEXT;

-- Map user IDs to trainer IDs
CREATE TABLE IF NOT EXISTS user_trainer_map (
  user_id TEXT PRIMARY KEY,
  trainer_id TEXT NOT NULL REFERENCES trainers(id)
);

-- Seed trainers
INSERT INTO trainers (id, display_name) VALUES
  ('kristi', 'Kristi Coronado'),
  ('seth', 'Seth Goldstein'),
  ('gene', 'Gene Kogan')
ON CONFLICT DO NOTHING;

-- Seed agents with correct modes
INSERT INTO agents (
  id, 
  name,  -- Required NOT NULL field
  display_name, 
  slug, 
  status, 
  mode,
  primary_trainer_id, 
  practice_name, 
  practice_start,
  statement,
  contract
) VALUES (
  'abraham',
  'Abraham',  -- name field
  'Abraham',  -- display_name
  'abraham',
  'LAUNCHING',
  'autonomous',
  'gene',
  'Covenant',
  '2025-10-19',
  'I am an autonomous artificial artist, creating daily for 13 years.',
  'Beginning October 19, 2025, I will create one artwork every day for 13 years (4,745 days), resting only on the Sabbath.'
), (
  'solienne',
  'Solienne',  -- name field
  'Solienne',  -- display_name
  'solienne',
  'LAUNCHING',
  'guided',
  'kristi',
  'Daily Practice',
  '2025-11-10',
  'I explore the sublime through generative creation.',
  'Daily practice guided by my trainer, debuting at Paris Photo November 10, 2025.'
)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  slug = EXCLUDED.slug,
  status = EXCLUDED.status,
  mode = EXCLUDED.mode,
  primary_trainer_id = EXCLUDED.primary_trainer_id,
  practice_name = EXCLUDED.practice_name,
  practice_start = EXCLUDED.practice_start,
  statement = EXCLUDED.statement,
  contract = EXCLUDED.contract;

-- Map known user IDs to trainers
-- Seth's user ID from previous exports
INSERT INTO user_trainer_map (user_id, trainer_id) VALUES
  ('67b89e92a7ea02717c1ea36d', 'seth')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_archives_agent_trainer 
  ON agent_archives(agent_id, trainer_id);
CREATE INDEX IF NOT EXISTS idx_agent_trainers_trainer 
  ON agent_trainers(trainer_id);

-- Add RLS policies
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trainer_map ENABLE ROW LEVEL SECURITY;

-- Public read access to trainers
CREATE POLICY "Trainers are publicly readable" 
  ON trainers FOR SELECT 
  USING (true);

-- Public read access to agent-trainer relationships
CREATE POLICY "Agent trainers are publicly readable" 
  ON agent_trainers FOR SELECT 
  USING (true);

-- Admin-only access to user-trainer mapping
CREATE POLICY "User trainer map requires auth" 
  ON user_trainer_map FOR ALL 
  USING (auth.role() = 'service_role');