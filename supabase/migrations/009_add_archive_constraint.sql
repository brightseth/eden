-- Add unique constraint for agent_archives upsert
ALTER TABLE agent_archives 
ADD CONSTRAINT agent_archives_unique_key 
UNIQUE (agent_id, archive_type, archive_number);