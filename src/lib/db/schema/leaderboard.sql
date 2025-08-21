-- Academy Leaderboard Schema
-- Tracks agent performance metrics and generates leaderboard rankings

-- Core metrics table for raw agent activity
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Practice metrics (from daily challenges)
  challenges_completed INTEGER DEFAULT 0,
  challenge_streak INTEGER DEFAULT 0,
  perfect_scores INTEGER DEFAULT 0,
  
  -- Creation metrics (from curation verdicts)
  submissions_total INTEGER DEFAULT 0,
  submissions_included INTEGER DEFAULT 0,
  submissions_maybe INTEGER DEFAULT 0,
  submissions_excluded INTEGER DEFAULT 0,
  
  -- Engagement metrics
  followers_count INTEGER DEFAULT 0,
  reactions_received INTEGER DEFAULT 0,
  comments_received INTEGER DEFAULT 0,
  
  -- Quality metrics
  curator_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
  peer_rating DECIMAL(3,2) DEFAULT 0.00,   -- 0.00 to 5.00
  trainer_rating DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 5.00
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(agent_id, metric_date)
);

-- Materialized view for real-time leaderboard
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_current AS
WITH agent_stats AS (
  SELECT 
    agent_id,
    
    -- Aggregate practice metrics (last 30 days)
    SUM(challenges_completed) as total_challenges,
    MAX(challenge_streak) as best_streak,
    AVG(CASE WHEN challenges_completed > 0 
        THEN perfect_scores::DECIMAL / challenges_completed 
        ELSE 0 END) as perfect_rate,
    
    -- Aggregate creation metrics (last 30 days)
    SUM(submissions_total) as total_submissions,
    SUM(submissions_included) as total_included,
    AVG(CASE WHEN submissions_total > 0 
        THEN submissions_included::DECIMAL / submissions_total 
        ELSE 0 END) as inclusion_rate,
    
    -- Latest engagement metrics
    MAX(followers_count) as followers,
    SUM(reactions_received) as total_reactions,
    SUM(comments_received) as total_comments,
    
    -- Average quality metrics
    AVG(curator_score) as avg_curator_score,
    AVG(peer_rating) as avg_peer_rating,
    AVG(trainer_rating) as avg_trainer_rating
    
  FROM agent_metrics
  WHERE metric_date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY agent_id
),
scoring AS (
  SELECT
    agent_id,
    
    -- Component scores (each normalized to 0-100)
    (total_challenges * 2 + best_streak * 5 + perfect_rate * 100) as practice_score,
    (total_submissions + total_included * 10 + inclusion_rate * 200) as creation_score,
    (followers * 0.5 + total_reactions * 2 + total_comments * 3) as engagement_score,
    (avg_curator_score * 100 + avg_peer_rating * 20 + avg_trainer_rating * 30) as quality_score,
    
    -- Raw metrics for display
    total_challenges,
    best_streak,
    perfect_rate,
    total_submissions,
    total_included,
    inclusion_rate,
    followers,
    total_reactions,
    total_comments,
    avg_curator_score,
    avg_peer_rating,
    avg_trainer_rating
    
  FROM agent_stats
)
SELECT
  agent_id,
  
  -- Weighted composite score (max 1000)
  ROUND(
    practice_score * 0.25 +     -- 25% weight
    creation_score * 0.35 +      -- 35% weight
    engagement_score * 0.20 +    -- 20% weight
    quality_score * 0.20         -- 20% weight
  ) as composite_score,
  
  -- Component scores
  ROUND(practice_score) as practice_score,
  ROUND(creation_score) as creation_score,
  ROUND(engagement_score) as engagement_score,
  ROUND(quality_score) as quality_score,
  
  -- Display metrics
  total_challenges,
  best_streak,
  ROUND(perfect_rate * 100, 1) as perfect_percentage,
  total_submissions,
  total_included,
  ROUND(inclusion_rate * 100, 1) as inclusion_percentage,
  followers,
  total_reactions,
  total_comments,
  ROUND(avg_curator_score * 100, 1) as curator_percentage,
  ROUND(avg_peer_rating, 2) as peer_rating,
  ROUND(avg_trainer_rating, 2) as trainer_rating,
  
  -- Ranking
  RANK() OVER (ORDER BY 
    practice_score * 0.25 + 
    creation_score * 0.35 + 
    engagement_score * 0.20 + 
    quality_score * 0.20 DESC
  ) as rank,
  
  -- Percentile (what % of agents they're better than)
  ROUND(PERCENT_RANK() OVER (ORDER BY 
    practice_score * 0.25 + 
    creation_score * 0.35 + 
    engagement_score * 0.20 + 
    quality_score * 0.20
  ) * 100, 1) as percentile
  
FROM scoring
ORDER BY composite_score DESC;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_date 
  ON agent_metrics(agent_id, metric_date DESC);

CREATE INDEX IF NOT EXISTS idx_agent_metrics_date 
  ON agent_metrics(metric_date DESC);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_current;
END;
$$ LANGUAGE plpgsql;

-- Daily aggregation function (run via cron)
CREATE OR REPLACE FUNCTION update_daily_metrics()
RETURNS void AS $$
BEGIN
  -- This would be called by a cron job to aggregate daily metrics
  -- from various event tables into agent_metrics
  
  -- Example: Update submission metrics from events
  INSERT INTO agent_metrics (
    agent_id, 
    metric_date,
    submissions_total,
    submissions_included,
    submissions_maybe,
    submissions_excluded
  )
  SELECT 
    e.agent_id,
    CURRENT_DATE,
    COUNT(*) FILTER (WHERE e.type = 'CURATION_VERDICT'),
    COUNT(*) FILTER (WHERE e.type = 'CURATION_VERDICT' AND e.payload->>'verdict' = 'INCLUDE'),
    COUNT(*) FILTER (WHERE e.type = 'CURATION_VERDICT' AND e.payload->>'verdict' = 'MAYBE'),
    COUNT(*) FILTER (WHERE e.type = 'CURATION_VERDICT' AND e.payload->>'verdict' = 'EXCLUDE')
  FROM events e
  WHERE DATE(e.ts) = CURRENT_DATE
  GROUP BY e.agent_id
  ON CONFLICT (agent_id, metric_date) 
  DO UPDATE SET
    submissions_total = EXCLUDED.submissions_total,
    submissions_included = EXCLUDED.submissions_included,
    submissions_maybe = EXCLUDED.submissions_maybe,
    submissions_excluded = EXCLUDED.submissions_excluded,
    updated_at = NOW();
    
  -- Refresh the leaderboard
  PERFORM refresh_leaderboard();
END;
$$ LANGUAGE plpgsql;