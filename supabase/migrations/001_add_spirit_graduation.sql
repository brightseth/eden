-- Eden3 Spirit Graduation System
-- Adds onchain graduation capabilities to existing agents
-- Version: 1.0.0

-- Add graduation status to existing agents table
ALTER TABLE agents 
ADD COLUMN graduated BOOLEAN DEFAULT false,
ADD COLUMN graduation_mode VARCHAR(20) DEFAULT 'DRAFT' 
  CHECK (graduation_mode IN ('DRAFT', 'ID_ONLY', 'ID_PLUS_TOKEN', 'FULL_STACK')),
ADD COLUMN graduation_date TIMESTAMP WITH TIME ZONE;

-- Spirit onchain data (separate from AI configuration)
CREATE TABLE spirit_onchain (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE UNIQUE,
  registry_token_id BIGINT UNIQUE, -- ERC-721 token ID from Registry contract  
  wallet_address VARCHAR(42), -- Safe wallet address
  token_address VARCHAR(42), -- Optional ERC-20 token address
  covenant_cid VARCHAR(255), -- IPFS hash of practice covenant
  treasury_safe_address VARCHAR(42), -- Treasury Safe address
  metadata_cid VARCHAR(255), -- IPFS metadata hash
  graduation_transaction VARCHAR(66), -- Transaction hash of graduation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Practices (daily rituals/covenants)
CREATE TABLE practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('CREATOR', 'CURATOR', 'TRADER')),
  time_of_day TIME NOT NULL, -- 24hr format (e.g., '21:00')
  output_type VARCHAR(50) NOT NULL, -- ARTWORK, EXHIBITION, ACQUISITION, etc.
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0 AND quantity <= 10),
  frequency VARCHAR(10) DEFAULT 'DAILY' CHECK (frequency IN ('DAILY', 'WEEKLY')),
  sabbath_day INTEGER CHECK (sabbath_day >= 0 AND sabbath_day <= 6), -- 0=Sunday
  active BOOLEAN DEFAULT true,
  covenant_cid VARCHAR(255), -- IPFS hash of this practice's covenant
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Treasury management (for graduated spirits)
CREATE TABLE treasuries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spirit_onchain_id UUID NOT NULL REFERENCES spirit_onchain(id) ON DELETE CASCADE,
  safe_address VARCHAR(42) NOT NULL,
  balance_eth DECIMAL(18, 8) DEFAULT 0,
  balance_token DECIMAL(18, 8) DEFAULT 0,
  total_revenue DECIMAL(18, 8) DEFAULT 0,
  total_costs DECIMAL(18, 8) DEFAULT 0,
  practice_runs INTEGER DEFAULT 0,
  last_practice_run TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Practice executions (track daily practice runs)
CREATE TABLE practice_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  execution_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'SCHEDULED' 
    CHECK (status IN ('SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED')),
  output_cid VARCHAR(255), -- IPFS hash of created work
  output_metadata JSONB DEFAULT '{}',
  gas_used BIGINT,
  gas_cost_wei BIGINT,
  execution_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(practice_id, execution_date)
);

-- Academy graduation tracking  
CREATE TABLE graduations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  starting_archetype VARCHAR(20) NOT NULL CHECK (starting_archetype IN ('CREATOR', 'CURATOR', 'TRADER')),
  graduation_mode VARCHAR(20) NOT NULL CHECK (graduation_mode IN ('ID_ONLY', 'ID_PLUS_TOKEN', 'FULL_STACK')),
  ceremony_date TIMESTAMP WITH TIME ZONE NOT NULL,
  witness_addresses TEXT[], -- Array of witness wallet addresses
  covenant_ipfs_hash VARCHAR(255) NOT NULL,
  registry_transaction VARCHAR(66), -- graduateSpirit transaction hash
  safe_deployment_transaction VARCHAR(66),
  token_deployment_transaction VARCHAR(66),
  status VARCHAR(20) DEFAULT 'PENDING' 
    CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_agents_graduated ON agents(graduated);
CREATE INDEX idx_agents_graduation_mode ON agents(graduation_mode);
CREATE INDEX idx_spirit_onchain_agent ON spirit_onchain(agent_id);
CREATE INDEX idx_spirit_onchain_token_id ON spirit_onchain(registry_token_id);
CREATE INDEX idx_practices_agent ON practices(agent_id, active);
CREATE INDEX idx_practices_type_time ON practices(type, time_of_day);
CREATE INDEX idx_treasuries_spirit ON treasuries(spirit_onchain_id);
CREATE INDEX idx_practice_executions_practice_date ON practice_executions(practice_id, execution_date DESC);
CREATE INDEX idx_practice_executions_status ON practice_executions(status, execution_date);
CREATE INDEX idx_graduations_agent ON graduations(agent_id);
CREATE INDEX idx_graduations_status ON graduations(status, ceremony_date);

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_spirit_onchain_updated_at BEFORE UPDATE ON spirit_onchain
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practices_updated_at BEFORE UPDATE ON practices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treasuries_updated_at BEFORE UPDATE ON treasuries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_executions_updated_at BEFORE UPDATE ON practice_executions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_graduations_updated_at BEFORE UPDATE ON graduations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for new tables
ALTER TABLE spirit_onchain ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduations ENABLE ROW LEVEL SECURITY;

-- Public read policies (adjust as needed)
CREATE POLICY "Allow public read access to spirit_onchain" ON spirit_onchain
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to practices" ON practices
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to treasuries" ON treasuries
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to practice_executions" ON practice_executions
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to graduations" ON graduations
  FOR SELECT USING (true);

-- Grant permissions
GRANT ALL ON spirit_onchain TO authenticated;
GRANT ALL ON practices TO authenticated;
GRANT ALL ON treasuries TO authenticated;
GRANT ALL ON practice_executions TO authenticated;
GRANT ALL ON graduations TO authenticated;

GRANT SELECT ON spirit_onchain TO anon;
GRANT SELECT ON practices TO anon;
GRANT SELECT ON treasuries TO anon;
GRANT SELECT ON practice_executions TO anon;
GRANT SELECT ON graduations TO anon;

-- Function to get agent graduation status
CREATE OR REPLACE FUNCTION get_agent_graduation_status(agent_uuid UUID)
RETURNS TABLE (
  agent_name VARCHAR(255),
  graduated BOOLEAN,
  graduation_mode VARCHAR(20),
  registry_token_id BIGINT,
  wallet_address VARCHAR(42),
  active_practices INTEGER,
  total_practice_runs INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.name,
    a.graduated,
    a.graduation_mode,
    so.registry_token_id,
    so.wallet_address,
    (SELECT COUNT(*)::INTEGER FROM practices p WHERE p.agent_id = agent_uuid AND p.active = true),
    COALESCE(t.practice_runs, 0)::INTEGER
  FROM agents a
  LEFT JOIN spirit_onchain so ON a.id = so.agent_id
  LEFT JOIN treasuries t ON so.id = t.spirit_onchain_id
  WHERE a.id = agent_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;