/**
 * Server-only route for MIYOMI to submit works to Eden Registry
 * This keeps the Eden API key secure on the server
 */
import { NextRequest, NextResponse } from 'next/server';

// Ensure this only runs on server
export const runtime = 'nodejs';

// Type definitions
interface MarketRef {
  platform: 'Polymarket' | 'Kalshi' | 'Manifold' | 'Melee' | 'Myriad';
  id: string;
  side: 'YES' | 'NO' | 'OVER' | 'UNDER' | 'HOME' | 'AWAY';
  odds: number;
}

interface MiyomiWork {
  type: 'pick';
  title: string;
  sector: 'politics' | 'sports' | 'finance' | 'ai' | 'pop' | 'geo' | 'internet';
  confidence: number;
  marketRef: MarketRef;
  script: string;
  videoUrl: string;
  frameUrl: string;
  scheduledAt: string;
  postedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify request is from our Claude SDK
    const authHeader = request.headers.get('authorization');
    const internalToken = process.env.INTERNAL_API_TOKEN;
    
    if (!authHeader || authHeader !== `Bearer ${internalToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: MiyomiWork = await request.json();

    // Validate required fields
    if (!body.type || !body.title || !body.marketRef) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call Eden API with server-stored key
    const edenResponse = await fetch(`${process.env.EDEN_BASE_URL}/api/agents/miyomi/works`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EDEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: 'miyomi',
        type: body.type,
        title: body.title,
        content: {
          sector: body.sector,
          confidence: body.confidence,
          market: body.marketRef,
          script: body.script
        },
        media_uri: body.videoUrl,
        metadata: {
          frame_url: body.frameUrl,
          scheduled_at: body.scheduledAt,
          posted_at: body.postedAt
        },
        tags: [body.sector, 'contrarian', 'prediction', body.marketRef.platform.toLowerCase()]
      })
    });

    if (!edenResponse.ok) {
      const error = await edenResponse.text();
      console.error('Eden API error:', error);
      return NextResponse.json(
        { error: 'Failed to submit to Eden Registry' },
        { status: edenResponse.status }
      );
    }

    const result = await edenResponse.json();
    return NextResponse.json({ success: true, work_id: result.id });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}