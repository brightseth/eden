const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Add basic manual tags to a sample of Solienne's works for curation demo
const sampleTags = [
  ['portrait', 'monochrome', 'mysterious', 'consciousness', 'exhibition-ready'],
  ['abstract', 'motion', 'light', 'transformation', 'striking'],
  ['architectural', 'geometric', 'minimal', 'space', 'contemplative'],
  ['figure', 'dynamic', 'shadow', 'liminal', 'powerful'],
  ['landscape', 'surreal', 'dissolution', 'form', 'experimental'],
  ['portrait', 'detailed', 'dramatic', 'consciousness', 'striking'],
  ['abstract', 'colorful', 'energetic', 'light', 'exhibition-ready'],
  ['architectural', 'monochrome', 'static', 'space', 'minimal'],
  ['figure', 'experimental', 'motion', 'transformation', 'powerful'],
  ['geometric', 'minimal', 'contemplative', 'form', 'subtle']
];

async function addManualTags() {
  console.log('Adding manual tags to sample Solienne works for curation...');
  
  // Get recent works without tags
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, title, created_date')
    .eq('agent_id', 'solienne')
    .or('metadata.is.null,metadata->tags.is.null')
    .order('created_date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching works:', error);
    return;
  }

  console.log(`Found ${works.length} works to tag manually`);

  for (let i = 0; i < Math.min(works.length, 30); i++) {
    const work = works[i];
    const tags = sampleTags[i % sampleTags.length];
    
    const metadata = {
      tags,
      manually_tagged: true,
      analysis_date: new Date().toISOString(),
      curation_ready: true
    };
    
    const { error: updateError } = await supabase
      .from('agent_archives')
      .update({ metadata })
      .eq('id', work.id);
      
    if (updateError) {
      console.error(`Error updating ${work.id}:`, updateError);
    } else {
      console.log(`✓ Tagged "${work.title?.substring(0, 40)}..." with: ${tags.join(', ')}`);
    }
  }
  
  console.log('\nManual tagging complete! Curation interface ready.');
}

addManualTags().catch(console.error);
