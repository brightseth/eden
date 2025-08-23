const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function removeVisualDuplicates() {
  console.log('Removing visual duplicates found by file analysis...\n');
  
  // IDs found to be duplicates (keeping the lower generation number)
  const duplicateIds = [
    '9e03a48b-57f5-4ae1-81d1-43e3193d149e', // #1770 (duplicate of #1771, but keeping #1770)
    '443cabb0-4184-4a80-89ea-17e2c0cb196d', // #1746 (duplicate of #1747, but keeping #1746) 
    '433afdd4-1a05-4229-aedc-4bc335bfc100'  // #1699 (duplicate of #1700, but keeping #1699)
  ];
  
  // Actually, let's keep the HIGHER number (more recent) and remove the lower
  // So we should remove #1770, #1746, #1699 and keep #1771, #1747, #1700
  
  console.log('Checking which IDs correspond to which generation numbers...');
  
  const { data: works } = await supabase
    .from('agent_archives')
    .select('id, archive_number, title')
    .in('id', duplicateIds);
    
  works.forEach(work => {
    console.log(`ID ${work.id} = Generation #${work.archive_number}: ${work.title?.substring(0, 50)}...`);
  });
  
  // Let me get the pairs and remove the higher generation numbers (keep older)
  const duplicatePairs = [
    { keep: 1770, remove: 1771 },
    { keep: 1746, remove: 1747 },
    { keep: 1699, remove: 1700 }
  ];
  
  console.log('\nFinding IDs to remove (keeping older generation numbers)...');
  
  const idsToRemove = [];
  
  for (const pair of duplicatePairs) {
    const { data: toRemove } = await supabase
      .from('agent_archives')
      .select('id, archive_number, title')
      .eq('agent_id', 'solienne')
      .eq('archive_number', pair.remove)
      .single();
      
    if (toRemove) {
      idsToRemove.push(toRemove.id);
      console.log(`Will remove: Generation #${toRemove.archive_number} (${toRemove.id})`);
    }
  }
  
  console.log(`\nRemoving ${idsToRemove.length} visual duplicates...`);
  
  if (idsToRemove.length > 0) {
    const { error } = await supabase
      .from('agent_archives')
      .delete()
      .in('id', idsToRemove);
      
    if (error) {
      console.error('Error removing duplicates:', error);
    } else {
      console.log(`✓ Successfully removed ${idsToRemove.length} visual duplicates`);
      
      // Verify final count
      const { count } = await supabase
        .from('agent_archives')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', 'solienne')
        .eq('archive_type', 'generation');
        
      console.log(`✓ Final count: ${count} unique Solienne generations`);
    }
  }
}

removeVisualDuplicates().catch(console.error);