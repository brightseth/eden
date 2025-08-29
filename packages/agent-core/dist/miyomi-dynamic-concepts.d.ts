/**
 * MIYOMI Dynamic Video Concept Generator
 * Creates compelling video concepts based on real-time market data, news, and trends
 */
import { MarketEvent, NewsItem, TrendingTopic } from './miyomi-realtime-data';
export interface DynamicVideoConcept {
    id: string;
    title: string;
    hook: string;
    coreConcept: string;
    visualDNA: string;
    urgencyScore: number;
    contrarian_angle: string;
    dataPoints: {
        primary: string;
        supporting: string[];
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
export declare class MiyomiDynamicConceptGenerator {
    /**
     * Generate fresh video concepts based on current market conditions
     */
    generateDynamicConcepts(count?: number): Promise<DynamicVideoConcept[]>;
    /**
     * Generate concepts based on breaking news and sentiment shifts
     */
    private generateNewsBasedConcepts;
    /**
     * Generate concepts based on market anomalies and unusual patterns
     */
    private generateAnomalyBasedConcepts;
    /**
     * Generate concepts based on trending topics and social sentiment
     */
    private generateTrendBasedConcepts;
    /**
     * Generate concepts based on upcoming market events
     */
    private generateEventBasedConcepts;
    private detectMarketAnomalies;
    private generateNewsBasedTitle;
    private generateNewsHook;
    private generateContrarianAngle;
    private generateNewsVisualDNA;
    private calculateNewsUrgency;
    private determineEmotionalFrequency;
    private determineTargetAudience;
    private estimateViews;
    private assessTrendingPotential;
    private generateScriptOutline;
    private findRelatedMarketData;
    private extractPrimaryDataPoint;
    private extractSupportingDataPoints;
    private extractAssetFromNews;
    private extractKeyDataPoint;
    private getPopularAsset;
    private generateAnomalyVisualDNA;
    private generateAnomalyScriptOutline;
    private isEventRelated;
    private isTopicRelated;
    private isMarketDataRelatedToTrend;
    private generateTrendVisualDNA;
    private generateTrendContrarianAngle;
    private determineTrendEmotionalFrequency;
    private determineTrendAudience;
    private generateTrendScriptOutline;
    private generateEventVisualDNA;
    private calculateEventUrgency;
    private generateEventScriptOutline;
}
export declare const miyomiDynamicConcepts: MiyomiDynamicConceptGenerator;
