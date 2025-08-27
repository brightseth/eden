import { NextRequest, NextResponse } from 'next/server';
import { autonomousCollector } from '@/lib/agents/bertha/autonomous-collector';

// GET /api/agents/bertha/autonomous - Get autonomous collection status and history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    
    switch (action) {
      case 'status':
        const strategy = autonomousCollector.getStrategy();
        const history = autonomousCollector.getAcquisitionHistory();
        const recentAcquisitions = history.slice(-7); // Last 7 days
        
        const totalSpent = history
          .filter(h => h.finalPrice)
          .reduce((sum, h) => sum + (h.finalPrice || 0), 0);
        
        const successRate = history.length > 0 
          ? history.filter(h => h.acquisitionStatus === 'acquired').length / history.length 
          : 0;
        
        return NextResponse.json({
          agent: 'BERTHA',
          mode: 'Autonomous Collection',
          status: 'active',
          strategy,
          performance: {
            totalAcquisitions: history.filter(h => h.acquisitionStatus === 'acquired').length,
            totalSpent: totalSpent.toFixed(3),
            successRate: Math.round(successRate * 100),
            avgDailySpend: history.length > 0 ? (totalSpent / history.length).toFixed(3) : '0',
            lastAcquisition: recentAcquisitions.find(h => h.acquisitionStatus === 'acquired')?.date || 'None',
            streak: calculateStreak(history)
          },
          recentActivity: recentAcquisitions.map(h => ({
            date: h.date,
            status: h.acquisitionStatus,
            target: h.target ? {
              title: h.target.title,
              artist: h.target.artist,
              price: h.target.currentPrice,
              platform: h.target.platform
            } : null,
            finalPrice: h.finalPrice,
            reasoning: h.reasoning.length > 100 ? h.reasoning.substring(0, 100) + '...' : h.reasoning
          })),
          timestamp: new Date().toISOString()
        });
        
      case 'history':
        const fullHistory = autonomousCollector.getAcquisitionHistory();
        return NextResponse.json({
          agent: 'BERTHA',
          history: fullHistory,
          summary: {
            totalDays: fullHistory.length,
            acquired: fullHistory.filter(h => h.acquisitionStatus === 'acquired').length,
            passed: fullHistory.filter(h => h.acquisitionStatus === 'passed').length,
            failed: fullHistory.filter(h => h.acquisitionStatus === 'failed').length
          },
          timestamp: new Date().toISOString()
        });
        
      case 'targets':
        const currentTargets = autonomousCollector.getCurrentTargets();
        return NextResponse.json({
          agent: 'BERTHA',
          currentTargets: currentTargets.slice(0, 10), // Top 10 targets
          targetCount: currentTargets.length,
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA autonomous status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get autonomous collection status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/autonomous - Execute autonomous collection actions
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
        console.log('🤖 BERTHA: Executing daily autonomous acquisition...');
        const dailyResult = await autonomousCollector.executeDailyAcquisition();
        
        return NextResponse.json({
          action: 'execute_daily',
          result: dailyResult,
          summary: {
            date: dailyResult.date,
            status: dailyResult.acquisitionStatus,
            target: dailyResult.target ? `"${dailyResult.target.title}" by ${dailyResult.target.artist}` : 'No target selected',
            spent: dailyResult.finalPrice || 0,
            reasoning: dailyResult.reasoning,
            alternatives: dailyResult.alternativeOptions.length,
            scanStats: dailyResult.scanStats
          },
          timestamp: new Date().toISOString()
        });
        
      case 'update_strategy':
        if (!params || typeof params !== 'object') {
          return NextResponse.json(
            { error: 'Strategy updates required in params' },
            { status: 400 }
          );
        }
        
        autonomousCollector.updateStrategy(params);
        const updatedStrategy = autonomousCollector.getStrategy();
        
        return NextResponse.json({
          action: 'update_strategy',
          message: 'Strategy updated successfully',
          newStrategy: updatedStrategy,
          timestamp: new Date().toISOString()
        });
        
      case 'simulate_scan':
        // Simulate a scanning session without actually acquiring
        console.log('🔍 BERTHA: Running simulation scan...');
        
        const simulationResult = {
          platformsScanned: 5,
          artworksDiscovered: Math.floor(Math.random() * 50) + 20,
          potentialTargets: Math.floor(Math.random() * 15) + 5,
          topTarget: {
            title: `Simulation Target #${Math.floor(Math.random() * 999)}`,
            artist: 'Simulation Artist',
            price: Math.random() * 20 + 1,
            confidence: Math.random() * 0.4 + 0.6
          },
          estimatedTime: '45 minutes',
          recommendation: Math.random() > 0.5 ? 'Execute acquisition' : 'Continue monitoring'
        };
        
        return NextResponse.json({
          action: 'simulate_scan',
          result: simulationResult,
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA autonomous action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute autonomous action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate acquisition streak
function calculateStreak(history: any[]): number {
  let streak = 0;
  const sortedHistory = history
    .filter(h => h.acquisitionStatus === 'acquired')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  for (const acquisition of sortedHistory) {
    const date = new Date(acquisition.date);
    const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= streak + 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}