/**
 * Server route to generate MIYOMI brand visuals via Eden
 * Provides consistent visual assets for video assembly
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface MediaRequest {
  sector: 'politics' | 'sports' | 'finance' | 'ai' | 'pop' | 'geo' | 'internet';
  mood: 'spicy' | 'analytical' | 'celebratory' | 'contrarian';
  variant: 'lower-third-v2' | 'full-screen' | 'split-screen' | 'overlay';
}

interface MediaResponse {
  imageUrl: string;
  thumbUrl: string;
  attribution: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal request
    const authHeader = request.headers.get('authorization');
    const internalToken = process.env.INTERNAL_API_TOKEN;
    
    if (!authHeader || authHeader !== `Bearer ${internalToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: MediaRequest = await request.json();

    // Map MIYOMI's visual style based on sector and mood
    const stylePrompt = generateStylePrompt(body.sector, body.mood);

    // Call Eden's image generation API
    const edenResponse = await fetch(`${process.env.EDEN_BASE_URL}/media/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EDEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent: 'miyomi',
        style: 'contrarian-trader',
        prompt: stylePrompt,
        aspect_ratio: '9:16', // Vertical for shorts
        variant: body.variant,
        metadata: {
          sector: body.sector,
          mood: body.mood
        }
      })
    });

    if (!edenResponse.ok) {
      console.error('Eden media generation failed');
      return NextResponse.json(
        { error: 'Failed to generate media' },
        { status: edenResponse.status }
      );
    }

    const result = await edenResponse.json();
    
    const response: MediaResponse = {
      imageUrl: result.url,
      thumbUrl: result.thumbnail_url || result.url,
      attribution: 'eden:miyomi:v0.3'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Media generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateStylePrompt(sector: string, mood: string): string {
  const prompts = {
    'politics-spicy': 'Bold red and blue split screen with glitch effects, contrarian data overlays',
    'politics-analytical': 'Clean data visualization with political map overlays, professional charts',
    'sports-celebratory': 'Dynamic action shots with neon overlays, winner celebration vibes',
    'sports-contrarian': 'Underdog energy with dark background, upset potential graphics',
    'finance-analytical': 'Trading terminal aesthetic, green/red candles, Bloomberg style',
    'finance-spicy': 'Wolf of Wall Street energy, gold accents, aggressive typography',
    'pop-celebratory': 'Vibrant colors, party atmosphere, trendy graphics',
    'pop-contrarian': 'Anti-mainstream aesthetics, underground vibes, edgy design',
    // Add more combinations as needed
  };

  const key = `${sector}-${mood}`;
  return prompts[key] || prompts['finance-analytical']; // Default fallback
}