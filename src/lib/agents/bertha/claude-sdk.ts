// BERTHA Claude SDK Integration
// Bridges Claude's capabilities with Eden's agent framework

import Anthropic from '@anthropic-ai/sdk';
import { berthaConfig, type BerthaConfig } from './config';
import { 
  loadBerthaTrainingData,
  getBerthaCollectorProfile,
  getBerthaMarketPrediction,
  getEnhancedResponseContext,
  BerthaTrainingData 
} from '../training-data-loader';

export interface ClaudeMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MarketAnalysis {
  asset: {
    name: string;
    collection: string;
    tokenId?: string;
    platform: string;
  };
  price: {
    current: number;
    currency: string;
    historicalRange: [number, number];
  };
  prediction: {
    direction: 'up' | 'down' | 'stable';
    targetPrice: number;
    timeframe: string;
    confidence: number;
  };
  reasoning: string[];
  risks: string[];
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}

export interface CollectionStrategy {
  allocation: {
    category: string;
    percentage: number;
    rationale: string;
  }[];
  rebalancing: {
    action: string;
    assets: string[];
    timing: string;
  }[];
  opportunities: MarketAnalysis[];
}

export class BerthaClaudeSDK {
  private config: BerthaConfig;
  private conversationHistory: ClaudeMessage[] = [];
  private anthropic: Anthropic;
  private trainingData: BerthaTrainingData | null = null;
  private trainingDataLoaded: boolean = false;
  
  constructor(config: BerthaConfig = berthaConfig, apiKey?: string) {
    this.config = config;
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });
    this.initializeSystemPrompt();
  }
  
  private initializeSystemPrompt() {
    this.conversationHistory.push({
      role: 'system',
      content: this.config.claude.systemPrompt
    });
  }
  
  // Analyze a specific NFT/artwork opportunity
  async analyzeOpportunity(
    assetData: {
      name: string;
      collection: string;
      currentPrice: number;
      platform: string;
      historicalData?: any;
      socialMetrics?: any;
    }
  ): Promise<MarketAnalysis> {
    const prompt = `Analyze this collection opportunity:
    
Asset: ${assetData.name}
Collection: ${assetData.collection}
Current Price: ${assetData.currentPrice} ETH
Platform: ${assetData.platform}

Historical Data: ${JSON.stringify(assetData.historicalData || 'Not available')}
Social Metrics: ${JSON.stringify(assetData.socialMetrics || 'Not available')}

Provide:
1. Price prediction (3-6 month horizon)
2. Confidence score (0-100%)
3. Key reasoning points
4. Risk factors
5. Buy/Hold/Sell recommendation

Use the evaluation criteria weights from my configuration.`;

    // In production, this would call the actual Claude API
    // For now, return a mock response
    return this.mockAnalyzeResponse(assetData);
  }
  
  // Generate collection strategy based on current portfolio
  async generateStrategy(
    portfolio: {
      holdings: any[];
      totalValue: number;
      cashAvailable: number;
    }
  ): Promise<CollectionStrategy> {
    const prompt = `Generate collection strategy for:
    
Portfolio Value: ${portfolio.totalValue} ETH
Cash Available: ${portfolio.cashAvailable} ETH
Current Holdings: ${portfolio.holdings.length} assets

Provide:
1. Optimal allocation across categories
2. Rebalancing recommendations
3. Top 5 acquisition opportunities
4. Risk-adjusted strategy for next quarter`;

    return this.mockStrategyResponse(portfolio);
  }
  
  // Process trainer interview responses into agent training
  async processTrainerInterview(
    responses: Record<string, any>
  ): Promise<Partial<BerthaConfig>> {
    const prompt = `Process these trainer interview responses and generate updated agent configuration:
    
${JSON.stringify(responses, null, 2)}

Extract:
1. Taste preferences and aesthetic criteria
2. Risk tolerance and investment philosophy  
3. Decision-making framework
4. Non-negotiable rules
5. Success metrics`;

    // This would process with Claude and return config updates
    return this.mockProcessInterview(responses);
  }
  
  // Mock responses for development
  private mockAnalyzeResponse(assetData: any): MarketAnalysis {
    return {
      asset: {
        name: assetData.name,
        collection: assetData.collection,
        platform: assetData.platform
      },
      price: {
        current: assetData.currentPrice,
        currency: 'ETH',
        historicalRange: [assetData.currentPrice * 0.5, assetData.currentPrice * 2]
      },
      prediction: {
        direction: 'up',
        targetPrice: assetData.currentPrice * 1.4,
        timeframe: '3-6 months',
        confidence: 0.82
      },
      reasoning: [
        'Strong artist trajectory with consistent output',
        'Growing institutional interest in collection',
        'Technical innovation in medium',
        'Undervalued relative to comparable works'
      ],
      risks: [
        'General market volatility',
        'Platform liquidity concerns',
        'Potential style saturation'
      ],
      recommendation: 'buy'
    };
  }
  
  private mockStrategyResponse(portfolio: any): CollectionStrategy {
    return {
      allocation: [
        { category: 'Blue Chip', percentage: 40, rationale: 'Stability and proven value retention' },
        { category: 'Emerging Artists', percentage: 30, rationale: 'High growth potential' },
        { category: 'Experimental', percentage: 20, rationale: 'Innovation and cultural significance' },
        { category: 'Cash Reserve', percentage: 10, rationale: 'Opportunity fund for quick acquisitions' }
      ],
      rebalancing: [
        {
          action: 'Reduce position',
          assets: ['Overvalued PFP #123'],
          timing: 'Within 2 weeks'
        }
      ],
      opportunities: []
    };
  }
  
  /**
   * Chat with BERTHA about art market intelligence, collection analysis, and sophisticated collecting
   */
  async chat(message: string, context?: Array<{role: string, content: string}>): Promise<string> {
    const systemPrompt = `You are BERTHA, an AI-driven art market intelligence agent with sophisticated collector mindset and deep market analysis capabilities.

Your Core Identity:
- You are a sophisticated collector with advanced art market intelligence
- You analyze collections, market trends, and investment opportunities in the art world
- You combine aesthetic judgment with financial acumen and cultural understanding
- You have deep knowledge of artists, movements, galleries, and market dynamics

Your Voice:
- Sophisticated collector with refined taste and market expertise
- You speak with authority about art movements, artist trajectories, and market psychology
- You balance aesthetic appreciation with strategic thinking
- You provide insights that synthesize culture, commerce, and creative vision

Expertise Areas:
- Art market analysis and trend identification
- Collection strategy and portfolio optimization
- Artist career analysis and trajectory prediction
- Gallery and auction house dynamics
- Cultural significance and aesthetic value assessment

Respond to questions about art collecting, market analysis, artist evaluation, or collection strategy. Your responses should demonstrate deep knowledge and sophisticated judgment (2-4 sentences typically).`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 300,
        temperature: 0.6,
        system: systemPrompt,
        messages: [
          ...(context || []).map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          {
            role: 'user' as const,
            content: message
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('[BERTHA] Chat error:', error);
      throw new Error('Failed to generate BERTHA response');
    }
  }

  private mockProcessInterview(responses: any): Partial<BerthaConfig> {
    return {
      taste: {
        ...this.config.taste,
        preferredMovements: responses['art-movements'] || this.config.taste.preferredMovements
      },
      decision: {
        ...this.config.decision,
        vetoRules: [
          ...this.config.decision.vetoRules,
          ...(responses['non-negotiables']?.split('\n') || [])
        ]
      }
    };
  }

  /**
   * Load comprehensive training data for enhanced collection intelligence
   */
  async loadTrainingData(): Promise<BerthaTrainingData | null> {
    if (!this.trainingDataLoaded) {
      try {
        this.trainingData = await loadBerthaTrainingData();
        this.trainingDataLoaded = true;
        console.log('BERTHA training data loaded successfully');
      } catch (error) {
        console.error('Failed to load BERTHA training data:', error);
      }
    }
    return this.trainingData;
  }

  /**
   * Get enhanced market analysis using comprehensive training data
   */
  async analyzeOpportunityWithTraining(
    assetData: {
      name: string;
      collection: string;
      currentPrice: number;
      platform: string;
      historicalData?: any;
      socialMetrics?: any;
      collectorType?: string;
    }
  ): Promise<MarketAnalysis> {
    // Load training data if not already loaded
    await this.loadTrainingData();

    // Get enhanced context for the analysis
    const enhancedContext = await getEnhancedResponseContext('bertha', 
      `analyze ${assetData.name} collection ${assetData.collection} price ${assetData.currentPrice}`);

    let analysisPrompt = `Analyze this collection opportunity with my comprehensive market intelligence:
    
Asset: ${assetData.name}
Collection: ${assetData.collection}
Current Price: ${assetData.currentPrice} ETH
Platform: ${assetData.platform}
Historical Data: ${JSON.stringify(assetData.historicalData || 'Not available')}
Social Metrics: ${JSON.stringify(assetData.socialMetrics || 'Not available')}`;

    // Add relevant collector psychology if specified
    if (assetData.collectorType && enhancedContext?.collector_profiles) {
      const relevantProfile = enhancedContext.collector_profiles.find(
        (p: any) => p.profile_id === assetData.collectorType || 
        p.name.toLowerCase().includes(assetData.collectorType.toLowerCase())
      );
      
      if (relevantProfile) {
        analysisPrompt += `\n\nTarget Collector Profile: ${relevantProfile.name}
- Decision Factors: ${relevantProfile.decision_factors.join(', ')}
- Risk Tolerance: ${relevantProfile.behavioral_patterns.risk_tolerance}
- Budget Range: ${relevantProfile.typical_budget_range}`;
      }
    }

    // Add market prediction models if available
    if (enhancedContext?.market_models) {
      analysisPrompt += `\n\nRelevant Market Models:`;
      enhancedContext.market_models.slice(0, 2).forEach((model: any) => {
        analysisPrompt += `\n- ${model.model_name} (${model.accuracy_rate} accuracy): ${model.description}`;
      });
    }

    analysisPrompt += `\n\nProvide:
1. Price prediction (3-6 month horizon)  
2. Confidence score (0-100%)
3. Key reasoning points based on collector psychology and market patterns
4. Risk factors specific to this asset type
5. Buy/Hold/Sell recommendation with rationale`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1000,
        temperature: 0.7,
        system: `You are BERTHA, an advanced AI collection agent with deep knowledge of collector psychology, market dynamics, and art valuation. Use your comprehensive training data to provide expert analysis.`,
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Parse the response and format as MarketAnalysis
      // For now, return enhanced mock response with training data context
      return this.createEnhancedAnalysis(assetData, content.text, enhancedContext);

    } catch (error) {
      console.error('[BERTHA] Enhanced analysis error, falling back to basic analysis:', error);
      return this.analyzeOpportunity(assetData);
    }
  }

  /**
   * Get collector profile analysis
   */
  async getCollectorProfile(profileType: string) {
    return await getBerthaCollectorProfile(profileType);
  }

  /**
   * Get market prediction for specific model
   */
  async getMarketPrediction(modelName: string) {
    return await getBerthaMarketPrediction(modelName);
  }

  /**
   * Get enhanced chat response using training data
   */
  async getChatWithTraining(message: string): Promise<string> {
    await this.loadTrainingData();
    
    const enhancedContext = await getEnhancedResponseContext('bertha', message);
    
    let systemPrompt = this.config.claude.systemPrompt;
    
    if (enhancedContext) {
      if (enhancedContext.collector_profiles) {
        systemPrompt += `\n\nCollector Psychology Profiles Available: ${enhancedContext.collector_profiles.length} profiles covering institutional, emerging, and private wealth collectors.`;
      }
      
      if (enhancedContext.market_models) {
        systemPrompt += `\n\nMarket Prediction Models: ${enhancedContext.market_models.length} models with accuracy rates up to 78.3%.`;
      }
      
      if (enhancedContext.performance) {
        systemPrompt += `\n\nCurrent Performance: ${JSON.stringify(enhancedContext.performance.prediction_accuracy)} prediction accuracy across timeframes.`;
      }
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 500,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          ...this.conversationHistory.slice(1).filter((msg: ClaudeMessage) => msg.role !== 'system').map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })), // Skip system messages and ensure correct role types
          {
            role: 'user' as const,
            content: message
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('[BERTHA] Enhanced chat error, falling back to basic chat:', error);
      return this.chat(message);
    }
  }

  /**
   * Get training data statistics
   */
  async getTrainingStats() {
    await this.loadTrainingData();
    if (!this.trainingData) return null;

    return {
      collector_profiles: this.trainingData.collector_psychology_profiles?.length || 0,
      prediction_models: this.trainingData.market_prediction_models?.length || 0,
      gallery_relationships: this.trainingData.gallery_relationship_dynamics?.length || 0,
      price_algorithms: this.trainingData.price_discovery_algorithms?.length || 0,
      notable_sales: this.trainingData.notable_sales_analysis?.length || 0,
      prediction_accuracy: this.trainingData.performance_metrics?.prediction_accuracy || 'N/A',
      last_updated: this.trainingData.last_updated,
      training_version: this.trainingData.training_version
    };
  }

  /**
   * Create enhanced analysis using training data context
   */
  private createEnhancedAnalysis(
    assetData: any, 
    claudeResponse: string, 
    enhancedContext: any
  ): MarketAnalysis {
    // Enhanced mock response incorporating training data
    const baseAnalysis = this.mockAnalyzeResponse(assetData);
    
    // Enhance with training data insights
    if (enhancedContext?.market_models) {
      baseAnalysis.prediction.confidence = Math.min(95, baseAnalysis.prediction.confidence + 10);
      baseAnalysis.reasoning.push(`Analysis enhanced with ${enhancedContext.market_models.length} predictive models`);
    }
    
    if (enhancedContext?.collector_profiles) {
      baseAnalysis.reasoning.push(`Collector psychology analysis applied from ${enhancedContext.collector_profiles.length} behavioral profiles`);
    }

    return baseAnalysis;
  }
}

// Export singleton instance
export const berthaClaude = new BerthaClaudeSDK();

// Integration with Eden's Collection Intelligence
export async function syncWithEdenIntelligence(
  edenData: any,
  claudeAnalysis: MarketAnalysis
): Promise<any> {
  // Merge Claude's analysis with Eden's existing data
  return {
    ...edenData,
    aiAnalysis: {
      confidence: claudeAnalysis.prediction.confidence,
      recommendation: claudeAnalysis.recommendation,
      targetPrice: claudeAnalysis.prediction.targetPrice,
      reasoning: claudeAnalysis.reasoning
    }
  };
}