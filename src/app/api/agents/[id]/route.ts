import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/agents/[id] - Get agent with all works
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    
    // Get agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id.toLowerCase())
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Get all works for this agent
    const { data: works, error: worksError } = await supabase
      .from('works')
      .select(`
        *,
        tags(*),
        critiques(*)
      `)
      .eq('agent_id', id.toLowerCase())
      .order('day', { ascending: false });

    if (worksError) throw worksError;

    // Check if agent has graduated to Spirit
    const { data: spirit } = await supabase
      .from('spirits')
      .select('*')
      .eq('agent_id', id.toLowerCase())
      .single();

    return NextResponse.json({
      ...agent,
      works: works || [],
      spirit: spirit || null,
      work_count: works?.length || 0
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

// PATCH /api/agents/[id] - Update agent (mainly for status changes)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, day_count } = body;

    const supabase = await createClient();

    // Build update object
    const updates: any = {};
    if (status && ['training', 'graduating', 'spirit'].includes(status)) {
      updates.status = status;
    }
    if (typeof day_count === 'number') {
      updates.day_count = day_count;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    // Update agent
    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', id.toLowerCase())
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    // If graduating to spirit, create spirit record
    if (status === 'spirit') {
      const symbol = `$${id.toUpperCase()}`;
      await supabase
        .from('spirits')
        .upsert({
          agent_id: id.toLowerCase(),
          symbol,
          supply: 1000000, // Default 1M supply
          treasury: 100000, // 10% treasury
          holders: 1
        })
        .select();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}