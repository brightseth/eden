import { NextRequest, NextResponse } from 'next/server';
import { 
  loadTrainingData,
  loadAbrahamTrainingData,
  loadBerthaTrainingData,
  getAbrahamArtwork,
  getAbrahamCovenantProgress,
  getBerthaCollectorProfile,
  getBerthaMarketPrediction,
  searchAbrahamArtworks,
  getTrainingDataSummary,
  refreshTrainingCache,
  getEnhancedResponseContext,
  getTrainingDataStats
} from '@/lib/agents/training-data-loader';

// GET /api/agents/training-data - Access agent training data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent');
    const type = searchParams.get('type') || 'overview';
    const query = searchParams.get('query');
    const artworkId = searchParams.get('artworkId');
    const profileType = searchParams.get('profileType');
    const modelName = searchParams.get('modelName');

    switch (type) {
      case 'overview':
        if (!agent) {
          // Return summary of all agents
          const summary = await getTrainingDataSummary();
          return NextResponse.json({
            type: 'overview',
            agents: summary,
            timestamp: new Date().toISOString()
          });
        }
        
        // Return specific agent's training data
        const trainingData = await loadTrainingData(agent);
        if (!trainingData) {
          return NextResponse.json(
            { error: `Training data not found for agent: ${agent}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          agent,
          type: 'overview',
          training: trainingData,
          timestamp: new Date().toISOString()
        });

      case 'abraham':
        const abrahamData = await loadAbrahamTrainingData();
        if (!abrahamData) {
          return NextResponse.json(
            { error: 'Abraham training data not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          agent: 'abraham',
          type: 'full_training',
          training: abrahamData,
          timestamp: new Date().toISOString()
        });

      case 'bertha':
        const berthaData = await loadBerthaTrainingData();
        if (!berthaData) {
          return NextResponse.json(
            { error: 'BERTHA training data not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          agent: 'bertha',
          type: 'full_training',
          training: berthaData,
          timestamp: new Date().toISOString()
        });

      case 'artwork':
        if (!artworkId) {
          return NextResponse.json(
            { error: 'artworkId parameter required' },
            { status: 400 }
          );
        }
        
        const artwork = await getAbrahamArtwork(artworkId);
        if (!artwork) {
          return NextResponse.json(
            { error: `Artwork not found: ${artworkId}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          type: 'artwork',
          artwork,
          timestamp: new Date().toISOString()
        });

      case 'covenant':
        const covenantProgress = await getAbrahamCovenantProgress();
        if (!covenantProgress) {
          return NextResponse.json(
            { error: 'Abraham covenant data not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          type: 'covenant',
          progress: covenantProgress,
          timestamp: new Date().toISOString()
        });

      case 'collector_profile':
        if (!profileType) {
          return NextResponse.json(
            { error: 'profileType parameter required' },
            { status: 400 }
          );
        }
        
        const collectorProfile = await getBerthaCollectorProfile(profileType);
        if (!collectorProfile) {
          return NextResponse.json(
            { error: `Collector profile not found: ${profileType}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          type: 'collector_profile',
          profile: collectorProfile,
          timestamp: new Date().toISOString()
        });

      case 'market_prediction':
        if (!modelName) {
          return NextResponse.json(
            { error: 'modelName parameter required' },
            { status: 400 }
          );
        }
        
        const marketPrediction = await getBerthaMarketPrediction(modelName);
        if (!marketPrediction) {
          return NextResponse.json(
            { error: `Market prediction model not found: ${modelName}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          type: 'market_prediction',
          prediction: marketPrediction,
          timestamp: new Date().toISOString()
        });

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'query parameter required for search' },
            { status: 400 }
          );
        }
        
        if (agent === 'abraham') {
          const searchResults = await searchAbrahamArtworks(query);
          return NextResponse.json({
            agent: 'abraham',
            type: 'search',
            query,
            results: searchResults,
            count: searchResults.length,
            timestamp: new Date().toISOString()
          });
        }
        
        return NextResponse.json(
          { error: 'Search only available for Abraham currently' },
          { status: 400 }
        );

      case 'context':
        if (!agent || !query) {
          return NextResponse.json(
            { error: 'agent and query parameters required for context' },
            { status: 400 }
          );
        }
        
        const context = await getEnhancedResponseContext(agent, query);
        if (!context) {
          return NextResponse.json(
            { error: `Enhanced context not available for agent: ${agent}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          agent,
          type: 'context',
          query,
          context,
          timestamp: new Date().toISOString()
        });

      case 'stats':
        const stats = await getTrainingDataStats();
        return NextResponse.json({
          type: 'stats',
          statistics: stats,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Training data API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch training data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/training-data - Training data operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agent } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'refresh_cache':
        if (!agent) {
          return NextResponse.json(
            { error: 'Agent ID required for cache refresh' },
            { status: 400 }
          );
        }
        
        const refreshSuccess = await refreshTrainingCache(agent);
        if (!refreshSuccess) {
          return NextResponse.json(
            { error: `Failed to refresh cache for agent: ${agent}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          action: 'refresh_cache',
          agent,
          success: true,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Training data action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute training data operation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}