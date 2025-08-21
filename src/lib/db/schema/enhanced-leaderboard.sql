-- Enhanced Academy Leaderboard Schema with Revenue-Based Scoring
-- Scoring Formula: 50% revenue + 20% engagement + 20% streak + 10% curation

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT,              -- idle|generating|curating|minting
  streak_days INT DEFAULT 0,
  graduation_day INT DEFAULT 0
);

-- Normalized events (adding indexes for performance)
CREATE INDEX IF NOT EXISTS agent_events_ts ON agent_events(ts);
CREATE INDEX IF NOT EXISTS agent_events_agent_ts ON agent_events(agent_id, ts);

-- 7-Day Rollup Materialized View
DROP MATERIALIZED VIEW IF EXISTS agent_metrics_7d CASCADE;
CREATE MATERIALIZED VIEW agent_metrics_7d AS
WITH last7 AS (
  SELECT *
  FROM agent_events
  WHERE ts >= now() - interval '7 days'
),
sales AS (
  SELECT agent_id,
         COALESCE(SUM( (payload->'sale'->>'amount_usd')::numeric ),0) AS revenue_usd_7d
  FROM last7 WHERE type='SALE_EXECUTED'
  GROUP BY agent_id
),
curation AS (
  SELECT agent_id,
         SUM(CASE WHEN type='CURATION_VERDICT' AND payload->>'verdict'='INCLUDE' THEN 1 ELSE 0 END)::int AS includes_7d,
         SUM(CASE WHEN type='CURATION_VERDICT' AND payload->>'verdict'='EXCLUDE' THEN 1 ELSE 0 END)::int AS excludes_7d
  FROM last7 GROUP BY agent_id
),
eng AS (
  SELECT agent_id,
         SUM(CASE WHEN type='FOLLOW_ADDED' THEN 1 ELSE 0 END)                AS follows,
         SUM(CASE WHEN type='FAVORITE_ADDED' THEN 1 ELSE 0 END)              AS favorites,
         SUM(CASE WHEN type='COMMENT_ADDED' THEN 1 ELSE 0 END)               AS comments,
         SUM(CASE WHEN type='BID_PLACED' THEN 1 ELSE 0 END)                  AS bids
  FROM last7 GROUP BY agent_id
)
SELECT
  a.id AS agent_id,
  a.name,
  a.avatar_url,
  a.status,
  a.streak_days,
  a.graduation_day,
  COALESCE(sales.revenue_usd_7d,0) AS revenue_usd_7d,
  COALESCE(eng.follows,0) AS follows_7d,
  COALESCE(eng.favorites,0) AS favorites_7d,
  COALESCE(eng.comments,0) AS comments_7d,
  COALESCE(eng.bids,0) AS bids_7d,
  COALESCE(cur.includes_7d,0) AS includes_7d,
  COALESCE(cur.excludes_7d,0) AS excludes_7d,
  -- Calculate components for scoring
  COALESCE(cur.includes_7d,0)::numeric / NULLIF(COALESCE(cur.includes_7d,0) + COALESCE(cur.excludes_7d,0), 0) AS curation_pass_rate,
  1.0*COALESCE(eng.follows,0) + 0.5*COALESCE(eng.favorites,0) + 0.5*COALESCE(eng.comments,0) + 1.5*COALESCE(eng.bids,0) AS engagement_idx,
  LEAST(a.streak_days::numeric/100, 1.0) AS streak_days_norm,
  -- Final score calculation
  0.50 * LN(1 + COALESCE(sales.revenue_usd_7d,0)) +
  0.20 * (1.0*COALESCE(eng.follows,0) + 0.5*COALESCE(eng.favorites,0) + 0.5*COALESCE(eng.comments,0) + 1.5*COALESCE(eng.bids,0)) +
  0.20 * LEAST(a.streak_days::numeric/100, 1.0) +
  0.10 * COALESCE(cur.includes_7d,0)::numeric / NULLIF(COALESCE(cur.includes_7d,0) + COALESCE(cur.excludes_7d,0), 0) AS score
FROM agents a
LEFT JOIN sales ON sales.agent_id=a.id
LEFT JOIN curation cur ON cur.agent_id=a.id
LEFT JOIN eng ON eng.agent_id=a.id;

-- 30-Day Rollup Materialized View
DROP MATERIALIZED VIEW IF EXISTS agent_metrics_30d CASCADE;
CREATE MATERIALIZED VIEW agent_metrics_30d AS
WITH last30 AS (
  SELECT *
  FROM agent_events
  WHERE ts >= now() - interval '30 days'
),
sales AS (
  SELECT agent_id,
         COALESCE(SUM( (payload->'sale'->>'amount_usd')::numeric ),0) AS revenue_usd_30d
  FROM last30 WHERE type='SALE_EXECUTED'
  GROUP BY agent_id
),
curation AS (
  SELECT agent_id,
         SUM(CASE WHEN type='CURATION_VERDICT' AND payload->>'verdict'='INCLUDE' THEN 1 ELSE 0 END)::int AS includes_30d,
         SUM(CASE WHEN type='CURATION_VERDICT' AND payload->>'verdict'='EXCLUDE' THEN 1 ELSE 0 END)::int AS excludes_30d
  FROM last30 GROUP BY agent_id
),
eng AS (
  SELECT agent_id,
         SUM(CASE WHEN type='FOLLOW_ADDED' THEN 1 ELSE 0 END)                AS follows,
         SUM(CASE WHEN type='FAVORITE_ADDED' THEN 1 ELSE 0 END)              AS favorites,
         SUM(CASE WHEN type='COMMENT_ADDED' THEN 1 ELSE 0 END)               AS comments,
         SUM(CASE WHEN type='BID_PLACED' THEN 1 ELSE 0 END)                  AS bids
  FROM last30 GROUP BY agent_id
)
SELECT
  a.id AS agent_id,
  a.name,
  a.avatar_url,
  a.status,
  a.streak_days,
  a.graduation_day,
  COALESCE(sales.revenue_usd_30d,0) AS revenue_usd_30d,
  COALESCE(eng.follows,0) AS follows_30d,
  COALESCE(eng.favorites,0) AS favorites_30d,
  COALESCE(eng.comments,0) AS comments_30d,
  COALESCE(eng.bids,0) AS bids_30d,
  COALESCE(cur.includes_30d,0) AS includes_30d,
  COALESCE(cur.excludes_30d,0) AS excludes_30d,
  -- Calculate components for scoring
  COALESCE(cur.includes_30d,0)::numeric / NULLIF(COALESCE(cur.includes_30d,0) + COALESCE(cur.excludes_30d,0), 0) AS curation_pass_rate,
  1.0*COALESCE(eng.follows,0) + 0.5*COALESCE(eng.favorites,0) + 0.5*COALESCE(eng.comments,0) + 1.5*COALESCE(eng.bids,0) AS engagement_idx,
  LEAST(a.streak_days::numeric/100, 1.0) AS streak_days_norm,
  -- Final score calculation
  0.50 * LN(1 + COALESCE(sales.revenue_usd_30d,0)) +
  0.20 * (1.0*COALESCE(eng.follows,0) + 0.5*COALESCE(eng.favorites,0) + 0.5*COALESCE(eng.comments,0) + 1.5*COALESCE(eng.bids,0)) +
  0.20 * LEAST(a.streak_days::numeric/100, 1.0) +
  0.10 * COALESCE(cur.includes_30d,0)::numeric / NULLIF(COALESCE(cur.includes_30d,0) + COALESCE(cur.excludes_30d,0), 0) AS score
FROM agents a
LEFT JOIN sales ON sales.agent_id=a.id
LEFT JOIN curation cur ON cur.agent_id=a.id
LEFT JOIN eng ON eng.agent_id=a.id;

-- Refresh function for concurrent updates
CREATE OR REPLACE FUNCTION refresh_leaderboard_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY agent_metrics_7d;
  REFRESH MATERIALIZED VIEW CONCURRENTLY agent_metrics_30d;
END;
$$ LANGUAGE plpgsql;

-- Create unique indexes for CONCURRENTLY refresh
CREATE UNIQUE INDEX IF NOT EXISTS agent_metrics_7d_agent_id ON agent_metrics_7d(agent_id);
CREATE UNIQUE INDEX IF NOT EXISTS agent_metrics_30d_agent_id ON agent_metrics_30d(agent_id);