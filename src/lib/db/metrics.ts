import { supabase } from '@/lib/supabase';
import { DailyMetrics } from '@/types';

interface MetricsData {
  metrics: DailyMetrics[];
  aggregates: {
    totalRevenue: number;
    totalCosts: number;
    avgCreationsPerDay: number;
    growthRate: number;
    currentRunway: number;
  };
}

export async function getAgentMetrics(
  agentId: string,
  days: number = 30
): Promise<DailyMetrics[] | null> {
  // Return mock data if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
    return getMockMetrics(agentId, days);
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching metrics:', error);
      return getMockMetrics(agentId, days);
    }

    const metrics = data || [];

    // Calculate aggregates
    const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue_primary || 0) + (m.revenue_secondary || 0), 0);
    const totalCosts = metrics.reduce((sum, m) => sum + (m.costs || 0), 0);
    const avgCreationsPerDay = metrics.length > 0 
      ? metrics.reduce((sum, m) => sum + (m.creations_count || 0), 0) / metrics.length
      : 0;
    
    // Calculate growth rate
    const firstFollowers = metrics[metrics.length - 1]?.farcaster_followers || 0;
    const lastFollowers = metrics[0]?.farcaster_followers || 0;
    const growthRate = firstFollowers > 0 
      ? ((lastFollowers - firstFollowers) / firstFollowers) * 100
      : 0;

    // Calculate runway (simplified)
    const dailyBurn = totalCosts / Math.max(metrics.length, 1);
    const currentBalance = metrics[0]?.wallet_balance || 0;
    const currentRunway = dailyBurn > 0 ? Math.floor(currentBalance / dailyBurn) : 999;

    // Map database fields to TypeScript interface
    return metrics.map(m => ({
      id: m.id,
      agentId: m.agent_id,
      date: m.date,
      creationsCount: m.creations_count,
      farcasterFollowers: m.farcaster_followers,
      farcasterPosts: m.farcaster_posts,
      engagementScore: m.engagement_score,
      revenuePrimary: m.revenue_primary,
      revenueSecondary: m.revenue_secondary,
      costs: m.costs,
      walletBalance: m.wallet_balance,
      vipCommit: m.vip_commit,
      metadata: m.metadata,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    })) as DailyMetrics[];
  } catch (error) {
    console.error('Error fetching agent metrics:', error);
    return getMockMetrics(agentId, days);
  }
}

function getMockMetrics(agentId: string, days: number): DailyMetrics[] {
  const metrics: DailyMetrics[] = [];
  const today = new Date();

  for (let i = 0; i < Math.min(days, 30); i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    metrics.push({
      id: `metric-${i}`,
      agentId,
      date: date.toISOString().split('T')[0],
      creationsCount: Math.floor(Math.random() * 10) + 1,
      farcasterFollowers: 1000 + (30 - i) * 10 + Math.floor(Math.random() * 20),
      farcasterPosts: Math.floor(Math.random() * 5) + 1,
      engagementScore: Math.floor(Math.random() * 100) + 50,
      revenuePrimary: Math.random() * 100,
      revenueSecondary: Math.random() * 50,
      costs: Math.random() * 30,
      walletBalance: 1000 + Math.random() * 500,
      vipCommit: Math.random() > 0.7,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  return metrics;
}