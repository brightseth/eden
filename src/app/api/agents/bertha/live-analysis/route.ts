import { NextRequest, NextResponse } from 'next/server';
import { nftAPIConnector } from '@/lib/agents/bertha/nft-api-connector';
import { berthaEngine, type ArtworkEvaluation } from '@/lib/agents/bertha/collection-engine';
import { marketIntelligence } from '@/lib/agents/bertha/market-intelligence';

// POST /api/agents/bertha/live-analysis - Analyze real NFT data
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
      case 'analyze_trending':
        // Analyze trending NFT collections
        console.log('🔥 BERTHA: Analyzing trending NFT collections...');
        
        const trending = await nftAPIConnector.getTrendingCollections(5);
        const analyses = [];
        
        for (const collection of trending) {
          const stats = await nftAPIConnector.getCollectionStats(collection.slug);
          
          // Create evaluation for BERTHA
          const evaluation: ArtworkEvaluation = {
            artwork: {
              id: collection.slug,
              title: `${collection.name} Collection`,
              artist: 'Various Artists',
              collection: collection.name,
              currentPrice: collection.floor_price,
              currency: 'ETH',
              platform: 'OpenSea'
            },
            signals: {
              technical: collection.verified ? 0.8 : 0.4,
              cultural: collection.sales_count_24h > 50 ? 0.9 : 0.5,
              market: collection.volume_change_24h > 0 ? 0.8 : 0.3,
              aesthetic: 0.7 // Default for collections
            },
            metadata: {
              created: new Date().toISOString(),
              medium: 'NFT Collection',
              provenance: ['OpenSea Verified']
            }
          };
          
          const decision = await berthaEngine.getConsensusDecision(evaluation);
          
          analyses.push({
            collection: collection.name,
            floor_price: collection.floor_price,
            volume_change_24h: collection.volume_change_24h,
            sales_24h: collection.sales_count_24h,
            bertha_decision: decision.decision,
            confidence: Math.round(decision.confidence * 100),
            reasoning: decision.reasoning[0] || 'No specific reasoning',
            market_cap: stats?.market_cap || 0,
            num_owners: stats?.num_owners || 0
          });
        }
        
        return NextResponse.json({
          action: 'analyze_trending',
          timestamp: new Date().toISOString(),
          trending_collections: analyses,
          summary: {
            total_analyzed: analyses.length,
            buy_recommendations: analyses.filter(a => a.bertha_decision === 'buy').length,
            watch_recommendations: analyses.filter(a => a.bertha_decision === 'watch').length,
            avg_confidence: Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length)
          }
        });
        
      case 'analyze_nft':
        // Analyze specific NFT
        const { contract_address, token_id } = params || {};
        if (!contract_address || !token_id) {
          return NextResponse.json(
            { error: 'Contract address and token ID required' },
            { status: 400 }
          );
        }
        
        console.log(`🎨 BERTHA: Analyzing NFT ${contract_address}:${token_id}...`);
        
        const asset = await nftAPIConnector.getNFTAsset(contract_address, token_id);
        if (!asset) {
          return NextResponse.json(
            { error: 'NFT not found' },
            { status: 404 }
          );
        }
        
        // Get market signals
        const marketSignals = await marketIntelligence.getMarketSignalsForArtwork({
          artist: asset.creator.username,
          category: 'NFT',
          platform: asset.platform,
          currentPrice: asset.current_price
        });
        
        // Create evaluation
        const nftEvaluation: ArtworkEvaluation = {
          artwork: {
            id: asset.id,
            title: asset.name,
            artist: asset.creator.username,
            collection: asset.collection.name,
            currentPrice: asset.current_price,
            currency: 'ETH',
            platform: asset.platform
          },
          signals: {
            technical: asset.traits.some(t => t.rarity < 0.1) ? 0.9 : 0.5,
            cultural: asset.collection.total_volume > 1000 ? 0.8 : 0.4,
            market: marketSignals.marketScore,
            aesthetic: 0.7 // Would need image analysis in production
          },
          metadata: {
            created: asset.last_sale.timestamp,
            medium: 'Digital NFT',
            provenance: ['Blockchain Verified', asset.platform]
          }
        };
        
        const nftDecision = await berthaEngine.getConsensusDecision(nftEvaluation);
        
        return NextResponse.json({
          action: 'analyze_nft',
          asset: {
            name: asset.name,
            collection: asset.collection.name,
            current_price: asset.current_price,
            last_sale_price: asset.last_sale.price,
            creator: asset.creator.username,
            traits: asset.traits
          },
          analysis: {
            decision: nftDecision.decision,
            confidence: Math.round(nftDecision.confidence * 100),
            reasoning: nftDecision.reasoning,
            risks: nftDecision.riskFactors,
            urgency: nftDecision.urgency,
            price_target: nftDecision.priceTarget
          },
          market_context: {
            collection_floor: asset.collection.floor_price,
            collection_volume: asset.collection.total_volume,
            price_vs_floor: (asset.current_price / asset.collection.floor_price).toFixed(2) + 'x',
            market_signals: marketSignals
          },
          timestamp: new Date().toISOString()
        });
        
      case 'search_opportunities':
        // Search for investment opportunities
        const searchParams = params || {};
        console.log('🔍 BERTHA: Searching for NFT opportunities...');
        
        const searchResults = await nftAPIConnector.searchNFTs({
          minPrice: searchParams.min_price || 0.5,
          maxPrice: searchParams.max_price || 10,
          sortBy: 'recent',
          limit: 10
        });
        
        const opportunities = [];
        
        for (const nft of searchResults) {
          const evaluation: ArtworkEvaluation = {
            artwork: {
              id: nft.id,
              title: nft.name,
              artist: nft.creator.username,
              currentPrice: nft.current_price,
              currency: 'ETH',
              platform: nft.platform
            },
            signals: {
              technical: 0.6,
              cultural: 0.5,
              market: nft.current_price < nft.collection.floor_price * 1.2 ? 0.7 : 0.4,
              aesthetic: 0.6
            },
            metadata: {
              created: nft.last_sale.timestamp,
              medium: 'Digital NFT',
              provenance: ['OpenSea']
            }
          };
          
          const decision = await berthaEngine.getConsensusDecision(evaluation);
          
          if (decision.decision === 'buy' || decision.decision === 'watch') {
            opportunities.push({
              nft: {
                name: nft.name,
                collection: nft.collection.name,
                price: nft.current_price,
                last_sale: nft.last_sale.price
              },
              bertha_analysis: {
                decision: decision.decision,
                confidence: Math.round(decision.confidence * 100),
                reasoning: decision.reasoning[0]
              },
              opportunity_score: decision.confidence * (nft.collection.floor_price / nft.current_price)
            });
          }
        }
        
        // Sort by opportunity score
        opportunities.sort((a, b) => b.opportunity_score - a.opportunity_score);
        
        return NextResponse.json({
          action: 'search_opportunities',
          search_params: searchParams,
          total_analyzed: searchResults.length,
          opportunities_found: opportunities.length,
          top_opportunities: opportunities.slice(0, 5),
          timestamp: new Date().toISOString()
        });
        
      case 'market_pulse':
        // Get current NFT market pulse
        console.log('📊 BERTHA: Analyzing NFT market pulse...');
        
        const recentSales = await nftAPIConnector.getRecentSales(undefined, 20);
        const trendingNow = await nftAPIConnector.getTrendingCollections(3);
        
        const avgSalePrice = recentSales.reduce((sum, s) => sum + s.price, 0) / recentSales.length;
        const volumeTrend = recentSales.slice(0, 10).reduce((sum, s) => sum + s.price, 0) >
                           recentSales.slice(10, 20).reduce((sum, s) => sum + s.price, 0) ? 'increasing' : 'decreasing';
        
        return NextResponse.json({
          action: 'market_pulse',
          market_status: {
            sentiment: volumeTrend === 'increasing' ? 'bullish' : 'bearish',
            avg_sale_price: avgSalePrice.toFixed(2),
            volume_trend: volumeTrend,
            recent_sales_count: recentSales.length,
            hot_collections: trendingNow.map(t => ({
              name: t.name,
              floor: t.floor_price,
              volume_change: t.volume_change_24h
            }))
          },
          bertha_insights: {
            market_condition: volumeTrend === 'increasing' ? 'Favorable for acquisitions' : 'Exercise caution',
            recommended_action: avgSalePrice < 5 ? 'Focus on emerging artists' : 'Target established collections',
            risk_level: volumeTrend === 'decreasing' ? 'elevated' : 'moderate',
            opportunity_areas: [
              'Undervalued generative art',
              'Early AI art experiments',
              'Photography NFTs below floor'
            ]
          },
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA live analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform live analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/agents/bertha/live-analysis - Get live analysis capabilities
export async function GET() {
  return NextResponse.json({
    agent: 'BERTHA',
    version: '1.0.0',
    capabilities: [
      'analyze_trending - Analyze trending NFT collections',
      'analyze_nft - Analyze specific NFT by contract and token ID',
      'search_opportunities - Search for investment opportunities',
      'market_pulse - Get current NFT market pulse'
    ],
    data_sources: [
      'OpenSea API (simulated)',
      'Real-time market data',
      'Collection statistics',
      'Recent sales data'
    ],
    usage_examples: {
      analyze_trending: {
        action: 'analyze_trending'
      },
      analyze_nft: {
        action: 'analyze_nft',
        params: {
          contract_address: '0x...',
          token_id: '1234'
        }
      },
      search_opportunities: {
        action: 'search_opportunities',
        params: {
          min_price: 1,
          max_price: 10
        }
      },
      market_pulse: {
        action: 'market_pulse'
      }
    },
    timestamp: new Date().toISOString()
  });
}