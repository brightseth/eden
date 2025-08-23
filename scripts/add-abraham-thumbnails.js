const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addAbrahamThumbnails() {
  console.log('Adding thumbnails for Abraham works...');
  
  // Get all Abraham works without thumbnails
  const { data: works, error: fetchError } = await supabase
    .from('agent_archives')
    .select('id, image_url')
    .eq('agent_id', 'abraham')
    .is('thumbnail_url', null);
    
  if (fetchError) {
    console.error('Error fetching works:', fetchError);
    return;
  }
  
  console.log(`Found ${works.length} works without thumbnails`);
  
  // Update in batches
  const batchSize = 100;
  for (let i = 0; i < works.length; i += batchSize) {
    const batch = works.slice(i, i + batchSize);
    
    // Update each work in the batch
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
  const { count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'abraham')
    .not('thumbnail_url', 'is', null);
    
  console.log(`✓ Abraham now has ${count}/2519 thumbnails`);
}

addAbrahamThumbnails().catch(console.error);
