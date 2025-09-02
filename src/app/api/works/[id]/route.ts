import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}
// DELETE /api/works/[id] - Delete a work
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id: workId } = await params;
    
    if (!workId) {
  return NextResponse.json(
        { error: 'Work ID required' },
        { status: 400 }
      );
    }
    
    const supabase = await getSupabase();
    
    // Delete the work (cascades to related records)
    const { error } = await supabase
      .from('works')
      .delete()
      .eq('id', workId);
    
    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete work' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json(
      { error: 'Failed to delete work' },
      { status: 500 }
    );
  }
}