import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test 1: Check if we can connect to agent_archives table
    const { data: archives, error: archivesError } = await supabase
      .from('agent_archives')
      .select('id, agent_id, title, created_date')
      .limit(5);

    if (archivesError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch agent archives',
        details: archivesError.message,
        hint: archivesError.hint
      }, { status: 500 });
    }

    // Test 2: Count tables (use tables that actually exist)
    const { count: archivesCount } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true });

    // Test if other tables exist
    const { count: critiquesCount } = await supabase
      .from('critiques')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ 
      success: true,
      data: {
        archives: archives || [],
        archiveCount: archives?.length || 0,
        archivesTotal: archivesCount,
        critiquesTotal: critiquesCount,
        connectionStatus: 'Connected successfully!',
        schemaDetected: 'agent_archives schema (works-based)'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}