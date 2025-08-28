/**
 * MIYOMI Dynamic Video Concept Generator
 * Creates compelling video concepts based on real-time market data, news, and trends
 */
import { miyomiRealTimeData, RealTimeContext, MarketEvent, NewsItem, TrendingTopic } from './miyomi-realtime-data';
import { MiyomiVideoProject } from './miyomi-eden-video-generator';

export interface DynamicVideoConcept {
  id: string;
  title: string;
  hook: string;
  coreConcept: string;
  visualDNA: string;
  urgencyScore: number; // 0-100, how time-sensitive this concept is
  contrarian_angle: string;
  dataPoints: {
    primary: string; // Main data point driving the narrative
    supporting: string[]; // Supporting data points
    timestamp: string;
  };
  emotionalFrequency: {
    primary: 'cinematic' | 'intimate' | 'experimental' | 'dreamlike' | 'visceral';
    secondary: 'melancholic' | 'euphoric' | 'unsettling' | 'contemplative' | 'playful';
  };
  targetAudience: 'retail_traders' | 'crypto_natives' | 'macro_tourists' | 'contrarians' | 'gen_z_investors';
  estimatedViews: number;
  trendingPotential: 'viral' | 'high' | 'medium' | 'niche';
  scriptOutline: {
    hook: string;
    development: string;
    revelation: string;
    resonance: string;
  };
  relatedEvents: MarketEvent[];
  newsHooks: NewsItem[];
  trendingTopics: TrendingTopic[];
}

export class MiyomiDynamicConceptGenerator {
  
  /**
   * Generate fresh video concepts based on current market conditions
   */
  async generateDynamicConcepts(count: number = 5): Promise<DynamicVideoConcept[]> {
    console.log(`🧠 Generating ${count} dynamic video concepts...`);
    
    // Fetch real-time context
    const context = await miyomiRealTimeData.getRealTimeContext();
    
    // Generate concepts using different strategies
    const concepts: DynamicVideoConcept[] = [];
    
    // Strategy 1: News-driven concepts (40%)
    const newsCount = Math.ceil(count * 0.4);
    concepts.push(...await this.generateNewsBasedConcepts(context, newsCount));
    
    // Strategy 2: Market anomaly concepts (30%)
    const anomalyCount = Math.ceil(count * 0.3);
    concepts.push(...await this.generateAnomalyBasedConcepts(context, anomalyCount));
    
    // Strategy 3: Trending topic concepts (20%)
    const trendCount = Math.ceil(count * 0.2);
    concepts.push(...await this.generateTrendBasedConcepts(context, trendCount));
    
    // Strategy 4: Event anticipation concepts (10%)
    const eventCount = Math.max(1, count - concepts.length);
    concepts.push(...await this.generateEventBasedConcepts(context, eventCount));
    
    // Sort by urgency and potential
    concepts.sort((a, b) => (b.urgencyScore * b.estimatedViews) - (a.urgencyScore * a.estimatedViews));
    
    return concepts.slice(0, count);
  }

  /**
   * Generate concepts based on breaking news and sentiment shifts
   */
  private async generateNewsBasedConcepts(context: RealTimeContext, count: number): Promise<DynamicVideoConcept[]> {
    const concepts: DynamicVideoConcept[] = [];
    const relevantNews = context.news.filter(n => n.relevance > 0.7 && n.impact !== 'low');
    
    for (let i = 0; i < Math.min(count, relevantNews.length); i++) {
      const news = relevantNews[i];
      const relatedMarketData = this.findRelatedMarketData(context, news);
      
      const concept: DynamicVideoConcept = {
        id: `news_${Date.now()}_${i}`,
        title: this.generateNewsBasedTitle(news),
        hook: this.generateNewsHook(news, relatedMarketData),
        coreConcept: `Market reaction to ${news.title} reveals deeper structural imbalances`,
        visualDNA: this.generateNewsVisualDNA(news),
        urgencyScore: this.calculateNewsUrgency(news),
        contrarian_angle: this.generateContrarianAngle(news, relatedMarketData),
        dataPoints: {
          primary: this.extractPrimaryDataPoint(news, relatedMarketData),
          supporting: this.extractSupportingDataPoints(news, context),
          timestamp: context.timestamp
        },
        emotionalFrequency: this.determineEmotionalFrequency(news),
        targetAudience: this.determineTargetAudience(news),
        estimatedViews: this.estimateViews(news, context),
        trendingPotential: this.assessTrendingPotential(news, context),
        scriptOutline: this.generateScriptOutline(news, relatedMarketData),
        relatedEvents: context.events.filter(e => this.isEventRelated(e, news)),
        newsHooks: [news],
        trendingTopics: context.trending.filter(t => this.isTopicRelated(t, news))
      };
      
      concepts.push(concept);
    }
    
    return concepts;
  }

  /**
   * Generate concepts based on market anomalies and unusual patterns
   */
  private async generateAnomalyBasedConcepts(context: RealTimeContext, count: number): Promise<DynamicVideoConcept[]> {
    const concepts: DynamicVideoConcept[] = [];
    const anomalies = this.detectMarketAnomalies(context);
    
    for (let i = 0; i < Math.min(count, anomalies.length); i++) {
      const anomaly = anomalies[i];
      
      const concept: DynamicVideoConcept = {
        id: `anomaly_${Date.now()}_${i}`,
        title: `${anomaly.asset}: The ${anomaly.type} Nobody's Talking About`,
        hook: `While everyone's watching ${this.getPopularAsset(context)}, ${anomaly.asset} just did something unprecedented.`,
        coreConcept: `Mathematical impossibilities in efficient markets reveal human psychology at its most vulnerable`,
        visualDNA: this.generateAnomalyVisualDNA(anomaly),
        urgencyScore: anomaly.severity * 20, // Convert 0-5 severity to 0-100 urgency
        contrarian_angle: `The ${anomaly.type} in ${anomaly.asset} is exactly the kind of opportunity the crowd misses`,
        dataPoints: {
          primary: `${anomaly.asset} showing ${anomaly.type}: ${anomaly.magnitude}% deviation`,
          supporting: [`Historical occurrence rate: ${anomaly.frequency}`, `Market cap impact: $${anomaly.impact}M`],
          timestamp: context.timestamp
        },
        emotionalFrequency: {
          primary: 'experimental',
          secondary: 'unsettling'
        },
        targetAudience: 'contrarians',
        estimatedViews: 50000 + Math.floor(anomaly.severity * 20000),
        trendingPotential: anomaly.severity > 3 ? 'viral' : 'high',
        scriptOutline: this.generateAnomalyScriptOutline(anomaly),
        relatedEvents: [],
        newsHooks: [],
        trendingTopics: []
      };
      
      concepts.push(concept);
    }
    
    return concepts;
  }

  /**
   * Generate concepts based on trending topics and social sentiment
   */
  private async generateTrendBasedConcepts(context: RealTimeContext, count: number): Promise<DynamicVideoConcept[]> {
    const concepts: DynamicVideoConcept[] = [];
    const topTrends = context.trending.slice(0, count);
    
    for (let i = 0; i < topTrends.length; i++) {
      const trend = topTrends[i];
      const relatedMarketData = context.marketData.filter(m => 
        this.isMarketDataRelatedToTrend(m, trend)
      );
      
      const concept: DynamicVideoConcept = {
        id: `trend_${Date.now()}_${i}`,
        title: `${trend.topic}: Why the Crowd Will Get This Wrong`,
        hook: `${trend.topic} is trending. ${trend.momentum}% momentum. But here's what everyone's missing...`,
        coreConcept: `Social media trends create their own market reality, until they don't`,
        visualDNA: this.generateTrendVisualDNA(trend),
        urgencyScore: trend.momentum,
        contrarian_angle: this.generateTrendContrarianAngle(trend),
        dataPoints: {
          primary: `${trend.topic} trending with ${trend.momentum}% momentum`,
          supporting: [`Sentiment: ${trend.sentiment}`, `Sources: ${trend.sources.join(', ')}`],
          timestamp: context.timestamp
        },
        emotionalFrequency: this.determineTrendEmotionalFrequency(trend),
        targetAudience: this.determineTrendAudience(trend),
        estimatedViews: Math.floor(trend.momentum * 1000),
        trendingPotential: trend.momentum > 80 ? 'viral' : 'high',
        scriptOutline: this.generateTrendScriptOutline(trend, relatedMarketData),
        relatedEvents: [],
        newsHooks: [],
        trendingTopics: [trend]
      };
      
      concepts.push(concept);
    }
    
    return concepts;
  }

  /**
   * Generate concepts based on upcoming market events
   */
  private async generateEventBasedConcepts(context: RealTimeContext, count: number): Promise<DynamicVideoConcept[]> {
    const concepts: DynamicVideoConcept[] = [];
    const upcomingEvents = context.events.filter(e => e.impact === 'high').slice(0, count);
    
    for (const event of upcomingEvents) {
      const concept: DynamicVideoConcept = {
        id: `event_${Date.now()}_${event.id}`,
        title: `${event.title}: The Contrarian's Guide`,
        hook: `Everyone's positioning for ${event.title}. Consensus says ${event.consensusView}. I see it differently.`,
        coreConcept: `Market expectations create their own distortions, especially when everyone's watching`,
        visualDNA: this.generateEventVisualDNA(event),
        urgencyScore: this.calculateEventUrgency(event),
        contrarian_angle: event.contrarian_angle || `The market's ${event.consensusView} assumption is likely wrong`,
        dataPoints: {
          primary: `${event.title} - ${Math.round(event.probability * 100)}% market probability`,
          supporting: [`Consensus: ${event.consensusView}`, `Affected assets: ${event.affectedAssets.join(', ')}`],
          timestamp: context.timestamp
        },
        emotionalFrequency: {
          primary: 'cinematic',
          secondary: 'contemplative'
        },
        targetAudience: 'macro_tourists',
        estimatedViews: event.impact === 'high' ? 100000 : 50000,
        trendingPotential: event.impact === 'high' ? 'viral' : 'high',
        scriptOutline: this.generateEventScriptOutline(event),
        relatedEvents: [event],
        newsHooks: [],
        trendingTopics: []
      };
      
      concepts.push(concept);
    }
    
    return concepts;
  }

  // Helper methods for concept generation
  
  private detectMarketAnomalies(context: RealTimeContext): Array<{
    asset: string;
    type: 'volume_spike' | 'volatility_crush' | 'correlation_break' | 'momentum_divergence';
    magnitude: number;
    severity: number; // 1-5
    frequency: string; // "1 in X events"
    impact: number; // Market cap impact in millions
  }> {
    const anomalies = [];
    
    for (const asset of context.marketData) {
      // Volume spike detection
      if (asset.volume > 1000000) { // Simplified threshold
        anomalies.push({
          asset: asset.symbol,
          type: 'volume_spike',
          magnitude: 150, // % above average
          severity: 4,
          frequency: '1 in 50 events',
          impact: Math.floor(asset.volume / 10000)
        });
      }
      
      // Volatility analysis
      if (asset.volatility > 25) {
        anomalies.push({
          asset: asset.symbol,
          type: 'volatility_crush',
          magnitude: asset.volatility,
          severity: 3,
          frequency: '1 in 20 events',
          impact: Math.floor(asset.volatility * 1000)
        });
      }
    }
    
    return anomalies;
  }

  private generateNewsBasedTitle(news: NewsItem): string {
    const templates = [
      `${this.extractAssetFromNews(news)}: The Truth Behind "${news.title.split(' ').slice(0, 4).join(' ')}"`,
      `Market Missed This: ${news.title.split(':')[0]}`,
      `Why "${news.title.split(' ').slice(0, 3).join(' ')}" Changes Everything`,
      `The Real Story Behind ${news.source}'s "${news.title.split(' ').slice(0, 4).join(' ')}"`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateNewsHook(news: NewsItem, marketData: any[]): string {
    const sentiment = news.sentiment === 'positive' ? 'bullish' : 'bearish';
    const hooks = [
      `${news.source} just reported "${news.title.split(' ').slice(0, 6).join(' ')}" - but the market's ${sentiment} reaction is missing the point.`,
      `Everyone's focused on "${news.title.split(' ').slice(0, 4).join(' ')}" - I'm watching what they're ignoring.`,
      `${news.title.split(' ').slice(0, 5).join(' ')} - here's why the consensus is wrong.`
    ];
    
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  private generateContrarianAngle(news: NewsItem, marketData: any[]): string {
    if (news.sentiment === 'positive') {
      return `While headlines celebrate, smart money is quietly positioning for the inevitable reversal`;
    } else {
      return `Peak pessimism creates the best opportunities. When everyone's selling, contrarians are buying`;
    }
  }

  private generateNewsVisualDNA(news: NewsItem): string {
    const baseVisuals = {
      'positive': 'Golden hour trading floor, rising charts as cathedral light, euphoria crystallized in geometric forms',
      'negative': 'Storm clouds over financial district, data streams flowing like rain, fear made visible through shadow play',
      'neutral': 'Liminal market spaces, probability waves intersecting, decision trees growing in digital soil'
    };
    
    return baseVisuals[news.sentiment] || baseVisuals.neutral;
  }

  private calculateNewsUrgency(news: NewsItem): number {
    const hoursOld = (Date.now() - new Date(news.publishedAt).getTime()) / (1000 * 60 * 60);
    const impactMultiplier = { high: 1, medium: 0.7, low: 0.4 }[news.impact];
    const relevanceMultiplier = news.relevance;
    
    // Urgency decays over time but is boosted by impact and relevance
    const timeDecay = Math.max(0, 100 - hoursOld * 10);
    return Math.floor(timeDecay * impactMultiplier * relevanceMultiplier);
  }

  private determineEmotionalFrequency(news: NewsItem): DynamicVideoConcept['emotionalFrequency'] {
    const mapping = {
      'high_positive': { primary: 'visceral' as const, secondary: 'euphoric' as const },
      'high_negative': { primary: 'cinematic' as const, secondary: 'unsettling' as const },
      'medium': { primary: 'experimental' as const, secondary: 'contemplative' as const },
      'low': { primary: 'intimate' as const, secondary: 'melancholic' as const }
    };
    
    const key = news.impact === 'high' ? 
      (news.sentiment === 'positive' ? 'high_positive' : 'high_negative') :
      news.impact;
    
    return mapping[key] || mapping.medium;
  }

  private determineTargetAudience(news: NewsItem): DynamicVideoConcept['targetAudience'] {
    if (news.categories.includes('crypto')) return 'crypto_natives';
    if (news.categories.includes('monetary-policy')) return 'macro_tourists';
    if (news.categories.includes('technology')) return 'gen_z_investors';
    return 'retail_traders';
  }

  private estimateViews(news: NewsItem, context: RealTimeContext): number {
    const baseViews = 10000;
    const impactMultiplier = { high: 5, medium: 2, low: 1 }[news.impact];
    const relevanceMultiplier = news.relevance * 3;
    const urgencyMultiplier = this.calculateNewsUrgency(news) / 50;
    
    return Math.floor(baseViews * impactMultiplier * relevanceMultiplier * urgencyMultiplier);
  }

  private assessTrendingPotential(news: NewsItem, context: RealTimeContext): DynamicVideoConcept['trendingPotential'] {
    const score = news.relevance * 100 + (news.impact === 'high' ? 50 : 0) + this.calculateNewsUrgency(news);
    
    if (score > 150) return 'viral';
    if (score > 100) return 'high';
    if (score > 50) return 'medium';
    return 'niche';
  }

  private generateScriptOutline(news: NewsItem, marketData: any[]): DynamicVideoConcept['scriptOutline'] {
    return {
      hook: `${news.source} says "${news.title.split(' ').slice(0, 4).join(' ')}" - but here's what they missed.`,
      development: `${news.summary} The market's ${news.sentiment} reaction tells us more about psychology than fundamentals.`,
      revelation: `While everyone's reacting to headlines, the real story is in the data: ${this.extractKeyDataPoint(marketData)}.`,
      resonance: `This isn't about being right or wrong. It's about seeing patterns before they become consensus.`
    };
  }

  // Additional helper methods
  private findRelatedMarketData(context: RealTimeContext, news: NewsItem): any[] {
    // Simple keyword matching - in production, use more sophisticated NLP
    const keywords = news.title.toLowerCase().split(' ');
    return context.marketData.filter(data => 
      keywords.some(keyword => data.symbol.toLowerCase().includes(keyword))
    );
  }

  private extractPrimaryDataPoint(news: NewsItem, marketData: any[]): string {
    if (marketData.length > 0) {
      const asset = marketData[0];
      return `${asset.symbol}: ${asset.changePercent > 0 ? '+' : ''}${asset.changePercent.toFixed(1)}% (${asset.sentiment})`;
    }
    return `${news.title.split(' ').slice(0, 3).join(' ')} - ${news.sentiment} sentiment`;
  }

  private extractSupportingDataPoints(news: NewsItem, context: RealTimeContext): string[] {
    return [
      `Overall market sentiment: ${context.marketSentiment.overall}`,
      `VIX level: ${context.marketSentiment.vixLevel.toFixed(1)}`,
      `News impact: ${news.impact}`
    ];
  }

  private extractAssetFromNews(news: NewsItem): string {
    const symbols = ['BTC', 'ETH', 'SPY', 'QQQ', 'TSLA', 'NVDA', 'AAPL', 'MSFT'];
    const title = news.title.toUpperCase();
    
    for (const symbol of symbols) {
      if (title.includes(symbol)) return symbol;
    }
    
    return 'MARKET';
  }

  private extractKeyDataPoint(marketData: any[]): string {
    if (marketData.length === 0) return 'unusual volume patterns';
    const asset = marketData[0];
    return `${asset.symbol} volume up ${Math.floor(Math.random() * 200 + 50)}%`;
  }

  private getPopularAsset(context: RealTimeContext): string {
    // Return the asset with highest volume or most mentioned in news
    const sorted = context.marketData.sort((a, b) => b.volume - a.volume);
    return sorted[0]?.symbol || 'SPY';
  }

  private generateAnomalyVisualDNA(anomaly: any): string {
    return `Mathematical chaos visualization, ${anomaly.type.replace('_', ' ')} patterns breaking through market geometry, probability distributions colliding in digital space`;
  }

  private generateAnomalyScriptOutline(anomaly: any): DynamicVideoConcept['scriptOutline'] {
    return {
      hook: `${anomaly.asset} just broke mathematics. ${anomaly.frequency} - that's how rare this is.`,
      development: `Market makers didn't see this coming. Algorithms are confused. But the pattern is clear when you know where to look.`,
      revelation: `This ${anomaly.type} signals something bigger. When efficient markets break down, opportunity emerges.`,
      resonance: `The market is a learning machine. But sometimes it forgets its own lessons.`
    };
  }

  private isEventRelated(event: MarketEvent, news: NewsItem): boolean {
    const newsText = (news.title + ' ' + news.summary).toLowerCase();
    const eventText = (event.title + ' ' + event.description).toLowerCase();
    
    // Simple keyword overlap check
    const newsWords = newsText.split(' ');
    const eventWords = eventText.split(' ');
    const overlap = newsWords.filter(word => eventWords.includes(word) && word.length > 3);
    
    return overlap.length > 2;
  }

  private isTopicRelated(topic: TrendingTopic, news: NewsItem): boolean {
    const newsText = (news.title + ' ' + news.summary).toLowerCase();
    return topic.keywords.some(keyword => newsText.includes(keyword.toLowerCase()));
  }

  private isMarketDataRelatedToTrend(marketData: any, trend: TrendingTopic): boolean {
    return trend.keywords.some(keyword => 
      marketData.symbol.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private generateTrendVisualDNA(trend: TrendingTopic): string {
    return `Social media streams crystallizing into market reality, ${trend.topic} trending waves intersecting with price action, collective consciousness made visible`;
  }

  private generateTrendContrarianAngle(trend: TrendingTopic): string {
    return `When ${trend.momentum}% momentum hits social media, smart money does the opposite of what's trending`;
  }

  private determineTrendEmotionalFrequency(trend: TrendingTopic): DynamicVideoConcept['emotionalFrequency'] {
    if (trend.momentum > 80) return { primary: 'visceral', secondary: 'euphoric' };
    if (trend.sentiment === 'negative') return { primary: 'cinematic', secondary: 'unsettling' };
    return { primary: 'experimental', secondary: 'playful' };
  }

  private determineTrendAudience(trend: TrendingTopic): DynamicVideoConcept['targetAudience'] {
    if (trend.sector === 'ai') return 'gen_z_investors';
    if (trend.sector === 'finance') return 'crypto_natives';
    return 'retail_traders';
  }

  private generateTrendScriptOutline(trend: TrendingTopic, marketData: any[]): DynamicVideoConcept['scriptOutline'] {
    return {
      hook: `${trend.topic} is everywhere. ${trend.momentum}% momentum. Everyone's talking about it. That's exactly why I'm not.`,
      development: `Social media trends create market reality - until they don't. The crowd's ${trend.sentiment} sentiment is reaching extremes.`,
      revelation: `When trending becomes trading, the smart money fades the noise. Here's the data they're ignoring.`,
      resonance: `Markets love a good story. But math doesn't care about narratives.`
    };
  }

  private generateEventVisualDNA(event: MarketEvent): string {
    const visuals = {
      'fed_meeting': 'Federal Reserve architecture, interest rate probability trees, central banker portraits dissolving into market data',
      'earnings': 'Corporate headquarters at dawn, revenue streams as flowing light, earnings calls as radio telescope signals',
      'election': 'Polling data as weather patterns, voting booths as market trading desks, democracy and capitalism intersecting'
    };
    
    return visuals[event.type] || 'Economic calendar pages turning in slow motion, market expectations crystallizing into reality';
  }

  private calculateEventUrgency(event: MarketEvent): number {
    const daysUntil = Math.ceil((new Date(event.scheduledTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const impactMultiplier = { high: 1, medium: 0.7, low: 0.4 }[event.impact];
    
    // Urgency increases as event approaches
    const timeUrgency = Math.max(0, 100 - daysUntil * 3);
    return Math.floor(timeUrgency * impactMultiplier);
  }

  private generateEventScriptOutline(event: MarketEvent): DynamicVideoConcept['scriptOutline'] {
    return {
      hook: `${event.title} in ${Math.ceil((new Date(event.scheduledTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days. Market says ${Math.round(event.probability * 100)}% chance. I see it differently.`,
      development: `${event.description} Consensus view: ${event.consensusView}. But consensus has been wrong before.`,
      revelation: `${event.contrarian_angle || 'The market is positioning for the obvious outcome, creating opportunity in the unexpected.'} Historical data suggests a different story.`,
      resonance: `Big events create big moves. But the biggest moves happen when everyone's looking the wrong way.`
    };
  }
}

// Export singleton
export const miyomiDynamicConcepts = new MiyomiDynamicConceptGenerator();