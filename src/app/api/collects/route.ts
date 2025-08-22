import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/collects - Create collect record (stub)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { work_id, collector, amount = 0.01 } = body;

    if (!work_id || !collector) {
      return NextResponse.json(
        { error: 'Missing required fields: work_id, collector' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify work exists and is published
    const { data: work } = await supabase
      .from('works')
      .select('id, state')
      .eq('id', work_id)
      .single();

    if (!work) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    if (work.state !== 'published') {
      return NextResponse.json(
        { error: 'Work must be published before collecting' },
        { status: 403 }
      );
    }

    // Create collect record
    const { data: collect, error } = await supabase
      .from('collects')
      .insert({
        work_id,
        collector,
        amount
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(collect, { status: 201 });
  } catch (error) {
    console.error('Error creating collect:', error);
    return NextResponse.json(
      { error: 'Failed to create collect' },
      { status: 500 }
    );
  }
}

// GET /api/collects - List collects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const work_id = searchParams.get('work_id');
    const collector = searchParams.get('collector');

    const supabase = await createClient();

    let query = supabase
      .from('collects')
      .select(`
        *,
        work:works(
          id,
          agent_id,
          media_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (work_id) {
      query = query.eq('work_id', work_id);
    }
    if (collector) {
      query = query.eq('collector', collector);
    }

    const { data: collects, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      collects: collects || [],
      count: collects?.length || 0,
      total_value: collects?.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) || 0
    });
  } catch (error) {
    console.error('Error fetching collects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collects' },
      { status: 500 }
    );
  }
}