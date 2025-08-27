import { NextRequest, NextResponse } from 'next/server';
import { AbrahamService } from '@/lib/agents/abraham-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    console.log('[Abraham Tournament Concepts API] Fetching concepts:', { phase, limit, offset });
    
    // Get tournament status from service
    const covenantStatus = await AbrahamService.getCovenantStatus();
    
    if (!covenantStatus.tournament) {
      return NextResponse.json({
        error: 'Tournament not active',
        message: 'No active tournament found'
      }, { status: 404 });
    }
    
    const tournament = covenantStatus.tournament;
    let concepts;
    let total;
    
    // Filter concepts by phase
    switch (phase) {
      case 'concepts':
        concepts = tournament.concepts.slice(offset, offset + limit);
        total = tournament.concepts.length;
        break;
      case 'semifinals':
        concepts = tournament.semifinalists.slice(offset, offset + limit);
        total = tournament.semifinalists.length;
        break;
      case 'finals':
        concepts = tournament.finalists.slice(offset, offset + limit);
        total = tournament.finalists.length;
        break;
      case 'winner':
        concepts = tournament.winner ? [tournament.winner] : [];
        total = concepts.length;
        break;
      default: // 'all'
        const allConcepts = [
          ...tournament.concepts,
          ...tournament.semifinalists,
          ...tournament.finalists,
          ...(tournament.winner ? [tournament.winner] : [])
        ];
        concepts = allConcepts.slice(offset, offset + limit);
        total = allConcepts.length;
        break;
    }
    
    return NextResponse.json({
      concepts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      tournament: {
        currentDay: tournament.currentDay,
        phase: tournament.phase,
        nextPhaseAt: tournament.nextPhaseAt
      },
      metadata: {
        timestamp: new Date().toISOString(),
        covenantDay: covenantStatus.metrics.completedDays,
        source: 'tournament-api'
      }
    });
    
  } catch (error) {
    console.error('[Abraham Tournament Concepts API] Error:', error);
    return NextResponse.json({
      error: 'Failed to fetch concepts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint for submitting new concept (for future tournament creation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { concept, metadata } = body;
    
    if (!concept) {
      return NextResponse.json({
        error: 'Missing concept',
        message: 'Concept field is required'
      }, { status: 400 });
    }
    
    console.log('[Abraham Tournament Concepts API] Submitting new concept:', { concept });
    
    // TODO: Implement actual concept submission logic
    // This would typically:
    // 1. Validate concept against current tournament rules
    // 2. Generate or assign concept ID
    // 3. Store in database with proper metadata
    // 4. Trigger any necessary processing (image generation, etc.)
    
    const mockConcept = {
      id: `concept-${Date.now()}`,
      concept,
      imageUrl: `/api/placeholder/400/400`,
      votes: 0,
      stage: 'concept' as const,
      createdAt: new Date().toISOString(),
      metadata: {
        prompt: metadata?.prompt || 'Generated concept',
        style: metadata?.style || 'Abstract Expressionism',
        technique: metadata?.technique || 'GAN synthesis',
        submittedBy: 'system', // TODO: Get from authentication
        ...metadata
      }
    };
    
    return NextResponse.json({
      success: true,
      concept: mockConcept,
      message: 'Concept submitted successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('[Abraham Tournament Concepts API] Error creating concept:', error);
    return NextResponse.json({
      error: 'Failed to submit concept',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}