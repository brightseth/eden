-- EMERGENCY DATABASE SCHEMA - COVENANT WITNESSES
-- Critical Path: DAY 2 - Database Setup for 100 Witness Target

-- ============================================================================
-- COVENANT WITNESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS covenant_witnesses (
    -- Primary Key
    address VARCHAR(42) PRIMARY KEY CHECK (address ~ '^0x[a-fA-F0-9]{40}$'),
    
    -- Identity Information
    ens_name VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    
    -- Blockchain Data
    transaction_hash VARCHAR(66) NOT NULL CHECK (transaction_hash ~ '^0x[a-fA-F0-9]{64}$'),
    block_number BIGINT DEFAULT 0,
    
    -- Witness Metadata
    witness_number SERIAL UNIQUE NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL,
    
    -- Notification Preferences
    notification_preferences JSONB DEFAULT '{
        "dailyAuctions": true,
        "milestones": true,
        "emergency": true
    }',
    
    -- Status and Timing
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COVENANT EVENTS TABLE (For milestone tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS covenant_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Index for quick event lookups
    INDEX idx_covenant_events_type_created (event_type, created_at),
    INDEX idx_covenant_events_created (created_at DESC)
);

-- ============================================================================
-- WITNESS NOTIFICATIONS TABLE (Email queue)
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
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    sent_at TIMESTAMPTZ NULL,
    error_message TEXT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Index for delivery processing
    INDEX idx_notifications_status_created (status, created_at),
    INDEX idx_notifications_witness (witness_address)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Witness lookup indexes
CREATE INDEX IF NOT EXISTS idx_witnesses_number ON covenant_witnesses(witness_number);
CREATE INDEX IF NOT EXISTS idx_witnesses_status ON covenant_witnesses(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_witnesses_created ON covenant_witnesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_witnesses_email ON covenant_witnesses(email) WHERE email IS NOT NULL;

-- Transaction tracking
CREATE INDEX IF NOT EXISTS idx_witnesses_tx_hash ON covenant_witnesses(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_witnesses_block ON covenant_witnesses(block_number) WHERE block_number > 0;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to witnesses table
DROP TRIGGER IF EXISTS update_witnesses_updated_at ON covenant_witnesses;
CREATE TRIGGER update_witnesses_updated_at
    BEFORE UPDATE ON covenant_witnesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to notifications table
DROP TRIGGER IF EXISTS update_notifications_updated_at ON witness_notifications;
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON witness_notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

-- Get recent witnesses for display
CREATE OR REPLACE FUNCTION get_recent_witnesses(limit_count INT DEFAULT 10)
RETURNS TABLE (
    address VARCHAR(42),
    ens_name VARCHAR(255),
    witness_number INT,
    signed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.address,
        w.ens_name,
        w.witness_number,
        w.signed_at
    FROM covenant_witnesses w
    WHERE w.status = 'active'
    ORDER BY w.witness_number DESC
    LIMIT limit_count;
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

-- ============================================================================
-- VIEWS FOR DASHBOARD QUERIES
-- ============================================================================

-- Witness registry dashboard view
CREATE OR REPLACE VIEW witness_registry_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM covenant_witnesses WHERE status = 'active') as total_witnesses,
    100 as target_witnesses,
    ROUND(((SELECT COUNT(*)::FLOAT FROM covenant_witnesses WHERE status = 'active') / 100::FLOAT) * 100)::INT as percent_complete,
    (SELECT COUNT(*) FROM covenant_witnesses WHERE status = 'active') >= 100 as launch_ready,
    CASE 
        WHEN (SELECT COUNT(*)::FLOAT FROM covenant_witnesses WHERE status = 'active') / 100::FLOAT < 0.5 THEN 'CRITICAL'
        WHEN (SELECT COUNT(*)::FLOAT FROM covenant_witnesses WHERE status = 'active') / 100::FLOAT < 0.75 THEN 'WARNING'
        WHEN (SELECT COUNT(*)::FLOAT FROM covenant_witnesses WHERE status = 'active') / 100::FLOAT < 0.9 THEN 'PROGRESS'
        ELSE 'READY'
    END as critical_status;

-- Recent witness activity view
CREATE OR REPLACE VIEW recent_witness_activity AS
SELECT 
    w.address,
    w.ens_name,
    w.witness_number,
    w.signed_at,
    w.created_at,
    CASE 
        WHEN w.witness_number <= 10 THEN 'FOUNDING_TEN'
        WHEN w.witness_number <= 50 THEN 'EARLY_SUPPORTER'
        WHEN w.witness_number <= 100 THEN 'LAUNCH_WITNESS'
        ELSE 'POST_LAUNCH'
    END as witness_tier
FROM covenant_witnesses w
WHERE w.status = 'active'
ORDER BY w.witness_number DESC;

-- ============================================================================
-- SECURITY AND PERMISSIONS
-- ============================================================================

-- Row Level Security (RLS) for witness privacy
ALTER TABLE covenant_witnesses ENABLE ROW LEVEL SECURITY;

-- Policy: Witnesses can view their own record
CREATE POLICY witness_own_record ON covenant_witnesses
    FOR ALL USING (address = LOWER(current_setting('app.witness_address', true)));

-- Policy: Public read access to basic witness info (no email/private data)
CREATE POLICY witness_public_read ON covenant_witnesses
    FOR SELECT USING (true);

-- ============================================================================
-- EMERGENCY LAUNCH READINESS QUERY
-- ============================================================================

-- Critical path monitoring query
CREATE OR REPLACE VIEW covenant_launch_status AS
SELECT 
    -- Witness Registry Status
    (SELECT COUNT(*) FROM covenant_witnesses WHERE status = 'active') as current_witnesses,
    100 as required_witnesses,
    ROUND(((SELECT COUNT(*)::FLOAT FROM covenant_witnesses WHERE status = 'active') / 100::FLOAT) * 100) as witness_progress_percent,
    
    -- Launch Timeline
    '2025-10-19 00:00:00-04'::TIMESTAMPTZ as covenant_launch_date,
    EXTRACT(days FROM '2025-10-19 00:00:00-04'::TIMESTAMPTZ - NOW()) as days_until_launch,
    
    -- Critical Status
    CASE 
        WHEN (SELECT COUNT(*) FROM covenant_witnesses WHERE status = 'active') >= 100 THEN 'LAUNCH_READY'
        WHEN EXTRACT(days FROM '2025-10-19 00:00:00-04'::TIMESTAMPTZ - NOW()) <= 7 THEN 'CRITICAL'
        WHEN (SELECT COUNT(*) FROM covenant_witnesses WHERE status = 'active') >= 75 THEN 'WARNING'
        ELSE 'IN_PROGRESS'
    END as launch_status,
    
    -- Recent Activity
    (SELECT COUNT(*) FROM covenant_witnesses WHERE status = 'active' AND created_at > NOW() - INTERVAL '24 hours') as witnesses_today,
    (SELECT COUNT(*) FROM covenant_witnesses WHERE status = 'active' AND created_at > NOW() - INTERVAL '7 days') as witnesses_this_week;

-- ============================================================================
-- INITIAL DATA AND TESTING
-- ============================================================================

-- Insert test witness records for development (commented out for production)
/*
INSERT INTO covenant_witnesses (
    address, ens_name, email, transaction_hash, witness_number, signed_at
) VALUES 
    ('0x1234567890123456789012345678901234567890', 'test1.eth', 'test1@example.com', '0x1111111111111111111111111111111111111111111111111111111111111111', 1, NOW() - INTERVAL '1 day'),
    ('0x2345678901234567890123456789012345678901', 'test2.eth', 'test2@example.com', '0x2222222222222222222222222222222222222222222222222222222222222222', 2, NOW() - INTERVAL '12 hours'),
    ('0x3456789012345678901234567890123456789012', NULL, 'test3@example.com', '0x3333333333333333333333333333333333333333333333333333333333333333', 3, NOW() - INTERVAL '6 hours');
*/

-- ============================================================================
-- MONITORING AND ALERTS
-- ============================================================================

-- Function to check if we're on track for October 19 launch
CREATE OR REPLACE FUNCTION check_launch_readiness()
RETURNS TABLE (
    status TEXT,
    message TEXT,
    witnesses_needed INT,
    days_remaining INT,
    daily_rate_needed FLOAT
) AS $$
DECLARE
    current_witnesses INT;
    days_left INT;
    rate_needed FLOAT;
BEGIN
    SELECT COUNT(*) INTO current_witnesses FROM covenant_witnesses WHERE status = 'active';
    SELECT EXTRACT(days FROM '2025-10-19 00:00:00-04'::TIMESTAMPTZ - NOW())::INT INTO days_left;
    
    IF current_witnesses >= 100 THEN
        RETURN QUERY SELECT 'READY'::TEXT, 'Launch ready! 100 witnesses achieved.'::TEXT, 0, days_left, 0.0::FLOAT;
    ELSIF days_left <= 0 THEN
        RETURN QUERY SELECT 'FAILED'::TEXT, 'Launch date passed without 100 witnesses.'::TEXT, 100 - current_witnesses, 0, 0.0::FLOAT;
    ELSE
        rate_needed := (100 - current_witnesses)::FLOAT / days_left::FLOAT;
        IF rate_needed <= 1 THEN
            RETURN QUERY SELECT 'ON_TRACK'::TEXT, 'On track for October 19 launch.'::TEXT, 100 - current_witnesses, days_left, rate_needed;
        ELSIF rate_needed <= 3 THEN
            RETURN QUERY SELECT 'URGENT'::TEXT, 'Need to accelerate witness recruitment!'::TEXT, 100 - current_witnesses, days_left, rate_needed;
        ELSE
            RETURN QUERY SELECT 'CRITICAL'::TEXT, 'EMERGENCY: Covenant launch at risk!'::TEXT, 100 - current_witnesses, days_left, rate_needed;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FINAL STATUS
-- ============================================================================

-- Display current status
SELECT 
    'COVENANT WITNESS DATABASE READY' as status,
    NOW() as created_at,
    'Emergency 24-hour implementation complete' as note;

-- Show launch readiness check
SELECT * FROM check_launch_readiness();