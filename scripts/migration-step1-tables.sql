-- Step 1: Create core tables for agents/works migration
-- Run this in Supabase SQL editor

-- 1) Agents table (replaces "fellows")
CREATE TABLE IF NOT EXISTS agents (
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

-- 3) Tags table (AI vision output)
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

-- 4) Critiques table
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

-- 5) Collects table
CREATE TABLE IF NOT EXISTS collects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  collector  text NOT NULL,
  amount     numeric(18,8) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6) Spirits table for graduated agents
CREATE TABLE IF NOT EXISTS spirits (
  agent_id text PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  symbol   text NOT NULL,
  supply   numeric,
  treasury numeric,
  holders  int,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
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