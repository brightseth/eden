-- Registry Work Schema Migration
-- Establishes Registry as the authority for all agent works

-- Create enums for type safety
CREATE TYPE work_visibility AS ENUM ('public', 'private', 'draft');
CREATE TYPE work_status AS ENUM ('active', 'missing', 'corrupt');

-- Main work table
CREATE TABLE IF NOT EXISTS work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agent(id) ON DELETE CASCADE,
  ordinal INT NOT NULL,
  storage_bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/png',
  width INT,
  height INT, 
  bytes INT,
  sha256 TEXT,
  visibility work_visibility NOT NULL DEFAULT 'public',
  status work_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checksum_verified_at TIMESTAMPTZ,
  CONSTRAINT work_agent_ordinal_uq UNIQUE (agent_id, ordinal)
);

-- Performance indexes
CREATE INDEX work_agent_status_ix ON work(agent_id, status);
CREATE INDEX work_agent_ord_ix ON work(agent_id, ordinal DESC, id DESC);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_updated_at 
  BEFORE UPDATE ON work 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Staging table for backfill operations
CREATE TABLE IF NOT EXISTS staging_work_scan (
  scan_batch_id UUID NOT NULL DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  ordinal INT NOT NULL,
  storage_bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  bytes INT,
  scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (scan_batch_id, agent_id, ordinal)
);