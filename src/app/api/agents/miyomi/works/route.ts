import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status'); // LIVE, WIN, LOSS, PENDING
    const category = searchParams.get('category'); // politics, finance, sports, etc.
    const platform = searchParams.get('platform'); // KALSHI, POLYMARKET, etc.
    const sort = searchParams.get('sort') || 'date_desc';

    console.log('[MIYOMI Works] GET request:', { limit, offset, status, category, platform, sort });

    // Build query - using new miyomi_picks table schema
    let query = supabase
      .from('miyomi_picks')
      .select(`
        id,
        timestamp,
        market_question,
        market_id,
        position,
        miyomi_price,
        consensus_price,
        current_price,
        status,
        platform,
        category,
        reasoning,
        post,
        created_at,
        pnl,
        roi,
        confidence,
        edge,
        video_url,
        analysis_url,
        tags
      `);

    // Apply filters
    if (status) {
      query = query.eq('status', status.toUpperCase());
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (platform) {
      query = query.eq('platform', platform.toUpperCase());
    }

    // Apply sorting
    const [sortField, sortOrder] = sort.split('_');
    if (sortField === 'date') {
      query = query.order('timestamp', { ascending: sortOrder === 'asc' });
    } else if (sortField === 'performance') {
      query = query.order('pnl', { ascending: sortOrder === 'asc', nullsFirst: false });
    } else {
      query = query.order('timestamp', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: picks, error, count } = await query;

    if (error) {
      console.error('[MIYOMI Works] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch works', details: error.message },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('miyomi_picks')
      .select('*', { count: 'exact', head: true });

    // Transform picks to Academy "works" format
    const transformedWorks = (picks || []).map(pick => ({
      id: pick.id,
      agent_id: 'miyomi',
      archive_type: 'prediction', // Using domain-specific type
      title: generateWorkTitle(pick),
      description: pick.reasoning || `${pick.position} position on ${pick.market_question}`,
      
      // Visual representation (could be chart/analysis image)
      image_url: pick.analysis_url || generateAnalysisUrl(pick),
      thumbnail_url: pick.analysis_url || generateAnalysisUrl(pick),
      
      // Temporal data
      created_date: pick.timestamp,
      archive_number: null, // Picks don't have sequential numbers
      
      // Metadata - rich prediction context
      metadata: {
        // Market details
        market_question: pick.market_question,
        market_id: pick.market_id,
        platform: pick.platform,
        category: pick.category,
        
        // Position & pricing
        position: pick.position,
        confidence: pick.confidence,
        edge: pick.edge,
        entry_price: pick.miyomi_price,
        consensus_price: pick.consensus_price,
        current_price: pick.current_price,
        
        // Performance
        status: pick.status,
        pnl: pick.pnl,
        roi: pick.roi,
        
        // Content
        reasoning: pick.reasoning,
        social_post: pick.post,
        video_url: pick.video_url,
        tags: pick.tags || []
      },
      
      // Classification
      tags: [
        pick.platform?.toLowerCase(),
        pick.category,
        pick.position?.toLowerCase(),
        pick.status?.toLowerCase(),
        ...(pick.tags || [])
      ].filter(Boolean),
      
      // Performance indicators for works view
      performance_indicator: getPerformanceIndicator(pick.status, pick.pnl),
      trainer_id: null,
      
      // Eden-specific
      curated_for: [], // Could be curated for specific collections later
      source_url: pick.analysis_url,
      created_by_user: null
    }));

    console.log(`[MIYOMI Works] Returning ${transformedWorks.length} works (${totalCount} total picks)`);

    return NextResponse.json({
      works: transformedWorks,
      total: totalCount || 0,
      limit,
      offset,
      filters: {
        status,
        category, 
        platform
      },
      sort,
      source: 'miyomi_predictions',
      agent_info: {
        name: 'MIYOMI',
        type: 'prediction_oracle',
        specialties: ['market_prediction', 'contrarian_analysis', 'vibes_based_trading']
      }
    });

  } catch (error) {
    console.error('[MIYOMI Works] GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for work transformation

function generateWorkTitle(pick: any): string {
  const market = pick.market_question || pick.market || 'Unknown Market';
  const position = pick.position;
  const confidence = pick.confidence ? Math.round(pick.confidence * 100) : pick.miyomi_price;
  
  // Generate engaging titles based on MIYOMI's personality
  const templates = [
    `${position} on ${market} (${confidence}% confidence)`,
    `Market Prediction: ${market}`,
    `Contrarian Take: ${position} - ${market}`,
    `Oracle Drop: ${market} Analysis`,
    `Vibes Check: ${market} going ${position}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateAnalysisUrl(pick: any): string {
  // Generate placeholder analysis visualization URL
  // In production, this could generate actual chart URLs
  const platform = pick.platform?.toLowerCase() || 'market';
  const position = pick.position?.toLowerCase() || 'unknown';
  
  return `/api/miyomi/analysis-chart?id=${pick.id}&platform=${platform}&position=${position}`;
}

function getPerformanceIndicator(status: string, pnl: number | null): string {
  if (status === 'WIN') return '🟢 WIN';
  if (status === 'LOSS') return '🔴 LOSS'; 
  if (status === 'LIVE') {
    if (pnl === null || pnl === 0) return '🟡 LIVE';
    return pnl > 0 ? '🟢 WINNING' : '🔴 LOSING';
  }
  if (status === 'PENDING') return '⚪ PENDING';
  return '⚫ UNKNOWN';
}