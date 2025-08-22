import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/critiques - Create critique (auto-curates on INCLUDE)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { work_id, critic = 'ninabot', verdict, scores, rationale, flags } = body;

    if (!work_id || !verdict) {
      return NextResponse.json(
        { error: 'Missing required fields: work_id, verdict' },
        { status: 400 }
      );
    }

    if (!['INCLUDE', 'MAYBE', 'EXCLUDE'].includes(verdict)) {
      return NextResponse.json(
        { error: 'Invalid verdict. Must be INCLUDE, MAYBE, or EXCLUDE' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify work exists
    const { data: work } = await supabase
      .from('works')
      .select('id')
      .eq('id', work_id)
      .single();

    if (!work) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    // Create critique
    const { data: critique, error } = await supabase
      .from('critiques')
      .insert({
        work_id,
        critic,
        verdict,
        scores,
        rationale,
        flags
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-curate on INCLUDE (handled by trigger, but we can do it here too)
    if (verdict === 'INCLUDE') {
      await supabase
        .from('works')
        .update({ state: 'curated' })
        .eq('id', work_id)
        .eq('state', 'created');
    }

    return NextResponse.json(critique, { status: 201 });
  } catch (error) {
    console.error('Error creating critique:', error);
    return NextResponse.json(
      { error: 'Failed to create critique' },
      { status: 500 }
    );
  }
}

// GET /api/critiques - List critiques
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const work_id = searchParams.get('work_id');
    const critic = searchParams.get('critic');
    const verdict = searchParams.get('verdict');

    const supabase = await createClient();

    let query = supabase
      .from('critiques')
      .select(`
        *,
        work:works(
          id,
          agent_id,
          media_url,
          state
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (work_id) {
      query = query.eq('work_id', work_id);
    }
    if (critic) {
      query = query.eq('critic', critic);
    }
    if (verdict) {
      query = query.eq('verdict', verdict);
    }

    const { data: critiques, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      critiques: critiques || [],
      count: critiques?.length || 0
    });
  } catch (error) {
    console.error('Error fetching critiques:', error);
    return NextResponse.json(
      { error: 'Failed to fetch critiques' },
      { status: 500 }
    );
  }
}