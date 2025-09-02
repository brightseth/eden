import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}
// Initialize Supabase client

// GET /api/agents/miyomi/picks - Get recent picks
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');

    let query = supabase
      .from('miyomi_picks')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status.toUpperCase());
    }

    if (platform) {
      query = query.eq('platform', platform.toUpperCase());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch MIYOMI picks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch picks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      picks: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error in MIYOMI picks API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/agents/miyomi/picks - Create new pick (internal use)
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    // Verify internal API token
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.INTERNAL_API_TOKEN;
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { market, platform, position, entry_odds, confidence, edge } = body;
    
    if (!market || !platform || !position || !entry_odds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert new pick
    const { data, error } = await supabase
      .from('miyomi_picks')
      .insert({
        market,
        platform: platform.toUpperCase(),
        position: position.toUpperCase(),
        entry_odds,
        confidence: confidence || 0.5,
        edge: edge || 0,
        category: body.category,
        video_url: body.video_url,
        analysis_url: body.analysis_url,
        reasoning: body.reasoning,
        tags: body.tags || [],
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create MIYOMI pick:', error);
      return NextResponse.json(
        { error: 'Failed to create pick' },
        { status: 500 }
      );
    }

    // Trigger video generation if enabled
    if (process.env.EDEN_API_KEY && body.generate_video) {
      // Queue video generation job
      console.log('Queueing video generation for pick:', data.id);
      // This would call Eden API to generate video
    }

    return NextResponse.json({
      success: true,
      pick: data
    });
  } catch (error) {
    console.error('Error in MIYOMI picks POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/agents/miyomi/picks - Update pick status
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    // Verify internal API token
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.INTERNAL_API_TOKEN;
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, current_odds, exit_odds, pnl, roi } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update pick
    const updateData: any = {
      status: status.toUpperCase(),
      updated_at: new Date().toISOString()
    };

    if (current_odds !== undefined) updateData.current_odds = current_odds;
    if (exit_odds !== undefined) updateData.exit_odds = exit_odds;
    if (pnl !== undefined) updateData.pnl = pnl;
    if (roi !== undefined) updateData.roi = roi;
    
    if (status.toUpperCase() === 'WIN' || status.toUpperCase() === 'LOSS') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('miyomi_picks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update MIYOMI pick:', error);
      return NextResponse.json(
        { error: 'Failed to update pick' },
        { status: 500 }
      );
    }

    // Update daily performance stats
    await updatePerformanceStats();

    return NextResponse.json({
      success: true,
      pick: data
    });
  } catch (error) {
    console.error('Error in MIYOMI picks PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update performance stats
async function updatePerformanceStats() {
  const supabase = await getSupabase();
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's stats
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
    win_rate: 0,
    avg_confidence: 0,
    avg_edge: 0,
    total_pnl: 0,
    roi: 0
  };
  
  // Calculate metrics
  const resolved = picks.filter(p => p.status === 'WIN' || p.status === 'LOSS');
  if (resolved.length > 0) {
    stats.win_rate = (stats.wins / resolved.length) * 100;
  }
  
  if (picks.length > 0) {
    stats.avg_confidence = picks.reduce((sum, p) => sum + (p.confidence || 0), 0) / picks.length;
    stats.avg_edge = picks.reduce((sum, p) => sum + (p.edge || 0), 0) / picks.length;
    stats.total_pnl = picks.reduce((sum, p) => sum + (p.pnl || 0), 0);
  }
  
  // Upsert performance record
  await supabase
    .from('miyomi_performance')
    .upsert(stats, { onConflict: 'date' });
}