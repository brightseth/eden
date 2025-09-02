import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filters
    const agent_id = searchParams.get('agent_id');
    const type = searchParams.get('type');
    const series = searchParams.get('series');
    const subject = searchParams.get('subject');
    const min_print = parseFloat(searchParams.get('min_print') || '0');
    const artifact_risk = searchParams.get('artifact_risk');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const state = searchParams.get('state') || 'created';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('works')
      .select(`
        *,
        tags (
          taxonomy,
          features,
          quality,
          routing,
          confidence
        ),
        critiques (
          id,
          critic,
          verdict,
          created_at
        )
      `)
      .eq('state', state)
      .order('captured_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (agent_id) {
      query = query.eq('agent_id', agent_id);
    }

    // For tag-based filters, we need to filter in JS after fetching
    // (Supabase doesn't support JSONB filtering well in joins)
    const { data: works, error } = await query;

    if (error) {
      throw error;
    }

    // Apply JSON filters
    let filteredWorks = works || [];

    if (type) {
      filteredWorks = filteredWorks.filter(w => 
        w.tags?.taxonomy?.type === type
      );
    }

    if (series) {
      filteredWorks = filteredWorks.filter(w => 
        w.tags?.taxonomy?.series === series
      );
    }

    if (subject) {
      filteredWorks = filteredWorks.filter(w => 
        w.tags?.taxonomy?.subject?.includes(subject)
      );
    }

    if (min_print > 0) {
      filteredWorks = filteredWorks.filter(w => {
        const readiness = parseFloat(w.tags?.quality?.print_readiness || '0');
        return readiness >= min_print;
      });
    }

    if (artifact_risk) {
      filteredWorks = filteredWorks.filter(w => 
        w.tags?.quality?.artifact_risk === artifact_risk
      );
    }

    if (date_from) {
      const fromDate = new Date(date_from);
      filteredWorks = filteredWorks.filter(w => {
        const capturedAt = w.captured_at ? new Date(w.captured_at) : new Date(w.created_at);
        return capturedAt >= fromDate;
      });
    }

    if (date_to) {
      const toDate = new Date(date_to);
      toDate.setHours(23, 59, 59, 999);
      filteredWorks = filteredWorks.filter(w => {
        const capturedAt = w.captured_at ? new Date(w.captured_at) : new Date(w.created_at);
        return capturedAt <= toDate;
      });
    }

    // Get filter options for UI
    const { data: allTags } = await supabase
      .from('tags')
      .select('taxonomy')
      .not('taxonomy', 'is', null);

    // Extract unique values for filters
    const filterOptions = {
      types: [...new Set(allTags?.map(t => t.taxonomy?.type).filter(Boolean))],
      series: [...new Set(allTags?.map(t => t.taxonomy?.series).filter(Boolean))],
      subjects: [...new Set(allTags?.flatMap(t => t.taxonomy?.subject || []).filter(Boolean))],
    };

    return NextResponse.json({
      works: filteredWorks,
      total: filteredWorks.length,
      filters: filterOptions,
      query: {
        agent_id,
        type,
        series,
        subject,
        min_print,
        artifact_risk,
        date_from,
        date_to,
        state,
      },
    });

  } catch (error: any) {
    console.error('Inbox API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inbox' },
      { status: 500 }
    );
  }
}