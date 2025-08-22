-- Add vision tagger fields to creations table
ALTER TABLE creations 
  ADD COLUMN IF NOT EXISTS state text DEFAULT 'inbox' 
    CHECK (state IN ('inbox', 'review', 'curated', 'published')),
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'upload',
  ADD COLUMN IF NOT EXISTS prompt text,
  ADD COLUMN IF NOT EXISTS tags jsonb,
  ADD COLUMN IF NOT EXISTS quality jsonb,
  ADD COLUMN IF NOT EXISTS routing jsonb,
  ADD COLUMN IF NOT EXISTS tagger_version text,
  ADD COLUMN IF NOT EXISTS tagger_confidence numeric,
  ADD COLUMN IF NOT EXISTS curation jsonb;

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_creations_state ON creations(state);
CREATE INDEX IF NOT EXISTS idx_creations_agent_state ON creations(agent_name, state, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creations_quality_print ON creations((quality->>'print_readiness'));

-- Create tagger queue table for async processing
CREATE TABLE IF NOT EXISTS tagger_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creation_id UUID REFERENCES creations(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts integer DEFAULT 0,
  last_error text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create budget tracking table
CREATE TABLE IF NOT EXISTS tagger_budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  spend DECIMAL(10, 2) DEFAULT 0,
  budget DECIMAL(10, 2) DEFAULT 10.00,
  requests INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to queue tagging job
CREATE OR REPLACE FUNCTION queue_tagger_job()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue if tagger is enabled and creation is from webhook
  IF NEW.source = 'eden-app' AND NEW.state = 'inbox' THEN
    INSERT INTO tagger_queue (creation_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-queue new creations
DROP TRIGGER IF EXISTS auto_queue_tagger ON creations;
CREATE TRIGGER auto_queue_tagger
  AFTER INSERT ON creations
  FOR EACH ROW
  EXECUTE FUNCTION queue_tagger_job();