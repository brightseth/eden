const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkDuplicates() {
  console.log('Checking for duplicate Solienne works...\n');
  
  // Get all Solienne works
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, title, image_url, archive_number')
    .eq('agent_id', 'solienne')
    .order('created_date', { ascending: false });

  if (error) {
    console.error('Error fetching works:', error);
    return;
  }

  console.log(`Total Solienne works: ${works.length}`);
  
  // Check for duplicates by title
  const titleMap = {};
  const duplicateTitles = [];
  
  works.forEach(work => {
    if (titleMap[work.title]) {
      titleMap[work.title].push(work.id);
    } else {
      titleMap[work.title] = [work.id];
    }
  });
  
  Object.entries(titleMap).forEach(([title, ids]) => {
    if (ids.length > 1) {
      duplicateTitles.push({ title, count: ids.length, ids });
    }
  });
  
  console.log(`\nDuplicate titles found: ${duplicateTitles.length}`);
  
  if (duplicateTitles.length > 0) {
    console.log('\nTop duplicate titles:');
    duplicateTitles.slice(0, 10).forEach(dup => {
      console.log(`  "${dup.title?.substring(0, 50)}..." - ${dup.count} copies`);
      console.log(`    IDs: ${dup.ids.slice(0, 5).join(', ')}${dup.ids.length > 5 ? '...' : ''}`);
    });
  }
  
  // Check for duplicates by image URL
  const imageMap = {};
  const duplicateImages = [];
  
  works.forEach(work => {
    if (imageMap[work.image_url]) {
      imageMap[work.image_url].push(work.id);
    } else {
      imageMap[work.image_url] = [work.id];
    }
  });
  
  Object.entries(imageMap).forEach(([url, ids]) => {
    if (ids.length > 1) {
      duplicateImages.push({ url, count: ids.length, ids });
    }
  });
  
  console.log(`\nDuplicate image URLs found: ${duplicateImages.length}`);
  
  if (duplicateImages.length > 0) {
    console.log('\nTop duplicate images:');
    duplicateImages.slice(0, 10).forEach(dup => {
      console.log(`  ${dup.url?.substring(50, 100)}... - ${dup.count} copies`);
      console.log(`    IDs: ${dup.ids.slice(0, 5).join(', ')}${dup.ids.length > 5 ? '...' : ''}`);
    });
  }
  
  // Get unique count
  const uniqueTitles = Object.keys(titleMap).length;
  const uniqueImages = Object.keys(imageMap).length;
  
  console.log('\n=== SUMMARY ===');
  console.log(`Total works: ${works.length}`);
  console.log(`Unique titles: ${uniqueTitles}`);
  console.log(`Unique images: ${uniqueImages}`);
  console.log(`Duplicate titles to remove: ${works.length - uniqueTitles}`);
  console.log(`Duplicate images to remove: ${works.length - uniqueImages}`);
}

checkDuplicates().catch(console.error);
