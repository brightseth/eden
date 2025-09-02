import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return getSupabase();
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// POST /api/works/[id]/publish - Publish a work
export async function POST(
  request: NextRequest,
  { params }: any) {
  try {
  const { id } = await params;
    const supabase = await getSupabase();

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