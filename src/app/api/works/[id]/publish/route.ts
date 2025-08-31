import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/works/[id]/publish - Publish a work
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
  const { id } = params;
    const supabase = await createClient();

    // Get the work
    const { data: work, error: fetchError } = await supabase
      .from('works')
      .select('*, critiques(*)')
      .eq('id', id)
      .single();

    if (fetchError || !work) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    // Check if work is curated (has INCLUDE critique) or override
    const body = await request.json().catch(() => ({}));
    const override = body.override === true;

    const hasInclude = work.critiques?.some((c: any) => c.verdict === 'INCLUDE');
    
    if (work.state !== 'curated' && !hasInclude && !override) {
      return NextResponse.json(
        { error: 'Work must be curated before publishing. Use override=true to force.' },
        { status: 403 }
      );
    }

    // Update to published
    const { data: updated, error: updateError } = await supabase
      .from('works')
      .update({ state: 'published' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error publishing work:', error);
    return NextResponse.json(
      { error: 'Failed to publish work' },
      { status: 500 }
    );
  }
}