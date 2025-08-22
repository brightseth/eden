-- Complete Migration Script - Run this entire file at once
-- This creates the new agents/works system from scratch

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

-- 1) Agents table (replaces "fellows")
CREATE TABLE agents (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  tagline      text,
  trainer      text NOT NULL,
  status       text NOT NULL DEFAULT 'training'
    CHECK (status IN ('training','graduating','spirit')),
  day_count    int  NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 2) Works table (replaces "creations")
CREATE TABLE works (
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

-- 3) Tags table (AI vision output)
CREATE TABLE tags (
  work_id    uuid PRIMARY KEY REFERENCES works(id) ON DELETE CASCADE,
  taxonomy   jsonb,
  features   jsonb,
  quality    jsonb,
  routing    jsonb,
  confidence numeric,
  version    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Critiques table
CREATE TABLE critiques (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  critic     text NOT NULL,
  verdict    text NOT NULL CHECK (verdict IN ('INCLUDE','MAYBE','EXCLUDE')),
  scores     jsonb,
  rationale  text,
  flags      jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5) Collects table
CREATE TABLE collects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  collector  text NOT NULL,
  amount     numeric(18,8) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6) Spirits table for graduated agents
CREATE TABLE spirits (
  agent_id text PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  symbol   text NOT NULL,
  supply   numeric,
  treasury numeric,
  holders  int,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- STEP 2: CREATE INDEXES
-- ============================================

CREATE UNIQUE INDEX works_agent_day ON works(agent_id, day);
CREATE INDEX works_created_at ON works(created_at DESC);
CREATE INDEX works_state ON works(state);
CREATE INDEX works_agent_state ON works(agent_id, state);
CREATE INDEX tags_routing_curator ON tags((routing->>'send_to_curator'));
CREATE INDEX tags_quality_print ON tags((quality->>'print_readiness'));
CREATE INDEX critiques_work_id ON critiques(work_id);
CREATE INDEX critiques_verdict ON critiques(verdict);
CREATE INDEX collects_work_id ON collects(work_id);
CREATE INDEX collects_collector ON collects(collector);

-- ============================================
-- STEP 3: INSERT INITIAL DATA
-- ============================================

-- Insert initial agents
INSERT INTO agents (id, name, tagline, trainer, status, day_count) VALUES
  ('abraham', 'Abraham', 'Philosophical AI artist exploring consciousness', 'gene@eden.art', 'training', 45),
  ('solienne', 'Solienne', 'Fashion-forward biotech aesthete', 'kristi@eden.art', 'training', 23),
  ('geppetto', 'Geppetto', 'Toymaker crafting digital dreams', 'tbd@eden.art', 'training', 12),
  ('koru', 'Koru', 'Systems poet visualizing coordination', 'tbd@eden.art', 'training', 8);

-- ============================================
-- STEP 4: CREATE TRIGGERS
-- ============================================

-- Create function to auto-curate on INCLUDE verdict
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

-- Trigger to auto-curate
CREATE TRIGGER auto_curate_trigger
  AFTER INSERT ON critiques
  FOR EACH ROW
  EXECUTE FUNCTION auto_curate_on_include();

-- ============================================
-- STEP 5: MIGRATE EXISTING DATA (if applicable)
-- ============================================

-- Migrate existing creations to works (if creations table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'creations') THEN
    INSERT INTO works (agent_id, day, media_url, kind, prompt, state, created_at)
    SELECT 
      CASE 
        WHEN LOWER(agent_name) = 'abraham' THEN 'abraham'
        WHEN LOWER(agent_name) = 'solienne' THEN 'solienne'
        WHEN LOWER(agent_name) = 'geppetto' THEN 'geppetto'
        WHEN LOWER(agent_name) = 'koru' THEN 'koru'
        ELSE LOWER(agent_name)
      END as agent_id,
      COALESCE(
        EXTRACT(DAY FROM AGE(created_at, (SELECT MIN(created_at) FROM creations WHERE agent_name = c.agent_name)))::int,
        0
      ) as day,
      image_url as media_url,
      'image' as kind,
      prompt,
      CASE 
        WHEN state = 'published' THEN 'published'
        WHEN state = 'review' THEN 'created'
        ELSE 'created'
      END as state,
      created_at
    FROM creations c
    WHERE image_url IS NOT NULL
      AND agent_name IS NOT NULL
      AND LOWER(agent_name) IN ('abraham', 'solienne', 'geppetto', 'koru')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;