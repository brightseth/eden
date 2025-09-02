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

// POST /api/miyomi/test-picks - Create test picks for demo
export async function POST(request: NextRequest) {
  try {
    const testPicks = [
      {
        market: 'Fed Rate Cut by March 2025?',
        platform: 'KALSHI',
        position: 'NO',
        confidence: 0.75,
        edge: 0.20,
        entry_odds: 65.00,
        current_odds: 63.00,
        status: 'LIVE',
        category: 'finance'
      },
      {
        market: 'Bitcoin above $100K by end of 2025?',
        platform: 'POLYMARKET', 
        position: 'YES',
        confidence: 0.80,
        edge: 0.30,
        entry_odds: 35.00,
        current_odds: 38.00,
        status: 'LIVE',
        category: 'finance'
      },
      {
        market: 'Major AI regulation passed in US by Q3 2025?',
        platform: 'MANIFOLD',
        position: 'NO', 
        confidence: 0.85,
        edge: 0.30,
        entry_odds: 55.00,
        current_odds: 52.00,
        status: 'LIVE',
        category: 'ai'
      },
      {
        market: 'Taylor Swift releases new album in 2025?',
        platform: 'KALSHI',
        position: 'YES',
        confidence: 0.78,
        edge: 0.35,
        entry_odds: 40.00,
        current_odds: 42.00,
        status: 'LIVE',
        category: 'pop'
      }
    ];

    console.log('[MIYOMI Test] Creating test picks...');

    // Insert picks into database
    const { data, error } = await supabase
      .from('miyomi_picks')
      .insert(testPicks)
      .select();

    if (error) {
      console.error('[MIYOMI Test] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create test picks', details: error.message },
        { status: 500 }
      );
    }

    console.log(`[MIYOMI Test] Created ${data?.length || 0} test picks`);

    // Calculate PnL for each pick and update in the picks table
    if (data) {
      for (const pick of data) {
        let pnl = 0;
        const entryPrice = pick.entry_odds / 100; // Convert to decimal
        const currentPrice = pick.current_odds / 100;
        
        if (pick.position === 'YES') {
          pnl = ((currentPrice - entryPrice) / entryPrice) * 100;
        } else {
          pnl = ((entryPrice - currentPrice) / entryPrice) * 100;
        }

        // Update the pick with calculated PnL
        await supabase
          .from('miyomi_picks')
          .update({ pnl: pnl, roi: pnl })
          .eq('id', pick.id);
      }
    }


    return NextResponse.json({
      success: true,
      picks: data,
      count: data?.length || 0,
      message: 'Test picks created successfully'
    });

  } catch (error) {
    console.error('[MIYOMI Test] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/miyomi/test-picks - Clean up test picks
export async function DELETE(request: NextRequest) {
  try {
    console.log('[MIYOMI Test] Cleaning up test picks...');

    // Delete test picks (those with market names containing 'Fed Rate' or 'Bitcoin' etc.)
    const { error: picksError } = await supabase
      .from('miyomi_picks')
      .delete()
      .or('market.ilike.%Fed Rate%,market.ilike.%Bitcoin%,market.ilike.%AI regulation%,market.ilike.%Taylor Swift%');

    if (picksError) {
      console.error('[MIYOMI Test] Failed to delete picks:', picksError);
      return NextResponse.json({ error: 'Failed to delete test picks' }, { status: 500 });
    }


    return NextResponse.json({
      success: true,
      message: 'Test picks cleaned up successfully'
    });

  } catch (error) {
    console.error('[MIYOMI Test] Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}