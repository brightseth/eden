import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test 1: Check if we can connect
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, name, current_stage, current_day')
      .limit(5);

    if (agentsError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch agents',
        details: agentsError.message,
        hint: agentsError.hint
      }, { status: 500 });
    }

    // Test 2: Count tables
    const { count: programsCount } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true });

    const { count: metricsCount } = await supabase
      .from('daily_metrics')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ 
      success: true,
      data: {
        agents: agents || [],
        agentCount: agents?.length || 0,
        programsCount,
        metricsCount,
        connectionStatus: 'Connected successfully!'
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