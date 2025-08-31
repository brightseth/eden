import { NextRequest, NextResponse } from 'next/server';
import { getAgentOverview } from '@/lib/db/agents';

// GET /api/agents/[id]/overview
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string  }> }) {
  try {
    const params = await context.params; const { id } = params;
    const overview = await getAgentOverview(id);
    
    if (!overview) {
      return NextResponse.json(
        { error: 'Agent overview not found' },
        { status: 404 }
      );
    }
    
    // Ensure safe numeric values in metrics
    const safeOverview = {
      ...overview,
      metrics: {
        ...overview.metrics,
        totalCreations: overview.metrics?.totalCreations || 0,
        revenue: overview.metrics?.revenue || 0,
        vipCommits: overview.metrics?.vipCommits || 0,
        streakDays: overview.metrics?.streakDays || 0,
        readinessScore: overview.metrics?.readinessScore || 0,
      }
    };
    
    return NextResponse.json(safeOverview);
  } catch (error) {
    console.error('Error fetching agent overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent overview' },
      { status: 500 }
    );
  }
}