import { NextRequest, NextResponse } from 'next/server';
import { AbrahamService } from '@/lib/agents/abraham-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creationId, voterId } = body;
    
    // Validate required fields
    if (!creationId || !voterId) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'Both creationId and voterId are required',
        required: ['creationId', 'voterId']
      }, { status: 400 });
    }
    
    console.log('[Abraham Tournament Vote API] Processing vote:', { creationId, voterId });
    
    // Submit vote through Abraham service
    const voteResult = await AbrahamService.submitVote(creationId, voterId);
    
    if (!voteResult.success) {
      return NextResponse.json({
        error: 'Vote submission failed',
        message: voteResult.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      vote: {
        creationId,
        voterId,
        newVoteCount: voteResult.newVoteCount,
        timestamp: new Date().toISOString()
      },
      message: voteResult.message
    });
    
  } catch (error) {
    console.error('[Abraham Tournament Vote API] Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to process vote submission'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve voting statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creationId = searchParams.get('creationId');
    
    if (!creationId) {
      return NextResponse.json({
        error: 'Missing creationId parameter',
        message: 'creationId query parameter is required'
      }, { status: 400 });
    }
    
    // TODO: Implement actual vote statistics retrieval
    // For now, return mock statistics
    const mockStats = {
      creationId,
      totalVotes: Math.floor(Math.random() * 1000) + 100,
      voterCount: Math.floor(Math.random() * 300) + 50,
      averageScore: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      lastVoteAt: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Within last hour
      statistics: {
        hourlyVotes: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          votes: Math.floor(Math.random() * 50)
        })),
        topVoterRegions: [
          { region: 'North America', percentage: 45 },
          { region: 'Europe', percentage: 32 },
          { region: 'Asia', percentage: 18 },
          { region: 'Other', percentage: 5 }
        ]
      }
    };
    
    return NextResponse.json({
      voting: mockStats,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'tournament-api'
      }
    });
    
  } catch (error) {
    console.error('[Abraham Tournament Vote API] Error fetching stats:', error);
    return NextResponse.json({
      error: 'Failed to fetch voting statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}