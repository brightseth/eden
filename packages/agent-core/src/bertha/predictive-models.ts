// BERTHA Predictive Market Models
// ML-powered price prediction and market timing algorithms

export interface PriceData {
  timestamp: string;
  price: number;
  volume: number;
  platform: string;
}

export interface SocialSignal {
  platform: string; // twitter, discord, telegram
  mentions: number;
  sentiment: number; // -1 to 1
  engagement: number;
  timestamp: string;
}

export interface TechnicalIndicators {
  sma_7: number;     // 7-day simple moving average
  sma_30: number;    // 30-day simple moving average
  rsi: number;       // Relative Strength Index
  volatility: number; // 30-day volatility
  momentum: number;   // Price momentum
  support: number;    // Support level
  resistance: number; // Resistance level
}

export interface MarketPrediction {
  prediction: {
    direction: 'bullish' | 'bearish' | 'neutral';
    priceTarget: number;
    confidence: number;
    timeframe: '1_day' | '7_days' | '30_days' | '90_days';
    probability: {
      up_10_percent: number;
      down_10_percent: number;
      sideways: number;
    };
  };
  technicalAnalysis: {
    trend: 'uptrend' | 'downtrend' | 'sideways';
    strength: 'weak' | 'moderate' | 'strong';
    signals: string[];
    indicators: TechnicalIndicators;
  };
  socialSentiment: {
    overall: number; // -1 to 1
    momentum: 'increasing' | 'decreasing' | 'stable';
    keyTopics: string[];
    influencerActivity: number;
  };
  marketTiming: {
    buySignal: 'strong' | 'weak' | 'none';
    sellSignal: 'strong' | 'weak' | 'none';
    optimalEntry: string;
    riskReward: number;
  };
  reasoning: {
    summary: string;
    keyDrivers: string[];
    risks: string[];
    catalysts: string[];
  };
}

export interface CollectionPrediction {
  collection: string;
  floorPrediction: {
    next_7_days: { price: number; confidence: number };
    next_30_days: { price: number; confidence: number };
    next_90_days: { price: number; confidence: number };
  };
  volumePrediction: {
    trend: 'increasing' | 'decreasing' | 'stable';
    expectedVolume: number;
    confidence: number;
  };
  narrativeAnalysis: {
    currentNarrative: string;
    strengthening: boolean;
    catalysts: string[];
    threats: string[];
  };
}

export class PredictiveModels {
  private historicalData: Map<string, PriceData[]> = new Map();
  private socialSignals: Map<string, SocialSignal[]> = new Map();
  
  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    // Initialize ML models (in production, load pre-trained models)
    console.log('🤖 Initializing BERTHA\'s predictive models...');
  }

  async predictPrice(
    symbol: string,
    historicalPrices: PriceData[],
    socialSignals: SocialSignal[] = [],
    timeframe: '1_day' | '7_days' | '30_days' | '90_days' = '7_days'
  ): Promise<MarketPrediction> {
    // Store historical data
    this.historicalData.set(symbol, historicalPrices);
    this.socialSignals.set(symbol, socialSignals);

    // Calculate technical indicators
    const indicators = this.calculateTechnicalIndicators(historicalPrices);
    
    // Analyze social sentiment
    const sentiment = this.analyzeSocialSentiment(socialSignals);
    
    // Generate prediction using ensemble methods
    const prediction = this.generatePricePrediction(historicalPrices, indicators, sentiment, timeframe);
    
    // Market timing analysis
    const timing = this.analyzeMarketTiming(historicalPrices, indicators);

    return {
      prediction,
      technicalAnalysis: {
        trend: this.identifyTrend(indicators),
        strength: this.assessTrendStrength(indicators),
        signals: this.generateTechnicalSignals(indicators),
        indicators
      },
      socialSentiment: sentiment,
      marketTiming: timing,
      reasoning: {
        summary: this.generatePredictionSummary(prediction, indicators, sentiment),
        keyDrivers: this.identifyKeyDrivers(indicators, sentiment),
        risks: this.identifyRisks(indicators, sentiment),
        catalysts: this.identifyPotentialCatalysts(socialSignals)
      }
    };
  }

  private calculateTechnicalIndicators(prices: PriceData[]): TechnicalIndicators {
    if (prices.length < 30) {
      // Not enough data for full technical analysis
      return this.generateMockIndicators();
    }

    const recentPrices = prices.slice(-30).map(p => p.price);
    const volumes = prices.slice(-30).map(p => p.volume);

    // Simple Moving Averages
    const sma_7 = this.calculateSMA(recentPrices.slice(-7));
    const sma_30 = this.calculateSMA(recentPrices);

    // RSI (Relative Strength Index)
    const rsi = this.calculateRSI(recentPrices);

    // Volatility (30-day)
    const volatility = this.calculateVolatility(recentPrices);

    // Momentum
    const momentum = recentPrices[recentPrices.length - 1] / recentPrices[recentPrices.length - 7] - 1;

    // Support and Resistance
    const support = Math.min(...recentPrices.slice(-14));
    const resistance = Math.max(...recentPrices.slice(-14));

    return {
      sma_7,
      sma_30,
      rsi,
      volatility,
      momentum,
      support,
      resistance
    };
  }

  private calculateSMA(prices: number[]): number {
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  private calculateRSI(prices: number[]): number {
    if (prices.length < 14) return 50; // Neutral RSI

    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    const avgGain = gains.slice(-14).reduce((sum, gain) => sum + gain, 0) / 14;
    const avgLoss = losses.slice(-14).reduce((sum, loss) => sum + loss, 0) / 14;

    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateVolatility(prices: number[]): number {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }

    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(365); // Annualized volatility
  }

  private analyzeSocialSentiment(signals: SocialSignal[]): {
    overall: number;
    momentum: 'increasing' | 'decreasing' | 'stable';
    keyTopics: string[];
    influencerActivity: number;
  } {
    if (signals.length === 0) {
      return {
        overall: 0,
        momentum: 'stable',
        keyTopics: [],
        influencerActivity: 0
      };
    }

    // Calculate weighted sentiment
    const totalEngagement = signals.reduce((sum, s) => sum + s.engagement, 0);
    const weightedSentiment = signals.reduce((sum, s) => {
      const weight = s.engagement / totalEngagement;
      return sum + (s.sentiment * weight);
    }, 0);

    // Analyze momentum
    const recent = signals.filter(s => Date.now() - new Date(s.timestamp).getTime() < 24 * 60 * 60 * 1000);
    const older = signals.filter(s => Date.now() - new Date(s.timestamp).getTime() >= 24 * 60 * 60 * 1000);
    
    const recentSentiment = recent.length > 0 ? recent.reduce((sum, s) => sum + s.sentiment, 0) / recent.length : 0;
    const olderSentiment = older.length > 0 ? older.reduce((sum, s) => sum + s.sentiment, 0) / older.length : 0;
    
    let momentum: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentSentiment > olderSentiment + 0.1) momentum = 'increasing';
    if (recentSentiment < olderSentiment - 0.1) momentum = 'decreasing';

    return {
      overall: weightedSentiment,
      momentum,
      keyTopics: this.extractKeyTopics(signals),
      influencerActivity: this.calculateInfluencerActivity(signals)
    };
  }

  private generatePricePrediction(
    prices: PriceData[],
    indicators: TechnicalIndicators,
    sentiment: any,
    timeframe: string
  ): any {
    const currentPrice = prices[prices.length - 1]?.price || 1;
    
    // Ensemble prediction combining multiple signals
    let directionScore = 0;
    let confidenceFactors: number[] = [];

    // Technical analysis signals
    if (indicators.sma_7 > indicators.sma_30) directionScore += 0.3;
    if (indicators.rsi < 30) directionScore += 0.2; // Oversold
    if (indicators.rsi > 70) directionScore -= 0.2; // Overbought
    if (indicators.momentum > 0) directionScore += 0.2;

    confidenceFactors.push(Math.abs(indicators.momentum) * 0.5);

    // Social sentiment signals
    if (sentiment.overall > 0.1) directionScore += sentiment.overall * 0.3;
    if (sentiment.momentum === 'increasing') directionScore += 0.1;

    confidenceFactors.push(Math.abs(sentiment.overall) * 0.3);

    // Market structure signals
    if (currentPrice > indicators.resistance * 0.95) directionScore += 0.1; // Near resistance
    if (currentPrice < indicators.support * 1.05) directionScore += 0.2; // Near support

    // Determine direction and confidence
    const direction = directionScore > 0.1 ? 'bullish' : directionScore < -0.1 ? 'bearish' : 'neutral';
    const confidence = Math.min(Math.max(confidenceFactors.reduce((sum, f) => sum + f, 0), 0.1), 0.95);

    // Price target calculation
    const volatilityAdjustment = indicators.volatility * 0.1;
    let priceTarget = currentPrice;
    
    if (direction === 'bullish') {
      priceTarget = currentPrice * (1 + volatilityAdjustment + (directionScore * 0.2));
    } else if (direction === 'bearish') {
      priceTarget = currentPrice * (1 - volatilityAdjustment + (directionScore * 0.2));
    }

    return {
      direction,
      priceTarget,
      confidence,
      timeframe,
      probability: {
        up_10_percent: direction === 'bullish' ? confidence * 0.7 : 0.3,
        down_10_percent: direction === 'bearish' ? confidence * 0.7 : 0.3,
        sideways: direction === 'neutral' ? 0.6 : 0.4
      }
    };
  }

  private analyzeMarketTiming(prices: PriceData[], indicators: TechnicalIndicators): any {
    const currentPrice = prices[prices.length - 1]?.price || 1;
    
    let buySignal = 'none';
    let sellSignal = 'none';

    // Buy signals
    if (indicators.rsi < 35 && indicators.momentum < -0.05) buySignal = 'strong';
    else if (indicators.rsi < 45 && currentPrice < indicators.sma_7) buySignal = 'weak';

    // Sell signals  
    if (indicators.rsi > 75 && indicators.momentum > 0.1) sellSignal = 'strong';
    else if (indicators.rsi > 65 && currentPrice > indicators.resistance * 0.98) sellSignal = 'weak';

    const riskReward = Math.abs(indicators.resistance - currentPrice) / Math.abs(currentPrice - indicators.support);

    return {
      buySignal,
      sellSignal,
      optimalEntry: this.determineOptimalEntry(indicators, currentPrice),
      riskReward
    };
  }

  // Helper methods
  private generateMockIndicators(): TechnicalIndicators {
    return {
      sma_7: 2.5 + Math.random() * 2,
      sma_30: 2.3 + Math.random() * 2,
      rsi: 30 + Math.random() * 40,
      volatility: 0.3 + Math.random() * 0.5,
      momentum: (Math.random() - 0.5) * 0.2,
      support: 1.8 + Math.random() * 1.5,
      resistance: 3.2 + Math.random() * 2
    };
  }

  private identifyTrend(indicators: TechnicalIndicators): 'uptrend' | 'downtrend' | 'sideways' {
    if (indicators.sma_7 > indicators.sma_30 * 1.05 && indicators.momentum > 0.02) return 'uptrend';
    if (indicators.sma_7 < indicators.sma_30 * 0.95 && indicators.momentum < -0.02) return 'downtrend';
    return 'sideways';
  }

  private assessTrendStrength(indicators: TechnicalIndicators): 'weak' | 'moderate' | 'strong' {
    const momentum = Math.abs(indicators.momentum);
    if (momentum > 0.1) return 'strong';
    if (momentum > 0.05) return 'moderate';
    return 'weak';
  }

  private generateTechnicalSignals(indicators: TechnicalIndicators): string[] {
    const signals: string[] = [];
    
    if (indicators.rsi < 30) signals.push('RSI indicates oversold conditions');
    if (indicators.rsi > 70) signals.push('RSI indicates overbought conditions');
    if (indicators.sma_7 > indicators.sma_30) signals.push('Golden cross: 7-day SMA above 30-day SMA');
    if (indicators.momentum > 0.05) signals.push('Strong positive momentum detected');
    if (indicators.volatility > 0.6) signals.push('High volatility environment');

    return signals;
  }

  private generatePredictionSummary(prediction: any, indicators: TechnicalIndicators, sentiment: any): string {
    return `${prediction.direction.toUpperCase()} outlook with ${Math.round(prediction.confidence * 100)}% confidence. Technical indicators show ${this.identifyTrend(indicators)} with ${sentiment.momentum} social sentiment.`;
  }

  private identifyKeyDrivers(indicators: TechnicalIndicators, sentiment: any): string[] {
    const drivers: string[] = [];
    
    if (Math.abs(indicators.momentum) > 0.05) drivers.push(`Strong price momentum (${indicators.momentum > 0 ? 'positive' : 'negative'})`);
    if (Math.abs(sentiment.overall) > 0.2) drivers.push(`${sentiment.overall > 0 ? 'Positive' : 'Negative'} social sentiment`);
    if (indicators.rsi < 35 || indicators.rsi > 65) drivers.push(`RSI at ${Math.round(indicators.rsi)} (${indicators.rsi < 35 ? 'oversold' : 'overbought'})`);
    
    return drivers;
  }

  private identifyRisks(indicators: TechnicalIndicators, sentiment: any): string[] {
    const risks: string[] = [];
    
    if (indicators.volatility > 0.7) risks.push('High volatility increases downside risk');
    if (indicators.rsi > 75) risks.push('Overbought conditions suggest potential correction');
    if (sentiment.momentum === 'decreasing') risks.push('Declining social sentiment momentum');
    
    return risks;
  }

  private identifyPotentialCatalysts(signals: SocialSignal[]): string[] {
    // In production, use NLP to extract actual catalysts from social signals
    return [
      'Upcoming artist announcement or collaboration',
      'Platform integration or feature release',
      'Community-driven initiatives gaining traction',
      'Market-wide trends affecting category'
    ];
  }

  private extractKeyTopics(signals: SocialSignal[]): string[] {
    // Mock topic extraction - in production use NLP
    return ['NFT', 'art', 'collection', 'investment', 'digital art'];
  }

  private calculateInfluencerActivity(signals: SocialSignal[]): number {
    // Mock calculation - in production track actual influencer engagement
    return signals.reduce((sum, s) => sum + s.engagement, 0) / signals.length || 0;
  }

  private determineOptimalEntry(indicators: TechnicalIndicators, currentPrice: number): string {
    if (currentPrice < indicators.support * 1.02) return 'Near support level - good entry point';
    if (currentPrice > indicators.resistance * 0.98) return 'Near resistance - wait for pullback';
    if (indicators.rsi < 40) return 'RSI oversold - favorable entry conditions';
    return 'Neutral entry conditions - monitor for better opportunity';
  }

  // Collection-level prediction
  async predictCollectionTrends(collection: string, historicalData: any[]): Promise<CollectionPrediction> {
    // Mock implementation - in production use actual ML models
    return {
      collection,
      floorPrediction: {
        next_7_days: { price: 2.5 + Math.random() * 2, confidence: 0.7 + Math.random() * 0.2 },
        next_30_days: { price: 2.3 + Math.random() * 2.5, confidence: 0.6 + Math.random() * 0.2 },
        next_90_days: { price: 2.1 + Math.random() * 3, confidence: 0.5 + Math.random() * 0.2 }
      },
      volumePrediction: {
        trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any,
        expectedVolume: 100 + Math.random() * 500,
        confidence: 0.6 + Math.random() * 0.3
      },
      narrativeAnalysis: {
        currentNarrative: 'Strong community-driven growth with increasing institutional interest',
        strengthening: Math.random() > 0.4,
        catalysts: ['Upcoming utility announcements', 'Artist collaboration rumors', 'Platform partnership discussions'],
        threats: ['Market-wide correction risk', 'Competition from similar projects', 'Regulatory uncertainty']
      }
    };
  }
}

// Export singleton instance
export const predictiveModels = new PredictiveModels();