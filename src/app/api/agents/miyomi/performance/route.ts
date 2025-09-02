import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}
// Initialize Supabase client

// GET /api/agents/miyomi/performance - Get performance metrics
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30'; // days
    const groupBy = searchParams.get('groupBy') || 'day';

    // Get current stats from view
    const { data: currentStats } = await supabase
      .from('miyomi_current_stats')
      .select('*')
      .single();

    // Get historical performance
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const { data: historicalData, error } = await supabase
      .from('miyomi_performance')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('Failed to fetch MIYOMI performance:', error);
      return NextResponse.json(
        { error: 'Failed to fetch performance data' },
        { status: 500 }
      );
    }

    // Calculate aggregate stats
    const aggregateStats = calculateAggregateStats(historicalData || []);

    // Get recent picks for activity feed
    const { data: recentPicks } = await supabase
      .from('miyomi_picks')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);

    // Get platform breakdown
    const { data: platformStats } = await supabase
      .from('miyomi_picks')
      .select('platform, status')
      .gte('timestamp', startDate.toISOString());

    const platformBreakdown = calculatePlatformBreakdown(platformStats || []);

    return NextResponse.json({
      current: currentStats || {},
      historical: historicalData || [],
      aggregate: aggregateStats,
      recentPicks: recentPicks || [],
      platformBreakdown,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Error in MIYOMI performance API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate aggregate stats
function calculateAggregateStats(data: any[]) {
  if (data.length === 0) {
    return {
      totalPicks: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      totalPnl: 0,
      avgRoi: 0,
      bestDay: null,
      worstDay: null
    };
  }

  const totalPicks = data.reduce((sum, d) => sum + (d.picks_made || 0), 0);
  const totalWins = data.reduce((sum, d) => sum + (d.wins || 0), 0);
  const totalLosses = data.reduce((sum, d) => sum + (d.losses || 0), 0);
  const totalPnl = data.reduce((sum, d) => sum + (d.total_pnl || 0), 0);
  
  const winRate = totalWins + totalLosses > 0 
    ? (totalWins / (totalWins + totalLosses)) * 100 
    : 0;
    
  const avgRoi = data.length > 0
    ? data.reduce((sum, d) => sum + (d.roi || 0), 0) / data.length
    : 0;

  const bestDay = data.reduce((best, d) => 
    (d.total_pnl || 0) > (best?.total_pnl || 0) ? d : best, 
    data[0]
  );
  
  const worstDay = data.reduce((worst, d) => 
    (d.total_pnl || 0) < (worst?.total_pnl || 0) ? d : worst, 
    data[0]
  );

  return {
    totalPicks,
    totalWins,
    totalLosses,
    winRate: Math.round(winRate * 100) / 100,
    totalPnl: Math.round(totalPnl * 100) / 100,
    avgRoi: Math.round(avgRoi * 100) / 100,
    bestDay: bestDay?.date,
    worstDay: worstDay?.date
  };
}

// Helper function to calculate platform breakdown
function calculatePlatformBreakdown(picks: any[]) {
  const platforms = ['KALSHI', 'POLYMARKET', 'MANIFOLD', 'MELEE'];
  const breakdown: any = {};

  platforms.forEach(platform => {
    const platformPicks = picks.filter(p => p.platform === platform);
    const wins = platformPicks.filter(p => p.status === 'WIN').length;
    const losses = platformPicks.filter(p => p.status === 'LOSS').length;
    const total = wins + losses;

    breakdown[platform] = {
      total: platformPicks.length,
      wins,
      losses,
      pending: platformPicks.filter(p => p.status === 'PENDING' || p.status === 'LIVE').length,
      winRate: total > 0 ? (wins / total) * 100 : 0
    };
  });

  return breakdown;
}