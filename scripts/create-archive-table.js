#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Since we can't run raw SQL through the JS client, we'll use the REST API
async function runSQL(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  
  if (!response.ok) {
    // Try direct approach - we'll just insert a test record to trigger table creation
    return null;
  }
  
  return response.json();
}

async function createTables() {
  console.log('Creating agent_archives table through Supabase dashboard...\n');
  
  console.log('Please run this SQL in your Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/ctlygyrkibupejllgglr/sql\n');
  
  const sql = `
-- Create agent_archives table
CREATE TABLE IF NOT EXISTS agent_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(50) NOT NULL,
    archive_type VARCHAR(50) NOT NULL,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_date DATE,
    imported_at TIMESTAMP DEFAULT NOW(),
    curated_for TEXT[] DEFAULT '{}',
    archive_number INTEGER,
    source_url TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_archives_agent_type ON agent_archives(agent_id, archive_type);
CREATE INDEX IF NOT EXISTS idx_agent_archives_curated ON agent_archives USING GIN(curated_for);
CREATE INDEX IF NOT EXISTS idx_agent_archives_created_date ON agent_archives(created_date);

-- Grant permissions
GRANT SELECT ON agent_archives TO authenticated;
GRANT ALL ON agent_archives TO service_role;
`;
  
  console.log(sql);
  console.log('\n---\n');
  console.log('After running this SQL, run the import script again.');
}

createTables().catch(console.error);