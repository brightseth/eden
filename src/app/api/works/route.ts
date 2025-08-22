import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/works - List/filter works
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent_id = searchParams.get('agent_id');
    const state = searchParams.get('state');
    const limit = parseInt(searchParams.get('limit') || '50');
    const after = searchParams.get('after');

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('works')
      .select(`
        *,
        tags(*),
        critiques(*),
        collects(count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply filters
    if (agent_id) {
      query = query.eq('agent_id', agent_id.toLowerCase());
    }
    if (state && ['created', 'curated', 'published'].includes(state)) {
      query = query.eq('state', state);
    }
    if (after) {
      query = query.gt('created_at', after);
    }

    const { data: works, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      works: works || [],
      count: works?.length || 0
    });
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(
      { error: 'Failed to fetch works' },
      { status: 500 }
    );
  }
}

// POST /api/works - Create work (enqueues Tagger)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_id, day, media_url, kind = 'image', prompt, notes } = body;

    if (!agent_id || typeof day !== 'number' || !media_url) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_id, day, media_url' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify agent exists
    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('id', agent_id.toLowerCase())
      .single();

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Create work
    const { data: work, error } = await supabase
      .from('works')
      .insert({
        agent_id: agent_id.toLowerCase(),
        day,
        media_url,
        kind,
        prompt,
        notes,
        state: 'created'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Work already exists for this agent and day' },
          { status: 409 }
        );
      }
      throw error;
    }

    // Queue tagger job (will be handled by trigger)
    // The auto_queue_work_tagger trigger will handle this automatically

    // Update agent's day_count if needed
    await supabase
      .from('agents')
      .update({ day_count: day })
      .eq('id', agent_id.toLowerCase())
      .gt('day_count', day);

    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    console.error('Error creating work:', error);
    return NextResponse.json(
      { error: 'Failed to create work' },
      { status: 500 }
    );
  }
}