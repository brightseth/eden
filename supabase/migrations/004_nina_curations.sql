-- Nina Curations and Agent Creations
-- Stores curation results and published creations

-- Curations table (all Nina evaluations)
CREATE TABLE IF NOT EXISTS curations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  agent_name VARCHAR(255) NOT NULL,
  image_url TEXT,
  image_data TEXT, -- base64 if needed
  
  -- Nina verdict
  verdict VARCHAR(20) NOT NULL CHECK (verdict IN ('INCLUDE', 'MAYBE', 'EXCLUDE')),
  weighted_total DECIMAL(3, 2),
  confidence DECIMAL(3, 2),
  
  -- Detailed scores
  scores JSONB DEFAULT '{}',
  rationales JSONB DEFAULT '{}',
  
  -- Nina's analysis
  i_see TEXT,
  prompt_patch TEXT,
  flags TEXT[],
  
  -- Gate checks
  gate_checks JSONB DEFAULT '{}',
  
  -- Metadata
  curator_version VARCHAR(50) DEFAULT '2.0',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agent creations table (published works)
CREATE TABLE IF NOT EXISTS creations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  agent_name VARCHAR(255) NOT NULL,
  curation_id UUID REFERENCES curations(id) ON DELETE SET NULL,
  
  -- Creation details
  title VARCHAR(500),
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Collection info
  collection VARCHAR(255),
  edition_size INTEGER DEFAULT 1,
  price DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'ETH',
  
  -- Sales data
  sold_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  
  -- Display
  featured BOOLEAN DEFAULT false,
  display_order INTEGER,
  tags TEXT[],
  
  -- Status
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'archived')),
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Follows table (user follows agents)
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL, -- Can be anonymous ID
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  agent_name VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, agent_id)
);

-- Studio settings table
CREATE TABLE IF NOT EXISTS studio_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Settings
  style_prompt TEXT,
  daily_target INTEGER DEFAULT 10,
  auto_publish_threshold VARCHAR(50) DEFAULT 'INCLUDE',
  
  -- Performance targets
  target_inclusion_rate DECIMAL(3, 2) DEFAULT 0.25,
  min_score_threshold INTEGER DEFAULT 75,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(agent_id)
);

-- Indexes for performance
CREATE INDEX idx_curations_agent_id ON curations(agent_id);
CREATE INDEX idx_curations_verdict ON curations(verdict);
CREATE INDEX idx_curations_published ON curations(published);
CREATE INDEX idx_creations_agent_id ON creations(agent_id);
CREATE INDEX idx_creations_status ON creations(status);
CREATE INDEX idx_follows_user_id ON follows(user_id);
CREATE INDEX idx_follows_agent_id ON follows(agent_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_curations_updated_at BEFORE UPDATE ON curations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creations_updated_at BEFORE UPDATE ON creations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_studio_settings_updated_at BEFORE UPDATE ON studio_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();