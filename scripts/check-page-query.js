const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use anon key like the component does
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkPageQuery() {
  console.log('Simulating EnhancedArchiveBrowser query...\n');
  
  // Exact query from EnhancedArchiveBrowser
  const { data, error, count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact' })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')  // Changed from 'work' based on the route
    .order('archive_number', { ascending: false })
    .range(0, 23); // First page
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Total count: ${count}`);
  console.log(`Fetched: ${data.length} items\n`);
  
  // Check for duplicates in the fetched data
  const seen = new Set();
  const duplicates = [];
  
  data.forEach(item => {
    const key = item.image_url;
    if (seen.has(key)) {
      duplicates.push(item);
    }
    seen.add(key);
  });
  
  if (duplicates.length > 0) {
    console.log(`⚠️  Found ${duplicates.length} duplicates in the first page!`);
    duplicates.forEach(dup => {
      console.log(`  - ${dup.title?.substring(0, 50)}... (${dup.id})`);
    });
  } else {
    console.log('✓ No duplicates in the first page');
  }
  
  // Check unique images
  console.log(`\nFirst page images:`);
  data.forEach((item, i) => {
    console.log(`${i + 1}. ${item.title?.substring(0, 40)}...`);
    console.log(`   Archive #${item.archive_number}`);
    console.log(`   Image: ...${item.image_url?.substring(item.image_url.length - 30)}`);
  });
}

checkPageQuery().catch(console.error);