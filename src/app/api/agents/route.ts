import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/agents - List all agents with latest work and status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get all agents
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Get latest work for each agent and add avatar
    const agentsWithWork = await Promise.all(
      (agents || []).map(async (agent) => {
        const { data: latestWork } = await supabase
          .from('works')
          .select('*')
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...agent,
          avatar_url: `/agents/${agent.id}/profile.svg`,
          latest_work: latestWork
        };
      })
    );

    return NextResponse.json({
      agents: agentsWithWork,
      count: agentsWithWork.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, tagline, trainer } = body;

    if (!id || !name || !trainer) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, trainer' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('agents')
      .insert({
        id: id.toLowerCase(),
        name,
        tagline,
        trainer,
        status: 'training',
        day_count: 0
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Agent with this ID already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}