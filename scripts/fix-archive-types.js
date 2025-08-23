const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixArchiveTypes() {
  console.log('Checking archive types for Solienne works...\n');
  
  // Get works with different archive_types
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, archive_type, title')
    .eq('agent_id', 'solienne');
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  // Count by type
  const typeCounts = {};
  const nullTypeIds = [];
  const workTypeIds = [];
  
  works.forEach(work => {
    const type = work.archive_type || 'null';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    
    if (!work.archive_type) {
      nullTypeIds.push(work.id);
    } else if (work.archive_type === 'work') {
      workTypeIds.push(work.id);
    }
  });
  
  console.log('Current distribution:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  // Fix null types
  if (nullTypeIds.length > 0) {
    console.log(`\nFixing ${nullTypeIds.length} works with null archive_type...`);
    
    const { error: updateError } = await supabase
      .from('agent_archives')
      .update({ archive_type: 'generation' })
      .in('id', nullTypeIds);
      
    if (updateError) {
      console.error('Error updating null types:', updateError);
    } else {
      console.log(`✓ Updated ${nullTypeIds.length} works from null to 'generation'`);
    }
  }
  
  // Fix 'work' types (should be 'generation' for Solienne)
  if (workTypeIds.length > 0) {
    console.log(`\nFixing ${workTypeIds.length} works with 'work' archive_type...`);
    
    const { error: updateError } = await supabase
      .from('agent_archives')
      .update({ archive_type: 'generation' })
      .in('id', workTypeIds);
      
    if (updateError) {
      console.error('Error updating work types:', updateError);
    } else {
      console.log(`✓ Updated ${workTypeIds.length} works from 'work' to 'generation'`);
    }
  }
  
  // Verify final count
  const { count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
    
  console.log(`\n✅ Total Solienne generations after fix: ${count}`);
}

fixArchiveTypes().catch(console.error);