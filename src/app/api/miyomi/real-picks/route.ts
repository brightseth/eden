import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return getSupabase();
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// GET /api/miyomi/real-picks - Load picks from database
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // PENDING, LIVE, WIN, LOSS
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[MIYOMI Real Picks] GET request:', { limit, status, offset });

    // Build query
    let query = supabase
      .from('miyomi_picks')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status.toUpperCase());
    }

    const { data: picks, error, count } = await query;

    if (error) {
      console.error('[MIYOMI Real Picks] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch picks', details: error.message },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('miyomi_picks')
      .select('*', { count: 'exact', head: true });

    console.log(`[MIYOMI Real Picks] Returning ${picks?.length || 0} picks (${totalCount} total)`);

    // Transform database format to UI format
    const transformedPicks = (picks || []).map(pick => ({
      id: pick.id,
      timestamp: pick.timestamp,
      market_question: pick.market, // Use actual field name
      market_id: 'market-' + pick.id, // Generate market ID
      position: pick.position,
      miyomi_price: pick.entry_odds / 100, // Convert to decimal
      consensus_price: pick.current_odds / 100, // Convert to decimal
      current_price: pick.current_odds / 100, // Convert to decimal
      status: pick.status || 'LIVE',
      platform: pick.platform,
      category: pick.category,
      reasoning: typeof pick.reasoning === 'object' ? pick.reasoning.text : pick.reasoning,
      confidence: pick.confidence,
      edge: pick.edge,
      created_at: pick.created_at,
      pnl: pick.pnl || 0,
      roi: pick.roi || 0
    }));

    return NextResponse.json({
      success: true,
      picks: transformedPicks,
      count: picks?.length || 0,
      totalInDb: totalCount || 0,
      offset,
      limit,
      hasMore: (offset + limit) < (totalCount || 0)
    });

  } catch (error) {
    console.error('[MIYOMI Real Picks] GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/miyomi/real-picks - Save new pick to database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[MIYOMI Real Picks] POST request:', body);

    // Validate required fields
    const { market, position, confidence, entry_odds, reasoning } = body;
    
    if (!market || !position || confidence === undefined || entry_odds === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: market, position, confidence, entry_odds' },
        { status: 400 }
      );
    }

    // Determine platform from market_id or default to KALSHI
    let platform = 'KALSHI';
    if (body.market_id) {
      if (body.market_id.includes('poly')) platform = 'POLYMARKET';
      else if (body.market_id.includes('manifold')) platform = 'MANIFOLD';
      else if (body.market_id.includes('melee')) platform = 'MELEE';
    }

    // Auto-detect category from market text
    const category = detectCategory(market);

    // Create pick record using existing schema
    const pickData = {
      id: `pick-${Date.now()}`,
      timestamp: new Date().toISOString(),
      market_id: body.market_id || `${platform.toLowerCase()}-${Date.now()}`,
      market_question: market,
      position: position.toUpperCase(),
      reasoning: reasoning,
      consensus_price: parseFloat(entry_odds),
      miyomi_price: parseFloat(confidence),
      post: body.script || generatePost(market, position, confidence),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('miyomi_picks')
      .insert(pickData)
      .select()
      .single();

    if (error) {
      console.error('[MIYOMI Real Picks] Insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save pick', details: error.message },
        { status: 500 }
      );
    }

    console.log('[MIYOMI Real Picks] Pick saved:', data.id);

    // Update daily performance stats (placeholder for now)
    // TODO: Implement updateDailyStats function

    return NextResponse.json({
      success: true,
      pick: data,
      message: 'Pick saved successfully'
    });

  } catch (error) {
    console.error('[MIYOMI Real Picks] POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/miyomi/real-picks - Update pick performance
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, current_price } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Pick ID required' },
        { status: 400 }
      );
    }

    // Get the pick to calculate PnL
    const { data: pick } = await supabase
      .from('miyomi_picks')
      .select('*')
      .eq('id', id)
      .single();

    if (!pick) {
      return NextResponse.json(
        { error: 'Pick not found' },
        { status: 404 }
      );
    }

    // Calculate PnL if price provided
    let pnl = 0;
    let pnl_percent = 0;
    if (current_price !== undefined) {
      const entryPrice = pick.miyomi_price;
      if (pick.position === 'YES') {
        pnl = current_price - entryPrice;
      } else {
        pnl = entryPrice - current_price;
      }
      pnl_percent = (pnl / entryPrice) * 100;
    }

    // Update or create performance record
    const perfData = {
      pick_id: id,
      status: status?.toUpperCase() || 'LIVE',
      current_price: current_price || pick.consensus_price,
      pnl: pnl,
      pnl_percent: pnl_percent,
      last_updated: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('miyomi_performance')
      .upsert(perfData, { onConflict: 'pick_id' })
      .select()
      .single();

    if (error) {
      console.error('Failed to update performance:', error);
      return NextResponse.json(
        { error: 'Failed to update performance', details: error.message },
        { status: 500 }
      );
    }

    // Update personality stats
    await updatePersonalityStats();

    return NextResponse.json({
      success: true,
      performance: data
    });
  } catch (error) {
    console.error('Error updating pick:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getTotalCount() {
  const { count } = await supabase
    .from('miyomi_picks')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}


async function updatePersonalityStats() {
  // Get all performance records
  const { data: performance } = await supabase
    .from('miyomi_performance')
    .select('*');

  if (!performance) return;

  const wins = performance.filter(p => p.status === 'WIN').length;
  const losses = performance.filter(p => p.status === 'LOSS').length;
  const total = wins + losses;
  const winRate = total > 0 ? (wins / total) * 100 : 0;

  // Update or create personality record
  await supabase
    .from('miyomi_personality')
    .upsert({
      id: 'miyomi-main',
      win_rate: winRate,
      total_picks: performance.length,
      mood: getMood(winRate),
      energy: getEnergy(performance),
      current_vibe: getVibe(winRate),
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
}

function getMood(winRate: number): string {
  if (winRate > 70) return 'euphoric';
  if (winRate > 60) return 'confident';
  if (winRate > 50) return 'vibing';
  if (winRate > 40) return 'contemplative';
  return 'plotting';
}

function getEnergy(performance: any[]): number {
  const recentPicks = performance.filter(p => {
    const pickTime = new Date(p.last_updated);
    const hourAgo = new Date(Date.now() - 3600000);
    return pickTime > hourAgo;
  });
  return Math.min(100, recentPicks.length * 20);
}

function getVibe(winRate: number): string {
  const vibes = [
    'chaos goblin mode activated',
    'mercury retrograde energy',
    'unhinged but correct',
    'vibes immaculate',
    'contrarian queen era'
  ];
  const index = Math.floor((winRate / 100) * (vibes.length - 1));
  return vibes[Math.max(0, Math.min(index, vibes.length - 1))];
}

// Helper functions for data transformation
function getPlatformFromId(marketId: string): string {
  if (!marketId) return 'Unknown';
  const lower = marketId.toLowerCase();
  if (lower.includes('kalshi')) return 'Kalshi';
  if (lower.includes('poly')) return 'Polymarket';
  if (lower.includes('manifold')) return 'Manifold';
  if (lower.includes('melee')) return 'Melee';
  return 'Unknown';
}

function detectCategory(question: string): string {
  const lowerQ = question.toLowerCase();
  if (lowerQ.includes('fed') || lowerQ.includes('rate') || lowerQ.includes('bitcoin') || lowerQ.includes('stock')) return 'finance';
  if (lowerQ.includes('election') || lowerQ.includes('president') || lowerQ.includes('congress')) return 'politics';
  if (lowerQ.includes('nba') || lowerQ.includes('nfl') || lowerQ.includes('playoff')) return 'sports';
  if (lowerQ.includes('ai') || lowerQ.includes('gpt') || lowerQ.includes('claude')) return 'ai';
  if (lowerQ.includes('taylor') || lowerQ.includes('album') || lowerQ.includes('movie')) return 'pop';
  return 'internet';
}

function generatePost(market: string, position: string, confidence: number): string {
  const posts = [
    `The market's sleeping on this one. ${position} is literally free money 💀`,
    `Everyone's wrong about ${market}. Loading ${position} bags 👀`,
    `Mercury retrograde hitting different. ${position} at ${(confidence * 100).toFixed(0)}% confidence ✨`,
    `Overheard at Lucien: smart money's going ${position}. Just saying...`,
    `The vibes are immaculate for ${position}. If you know, you know 🎯`
  ];
  return posts[Math.floor(Math.random() * posts.length)];
}