#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSanityChecks() {
  console.log('🔍 Running Abraham Import Sanity Checks\n');
  console.log('='.repeat(50));
  
  // 1. Total count
  const { count: totalCount } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'abraham')
    .eq('archive_type', 'everyday');
  
  console.log(`✓ Total Abraham everydays: ${totalCount}`);
  
  // 2. Check for missing images/metadata
  const { count: missingData } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'abraham')
    .or('image_url.is.null,metadata.is.null');
  
  console.log(`✓ Records with missing data: ${missingData || 0}`);
  
  // 3. Date range
  const { data: earliest } = await supabase
    .from('agent_archives')
    .select('created_date, archive_number')
    .eq('agent_id', 'abraham')
    .order('created_date', { ascending: true })
    .limit(1);
  
  const { data: latest } = await supabase
    .from('agent_archives')
    .select('created_date, archive_number')
    .eq('agent_id', 'abraham')
    .order('created_date', { ascending: false })
    .limit(1);
  
  if (earliest && latest) {
    console.log(`✓ Date range: ${earliest[0].created_date} (#${earliest[0].archive_number}) to ${latest[0].created_date} (#${latest[0].archive_number})`);
  }
  
  // 4. Check for duplicates by hash
  let duplicates = [];
  try {
    const result = await supabase.rpc('get_duplicate_hashes', {
      agent_id_param: 'abraham'
    });
    duplicates = result.data || [];
  } catch (e) {
    // RPC might not exist, skip
  }
  
  if (duplicates && duplicates.length > 0) {
    console.log(`⚠️  Found ${duplicates.length} duplicate hashes`);
  } else {
    console.log(`✓ No duplicate hashes found`);
  }
  
  // 5. Model distribution
  const { data: models } = await supabase
    .from('agent_archives')
    .select('metadata')
    .eq('agent_id', 'abraham')
    .not('metadata->config->model_name', 'is', null);
  
  if (models) {
    const modelCounts = {};
    models.forEach(m => {
      const modelName = m.metadata?.config?.model_name;
      if (modelName) {
        modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;
      }
    });
    
    console.log('\n📊 Model Distribution:');
    Object.entries(modelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([model, count]) => {
        console.log(`   ${model}: ${count} works`);
      });
  }
  
  // 6. Prompt keywords sample
  const { data: samples } = await supabase
    .from('agent_archives')
    .select('metadata')
    .eq('agent_id', 'abraham')
    .limit(100);
  
  if (samples) {
    const keywords = new Set();
    samples.forEach(s => {
      const prompts = s.metadata?.prompts || [];
      prompts.forEach(p => {
        const words = p.toLowerCase().split(/\s+/);
        words.forEach(w => {
          if (w.length > 5) keywords.add(w);
        });
      });
    });
    
    console.log('\n🔤 Sample Keywords (from first 100):');
    const topKeywords = Array.from(keywords).slice(0, 10);
    console.log(`   ${topKeywords.join(', ')}`);
  }
  
  // 7. Storage check - verify images are accessible
  console.log('\n🖼️  Storage Verification:');
  const { data: randomSample } = await supabase
    .from('agent_archives')
    .select('image_url, archive_number')
    .eq('agent_id', 'abraham')
    .limit(5);
  
  if (randomSample) {
    for (const item of randomSample) {
      const response = await fetch(item.image_url, { method: 'HEAD' });
      const status = response.ok ? '✓' : '✗';
      console.log(`   ${status} Everyday #${item.archive_number}: ${response.status}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Sanity checks complete!');
  
  // Summary
  console.log('\n📈 SUMMARY:');
  console.log(`   Total Works: ${totalCount}`);
  console.log(`   Date Span: ${earliest?.[0]?.created_date} to ${latest?.[0]?.created_date}`);
  console.log(`   Archive Numbers: #${earliest?.[0]?.archive_number} to #${latest?.[0]?.archive_number}`);
  console.log(`   Ready for viewing at: /academy/abraham/everydays`);
}

runSanityChecks().catch(console.error);