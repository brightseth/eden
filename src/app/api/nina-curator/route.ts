import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

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
    const { imageData, mode = 'single' } = await request.json();

    if (!imageData) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Call Claude with the image
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      system: NINA_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageData,
              },
            },
            {
              type: 'text',
              text: 'Evaluate this work for Paris Photo Digital Sector. Be brutally honest and selective. Return JSON only.',
            },
          ],
        },
      ],
    });

    // Parse the response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    let evaluation;
    try {
      // Extract JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      evaluation = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text);
      throw new Error('Failed to parse evaluation response');
    }

    // Calculate weighted total if not provided
    if (!evaluation.weighted_total && evaluation.scores_raw) {
      const weights = {
        paris_photo_ready: 0.30,
        ai_criticality: 0.25,
        conceptual_strength: 0.20,
        technical_excellence: 0.15,
        cultural_dialogue: 0.10,
      };

      evaluation.weighted_total = Object.entries(weights).reduce((total, [key, weight]) => {
        return total + (evaluation.scores_raw[key] || 0) * weight / 100;
      }, 0);
    }

    // Emit event for live ticker
    if (typeof window !== 'undefined') {
      // Client-side event emission
      window.dispatchEvent(new CustomEvent('nina-verdict', {
        detail: {
          verdict: evaluation.verdict,
          weighted: evaluation.weighted_total,
          image_id: Date.now().toString(),
        }
      }));
    }

    return NextResponse.json({ 
      success: true, 
      evaluation,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Nina curator error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    service: 'Nina Roehrs Digital Curator',
    version: '2.0',
    status: 'active',
    description: 'AI-powered curation system for Paris Photo Digital Sector'
  });
}