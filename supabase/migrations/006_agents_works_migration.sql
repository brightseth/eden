-- Migration: Fellows/Creations → Agents/Works
-- This creates new tables alongside old ones for zero-downtime migration

-- 1) Agents table (replaces "fellows")
CREATE TABLE IF NOT EXISTS agents (
  id           text PRIMARY KEY,                    -- 'abraham'
  name         text NOT NULL,
  tagline      text,
  trainer      text NOT NULL,                       -- email/user id
  status       text NOT NULL DEFAULT 'training'     -- training|graduating|spirit
    CHECK (status IN ('training','graduating','spirit')),
  day_count    int  NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 2) Works table (replaces "creations")
CREATE TABLE IF NOT EXISTS works (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  day          int  NOT NULL CHECK (day >= 0),
  media_url    text NOT NULL,
  kind         text NOT NULL DEFAULT 'image',       -- image|video|text
  prompt       text,
  notes        text,
  state        text NOT NULL DEFAULT 'created'      -- created|curated|published
    CHECK (state IN ('created','curated','published')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Indexes for efficient querying
CREATE UNIQUE INDEX IF NOT EXISTS works_agent_day ON works(agent_id, day);
CREATE INDEX IF NOT EXISTS works_created_at ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS works_state ON works(state);
CREATE INDEX IF NOT EXISTS works_agent_state ON works(agent_id, state);

-- 3) Tags table (AI vision output)
CREATE TABLE IF NOT EXISTS tags (
  work_id    uuid PRIMARY KEY REFERENCES works(id) ON DELETE CASCADE,
  taxonomy   jsonb,       -- {type, subject[], format, mood[], series}
  features   jsonb,       -- {palette[], lighting[], composition[], text_presence}
  quality    jsonb,       -- {artifact_risk, print_readiness, phash}
  routing    jsonb,       -- {send_to_curator:boolean, share_candidates:[]}
  confidence numeric,
  version    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tags_routing_curator ON tags((routing->>'send_to_curator'));
CREATE INDEX IF NOT EXISTS tags_quality_print ON tags((quality->>'print_readiness'));

-- 4) Critiques table (Ninabot or human curators)
CREATE TABLE IF NOT EXISTS critiques (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  critic     text NOT NULL,                         -- nina@eden.art or 'ninabot'
  verdict    text NOT NULL CHECK (verdict IN ('INCLUDE','MAYBE','EXCLUDE')),
  scores     jsonb,                                 -- 5-dimension scores if available
  rationale  text,
  flags      jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS critiques_work_id ON critiques(work_id);
CREATE INDEX IF NOT EXISTS critiques_verdict ON critiques(verdict);

-- 5) Collects table (stub for now)
CREATE TABLE IF NOT EXISTS collects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  collector  text NOT NULL,                         -- wallet/email
  amount     numeric(18,8) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS collects_work_id ON collects(work_id);
CREATE INDEX IF NOT EXISTS collects_collector ON collects(collector);

-- 6) Optional: Spirits table for graduated agents
CREATE TABLE IF NOT EXISTS spirits (
  agent_id text PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  symbol   text NOT NULL,      -- $ABRAHAM
  supply   numeric,
  treasury numeric,
  holders  int,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- BACKFILL DATA FROM OLD TABLES
-- =====================================================

-- Insert initial agents (hardcoded for MVP)
INSERT INTO agents (id, name, tagline, trainer, status, day_count) VALUES
  ('abraham', 'Abraham', 'Philosophical AI artist exploring consciousness', 'gene@eden.art', 'training', 45),
  ('solienne', 'Solienne', 'Fashion-forward biotech aesthete', 'kristi@eden.art', 'training', 23),
  ('geppetto', 'Geppetto', 'Toymaker crafting digital dreams', 'tbd@eden.art', 'training', 12),
  ('koru', 'Koru', 'Systems poet visualizing coordination', 'tbd@eden.art', 'training', 8)
ON CONFLICT (id) DO NOTHING;

-- Migrate existing creations to works (if they exist)
-- This assumes creations table has: id, agent_name, image_url, prompt, state, created_at
INSERT INTO works (agent_id, day, media_url, kind, prompt, state, created_at)
SELECT 
  LOWER(agent_name) as agent_id,
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
  AND EXISTS (SELECT 1 FROM agents WHERE id = LOWER(c.agent_name))
ON CONFLICT DO NOTHING;

-- Migrate existing tags if they exist
INSERT INTO tags (work_id, taxonomy, features, quality, routing, confidence, version, created_at)
SELECT 
  w.id as work_id,
  c.tags->'taxonomy' as taxonomy,
  c.tags->'features' as features,
  c.quality as quality,
  c.routing as routing,
  COALESCE(c.tagger_confidence, 0.8) as confidence,
  COALESCE(c.tagger_version, 'tagger-0.9.0') as version,
  c.updated_at as created_at
FROM creations c
JOIN works w ON w.created_at = c.created_at 
  AND LOWER(c.agent_name) = w.agent_id
WHERE c.tags IS NOT NULL
ON CONFLICT DO NOTHING;

-- Migrate Nina curations to critiques
INSERT INTO critiques (work_id, critic, verdict, scores, rationale, created_at)
SELECT 
  w.id as work_id,
  'ninabot' as critic,
  c.curation->>'verdict' as verdict,
  c.curation->'scores' as scores,
  c.curation->>'rationale' as rationale,
  c.updated_at as created_at
FROM creations c
JOIN works w ON w.created_at = c.created_at 
  AND LOWER(c.agent_name) = w.agent_id
WHERE c.curation IS NOT NULL
  AND c.curation->>'verdict' IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create function to auto-queue tagging for new works
CREATE OR REPLACE FUNCTION queue_tagger_for_work()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue if work doesn't already have tags
  IF NOT EXISTS (SELECT 1 FROM tags WHERE work_id = NEW.id) THEN
    -- This would normally insert into a job queue
    -- For now, we'll use the existing tagger_queue table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tagger_queue') THEN
      INSERT INTO tagger_queue (creation_id, status) 
      VALUES (NEW.id, 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-queue tagging
DROP TRIGGER IF EXISTS auto_queue_work_tagger ON works;
CREATE TRIGGER auto_queue_work_tagger
  AFTER INSERT ON works
  FOR EACH ROW
  EXECUTE FUNCTION queue_tagger_for_work();

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
DROP TRIGGER IF EXISTS auto_curate_trigger ON critiques;
CREATE TRIGGER auto_curate_trigger
  AFTER INSERT ON critiques
  FOR EACH ROW
  EXECUTE FUNCTION auto_curate_on_include();