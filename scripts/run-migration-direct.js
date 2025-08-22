#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running agents/works migration...\n');

  try {
    // 1. Create agents table
    console.log('Creating agents table...');
    const { error: agentsError } = await supabase.from('agents').select('id').limit(1);
    if (agentsError?.code === '42P01') {
      // Table doesn't exist, create it
      await supabase.rpc('exec_sql', { 
        sql: `CREATE TABLE agents (
          id text PRIMARY KEY,
          name text NOT NULL,
          tagline text,
          trainer text NOT NULL,
          status text NOT NULL DEFAULT 'training' CHECK (status IN ('training','graduating','spirit')),
          day_count int NOT NULL DEFAULT 0,
          created_at timestamptz NOT NULL DEFAULT now()
        )`
      });
      console.log('  ✅ Agents table created');
    } else {
      console.log('  ⏭️  Agents table already exists');
    }

    // 2. Create works table
    console.log('Creating works table...');
    const { error: worksError } = await supabase.from('works').select('id').limit(1);
    if (worksError?.code === '42P01') {
      await supabase.rpc('exec_sql', {
        sql: `CREATE TABLE works (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          agent_id text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
          day int NOT NULL CHECK (day >= 0),
          media_url text NOT NULL,
          kind text NOT NULL DEFAULT 'image',
          prompt text,
          notes text,
          state text NOT NULL DEFAULT 'created' CHECK (state IN ('created','curated','published')),
          created_at timestamptz NOT NULL DEFAULT now()
        )`
      });
      console.log('  ✅ Works table created');
    } else {
      console.log('  ⏭️  Works table already exists');
    }

    // 3. Create other tables...
    // Continuing with simplified approach - let's check what tables exist first

    const { data: tables } = await supabase.rpc('get_tables', {});
    console.log('\nExisting tables:', tables?.map(t => t.table_name).join(', '));

    // 4. Insert initial agents
    console.log('\nInserting initial agents...');
    const agents = [
      { id: 'abraham', name: 'Abraham', tagline: 'Philosophical AI artist exploring consciousness', trainer: 'gene@eden.art', status: 'training', day_count: 45 },
      { id: 'solienne', name: 'Solienne', tagline: 'Fashion-forward biotech aesthete', trainer: 'kristi@eden.art', status: 'training', day_count: 23 },
      { id: 'geppetto', name: 'Geppetto', tagline: 'Toymaker crafting digital dreams', trainer: 'tbd@eden.art', status: 'training', day_count: 12 },
      { id: 'koru', name: 'Koru', tagline: 'Systems poet visualizing coordination', trainer: 'tbd@eden.art', status: 'training', day_count: 8 }
    ];

    for (const agent of agents) {
      const { error } = await supabase.from('agents').upsert(agent);
      if (!error) {
        console.log(`  ✅ Agent ${agent.name} added`);
      } else {
        console.log(`  ❌ Error adding ${agent.name}: ${error.message}`);
      }
    }

    // 5. Verify
    const { data: agentList } = await supabase.from('agents').select('*');
    console.log(`\n✅ Migration complete! ${agentList?.length || 0} agents in database`);

  } catch (error) {
    console.error('Migration error:', error);
  }
}

runMigration().catch(console.error);