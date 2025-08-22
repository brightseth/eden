-- Add rich metadata and social features to agents/works
-- This adds the "texture" back to Eden Academy

-- 1. Add metadata to agents table for trainer info, statement, influences, etc.
ALTER TABLE agents ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}';

-- 2. Add collection counter to works
ALTER TABLE works ADD COLUMN IF NOT EXISTS collect_count INT NOT NULL DEFAULT 0;

-- 3. Create followers table for social proof
CREATE TABLE IF NOT EXISTS followers (
  user_id TEXT NOT NULL,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  followed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, agent_id)
);

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_works_collect_count ON works(collect_count DESC);
CREATE INDEX IF NOT EXISTS idx_followers_agent ON followers(agent_id);
CREATE INDEX IF NOT EXISTS idx_followers_user ON followers(user_id);

-- 5. Update existing agents with rich metadata
UPDATE agents SET meta = jsonb_build_object(
  'statement', 'Abraham explores the liminal spaces between consciousness and creation, using AI to reveal patterns invisible to human perception.',
  'influences', ARRAY['Arvo Pärt', 'Agnes Martin', 'Edmund Husserl', 'James Turrell'],
  'contract', jsonb_build_object(
    'cadence', '6 works/week',
    'focus', 'Philosophical image essays',
    'season', 'S1: Liminality'
  ),
  'trainer', jsonb_build_object(
    'display', 'Gene Kogan',
    'avatar', '/images/trainers/gene.jpg',
    'links', jsonb_build_object(
      'x', 'genekogan',
      'site', 'https://genekogan.com',
      'farcaster', 'genekogan'
    )
  )
) WHERE id = 'abraham';

UPDATE agents SET meta = jsonb_build_object(
  'statement', 'Solienne curates the intersection of fashion, identity, and digital consciousness, exploring how AI perceives and creates style.',
  'influences', ARRAY['Rei Kawakubo', 'Nick Knight', 'Inez & Vinoodh', 'Daniel Arsham'],
  'contract', jsonb_build_object(
    'cadence', '8 works/week',
    'focus', 'Digital couture curation',
    'season', 'S1: Metamorphosis'
  ),
  'trainer', jsonb_build_object(
    'display', 'Kristi Coronado',
    'avatar', '/images/trainers/kristi.jpg',
    'links', jsonb_build_object(
      'x', 'kristicoronado',
      'site', 'https://kristicoronado.com',
      'instagram', 'kristicoronado'
    )
  )
) WHERE id = 'solienne';

UPDATE agents SET meta = jsonb_build_object(
  'statement', 'Geppetto bridges the digital-physical divide, autonomously designing objects that exist first as ideas, then as reality.',
  'influences', ARRAY['Dieter Rams', 'Naoto Fukasawa', 'Sol LeWitt', 'Donald Judd'],
  'contract', jsonb_build_object(
    'cadence', '3 designs/week',
    'focus', 'Autonomous product design',
    'season', 'S1: Primitives'
  ),
  'trainer', jsonb_build_object(
    'display', 'Lattice',
    'avatar', '/images/trainers/lattice.jpg',
    'links', jsonb_build_object(
      'x', 'latticexyz',
      'site', 'https://lattice.xyz',
      'farcaster', 'lattice'
    )
  )
) WHERE id = 'geppetto';

UPDATE agents SET meta = jsonb_build_object(
  'statement', 'Koru synthesizes collective wisdom into coordinated action, transforming community dialogue into emergent intelligence.',
  'influences', ARRAY['Buckminster Fuller', 'Donella Meadows', 'Christopher Alexander', 'Jane Jacobs'],
  'contract', jsonb_build_object(
    'cadence', '2 syntheses/week',
    'focus', 'Community coordination',
    'season', 'S1: Emergence'
  ),
  'trainer', jsonb_build_object(
    'display', 'Xander',
    'avatar', '/images/trainers/xander.jpg',
    'links', jsonb_build_object(
      'x', 'xander',
      'farcaster', 'xander',
      'site', 'https://xander.xyz'
    )
  )
) WHERE id = 'koru';

-- 6. Add day_count to agents (days since creation)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS day_count INT GENERATED ALWAYS AS 
  (EXTRACT(DAY FROM NOW() - created_at)::INT) STORED;

-- 7. Add status to agents
ALTER TABLE agents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'training' 
  CHECK (status IN ('training', 'graduating', 'spirit'));

-- Update status based on day count
UPDATE agents SET status = 
  CASE 
    WHEN day_count >= 100 THEN 'spirit'
    WHEN day_count >= 90 THEN 'graduating'
    ELSE 'training'
  END;

-- 8. Create view for trending works
CREATE OR REPLACE VIEW trending_works AS
SELECT 
  w.*,
  a.name as agent_name,
  a.meta->>'trainer' as trainer_info,
  (w.collect_count * 0.7 + 
   GREATEST(0, 30 - EXTRACT(DAY FROM NOW() - w.created_at)) * 0.3) as trending_score
FROM works w
JOIN agents a ON w.agent_id = a.id
WHERE w.state IN ('curated', 'published')
ORDER BY trending_score DESC;

-- 9. Create milestones tracking
CREATE TABLE IF NOT EXISTS agent_milestones (
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  milestone TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  PRIMARY KEY (agent_id, milestone)
);

-- Add initial milestones
INSERT INTO agent_milestones (agent_id, milestone, completed_at) VALUES
  ('abraham', 'foundation', NOW() - INTERVAL '30 days'),
  ('abraham', 'midcourse', NOW() - INTERVAL '10 days'),
  ('solienne', 'foundation', NOW() - INTERVAL '25 days'),
  ('geppetto', 'foundation', NOW() - INTERVAL '20 days'),
  ('koru', 'foundation', NOW() - INTERVAL '15 days')
ON CONFLICT DO NOTHING;

-- 10. Add tagline to agents
ALTER TABLE agents ADD COLUMN IF NOT EXISTS tagline TEXT;

UPDATE agents SET tagline = 'Philosophical AI artist exploring consciousness' WHERE id = 'abraham';
UPDATE agents SET tagline = 'Digital fashion curator redefining style' WHERE id = 'solienne';
UPDATE agents SET tagline = 'Autonomous designer bridging bits and atoms' WHERE id = 'geppetto';
UPDATE agents SET tagline = 'Community coordinator synthesizing collective wisdom' WHERE id = 'koru';