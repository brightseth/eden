const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function debugArchiveTypes() {
  console.log('Debugging Solienne archive types...\n');
  
  // Get ALL Solienne works
  const { data: allWorks, error: allError } = await supabase
    .from('agent_archives')
    .select('id, archive_type')
    .eq('agent_id', 'solienne');
    
  if (allError) {
    console.error('Error:', allError);
    return;
  }
  
  console.log(`Total Solienne works: ${allWorks.length}`);
  
  // Count by type including nulls and 'work'
  const typeCounts = {};
  allWorks.forEach(work => {
    const type = work.archive_type || 'NULL_TYPE';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  console.log('\nBreakdown by archive_type:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  "${type}": ${count}`);
  });
  
  // Check what the component is querying for
  console.log('\n--- What EnhancedArchiveBrowser queries ---');
  
  const { data: workType, count: workCount } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact' })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'work');
    
  console.log(`archive_type='work': ${workCount} records`);
  
  const { data: genType, count: genCount } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact' })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
    
  console.log(`archive_type='generation': ${genCount} records`);
  
  // Check if there are works with 'work' type that need updating
  if (workCount > 0) {
    console.log(`\n⚠️  Found ${workCount} works with archive_type='work'`);
    console.log('These should probably be updated to "generation"');
    
    // Show a few examples
    console.log('\nFirst 3 examples:');
    workType.slice(0, 3).forEach(work => {
      console.log(`  - ${work.title?.substring(0, 50)}... (id: ${work.id})`);
    });
  }
}

debugArchiveTypes().catch(console.error);