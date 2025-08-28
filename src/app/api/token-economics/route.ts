import { NextRequest, NextResponse } from 'next/server';
import { agentTokenEconomics } from '@/lib/token-economics/agent-tokens';

// GET /api/token-economics - Get token economics overview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const agentId = searchParams.get('agent');
    
    switch (type) {
      case 'overview':
        const marketOverview = agentTokenEconomics.getMarketOverview();
        const allTokens = agentTokenEconomics.getAllTokens();
        
        return NextResponse.json({
          market: marketOverview,
          tokens: allTokens,
          timestamp: new Date().toISOString()
        });

      case 'agent':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID required for agent-specific data' },
            { status: 400 }
          );
        }
        
        const agentToken = agentTokenEconomics.getAgentToken(agentId);
        if (!agentToken) {
          return NextResponse.json(
            { error: 'Agent token not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          agent: agentId,
          token: agentToken,
          timestamp: new Date().toISOString()
        });

      case 'market':
        const market = agentTokenEconomics.getMarketOverview();
        return NextResponse.json({
          market,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Token economics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch token economics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/token-economics - Token operations
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
      case 'stake_tokens':
        const { holder, agentId, amount, lockPeriod } = params;
        if (!holder || !agentId || !amount) {
          return NextResponse.json(
            { error: 'Holder, agentId, and amount required' },
            { status: 400 }
          );
        }
        
        const stakingPosition = await agentTokenEconomics.stakeTokens(
          holder,
          agentId,
          amount,
          lockPeriod || 30
        );
        
        return NextResponse.json({
          action: 'stake_tokens',
          position: stakingPosition,
          timestamp: new Date().toISOString()
        });

      case 'create_collaboration_bond':
        const { agents, bondSize, duration, purpose } = params;
        if (!agents || !bondSize || !duration || !purpose) {
          return NextResponse.json(
            { error: 'Agents, bondSize, duration, and purpose required' },
            { status: 400 }
          );
        }
        
        const bond = await agentTokenEconomics.createCollaborationBond(
          agents,
          bondSize,
          duration,
          purpose
        );
        
        return NextResponse.json({
          action: 'create_collaboration_bond',
          bond,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Token economics action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute token operation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}