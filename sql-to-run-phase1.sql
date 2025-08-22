-- PHASE 1: TRAINER SYSTEM SETUP
-- Run this entire script in Supabase SQL Editor

-- 1) Create Trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  socials JSONB DEFAULT '{}'::jsonb
);

-- 2) Create Agent↔Trainer join table
CREATE TABLE IF NOT EXISTS agent_trainers (
  agent_id TEXT NOT NULL,
  trainer_id TEXT NOT NULL REFERENCES trainers(id),
  primary key (agent_id, trainer_id)
);

-- 3) Add attribution columns to archives
ALTER TABLE agent_archives
  ADD COLUMN IF NOT EXISTS created_by_user TEXT,
  ADD COLUMN IF NOT EXISTS trainer_id TEXT;

-- 4) Create user ID mapping table
CREATE TABLE IF NOT EXISTS user_trainer_map (
  user_id TEXT PRIMARY KEY,
  trainer_id TEXT NOT NULL REFERENCES trainers(id)
);

-- 5) Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_archives_trainer ON agent_archives(trainer_id);
CREATE INDEX IF NOT EXISTS idx_archives_agent_type ON agent_archives(agent_id, archive_type);

-- 6) Seed initial trainers
INSERT INTO trainers (id, display_name, bio, socials)
VALUES 
  ('kristi', 'Kristi Coronado', 'Fashion curator and AI artist exploring digital couture', 
   '{"x": "kristicoronado"}'::jsonb),
  ('seth', 'Seth Goldstein', 'Founder of Eden, building autonomous creative agents',
   '{"x": "sethgoldstein"}'::jsonb),
  ('genekogan', 'Gene Kogan', 'Artist and researcher working with machine learning',
   '{"x": "genekogan"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7) Map agents to trainers
INSERT INTO agent_trainers (agent_id, trainer_id)
VALUES 
  ('abraham', 'genekogan'),
  ('solienne', 'kristi')
ON CONFLICT (agent_id, trainer_id) DO NOTHING;

-- 8) Map Seth's user ID (from the Solienne samples)
INSERT INTO user_trainer_map (user_id, trainer_id)
VALUES ('67b89e92a7ea02717c1ea36d', 'seth')
ON CONFLICT (user_id) DO UPDATE SET trainer_id = EXCLUDED.trainer_id;

-- Verify setup
SELECT 'Trainers:' as check, COUNT(*) as count FROM trainers
UNION ALL
SELECT 'Agent-Trainer Links:', COUNT(*) FROM agent_trainers
UNION ALL  
SELECT 'User Mappings:', COUNT(*) FROM user_trainer_map;