import { NextResponse } from 'next/server';
import { AbrahamService } from '@/lib/agents/abraham-service';

export async function GET() {
  try {
    console.log('[Abraham Tournament Status API] Fetching tournament status');
    
    const covenantStatus = await AbrahamService.getCovenantStatus();
    
    if (!covenantStatus.tournament) {
      return NextResponse.json({
        error: 'Tournament not active',
        message: 'Tournament system is not currently active'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      tournament: covenantStatus.tournament,
      metadata: {
        lastUpdated: new Date().toISOString(),
        source: 'abraham-service',
        covenantDay: covenantStatus.metrics.completedDays
      }
    });
    
  } catch (error) {
    console.error('[Abraham Tournament Status API] Error:', error);
    return NextResponse.json({
      error: 'Failed to fetch tournament status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}