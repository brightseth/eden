const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function countAll() {
  console.log('Counting all Solienne works...\n');
  
  // Count with service key
  const { count: serviceCount, error: serviceError } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne');
    
  if (serviceError) {
    console.error('Service key error:', serviceError);
  } else {
    console.log(`Service key sees: ${serviceCount} Solienne works`);
  }
  
  // Count with anon key
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { count: anonCount, error: anonError } = await anonSupabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne');
    
  if (anonError) {
    console.error('Anon key error:', anonError);
  } else {
    console.log(`Anon key sees: ${anonCount} Solienne works`);
  }
  
  // Check archive_type distribution
  const { data: types } = await supabase
    .from('agent_archives')
    .select('archive_type')
    .eq('agent_id', 'solienne');
    
  const typeCounts = {};
  types?.forEach(item => {
    typeCounts[item.archive_type] = (typeCounts[item.archive_type] || 0) + 1;
  });
  
  console.log('\nBy archive type:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
}

countAll().catch(console.error);