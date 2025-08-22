import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Tagger system prompt (final version)
const TAGGER_PROMPT = `You are Eden's Tagger. Return STRICT JSON only.
Classify one image so Trainers can triage before curation.

Schema:
{
  "taxonomy": {
    "type": "portrait|manifesto|process|product|performance|landscape|abstract|poster",
    "subject": string[],
    "format": "color|b&w|duotone",
    "mood": string[],
    "series": string
  },
  "features": { 
    "palette": string[], 
    "lighting": string[], 
    "composition": string[], 
    "text_presence": boolean 
  },
  "quality": { 
    "artifact_risk": "low|medium|high", 
    "print_readiness": 0..1, 
    "phash": string 
  },
  "routing": { 
    "send_to_curator": boolean, 
    "share_candidates": string[] 
  },
  "confidence": 0..1,
  "version": "tagger-1.0.0"
}

Rules:
- Be concise and consistent. Lower confidence if unsure.
- Favor "low" artifact_risk unless distortions are obvious.
- Keep series labels short (1-3 words max).
- send_to_curator=true for high quality or interesting pieces.`;

// Budget tracking (in-memory for now, should use DB in production)
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

// POST /api/tagger - Process a work with AI vision (internal worker)
export async function POST(request: NextRequest) {
  try {
    // Check if tagger is enabled
    if (process.env.TAGGER_ENABLED !== 'true') {
      return NextResponse.json({ 
        message: 'Tagger is disabled',
        enabled: false 
      });
    }

    // Check budget
    checkAndResetBudget();
    if (dailySpend >= dailyBudget) {
      return NextResponse.json({ 
        error: 'Daily budget exceeded',
        spent: dailySpend,
        budget: dailyBudget
      }, { status: 429 });
    }

    // Apply sampling rate
    const sampleRate = parseFloat(process.env.TAGGER_SAMPLE || '1.0');
    if (Math.random() > sampleRate) {
      return NextResponse.json({ 
        message: 'Skipped due to sampling',
        sample_rate: sampleRate 
      });
    }

    const body = await request.json();
    const { work_id, media_url } = body;

    if (!work_id || !media_url) {
      return NextResponse.json(
        { error: 'Missing required fields: work_id, media_url' },
        { status: 400 }
      );
    }

    // Call Claude Vision API
    const visionResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: TAGGER_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: media_url,
              },
            },
            {
              type: 'text',
              text: 'Analyze this image and return the classification JSON.',
            },
          ],
        },
      ],
    });

    // Parse response
    const responseText = visionResponse.content[0].type === 'text' 
      ? visionResponse.content[0].text 
      : '';

    let tags;
    try {
      // Extract JSON from response (Claude sometimes adds text around it)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      tags = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse tagger response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Update spend estimate
    dailySpend += 0.05; // Rough estimate per image

    // Save to database
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from('tags')
      .upsert({
        work_id,
        taxonomy: tags.taxonomy,
        features: tags.features,
        quality: tags.quality,
        routing: tags.routing,
        confidence: tags.confidence || 0.8,
        version: tags.version || 'tagger-1.0.0'
      })
      .select();

    if (updateError) {
      console.error('Failed to save tags:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      work_id,
      tags,
      spend: dailySpend.toFixed(2),
      budget_remaining: (dailyBudget - dailySpend).toFixed(2)
    });

  } catch (error: any) {
    console.error('Tagger error:', error);
    return NextResponse.json(
      { error: error.message || 'Tagger processing failed' },
      { status: 500 }
    );
  }
}

// GET /api/tagger - Check tagger status
export async function GET() {
  checkAndResetBudget();
  
  return NextResponse.json({
    enabled: process.env.TAGGER_ENABLED === 'true',
    sample_rate: parseFloat(process.env.TAGGER_SAMPLE || '1.0'),
    daily_budget: dailyBudget,
    daily_spend: dailySpend.toFixed(2),
    budget_remaining: (dailyBudget - dailySpend).toFixed(2),
    reset_date: lastResetDate
  });
}