#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running agents/works migration...\n');

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/006_agents_works_migration.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Split into individual statements (crude but works for this migration)
  const statements = migrationSQL
    .split(/;(?=\s*(?:CREATE|INSERT|DROP|UPDATE|ALTER))/i)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      // Skip empty statements
      if (!statement || statement.length < 10) continue;

      // Log what we're executing (first 80 chars)
      const preview = statement.substring(0, 80).replace(/\n/g, ' ');
      console.log(`Executing: ${preview}...`);

      // Execute the statement
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`  ❌ Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Migration complete:`);
  console.log(`  ✅ ${successCount} statements succeeded`);
  console.log(`  ❌ ${errorCount} statements failed`);

  // Verify the migration
  console.log('\n🔍 Verifying migration...');
  
  const { data: agents, error: agentError } = await supabase
    .from('agents')
    .select('id, name, status, day_count');
  
  if (!agentError && agents) {
    console.log(`  ✅ Agents table: ${agents.length} records`);
    agents.forEach(a => console.log(`     - ${a.name} (${a.id}): ${a.status}, day ${a.day_count}`));
  }

  const { data: works, error: workError } = await supabase
    .from('works')
    .select('id')
    .limit(5);
    
  if (!workError && works) {
    console.log(`  ✅ Works table accessible (${works.length} sample records)`);
  }

  const { data: tags, error: tagError } = await supabase
    .from('tags')
    .select('work_id')
    .limit(1);
    
  if (!tagError) {
    console.log(`  ✅ Tags table accessible`);
  }

  const { data: critiques, error: critiqueError } = await supabase
    .from('critiques')
    .select('id')
    .limit(1);
    
  if (!critiqueError) {
    console.log(`  ✅ Critiques table accessible`);
  }

  const { data: collects, error: collectError } = await supabase
    .from('collects')
    .select('id')
    .limit(1);
    
  if (!collectError) {
    console.log(`  ✅ Collects table accessible`);
  }

  const { data: spirits, error: spiritError } = await supabase
    .from('spirits')
    .select('agent_id')
    .limit(1);
    
  if (!spiritError) {
    console.log(`  ✅ Spirits table accessible`);
  }

  console.log('\n✨ Migration complete!');
}

runMigration().catch(console.error);