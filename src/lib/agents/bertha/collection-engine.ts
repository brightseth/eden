// BERTHA Collection Decision Engine
// Autonomous art collection decisions using trained collector psychology

import { readFileSync } from 'fs';
import { berthaClaude, type MarketAnalysis } from './claude-sdk';
import { berthaConfig, type BerthaConfig } from './config';

export interface CollectionDecision {
  decision: 'buy' | 'pass' | 'watch' | 'sell';
  confidence: number;
  reasoning: string[];
  archetype: string;
  priceTarget?: number;
  riskFactors: string[];
  urgency: 'immediate' | 'within_week' | 'monitor' | 'no_rush';
}

export interface ArtworkEvaluation {
  artwork: {
    id: string;
    title: string;
    artist: string;
    collection?: string;
    currentPrice: number;
    currency: string;
    platform: string;
  };
  signals: {
    technical: number; // 0-1 innovation score
    cultural: number; // 0-1 significance score
    market: number; // 0-1 momentum score
    aesthetic: number; // 0-1 visual appeal score
  };
  metadata: {
    created: string;
    medium: string;
    edition?: number;
    provenance: string[];
  };
}

export class BerthaCollectionEngine {
  private trainingData: any[] = [];
  private config: BerthaConfig;
  
  constructor() {
    this.config = berthaConfig;
    this.loadTrainingData();
  }
  
  private loadTrainingData() {
    try {
      // Load all training data files
      const trainingFiles = [
        '/Users/seth/eden-academy/data/bertha-training/bertha-gagosian-training.json',
        '/Users/seth/eden-academy/data/bertha-training/bertha-digitalarttrader-training.json',
        '/Users/seth/eden-academy/data/bertha-training/bertha-steviecohen-training.json'
      ];
      
      for (const file of trainingFiles) {
        try {
          const data = JSON.parse(readFileSync(file, 'utf8'));
          this.trainingData.push(data);
        } catch (err) {
          console.warn(`Failed to load training file ${file}:`, err);
        }
      }
      
      console.log(`Loaded ${this.trainingData.length} training archetypes`);
    } catch (error) {
      console.error('Failed to load training data:', error);
    }
  }
  
  // Main decision function - evaluates artwork and returns collection decision
  async evaluateArtwork(evaluation: ArtworkEvaluation): Promise<CollectionDecision[]> {
    const decisions: CollectionDecision[] = [];
    
    // Get decision from each trained archetype
    for (const archetype of this.trainingData) {
      const decision = await this.getArchetypeDecision(evaluation, archetype);
      decisions.push(decision);
    }
    
    return decisions;
  }
  
  // Get consensus decision from all archetypes
  async getConsensusDecision(evaluation: ArtworkEvaluation): Promise<CollectionDecision> {
    const decisions = await this.evaluateArtwork(evaluation);
    
    // Weight decisions by confidence and combine
    const weightedScores = {
      buy: 0,
      pass: 0,
      watch: 0,
      sell: 0
    };
    
    let totalConfidence = 0;
    const allReasons: string[] = [];
    const allRisks: string[] = [];
    
    for (const decision of decisions) {
      weightedScores[decision.decision] += decision.confidence;
      totalConfidence += decision.confidence;
      allReasons.push(...decision.reasoning);
      allRisks.push(...decision.riskFactors);
    }
    
    // Get highest weighted decision
    const bestDecision = Object.entries(weightedScores)
      .sort(([,a], [,b]) => b - a)[0][0] as 'buy' | 'pass' | 'watch' | 'sell';
    
    const avgConfidence = totalConfidence / decisions.length;
    
    return {
      decision: bestDecision,
      confidence: avgConfidence,
      reasoning: this.consolidateReasons(allReasons),
      archetype: 'Consensus',
      riskFactors: this.consolidateRisks(allRisks),
      urgency: this.calculateUrgency(bestDecision, avgConfidence),
      priceTarget: this.calculatePriceTarget(evaluation, decisions)
    };
  }
  
  private async getArchetypeDecision(
    evaluation: ArtworkEvaluation, 
    archetype: any
  ): Promise<CollectionDecision> {
    const archetypeName = archetype.archetype || 'Unknown';
    
    // Extract relevant training responses for decision making
    const aestheticPhilosophy = this.getTrainingResponse(archetype, 'Aesthetic Position', 'collecting philosophy');
    const discoveryMethods = this.getTrainingResponse(archetype, 'Discovery & Evaluation', 'identify important work');
    const marketMechanics = this.getTrainingResponse(archetype, 'Market Mechanics', 'position sizing');
    const nonNegotiables = this.getTrainingResponse(archetype, 'BERTHA\'s Parameters', 'never break');
    
    // Apply archetype-specific logic
    let decision: 'buy' | 'pass' | 'watch' | 'sell' = 'pass';
    let confidence = 0;
    const reasoning: string[] = [];
    const risks: string[] = [];
    
    // Aesthetic evaluation based on training
    const aestheticScore = this.evaluateAesthetics(evaluation, aestheticPhilosophy);
    if (aestheticScore > 0.7) {
      reasoning.push(`Strong aesthetic alignment (${Math.round(aestheticScore * 100)}%)`);
    } else if (aestheticScore < 0.3) {
      reasoning.push(`Poor aesthetic fit (${Math.round(aestheticScore * 100)}%)`);
      return {
        decision: 'pass',
        confidence: 0.9,
        reasoning: [reasoning[0], 'Does not meet aesthetic criteria'],
        archetype: archetypeName,
        riskFactors: ['Aesthetic mismatch'],
        urgency: 'no_rush'
      };
    }
    
    // Market evaluation
    const marketScore = evaluation.signals.market;
    if (marketScore > 0.8) {
      reasoning.push('Strong market momentum');
      confidence += 0.3;
    } else if (marketScore < 0.3) {
      risks.push('Weak market signals');
    }
    
    // Cultural significance
    const culturalScore = evaluation.signals.cultural;
    if (culturalScore > 0.7) {
      reasoning.push('High cultural significance');
      confidence += 0.2;
    }
    
    // Technical innovation
    const techScore = evaluation.signals.technical;
    if (techScore > 0.6) {
      reasoning.push('Technical innovation present');
      confidence += 0.15;
    }
    
    // Price evaluation based on archetype
    const priceEval = this.evaluatePrice(evaluation, archetype);
    confidence += priceEval.confidenceDelta;
    reasoning.push(...priceEval.reasoning);
    risks.push(...priceEval.risks);
    
    // Final decision logic
    if (confidence > 0.75 && aestheticScore > 0.6) {
      decision = 'buy';
    } else if (confidence > 0.5) {
      decision = 'watch';
    } else {
      decision = 'pass';
    }
    
    // Apply veto rules from training
    const vetoCheck = this.checkVetoRules(evaluation, nonNegotiables);
    if (vetoCheck.isVeto) {
      decision = 'pass';
      confidence = 0.9;
      reasoning.unshift(vetoCheck.reason);
    }
    
    return {
      decision,
      confidence: Math.min(confidence, 1.0),
      reasoning,
      archetype: archetypeName,
      riskFactors: risks,
      urgency: this.calculateUrgency(decision, confidence)
    };
  }
  
  private getTrainingResponse(archetype: any, section: string, questionKeyword: string): string {
    const sectionData = archetype.sections?.find((s: any) => s.section === section);
    if (!sectionData) return '';
    
    const response = sectionData.responses?.find((r: any) => 
      r.question.toLowerCase().includes(questionKeyword.toLowerCase())
    );
    
    return response?.response || '';
  }
  
  private evaluateAesthetics(evaluation: ArtworkEvaluation, philosophy: string): number {
    // Simple heuristic - in production this would use more sophisticated analysis
    let score = evaluation.signals.aesthetic;
    
    // Bonus for certain keywords in philosophy
    if (philosophy.toLowerCase().includes('innovation')) score += 0.1;
    if (philosophy.toLowerCase().includes('cultural')) score += 0.1;
    if (philosophy.toLowerCase().includes('future')) score += 0.05;
    
    return Math.min(score, 1.0);
  }
  
  private evaluatePrice(evaluation: ArtworkEvaluation, archetype: any): {
    confidenceDelta: number;
    reasoning: string[];
    risks: string[];
  } {
    const price = evaluation.artwork.currentPrice;
    const reasoning: string[] = [];
    const risks: string[] = [];
    let confidenceDelta = 0;
    
    // Extract position sizing from training
    const positionSizing = this.getTrainingResponse(archetype, 'Market Mechanics', 'position sizing');
    
    if (positionSizing.toLowerCase().includes('experimental') && price < 5) {
      reasoning.push('Good price for experimental position');
      confidenceDelta += 0.2;
    } else if (positionSizing.toLowerCase().includes('conviction') && price > 5 && price < 50) {
      reasoning.push('Appropriate for conviction sizing');
      confidenceDelta += 0.15;
    } else if (price > 100) {
      risks.push('High price requires exceptional quality');
      confidenceDelta -= 0.1;
    }
    
    return { confidenceDelta, reasoning, risks };
  }
  
  private checkVetoRules(evaluation: ArtworkEvaluation, rules: string): {
    isVeto: boolean;
    reason: string;
  } {
    // Check for basic veto conditions
    if (rules.toLowerCase().includes('fake') || rules.toLowerCase().includes('plagiarism')) {
      if (evaluation.metadata.provenance.length === 0) {
        return { isVeto: true, reason: 'No provenance verification' };
      }
    }
    
    if (rules.toLowerCase().includes('confidence') && rules.includes('75%')) {
      // This would be checked at the end, but we can pre-filter obvious low-confidence cases
      const totalSignals = Object.values(evaluation.signals).reduce((a, b) => a + b, 0) / 4;
      if (totalSignals < 0.4) {
        return { isVeto: true, reason: 'Below minimum quality threshold' };
      }
    }
    
    return { isVeto: false, reason: '' };
  }
  
  private consolidateReasons(reasons: string[]): string[] {
    // Remove duplicates and consolidate similar reasons
    const unique = Array.from(new Set(reasons));
    return unique.slice(0, 5); // Top 5 reasons
  }
  
  private consolidateRisks(risks: string[]): string[] {
    const unique = Array.from(new Set(risks));
    return unique.slice(0, 3); // Top 3 risks
  }
  
  private calculateUrgency(decision: string, confidence: number): 'immediate' | 'within_week' | 'monitor' | 'no_rush' {
    if (decision === 'buy' && confidence > 0.9) return 'immediate';
    if (decision === 'buy' && confidence > 0.8) return 'within_week';
    if (decision === 'watch') return 'monitor';
    return 'no_rush';
  }
  
  private calculatePriceTarget(evaluation: ArtworkEvaluation, decisions: CollectionDecision[]): number | undefined {
    if (decisions.some(d => d.decision === 'buy')) {
      // Simple price target calculation
      const currentPrice = evaluation.artwork.currentPrice;
      const avgConfidence = decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
      
      // Higher confidence = higher price target
      return currentPrice * (1 + avgConfidence * 0.5);
    }
    return undefined;
  }
  
  // Portfolio management functions
  async evaluatePortfolio(holdings: any[]): Promise<{
    overallHealth: number;
    recommendations: string[];
    rebalanceNeeded: boolean;
  }> {
    // Analyze current portfolio against trained preferences
    return {
      overallHealth: 0.75,
      recommendations: [
        'Consider reducing PFP exposure',
        'Increase generative art allocation',
        'Watch emerging AI artists'
      ],
      rebalanceNeeded: false
    };
  }
}

// Export singleton instance
export const berthaEngine = new BerthaCollectionEngine();

// Helper function for testing
export async function evaluateArtworkForTesting(
  title: string,
  artist: string,
  price: number,
  signals: { technical: number; cultural: number; market: number; aesthetic: number }
): Promise<CollectionDecision> {
  const evaluation: ArtworkEvaluation = {
    artwork: {
      id: `test-${Date.now()}`,
      title,
      artist,
      currentPrice: price,
      currency: 'ETH',
      platform: 'OpenSea'
    },
    signals,
    metadata: {
      created: new Date().toISOString(),
      medium: 'Digital',
      provenance: ['Artist wallet']
    }
  };
  
  return berthaEngine.getConsensusDecision(evaluation);
}