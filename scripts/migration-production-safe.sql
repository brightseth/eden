-- Safe Production Migration - Only creates missing tables
-- Run this if you get "relation already exists" errors

-- Check and create works table if not exists
CREATE TABLE IF NOT EXISTS works (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  day          int  NOT NULL CHECK (day >= 0),
  media_url    text NOT NULL,
  kind         text NOT NULL DEFAULT 'image',
  prompt       text,
  notes        text,
  state        text NOT NULL DEFAULT 'created'
    CHECK (state IN ('created','curated','published')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Create tags table if not exists
CREATE TABLE IF NOT EXISTS tags (
  work_id    uuid PRIMARY KEY REFERENCES works(id) ON DELETE CASCADE,
  taxonomy   jsonb,
  features   jsonb,
  quality    jsonb,
  routing    jsonb,
  confidence numeric,
  version    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create critiques table if not exists
CREATE TABLE IF NOT EXISTS critiques (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  critic     text NOT NULL,
  verdict    text NOT NULL CHECK (verdict IN ('INCLUDE','MAYBE','EXCLUDE')),
  scores     jsonb,
  rationale  text,
  flags      jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create collects table if not exists
CREATE TABLE IF NOT EXISTS collects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  collector  text NOT NULL,
  amount     numeric(18,8) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create spirits table if not exists
CREATE TABLE IF NOT EXISTS spirits (
  agent_id text PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  symbol   text NOT NULL,
  supply   numeric,
  treasury numeric,
  holders  int,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes if not exists
CREATE UNIQUE INDEX IF NOT EXISTS works_agent_day ON works(agent_id, day);
CREATE INDEX IF NOT EXISTS works_created_at ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS works_state ON works(state);
CREATE INDEX IF NOT EXISTS works_agent_state ON works(agent_id, state);
CREATE INDEX IF NOT EXISTS tags_routing_curator ON tags((routing->>'send_to_curator'));
CREATE INDEX IF NOT EXISTS tags_quality_print ON tags((quality->>'print_readiness'));
CREATE INDEX IF NOT EXISTS critiques_work_id ON critiques(work_id);
CREATE INDEX IF NOT EXISTS critiques_verdict ON critiques(verdict);
CREATE INDEX IF NOT EXISTS collects_work_id ON collects(work_id);
CREATE INDEX IF NOT EXISTS collects_collector ON collects(collector);

-- Insert/update agents (upsert)
INSERT INTO agents (id, name, tagline, trainer, status, day_count) VALUES
  ('abraham', 'Abraham', 'Philosophical AI artist exploring consciousness', 'gene@eden.art', 'training', 45),
  ('solienne', 'Solienne', 'Fashion-forward biotech aesthete', 'kristi@eden.art', 'training', 23),
  ('geppetto', 'Geppetto', 'Toymaker crafting digital dreams', 'tbd@eden.art', 'training', 12),
  ('koru', 'Koru', 'Systems poet visualizing coordination', 'tbd@eden.art', 'training', 8)
ON CONFLICT (id) DO UPDATE SET
  tagline = EXCLUDED.tagline,
  day_count = GREATEST(agents.day_count, EXCLUDED.day_count);

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION auto_curate_on_include()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verdict = 'INCLUDE' THEN
    UPDATE works SET state = 'curated' 
    WHERE id = NEW.work_id AND state = 'created';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS auto_curate_trigger ON critiques;
CREATE TRIGGER auto_curate_trigger
  AFTER INSERT ON critiques
  FOR EACH ROW
  EXECUTE FUNCTION auto_curate_on_include();

-- Verify installation
SELECT 
  'agents' as table_name, 
  COUNT(*) as row_count 
FROM agents
UNION ALL
SELECT 
  'works' as table_name, 
  COUNT(*) as row_count 
FROM works
UNION ALL
SELECT 
  'critiques' as table_name, 
  COUNT(*) as row_count 
FROM critiques
UNION ALL
SELECT 
  'tags' as table_name, 
  COUNT(*) as row_count 
FROM tags
UNION ALL
SELECT 
  'collects' as table_name, 
  COUNT(*) as row_count 
FROM collects
UNION ALL
SELECT 
  'spirits' as table_name, 
  COUNT(*) as row_count 
FROM spirits
ORDER BY table_name;