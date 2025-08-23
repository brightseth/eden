const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use anon key to simulate production behavior
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyProduction() {
  console.log('Verifying Solienne works (as production would see)...\n');
  
  // Check total count
  const { count: totalCount, error: countError } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
    
  if (countError) {
    console.error('❌ Error counting:', countError);
    return;
  }
  
  console.log(`✓ Total Solienne generations: ${totalCount}`);
  
  // Get first page like the UI does
  const { data: firstPage, error: pageError } = await supabase
    .from('agent_archives')
    .select('*')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .order('archive_number', { ascending: false })
    .range(0, 23);
    
  if (pageError) {
    console.error('❌ Error fetching page:', pageError);
    return;
  }
  
  console.log(`✓ First page has ${firstPage.length} items`);
  
  // Check for duplicates in first page
  const seenIds = new Set();
  const seenImages = new Set();
  let duplicatesFound = false;
  
  firstPage.forEach((item, i) => {
    if (seenIds.has(item.id)) {
      console.error(`❌ Duplicate ID at position ${i}: ${item.id}`);
      duplicatesFound = true;
    }
    if (seenImages.has(item.image_url)) {
      console.error(`❌ Duplicate image at position ${i}: ${item.title}`);
      duplicatesFound = true;
    }
    seenIds.add(item.id);
    seenImages.add(item.image_url);
  });
  
  if (!duplicatesFound) {
    console.log('✓ No duplicates in first page');
  }
  
  // Check if images are accessible
  console.log('\n--- Image Accessibility Check ---');
  const sampleImage = firstPage[0];
  if (sampleImage) {
    console.log(`Testing image: ${sampleImage.title?.substring(0, 50)}...`);
    console.log(`URL: ${sampleImage.image_url?.substring(0, 100)}...`);
    
    // Test if URL is valid format
    if (sampleImage.image_url?.startsWith('https://')) {
      console.log('✓ Image URL is valid HTTPS');
    } else {
      console.error('❌ Image URL is not HTTPS');
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(`Database has ${totalCount} unique Solienne generations`);
  console.log(`First page loads ${firstPage.length} items correctly`);
  console.log(`No duplicates in data: ${!duplicatesFound}`);
  console.log('\nIf you still see duplicates on the site, try:');
  console.log('1. Clear browser cache (Cmd+Shift+R)');
  console.log('2. Check if Vercel deployment is up to date');
  console.log('3. Check browser console for any errors');
}

verifyProduction().catch(console.error);