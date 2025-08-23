const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        const hash = crypto.createHash('md5').update(buffer).digest('hex');
        resolve({ buffer, hash, size: buffer.length });
      });
    }).on('error', reject);
  });
}

async function findVisualDuplicates() {
  console.log('Finding visual duplicates in Solienne works...\n');
  
  // Get all works in batches
  let allWorks = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data: batch, error } = await supabase
      .from('agent_archives')
      .select('id, archive_number, title, image_url, created_date')
      .eq('agent_id', 'solienne')
      .eq('archive_type', 'generation')
      .order('created_date', { ascending: true })
      .range(offset, offset + limit - 1);
      
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    if (!batch || batch.length === 0) break;
    allWorks = [...allWorks, ...batch];
    if (batch.length < limit) break;
    offset += limit;
  }
  
  console.log(`Checking ${allWorks.length} works for visual duplicates...`);
  
  const hashMap = new Map();
  const duplicates = [];
  let processed = 0;
  
  // Process in smaller batches to avoid overwhelming the server
  const batchSize = 50;
  
  for (let i = 0; i < allWorks.length; i += batchSize) {
    const batch = allWorks.slice(i, i + batchSize);
    
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allWorks.length/batchSize)}...`);
    
    const promises = batch.map(async (work) => {
      try {
        const { hash, size } = await downloadImage(work.image_url);
        
        if (hashMap.has(hash)) {
          // Found duplicate
          const original = hashMap.get(hash);
          duplicates.push({
            original,
            duplicate: work,
            hash,
            size
          });
        } else {
          hashMap.set(hash, work);
        }
        
        processed++;
        if (processed % 100 === 0) {
          console.log(`  Processed ${processed}/${allWorks.length}...`);
        }
      } catch (err) {
        console.error(`Error processing ${work.archive_number}:`, err.message);
      }
    });
    
    await Promise.all(promises);
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Total works: ${allWorks.length}`);
  console.log(`Unique images: ${hashMap.size}`);
  console.log(`Visual duplicates found: ${duplicates.length}`);
  
  if (duplicates.length > 0) {
    console.log('\nFirst 10 duplicate pairs:');
    duplicates.slice(0, 10).forEach((dup, i) => {
      console.log(`${i + 1}. Original: #${dup.original.archive_number} vs Duplicate: #${dup.duplicate.archive_number}`);
      console.log(`   "${dup.original.title?.substring(0, 50)}..."`);
      console.log(`   "${dup.duplicate.title?.substring(0, 50)}..."`);
    });
    
    // Save duplicates list for removal
    const duplicateIds = duplicates.map(d => d.duplicate.id);
    console.log(`\nDuplicate IDs to remove: ${duplicateIds.length}`);
    
    // Save to file for manual review
    require('fs').writeFileSync('visual-duplicates.json', JSON.stringify(duplicates, null, 2));
    console.log('Saved detailed list to visual-duplicates.json');
  }
}

findVisualDuplicates().catch(console.error);