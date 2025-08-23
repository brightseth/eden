const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function removeDuplicates() {
  console.log('Removing duplicate Solienne works...\n');
  
  // Get all Solienne works - fetch ALL to ensure we catch all duplicates
  let allWorks = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data: batch, error } = await supabase
      .from('agent_archives')
      .select('*')
      .eq('agent_id', 'solienne')
      .order('created_date', { ascending: true }) // Keep oldest
      .range(offset, offset + limit - 1);
      
    if (error) {
      console.error('Error fetching works:', error);
      return;
    }
    
    if (!batch || batch.length === 0) break;
    allWorks = [...allWorks, ...batch];
    if (batch.length < limit) break;
    offset += limit;
  }

  console.log(`Total Solienne works before: ${allWorks.length}`);
  
  // Track seen image URLs to identify duplicates
  const seenImages = new Set();
  const duplicateIds = [];
  
  allWorks.forEach(work => {
    if (seenImages.has(work.image_url)) {
      duplicateIds.push(work.id);
    } else {
      seenImages.add(work.image_url);
    }
  });
  
  console.log(`Duplicates to remove: ${duplicateIds.length}`);
  
  if (duplicateIds.length > 0) {
    // Remove duplicates in batches
    const batchSize = 100;
    for (let i = 0; i < duplicateIds.length; i += batchSize) {
      const batch = duplicateIds.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase
        .from('agent_archives')
        .delete()
        .in('id', batch);
        
      if (deleteError) {
        console.error('Error deleting batch:', deleteError);
      } else {
        console.log(`Deleted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(duplicateIds.length/batchSize)}`);
      }
    }
  }
  
  // Verify final count
  const { count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne');
    
  console.log(`\n✓ Solienne works after cleanup: ${count}`);
  console.log(`  Removed: ${duplicateIds.length} duplicates`);
}

removeDuplicates().catch(console.error);
