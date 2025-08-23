const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkImageUrls() {
  console.log('Checking Solienne image URLs...\n');
  
  // Get a sample of Solienne works
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, title, image_url, thumbnail_url, metadata')
    .eq('agent_id', 'solienne')
    .limit(10);

  if (error) {
    console.error('Error fetching works:', error);
    return;
  }

  console.log(`Checking ${works.length} sample works:\n`);
  
  works.forEach((work, i) => {
    console.log(`\n--- Work ${i + 1}: ${work.title?.substring(0, 50)}... ---`);
    console.log(`ID: ${work.id}`);
    
    // Check image_url
    console.log('\nimage_url:');
    if (!work.image_url) {
      console.log('  ❌ Missing');
    } else if (typeof work.image_url === 'string') {
      if (work.image_url.startsWith('http')) {
        console.log(`  ✓ Valid URL: ${work.image_url.substring(0, 100)}...`);
      } else if (work.image_url.startsWith('{') || work.image_url.startsWith('[')) {
        console.log(`  ❌ JSON data instead of URL: ${work.image_url.substring(0, 100)}...`);
      } else {
        console.log(`  ⚠️ Unusual format: ${work.image_url.substring(0, 100)}...`);
      }
    } else {
      console.log(`  ❌ Not a string, type: ${typeof work.image_url}`);
      console.log(`  Data: ${JSON.stringify(work.image_url).substring(0, 200)}...`);
    }
    
    // Check thumbnail_url
    console.log('\nthumbnail_url:');
    if (!work.thumbnail_url) {
      console.log('  ⚠️ Missing (will fallback to image_url)');
    } else if (typeof work.thumbnail_url === 'string') {
      if (work.thumbnail_url.startsWith('http')) {
        console.log(`  ✓ Valid URL: ${work.thumbnail_url.substring(0, 100)}...`);
      } else if (work.thumbnail_url.startsWith('{') || work.thumbnail_url.startsWith('[')) {
        console.log(`  ❌ JSON data instead of URL: ${work.thumbnail_url.substring(0, 100)}...`);
      } else {
        console.log(`  ⚠️ Unusual format: ${work.thumbnail_url.substring(0, 100)}...`);
      }
    } else {
      console.log(`  ❌ Not a string, type: ${typeof work.thumbnail_url}`);
      console.log(`  Data: ${JSON.stringify(work.thumbnail_url).substring(0, 200)}...`);
    }
    
    // Check if metadata contains image URLs
    if (work.metadata) {
      console.log('\nmetadata fields:');
      if (work.metadata.image_url) {
        console.log(`  Has metadata.image_url: ${work.metadata.image_url.substring(0, 100)}...`);
      }
      if (work.metadata.thumbnail_url) {
        console.log(`  Has metadata.thumbnail_url: ${work.metadata.thumbnail_url.substring(0, 100)}...`);
      }
      if (work.metadata.prompt) {
        console.log(`  Has prompt: ${work.metadata.prompt.substring(0, 50)}...`);
      }
    }
  });
  
  // Check for works with problematic URLs
  console.log('\n\n=== CHECKING FOR PROBLEMATIC URLs ===\n');
  
  const { data: problematic, error: probError } = await supabase
    .from('agent_archives')
    .select('id, title, image_url')
    .eq('agent_id', 'solienne')
    .or('image_url.not.like.http%,image_url.is.null');
    
  if (problematic && problematic.length > 0) {
    console.log(`Found ${problematic.length} works with problematic image URLs:`);
    problematic.slice(0, 10).forEach(work => {
      console.log(`  - ${work.title?.substring(0, 50)}... : ${work.image_url?.substring(0, 50) || 'NULL'}`);
    });
  } else {
    console.log('All works have URLs starting with http');
  }
}

checkImageUrls().catch(console.error);