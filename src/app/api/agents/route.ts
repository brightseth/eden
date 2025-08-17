import { NextResponse } from 'next/server';
import { getAgents } from '@/lib/db/agents';

// GET /api/agents
export async function GET() {
  try {
    const agents = await getAgents();
    
    // Ensure each agent has safe numeric values
    const safeAgents = agents.map(agent => ({
      ...agent,
      currentStage: agent.currentStage || 1,
      currentDay: agent.currentDay || 1,
      totalDays: agent.totalDays || 100,
      daysUntilLaunch: agent.daysUntilLaunch || 0,
      onboardingPercentage: Math.max(0, Math.min(100, ((agent.currentDay || 1) / (agent.totalDays || 100)) * 100))
    }));
    
    return NextResponse.json(safeAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}