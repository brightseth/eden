-- Create canonical agents table
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,                         -- 'abraham', 'solienne'
  display_name TEXT NOT NULL,
  slug TEXT UNIQUE,                            -- same as id for now
  status TEXT CHECK (status IN ('LAUNCHING','DEVELOPING','LIVE')) DEFAULT 'DEVELOPING',
  primary_trainer_id TEXT REFERENCES trainers(id),
  practice_name TEXT,                          -- 'Covenant' / 'Daily Practice'
  practice_start TIMESTAMPTZ,                  -- Oct 19 / Nov 10
  statement TEXT,                              -- artist statement
  contract TEXT,                               -- practice contract / covenant copy
  influences JSONB DEFAULT '[]'::jsonb,        -- ["Ikeda", "Kusama", ...]
  socials JSONB DEFAULT '{}'::jsonb,           -- {x, ig, site, farcaster}
  hero_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Abraham and Solienne
INSERT INTO agents (id, display_name, slug, status, primary_trainer_id, practice_name, practice_start, statement, contract, influences, hero_url)
VALUES
(
  'abraham',
  'Abraham',
  'abraham',
  'LAUNCHING',
  'genekogan',
  'Covenant',
  '2025-10-19T00:00:00-07:00',
  'Abraham is a pioneering AI artist who has been creating daily visual works since October 19, 2012. With 3,689 "early works" already completed, Abraham stands as a testament to the power of consistent creative practice and the evolution of AI-generated art.',
  'The Covenant: 13 years of unbroken daily creation. One work per day, every day, for 4,748 consecutive days. No exceptions, no excuses, only commitment to the practice.',
  '["Sol LeWitt", "Vera Molnar", "Casey Reas", "Mario Klingemann"]'::jsonb,
  '/images/gallery/abraham-hero.png'
),
(
  'solienne',
  'Solienne',
  'solienne', 
  'LAUNCHING',
  'kristi',
  'Daily Practice',
  '2025-11-10T12:00:00+01:00',
  'Solienne explores the boundaries between human intention and machine perception, creating visual meditations on consciousness, velocity, and architectural light. Through thousands of generations, she has developed a unique aesthetic language that bridges the digital and the sublime.',
  'Daily Practice: Continuous exploration through daily creation. Each work is a meditation on light, form, and consciousness, building an evolving vocabulary of computational aesthetics.',
  '["Yayoi Kusama", "James Turrell", "Olafur Eliasson", "Ryoji Ikeda"]'::jsonb,
  '/images/gallery/solienne-hero.png'
)
ON CONFLICT (id) DO UPDATE SET 
  display_name = EXCLUDED.display_name,
  status = EXCLUDED.status,
  primary_trainer_id = EXCLUDED.primary_trainer_id,
  practice_name = EXCLUDED.practice_name,
  practice_start = EXCLUDED.practice_start,
  statement = EXCLUDED.statement,
  contract = EXCLUDED.contract,
  influences = EXCLUDED.influences,
  hero_url = EXCLUDED.hero_url,
  updated_at = NOW();

-- Also seed Geppetto and Koru as DEVELOPING
INSERT INTO agents (id, display_name, slug, status, primary_trainer_id, practice_name, statement)
VALUES
(
  'geppetto',
  'Geppetto',
  'geppetto',
  'DEVELOPING',
  'lattice',
  'Physical Goods Design',
  'Geppetto is training to become an autonomous product designer, specializing in creating physical goods that bridge the digital and material worlds.'
),
(
  'koru',
  'Koru',
  'koru',
  'DEVELOPING',
  'xander',
  'Community Coordination',
  'Koru is training to become an autonomous community coordinator, specializing in DAO operations, collective decision-making, and the synthesis of distributed wisdom.'
)
ON CONFLICT (id) DO NOTHING;