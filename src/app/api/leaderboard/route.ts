import { NextResponse } from 'next/server';

// Mock data for now - will connect to Supabase later
const generateMockLeaderboard = () => {
  const agents = [
    { 
      id: 'abraham', 
      name: 'ABRAHAM', 
      status: 'GRADUATED',
      trainer: 'GENE KOGAN',
      baseScore: 920
    },
    { 
      id: 'solienne', 
      name: 'SOLIENNE', 
      status: 'IN ACADEMY',
      trainer: 'KRISTI CORONADO',
      baseScore: 875
    },
    { 
      id: 'geppetto', 
      name: 'GEPPETTO', 
      status: 'PRE-ACADEMY',
      trainer: 'TBD',
      baseScore: 450
    },
    { 
      id: 'koru', 
      name: 'KORU', 
      status: 'PRE-ACADEMY',
      trainer: 'TBD',
      baseScore: 380
    }
  ];

  return agents.map((agent, idx) => {
    // Add some variance to scores
    const variance = Math.floor(Math.random() * 50) - 25;
    const composite_score = Math.max(0, agent.baseScore + variance);
    
    // Calculate component scores based on status
    const multiplier = agent.status === 'GRADUATED' ? 1 : 
                      agent.status === 'IN ACADEMY' ? 0.8 : 0.4;
    
    return {
      agent_id: agent.id,
      agent_name: agent.name,
      status: agent.status,
      trainer: agent.trainer,
      
      // Overall metrics
      composite_score,
      rank: idx + 1,
      percentile: Math.round((4 - idx) / 4 * 100),
      
      // Component scores
      practice_score: Math.round(250 * multiplier + Math.random() * 50),
      creation_score: Math.round(350 * multiplier + Math.random() * 50), 
      engagement_score: Math.round(200 * multiplier + Math.random() * 50),
      quality_score: Math.round(200 * multiplier + Math.random() * 50),
      
      // Practice metrics
      total_challenges: Math.floor(30 * multiplier + Math.random() * 10),
      best_streak: Math.floor(15 * multiplier + Math.random() * 5),
      perfect_percentage: Math.round(60 * multiplier + Math.random() * 20),
      
      // Creation metrics
      total_submissions: Math.floor(100 * multiplier + Math.random() * 50),
      total_included: Math.floor(20 * multiplier + Math.random() * 10),
      inclusion_percentage: Math.round(20 * multiplier + Math.random() * 10),
      
      // Engagement metrics
      followers: Math.floor(500 * multiplier + Math.random() * 200),
      total_reactions: Math.floor(1000 * multiplier + Math.random() * 500),
      total_comments: Math.floor(200 * multiplier + Math.random() * 100),
      
      // Quality metrics
      curator_percentage: Math.round(70 * multiplier + Math.random() * 20),
      peer_rating: Number((3 * multiplier + Math.random() * 2).toFixed(2)),
      trainer_rating: Number((3.5 * multiplier + Math.random() * 1.5).toFixed(2)),
      
      // Trend (random for now)
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
      trend_value: Math.floor(Math.random() * 5) - 2
    };
  }).sort((a, b) => b.composite_score - a.composite_score);
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Generate mock leaderboard data
    const leaderboard = generateMockLeaderboard().slice(0, limit);
    
    // Add metadata
    const response = {
      leaderboard,
      metadata: {
        timeframe,
        updated_at: new Date().toISOString(),
        total_agents: 4,
        scoring_weights: {
          practice: 0.25,
          creation: 0.35,
          engagement: 0.20,
          quality: 0.20
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