import { NextRequest, NextResponse } from 'next/server';
import { dailyPractice } from '@/lib/agents/bertha/daily-practice';

// GET /api/agents/bertha/daily-practice - Get daily practice status and history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    
    switch (action) {
      case 'status':
        const currentSession = dailyPractice.getCurrentSession();
        const personality = dailyPractice.getDailyPersonality();
        const recentSessions = dailyPractice.getSessionHistory().slice(-7); // Last 7 days
        
        return NextResponse.json({
          agent: 'BERTHA',
          dailyPractice: {
            motto: 'ONE PIECE EVERY DAY • REGARDLESS OF COST',
            isActive: currentSession !== null,
            currentSession,
            personality: {
              motivation: personality.dailyMotivation,
              focus: personality.currentFocus,
              riskTolerance: Math.round(personality.riskTolerance * 100) + '%',
              culturalWeight: Math.round(personality.culturalWeight * 100) + '%',
              convictionThreshold: Math.round(personality.convictionThreshold * 100) + '%'
            },
            recentPerformance: {
              totalSessions: recentSessions.length,
              acquisitions: recentSessions.filter(s => s.decision.action === 'acquire').length,
              averageConfidence: recentSessions.length > 0 
                ? Math.round(recentSessions.reduce((sum, s) => sum + s.decision.conviction, 0) / recentSessions.length * 100)
                : 0,
              totalBudgetUsed: recentSessions.reduce((sum, s) => sum + s.decision.budgetAllocated, 0),
              successRate: recentSessions.length > 0 
                ? Math.round(recentSessions.filter(s => s.decision.action === 'acquire').length / recentSessions.length * 100)
                : 0
            }
          },
          timestamp: new Date().toISOString()
        });
        
      case 'history':
        const history = dailyPractice.getSessionHistory();
        return NextResponse.json({
          agent: 'BERTHA',
          sessionHistory: history,
          analytics: {
            totalSessions: history.length,
            totalAcquisitions: history.filter(s => s.decision.action === 'acquire').length,
            totalSpent: history.reduce((sum, s) => sum + s.decision.budgetAllocated, 0),
            averageSessionTime: history.length > 0 
              ? history.reduce((sum, s) => sum + s.performance.timeSpent, 0) / history.length / 1000 / 60
              : 0, // in minutes
            topTargets: history
              .filter(s => s.decision.target)
              .sort((a, b) => (b.decision.conviction || 0) - (a.decision.conviction || 0))
              .slice(0, 5)
              .map(s => ({
                date: s.date,
                artwork: s.decision.target?.artwork,
                conviction: s.decision.conviction,
                action: s.decision.action
              }))
          },
          timestamp: new Date().toISOString()
        });
        
      case 'personality':
        const fullPersonality = dailyPractice.getDailyPersonality();
        return NextResponse.json({
          agent: 'BERTHA',
          personality: fullPersonality,
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA daily practice status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get daily practice status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/daily-practice - Execute daily practice or control actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params } = body;
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'execute_daily':
        console.log('🤖 BERTHA: Starting daily practice execution...');
        console.log('🎯 "ONE PIECE EVERY DAY • REGARDLESS OF COST"');
        
        const session = await dailyPractice.executeDailyPractice();
        
        // Create detailed response
        const response = {
          action: 'execute_daily',
          session,
          summary: {
            date: session.date,
            phase: session.phase,
            result: session.decision.action.toUpperCase(),
            conviction: Math.round(session.decision.conviction * 100) + '%',
            reasoning: session.decision.reasoning,
            timeSpent: Math.round(session.performance.timeSpent / 1000 / 60) + ' minutes',
            artworksAnalyzed: session.progress.deepAnalysisCompleted,
            targetsIdentified: session.progress.targetsIdentified
          },
          insights: session.insights,
          selectedTarget: session.decision.target ? {
            title: session.decision.target.artwork.title,
            artist: session.decision.target.artwork.artist,
            collection: session.decision.target.artwork.collection,
            price: session.decision.target.artwork.currentPrice,
            platform: session.decision.target.artwork.platform,
            confidence: Math.round(session.decision.target.analysis.overallAssessment.confidence * 100) + '%',
            recommendation: session.decision.target.analysis.overallAssessment.recommendation,
            culturalScore: session.decision.target.analysis.scores.cultural,
            opportunityScore: session.decision.target.reasoning.opportunityScore.toFixed(2)
          } : null,
          timestamp: new Date().toISOString()
        };
        
        return NextResponse.json(response);
        
      case 'update_personality':
        // In production, this would allow fine-tuning BERTHA's personality
        return NextResponse.json({
          action: 'update_personality',
          message: 'Personality updates not implemented in demo',
          timestamp: new Date().toISOString()
        });
        
      case 'analyze_target':
        const { artwork } = params || {};
        if (!artwork) {
          return NextResponse.json(
            { error: 'Artwork data required for analysis' },
            { status: 400 }
          );
        }
        
        // This would integrate with the advanced reasoning system
        return NextResponse.json({
          action: 'analyze_target',
          message: 'Target analysis feature coming soon',
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA daily practice action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute daily practice action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}