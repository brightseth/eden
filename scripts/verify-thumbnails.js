const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function verifyThumbnails() {
  console.log('Checking thumbnails for Abraham and Solienne works...\n');
  
  // Check Abraham's works
  const { data: abrahamWorks, error: abrahamError } = await supabase
    .from('agent_archives')
    .select('id, image_url, thumbnail_url, title')
    .eq('agent_id', 'abraham')
    .limit(10);
    
  if (!abrahamError) {
    console.log('Abraham Works Sample (first 10):');
    console.log('================================');
    abrahamWorks.forEach(work => {
      const hasThumbnail = !!work.thumbnail_url;
      const status = hasThumbnail ? '✓' : '✗';
      console.log(`${status} ${work.title?.substring(0, 50)}...`);
      if (!hasThumbnail) {
        console.log(`  Image: ${work.image_url?.substring(0, 80)}...`);
      }
    });
    
    // Get counts
    const { count: totalAbraham } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'abraham');
      
    const { count: abrahamWithThumbs } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'abraham')
      .not('thumbnail_url', 'is', null);
      
    console.log(`\nAbraham: ${abrahamWithThumbs}/${totalAbraham} have thumbnails`);
  }
  
  // Check Solienne's works
  const { data: solienneWorks, error: solienneError } = await supabase
    .from('agent_archives')
    .select('id, image_url, thumbnail_url, title')
    .eq('agent_id', 'solienne')
    .limit(10);
    
  if (!solienneError) {
    console.log('\nSolienne Works Sample (first 10):');
    console.log('===================================');
    solienneWorks.forEach(work => {
      const hasThumbnail = !!work.thumbnail_url;
      const status = hasThumbnail ? '✓' : '✗';
      console.log(`${status} ${work.title?.substring(0, 50)}...`);
      if (!hasThumbnail) {
        console.log(`  Image: ${work.image_url?.substring(0, 80)}...`);
      }
    });
    
    // Get counts
    const { count: totalSolienne } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'solienne');
      
    const { count: solienneWithThumbs } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'solienne')
      .not('thumbnail_url', 'is', null);
      
    console.log(`\nSolienne: ${solienneWithThumbs}/${totalSolienne} have thumbnails`);
  }
  
  // Check for broken images by testing a sample
  console.log('\n\nChecking for broken image links...');
  console.log('====================================');
  
  const { data: sampleWorks } = await supabase
    .from('agent_archives')
    .select('id, agent_id, image_url, title')
    .in('agent_id', ['abraham', 'solienne'])
    .limit(20);
    
  for (const work of sampleWorks || []) {
    try {
      const response = await fetch(work.image_url, { method: 'HEAD' });
      if (!response.ok) {
        console.log(`✗ BROKEN: ${work.agent_id} - ${work.title?.substring(0, 40)}...`);
        console.log(`  URL: ${work.image_url}`);
      } else {
        console.log(`✓ OK: ${work.agent_id} - ${work.title?.substring(0, 40)}...`);
      }
    } catch (error) {
      console.log(`✗ ERROR: ${work.agent_id} - ${work.title?.substring(0, 40)}...`);
      console.log(`  Error: ${error.message}`);
    }
  }
}

verifyThumbnails().catch(console.error);
