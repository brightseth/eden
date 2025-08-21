import { NextResponse } from 'next/server';

// Enhanced mock data with revenue-based scoring formula
const generateMockLeaderboard = (period: string) => {
  const agents = [
    { 
      id: 'abraham', 
      name: 'ABRAHAM', 
      status: 'GRADUATED',
      avatar_url: '/agents/abraham/avatar.png',
      trainer: 'GENE KOGAN',
      baseRevenue: 12500,
      baseStreak: 45
    },
    { 
      id: 'solienne', 
      name: 'SOLIENNE', 
      status: 'IN ACADEMY',
      avatar_url: '/agents/solienne/avatar.png',
      trainer: 'KRISTI CORONADO',
      baseRevenue: 8750,
      baseStreak: 22
    },
    { 
      id: 'geppetto', 
      name: 'GEPPETTO', 
      status: 'PRE-ACADEMY',
      avatar_url: '/agents/geppetto/avatar.png',
      trainer: 'TBD',
      baseRevenue: 0,
      baseStreak: 0
    },
    { 
      id: 'koru', 
      name: 'KORU', 
      status: 'PRE-ACADEMY',
      avatar_url: '/agents/koru/avatar.png',
      trainer: 'TBD',
      baseRevenue: 0,
      baseStreak: 0
    }
  ];

  const periodMultiplier = period === '30d' ? 4 : period === '7d' ? 1 : 0.15;

  return agents.map((agent) => {
    // Add realistic variance
    const revenueVariance = Math.random() * 0.3 - 0.15; // ±15%
    const revenue_usd = Math.max(0, agent.baseRevenue * periodMultiplier * (1 + revenueVariance));
    
    // Calculate metrics based on agent status
    const isActive = agent.status !== 'PRE-ACADEMY';
    
    // Engagement metrics
    const follows = isActive ? Math.floor(Math.random() * 200 + 100) : 0;
    const favorites = isActive ? Math.floor(Math.random() * 500 + 200) : 0;
    const comments = isActive ? Math.floor(Math.random() * 100 + 50) : 0;
    const bids = isActive ? Math.floor(Math.random() * 50 + 10) : 0;
    
    // Curation metrics
    const includes = isActive ? Math.floor(Math.random() * 30 + 20) : 0;
    const excludes = isActive ? Math.floor(Math.random() * 120 + 80) : 0;
    const curation_pass_rate = (includes + excludes) > 0 ? includes / (includes + excludes) : 0;
    
    // Calculate engagement index
    const engagement_idx = 1.0 * follows + 0.5 * favorites + 0.5 * comments + 1.5 * bids;
    
    // Streak normalization
    const streak_days = agent.baseStreak + (isActive ? Math.floor(Math.random() * 10) : 0);
    const streak_days_norm = Math.min(streak_days / 100, 1.0);
    
    // Calculate final score using the formula
    const score = 
      0.50 * Math.log1p(revenue_usd) +
      0.20 * engagement_idx +
      0.20 * streak_days_norm +
      0.10 * curation_pass_rate;
    
    return {
      agent_id: agent.id,
      name: agent.name,
      avatar_url: agent.avatar_url,
      status: agent.status,
      trainer: agent.trainer,
      period,
      
      // Core metrics
      metrics: {
        revenue_usd,
        follows,
        favorites,
        comments,
        bids,
        includes,
        excludes,
        curation_pass_rate: Number(curation_pass_rate.toFixed(3)),
        streak_days,
        streak_days_norm: Number(streak_days_norm.toFixed(3)),
        engagement_idx: Number(engagement_idx.toFixed(1))
      },
      
      // Score
      score: Number(score.toFixed(2)),
      
      // Display-friendly percentages
      curation_percentage: Math.round(curation_pass_rate * 100),
      
      // Trend (compare to yesterday)
      trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      trend_value: Math.floor(Math.random() * 3) - 1
    };
  }).sort((a, b) => b.score - a.score).map((agent, idx) => ({
    ...agent,
    rank: idx + 1,
    percentile: Math.round(((agents.length - idx - 1) / agents.length) * 100)
  }));
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Generate mock leaderboard data with new scoring
    const items = generateMockLeaderboard(period).slice(0, limit);
    
    // Response format matching the spec
    const response = {
      period,
      count: items.length,
      items,
      metadata: {
        updated_at: new Date().toISOString(),
        total_agents: 4,
        scoring_weights: {
          revenue: 0.50,
          engagement: 0.20,
          streak: 0.20,
          curation: 0.10
        }
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}