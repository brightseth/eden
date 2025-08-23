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
const BATCH_SIZE = 10;
const SAMPLE_SIZE = 100; // Start with 100 images for testing

async function analyzeImage(imageUrl) {
  try {
    // Use Claude to analyze the image
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image and provide tags in the following categories. Return ONLY a JSON array of applicable tags from this list:
            
            Composition: portrait, landscape, abstract, architectural, figure, nature, geometric, organic
            Style: minimal, complex, detailed, impressionistic, surreal, realistic
            Mood: dynamic, static, peaceful, energetic, mysterious, contemplative
            Color: monochrome, colorful, muted, vibrant, dark, light
            Elements: light, shadow, motion, stillness, texture, pattern
            
            Example response: ["abstract", "geometric", "minimal", "monochrome", "light"]`
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

    // Parse the response
    const content = response.content[0].text;
    try {
      const tags = JSON.parse(content);
      return Array.isArray(tags) ? tags : [];
    } catch (e) {
      console.log('Failed to parse tags:', content);
      return [];
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return [];
  }
}

async function analyzeSolienneWorks() {
  console.log('Starting Solienne image analysis...');
  
  // Get a sample of Solienne's works
  const { data: works, error } = await supabase
    .from('agent_archives')
    .select('id, image_url, title')
    .eq('agent_id', 'solienne')
    .is('tags', null)
    .limit(SAMPLE_SIZE);

  if (error) {
    console.error('Error fetching works:', error);
    return;
  }

  console.log(`Found ${works.length} works to analyze`);

  // Process in batches
  for (let i = 0; i < works.length; i += BATCH_SIZE) {
    const batch = works.slice(i, i + BATCH_SIZE);
    console.log(`\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(works.length/BATCH_SIZE)}`);
    
    const batchPromises = batch.map(async (work) => {
      console.log(`Analyzing: ${work.title?.substring(0, 50)}...`);
      
      const tags = await analyzeImage(work.image_url);
      
      if (tags.length > 0) {
        // Update the database with tags
        const { error: updateError } = await supabase
          .from('agent_archives')
          .update({ tags })
          .eq('id', work.id);
          
        if (updateError) {
          console.error(`Error updating ${work.id}:`, updateError);
        } else {
          console.log(`✓ Tagged with: ${tags.join(', ')}`);
        }
      }
      
      return { id: work.id, tags };
    });
    
    await Promise.all(batchPromises);
    
    // Add delay between batches to avoid rate limits
    if (i + BATCH_SIZE < works.length) {
      console.log('Waiting before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Get tag statistics
  const { data: taggedWorks } = await supabase
    .from('agent_archives')
    .select('tags')
    .eq('agent_id', 'solienne')
    .not('tags', 'is', null);
    
  const tagCounts = {};
  taggedWorks?.forEach(work => {
    work.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  console.log('\n=== TAG STATISTICS ===');
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => {
      console.log(`${tag}: ${count} works`);
    });
    
  console.log('\nAnalysis complete!');
}

// For Abraham, we could use simpler tags since they're older works
async function tagAbrahamWorks() {
  console.log('Tagging Abraham works with basic categories...');
  
  // Since Abraham's works are from 2021 and more experimental,
  // we'll use simpler categorization
  const { data: works } = await supabase
    .from('agent_archives')
    .select('id, title, metadata')
    .eq('agent_id', 'abraham')
    .is('tags', null);
    
  console.log(`Found ${works?.length || 0} Abraham works to tag`);
  
  for (const work of works || []) {
    const tags = [];
    
    // Simple keyword-based tagging from title
    const title = work.title?.toLowerCase() || '';
    
    if (title.includes('dream')) tags.push('dream');
    if (title.includes('abstract')) tags.push('abstract');
    if (title.includes('portrait')) tags.push('portrait');
    if (title.includes('landscape')) tags.push('landscape');
    if (title.includes('color')) tags.push('colorful');
    if (title.includes('light')) tags.push('light');
    if (title.includes('dark')) tags.push('dark');
    if (title.includes('pattern')) tags.push('pattern');
    
    // Default tag if none found
    if (tags.length === 0) {
      tags.push('experimental');
    }
    
    await supabase
      .from('agent_archives')
      .update({ tags })
      .eq('id', work.id);
  }
  
  console.log('Abraham tagging complete');
}

// Run the analysis
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--abraham')) {
    await tagAbrahamWorks();
  } else if (args.includes('--all')) {
    await tagAbrahamWorks();
    await analyzeSolienneWorks();
  } else {
    // Default to Solienne
    await analyzeSolienneWorks();
  }
}

main().catch(console.error);