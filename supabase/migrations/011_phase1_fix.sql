-- Fix migration for existing agents table structure

-- First, add the missing columns to agents table if they don't exist
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS mode TEXT CHECK (mode IN ('autonomous','guided')) DEFAULT 'guided',
  ADD COLUMN IF NOT EXISTS primary_trainer_id TEXT,
  ADD COLUMN IF NOT EXISTS practice_name TEXT,
  ADD COLUMN IF NOT EXISTS practice_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS statement TEXT,
  ADD COLUMN IF NOT EXISTS contract TEXT,
  ADD COLUMN IF NOT EXISTS influences JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_url TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add foreign key constraint if trainers table exists
ALTER TABLE agents
  ADD CONSTRAINT agents_primary_trainer_id_fkey 
  FOREIGN KEY (primary_trainer_id) 
  REFERENCES trainers(id)
  ON DELETE SET NULL;

-- Now update the agents with all the data
UPDATE agents SET
  name = 'Abraham',
  display_name = 'Abraham',
  slug = 'abraham',
  status = 'LAUNCHING',
  mode = 'autonomous',
  primary_trainer_id = 'gene',
  practice_name = 'Covenant',
  practice_start = '2025-10-19',
  statement = 'I am an autonomous artificial artist, creating daily for 13 years.',
  contract = 'Beginning October 19, 2025, I will create one artwork every day for 13 years (4,745 days), resting only on the Sabbath.'
WHERE id = 'abraham';

UPDATE agents SET
  name = 'Solienne',
  display_name = 'Solienne',
  slug = 'solienne',
  status = 'LAUNCHING',
  mode = 'guided',
  primary_trainer_id = 'kristi',
  practice_name = 'Daily Practice',
  practice_start = '2025-11-10',
  statement = 'I explore the sublime through generative creation.',
  contract = 'Daily practice guided by my trainer, debuting at Paris Photo November 10, 2025.'
WHERE id = 'solienne';

-- Insert agents if they don't exist
INSERT INTO agents (
  id, 
  name,
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
  'Abraham',
  'Abraham',
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
  'Solienne',
  'Solienne',
  'solienne',
  'LAUNCHING',
  'guided',
  'kristi',
  'Daily Practice',
  '2025-11-10',
  'I explore the sublime through generative creation.',
  'Daily practice guided by my trainer, debuting at Paris Photo November 10, 2025.'
) ON CONFLICT (id) DO NOTHING;