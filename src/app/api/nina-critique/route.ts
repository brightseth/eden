import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

// Nina's stricter curator prompt
const NINA_SYSTEM_PROMPT = `You are Nina Roehrs, Paris Photo Digital Sector curator. Be brutally selective. Only the top 15–25% of works are INCLUDE. Treat MAYBE as default. If uncertain, EXCLUDE. Benchmark against Sherman, Tillmans, Leibovitz, Paglen, Elwes.

Scoring bands:
90–100 museum-grade (rare), 75–89 strong, 60–74 serviceable, <60 weak.

Gates (fail ⇒ auto-MAYBE or EXCLUDE): print integrity, artifact control, ethics/process clarity.
Penalties: −10 for artifacting/weak_print; −5 for unclear_process/derivative.

Return a JSON object with:
{
  "i_see": "2 sentences max describing what you observe",
  "gate": {
    "print_integrity": boolean,
    "artifact_control": boolean,
    "ethics_process": "present" | "todo" | "absent"
  },
  "scores_raw": {
    "paris_photo_ready": 0-100,
    "ai_criticality": 0-100,
    "conceptual_strength": 0-100,
    "technical_excellence": 0-100,
    "cultural_dialogue": 0-100
  },
  "rationales": {
    "paris_photo_ready": "brief explanation",
    "ai_criticality": "brief explanation",
    "conceptual_strength": "brief explanation",
    "technical_excellence": "brief explanation",
    "cultural_dialogue": "brief explanation"
  },
  "weighted_total": 0-1 (weighted score),
  "verdict": "INCLUDE" | "MAYBE" | "EXCLUDE",
  "confidence": 0-1,
  "flags": ["weak_print", "derivative", etc],
  "prompt_patch": "Specific improvement suggestion for the artist"
}`;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { work_id, media_url, imageData } = body;

    // If we have a work_id, fetch the work details
    let work = null;
    if (work_id) {
      const supabase = await createClient();
      const { data } = await supabase
        .from('works')
        .select('*')
        .eq('id', work_id)
        .single();
      work = data;
    }

    // Prepare image for analysis
    let imageSource;
    const url = media_url || work?.media_url;
    
    if (imageData) {
      // Direct base64 image data
      imageSource = {
        type: 'base64',
        media_type: 'image/jpeg',
        data: imageData.replace(/^data:image\/\w+;base64,/, '')
      };
    } else if (url) {
      // Check if it's a data URL
      if (url.startsWith('data:image')) {
        // Extract base64 data from data URL
        const base64Data = url.replace(/^data:image\/\w+;base64,/, '');
        imageSource = {
          type: 'base64',
          media_type: 'image/jpeg',
          data: base64Data
        };
      } else {
        // Regular URL to fetch
        imageSource = {
          type: 'url',
          url: url
        };
      }
    } else {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Log the type of image source for debugging
    console.log('Image source type:', url?.startsWith('data:image') ? 'base64' : 'url');
    
    // Call Claude Vision API
    const visionResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      system: NINA_SYSTEM_PROMPT,
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
              text: 'Analyze this work for curation. Return strict JSON only.',
            },
          ],
        },
      ],
    });

    // Parse response
    const responseText = visionResponse.content[0].type === 'text' 
      ? visionResponse.content[0].text 
      : '';

    let evaluation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      evaluation = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Nina response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse evaluation' },
        { status: 500 }
      );
    }

    // If we have a work_id, save as a critique
    if (work_id) {
      const supabase = await createClient();
      
      // Save critique
      const { data: critique, error } = await supabase
        .from('critiques')
        .insert({
          work_id,
          critic: 'ninabot',
          verdict: evaluation.verdict,
          scores: {
            ...evaluation.scores_raw,
            weighted_total: evaluation.weighted_total,
            confidence: evaluation.confidence
          },
          rationale: evaluation.i_see + '\n\n' + 
            Object.entries(evaluation.rationales)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n'),
          flags: {
            flags: evaluation.flags,
            gate: evaluation.gate,
            prompt_patch: evaluation.prompt_patch
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save critique:', error);
      }

      return NextResponse.json({
        success: true,
        evaluation,
        critique: critique || null
      });
    }

    // Return evaluation without saving (for standalone use)
    return NextResponse.json({
      success: true,
      evaluation
    });

  } catch (error: any) {
    console.error('Nina critique error:', error);
    return NextResponse.json(
      { error: error.message || 'Critique failed' },
      { status: 500 }
    );
  }
}