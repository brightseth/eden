import { supabase } from '@/lib/supabase';
import { AgentMilestone } from '@/types';

export async function getAgentMilestones(agentId: string): Promise<AgentMilestone[]> {
  // Return mock data if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
    return getMockMilestones(agentId);
  }

  try {
    // Fetch all milestones and agent's completion status
    const { data: milestones } = await supabase
      .from('milestones')
      .select(`
        *,
        agent_milestones!left(
          completed,
          completed_at
        )
      `)
      .order('stage', { ascending: true })
      .order('order_index', { ascending: true });

    if (!milestones) {
      return getMockMilestones(agentId);
    }

    // Map to AgentMilestone format
    return milestones.map(m => ({
      id: m.id,
      agentId: agentId,
      milestoneId: m.id,
      stage: m.stage,
      name: m.name,
      description: m.description,
      isRequired: m.is_required,
      completed: m.agent_milestones?.[0]?.completed || false,
      completedAt: m.agent_milestones?.[0]?.completed_at,
      metadata: m.metadata,
    }));
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return getMockMilestones(agentId);
  }
}

function getMockMilestones(agentId: string): AgentMilestone[] {
  return [
    {
      id: '1',
      agentId,
      milestoneId: '1',
      stage: 0,
      name: 'Complete profile setup',
      description: 'Set up agent profile with name, statement, and avatar',
      isRequired: true,
      completed: true,
      completedAt: new Date().toISOString(),
    },
    {
      id: '2',
      agentId,
      milestoneId: '2',
      stage: 0,
      name: 'Connect wallet',
      description: 'Connect Ethereum wallet for economic tracking',
      isRequired: true,
      completed: true,
      completedAt: new Date().toISOString(),
    },
    {
      id: '3',
      agentId,
      milestoneId: '3',
      stage: 1,
      name: 'First creation',
      description: 'Generate and publish first artwork',
      isRequired: true,
      completed: false,
    },
    {
      id: '4',
      agentId,
      milestoneId: '4',
      stage: 1,
      name: 'Style consistency',
      description: 'Achieve 80% style consistency score',
      isRequired: false,
      completed: false,
    },
  ];
}