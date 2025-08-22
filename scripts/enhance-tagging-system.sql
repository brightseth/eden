-- Enhance the tagging system for better filtering and organization
-- This focuses on internal team use, not broad audience features

-- 1. Add date and filename tracking to works
ALTER TABLE works 
  ADD COLUMN IF NOT EXISTS captured_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS filename TEXT;

-- 2. Add useful indexes for filtering
CREATE INDEX IF NOT EXISTS tags_type_idx ON tags ((taxonomy->>'type'));
CREATE INDEX IF NOT EXISTS tags_series_idx ON tags ((taxonomy->>'series'));
CREATE INDEX IF NOT EXISTS tags_subject_idx ON tags USING GIN ((taxonomy->'subject'));
CREATE INDEX IF NOT EXISTS tags_print_ready_idx ON tags ((quality->>'print_readiness'));
CREATE INDEX IF NOT EXISTS works_captured_idx ON works(captured_at);
CREATE INDEX IF NOT EXISTS works_state_captured_idx ON works(state, captured_at DESC);

-- 3. Create a view for the inbox that joins works with tags
CREATE OR REPLACE VIEW inbox_view AS
SELECT 
  w.id,
  w.agent_id,
  w.day,
  w.media_url,
  w.filename,
  w.state,
  w.captured_at,
  w.created_at,
  t.taxonomy,
  t.features,
  t.quality,
  t.routing,
  t.confidence,
  -- Extract commonly filtered fields for easier querying
  t.taxonomy->>'type' as type,
  t.taxonomy->>'series' as series,
  t.taxonomy->'subject' as subjects,
  (t.quality->>'print_readiness')::numeric as print_readiness,
  t.quality->>'artifact_risk' as artifact_risk,
  t.routing->>'send_to_curator' as send_to_curator
FROM works w
LEFT JOIN tags t ON t.work_id = w.id
WHERE w.state = 'created'
ORDER BY w.captured_at DESC NULLS LAST, w.created_at DESC;

-- 4. Create a function to extract date from filename
CREATE OR REPLACE FUNCTION extract_date_from_filename(fname TEXT)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  date_match TEXT;
  parsed_date TIMESTAMPTZ;
BEGIN
  -- Try to extract YYYY-MM-DD pattern
  date_match := substring(fname from '\d{4}-\d{2}-\d{2}');
  IF date_match IS NOT NULL THEN
    BEGIN
      parsed_date := date_match::date;
      -- Also try to extract time HHMM after the date
      date_match := substring(fname from '\d{4}-\d{2}-\d{2}[_-](\d{4})');
      IF date_match IS NOT NULL THEN
        parsed_date := parsed_date + 
          (substring(date_match from '\d{2}')::int || ':' || 
           substring(date_match from '\d{2}$')::int)::time;
      END IF;
      RETURN parsed_date;
    EXCEPTION WHEN OTHERS THEN
      RETURN NULL;
    END;
  END IF;
  
  -- Try YYYYMMDD format
  date_match := substring(fname from '\d{8}');
  IF date_match IS NOT NULL AND length(date_match) = 8 THEN
    BEGIN
      parsed_date := to_date(date_match, 'YYYYMMDD');
      RETURN parsed_date;
    EXCEPTION WHEN OTHERS THEN
      RETURN NULL;
    END;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Update existing works to extract dates from filenames
UPDATE works 
SET captured_at = COALESCE(
  extract_date_from_filename(filename),
  extract_date_from_filename(media_url),
  created_at
)
WHERE captured_at IS NULL;

-- 6. Create function to get distinct series for filtering
CREATE OR REPLACE FUNCTION get_distinct_series(agent_id_filter TEXT DEFAULT NULL)
RETURNS TABLE(series TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.taxonomy->>'series' as series,
    COUNT(*) as count
  FROM tags t
  JOIN works w ON w.id = t.work_id
  WHERE 
    t.taxonomy->>'series' IS NOT NULL
    AND t.taxonomy->>'series' != ''
    AND (agent_id_filter IS NULL OR w.agent_id = agent_id_filter)
  GROUP BY t.taxonomy->>'series'
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- 7. Create function to get distinct subjects for filtering
CREATE OR REPLACE FUNCTION get_distinct_subjects(agent_id_filter TEXT DEFAULT NULL)
RETURNS TABLE(subject TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_array_elements_text(t.taxonomy->'subject') as subject,
    COUNT(*) as count
  FROM tags t
  JOIN works w ON w.id = t.work_id
  WHERE 
    t.taxonomy->'subject' IS NOT NULL
    AND (agent_id_filter IS NULL OR w.agent_id = agent_id_filter)
  GROUP BY subject
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. Add tagger budget tracking
CREATE TABLE IF NOT EXISTS tagger_budget (
  date DATE PRIMARY KEY,
  calls_made INT DEFAULT 0,
  usd_spent NUMERIC(10,2) DEFAULT 0,
  daily_limit_usd NUMERIC(10,2) DEFAULT 10.00
);

-- 9. Function to check if tagger budget allows another call
CREATE OR REPLACE FUNCTION can_run_tagger()
RETURNS BOOLEAN AS $$
DECLARE
  today_budget RECORD;
BEGIN
  SELECT * INTO today_budget 
  FROM tagger_budget 
  WHERE date = CURRENT_DATE;
  
  IF today_budget IS NULL THEN
    INSERT INTO tagger_budget (date) VALUES (CURRENT_DATE);
    RETURN TRUE;
  END IF;
  
  RETURN today_budget.usd_spent < today_budget.daily_limit_usd;
END;
$$ LANGUAGE plpgsql;

-- 10. Track tagger usage
CREATE OR REPLACE FUNCTION track_tagger_usage(cost_usd NUMERIC)
RETURNS VOID AS $$
BEGIN
  INSERT INTO tagger_budget (date, calls_made, usd_spent)
  VALUES (CURRENT_DATE, 1, cost_usd)
  ON CONFLICT (date) DO UPDATE
  SET 
    calls_made = tagger_budget.calls_made + 1,
    usd_spent = tagger_budget.usd_spent + cost_usd;
END;
$$ LANGUAGE plpgsql;