import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

// GET /api/miyomi/market-stream - Server-sent events for live market data
export async function GET(request: NextRequest) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Check if client supports SSE
  const accept = request.headers.get('accept');
  if (!accept?.includes('text/event-stream')) {
    return NextResponse.json({ error: 'SSE not supported' }, { status: 406 });
  }

  try {
    const supabase = await getSupabase();
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const data = `data: ${JSON.stringify({ 
          type: 'connected', 
          timestamp: new Date().toISOString(),
          message: 'MIYOMI market stream connected'
        })}\n\n`;
        controller.enqueue(encoder.encode(data));

        // Set up interval for market updates
        const interval = setInterval(async () => {
          try {
    const supabase = await getSupabase();
            const updates = await generateMarketUpdates();
            const data = `data: ${JSON.stringify({
              type: 'market_update',
              timestamp: new Date().toISOString(),
              updates
            })}\n\n`;
            
            controller.enqueue(encoder.encode(data));
          } catch (error) {
            console.error('Error sending market update:', error);
            const errorData = `data: ${JSON.stringify({
              type: 'error',
              timestamp: new Date().toISOString(),
              message: 'Market update failed'
            })}\n\n`;
            controller.enqueue(encoder.encode(errorData));
          }
        }, 5000); // Update every 5 seconds

        // Heartbeat to keep connection alive
        const heartbeat = setInterval(() => {
          const heartbeatData = `data: ${JSON.stringify({
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          })}\n\n`;
          controller.enqueue(encoder.encode(heartbeatData));
        }, 30000); // Every 30 seconds

        // Cleanup function
        const cleanup = () => {
          clearInterval(interval);
          clearInterval(heartbeat);
          controller.close();
        };

        // Set up cleanup on stream close
        const abortHandler = () => cleanup();
        request.signal?.addEventListener('abort', abortHandler);
        
        return cleanup;
      },
      
      cancel() {
        console.log('[MIYOMI Stream] Client disconnected');
      }
    });

    return new Response(stream, { headers });

  } catch (error) {
    console.error('[MIYOMI Stream] Setup error:', error);
    return NextResponse.json(
      { error: 'Stream setup failed' },
      { status: 500 }
    );
  }
}

// POST /api/miyomi/market-stream - Trigger manual market update
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const body = await request.json();
    const { market_ids } = body;

    // Get current picks to update
    const { data: picks, error } = await supabase
      .from('miyomi_picks')
      .select('*')
      .eq('status', 'LIVE')
      .in('market_id', market_ids || []);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch picks' }, { status: 500 });
    }

    // Generate updates for these specific markets
    const updates = await generateSpecificMarketUpdates(picks || []);

    // Update database with new prices and PnL calculations
    for (const update of updates) {
      await updatePickPerformance(update);
    }

    return NextResponse.json({
      success: true,
      updates_count: updates.length,
      message: 'Market updates processed'
    });

  } catch (error) {
    console.error('[MIYOMI Stream] Manual update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// Generate simulated market updates
async function generateMarketUpdates() {
  try {
    const supabase = await getSupabase();
    // Get active picks from database
    const { data: picks, error } = await supabase
      .from('miyomi_picks')
      .select('*')
      .eq('status', 'LIVE')
      .limit(20);

    if (error || !picks) {
      console.error('Failed to fetch picks for updates:', error);
      return [];
    }

    // Generate price updates for each pick
    const updates = picks.map(pick => {
      const currentPrice = pick.current_price || pick.consensus_price || pick.miyomi_price;
      
      // Simulate realistic price movement (smaller for established positions)
      const volatility = 0.015; // 1.5% volatility
      const drift = (Math.random() - 0.5) * volatility;
      const noise = (Math.random() - 0.5) * 0.005; // Small random walk
      
      const newPrice = Math.max(0.01, Math.min(0.99, currentPrice + drift + noise));
      
      // Calculate PnL based on position
      let pnl = 0;
      if (pick.position === 'YES') {
        pnl = ((newPrice - pick.miyomi_price) / pick.miyomi_price) * 100;
      } else if (pick.position === 'NO') {
        pnl = ((pick.miyomi_price - newPrice) / pick.miyomi_price) * 100;
      }

      return {
        market_id: pick.market_id,
        pick_id: pick.id,
        current_price: newPrice,
        price_change: newPrice - currentPrice,
        price_change_percent: ((newPrice - currentPrice) / currentPrice) * 100,
        pnl: pnl,
        volume: Math.floor(Math.random() * 50000) + 10000, // Simulated volume
        last_updated: new Date().toISOString(),
        status: determineStatus(pnl),
        market_question: pick.market_question,
        position: pick.position
      };
    });

    return updates;

  } catch (error) {
    console.error('Error generating market updates:', error);
    return [];
  }
}

// Generate updates for specific markets
async function generateSpecificMarketUpdates(picks: any[]) {
  return picks.map(pick => {
    const currentPrice = pick.current_price || pick.consensus_price || pick.miyomi_price;
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const newPrice = Math.max(0.01, Math.min(0.99, currentPrice + change));
    
    let pnl = 0;
    if (pick.position === 'YES') {
      pnl = ((newPrice - pick.miyomi_price) / pick.miyomi_price) * 100;
    } else if (pick.position === 'NO') {
      pnl = ((pick.miyomi_price - newPrice) / pick.miyomi_price) * 100;
    }

    return {
      market_id: pick.market_id,
      pick_id: pick.id,
      current_price: newPrice,
      pnl: pnl,
      last_updated: new Date().toISOString(),
      status: determineStatus(pnl)
    };
  });
}

// Update pick performance in database
async function updatePickPerformance(update: any) {
  try {
    const supabase = await getSupabase();
    // Update performance table
    await supabase
      .from('miyomi_performance')
      .upsert({
        pick_id: update.pick_id,
        current_price: update.current_price,
        pnl: update.pnl,
        pnl_percent: update.pnl,
        status: update.status,
        last_updated: update.last_updated
      }, { onConflict: 'pick_id' });

    // Update pick current_price if needed
    await supabase
      .from('miyomi_picks')
      .update({ current_price: update.current_price })
      .eq('id', update.pick_id);

  } catch (error) {
    console.error('Error updating pick performance:', error);
  }
}

// Determine pick status based on PnL
function determineStatus(pnl: number): string {
  // For demo purposes, use thresholds
  if (pnl > 20) return 'WIN';
  if (pnl < -15) return 'LOSS';
  return 'LIVE';
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}