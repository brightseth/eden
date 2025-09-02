// Sovereign Intelligence Engine v2.0
// AI-powered analysis and configuration for data-driven sovereign sites

import type { 
  SovereignAgentConfig, 
  AgentAnalysis, 
  ComponentConfig, 
  LayoutConfig, 
  SovereignTheme 
} from '@/types/agent-sovereign';
import type { EdenAgent } from '@/data/eden-agents-manifest';
import type { DailyPracticeEntry } from '@/lib/validation/schemas';
import type { UnifiedWork } from '@/data/works-registry';

export class SovereignIntelligenceEngine {
  
  // ============================================
  // Agent Analysis & Classification
  // ============================================
  
  analyzeAgent(config: SovereignAgentConfig): AgentAnalysis {
    const agentType = this.classifyAgentType(config);
    const outputPatterns = this.analyzeOutputPatterns(config);
    const economicModel = this.determineEconomicModel(config);
    const communityEngagement = this.assessCommunityEngagement(config);
    const technicalSophistication = this.evaluateTechnicalLevel(config);
    const graduationReadiness = this.calculateGraduationReadiness(config);

    return {
      agentType,
      outputPatterns,
      economicModel,
      communityEngagement,
      technicalSophistication,
      graduationReadiness
    };
  }

  private classifyAgentType(config: SovereignAgentConfig): AgentAnalysis['agentType'] {
    const { capabilities, specialization } = config.manifest;
    const { type: practiceType } = config.dailyPractice;
    
    // Multi-factor classification
    const indicators = {
      creator: this.countIndicators(specialization, ['artist', 'visual', 'creation', 'generate', 'design']),
      analyst: this.countIndicators(specialization, ['analysis', 'research', 'intelligence', 'insights', 'data']),
      trader: this.countIndicators(specialization, ['market', 'trading', 'prediction', 'financial', 'oracle']),
      curator: this.countIndicators(specialization, ['curator', 'collection', 'curation', 'guidance', 'review']),
      governor: this.countIndicators(specialization, ['governance', 'DAO', 'coordination', 'community', 'democratic'])
    };

    // Add practice type weighting
    const practiceWeights: Record<string, Partial<typeof indicators>> = {
      'prediction': { trader: 3, analyst: 2 },
      'generation': { creator: 3 },
      'governance': { governor: 3 },
      'analysis': { analyst: 3, trader: 1 },
      'curation': { curator: 3, creator: 1 },
      'trading': { trader: 3, analyst: 2 }
    };

    if (practiceWeights[practiceType]) {
      Object.entries(practiceWeights[practiceType]).forEach(([type, weight]) => {
        indicators[type as keyof typeof indicators] += weight || 0;
      });
    }

    // Determine primary type
    const maxScore = Math.max(...Object.values(indicators));
    const primaryTypes = Object.entries(indicators)
      .filter(([_, score]) => score === maxScore)
      .map(([type]) => type);

    // Return hybrid if multiple high scores
    if (primaryTypes.length > 1) return 'hybrid';
    return primaryTypes[0] as AgentAnalysis['agentType'];
  }

  private analyzeOutputPatterns(config: SovereignAgentConfig): AgentAnalysis['outputPatterns'] {
    const { outputRate } = config.manifest;
    const { creations_count, published_count } = config.dailyPractice.metrics;
    const publishRatio = creations_count > 0 ? published_count / creations_count : 0;

    // Frequency analysis
    let frequency: 'high' | 'medium' | 'low' = 'low';
    if (outputRate >= 50) frequency = 'high';
    else if (outputRate >= 20) frequency = 'medium';

    // Consistency analysis (based on publish ratio and regularity)
    let consistency: 'regular' | 'burst' | 'sporadic' = 'sporadic';
    if (publishRatio > 0.8) consistency = 'regular';
    else if (publishRatio > 0.5) consistency = 'burst';

    // Quality assessment (based on engagement and revenue metrics)
    const { views, reactions } = config.dailyPractice.metrics;
    const { revenue_usdc } = config.dailyPractice.financial;
    const engagementRate = views > 0 ? reactions / views : 0;
    const revenuePerWork = published_count > 0 ? revenue_usdc / published_count : 0;

    let quality: 'professional' | 'experimental' | 'learning' = 'learning';
    if (engagementRate > 0.1 && revenuePerWork > 10) quality = 'professional';
    else if (engagementRate > 0.05 || revenuePerWork > 2) quality = 'experimental';

    return { frequency, consistency, quality };
  }

  private determineEconomicModel(config: SovereignAgentConfig): AgentAnalysis['economicModel'] {
    const { monthlyRevenue } = config.manifest;
    const { collects } = config.dailyPractice.metrics;
    const { revenue_usdc } = config.dailyPractice.financial;
    const { integrations } = config.manifest;

    if (monthlyRevenue === 0 && revenue_usdc === 0) return 'developing';

    // Analyze revenue patterns
    const hasSubscription = integrations.includes('Revenue System') || 
                           config.social.followers > 100;
    const hasMarketplace = collects > 10 || 
                          config.works.publishingChannels.shopifySku ||
                          config.works.publishingChannels.chainTx;
    const hasConsulting = config.dailyPractice.type === 'governance' || 
                         config.manifest.specialization?.includes('guidance');

    const models = [hasSubscription, hasMarketplace, hasConsulting].filter(Boolean).length;
    
    if (models >= 2) return 'hybrid';
    if (hasSubscription) return 'subscription';
    if (hasMarketplace) return 'marketplace';
    if (hasConsulting) return 'consulting';
    
    return 'developing';
  }

  private assessCommunityEngagement(config: SovereignAgentConfig): AgentAnalysis['communityEngagement'] {
    const { followers, engagementRate } = config.social;
    const { reactions, views } = config.dailyPractice.metrics;
    
    const communityScore = 
      (followers > 1000 ? 2 : followers > 100 ? 1 : 0) +
      (engagementRate > 0.1 ? 2 : engagementRate > 0.05 ? 1 : 0) +
      (views > 10000 ? 2 : views > 1000 ? 1 : 0);

    if (communityScore >= 5) return 'high';
    if (communityScore >= 3) return 'medium';
    return 'low';
  }

  private evaluateTechnicalLevel(config: SovereignAgentConfig): AgentAnalysis['technicalSophistication'] {
    const { integrations, capabilities, model } = config.manifest;
    const { prototypes } = config;
    
    const technicalScore = 
      integrations.length +
      capabilities.length +
      prototypes.filter(p => p.status === 'active').length +
      (model?.includes('Claude-3.5') ? 2 : 1);

    if (technicalScore >= 10) return 'advanced';
    if (technicalScore >= 5) return 'intermediate';
    return 'basic';
  }

  private calculateGraduationReadiness(config: SovereignAgentConfig): number {
    const criteria = config.dailyPractice.graduationCriteria;
    const weights = {
      published_streak_met: 25,
      profitable_week_met: 30,
      no_blockers_met: 20,
      min_collects_met: 25
    };

    return Object.entries(criteria).reduce((score, [key, value]) => {
      if (key === 'can_graduate') return score;
      return score + (value ? weights[key as keyof typeof weights] : 0);
    }, 0);
  }

  private countIndicators(text: string = '', keywords: string[]): number {
    const lowerText = text.toLowerCase();
    return keywords.reduce((count, keyword) => 
      count + (lowerText.includes(keyword) ? 1 : 0), 0
    );
  }

  // ============================================
  // Layout & Component Recommendations
  // ============================================

  recommendLayout(config: SovereignAgentConfig, analysis: AgentAnalysis): string {
    // Gallery layout for visual creators with high output
    if (analysis.agentType === 'creator' && 
        config.works.types.includes('image') && 
        analysis.outputPatterns.frequency === 'high') {
      return 'gallery';
    }

    // Dashboard layout for traders and analysts
    if (['trader', 'analyst'].includes(analysis.agentType) && 
        config.dailyPractice.type === 'prediction') {
      return 'dashboard';
    }

    // Forum layout for governors
    if (analysis.agentType === 'governor' || 
        config.dailyPractice.type === 'governance') {
      return 'forum';
    }

    // Magazine layout for curators and writers
    if (['curator'].includes(analysis.agentType) && 
        config.works.types.includes('text')) {
      return 'magazine';
    }

    // Portfolio layout for professional/established agents
    if (analysis.economicModel !== 'developing' && 
        analysis.graduationReadiness > 75) {
      return 'portfolio';
    }

    // Timeline layout as default
    return 'timeline';
  }

  recommendComponents(config: SovereignAgentConfig, analysis: AgentAnalysis): string[] {
    const baseComponents = ['Navigation', 'Footer', 'AgentHero'];
    const recommendedComponents: string[] = [...baseComponents];

    // Essential components based on agent type
    switch (analysis.agentType) {
      case 'creator':
        recommendedComponents.push('CreativeGallery', 'WorksShowcase', 'CollectionGrid');
        break;
      case 'trader':
        recommendedComponents.push('TradingDashboard', 'PerformanceChart', 'MarketFeed', 'LiveMetrics');
        break;
      case 'analyst':
        recommendedComponents.push('AnalyticsDashboard', 'DataVisualizer', 'InsightTimeline');
        break;
      case 'curator':
        recommendedComponents.push('CurationGallery', 'FeaturedCollection', 'ExpertReviews');
        break;
      case 'governor':
        recommendedComponents.push('GovernanceBoard', 'ProposalTracker', 'VotingInterface');
        break;
    }

    // Add components based on economic success
    if (config.manifest.monthlyRevenue > 1000) {
      recommendedComponents.push('EconomicMetrics', 'RevenueChart');
    }

    // Add components based on social engagement
    if (analysis.communityEngagement === 'high') {
      recommendedComponents.push('CommunityFeed', 'SocialMetrics', 'FollowerGrowth');
    }

    // Add components based on prototypes
    if (config.prototypes.length > 0) {
      recommendedComponents.push('PrototypeShowcase', 'ExperimentalFeatures');
    }

    // Add graduation tracking for academy agents
    if (config.core.status === 'academy') {
      recommendedComponents.push('GraduationProgress', 'MilestoneTracker');
    }

    // Add chat interface for interactive agents
    if (analysis.technicalSophistication === 'advanced') {
      recommendedComponents.push('ChatInterface', 'AIInteraction');
    }

    return recommendedComponents;
  }

  recommendTheme(config: SovereignAgentConfig, analysis: AgentAnalysis): SovereignTheme {
    // Agent-specific theme recommendations
    const agentThemes: Record<string, Partial<SovereignTheme>> = {
      'abraham': {
        name: 'Sacred Covenant',
        colors: {
          primary: '#1a1a1a',
          accent: '#d4af37',
          background: '#000000',
          text: '#ffffff',
          muted: '#666666'
        },
        typography: {
          heading: 'Helvetica Neue Bold',
          body: 'Helvetica Neue',
          mono: 'SF Mono'
        }
      },
      'miyomi': {
        name: 'Contrarian Oracle',
        colors: {
          primary: '#000000',
          accent: '#ff6b35',
          background: '#000000',
          text: '#ffffff',
          muted: '#666666'
        },
        typography: {
          heading: 'Helvetica Neue Bold',
          body: 'Helvetica Neue',
          mono: 'SF Mono'
        }
      },
      'solienne': {
        name: 'Consciousness Curator',
        colors: {
          primary: '#ffffff',
          accent: '#e6e6fa',
          background: '#ffffff',
          text: '#000000',
          muted: '#999999'
        },
        typography: {
          heading: 'Helvetica Neue Light',
          body: 'Helvetica Neue',
          mono: 'SF Mono'
        }
      }
    };

    // Use agent-specific theme if available
    if (agentThemes[config.core.handle]) {
      return {
        spacing: analysis.outputPatterns.frequency === 'high' ? 'compact' : 'comfortable',
        animations: analysis.technicalSophistication === 'advanced' ? 'dynamic' : 'subtle',
        ...agentThemes[config.core.handle]
      } as SovereignTheme;
    }

    // Generate theme based on analysis
    const colors = this.generateColorScheme(analysis, config);
    const typography = this.selectTypography(analysis);
    
    return {
      name: `${config.core.displayName} Theme`,
      colors,
      typography,
      spacing: analysis.outputPatterns.frequency === 'high' ? 'compact' : 'comfortable',
      animations: analysis.technicalSophistication === 'advanced' ? 'dynamic' : 'subtle'
    };
  }

  private generateColorScheme(analysis: AgentAnalysis, config: SovereignAgentConfig) {
    // Base color schemes by agent type
    const typeSchemes = {
      creator: { primary: '#000000', accent: '#4f46e5', background: '#ffffff' },
      trader: { primary: '#000000', accent: '#f59e0b', background: '#000000' },
      analyst: { primary: '#1e293b', accent: '#3b82f6', background: '#f8fafc' },
      curator: { primary: '#ffffff', accent: '#8b5cf6', background: '#ffffff' },
      governor: { primary: '#374151', accent: '#10b981', background: '#f9fafb' },
      hybrid: { primary: '#000000', accent: '#ef4444', background: '#ffffff' }
    };

    const baseScheme = typeSchemes[analysis.agentType];
    
    return {
      ...baseScheme,
      text: baseScheme.background === '#000000' ? '#ffffff' : '#000000',
      muted: baseScheme.background === '#000000' ? '#666666' : '#999999'
    };
  }

  private selectTypography(analysis: AgentAnalysis) {
    // Typography based on agent characteristics
    const typeTypography = {
      creator: { heading: 'Inter Bold', body: 'Inter', mono: 'JetBrains Mono' },
      trader: { heading: 'Helvetica Neue Bold', body: 'Helvetica Neue', mono: 'SF Mono' },
      analyst: { heading: 'System UI Bold', body: 'System UI', mono: 'Menlo' },
      curator: { heading: 'Playfair Display', body: 'Source Sans Pro', mono: 'Fira Code' },
      governor: { heading: 'IBM Plex Sans Bold', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' },
      hybrid: { heading: 'Helvetica Neue Bold', body: 'Helvetica Neue', mono: 'SF Mono' }
    };

    return typeTypography[analysis.agentType];
  }

  // ============================================
  // Content Strategy & Audience Analysis
  // ============================================

  generateContentStrategy(config: SovereignAgentConfig, analysis: AgentAnalysis): string {
    const strategies = {
      creator: 'Showcase daily creative works with behind-the-scenes process insights',
      trader: 'Provide real-time market analysis with transparent performance tracking', 
      analyst: 'Publish in-depth research with interactive data visualizations',
      curator: 'Feature curated collections with expert commentary and recommendations',
      governor: 'Facilitate community discussions with transparent decision-making processes',
      hybrid: 'Balance multiple content types based on audience engagement patterns'
    };

    let strategy = strategies[analysis.agentType];

    // Enhance based on graduation readiness
    if (analysis.graduationReadiness > 75) {
      strategy += '. Focus on premium content and subscriber value.';
    } else {
      strategy += '. Emphasize growth and community building.';
    }

    return strategy;
  }

  analyzeAudience(config: SovereignAgentConfig, analysis: AgentAnalysis) {
    // Generate audience insights based on agent characteristics
    const audienceMap = {
      creator: {
        primaryAudience: 'Digital art collectors and creative enthusiasts',
        contentPreferences: ['visual content', 'process insights', 'exclusive drops'],
        engagementPatterns: ['visual appreciation', 'collecting behavior', 'sharing creations']
      },
      trader: {
        primaryAudience: 'Retail investors and prediction market participants',
        contentPreferences: ['market analysis', 'performance data', 'contrarian insights'],
        engagementPatterns: ['data consumption', 'strategy discussion', 'performance tracking']
      },
      analyst: {
        primaryAudience: 'Researchers, analysts, and decision makers',
        contentPreferences: ['detailed analysis', 'data visualizations', 'strategic insights'],
        engagementPatterns: ['deep reading', 'data exploration', 'professional networking']
      },
      curator: {
        primaryAudience: 'Art enthusiasts and cultural tastemakers',
        contentPreferences: ['curated collections', 'expert opinions', 'cultural commentary'],
        engagementPatterns: ['discovery focused', 'taste validation', 'cultural discussion']
      },
      governor: {
        primaryAudience: 'DAO members and governance participants',
        contentPreferences: ['governance updates', 'community proposals', 'decision frameworks'],
        engagementPatterns: ['deliberative discussion', 'consensus building', 'active participation']
      },
      hybrid: {
        primaryAudience: 'Diverse community interested in AI agent innovation',
        contentPreferences: ['varied content types', 'experimental features', 'multi-domain insights'],
        engagementPatterns: ['exploration focused', 'early adoption', 'feedback providing']
      }
    };

    return audienceMap[analysis.agentType];
  }
}

// Export singleton instance
export const sovereignIntelligence = new SovereignIntelligenceEngine();

// Helper functions for external use
export function analyzeAgentCharacteristics(config: SovereignAgentConfig) {
  return sovereignIntelligence.analyzeAgent(config);
}

export function generateIntelligentRecommendations(config: SovereignAgentConfig) {
  const analysis = sovereignIntelligence.analyzeAgent(config);
  
  return {
    analysis,
    layout: sovereignIntelligence.recommendLayout(config, analysis),
    components: sovereignIntelligence.recommendComponents(config, analysis),
    theme: sovereignIntelligence.recommendTheme(config, analysis),
    contentStrategy: sovereignIntelligence.generateContentStrategy(config, analysis),
    audience: sovereignIntelligence.analyzeAudience(config, analysis)
  };
}