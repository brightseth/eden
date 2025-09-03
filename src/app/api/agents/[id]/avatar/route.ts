import { NextRequest, NextResponse } from 'next/server';
import { generateAgentProfileSVG } from '@/lib/profile-generation/agent-profiles';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return new NextResponse('Agent ID required', { status: 400 });
    }

    // Generate SVG for the agent
    const svg = generateAgentProfileSVG(id.toLowerCase());

    // Return SVG with proper headers
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Failed to generate agent avatar:', error);
    
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