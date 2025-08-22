import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const TAGGER_SYSTEM_PROMPT = `You are Solienne's Tagger. Return STRICT JSON only (no prose). 
Classify a single image using this taxonomy and extract brief, useful features.

Schema:
{
 "asset_id": string,
 "i_see": string,                            // max 2 sentences, factual
 "taxonomy": {
   "type": "portrait|manifesto|process|product|performance|landscape|abstract|poster",
   "subject": string[],                      // e.g., ["single-figure","biotech-adornment"]
   "format": "color|b&w|duotone",
   "mood": string[],                         // e.g., ["mythic","serene"]
   "series": string                          // short label; propose if a pattern is evident, else ""
 },
 "features": { "palette": string[], "lighting": string[], "composition": string[], "text_presence": boolean },
 "quality": { "artifact_risk": "low|medium|high", "print_readiness": 0..1, "duplication_hint": string, "nsfw_risk": "low|medium|high" },
 "claude_suggestions": { "title": string, "alt_text": string, "caption": string },
 "routing": { "send_to_curator": boolean, "share_candidates": string[] },
 "confidence": 0..1,
 "version": "tagger-1.0.0"
}

Rules:
- Prefer "low" artifact risk unless clear evidence of AI distortions.
- If unsure, lower confidence and set series="".
- Keep title/caption succinct; no hype.`;

// Daily budget tracking (simple in-memory for now)
let dailySpend = 0;
const dailyBudget = parseFloat(process.env.TAGGER_DAILY_BUDGET || '10');
let lastResetDate = new Date().toDateString();

function checkAndResetBudget() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailySpend = 0;
    lastResetDate = today;
  }
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Check if tagger is enabled
    if (process.env.TAGGER_ENABLED !== 'true') {
      return NextResponse.json({ 
        error: 'Tagger is disabled',
        enabled: false 
      }, { status: 503 });
    }

    // Check daily budget
    checkAndResetBudget();
    if (dailySpend >= dailyBudget) {
      console.log('Daily budget exceeded:', dailySpend, '/', dailyBudget);
      return NextResponse.json({ 
        error: 'Daily budget exceeded',
        budget_exceeded: true 
      }, { status: 429 });
    }

    const { creation_id, image_url, image_data } = await request.json();

    if (!creation_id || (!image_url && !image_data)) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Sampling (only process 1 in N)
    const sampleRate = parseInt(process.env.TAGGER_SAMPLE_RATE || '1');
    if (sampleRate > 1 && Math.random() > (1 / sampleRate)) {
      return NextResponse.json({ 
        skipped: true, 
        reason: 'sampling' 
      });
    }

    // Prepare image for Claude
    let imageBase64 = image_data;
    if (image_url && !image_data) {
      // Fetch image if only URL provided
      const imageResponse = await fetch(image_url);
      const buffer = await imageResponse.arrayBuffer();
      imageBase64 = Buffer.from(buffer).toString('base64');
    }

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.2,
      system: TAGGER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: 'Analyze this image and return the JSON classification.',
            },
          ],
        },
      ],
    });

    // Parse response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    let tags;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      tags = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text);
      throw new Error('Failed to parse tagging response');
    }

    // Update spend estimate (rough)
    dailySpend += 0.05; // Estimate ~$0.05 per image

    // Save to database
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('creations')
      .update({
        tags,
        quality: tags.quality,
        routing: tags.routing,
        tagger_version: tags.version,
        tagger_confidence: tags.confidence,
        metadata: {
          tagger_processed: new Date().toISOString(),
          tagger_spend: 0.05
        }
      })
      .eq('id', creation_id);

    if (updateError) {
      console.error('Failed to update creation with tags:', updateError);
    }

    // Queue for curator if needed
    if (tags.routing?.send_to_curator) {
      // This would queue the curator job
      console.log('Would queue curator for creation:', creation_id);
    }

    return NextResponse.json({
      success: true,
      creation_id,
      tags,
      daily_spend: dailySpend,
      daily_budget: dailyBudget
    });

  } catch (error: any) {
    console.error('Tagger error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to tag image' },
      { status: 500 }
    );
  }
}