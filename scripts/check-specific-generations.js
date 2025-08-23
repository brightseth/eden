const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSpecificGenerations() {
  console.log('Checking generations 1762 and 1763...\n');
  
  // Get both generations
  const { data: generations, error } = await supabase
    .from('agent_archives')
    .select('*')
    .eq('agent_id', 'solienne')
    .in('archive_number', [1762, 1763]);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Found ${generations.length} generations`);
  
  generations.forEach(gen => {
    console.log(`\n--- Generation ${gen.archive_number} ---`);
    console.log(`ID: ${gen.id}`);
    console.log(`Title: ${gen.title}`);
    console.log(`Image URL: ${gen.image_url}`);
    console.log(`Thumbnail URL: ${gen.thumbnail_url}`);
  });
  
  // Check if they have the same image
  if (generations.length === 2) {
    const gen1 = generations.find(g => g.archive_number === 1762);
    const gen2 = generations.find(g => g.archive_number === 1763);
    
    if (gen1 && gen2) {
      if (gen1.image_url === gen2.image_url) {
        console.log('\n❌ SAME IMAGE URL - These are duplicates!');
        console.log('This means our duplicate removal script missed some cases.');
      } else {
        console.log('\n✓ Different image URLs - These are unique works');
      }
    }
  }
  
  // Check for any other works with same image URLs
  if (generations.length > 0) {
    const imageUrl = generations[0].image_url;
    const { data: sameImage, error: sameError } = await supabase
      .from('agent_archives')
      .select('id, archive_number, title')
      .eq('agent_id', 'solienne')
      .eq('image_url', imageUrl);
      
    if (!sameError && sameImage.length > 1) {
      console.log(`\n⚠️  Found ${sameImage.length} works with the same image:`);
      sameImage.forEach(work => {
        console.log(`  - #${work.archive_number}: ${work.title?.substring(0, 50)}...`);
      });
    }
  }
}

checkSpecificGenerations().catch(console.error);