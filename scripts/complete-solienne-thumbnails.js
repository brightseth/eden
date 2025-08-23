const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function completeSolienneThumbnails() {
  console.log('Completing Solienne thumbnails...');
  
  // Get all Solienne works without thumbnails
  const { data: works, error: fetchError } = await supabase
    .from('agent_archives')
    .select('id, image_url')
    .eq('agent_id', 'solienne')
    .is('thumbnail_url', null)
    .limit(1000);
    
  if (fetchError) {
    console.error('Error fetching works:', fetchError);
    return;
  }
  
  console.log(`Found ${works.length} works without thumbnails`);
  
  if (works.length === 0) {
    console.log('All Solienne works already have thumbnails!');
    return;
  }
  
  // Update in batches - for now using same URL as thumbnail
  const batchSize = 100;
  for (let i = 0; i < works.length; i += batchSize) {
    const batch = works.slice(i, i + batchSize);
    
    const updates = batch.map(work => 
      supabase
        .from('agent_archives')
        .update({ thumbnail_url: work.image_url })
        .eq('id', work.id)
    );
    
    await Promise.all(updates);
    console.log(`Updated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(works.length/batchSize)}`);
  }
  
  // Verify the update
  const { count: totalCount } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne');
    
  const { count: withThumbs } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .not('thumbnail_url', 'is', null);
    
  console.log(`✓ Solienne now has ${withThumbs}/${totalCount} thumbnails`);
}

// Run multiple times if needed due to query limits
async function runUntilComplete() {
  for (let i = 0; i < 5; i++) {
    await completeSolienneThumbnails();
    
    // Check if we're done
    const { count: remaining } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'solienne')
      .is('thumbnail_url', null);
      
    if (remaining === 0) {
      console.log('\n✓ All Solienne thumbnails complete!');
      break;
    }
  }
}

runUntilComplete().catch(console.error);
