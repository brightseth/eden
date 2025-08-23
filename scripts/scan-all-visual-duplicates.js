const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function getImageInfo(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      const size = parseInt(res.headers['content-length'] || '0');
      const etag = res.headers.etag || '';
      resolve({ size, etag: etag.replace(/"/g, '') });
    });
    req.on('error', () => resolve({ size: 0, etag: '' }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ size: 0, etag: '' });
    });
    req.end();
  });
}

async function scanAllVisualDuplicates() {
  console.log('Scanning ALL Solienne works for visual duplicates...\n');
  
  // Get all works
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
      
    if (error || !batch || batch.length === 0) break;
    allWorks = [...allWorks, ...batch];
    if (batch.length < limit) break;
    offset += limit;
  }
  
  console.log(`Checking ${allWorks.length} works for visual duplicates...`);
  
  const sizeGroups = new Map();
  const etagGroups = new Map();
  let processed = 0;
  
  // Process in batches of 20 to avoid overwhelming the server
  const batchSize = 20;
  
  for (let i = 0; i < allWorks.length; i += batchSize) {
    const batch = allWorks.slice(i, i + batchSize);
    const promises = batch.map(async (work) => {
      try {
        const { size, etag } = await getImageInfo(work.image_url);
        
        if (size > 0) {
          if (!sizeGroups.has(size)) sizeGroups.set(size, []);
          sizeGroups.get(size).push(work);
        }
        
        if (etag) {
          if (!etagGroups.has(etag)) etagGroups.set(etag, []);
          etagGroups.get(etag).push(work);
        }
        
        processed++;
        return { work, size, etag };
      } catch (err) {
        processed++;
        return null;
      }
    });
    
    await Promise.all(promises);
    
    if (processed % 100 === 0 || processed === allWorks.length) {
      console.log(`Processed ${processed}/${allWorks.length} works...`);
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Find duplicates by size
  const sizeDuplicates = [];
  sizeGroups.forEach((works, size) => {
    if (works.length > 1) {
      sizeDuplicates.push({ size, works });
    }
  });
  
  // Find duplicates by etag (more reliable)
  const etagDuplicates = [];
  etagGroups.forEach((works, etag) => {
    if (works.length > 1) {
      etagDuplicates.push({ etag, works });
    }
  });
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Total works scanned: ${processed}`);
  console.log(`Groups with same file size: ${sizeDuplicates.length}`);
  console.log(`Groups with same etag (identical files): ${etagDuplicates.length}`);
  
  if (etagDuplicates.length > 0) {
    console.log('\n=== IDENTICAL FILES (by etag) ===');
    let totalToRemove = 0;
    
    etagDuplicates.forEach((group, i) => {
      console.log(`\nGroup ${i + 1}: ${group.works.length} identical files`);
      console.log(`ETag: ${group.etag}`);
      
      // Sort by archive number to keep the oldest
      group.works.sort((a, b) => parseInt(a.archive_number) - parseInt(b.archive_number));
      const keep = group.works[0];
      const remove = group.works.slice(1);
      
      console.log(`  KEEP: #${keep.archive_number} - "${keep.title?.substring(0, 50)}..."`);
      remove.forEach(work => {
        console.log(`  REMOVE: #${work.archive_number} - "${work.title?.substring(0, 50)}..."`);
      });
      
      totalToRemove += remove.length;
    });
    
    console.log(`\nTotal duplicates to remove: ${totalToRemove}`);
    
    // Create removal script
    const allIdsToRemove = [];
    etagDuplicates.forEach(group => {
      group.works.sort((a, b) => parseInt(a.archive_number) - parseInt(b.archive_number));
      const toRemove = group.works.slice(1);
      allIdsToRemove.push(...toRemove.map(w => w.id));
    });
    
    if (allIdsToRemove.length > 0) {
      console.log(`\nRemoving ${allIdsToRemove.length} visual duplicates...`);
      
      const { error } = await supabase
        .from('agent_archives')
        .delete()
        .in('id', allIdsToRemove);
        
      if (error) {
        console.error('Error removing duplicates:', error);
      } else {
        console.log(`✓ Successfully removed ${allIdsToRemove.length} visual duplicates`);
        
        const { count } = await supabase
          .from('agent_archives')
          .select('*', { count: 'exact', head: true })
          .eq('agent_id', 'solienne')
          .eq('archive_type', 'generation');
          
        console.log(`✓ Final count: ${count} unique Solienne generations`);
      }
    }
  } else {
    console.log('\n✅ No visual duplicates found!');
  }
}

scanAllVisualDuplicates().catch(console.error);