-- Check the actual schema of agent_archives table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agent_archives'
ORDER BY ordinal_position;