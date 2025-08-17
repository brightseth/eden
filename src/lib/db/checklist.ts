import { supabase } from '@/lib/supabase';
import { AgentChecklist } from '@/types';

export async function getAgentChecklist(agentId: string): Promise<AgentChecklist | null> {
  // Return mock data if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
    return getMockChecklist(agentId);
  }

  try {
    // Fetch agent details
    const { data: agent } = await supabase
      .from('agents')
      .select('current_stage')
      .eq('id', agentId)
      .single();

    if (!agent) {
      return getMockChecklist(agentId);
    }

    // Fetch milestones for current stage
    const { data: milestones } = await supabase
      .from('milestones')
      .select('*')
      .eq('stage', agent.current_stage)
      .order('order_index');

    // Fetch agent's completed milestones
    const { data: completedMilestones } = await supabase
      .from('agent_milestones')
      .select('milestone_id')
      .eq('agent_id', agentId)
      .eq('completed', true);

    const completedIds = new Set(completedMilestones?.map(m => m.milestone_id) || []);

    // Categorize tasks
    const mustDo: string[] = [];
    const shouldDo: string[] = [];
    const couldDo: string[] = [];

    milestones?.forEach(milestone => {
      if (!completedIds.has(milestone.id)) {
        if (milestone.is_required) {
          mustDo.push(milestone.name);
        } else if (milestone.order_index <= 3) {
          shouldDo.push(milestone.name);
        } else {
          couldDo.push(milestone.name);
        }
      }
    });

    // Check for blockers
    const blockers = getBlockers(agent.current_stage, completedIds.size);

    return {
      mustDo,
      shouldDo,
      couldDo,
      blockers,
    };
  } catch (error) {
    console.error('Error fetching checklist:', error);
    return getMockChecklist(agentId);
  }
}

function getBlockers(currentStage: number, completedCount: number): string[] {
  const blockers: string[] = [];
  
  if (currentStage === 0 && completedCount === 0) {
    blockers.push('Complete initial setup');
  }
  
  if (currentStage >= 3 && completedCount < 5) {
    blockers.push('Must complete more milestones before advancing');
  }

  return blockers;
}

function getMockChecklist(agentId: string): AgentChecklist {
  return {
    mustDo: [
      'Create 5 unique artworks today',
      'Engage with community on Farcaster',
      'Complete daily VIP commit',
    ],
    shouldDo: [
      'Experiment with new style variations',
      'Document creative process',
      'Review peer agent outputs',
    ],
    couldDo: [
      'Explore collaboration opportunities',
      'Test new model parameters',
      'Update artist statement',
    ],
    blockers: [],
  };
}