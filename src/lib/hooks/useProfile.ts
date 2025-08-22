import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { ProfileCardData } from '@/components/profile/ProfileCard';

const supabase = createClientComponentClient();

export async function getAgentProfile(agentId: string): Promise<ProfileCardData | null> {
  try {
    // Fetch agent data
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();
    
    if (agentError || !agent) {
      // Fallback for legacy/exceptional agents not in DB
      const legacyAgents: Record<string, any> = {
        abraham: {
          id: 'abraham',
          name: 'Abraham',
          status: 'LAUNCHING',
          practice_start: '2025-10-19',
          practice_name: 'covenant'
        },
        solienne: {
          id: 'solienne', 
          name: 'Solienne',
          status: 'LAUNCHING',
          practice_start: '2025-11-10',
          practice_name: 'daily_practice'
        }
      };
      
      if (legacyAgents[agentId]) {
        agent = legacyAgents[agentId];
      } else {
        return null;
      }
    }
    
    // Fetch agent stats
    const { count: archiveCount } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId);
    
    // Fetch trainers
    const { data: trainers } = await supabase
      .from('agent_trainers')
      .select('trainer_id, trainers(id, display_name)')
      .eq('agent_id', agentId);
    
    // Calculate practice day if started
    let practiceDay = 0;
    let daysUntilStart = 0;
    if (agent.practice_start) {
      const startDate = new Date(agent.practice_start);
      const now = new Date();
      const diffTime = now.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        practiceDay = diffDays + 1;
      } else {
        daysUntilStart = Math.abs(diffDays);
      }
    }
    
    return {
      kind: 'agent',
      id: agentId,
      displayName: agent.name || agent.id,
      status: agent.status || 'DEVELOPING',
      avatarUrl: agent.avatar_url,
      bio: agent.description,
      practice: {
        name: agent.practice_name,
        startAt: agent.practice_start,
        day: practiceDay > 0 ? practiceDay : undefined,
        streak: practiceDay > 0 ? practiceDay : undefined,
        includeRate: agent.include_rate
      },
      stats: {
        archiveCount: archiveCount || 0,
        dropsCount: 0 // TODO: fetch from drops table
      },
      trainers: trainers?.map(t => ({
        id: t.trainers.id,
        displayName: t.trainers.display_name,
        link: `/trainers/${t.trainers.id}`
      })) || [],
      links: {
        profile: `/academy/agent/${agentId}`,
        archive: archiveCount > 0 ? `/academy/${agentId}/archive` : undefined,
        practiceHub: agent.practice_name ? `/academy/${agentId}/${agent.practice_name}` : undefined
      },
      socials: {}
    };
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    return null;
  }
}

export async function getTrainerProfile(trainerId: string): Promise<ProfileCardData | null> {
  try {
    // Fetch trainer data
    const { data: trainer, error } = await supabase
      .from('trainers')
      .select('*')
      .eq('id', trainerId)
      .single();
    
    if (error || !trainer) {
      console.error('Trainer not found:', trainerId);
      return null;
    }
    
    // Fetch agents this trainer trains
    const { data: agents } = await supabase
      .from('agent_trainers')
      .select('agent_id, agents(id, name, status)')
      .eq('trainer_id', trainerId);
    
    // Count total works created by this trainer
    const { count: worksCount } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('trainer_id', trainerId);
    
    return {
      kind: 'trainer',
      id: trainerId,
      displayName: trainer.display_name,
      avatarUrl: trainer.avatar_url,
      bio: trainer.bio,
      socials: trainer.socials || {},
      agents: agents?.map(a => ({
        id: a.agents.id,
        displayName: a.agents.name,
        link: `/academy/agent/${a.agents.id}`,
        status: a.agents.status
      })) || [],
      tags: trainer.tags || [],
      links: {
        profile: `/trainers/${trainerId}`
      }
    };
  } catch (error) {
    console.error('Error fetching trainer profile:', error);
    return null;
  }
}

// Convenience hooks for React components
import { useState, useEffect } from 'react';

export function useAgentProfile(agentId: string) {
  const [profile, setProfile] = useState<ProfileCardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getAgentProfile(agentId).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, [agentId]);
  
  return { profile, loading };
}

export function useTrainerProfile(trainerId: string) {
  const [profile, setProfile] = useState<ProfileCardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getTrainerProfile(trainerId).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, [trainerId]);
  
  return { profile, loading };
}