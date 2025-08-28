-- Migration 015: CITIZEN Snapshot DAO Governance Integration
-- Date: 2025-08-28
-- Purpose: Add governance schema for CITIZEN Snapshot integration on Sepolia testnet

-- Create governance_profiles table
CREATE TABLE IF NOT EXISTS governance_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    dao_space_name TEXT NOT NULL,
    snapshot_space_id TEXT NOT NULL,
    voting_power JSONB NOT NULL DEFAULT '{}',
    governance_role TEXT NOT NULL CHECK (governance_role IN ('FACILITATOR', 'MEMBER', 'OBSERVER')),
    proposal_rights JSONB NOT NULL DEFAULT '{}',
    consensus_framework TEXT NOT NULL CHECK (consensus_framework IN ('ROUGH_CONSENSUS', 'MAJORITY', 'SUPERMAJORITY')),
    network_id INTEGER NOT NULL DEFAULT 11155111, -- Sepolia testnet
    last_sync_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, snapshot_space_id, network_id)
);

-- Add governance fields to works table
ALTER TABLE works 
ADD COLUMN IF NOT EXISTS governance_type TEXT CHECK (governance_type IN ('snapshot_proposal', 'consensus_building', 'voting_coordination')),
ADD COLUMN IF NOT EXISTS snapshot_proposal_id TEXT,
ADD COLUMN IF NOT EXISTS network_id INTEGER,
ADD COLUMN IF NOT EXISTS voting_period JSONB,
ADD COLUMN IF NOT EXISTS voting_results JSONB,
ADD COLUMN IF NOT EXISTS consensus_score DECIMAL(3,2) CHECK (consensus_score >= 0 AND consensus_score <= 1);

-- Create indexes for governance queries
CREATE INDEX IF NOT EXISTS idx_governance_profiles_agent_id ON governance_profiles(agent_id);
CREATE INDEX IF NOT EXISTS idx_governance_profiles_space_id ON governance_profiles(snapshot_space_id);
CREATE INDEX IF NOT EXISTS idx_governance_profiles_network ON governance_profiles(network_id);
CREATE INDEX IF NOT EXISTS idx_works_governance_type ON works(governance_type) WHERE governance_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_works_snapshot_proposal ON works(snapshot_proposal_id) WHERE snapshot_proposal_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_works_network_governance ON works(network_id, governance_type) WHERE governance_type IS NOT NULL;

-- Create governance_events table for audit trail
CREATE TABLE IF NOT EXISTS governance_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    work_id TEXT REFERENCES works(id),
    governance_profile_id TEXT REFERENCES governance_profiles(id),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'proposal_created', 
        'proposal_updated', 
        'vote_cast', 
        'consensus_reached', 
        'sync_completed',
        'sync_failed'
    )),
    snapshot_data JSONB,
    registry_data JSONB,
    network_id INTEGER NOT NULL,
    external_tx_hash TEXT,
    external_proposal_id TEXT,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for governance events
CREATE INDEX IF NOT EXISTS idx_governance_events_agent ON governance_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_governance_events_work ON governance_events(work_id);
CREATE INDEX IF NOT EXISTS idx_governance_events_type ON governance_events(event_type);
CREATE INDEX IF NOT EXISTS idx_governance_events_network ON governance_events(network_id);
CREATE INDEX IF NOT EXISTS idx_governance_events_created ON governance_events(created_at);
CREATE INDEX IF NOT EXISTS idx_governance_events_external_proposal ON governance_events(external_proposal_id) WHERE external_proposal_id IS NOT NULL;

-- Add updated_at trigger for governance_profiles
CREATE OR REPLACE FUNCTION update_governance_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER governance_profiles_updated_at_trigger
    BEFORE UPDATE ON governance_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_governance_profiles_updated_at();

-- Create RLS policies for governance tables
ALTER TABLE governance_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read governance profiles
CREATE POLICY "Allow authenticated users to read governance profiles" ON governance_profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow service role to manage governance profiles
CREATE POLICY "Allow service role to manage governance profiles" ON governance_profiles
    FOR ALL
    TO service_role
    USING (true);

-- Allow authenticated users to read governance events
CREATE POLICY "Allow authenticated users to read governance events" ON governance_events
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow service role to insert governance events
CREATE POLICY "Allow service role to insert governance events" ON governance_events
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Insert initial CITIZEN governance profile for Sepolia testnet
INSERT INTO governance_profiles (
    agent_id,
    dao_space_name,
    snapshot_space_id,
    voting_power,
    governance_role,
    proposal_rights,
    consensus_framework,
    network_id,
    metadata
) 
SELECT 
    a.id,
    'Eden Academy DAO',
    'eden.eth',
    jsonb_build_object(
        'tokenSymbol', 'EDEN',
        'contractAddress', 'TBD', -- Will be configured based on Eden token contract
        'votingWeight', 1,
        'delegationEnabled', false
    ),
    'FACILITATOR',
    jsonb_build_object(
        'canCreate', true,
        'canVeto', true,
        'minimumHoldings', 1
    ),
    'ROUGH_CONSENSUS',
    1, -- Mainnet for eden.eth space  
    jsonb_build_object(
        'description', 'CITIZEN governance profile for Eden Academy DAO via eden.eth Snapshot space',
        'space_type', 'eden_testnet',
        'created_via_migration', true
    )
FROM agents a 
WHERE a.handle = 'citizen'
ON CONFLICT (agent_id, snapshot_space_id, network_id) DO NOTHING;

-- Add comment to track migration purpose
COMMENT ON TABLE governance_profiles IS 'Registry governance profiles for agent DAO participation via Snapshot integration';
COMMENT ON TABLE governance_events IS 'Audit trail for all governance-related events and Registry-Snapshot sync operations';
COMMENT ON COLUMN works.governance_type IS 'Type of governance work: snapshot_proposal, consensus_building, or voting_coordination';
COMMENT ON COLUMN works.snapshot_proposal_id IS 'External Snapshot proposal ID for cross-reference';
COMMENT ON COLUMN works.network_id IS 'Blockchain network ID (11155111 for Sepolia testnet)';
COMMENT ON COLUMN works.consensus_score IS 'Calculated consensus achievement score from 0.0 to 1.0';