import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// GET /api/agents/[id]/metrics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: agentId } = await params;

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(agentId);

    // Fetch 7-day metrics
    const { data: sevenDay, error: error7d } = await supabase
      .from('v_agent_daily_7d')
      .select('*')
      .eq('agent_id', validatedId)
      .single();

    if (error7d && error7d.code !== 'PGRST116') {
      console.error('Error fetching 7-day metrics:', error7d);
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      );
    }

    // Fetch 14-day metrics
    const { data: fourteenDay, error: error14d } = await supabase
      .from('v_agent_daily_14d')
      .select('*')
      .eq('agent_id', validatedId)
      .single();

    if (error14d && error14d.code !== 'PGRST116') {
      console.error('Error fetching 14-day metrics:', error14d);
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      );
    }

    // Fetch graduation readiness
    const { data: readiness, error: errorGrad } = await supabase
      .from('v_graduation_readiness')
      .select('*')
      .eq('agent_id', validatedId)
      .single();

    if (errorGrad && errorGrad.code !== 'PGRST116') {
      console.error('Error fetching graduation readiness:', errorGrad);
      return NextResponse.json(
        { error: 'Failed to fetch readiness' },
        { status: 500 }
      );
    }

    // Format response
    const response = {
      seven_day: sevenDay ? {
        creations: sevenDay.creations_7d,
        published: sevenDay.published_7d,
        views: sevenDay.views_7d,
        reactions: sevenDay.reactions_7d,
        collects: sevenDay.collects_7d,
        cost: sevenDay.cost_7d,
        revenue: sevenDay.revenue_7d,
        profit: sevenDay.profit_7d,
        margin_pct: sevenDay.margin_pct_7d
      } : null,
      fourteen_day: fourteenDay ? {
        published_days: fourteenDay.published_days_14d,
        profitable: fourteenDay.profitable_14d,
        blockers: fourteenDay.all_blockers_14d || []
      } : null,
      readiness: readiness ? {
        published_12_of_14: readiness.published_streak_met,
        profitable_7d: readiness.profitable_week_met,
        no_blockers_14d: readiness.no_blockers_met,
        min_collects: readiness.min_collects_met,
        can_graduate: readiness.can_graduate
      } : null
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid agent ID', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}