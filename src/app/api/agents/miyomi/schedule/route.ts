import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}
// Initialize Supabase client

// Market data providers (placeholder - would integrate actual APIs)
async function fetchMarketOpportunities() {
  // In production, this would:
  // 1. Fetch from Kalshi API using KALSHI_API_KEY
  // 2. Fetch from Polymarket API
  // 3. Fetch from Manifold API
  // 4. Fetch from Melee API using MELEE_API_KEY
  
  // For now, return mock data
  return [
    {
      market: 'Will BTC hit $100k by Feb 2025?',
      platform: 'KALSHI',
      currentOdds: { yes: 0.65, no: 0.35 },
      volume: 125000,
      closes: '2025-02-28T23:59:59Z',
      category: 'finance'
    },
    {
      market: 'Trump approval >50% in first 100 days?',
      platform: 'POLYMARKET',
      currentOdds: { yes: 0.42, no: 0.58 },
      volume: 890000,
      closes: '2025-05-01T00:00:00Z',
      category: 'politics'
    },
    {
      market: 'Will GPT-5 launch before March 2025?',
      platform: 'MANIFOLD',
      currentOdds: { yes: 0.28, no: 0.72 },
      volume: 45000,
      closes: '2025-03-31T23:59:59Z',
      category: 'ai'
    }
  ];
}

// MIYOMI's analysis engine
async function analyzeMark(market: any, config: any) {
  // This would integrate with Anthropic Claude for analysis
  // For now, return mock analysis
  
  const analysis = {
    shouldBet: Math.random() > 0.3, // 70% participation rate
    position: Math.random() > 0.5 ? 'YES' : 'NO',
    confidence: 0.5 + Math.random() * 0.5, // 50-100% confidence
    edge: -0.1 + Math.random() * 0.3, // -10% to +20% edge
    reasoning: {
      signals: ['Market momentum', 'Contrarian opportunity', 'Information asymmetry'],
      risks: ['Event volatility', 'Low liquidity'],
      timeframe: 'medium'
    }
  };
  
  // Apply config filters
  if (config.banned_topics?.includes(market.category)) {
    analysis.shouldBet = false;
  }
  
  if (analysis.confidence < config.min_confidence) {
    analysis.shouldBet = false;
  }
  
  if (analysis.edge < config.min_edge) {
    analysis.shouldBet = false;
  }
  
  return analysis;
}

// GET /api/agents/miyomi/schedule - Check schedule status
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    // Get config
    const { data: config } = await supabase
      .from('miyomi_config')
      .select('*')
      .single();

    // Get today's picks count
    const today = new Date().toISOString().split('T')[0];
    const { count: todayPicks } = await supabase
      .from('miyomi_picks')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', `${today}T00:00:00`)
      .lt('timestamp', `${today}T23:59:59`);

    const remainingPicks = (config?.max_daily_picks || 10) - (todayPicks || 0);

    return NextResponse.json({
      active: config?.active || false,
      todayPicks: todayPicks || 0,
      remainingPicks,
      maxDailyPicks: config?.max_daily_picks || 10,
      nextRun: new Date(Date.now() + 3600000).toISOString() // Next hour
    });
  } catch (error) {
    console.error('Error in MIYOMI schedule GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/agents/miyomi/schedule - Trigger analysis run
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    // Verify internal API token or cron secret
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.INTERNAL_API_TOKEN;
    const cronSecret = request.headers.get('X-Cron-Secret');
    
    if (!authHeader?.includes(expectedToken) && cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get config
    const { data: config } = await supabase
      .from('miyomi_config')
      .select('*')
      .single();

    if (!config?.active) {
      return NextResponse.json({
        message: 'MIYOMI is currently inactive',
        active: false
      });
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const { count: todayPicks } = await supabase
      .from('miyomi_picks')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', `${today}T00:00:00`)
      .lt('timestamp', `${today}T23:59:59`);

    const remainingPicks = (config.max_daily_picks || 10) - (todayPicks || 0);
    
    if (remainingPicks <= 0) {
      return NextResponse.json({
        message: 'Daily pick limit reached',
        todayPicks,
        maxDailyPicks: config.max_daily_picks
      });
    }

    // Fetch market opportunities
    const markets = await fetchMarketOpportunities();
    console.log(`Found ${markets.length} market opportunities`);

    const picksCreated = [];
    let picksMade = 0;

    // Analyze each market
    for (const market of markets) {
      if (picksMade >= remainingPicks) break;
      
      const analysis = await analyzeMark(market, config);
      
      if (analysis.shouldBet) {
        // Create pick
        const { data: pick, error } = await supabase
          .from('miyomi_picks')
          .insert({
            market: market.market,
            platform: market.platform,
            position: analysis.position,
            confidence: analysis.confidence,
            edge: analysis.edge,
            entry_odds: analysis.position === 'YES' ? market.currentOdds.yes : market.currentOdds.no,
            category: market.category,
            reasoning: analysis.reasoning,
            status: 'PENDING'
          })
          .select()
          .single();

        if (!error && pick) {
          picksCreated.push(pick);
          picksMade++;
          
          // Queue video generation if configured
          if (process.env.EDEN_API_KEY) {
            console.log(`Queueing video for pick: ${pick.id}`);
            // This would trigger Eden video generation
          }
        }
      }
    }

    // Update performance stats
    if (picksCreated.length > 0) {
      await updateDailyStats();
    }

    return NextResponse.json({
      success: true,
      marketsAnalyzed: markets.length,
      picksCreated: picksCreated.length,
      picks: picksCreated,
      remainingToday: remainingPicks - picksCreated.length
    });
  } catch (error) {
    console.error('Error in MIYOMI schedule POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper to update daily stats
async function updateDailyStats() {
  const supabase = await getSupabase();
  const today = new Date().toISOString().split('T')[0];
  
  const { data: picks } = await supabase
    .from('miyomi_picks')
    .select('*')
    .gte('timestamp', `${today}T00:00:00`)
    .lt('timestamp', `${today}T23:59:59`);
  
  if (!picks) return;
  
  const stats = {
    date: today,
    picks_made: picks.length,
    wins: picks.filter(p => p.status === 'WIN').length,
    losses: picks.filter(p => p.status === 'LOSS').length,
    pending: picks.filter(p => p.status === 'PENDING' || p.status === 'LIVE').length,
    avg_confidence: picks.length > 0 
      ? picks.reduce((sum, p) => sum + (p.confidence || 0), 0) / picks.length
      : 0,
    avg_edge: picks.length > 0
      ? picks.reduce((sum, p) => sum + (p.edge || 0), 0) / picks.length
      : 0
  };
  
  await supabase
    .from('miyomi_performance')
    .upsert(stats, { onConflict: 'date' });
}