const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Batch size for processing
const BATCH_SIZE = 3; // Smaller to be safe
const MAX_WORKS = 200; // Start with 200 for Nina's curation

async function analyzeImage(imageUrl) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image and provide tags for curation. Return ONLY a JSON array with 3-5 most relevant tags from this list:

COMPOSITION: portrait, landscape, abstract, architectural, figure, nature, geometric, organic, minimal, complex
STYLE: monochrome, colorful, detailed, impressionistic, surreal, realistic, experimental, documentary
MOOD: dynamic, static, peaceful, energetic, mysterious, contemplative, dramatic, serene
SUBJECT: consciousness, motion, light, shadow, space, form, dissolution, transformation, liminal
QUALITY: exhibition-ready, experimental, striking, subtle, powerful

Choose the most accurate tags. Example: ["portrait", "monochrome", "mysterious", "consciousness", "exhibition-ready"]`
          },
          {
            type: "image",
            source: {
              type: "url",
              url: imageUrl
            }
          }
        ]
      }]
    });

    const content = response.content[0].text;
    try {
      const tags = JSON.parse(content);
      return Array.isArray(tags) ? tags : [];
    } catch (e) {
      console.log('Failed to parse tags:', content);
      return [];
    }
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    return [];
  }
}

async function analyzeSolienneForCuration() {
  console.log('Starting Solienne image analysis for Nina curation...');
  
  // Get unanalyzed works, prioritizing recent ones
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, image_url, title, created_date, metadata')
    .eq('agent_id', 'solienne')
    .or('metadata.is.null,metadata->tags.is.null')
    .order('created_date', { ascending: false })
    .limit(MAX_WORKS);

  if (error) {
    console.error('Error fetching works:', error);
    return;
  }

  console.log(`Found ${works.length} works to analyze for curation`);

  let analyzed = 0;
  
  // Process in batches
  for (let i = 0; i < works.length; i += BATCH_SIZE) {
    const batch = works.slice(i, i + BATCH_SIZE);
    console.log(`\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(works.length/BATCH_SIZE)}`);
    
    for (const work of batch) {
      console.log(`Analyzing: ${work.title?.substring(0, 50)}...`);
      
      const tags = await analyzeImage(work.image_url);
      
      if (tags.length > 0) {
        const updatedMetadata = {
          ...(work.metadata || {}),
          tags: tags,
          analyzed_for_curation: true,
          analysis_date: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('agent_archives')
          .update({ metadata: updatedMetadata })
          .eq('id', work.id);
          
        if (updateError) {
          console.error(`Error updating ${work.id}:`, updateError);
        } else {
          analyzed++;
          console.log(`✓ Tagged with: ${tags.join(', ')}`);
        }
      }
      
      // Small delay between individual images
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Longer delay between batches
    if (i + BATCH_SIZE < works.length) {
      console.log('Waiting before next batch...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Generate curation statistics
  const { data: analyzedWorks } = await supabase
    .from('agent_archives')
    .select('metadata')
    .eq('agent_id', 'solienne')
    .not('metadata->tags', 'is', null);
    
  const tagCounts = {};
  const qualityTags = {};
  
  analyzedWorks?.forEach(work => {
    work.metadata?.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      
      // Track quality tags separately
      if (['exhibition-ready', 'striking', 'powerful', 'experimental'].includes(tag)) {
        qualityTags[tag] = (qualityTags[tag] || 0) + 1;
      }
    });
  });
  
  console.log('\n=== CURATION ANALYSIS ===');
  console.log(`Analyzed ${analyzed} new works`);
  console.log(`Total analyzed: ${analyzedWorks?.length || 0} works`);
  
  console.log('\n=== TOP TAGS ===');
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([tag, count]) => {
      console.log(`${tag}: ${count} works`);
    });
    
  console.log('\n=== QUALITY INDICATORS ===');
  Object.entries(qualityTags)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => {
      console.log(`${tag}: ${count} works`);
    });
    
  console.log('\nAnalysis complete! Ready for Nina curation.');
}

analyzeSolienneForCuration().catch(console.error);
