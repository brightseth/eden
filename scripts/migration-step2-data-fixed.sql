-- Step 2: Insert initial data
-- Run this after step 1 completes

-- Insert initial agents (hardcoded for MVP)
-- These are NEW agents with text IDs, not migrated from fellows
INSERT INTO agents (id, name, tagline, trainer, status, day_count) VALUES
  ('abraham', 'Abraham', 'Philosophical AI artist exploring consciousness', 'gene@eden.art', 'training', 45),
  ('solienne', 'Solienne', 'Fashion-forward biotech aesthete', 'kristi@eden.art', 'training', 23),
  ('geppetto', 'Geppetto', 'Toymaker crafting digital dreams', 'tbd@eden.art', 'training', 12),
  ('koru', 'Koru', 'Systems poet visualizing coordination', 'tbd@eden.art', 'training', 8)
ON CONFLICT (id) DO UPDATE SET
  day_count = EXCLUDED.day_count,
  tagline = EXCLUDED.tagline;

-- Migrate existing creations to works (if creations table exists)
-- Map agent names to our new text IDs
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
  AND c.curation->>'verdict' IN ('INCLUDE', 'MAYBE', 'EXCLUDE')
ON CONFLICT DO NOTHING;