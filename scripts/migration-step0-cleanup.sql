-- Step 0: Clean up any existing tables that might have wrong schema
-- Run this FIRST if you get foreign key errors

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS spirits CASCADE;
DROP TABLE IF EXISTS collects CASCADE;
DROP TABLE IF EXISTS critiques CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS works CASCADE;
DROP TABLE IF EXISTS agents CASCADE;

-- Drop any related indexes
DROP INDEX IF EXISTS works_agent_day;
DROP INDEX IF EXISTS works_created_at;
DROP INDEX IF EXISTS works_state;
DROP INDEX IF EXISTS works_agent_state;
DROP INDEX IF EXISTS tags_routing_curator;
DROP INDEX IF EXISTS tags_quality_print;
DROP INDEX IF EXISTS critiques_work_id;
DROP INDEX IF EXISTS critiques_verdict;
DROP INDEX IF EXISTS collects_work_id;
DROP INDEX IF EXISTS collects_collector;

-- Drop any functions/triggers
DROP TRIGGER IF EXISTS auto_curate_trigger ON critiques;
DROP FUNCTION IF EXISTS auto_curate_on_include();
DROP TRIGGER IF EXISTS auto_queue_work_tagger ON works;
DROP FUNCTION IF EXISTS queue_tagger_for_work();