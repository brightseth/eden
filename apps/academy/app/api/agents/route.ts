import { NextResponse } from 'next/server';
import { registryClient } from '@eden2/registry-sdk';

export async function GET() {
  try {
    const agents = await registryClient.getAgents();
    
    return NextResponse.json({
      success: true,
      count: agents.length,
      agents: agents.sort((a, b) => a.position - b.position),
      metadata: {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        fallbackUsed: !process.env.REGISTRY_BASE_URL
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch agents',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}