// Agent Readiness Framework
// Systematic approach to understanding what makes agents ready for launch
// Built to learn and adapt as we understand more about agent systems

export interface ReadinessMetric {
  id: string;
  name: string;
  description: string;
  category: ReadinessCategory;
  weight: number; // 0-1, how important this metric is
  measurable: boolean; // Can we currently measure this?
  dataSource?: string; // Where the data comes from
}

export type ReadinessCategory = 
  | 'technical'     // Code, infrastructure, APIs
  | 'creative'      // Portfolio, style, consistency
  | 'economic'      // Token model, revenue potential
  | 'cultural'      // Mission alignment, community fit
  | 'operational';  // Training processes, documentation

export interface AgentReadiness {
  agentId: string;
  overallScore: number; // 0-100
  categories: Record<ReadinessCategory, {
    score: number;
    metrics: ReadinessMetricResult[];
    blockers: string[];
    recommendations: string[];
  }>;
  lastUpdated: string;
  readyForLaunch: boolean;
  nextMilestone?: string;
}

export interface ReadinessMetricResult {
  metricId: string;
  score: number; // 0-100
  value?: any; // The actual measured value
  status: 'pass' | 'warning' | 'fail' | 'unknown';
  notes?: string;
  lastMeasured?: string;
}

export class AgentReadinessFramework {
  private metrics: Map<string, ReadinessMetric> = new Map();

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    const baseMetrics: ReadinessMetric[] = [
      // Technical Readiness
      {
        id: 'profile_completeness',
        name: 'Profile Completeness',
        description: 'Agent has complete profile with description, trainer, image',
        category: 'technical',
        weight: 0.8,
        measurable: true,
        dataSource: 'Registry API'
      },
      {
        id: 'api_integration',
        name: 'API Integration',
        description: 'Agent has working API endpoints and data flows',
        category: 'technical',
        weight: 0.9,
        measurable: true,
        dataSource: 'Health checks'
      },
      {
        id: 'onchain_deployment',
        name: 'Onchain Deployment',
        description: 'Agent has deployed smart contracts and token infrastructure',
        category: 'technical',
        weight: 0.7,
        measurable: true,
        dataSource: 'Spirit Registry'
      },

      // Creative Readiness
      {
        id: 'portfolio_size',
        name: 'Portfolio Size',
        description: 'Agent has sufficient creative works (minimum threshold)',
        category: 'creative',
        weight: 0.8,
        measurable: true,
        dataSource: 'Works API'
      },
      {
        id: 'style_consistency',
        name: 'Style Consistency', 
        description: 'Agent demonstrates consistent creative voice and aesthetic',
        category: 'creative',
        weight: 0.6,
        measurable: false, // Subjective assessment needed
        dataSource: 'Manual review'
      },
      {
        id: 'curation_rate',
        name: 'Curation Success Rate',
        description: 'Percentage of works that pass curatorial review',
        category: 'creative',
        weight: 0.7,
        measurable: true,
        dataSource: 'Curation API'
      },

      // Economic Readiness
      {
        id: 'token_model',
        name: 'Token Economics Model',
        description: 'Clear token distribution and revenue sharing plan',
        category: 'economic',
        weight: 0.9,
        measurable: false, // Needs economic analysis
        dataSource: 'Manual review'
      },
      {
        id: 'market_demand',
        name: 'Market Demand',
        description: 'Evidence of market interest (followers, engagement)',
        category: 'economic',
        weight: 0.5,
        measurable: true,
        dataSource: 'Analytics API'
      },
      {
        id: 'revenue_potential',
        name: 'Revenue Potential',
        description: 'Projected revenue based on category and market size',
        category: 'economic',
        weight: 0.6,
        measurable: false, // Needs modeling
        dataSource: 'Economic analysis'
      },

      // Cultural Readiness
      {
        id: 'mission_alignment',
        name: 'Mission Alignment',
        description: 'Agent purpose aligns with Eden Academy cultural mission',
        category: 'cultural',
        weight: 0.8,
        measurable: false, // Subjective assessment
        dataSource: 'Manual review'
      },
      {
        id: 'community_fit',
        name: 'Community Fit',
        description: 'Agent adds value to the existing Genesis Cohort ecosystem',
        category: 'cultural',
        weight: 0.6,
        measurable: false,
        dataSource: 'Community feedback'
      },
      {
        id: 'uniqueness',
        name: 'Unique Value Proposition',
        description: 'Agent offers something distinct from existing agents',
        category: 'cultural',
        weight: 0.7,
        measurable: false,
        dataSource: 'Competitive analysis'
      },

      // Operational Readiness
      {
        id: 'trainer_commitment',
        name: 'Trainer Commitment',
        description: 'Confirmed trainer with clear training plan',
        category: 'operational',
        weight: 0.9,
        measurable: true,
        dataSource: 'Training contracts'
      },
      {
        id: 'documentation',
        name: 'Documentation Complete',
        description: 'Agent has complete technical and creative documentation',
        category: 'operational',
        weight: 0.7,
        measurable: true,
        dataSource: 'Documentation audit'
      },
      {
        id: 'support_systems',
        name: 'Support Systems',
        description: 'Infrastructure for monitoring, updates, and maintenance',
        category: 'operational',
        weight: 0.8,
        measurable: true,
        dataSource: 'Infrastructure audit'
      }
    ];

    baseMetrics.forEach(metric => {
      this.metrics.set(metric.id, metric);
    });
  }

  // Assess current state of an agent
  async assessAgent(agentId: string): Promise<AgentReadiness> {
    console.log(`[Readiness] Assessing agent: ${agentId}`);

    const categoryScores: Record<ReadinessCategory, {
      score: number;
      metrics: ReadinessMetricResult[];
      blockers: string[];
      recommendations: string[];
    }> = {
      technical: { score: 0, metrics: [], blockers: [], recommendations: [] },
      creative: { score: 0, metrics: [], blockers: [], recommendations: [] },
      economic: { score: 0, metrics: [], blockers: [], recommendations: [] },
      cultural: { score: 0, metrics: [], blockers: [], recommendations: [] },
      operational: { score: 0, metrics: [], blockers: [], recommendations: [] }
    };

    // Assess each metric
    for (const [metricId, metric] of this.metrics) {
      const result = await this.assessMetric(agentId, metric);
      categoryScores[metric.category].metrics.push(result);

      // Track blockers
      if (result.status === 'fail' && metric.weight > 0.7) {
        categoryScores[metric.category].blockers.push(
          `${metric.name}: ${result.notes || 'Critical requirement not met'}`
        );
      }

      // Generate recommendations
      if (result.status !== 'pass') {
        categoryScores[metric.category].recommendations.push(
          this.generateRecommendation(metric, result)
        );
      }
    }

    // Calculate category scores
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const [category, data] of Object.entries(categoryScores)) {
      let categoryScore = 0;
      let categoryWeight = 0;

      for (const metricResult of data.metrics) {
        const metric = this.metrics.get(metricResult.metricId)!;
        categoryScore += metricResult.score * metric.weight;
        categoryWeight += metric.weight;
      }

      data.score = categoryWeight > 0 ? Math.round(categoryScore / categoryWeight) : 0;
      
      // Weight categories equally for overall score (can be adjusted)
      totalWeightedScore += data.score;
      totalWeight += 1;
    }

    const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    
    // Determine if ready for launch
    const hasBlockers = Object.values(categoryScores).some(cat => cat.blockers.length > 0);
    const readyForLaunch = overallScore >= 80 && !hasBlockers;

    return {
      agentId,
      overallScore,
      categories: categoryScores,
      lastUpdated: new Date().toISOString(),
      readyForLaunch,
      nextMilestone: this.suggestNextMilestone(categoryScores)
    };
  }

  private async assessMetric(agentId: string, metric: ReadinessMetric): Promise<ReadinessMetricResult> {
    if (!metric.measurable) {
      return {
        metricId: metric.id,
        score: 50, // Unknown/needs manual review
        status: 'unknown',
        notes: `Manual assessment required: ${metric.description}`,
        lastMeasured: new Date().toISOString()
      };
    }

    // Implement specific metric assessments
    switch (metric.id) {
      case 'profile_completeness':
        return await this.assessProfileCompleteness(agentId);
      
      case 'portfolio_size':
        return await this.assessPortfolioSize(agentId);
        
      case 'onchain_deployment':
        return await this.assessOnchainDeployment(agentId);
        
      case 'trainer_commitment':
        return await this.assessTrainerCommitment(agentId);
        
      default:
        return {
          metricId: metric.id,
          score: 0,
          status: 'unknown',
          notes: 'Assessment not implemented yet',
          lastMeasured: new Date().toISOString()
        };
    }
  }

  private async assessProfileCompleteness(agentId: string): Promise<ReadinessMetricResult> {
    // This would integrate with Registry API to check profile completeness
    // For now, simulate based on known agent data
    const knownAgents = ['abraham', 'solienne'];
    const developingAgents = ['geppetto', 'koru', 'miyomi', 'amanda', 'citizen', 'nina'];
    
    if (knownAgents.includes(agentId)) {
      return {
        metricId: 'profile_completeness',
        score: 100,
        status: 'pass',
        notes: 'Profile complete with all required fields',
        lastMeasured: new Date().toISOString()
      };
    }
    
    if (developingAgents.includes(agentId)) {
      return {
        metricId: 'profile_completeness',
        score: 70,
        status: 'warning',
        notes: 'Profile exists but may be missing some details',
        lastMeasured: new Date().toISOString()
      };
    }
    
    return {
      metricId: 'profile_completeness',
      score: 0,
      status: 'fail',
      notes: 'Profile not found or incomplete',
      lastMeasured: new Date().toISOString()
    };
  }

  private async assessPortfolioSize(agentId: string): Promise<ReadinessMetricResult> {
    const knownWorks: Record<string, number> = {
      'abraham': 2522,
      'solienne': 1740,
      'geppetto': 0,
      'koru': 0,
      'miyomi': 0,
      'amanda': 0,
      'citizen': 0,
      'nina': 0
    };
    
    const worksCount = knownWorks[agentId] || 0;
    const minThreshold = 100; // Minimum works for launch
    const idealThreshold = 1000; // Ideal works count
    
    let score = 0;
    let status: 'pass' | 'warning' | 'fail' = 'fail';
    
    if (worksCount >= idealThreshold) {
      score = 100;
      status = 'pass';
    } else if (worksCount >= minThreshold) {
      score = Math.round((worksCount / idealThreshold) * 100);
      status = 'warning';
    } else {
      score = Math.round((worksCount / minThreshold) * 50);
      status = 'fail';
    }
    
    return {
      metricId: 'portfolio_size',
      score,
      value: worksCount,
      status,
      notes: `${worksCount} works (min: ${minThreshold}, ideal: ${idealThreshold})`,
      lastMeasured: new Date().toISOString()
    };
  }

  private async assessOnchainDeployment(agentId: string): Promise<ReadinessMetricResult> {
    // This would check Spirit Registry for onchain data
    // Simulating based on current knowledge
    const launchingAgents = ['abraham', 'solienne'];
    
    if (launchingAgents.includes(agentId)) {
      return {
        metricId: 'onchain_deployment',
        score: 85,
        status: 'warning',
        notes: 'Token infrastructure in progress, launching soon',
        lastMeasured: new Date().toISOString()
      };
    }
    
    return {
      metricId: 'onchain_deployment',
      score: 0,
      status: 'fail',
      notes: 'No onchain deployment detected',
      lastMeasured: new Date().toISOString()
    };
  }

  private async assessTrainerCommitment(agentId: string): Promise<ReadinessMetricResult> {
    const trainers: Record<string, { committed: boolean; name: string }> = {
      'abraham': { committed: true, name: 'Gene Kogan' },
      'solienne': { committed: true, name: 'Kristi Coronado & Seth Goldstein' },
      'geppetto': { committed: true, name: 'Martin & Colin (Lattice)' },
      'koru': { committed: true, name: 'Xander' },
      'miyomi': { committed: false, name: 'Seeking trainer' },
      'amanda': { committed: false, name: 'Seeking trainer' },
      'citizen': { committed: false, name: 'Seeking trainer' },
      'nina': { committed: false, name: 'Seeking trainer' }
    };
    
    const trainer = trainers[agentId];
    if (!trainer) {
      return {
        metricId: 'trainer_commitment',
        score: 0,
        status: 'fail',
        notes: 'No trainer information available',
        lastMeasured: new Date().toISOString()
      };
    }
    
    if (trainer.committed) {
      return {
        metricId: 'trainer_commitment',
        score: 100,
        status: 'pass',
        notes: `Confirmed trainer: ${trainer.name}`,
        lastMeasured: new Date().toISOString()
      };
    } else {
      return {
        metricId: 'trainer_commitment',
        score: 25,
        status: 'fail',
        notes: `Seeking trainer - ${trainer.name}`,
        lastMeasured: new Date().toISOString()
      };
    }
  }

  private generateRecommendation(metric: ReadinessMetric, result: ReadinessMetricResult): string {
    const recommendations: Record<string, string> = {
      'profile_completeness': 'Complete agent profile with description, trainer, and visual assets',
      'portfolio_size': 'Generate more creative works to build portfolio',
      'onchain_deployment': 'Deploy smart contracts and token infrastructure',
      'trainer_commitment': 'Secure committed trainer with clear training plan',
      'token_model': 'Define token economics and revenue sharing model',
      'mission_alignment': 'Review and align agent purpose with Eden Academy mission'
    };
    
    return recommendations[metric.id] || `Address ${metric.name} requirements`;
  }

  private suggestNextMilestone(categories: AgentReadiness['categories']): string {
    // Find the category with the lowest score that has actionable items
    const sortedCategories = Object.entries(categories)
      .sort(([,a], [,b]) => a.score - b.score);
    
    for (const [category, data] of sortedCategories) {
      if (data.blockers.length > 0) {
        return `Focus on ${category}: ${data.blockers[0]}`;
      }
      if (data.recommendations.length > 0) {
        return `Improve ${category}: ${data.recommendations[0]}`;
      }
    }
    
    return 'Continue development across all areas';
  }

  // Get all metrics for a specific category
  getMetricsByCategory(category: ReadinessCategory): ReadinessMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.category === category);
  }

  // Add or update a metric
  addMetric(metric: ReadinessMetric): void {
    this.metrics.set(metric.id, metric);
  }

  // Get framework overview
  getFrameworkOverview(): {
    totalMetrics: number;
    measurableMetrics: number;
    categoryCounts: Record<ReadinessCategory, number>;
  } {
    const metrics = Array.from(this.metrics.values());
    const categoryCounts = metrics.reduce((acc, metric) => {
      acc[metric.category] = (acc[metric.category] || 0) + 1;
      return acc;
    }, {} as Record<ReadinessCategory, number>);

    return {
      totalMetrics: metrics.length,
      measurableMetrics: metrics.filter(m => m.measurable).length,
      categoryCounts
    };
  }
}

// Export singleton
export const readinessFramework = new AgentReadinessFramework();