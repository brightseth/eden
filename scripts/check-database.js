#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('Checking database tables...\n');
  
  // Check if key tables exist
  const tables = [
    'agents',
    'works',
    'drops',
    'agent_archives',
    'agent_streaks',
    'collections',
    'exhibitions',
    'agent_config'
  ];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table '${table}' - ${error.message}`);
      } else {
        console.log(`✓ Table '${table}' exists (${count || 0} records)`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' - Error: ${err.message}`);
    }
  }
  
  // Check if abraham agent exists
  console.log('\nChecking Abraham agent...');
  const { data: abraham, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', 'abraham')
    .single();
  
  if (abraham) {
    console.log('✓ Abraham agent exists:', abraham.name);
  } else {
    console.log('❌ Abraham agent not found');
  }
}

checkDatabase().catch(console.error);