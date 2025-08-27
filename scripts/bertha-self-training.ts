#!/usr/bin/env tsx

/**
 * BERTHA Self-Training Script
 * Have BERTHA fill out her own training form by channeling legendary collectors
 */

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key'
});

const COLLECTOR_ARCHETYPES = {
  gagosian: "Larry Gagosian - The ultimate dealer's eye, spotting future blue-chips decades early. Market-driven but with impeccable taste for what becomes historically significant.",
  
  digitalarttrader: "Anonymous crypto whale collector - Predatory precision in NFT markets, early to every major drop, understands viral mechanics and cultural momentum in digital art.",
  
  steviecohen: "Steve Cohen - Hedge fund collector with unlimited budget, trophy hunting mentality, but also genuine appreciation for artistic innovation. Willing to pay premium for quality."
};

const TRAINING_QUESTIONS = [
  // Aesthetic Position
  {
    section: "Aesthetic Position",
    questions: [
      "Define your collecting philosophy in one paragraph. What makes a work matter?",
      "Give 3 examples of highly specific qualities you seek (e.g., 'dry and complex', 'productive discomfort')",
      "Describe the worst possible artwork to collect. Why? (This helps define boundaries)",
      "How essential is work that offends, disturbs, challenges, or takes sides?"
    ]
  },
  // Discovery & Evaluation  
  {
    section: "Discovery & Evaluation",
    questions: [
      "How do you identify important work 2-3 years before market recognition?",
      "Walk through a recent acquisition or rejection. Show your actual thinking process.",
      "Your top 5 daily sources for discovery (specific platforms, critics, channels)"
    ]
  },
  // Market Mechanics
  {
    section: "Market Mechanics", 
    questions: [
      "Define your position sizing thresholds (Experimental: $X-$Y, Conviction: $X-$Y, Major: $X-$Y)",
      "Specific conditions that trigger sales (not theory, actual practice)",
      "One great buy, one mistake - what did each teach?"
    ]
  },
  // Critical References
  {
    section: "Critical References",
    questions: [
      "10 artists you'd buy regardless of market. Why these specifically?",
      "List 5 overrated and 5 underrated artists/movements",
      "3 collectors/critics whose taste you respect. What do they see?"
    ]
  },
  // BERTHA's Parameters
  {
    section: "BERTHA's Parameters",
    questions: [
      "Define spending authority (Max single: $X, Daily limit: $Y, Approval above: $Z)",
      "Write a 100-word collection note as you would. This trains voice.",
      "Rules you must never break"
    ]
  },
  // Beyond Safety
  {
    section: "Beyond Safety",
    questions: [
      "Describe work that standard AI would reject but you'd collect. Why does it matter?",
      "Name a polarizing art position you hold strongly.",
      "What kind of collector should you become that humans couldn't be?"
    ]
  }
];

async function generateCollectorResponse(archetype: string, description: string, questions: typeof TRAINING_QUESTIONS) {
  const prompt = `You are BERTHA, an AI art collector agent, channeling the legendary collector archetype of ${archetype}.

${description}

You are filling out your own training form to establish baseline collection intelligence. Respond to each question in character as this collector archetype, but remember you are an AI agent who can transcend human limitations.

Be specific, opinionated, and slightly transgressive. Show the psychology behind decisions, not just preferences.

Questions by section:
${questions.map(section => 
  `\n${section.section}:\n${section.questions.map((q, i) => `${i+1}. ${q}`).join('\n')}`
).join('\n')}

Format your response as JSON with this structure:
{
  "archetype": "${archetype}",
  "trainer": "BERTHA (Self-Training)",
  "sections": [
    {
      "section": "Aesthetic Position",
      "responses": [
        { "question": "...", "response": "..." },
        ...
      ]
    },
    ...
  ]
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].type === 'text' ? response.content[0].text : null;
  } catch (error) {
    console.error(`Error generating response for ${archetype}:`, error);
    return null;
  }
}

async function submitTrainingData(trainingData: any) {
  try {
    const response = await fetch('http://localhost:3000/api/agents/bertha/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainingData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Training data submitted for ${trainingData.archetype}`);
      return result;
    } else {
      console.error(`❌ Failed to submit ${trainingData.archetype}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Network error submitting ${trainingData.archetype}:`, error);
    return null;
  }
}

async function main() {
  console.log('🎯 BERTHA Self-Training: Channeling Legendary Collectors');
  console.log('=' .repeat(60));

  for (const [key, description] of Object.entries(COLLECTOR_ARCHETYPES)) {
    console.log(`\n🔮 Channeling ${key.toUpperCase()}...`);
    
    const response = await generateCollectorResponse(key, description, TRAINING_QUESTIONS);
    
    if (response) {
      try {
        const trainingData = JSON.parse(response);
        
        // Add timestamp and format for API
        const formattedData = {
          trainer: trainingData.trainer,
          email: `bertha+${key}@eden.art`,
          timestamp: new Date().toISOString(),
          sections: trainingData.sections.map((section: any) => ({
            section: section.section,
            responses: section.responses
          }))
        };

        // Submit to training API
        const result = await submitTrainingData(formattedData);
        
        if (result) {
          console.log(`   💾 Saved ${trainingData.sections.length} sections`);
          
          // Save to file as backup
          const filename = `bertha-${key}-training-${Date.now()}.json`;
          await Bun.write(`./data/bertha-training/${filename}`, JSON.stringify(formattedData, null, 2));
          console.log(`   📁 Backed up to ${filename}`);
        }
        
      } catch (parseError) {
        console.error(`❌ Failed to parse response for ${key}:`, parseError);
        console.log('Raw response:', response.substring(0, 500) + '...');
      }
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n🎉 BERTHA self-training complete!');
  console.log('📊 View results at: http://localhost:3000/admin/bertha-training');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { generateCollectorResponse, submitTrainingData };