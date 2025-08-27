-- Migration: MIYOMI Launch Tables
-- Date: 2025-08-27
-- Description: Creates tables for MIYOMI prediction market agent

-- Create enum for market platforms
DO $$ BEGIN
    CREATE TYPE market_platform AS ENUM ('KALSHI', 'POLYMARKET', 'MANIFOLD', 'MELEE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for position types
DO $$ BEGIN
    CREATE TYPE market_position AS ENUM ('YES', 'NO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for pick status
DO $$ BEGIN
    CREATE TYPE pick_status AS ENUM ('PENDING', 'WIN', 'LOSS', 'LIVE', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create miyomi_picks table for tracking market predictions
CREATE TABLE IF NOT EXISTS miyomi_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Market details
  market TEXT NOT NULL,
  platform market_platform NOT NULL,
  position market_position NOT NULL,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  edge DECIMAL(3,2) CHECK (edge >= -1 AND edge <= 1),
  
  -- Odds tracking
  entry_odds DECIMAL(5,2) NOT NULL,
  current_odds DECIMAL(5,2),
  exit_odds DECIMAL(5,2),
  
  -- Status and results
  status pick_status NOT NULL DEFAULT 'PENDING',
  category TEXT,
  
  -- Media
  video_url TEXT,
  analysis_url TEXT,
  
  -- Metadata
  reasoning JSONB,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  
  -- Performance tracking
  pnl DECIMAL(10,2),
  roi DECIMAL(5,2)
);

-- Create miyomi_performance table for aggregate stats
CREATE TABLE IF NOT EXISTS miyomi_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  
  -- Daily stats
  picks_made INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  pending INTEGER DEFAULT 0,
  
  -- Performance metrics
  win_rate DECIMAL(5,2),
  avg_confidence DECIMAL(3,2),
  avg_edge DECIMAL(3,2),
  total_pnl DECIMAL(10,2),
  roi DECIMAL(5,2),
  
  -- Platform breakdown
  platform_stats JSONB DEFAULT '{}',
  category_stats JSONB DEFAULT '{}',
  
  -- Streaks
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  worst_streak INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create miyomi_config table for agent configuration
CREATE TABLE IF NOT EXISTS miyomi_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Risk parameters
  risk_tolerance DECIMAL(3,2) DEFAULT 0.5,
  contrarian_dial DECIMAL(3,2) DEFAULT 0.7,
  
  -- Sector weights
  sector_weights JSONB DEFAULT '{
    "politics": 0.15,
    "sports": 0.15,
    "finance": 0.20,
    "ai": 0.15,
    "pop": 0.10,
    "geo": 0.15,
    "internet": 0.10
  }',
  
  -- Restrictions
  banned_topics TEXT[] DEFAULT '{}',
  max_daily_picks INTEGER DEFAULT 10,
  min_confidence DECIMAL(3,2) DEFAULT 0.6,
  min_edge DECIMAL(3,2) DEFAULT 0.05,
  
  -- Tone settings
  tone_settings JSONB DEFAULT '{
    "energy": 0.8,
    "sass": 0.7,
    "profanity": 0.3
  }',
  
  -- Active flag
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_miyomi_picks_timestamp ON miyomi_picks(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_miyomi_picks_status ON miyomi_picks(status);
CREATE INDEX IF NOT EXISTS idx_miyomi_picks_platform ON miyomi_picks(platform);
CREATE INDEX IF NOT EXISTS idx_miyomi_picks_category ON miyomi_picks(category);
CREATE INDEX IF NOT EXISTS idx_miyomi_performance_date ON miyomi_performance(date DESC);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_miyomi_picks_updated_at') THEN
    CREATE TRIGGER update_miyomi_picks_updated_at BEFORE UPDATE
      ON miyomi_picks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_miyomi_performance_updated_at') THEN
    CREATE TRIGGER update_miyomi_performance_updated_at BEFORE UPDATE
      ON miyomi_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_miyomi_config_updated_at') THEN
    CREATE TRIGGER update_miyomi_config_updated_at BEFORE UPDATE
      ON miyomi_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert default configuration
INSERT INTO miyomi_config (active) VALUES (true) 
ON CONFLICT (id) DO NOTHING;

-- Create view for current performance
CREATE OR REPLACE VIEW miyomi_current_stats AS
SELECT
    (SELECT COUNT(*) FROM miyomi_picks WHERE status = 'LIVE') as live_picks,
    (SELECT COUNT(*) FROM miyomi_picks WHERE status = 'WIN') as total_wins,
    (SELECT COUNT(*) FROM miyomi_picks WHERE status = 'LOSS') as total_losses,
    (SELECT AVG(confidence) FROM miyomi_picks WHERE timestamp > NOW() - INTERVAL '7 days') as week_avg_confidence,
    (SELECT SUM(pnl) FROM miyomi_picks WHERE resolved_at > NOW() - INTERVAL '30 days') as month_pnl,
    (SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE status = 'WIN'))::DECIMAL / COUNT(*)
            ELSE 0
        END
     FROM miyomi_picks 
     WHERE status IN ('WIN', 'LOSS')
     AND resolved_at > NOW() - INTERVAL '30 days'
    ) as month_win_rate;

-- Add RLS policies
ALTER TABLE miyomi_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE miyomi_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE miyomi_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for miyomi_picks" ON miyomi_picks;
DROP POLICY IF EXISTS "Public read access for miyomi_performance" ON miyomi_performance;
DROP POLICY IF EXISTS "Service role write access for miyomi_picks" ON miyomi_picks;
DROP POLICY IF EXISTS "Service role write access for miyomi_performance" ON miyomi_performance;
DROP POLICY IF EXISTS "Service role access for miyomi_config" ON miyomi_config;

-- Public read access for picks and performance
CREATE POLICY "Public read access for miyomi_picks" ON miyomi_picks
  FOR SELECT USING (true);

CREATE POLICY "Public read access for miyomi_performance" ON miyomi_performance
  FOR SELECT USING (true);

-- Restricted write access (service role only)
CREATE POLICY "Service role write access for miyomi_picks" ON miyomi_picks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role write access for miyomi_performance" ON miyomi_performance
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role access for miyomi_config" ON miyomi_config
  FOR ALL USING (auth.role() = 'service_role');