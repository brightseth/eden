import { supabase } from '@/lib/supabase';
import { Agent, AgentOverview } from '@/types';

export async function getAgents(): Promise<Agent[]> {
  // Return mock data if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
    return getMockAgents();
  }

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching agents:', error);
    return getMockAgents();
  }

  // Map database fields to TypeScript interface
  return (data || []).map(agent => ({
    id: agent.id,
    name: agent.name,
    artistStatement: agent.artist_statement,
    avatarUrl: agent.avatar_url,
    walletAddress: agent.wallet_address,
    currentStage: agent.current_stage,
    currentDay: agent.current_day,
    totalDays: agent.total_days,
    launchDate: agent.launch_date,
    daysUntilLaunch: agent.days_until_launch,
    economyMode: agent.economy_mode as 'training' | 'live',
    metadata: agent.metadata,
    createdAt: agent.created_at,
    updatedAt: agent.updated_at,
  }));
}

export async function getAgent(id: string): Promise<Agent | null> {
  // Return mock data if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
    const agents = getMockAgents();
    return agents.find(a => a.id === id) || null;
  }

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching agent:', error);
    const agents = getMockAgents();
    return agents.find(a => a.id === id) || null;
  }

  if (!data) return null;

  // Map database fields to TypeScript interface
  return {
    id: data.id,
    name: data.name,
    artistStatement: data.artist_statement,
    avatarUrl: data.avatar_url,
    walletAddress: data.wallet_address,
    currentStage: data.current_stage,
    currentDay: data.current_day,
    totalDays: data.total_days,
    launchDate: data.launch_date,
    daysUntilLaunch: data.days_until_launch,
    economyMode: data.economy_mode as 'training' | 'live',
    metadata: data.metadata,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getAgentOverview(agentId: string): Promise<AgentOverview | null> {
  // Return mock data if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
    return getMockAgentOverview(agentId);
  }

  try {
    // Fetch latest metrics
    const { data: metricsData } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .order('date', { ascending: false })
      .limit(30);

    // Fetch economy events
    const { data: eventsData } = await supabase
      .from('economy_events')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(100);

    // Calculate overview metrics
    const metrics = metricsData || [];
    const events = eventsData || [];

    const totalCreations = metrics.reduce((sum, m) => sum + (m.creations_count || 0), 0);
    const totalRevenue = events
      .filter(e => e.event_type === 'revenue')
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    const vipCommits = metrics.filter(m => m.vip_commit).length;
    const streakDays = calculateStreak(metrics);
    const readinessScore = calculateReadinessScore(metrics, events);

    return {
      metrics: {
        totalCreations,
        revenue: totalRevenue,
        vipCommits,
        streakDays,
        readinessScore,
      },
    };
  } catch (error) {
    console.error('Error fetching agent overview:', error);
    return getMockAgentOverview(agentId);
  }
}

function calculateStreak(metrics: any[]): number {
  if (!metrics.length) return 0;
  
  let streak = 0;
  const today = new Date();
  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const metric of sortedMetrics) {
    const metricDate = new Date(metric.date);
    const daysDiff = Math.floor((today.getTime() - metricDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak && metric.creations_count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateReadinessScore(metrics: any[], events: any[]): number {
  // Simple readiness calculation based on activity
  const hasRecentActivity = metrics.length > 0 && 
    metrics[0]?.creations_count > 0;
  const hasRevenue = events.some(e => e.event_type === 'revenue');
  const hasConsistency = metrics.filter(m => m.creations_count > 0).length / 
    Math.max(metrics.length, 1) > 0.5;

  let score = 0;
  if (hasRecentActivity) score += 40;
  if (hasRevenue) score += 30;
  if (hasConsistency) score += 30;

  return Math.min(score, 100);
}

// Mock data for development
function getMockAgents(): Agent[] {
  const now = new Date();
  const launchDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now

  return [
    {
      id: 'agent-1',
      name: 'Solienne',
      artistStatement: 'Guardian of the Garden, weaving dreams of nature',
      avatarUrl: null,
      walletAddress: '0x1234...',
      currentStage: 2,
      currentDay: 40,
      totalDays: 100,
      launchDate: launchDate.toISOString(),
      daysUntilLaunch: 60,
      economyMode: 'training' as const,
      metadata: {
        style: 'surreal nature',
        medium: 'AI-generated imagery',
        farcasterUsername: 'solienne',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'agent-2',
      name: 'Abraham',
      artistStatement: 'Autonomous artificial artist exploring creativity',
      avatarUrl: null,
      walletAddress: '0x5678...',
      currentStage: 3,
      currentDay: 55,
      totalDays: 100,
      launchDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      daysUntilLaunch: 45,
      economyMode: 'training' as const,
      metadata: {
        style: 'abstract expressionism',
        medium: 'generative algorithms',
        farcasterUsername: 'abraham',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Eden Academy Agent',
      artistStatement: 'Demo agent for Eden Academy operator training system',
      avatarUrl: null,
      walletAddress: '0xabcd...',
      currentStage: 2,
      currentDay: 25,
      totalDays: 100,
      launchDate: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000).toISOString(),
      daysUntilLaunch: 75,
      economyMode: 'training' as const,
      metadata: {
        style: 'educational content',
        medium: 'AI training demonstrations',
        farcasterUsername: 'edenacademy',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

function getMockAgentOverview(agentId: string): AgentOverview {
  return {
    metrics: {
      totalCreations: Math.floor(Math.random() * 100) + 50,
      revenue: Math.random() * 1000,
      vipCommits: Math.floor(Math.random() * 10) + 5,
      streakDays: Math.floor(Math.random() * 30) + 10,
      readinessScore: Math.floor(Math.random() * 40) + 60,
    },
  };
}