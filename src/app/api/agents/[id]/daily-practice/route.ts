import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  CreateDailyPracticeSchema,
  UpdateDailyPracticeSchema,
  type DailyPracticeEntry 
} from '@/lib/validation/schemas';
import { z } from 'zod';

// GET /api/agents/[id]/daily-practice?since=YYYY-MM-DD&limit=7
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: agentId } = await params;
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const since = searchParams.get('since') || 
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const limit = parseInt(searchParams.get('limit') || '7', 10);

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(agentId);

    // Fetch daily practice entries
    const { data, error } = await supabase
      .from('daily_practice_entries')
      .select('*')
      .eq('agent_id', validatedId)
      .gte('date', since)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching daily practice:', error);
      return NextResponse.json(
        { error: 'Failed to fetch daily practice entries' },
        { status: 500 }
      );
    }

    // Also fetch aggregated metrics
    const { data: metrics } = await supabase
      .from('v_agent_daily_7d')
      .select('*')
      .eq('agent_id', validatedId)
      .single();

    return NextResponse.json({
      entries: data || [],
      metrics: metrics || null
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid agent ID', details: error.errors },
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

// POST /api/agents/[id]/daily-practice
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: agentId } = await params;
    const body = await request.json();

    // Validate input
    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(agentId);
    const validatedData = CreateDailyPracticeSchema.parse(body);

    // Default to today if no date provided
    const date = validatedData.date || new Date().toISOString().split('T')[0];

    // Use the upsert function we created in SQL
    const { data, error } = await supabase.rpc('upsert_daily_practice', {
      p_agent_id: validatedId,
      p_date: date,
      p_theme: validatedData.theme || null,
      p_creations_count: validatedData.creations_count,
      p_published_count: validatedData.published_count,
      p_views: validatedData.views,
      p_reactions: validatedData.reactions,
      p_collects: validatedData.collects,
      p_cost_usdc: validatedData.cost_usdc,
      p_revenue_usdc: validatedData.revenue_usdc,
      p_note: validatedData.note || null,
      p_blockers: validatedData.blockers
    });

    if (error) {
      console.error('Error upserting daily practice:', error);
      return NextResponse.json(
        { error: 'Failed to save daily practice entry' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
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

// PATCH /api/agents/[id]/daily-practice (for incremental updates)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: agentId } = await params;
    const body = await request.json();

    // Validate input
    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(agentId);
    
    // Special handling for incremental operations
    const operation = body.operation; // 'increment_published', 'add_blocker', etc.
    const date = body.date || new Date().toISOString().split('T')[0];

    if (operation === 'increment_published') {
      // Increment published count for today
      const { data: current } = await supabase
        .from('daily_practice_entries')
        .select('published_count')
        .eq('agent_id', validatedId)
        .eq('date', date)
        .single();

      const newCount = (current?.published_count || 0) + 1;

      const { data, error } = await supabase
        .from('daily_practice_entries')
        .upsert({
          agent_id: validatedId,
          date: date,
          published_count: newCount
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (operation === 'add_blocker') {
      const blocker = body.blocker;
      if (!blocker) {
        return NextResponse.json(
          { error: 'Blocker text required' },
          { status: 400 }
        );
      }

      // Add blocker to today's entry
      const { data: current } = await supabase
        .from('daily_practice_entries')
        .select('blockers')
        .eq('agent_id', validatedId)
        .eq('date', date)
        .single();

      const existingBlockers = current?.blockers || [];
      const newBlockers = [...existingBlockers, blocker];

      const { data, error } = await supabase
        .from('daily_practice_entries')
        .upsert({
          agent_id: validatedId,
          date: date,
          blockers: newBlockers
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Default: update with provided fields
    const validatedData = UpdateDailyPracticeSchema.parse(body);
    const { data, error } = await supabase
      .from('daily_practice_entries')
      .update(validatedData)
      .eq('agent_id', validatedId)
      .eq('date', date)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
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