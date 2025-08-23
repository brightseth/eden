const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function getImageSize(url) {
  return new Promise((resolve, reject) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      const size = parseInt(res.headers['content-length'] || '0');
      const etag = res.headers.etag || '';
      resolve({ size, etag });
    }).on('error', reject).end();
  });
}

async function findDuplicatesBySize() {
  console.log('Finding potential visual duplicates by file size...\n');
  
  // Get sample of recent works to check
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, archive_number, title, image_url, created_date')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .order('archive_number', { ascending: false })
    .limit(100); // Check first 100 to start
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Checking file sizes for ${works.length} recent works...`);
  
  const sizeMap = new Map();
  const etagMap = new Map();
  const potentialDuplicates = [];
  
  let processed = 0;
  
  for (const work of works) {
    try {
      const { size, etag } = await getImageSize(work.image_url);
      
      // Check by file size
      if (sizeMap.has(size)) {
        const existing = sizeMap.get(size);
        potentialDuplicates.push({
          type: 'size',
          original: existing,
          duplicate: work,
          size
        });
      } else {
        sizeMap.set(size, work);
      }
      
      // Check by etag (more reliable)
      if (etag && etagMap.has(etag)) {
        const existing = etagMap.get(etag);
        potentialDuplicates.push({
          type: 'etag',
          original: existing,
          duplicate: work,
          etag
        });
      } else if (etag) {
        etagMap.set(etag, work);
      }
      
      processed++;
      if (processed % 10 === 0) {
        console.log(`  Processed ${processed}/${works.length}...`);
      }
      
      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.error(`Error checking #${work.archive_number}:`, err.message);
    }
  }
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Potential duplicates by file size: ${potentialDuplicates.filter(d => d.type === 'size').length}`);
  console.log(`Potential duplicates by etag: ${potentialDuplicates.filter(d => d.type === 'etag').length}`);
  
  if (potentialDuplicates.length > 0) {
    console.log('\nPotential duplicate pairs:');
    potentialDuplicates.forEach((dup, i) => {
      console.log(`${i + 1}. [${dup.type.toUpperCase()}] Original: #${dup.original.archive_number} vs Duplicate: #${dup.duplicate.archive_number}`);
      if (dup.size) console.log(`   Size: ${dup.size} bytes`);
      if (dup.etag) console.log(`   ETag: ${dup.etag}`);
      console.log(`   Original: "${dup.original.title?.substring(0, 60)}..."`);
      console.log(`   Duplicate: "${dup.duplicate.title?.substring(0, 60)}..."`);
      console.log('');
    });
    
    // Get the duplicate IDs for removal
    const duplicateIds = potentialDuplicates.map(d => d.duplicate.id);
    console.log(`IDs to potentially remove: ${duplicateIds.join(', ')}`);
  }
}

findDuplicatesBySize().catch(console.error);