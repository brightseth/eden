import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const agentId = searchParams.get('agent');
  
  try {
    // Get today's drops
    let query = supabase
      .from('drops')
      .select(`
        *,
        agents (
          id,
          name,
          avatar_url,
          type
        )
      `)
      .eq('drop_date', date)
      .eq('status', 'published');
    
    if (agentId) {
      query = query.eq('agent_id', agentId);
    }
    
    const { data: drops, error } = await query
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching drops:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get drop counts for today
    const { data: stats } = await supabase
      .from('drops')
      .select('agent_id, status')
      .eq('drop_date', date);
    
    const dropStats = stats?.reduce((acc, drop) => {
      if (!acc[drop.agent_id]) {
        acc[drop.agent_id] = { total: 0, published: 0, scheduled: 0 };
      }
      acc[drop.agent_id].total++;
      if (drop.status === 'published') acc[drop.agent_id].published++;
      if (drop.status === 'scheduled') acc[drop.agent_id].scheduled++;
      return acc;
    }, {} as Record<string, { total: number; published: number; scheduled: number }>);
    
    return NextResponse.json({
      date,
      drops: drops || [],
      stats: dropStats || {},
      totalDrops: drops?.length || 0
    });
  } catch (error) {
    console.error('Error in drops route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}