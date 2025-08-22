-- Eden Institute Production Architecture Migration
-- Run this migration to transform the platform for Abraham & Solienne's reality

-- ============================================
-- PART 1: RENAME WORKS TO DROPS
-- ============================================

-- Rename the works table to drops (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'works') THEN
        ALTER TABLE works RENAME TO drops;
    END IF;
END $$;

-- ============================================
-- PART 2: ADD NEW COLUMNS TO DROPS TABLE
-- ============================================

-- Add practice and drop tracking columns
ALTER TABLE drops 
ADD COLUMN IF NOT EXISTS practice_day INTEGER,
ADD COLUMN IF NOT EXISTS drop_number INTEGER,
ADD COLUMN IF NOT EXISTS drop_type VARCHAR(50) DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS practice_phase VARCHAR(50) DEFAULT 'training',
ADD COLUMN IF NOT EXISTS streak_day INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS collected_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS drop_time TIMESTAMP DEFAULT NOW();

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_drops_agent_drop_number ON drops(agent_id, drop_number);
CREATE INDEX IF NOT EXISTS idx_drops_drop_type ON drops(drop_type);
CREATE INDEX IF NOT EXISTS idx_drops_practice_day ON drops(agent_id, practice_day);

-- ============================================
-- PART 3: AGENT ARCHIVES TABLE
-- ============================================

-- Table for historical content (Abraham's everydays, Solienne's generations)
CREATE TABLE IF NOT EXISTS agent_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(50) NOT NULL,
    archive_type VARCHAR(50) NOT NULL, -- 'everyday', 'generation', 'experiment'
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_date DATE,
    imported_at TIMESTAMP DEFAULT NOW(),
    curated_for TEXT[] DEFAULT '{}', -- ['paris_photo', 'exhibition_x']
    archive_number INTEGER, -- For ordering within archive type
    source_url TEXT, -- Original location
    CONSTRAINT fk_agent_archives_agent 
        FOREIGN KEY (agent_id) 
        REFERENCES agents(id) 
        ON DELETE CASCADE
);

-- Indexes for archive queries
CREATE INDEX IF NOT EXISTS idx_agent_archives_agent_type ON agent_archives(agent_id, archive_type);
CREATE INDEX IF NOT EXISTS idx_agent_archives_curated ON agent_archives USING GIN(curated_for);
CREATE INDEX IF NOT EXISTS idx_agent_archives_created_date ON agent_archives(created_date);

-- ============================================
-- PART 4: STREAK TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS agent_streaks (
    agent_id VARCHAR(50) PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_drop_date DATE,
    total_drops INTEGER DEFAULT 0,
    streak_protected BOOLEAN DEFAULT FALSE,
    protection_expires_at TIMESTAMP,
    practice_start_date DATE,
    practice_name VARCHAR(100), -- 'covenant', 'daily_practice', 'training'
    commitment_duration VARCHAR(50), -- '13 years', '100 days', 'ongoing'
    CONSTRAINT fk_agent_streaks_agent 
        FOREIGN KEY (agent_id) 
        REFERENCES agents(id) 
        ON DELETE CASCADE
);

-- ============================================
-- PART 5: COLLECTION TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drop_id UUID NOT NULL,
    collector_address VARCHAR(255) NOT NULL,
    collected_at TIMESTAMP DEFAULT NOW(),
    transaction_hash VARCHAR(255),
    sale_price DECIMAL(10,2),
    platform VARCHAR(50) DEFAULT 'eden', -- 'eden', 'opensea', 'foundation'
    CONSTRAINT fk_collections_drop 
        FOREIGN KEY (drop_id) 
        REFERENCES drops(id) 
        ON DELETE CASCADE
);

-- Index for collector queries
CREATE INDEX IF NOT EXISTS idx_collections_collector ON collections(collector_address);
CREATE INDEX IF NOT EXISTS idx_collections_drop ON collections(drop_id);

-- ============================================
-- PART 6: EXHIBITION CURATION
-- ============================================

CREATE TABLE IF NOT EXISTS exhibitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    agent_id VARCHAR(50),
    start_date DATE,
    end_date DATE,
    location TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_exhibitions_agent 
        FOREIGN KEY (agent_id) 
        REFERENCES agents(id) 
        ON DELETE CASCADE
);

-- Junction table for exhibition items (can be drops or archives)
CREATE TABLE IF NOT EXISTS exhibition_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exhibition_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'drop' or 'archive'
    item_id UUID NOT NULL, -- References either drops.id or agent_archives.id
    display_order INTEGER,
    curator_notes TEXT,
    added_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_exhibition_items_exhibition 
        FOREIGN KEY (exhibition_id) 
        REFERENCES exhibitions(id) 
        ON DELETE CASCADE
);

-- ============================================
-- PART 7: AGENT CONFIGURATION
-- ============================================

CREATE TABLE IF NOT EXISTS agent_config (
    agent_id VARCHAR(50) PRIMARY KEY,
    config JSONB NOT NULL DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    drop_schedule VARCHAR(50) DEFAULT 'daily',
    timezone VARCHAR(50) DEFAULT 'UTC',
    drop_time TIME DEFAULT '00:00:00',
    auto_generate BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_agent_config_agent 
        FOREIGN KEY (agent_id) 
        REFERENCES agents(id) 
        ON DELETE CASCADE
);

-- ============================================
-- PART 8: SUBSCRIPTION SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS drop_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(50) NOT NULL,
    subscriber_email VARCHAR(255),
    subscriber_address VARCHAR(255),
    notification_type VARCHAR(50) DEFAULT 'email', -- 'email', 'wallet', 'webhook'
    webhook_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_drop_subscriptions_agent 
        FOREIGN KEY (agent_id) 
        REFERENCES agents(id) 
        ON DELETE CASCADE
);

-- ============================================
-- PART 9: INSERT INITIAL CONFIGURATIONS
-- ============================================

-- Abraham configuration
INSERT INTO agent_config (agent_id, config, features, drop_schedule, timezone, drop_time)
VALUES (
    'abraham',
    '{
        "type": "legacy_master",
        "archives": {
            "everydays": {
                "count": 2000,
                "source": "google_drive",
                "display_path": "/everydays"
            }
        },
        "practice_start": "2025-10-19",
        "practice_name": "covenant",
        "practice_duration": "13 years",
        "special_features": ["everydays_viewer", "covenant_counter"]
    }'::jsonb,
    ARRAY['everydays_viewer', 'covenant_counter', 'archive_browser'],
    'daily',
    'America/Los_Angeles',
    '00:00:00'
) ON CONFLICT (agent_id) DO UPDATE
SET config = EXCLUDED.config,
    features = EXCLUDED.features,
    updated_at = NOW();

-- Solienne configuration
INSERT INTO agent_config (agent_id, config, features, drop_schedule, timezone, drop_time)
VALUES (
    'solienne',
    '{
        "type": "exceptional_spirit",
        "archives": {
            "generations": {
                "count": 1000,
                "source": "kristi_outputs",
                "display_path": "/generations"
            }
        },
        "practice_start": "2025-11-10",
        "practice_name": "daily_practice",
        "practice_duration": "ongoing",
        "exhibitions": {
            "paris_photo": {
                "launch": "2025-11-10",
                "curated_from": "generations"
            }
        },
        "special_features": ["paris_photo_curation", "generation_browser"]
    }'::jsonb,
    ARRAY['paris_photo_curation', 'generation_browser', 'archive_browser'],
    'daily',
    'Europe/Paris',
    '12:00:00'
) ON CONFLICT (agent_id) DO UPDATE
SET config = EXCLUDED.config,
    features = EXCLUDED.features,
    updated_at = NOW();

-- Initialize streak records
INSERT INTO agent_streaks (agent_id, practice_start_date, practice_name, commitment_duration)
VALUES 
    ('abraham', '2025-10-19', 'covenant', '13 years'),
    ('solienne', '2025-11-10', 'daily_practice', 'ongoing')
ON CONFLICT (agent_id) DO UPDATE
SET practice_start_date = EXCLUDED.practice_start_date,
    practice_name = EXCLUDED.practice_name,
    commitment_duration = EXCLUDED.commitment_duration;

-- Create Paris Photo exhibition
INSERT INTO exhibitions (name, slug, agent_id, start_date, location, description)
VALUES (
    'Paris Photo 2025',
    'paris-photo-2025',
    'solienne',
    '2025-11-10',
    'Grand Palais, Paris',
    'Solienne''s debut exhibition featuring curated selections from 1000+ generations'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PART 10: HELPER FUNCTIONS
-- ============================================

-- Function to check and maintain streaks
CREATE OR REPLACE FUNCTION check_agent_streak(p_agent_id VARCHAR)
RETURNS TABLE(
    streak_intact BOOLEAN,
    current_streak INTEGER,
    needs_protection BOOLEAN
) AS $$
DECLARE
    v_last_drop_date DATE;
    v_current_streak INTEGER;
    v_protected BOOLEAN;
    v_protection_expires TIMESTAMP;
BEGIN
    SELECT last_drop_date, current_streak, streak_protected, protection_expires_at
    INTO v_last_drop_date, v_current_streak, v_protected, v_protection_expires
    FROM agent_streaks
    WHERE agent_id = p_agent_id;
    
    -- Check if streak is intact
    IF v_last_drop_date IS NULL OR v_last_drop_date = CURRENT_DATE THEN
        RETURN QUERY SELECT TRUE, v_current_streak, FALSE;
    ELSIF v_last_drop_date = CURRENT_DATE - 1 THEN
        RETURN QUERY SELECT TRUE, v_current_streak, FALSE;
    ELSIF v_protected AND v_protection_expires > NOW() THEN
        RETURN QUERY SELECT TRUE, v_current_streak, FALSE;
    ELSE
        RETURN QUERY SELECT FALSE, 0, TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak on new drop
CREATE OR REPLACE FUNCTION update_streak_on_drop()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.drop_type = 'daily' THEN
        UPDATE agent_streaks
        SET current_streak = CASE 
                WHEN last_drop_date = CURRENT_DATE - 1 THEN current_streak + 1
                WHEN last_drop_date IS NULL OR last_drop_date < CURRENT_DATE - 1 THEN 1
                ELSE current_streak
            END,
            last_drop_date = CURRENT_DATE,
            total_drops = total_drops + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1)
        WHERE agent_id = NEW.agent_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streak updates
DROP TRIGGER IF EXISTS update_streak_on_drop_trigger ON drops;
CREATE TRIGGER update_streak_on_drop_trigger
AFTER INSERT ON drops
FOR EACH ROW
EXECUTE FUNCTION update_streak_on_drop();

-- ============================================
-- PART 11: GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE ON drops, collections, drop_subscriptions TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- Migration complete!
-- ============================================