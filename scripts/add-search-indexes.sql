-- Add search indexes for Abraham's Everydays archive
-- Run this in Supabase SQL editor

-- Add index on model name for filtering
CREATE INDEX IF NOT EXISTS idx_agent_archives_model 
ON agent_archives ((metadata->'config'->>'model_name'))
WHERE agent_id = 'abraham' AND archive_type = 'everyday';

-- Add index on created date for date range filtering
CREATE INDEX IF NOT EXISTS idx_agent_archives_date 
ON agent_archives (created_date)
WHERE agent_id = 'abraham' AND archive_type = 'everyday';

-- Create a function to search prompts
CREATE OR REPLACE FUNCTION search_abraham_prompts(search_term TEXT)
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  created_date DATE,
  archive_number INTEGER,
  model_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    aa.id,
    aa.title,
    aa.description,
    aa.image_url,
    aa.created_date,
    aa.archive_number,
    aa.metadata->'config'->>'model_name' as model_name
  FROM agent_archives aa
  WHERE 
    aa.agent_id = 'abraham' 
    AND aa.archive_type = 'everyday'
    AND (
      aa.title ILIKE '%' || search_term || '%'
      OR aa.description ILIKE '%' || search_term || '%'
      OR EXISTS (
        SELECT 1 
        FROM jsonb_array_elements(aa.metadata->'prompts') AS prompt
        WHERE prompt::text ILIKE '%' || search_term || '%'
      )
    );
END;
$$ LANGUAGE plpgsql;

-- Get distinct models for filter dropdown
CREATE OR REPLACE FUNCTION get_abraham_models()
RETURNS TABLE(model_name TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    metadata->'config'->>'model_name' as model_name,
    COUNT(*) as count
  FROM agent_archives
  WHERE 
    agent_id = 'abraham' 
    AND archive_type = 'everyday'
    AND metadata->'config'->>'model_name' IS NOT NULL
  GROUP BY metadata->'config'->>'model_name'
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;