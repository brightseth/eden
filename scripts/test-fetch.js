const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Use anon key like the client does
);

async function testFetch() {
  console.log('Testing fetch as client would...\n');
  
  // Fetch exactly like EnhancedArchiveBrowser does
  const { data, error } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact' })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'work')
    .order('archive_number', { ascending: false })
    .range(0, 23); // First page
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Fetched ${data.length} works\n`);
  
  // Check first 3 works
  data.slice(0, 3).forEach((item, i) => {
    console.log(`\nWork ${i + 1}:`);
    console.log(`  Title: ${item.title?.substring(0, 50)}...`);
    console.log(`  Archive #: ${item.archive_number}`);
    console.log(`  image_url type: ${typeof item.image_url}`);
    console.log(`  image_url: ${item.image_url?.substring(0, 150)}...`);
    console.log(`  thumbnail_url type: ${typeof item.thumbnail_url}`);
    console.log(`  thumbnail_url: ${item.thumbnail_url?.substring(0, 150)}...`);
    
    // Check what would be rendered
    const srcToUse = item.thumbnail_url || item.image_url;
    console.log(`  \n  Would render: ${srcToUse?.substring(0, 150)}...`);
  });
}

testFetch().catch(console.error);