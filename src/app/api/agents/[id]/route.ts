import { NextRequest, NextResponse } from 'next/server';
import { getAgent } from '@/lib/db/agents';

// GET /api/agents/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = await getAgent(id);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    // Ensure safe numeric values
    const safeAgent = {
      ...agent,
      currentStage: agent.currentStage || 1,
      currentDay: agent.currentDay || 1,
      totalDays: agent.totalDays || 100,
      daysUntilLaunch: agent.daysUntilLaunch || 0,
    };
    
    return NextResponse.json(safeAgent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}