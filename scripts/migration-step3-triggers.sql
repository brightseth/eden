-- Step 3: Create triggers for automation
-- Run this after step 2 completes

-- Create function to auto-curate on INCLUDE verdict
CREATE OR REPLACE FUNCTION auto_curate_on_include()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verdict = 'INCLUDE' THEN
    UPDATE works SET state = 'curated' 
    WHERE id = NEW.work_id AND state = 'created';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-curate
DROP TRIGGER IF EXISTS auto_curate_trigger ON critiques;
CREATE TRIGGER auto_curate_trigger
  AFTER INSERT ON critiques
  FOR EACH ROW
  EXECUTE FUNCTION auto_curate_on_include();