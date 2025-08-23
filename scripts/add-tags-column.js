const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addTagsColumn() {
  console.log('Adding tags column to agent_archives table...');
  
  // First, let's check if the column already exists
  const { data: columns, error: columnsError } = await supabase
    .rpc('get_table_columns', { 
      table_name: 'agent_archives',
      schema_name: 'public' 
    })
    .single();
  
  if (columnsError) {
    console.log('Will attempt to add tags column...');
    
    // Try using raw SQL through Supabase
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE agent_archives 
        ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
      `
    });
    
    if (error) {
      console.error('Error adding tags column:', error);
      console.log('\nPlease run this SQL in your Supabase dashboard:');
      console.log(`
ALTER TABLE agent_archives
  ADD COLUMN tags TEXT[] DEFAULT '{}';

CREATE INDEX idx_agent_archives_tags 
  ON agent_archives USING GIN (tags);
      `);
      return false;
    }
  }
  
  console.log('Tags column ready!');
  return true;
}

addTagsColumn().catch(console.error);
