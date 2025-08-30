-- EMERGENCY COVENANT WITNESS TABLES - FOR SUPABASE DASHBOARD
-- Critical Path: HOUR 18-24 - Manual database setup for witness registry
-- COPY AND PASTE THIS INTO SUPABASE SQL EDITOR

-- ============================================================================
-- COVENANT WITNESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS covenant_witnesses (
    -- Primary Key
    address VARCHAR(42) PRIMARY KEY,
    
    -- Identity Information
    ens_name VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    
    -- Blockchain Data
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT DEFAULT 0,
    
    -- Witness Metadata
    witness_number SERIAL UNIQUE NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL,
    
    -- Notification Preferences
    notification_preferences JSONB DEFAULT '{"dailyAuctions": true, "milestones": true, "emergency": true}',
    
    -- Status and Timing
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_address CHECK (address ~ '^0x[a-fA-F0-9]{40}$'),
    CONSTRAINT valid_tx_hash CHECK (transaction_hash ~ '^0x[a-fA-F0-9]{64}$'),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- ============================================================================
-- WITNESS NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS witness_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    witness_address VARCHAR(42) REFERENCES covenant_witnesses(address),
    
    -- Email Details
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template VARCHAR(50) NOT NULL,
    template_data JSONB DEFAULT '{}',
    
    -- Delivery Status
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMPTZ NULL,
    error_message TEXT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_notification_status CHECK (status IN ('pending', 'sent', 'failed', 'bounced'))
);

-- ============================================================================
-- COVENANT EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS covenant_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_witnesses_number ON covenant_witnesses(witness_number);
CREATE INDEX IF NOT EXISTS idx_witnesses_status ON covenant_witnesses(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_witnesses_created ON covenant_witnesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_witnesses_email ON covenant_witnesses(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_witnesses_tx_hash ON covenant_witnesses(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_notifications_status_created ON witness_notifications(status, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_witness ON witness_notifications(witness_address);

-- ============================================================================
-- FUNCTIONS FOR WITNESS MANAGEMENT
-- ============================================================================

-- Get witness count for dashboard
CREATE OR REPLACE FUNCTION get_witness_count()
RETURNS TABLE (
    total_witnesses INT,
    target_witnesses INT,
    percent_complete INT,
    launch_ready BOOLEAN,
    critical_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*)::INT as total,
            100 as target
        FROM covenant_witnesses 
        WHERE status = 'active'
    )
    SELECT 
        s.total,
        s.target,
        ROUND((s.total::FLOAT / s.target::FLOAT) * 100)::INT as percent,
        (s.total >= s.target) as ready,
        CASE 
            WHEN s.total::FLOAT / s.target::FLOAT < 0.5 THEN 'CRITICAL'
            WHEN s.total::FLOAT / s.target::FLOAT < 0.75 THEN 'WARNING'
            WHEN s.total::FLOAT / s.target::FLOAT < 0.9 THEN 'PROGRESS'
            ELSE 'READY'
        END as status
    FROM stats s;
END;
$$ LANGUAGE plpgsql;

-- Check if address is already a witness
CREATE OR REPLACE FUNCTION is_witness(check_address VARCHAR(42))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM covenant_witnesses 
        WHERE address = LOWER(check_address) 
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_witnesses_updated_at ON covenant_witnesses;
CREATE TRIGGER update_witnesses_updated_at
    BEFORE UPDATE ON covenant_witnesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON witness_notifications;
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON witness_notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE covenant_witnesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE witness_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE covenant_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role can manage covenant_witnesses"
    ON covenant_witnesses FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage witness_notifications"
    ON witness_notifications FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage covenant_events"
    ON covenant_events FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Allow public read access to basic witness info
CREATE POLICY "Public can view covenant_witnesses"
    ON covenant_witnesses FOR SELECT
    USING (true);

-- ============================================================================
-- TEST QUERIES
-- ============================================================================

-- Test witness count function
SELECT * FROM get_witness_count();

-- Test table creation
SELECT COUNT(*) as witness_count FROM covenant_witnesses;
SELECT COUNT(*) as notification_count FROM witness_notifications;
SELECT COUNT(*) as event_count FROM covenant_events;

-- Display success message
SELECT 
    'COVENANT WITNESS DATABASE READY' as status,
    NOW() as created_at,
    '🎯 100 Witness Target | 📅 October 19, 2025 Launch' as mission;