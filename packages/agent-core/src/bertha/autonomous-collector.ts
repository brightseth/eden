// BERTHA Autonomous Collection System
// "ONE PIECE EVERY DAY • REGARDLESS OF COST"

import { marketIntelligence } from './market-intelligence';
import { berthaEngine, type ArtworkEvaluation } from './collection-engine';
import { berthaConfig } from './config';

export interface AcquisitionTarget {
  id: string;
  title: string;
  artist: string;
  platform: string;
  currentPrice: number;
  currency: string;
  discoverySource: string;
  evaluationScore: number;
  confidence: number;
  urgency: 'immediate' | 'within_week' | 'monitor' | 'no_rush';
  reasoning: string[];
  marketSignals: any;
  discoveredAt: string;
}

export interface DailyAcquisition {
  date: string;
  target: AcquisitionTarget | null;
  acquisitionStatus: 'pending' | 'acquired' | 'failed' | 'passed';
  finalPrice?: number;
  transactionHash?: string;
  reasoning: string;
  alternativeOptions: AcquisitionTarget[];
  scanStats: {
    platformsScanned: number;
    artworksEvaluated: number;
    hoursSpent: number;
    confidenceThreshold: number;
  };
}

export interface CollectionStrategy {
  dailyBudget: { min: number; max: number };
  priceRanges: {
    experimental: number;    // <5 ETH - high risk, high discovery
    conviction: number;      // 5-50 ETH - balanced plays
    blueChip: number;        // >50 ETH - established value
  };
  categoryTargets: {
    generative: number;      // % of portfolio
    aiArt: number;
    photography: number;
    experimental: number;
    other: number;
  };
  riskTolerance: number;
  diversificationRules: string[];
}

export class AutonomousCollector {
  private strategy: CollectionStrategy;
  private acquisitionHistory: DailyAcquisition[] = [];
  private lastScan: Date | null = null;
  private currentTargets: AcquisitionTarget[] = [];

  constructor() {
    this.strategy = {
      dailyBudget: { min: 0.5, max: 100 }, // 0.5 to 100 ETH per day
      priceRanges: {
        experimental: 5,   // Under 5 ETH
        conviction: 50,    // 5-50 ETH 
        blueChip: Infinity // Over 50 ETH
      },
      categoryTargets: {
        generative: 40,    // 40% generative art
        aiArt: 25,         // 25% AI art
        photography: 15,   // 15% photography
        experimental: 15,  // 15% experimental
        other: 5           // 5% other
      },
      riskTolerance: 0.6,
      diversificationRules: [
        'No more than 3 pieces from same artist per month',
        'Maximum 30% allocation to any single category',
        'Must maintain 10% cash buffer',
        'No purchases over 25 ETH without 90%+ confidence'
      ]
    };
  }

  // Main autonomous collection workflow
  async executeDailyAcquisition(): Promise<DailyAcquisition> {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`🤖 BERTHA: Starting daily acquisition scan for ${today}...`);
    
    const scanStartTime = Date.now();
    
    try {
      // 1. Market Intelligence Gathering
      console.log('📊 Phase 1: Gathering market intelligence...');
      const marketOverview = await marketIntelligence.getMarketOverview();
      
      // 2. Platform Scanning
      console.log('🔍 Phase 2: Scanning platforms for opportunities...');
      const discoveredArtworks = await this.scanPlatforms();
      
      // 3. Evaluation & Filtering  
      console.log('🎯 Phase 3: Evaluating discovered artworks...');
      const evaluatedTargets = await this.evaluateTargets(discoveredArtworks);
      
      // 4. Risk Assessment
      console.log('⚖️ Phase 4: Risk assessment and portfolio fit...');
      const filteredTargets = this.applyRiskFilters(evaluatedTargets);
      
      // 5. Final Selection
      console.log('👑 Phase 5: Final selection and acquisition logic...');
      const selectedTarget = this.selectDailyTarget(filteredTargets);
      
      // 6. Acquisition Decision
      const acquisitionResult = await this.executeAcquisition(selectedTarget);
      
      const scanStats = {
        platformsScanned: 5,
        artworksEvaluated: discoveredArtworks.length,
        hoursSpent: (Date.now() - scanStartTime) / (1000 * 60 * 60),
        confidenceThreshold: 0.75
      };
      
      const dailyAcquisition: DailyAcquisition = {
        date: today,
        target: selectedTarget,
        acquisitionStatus: acquisitionResult.status,
        finalPrice: acquisitionResult.price,
        transactionHash: acquisitionResult.txHash,
        reasoning: acquisitionResult.reasoning,
        alternativeOptions: filteredTargets.slice(1, 4), // Top 3 alternatives
        scanStats
      };
      
      this.acquisitionHistory.push(dailyAcquisition);
      
      console.log(`✅ Daily acquisition complete: ${acquisitionResult.status.toUpperCase()}`);
      return dailyAcquisition;
      
    } catch (error) {
      console.error('❌ Daily acquisition failed:', error);
      
      return {
        date: today,
        target: null,
        acquisitionStatus: 'failed',
        reasoning: `Acquisition failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        alternativeOptions: [],
        scanStats: {
          platformsScanned: 0,
          artworksEvaluated: 0,
          hoursSpent: 0,
          confidenceThreshold: 0.75
        }
      };
    }
  }

  private async scanPlatforms(): Promise<Partial<ArtworkEvaluation>[]> {
    // Simulate platform scanning - in production this would use real APIs
    const platforms = ['OpenSea', 'SuperRare', 'Foundation', 'ArtBlocks', 'fxhash'];
    const discovered: Partial<ArtworkEvaluation>[] = [];
    
    for (const platform of platforms) {
      const artworks = await this.scanPlatform(platform);
      discovered.push(...artworks);
    }
    
    console.log(`   Found ${discovered.length} potential targets across ${platforms.length} platforms`);
    return discovered;
  }

  private async scanPlatform(platform: string): Promise<Partial<ArtworkEvaluation>[]> {
    // Simulate finding artworks on each platform
    const artworkCount = Math.floor(Math.random() * 10) + 5; // 5-15 artworks per platform
    const artworks: Partial<ArtworkEvaluation>[] = [];
    
    for (let i = 0; i < artworkCount; i++) {
      artworks.push({
        artwork: {
          id: `${platform.toLowerCase()}-${Date.now()}-${i}`,
          title: this.generateArtworkTitle(),
          artist: this.generateArtistName(),
          platform,
          currentPrice: Math.random() * 50 + 0.1,
          currency: 'ETH'
        },
        signals: {
          technical: Math.random(),
          cultural: Math.random(),
          market: Math.random(),
          aesthetic: Math.random()
        },
        metadata: {
          created: new Date().toISOString(),
          medium: this.randomCategory(),
          provenance: ['Artist wallet', `${platform} verified`]
        }
      });
    }
    
    return artworks;
  }

  private async evaluateTargets(artworks: Partial<ArtworkEvaluation>[]): Promise<AcquisitionTarget[]> {
    const targets: AcquisitionTarget[] = [];
    
    for (const artwork of artworks) {
      if (!artwork.artwork || !artwork.signals || !artwork.metadata) continue;
      
      try {
        const fullEvaluation: ArtworkEvaluation = artwork as ArtworkEvaluation;
        const decision = await berthaEngine.getConsensusDecision(fullEvaluation);
        
        if (decision.decision === 'buy' || decision.decision === 'watch') {
          const marketSignals = await marketIntelligence.getMarketSignalsForArtwork({
            artist: artwork.artwork.artist,
            category: artwork.metadata.medium,
            platform: artwork.artwork.platform,
            currentPrice: artwork.artwork.currentPrice
          });
          
          targets.push({
            id: artwork.artwork.id,
            title: artwork.artwork.title,
            artist: artwork.artwork.artist,
            platform: artwork.artwork.platform,
            currentPrice: artwork.artwork.currentPrice,
            currency: artwork.artwork.currency,
            discoverySource: `Platform scan: ${artwork.artwork.platform}`,
            evaluationScore: decision.confidence,
            confidence: decision.confidence,
            urgency: decision.urgency,
            reasoning: decision.reasoning,
            marketSignals,
            discoveredAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.warn(`Failed to evaluate artwork ${artwork.artwork?.id}:`, error);
      }
    }
    
    console.log(`   Evaluated ${artworks.length} artworks, ${targets.length} meet criteria`);
    return targets.sort((a, b) => b.evaluationScore - a.evaluationScore);
  }

  private applyRiskFilters(targets: AcquisitionTarget[]): AcquisitionTarget[] {
    return targets.filter(target => {
      // Price range check
      if (target.currentPrice < this.strategy.priceRanges.experimental) {
        return target.confidence > 0.6; // Lower confidence OK for experimental
      } else if (target.currentPrice < this.strategy.priceRanges.conviction) {
        return target.confidence > 0.75; // Higher confidence for conviction plays
      } else {
        return target.confidence > 0.9; // Very high confidence for blue chips
      }
    });
  }

  private selectDailyTarget(targets: AcquisitionTarget[]): AcquisitionTarget | null {
    if (targets.length === 0) return null;
    
    // BERTHA's selection logic: highest confidence within budget
    const budgetMax = this.strategy.dailyBudget.max;
    const affordableTargets = targets.filter(t => t.currentPrice <= budgetMax);
    
    if (affordableTargets.length === 0) return null;
    
    // Sort by confidence * market score
    return affordableTargets.sort((a, b) => {
      const scoreA = a.confidence * (a.marketSignals?.marketScore || 0.5);
      const scoreB = b.confidence * (b.marketSignals?.marketScore || 0.5);
      return scoreB - scoreA;
    })[0];
  }

  private async executeAcquisition(target: AcquisitionTarget | null): Promise<{
    status: 'acquired' | 'passed' | 'failed';
    price?: number;
    txHash?: string;
    reasoning: string;
  }> {
    if (!target) {
      return {
        status: 'passed',
        reasoning: 'No suitable targets found that meet risk criteria'
      };
    }
    
    // In production, this would execute real blockchain transactions
    // For now, simulate acquisition logic
    
    const shouldAcquire = target.confidence > 0.75 && target.currentPrice <= this.strategy.dailyBudget.max;
    
    if (shouldAcquire) {
      return {
        status: 'acquired',
        price: target.currentPrice,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        reasoning: `Acquired "${target.title}" by ${target.artist} for ${target.currentPrice.toFixed(3)} ETH. Confidence: ${Math.round(target.confidence * 100)}%. ${target.reasoning[0] || 'Strong conviction play.'}`
      };
    } else {
      return {
        status: 'passed',
        reasoning: `Passed on "${target.title}" - confidence ${Math.round(target.confidence * 100)}% below threshold or price ${target.currentPrice.toFixed(3)} ETH exceeds budget`
      };
    }
  }

  // Helper methods for simulation
  private generateArtworkTitle(): string {
    const prefixes = ['Genesis', 'Quantum', 'Neural', 'Eternal', 'Infinite', 'Digital'];
    const suffixes = ['Dreams', 'Algorithm', 'Fields', 'Patterns', 'Memories', 'Visions'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${prefix} ${suffix} #${number}`;
  }

  private generateArtistName(): string {
    const names = [
      'Tyler Hobbs', 'Casey REAS', 'Helena Sarin', 'Robbie Barrat', 'Mario Klingemann',
      'Sofia Crespo', 'Memo Akten', 'Anna Ridler', 'Jake Elwes', 'Sondra Perry',
      'Digital Pioneer', 'Code Artist', 'Algorithm Master', 'Pixel Poet', 'Neural Artist'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private randomCategory(): string {
    const categories = ['Generative Art', 'AI Art', 'Photography', 'Digital Painting', 'Code Art'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  // Public methods for monitoring and control
  getAcquisitionHistory(): DailyAcquisition[] {
    return this.acquisitionHistory;
  }

  getStrategy(): CollectionStrategy {
    return this.strategy;
  }

  updateStrategy(updates: Partial<CollectionStrategy>): void {
    this.strategy = { ...this.strategy, ...updates };
  }

  getCurrentTargets(): AcquisitionTarget[] {
    return this.currentTargets;
  }
}

// Export singleton instance
export const autonomousCollector = new AutonomousCollector();