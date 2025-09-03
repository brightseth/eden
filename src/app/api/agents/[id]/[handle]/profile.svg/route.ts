import { NextRequest, NextResponse } from 'next/server';
import { generateAgentProfileSVG } from '@/lib/profile-generation/agent-profiles';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await context.params;
    
    if (!handle) {
      return new NextResponse('Agent handle required', { status: 400 });
    }

    // Generate SVG for the agent
    const svg = generateAgentProfileSVG(handle.toLowerCase());

    // Return SVG with proper headers
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Failed to generate agent profile:', error);
    
    // Return a simple fallback SVG
    const fallbackSVG = `
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#000000"/>
        <text x="200" y="200" text-anchor="middle" fill="#808080" font-size="24">
          NO IMAGE
        </text>
      </svg>
    `;
    
    return new NextResponse(fallbackSVG, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}