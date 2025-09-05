import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/config/flags';
import { TournamentComparisonSchema, CuratorAgent } from '@/lib/types/curation';

interface TournamentBracket {
  id: string;
  round: number;
  workA: { id: string; title: string; score?: number };
  workB: { id: string; title: string; score?: number };
  winnerId?: string;
  reasoning?: string;
}

interface TournamentSession {
  id: string;
  name: string;
  curator: CuratorAgent;
  status: 'setup' | 'active' | 'completed';
  totalRounds: number;
  currentRound: number;
  brackets: TournamentBracket[];
  finalWinner?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock tournament sessions storage
const mockTournamentSessions: TournamentSession[] = [];

function createTournamentBrackets(workIds: string[], curator: CuratorAgent): TournamentBracket[] {
  if (workIds.length < 4 || !isPowerOfTwo(workIds.length)) {
    throw new Error('Tournament requires a power of 2 number of works (4, 8, 16, etc.)');
  }

  const brackets: TournamentBracket[] = [];
  let bracketId = 1;

  // Create first round brackets (pair up all works)
  for (let i = 0; i < workIds.length; i += 2) {
    brackets.push({
      id: `bracket-${bracketId++}`,
      round: 1,
      workA: { id: workIds[i], title: `Work ${workIds[i].slice(-4)}` },
      workB: { id: workIds[i + 1], title: `Work ${workIds[i + 1].slice(-4)}` },
    });
  }

  // Create subsequent round brackets (empty for now)
  let currentRoundWorks = workIds.length;
  let round = 2;
  
  while (currentRoundWorks > 2) {
    currentRoundWorks = currentRoundWorks / 2;
    for (let i = 0; i < currentRoundWorks; i++) {
      brackets.push({
        id: `bracket-${bracketId++}`,
        round,
        workA: { id: 'TBD', title: 'TBD' },
        workB: { id: 'TBD', title: 'TBD' },
      });
    }
    round++;
  }

  return brackets;
}

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

async function simulateComparison(
  workA: { id: string; title: string },
  workB: { id: string; title: string },
  curator: CuratorAgent
): Promise<{ winnerId: string; reasoning: string }> {
  // Simulate AI comparison delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock comparison logic - in production this would use actual AI analysis
  const winner = Math.random() > 0.5 ? workA : workB;
  const loser = winner === workA ? workB : workA;

  const reasoningTemplates = {
    sue: [
      `${winner.title} demonstrates superior cultural positioning and critical depth compared to ${loser.title}. The conceptual framework is more sophisticated and the execution shows greater awareness of contemporary art discourse.`,
      `While both works show merit, ${winner.title} exhibits stronger innovation and cultural relevance. The curatorial assessment favors its more rigorous approach to AI-human collaboration themes.`,
      `${winner.title} prevails due to its exceptional conceptual clarity and cultural significance. The work engages more effectively with questions of artificial consciousness and creative agency.`
    ],
    nina: [
      `${winner.title} creates a more powerful emotional connection and aesthetic impact than ${loser.title}. The visual composition and artistic execution demonstrate superior creative vision.`,
      `The aesthetic sophistication and emotional resonance of ${winner.title} makes it the clear winner. It shows more intuitive understanding of artistic beauty and creative expression.`,
      `${winner.title} succeeds in creating deeper aesthetic meaning and emotional engagement. The artistic merit and visual impact surpass those of ${loser.title}.`
    ]
  };

  const reasoning = reasoningTemplates[curator][Math.floor(Math.random() * reasoningTemplates[curator].length)];

  return {
    winnerId: winner.id,
    reasoning
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check feature flags
    if (!FEATURE_FLAGS.ART_CURATION_SYSTEM_ENABLED || !FEATURE_FLAGS.TOURNAMENT_MODE_ENABLED) {
      return NextResponse.json({
        success: false,
        error: 'Tournament mode is not enabled'
      }, { status: 403 });
    }

    const body = await request.json();
    const { workIds, curatorAgent, sessionName } = z.object({
      workIds: z.array(z.string().uuid()).min(4),
      curatorAgent: z.enum(['sue', 'nina']),
      sessionName: z.string().optional(),
    }).parse(body);

    // Validate work count is power of 2
    if (!isPowerOfTwo(workIds.length)) {
      return NextResponse.json({
        success: false,
        error: `Tournament requires a power of 2 number of works. Got ${workIds.length}, need 4, 8, 16, etc.`
      }, { status: 400 });
    }

    // Create tournament session
    const session: TournamentSession = {
      id: `tournament-${Date.now()}`,
      name: sessionName || `${curatorAgent.toUpperCase()} Tournament ${new Date().toLocaleDateString()}`,
      curator: curatorAgent,
      status: 'setup',
      totalRounds: Math.log2(workIds.length),
      currentRound: 1,
      brackets: createTournamentBrackets(workIds, curatorAgent),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save session (in production, save to database)
    mockTournamentSessions.push(session);

    return NextResponse.json({
      success: true,
      data: {
        session,
        message: `Tournament created with ${workIds.length} works in ${session.totalRounds} rounds`
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid tournament request',
        details: error.errors
      }, { status: 400 });
    }

    console.error('[API] Tournament creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create tournament'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check feature flags
    if (!FEATURE_FLAGS.ART_CURATION_SYSTEM_ENABLED || !FEATURE_FLAGS.TOURNAMENT_MODE_ENABLED) {
      return NextResponse.json({
        success: false,
        error: 'Tournament mode is not enabled'
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Get specific tournament session
      const session = mockTournamentSessions.find(s => s.id === sessionId);
      if (!session) {
        return NextResponse.json({
          success: false,
          error: 'Tournament session not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: session
      });
    }

    // Get all tournament sessions
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const status = searchParams.get('status');

    let filteredSessions = [...mockTournamentSessions];
    
    if (status) {
      filteredSessions = filteredSessions.filter(s => s.status === status);
    }

    // Sort by creation date, newest first
    filteredSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        sessions: paginatedSessions,
        meta: {
          total: filteredSessions.length,
          page,
          limit,
          totalPages: Math.ceil(filteredSessions.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('[API] Tournament GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tournaments'
    }, { status: 500 });
  }
}

// Simulate tournament round endpoint
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action } = z.object({
      sessionId: z.string().uuid(),
      action: z.enum(['advance', 'reset', 'complete']),
    }).parse(body);

    const session = mockTournamentSessions.find(s => s.id === sessionId);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Tournament session not found'
      }, { status: 404 });
    }

    if (action === 'advance' && session.status === 'setup') {
      // Start the tournament by running first round comparisons
      session.status = 'active';
      
      const firstRoundBrackets = session.brackets.filter(b => b.round === 1);
      
      // Simulate all first round comparisons
      for (const bracket of firstRoundBrackets) {
        const comparison = await simulateComparison(bracket.workA, bracket.workB, session.curator);
        bracket.winnerId = comparison.winnerId;
        bracket.reasoning = comparison.reasoning;
      }

      session.updatedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('[API] Tournament advance error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to advance tournament'
    }, { status: 500 });
  }
}