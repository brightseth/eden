import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE /api/works/[id] - Delete a work
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
  const { id: workId } = params;
    
    if (!workId) {
  const params = await props.params;
  return NextResponse.json(
        { error: 'Work ID required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
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