-- Add tags column for image analysis and filtering
ALTER TABLE agent_archives
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for better tag filtering performance
CREATE INDEX IF NOT EXISTS idx_agent_archives_tags 
  ON agent_archives USING GIN (tags);

-- Add some initial tag categories for Solienne's works
-- These will be populated by the tagging system
COMMENT ON COLUMN agent_archives.tags IS 'Array of tags for filtering: portrait, landscape, abstract, architectural, figure, nature, etc.';