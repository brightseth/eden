-- Eden Agent Academy Database Schema
-- Version: 1.0.0
-- Description: Complete schema for AI agent training platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS agent_milestones CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS economy_events CASCADE;
DROP TABLE IF EXISTS daily_metrics CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS programs CASCADE;

-- Programs table (training cohorts)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL UNIQUE,
  artist_statement TEXT,
  avatar_url TEXT,
  wallet_address VARCHAR(255),
  current_stage INTEGER DEFAULT 0,
  current_day INTEGER DEFAULT 0,
  total_days INTEGER DEFAULT 100,
  launch_date DATE,
  days_until_launch INTEGER,
  economy_mode VARCHAR(20) DEFAULT 'training' CHECK (economy_mode IN ('training', 'live')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily metrics table
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  creations_count INTEGER DEFAULT 0,
  farcaster_followers INTEGER DEFAULT 0,
  farcaster_posts INTEGER DEFAULT 0,
  engagement_score DECIMAL(10, 2) DEFAULT 0,
  revenue_primary DECIMAL(10, 2) DEFAULT 0,
  revenue_secondary DECIMAL(10, 2) DEFAULT 0,
  costs DECIMAL(10, 2) DEFAULT 0,
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  vip_commit BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, date)
);

-- Economy events table (event sourcing for economic activity)
CREATE TABLE economy_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 0,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Milestones table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agent milestones junction table
CREATE TABLE agent_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, milestone_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_agents_program ON agents(program_id);
CREATE INDEX idx_agents_economy_mode ON agents(economy_mode);
CREATE INDEX idx_agents_current_stage ON agents(current_stage);
CREATE INDEX idx_daily_metrics_agent_date ON daily_metrics(agent_id, date DESC);
CREATE INDEX idx_economy_events_agent ON economy_events(agent_id, created_at DESC);
CREATE INDEX idx_economy_events_type ON economy_events(event_type);
CREATE INDEX idx_milestones_stage ON milestones(stage, order_index);
CREATE INDEX idx_agent_milestones_agent ON agent_milestones(agent_id);
CREATE INDEX idx_agent_milestones_completed ON agent_milestones(completed);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to calculate days_until_launch
CREATE OR REPLACE FUNCTION update_days_until_launch()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.launch_date IS NOT NULL THEN
    NEW.days_until_launch = GREATEST(0, NEW.launch_date - CURRENT_DATE);
  ELSE
    NEW.days_until_launch = NULL;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply days_until_launch triggers
CREATE TRIGGER update_agents_days_until_launch_insert BEFORE INSERT ON agents
  FOR EACH ROW EXECUTE FUNCTION update_days_until_launch();

CREATE TRIGGER update_agents_days_until_launch_update BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_days_until_launch();

CREATE TRIGGER update_daily_metrics_updated_at BEFORE UPDATE ON daily_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_milestones_updated_at BEFORE UPDATE ON agent_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE economy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Allow public read access to programs" ON programs
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to agents" ON agents
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to daily_metrics" ON daily_metrics
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to economy_events" ON economy_events
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to milestones" ON milestones
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to agent_milestones" ON agent_milestones
  FOR SELECT USING (true);

-- Grant permissions to authenticated users (adjust as needed)
GRANT ALL ON programs TO authenticated;
GRANT ALL ON agents TO authenticated;
GRANT ALL ON daily_metrics TO authenticated;
GRANT ALL ON economy_events TO authenticated;
GRANT ALL ON milestones TO authenticated;
GRANT ALL ON agent_milestones TO authenticated;

-- Grant permissions to anon users (read-only)
GRANT SELECT ON programs TO anon;
GRANT SELECT ON agents TO anon;
GRANT SELECT ON daily_metrics TO anon;
GRANT SELECT ON economy_events TO anon;
GRANT SELECT ON milestones TO anon;
GRANT SELECT ON agent_milestones TO anon;