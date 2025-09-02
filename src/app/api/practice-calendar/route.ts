import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return getSupabase();
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent_id = searchParams.get('agent_id');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    if (!agent_id || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: agent_id, from, to' },
        { status: 400 }
      );
    }
    
    const supabase = await getSupabase();
    
    // Fetch all works for the agent in date range
    const { data: works, error } = await supabase
      .from('works')
      .select(`
        id,
        day,
        state,
        created_at,
        tags (
          quality
        ),
        critiques (
          verdict,
          score
        )
      `)
      .eq('agent_id', agent_id.toLowerCase())
      .gte('created_at', from)
      .lte('created_at', to)
      .order('day', { ascending: true });
    
    if (error) throw error;
    
    // Process works into daily stats
    const dayMap = new Map<number, any>();
    
    works?.forEach(work => {
      const day = work.day;
      const existing = dayMap.get(day) || {
        day,
        date: work.created_at,
        hasWork: true,
        state: work.state
      };
      
      // Get quality score from tags
      if (work.tags?.[0]?.quality?.print_readiness) {
        existing.qualityScore = work.tags[0].quality.print_readiness;
      }
      
      // Get verdict from critiques
      if (work.critiques?.[0]) {
        existing.verdict = work.critiques[0].verdict;
        existing.critiqueScore = work.critiques[0].score;
      }
      
      // Override state for published works
      if (work.state === 'published') {
        existing.state = 'published';
      }
      
      dayMap.set(day, existing);
    });
    
    // Convert to array
    const days = Array.from(dayMap.values());
    
    // Calculate summary stats
    const totalDays = days.length;
    const includeDays = days.filter(d => d.verdict === 'INCLUDE').length;
    const publishedDays = days.filter(d => d.state === 'published').length;
    
    return NextResponse.json({
      days,
      summary: {
        totalDays,
        includeDays,
        publishedDays,
        includeRate: totalDays > 0 ? includeDays / totalDays : 0
      }
    });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar data' },
      { status: 500 }
    );
  }
}