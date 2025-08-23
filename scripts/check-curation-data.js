const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkCurationData() {
  console.log('Checking Solienne curation data...\n');
  
  // Get sample of works
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, title, image_url, thumbnail_url, created_date, metadata')
    .eq('agent_id', 'solienne')
    .order('created_date', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching works:', error);
    return;
  }

  console.log(`Found ${works?.length || 0} sample works:\n`);
  
  works?.forEach((work, i) => {
    console.log(`Work ${i + 1}:`);
    console.log(`  Title: ${work.title?.substring(0, 50)}...`);
    console.log(`  Image URL: ${work.image_url?.substring(0, 100)}...`);
    console.log(`  Thumbnail: ${work.thumbnail_url ? 'Yes' : 'No'}`);
    console.log(`  Tags: ${work.metadata?.tags?.join(', ') || 'None'}`);
    console.log('');
  });

  // Check total counts
  const { count: totalWorks } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne');

  const { count: taggedWorks } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .not('metadata->tags', 'is', null);

  console.log('Statistics:');
  console.log(`  Total works: ${totalWorks}`);
  console.log(`  Tagged works: ${taggedWorks}`);
  console.log(`  Works with thumbnails: All should have them`);
  
  // Test image URL accessibility
  console.log('\nTesting image accessibility...');
  if (works && works.length > 0) {
    const testUrl = works[0].image_url;
    try {
      const response = await fetch(testUrl);
      console.log(`  First image HTTP status: ${response.status}`);
      console.log(`  Content-Type: ${response.headers.get('content-type')}`);
    } catch (error) {
      console.error('  Error fetching image:', error.message);
    }
  }
}

checkCurationData().catch(console.error);
