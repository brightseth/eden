-- MIYOMI Subscription System Tables
-- Handles tiers, payments, and access control

-- Subscription tiers and user subscriptions
CREATE TABLE IF NOT EXISTS miyomi_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    tier_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pick access tracking
CREATE TABLE IF NOT EXISTS miyomi_pick_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    pick_id TEXT NOT NULL,
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    tier_at_access TEXT NOT NULL
);

-- Revenue tracking
CREATE TABLE IF NOT EXISTS miyomi_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('subscription', 'one_time', 'refund')),
    description TEXT,
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Picks table with tier requirements
CREATE TABLE IF NOT EXISTS miyomi_picks (
    id TEXT PRIMARY KEY,
    market TEXT NOT NULL,
    platform TEXT NOT NULL,
    position TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    edge DECIMAL(3,2) NOT NULL,
    odds DECIMAL(3,2) NOT NULL,
    reasoning TEXT NOT NULL,
    sector TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    timeframe TEXT,
    sources JSONB,
    required_tier TEXT DEFAULT 'FREE',
    edge_threshold DECIMAL(3,2) DEFAULT 0.10,
    is_exclusive BOOLEAN DEFAULT FALSE,
    release_delay INTEGER DEFAULT 0, -- hours
    performance DECIMAL(4,2), -- actual return if resolved
    status TEXT DEFAULT 'pending',
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriber activity tracking
CREATE TABLE IF NOT EXISTS miyomi_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_miyomi_subscriptions_user ON miyomi_subscriptions(user_id);
CREATE INDEX idx_miyomi_subscriptions_status ON miyomi_subscriptions(status);
CREATE INDEX idx_miyomi_pick_access_user ON miyomi_pick_access(user_id);
CREATE INDEX idx_miyomi_pick_access_pick ON miyomi_pick_access(pick_id);
CREATE INDEX idx_miyomi_revenue_user ON miyomi_revenue(user_id);
CREATE INDEX idx_miyomi_picks_sector ON miyomi_picks(sector);
CREATE INDEX idx_miyomi_picks_platform ON miyomi_picks(platform);
CREATE INDEX idx_miyomi_picks_generated ON miyomi_picks(generated_at);
CREATE INDEX idx_miyomi_activity_user ON miyomi_activity(user_id);
CREATE INDEX idx_miyomi_activity_created ON miyomi_activity(created_at);

-- Row level security
ALTER TABLE miyomi_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE miyomi_pick_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE miyomi_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE miyomi_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE miyomi_activity ENABLE ROW LEVEL SECURITY;

-- Policies for user access
CREATE POLICY "Users can view their own subscriptions"
    ON miyomi_subscriptions FOR SELECT
    USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view their pick access"
    ON miyomi_pick_access FOR SELECT
    USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view available picks"
    ON miyomi_picks FOR SELECT
    USING (true); -- Access control handled in application layer

CREATE POLICY "Service role can manage all data"
    ON miyomi_subscriptions FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage pick access"
    ON miyomi_pick_access FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage revenue"
    ON miyomi_revenue FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage picks"
    ON miyomi_picks FOR ALL
    USING (auth.role() = 'service_role');

-- Function to calculate MRR
CREATE OR REPLACE FUNCTION calculate_miyomi_mrr()
RETURNS TABLE(
    total_mrr DECIMAL,
    tier_breakdown JSONB,
    subscriber_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(CASE 
            WHEN tier_id = 'tier_contrarian' THEN 49
            WHEN tier_id = 'tier_oracle' THEN 199
            WHEN tier_id = 'tier_whale' THEN 999
            ELSE 0
        END) as total_mrr,
        jsonb_object_agg(tier_id, count) as tier_breakdown,
        COUNT(*)::INTEGER as subscriber_count
    FROM (
        SELECT tier_id, COUNT(*) as count
        FROM miyomi_subscriptions
        WHERE status = 'active'
        GROUP BY tier_id
    ) t;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_miyomi_subscriptions_updated_at
    BEFORE UPDATE ON miyomi_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();