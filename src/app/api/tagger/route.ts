import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return getSupabase();
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";import Anthropic from '@anthropic-ai/sdk';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";import { inferCapturedAt } from '@/lib/date-extraction';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Eden's Tagger prompt - focused on organization and filtering
const TAGGER_PROMPT = `You are Eden's Tagger. Return STRICT JSON only (no prose).
Classify a single image so curators can triage it before critique.

Schema:
{
  "taxonomy": {
    "type": "portrait|manifesto|process|product|performance|landscape|abstract|poster",
    "subject": string[],                 // e.g., ["single-figure","biotech-adornment","text-overlay"]
    "format": "color|b&w|duotone",
    "mood": string[],                    // e.g., ["mythic","serene","confrontational"]
    "series": string                     // concise, stable label or ""
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
- Favor 'low' artifact_risk unless distortions are obvious (hands/eyes/text mangling).
- 'series' should be short, human-readable, and repeatable across similar images.
- For Solienne: focus on fashion/style elements
- For Abraham: focus on philosophical/conceptual elements`;


// Check if we're within budget
async function checkBudget(supabase: any): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('can_run_tagger');
  
  if (error) {
    console.error('Error checking tagger budget:', error);
    return false;
  }
  
  return data === true;
}

// Track usage
async function trackUsage(supabase: any, costUsd: number) {
  await supabase.rpc('track_tagger_usage', { cost_usd: costUsd });
}

// POST /api/tagger - Process a work with AI vision (internal worker)
export async function POST(request: NextRequest) {
  try {
    // Check if tagger is enabled
    if (process.env.TAGGER_ENABLED === 'false') {
      return NextResponse.json(
        { error: 'Tagger is disabled' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { work_id, media_url, agent_id, filename } = body;

    if (!work_id || !media_url) {
      return NextResponse.json(
        { error: 'work_id and media_url are required' },
        { status: 400 }
      );
    }

    const supabase = await getSupabase();

    // Check budget
    const budgetOk = await checkBudget(supabase);
    if (!budgetOk) {
      console.log('Tagger budget exceeded for today');
      return NextResponse.json(
        { error: 'Daily budget exceeded' },
        { status: 429 }
      );
    }

    // Sample rate control
    const sampleRate = parseFloat(process.env.TAGGER_SAMPLE || '1.0');
    if (Math.random() > sampleRate) {
      console.log(`Skipping tagging due to sample rate (${sampleRate})`);
      return NextResponse.json({ skipped: true });
    }

    // Check if already tagged
    const { data: existingTags } = await supabase
      .from('tags')
      .select('work_id')
      .eq('work_id', work_id)
      .single();

    if (existingTags) {
      return NextResponse.json({ 
        message: 'Work already tagged',
        work_id 
      });
    }

    // Call Claude Vision API
    console.log(`Tagging work ${work_id} from ${agent_id || 'unknown'}`);
    
    // Determine if this is a base64 data URL or regular URL
    let imageSource;
    if (media_url.startsWith('data:image/')) {
      // Base64 encoded image
      const base64Data = media_url.split(',')[1];
      const mimeType = media_url.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
      imageSource = {
        type: 'base64',
        media_type: mimeType,
        data: base64Data
      };
    } else {
      // Regular URL
      imageSource = {
        type: 'url',
        url: media_url,
      };
    }
    
    const visionResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.3,
      system: TAGGER_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: imageSource as any,
            },
            {
              type: 'text',
              text: JSON.stringify({ 
                image_type: media_url.startsWith('data:') ? 'uploaded' : 'url',
                agent: agent_id || 'unknown' 
              }),
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

    // Save tags to database
    const { error: insertError } = await supabase
      .from('tags')
      .insert({
        work_id,
        taxonomy: tags.taxonomy,
        features: tags.features,
        quality: tags.quality,
        routing: tags.routing,
        confidence: tags.confidence,
        version: tags.version || 'tagger-1.0.0',
      });

    if (insertError) {
      console.error('Failed to save tags:', insertError);
      return NextResponse.json(
        { error: 'Failed to save tags' },
        { status: 500 }
      );
    }

    // Extract and update captured_at date with improved extraction
    const capturedAt = await inferCapturedAt({
      filename,
      media_url,
      fallback: new Date().toISOString()
    });
    
    // Always update captured_at and filename if we have them
    const updateData: any = { captured_at: capturedAt };
    if (filename) updateData.filename = filename;
    
    await supabase
      .from('works')
      .update(updateData)
      .eq('id', work_id);

    // Track usage (estimate ~$0.01 per image)
    await trackUsage(supabase, 0.01);

    console.log(`Successfully tagged work ${work_id}`);
    console.log(`Type: ${tags.taxonomy.type}, Series: ${tags.taxonomy.series}`);
    console.log(`Print readiness: ${tags.quality.print_readiness}, Artifact risk: ${tags.quality.artifact_risk}`);

    return NextResponse.json({
      success: true,
      work_id,
      tags,
    });

  } catch (error: any) {
    console.error('Tagger error:', error);
    return NextResponse.json(
      { error: error.message || 'Tagger processing failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to check tagger status
export async function GET() {
  const supabase = await getSupabase();
  
  // Get today's budget status
  const { data: budget } = await supabase
    .from('tagger_budget')
    .select('*')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  return NextResponse.json({
    enabled: process.env.TAGGER_ENABLED !== 'false',
    sample_rate: parseFloat(process.env.TAGGER_SAMPLE || '1.0'),
    daily_limit_usd: parseFloat(process.env.TAGGER_DAILY_USD || '10'),
    today: {
      calls_made: budget?.calls_made || 0,
      usd_spent: budget?.usd_spent || 0,
      remaining: (budget?.daily_limit_usd || 10) - (budget?.usd_spent || 0),
    },
    version: 'tagger-1.0.0',
  });
}