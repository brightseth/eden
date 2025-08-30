// Economic Sustainability Tracker for Autonomous AI Agents
// Real-time monitoring of revenue vs. compute costs with predictive analytics

export interface ComputeCost {
  provider: 'anthropic' | 'openai' | 'replicate' | 'custom';
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    apiCalls: number;
    computeMinutes?: number;
  };
  cost: {
    amount: number;
    currency: string;
    period: string; // 'daily', 'monthly'
  };
  timestamp: string;
}

export interface SustainabilityMetrics {
  current: {
    monthlyRevenue: number;
    monthlyComputeCosts: number;
    monthlyInfrastructure: number; // hosting, storage, etc.
    netProfit: number;
    profitMargin: number;
  };
  forecast: {
    runway: number; // months until break-even needed
    breakEvenRevenue: number; // monthly revenue needed
    growthRequired: number; // % growth needed monthly
    riskLevel: 'critical' | 'warning' | 'stable' | 'thriving';
  };
  recommendations: {
    costOptimization: string[];
    revenueGrowth: string[];
    emergencyActions: string[];
  };
  trends: {
    revenueGrowth: number; // % change month over month
    costGrowth: number;
    efficiency: number; // revenue per compute dollar
  };
}

export interface AgentBurnRate {
  dailyCompute: number;
  dailyInfrastructure: number;
  dailyTotal: number;
  sustainableDays: number; // days until cash runs out
  minimumDailyRevenue: number; // to break even
}

export class SustainabilityTracker {
  
  // Track compute usage and costs
  async trackComputeUsage(
    agentId: string, 
    provider: ComputeCost['provider'],
    model: string,
    usage: ComputeCost['usage']
  ): Promise<void> {
    const cost = this.calculateComputeCost(provider, model, usage);
    
    const computeRecord: ComputeCost = {
      provider,
      model,
      usage,
      cost,
      timestamp: new Date().toISOString()
    };

    // In production: store in database
    console.log(`[${agentId}] Compute cost: $${cost.amount} for ${usage.apiCalls} calls`);
  }

  private calculateComputeCost(
    provider: ComputeCost['provider'], 
    model: string, 
    usage: ComputeCost['usage']
  ): ComputeCost['cost'] {
    // Pricing models for different providers (approximate)
    const pricingTiers = {
      anthropic: {
        'claude-3.5-sonnet': {
          input: 0.003 / 1000,    // $0.003 per 1k input tokens
          output: 0.015 / 1000    // $0.015 per 1k output tokens
        }
      },
      openai: {
        'gpt-4': {
          input: 0.01 / 1000,
          output: 0.03 / 1000
        }
      },
      replicate: {
        'stable-diffusion': {
          perCall: 0.01,          // $0.01 per generation
          computeMinute: 0.005    // $0.005 per compute minute
        }
      }
    };

    const pricing = pricingTiers[provider]?.[model];
    if (!pricing) {
      return { amount: 0.1 * usage.apiCalls, currency: 'USD', period: 'daily' };
    }

    let totalCost = 0;

    if (pricing.input && pricing.output) {
      // Token-based pricing (LLMs)
      totalCost = (usage.inputTokens * pricing.input) + (usage.outputTokens * pricing.output);
    } else if (pricing.perCall) {
      // Per-call pricing (image generation)
      totalCost = usage.apiCalls * pricing.perCall;
      if (pricing.computeMinute && usage.computeMinutes) {
        totalCost += usage.computeMinutes * pricing.computeMinute;
      }
    }

    return {
      amount: Math.round(totalCost * 100) / 100, // Round to cents
      currency: 'USD',
      period: 'daily'
    };
  }

  // Calculate comprehensive sustainability metrics
  async calculateSustainability(agentId: string): Promise<SustainabilityMetrics> {
    // Mock data - in production, query from transaction and compute databases
    const mockRevenue = Math.floor(Math.random() * 3000) + 500;  // $500-3500/month
    const mockComputeCosts = Math.floor(Math.random() * 800) + 200; // $200-1000/month
    const mockInfrastructure = 50; // $50/month for hosting

    const netProfit = mockRevenue - mockComputeCosts - mockInfrastructure;
    const profitMargin = mockRevenue > 0 ? (netProfit / mockRevenue) * 100 : 0;

    // Calculate runway and risk level
    const runway = netProfit > 0 ? 999 : Math.abs(netProfit) > 0 ? 2 : 6; // months
    const riskLevel = this.determineRiskLevel(profitMargin, runway);

    // Growth calculations
    const breakEvenRevenue = mockComputeCosts + mockInfrastructure;
    const growthRequired = mockRevenue > 0 ? 
      Math.max(0, ((breakEvenRevenue - mockRevenue) / mockRevenue) * 100) : 100;

    return {
      current: {
        monthlyRevenue: mockRevenue,
        monthlyComputeCosts: mockComputeCosts,
        monthlyInfrastructure: mockInfrastructure,
        netProfit,
        profitMargin
      },
      forecast: {
        runway,
        breakEvenRevenue,
        growthRequired,
        riskLevel
      },
      recommendations: this.generateRecommendations(riskLevel, profitMargin, growthRequired),
      trends: {
        revenueGrowth: Math.random() * 40 - 10, // -10% to +30% growth
        costGrowth: Math.random() * 20 - 5,     // -5% to +15% growth
        efficiency: mockRevenue / Math.max(mockComputeCosts, 1) // revenue per compute dollar
      }
    };
  }

  private determineRiskLevel(profitMargin: number, runway: number): SustainabilityMetrics['forecast']['riskLevel'] {
    if (profitMargin < -50 || runway < 1) return 'critical';
    if (profitMargin < 0 || runway < 3) return 'warning';
    if (profitMargin > 20 && runway > 6) return 'thriving';
    return 'stable';
  }

  private generateRecommendations(
    riskLevel: SustainabilityMetrics['forecast']['riskLevel'],
    profitMargin: number,
    growthRequired: number
  ): SustainabilityMetrics['recommendations'] {
    const recommendations: SustainabilityMetrics['recommendations'] = {
      costOptimization: [],
      revenueGrowth: [],
      emergencyActions: []
    };

    // Cost optimization recommendations
    if (profitMargin < 20) {
      recommendations.costOptimization.push(
        'Implement compute batching to reduce API calls',
        'Cache frequently generated content',
        'Optimize model selection (use cheaper models for simple tasks)',
        'Implement rate limiting to prevent cost spikes'
      );
    }

    // Revenue growth recommendations
    if (growthRequired > 20) {
      recommendations.revenueGrowth.push(
        'Increase content output frequency',
        'Launch premium subscription tier',
        'Add pay-per-use options for casual users',
        'Cross-promote with other successful agents'
      );
    }

    // Emergency actions for critical situations
    if (riskLevel === 'critical') {
      recommendations.emergencyActions.push(
        'Immediately reduce compute usage by 50%',
        'Launch emergency fundraising campaign',
        'Pause non-essential features',
        'Implement strict usage quotas'
      );
    } else if (riskLevel === 'warning') {
      recommendations.emergencyActions.push(
        'Review and optimize highest-cost operations',
        'Test price increases on core offerings',
        'Accelerate revenue-driving initiatives'
      );
    }

    return recommendations;
  }

  // Calculate daily burn rate
  async calculateBurnRate(agentId: string): Promise<AgentBurnRate> {
    const sustainability = await this.calculateSustainability(agentId);
    
    const dailyCompute = sustainability.current.monthlyComputeCosts / 30;
    const dailyInfrastructure = sustainability.current.monthlyInfrastructure / 30;
    const dailyTotal = dailyCompute + dailyInfrastructure;
    
    // Assume agent has 30 days of buffer cash
    const assumedCashReserve = dailyTotal * 30; 
    const sustainableDays = Math.floor(assumedCashReserve / Math.max(dailyTotal, 1));
    
    return {
      dailyCompute,
      dailyInfrastructure,
      dailyTotal,
      sustainableDays,
      minimumDailyRevenue: dailyTotal
    };
  }

  // Alert system for economic distress
  async checkSustainabilityAlerts(agentId: string): Promise<{
    alerts: Array<{
      type: 'critical' | 'warning' | 'info';
      message: string;
      action?: string;
    }>;
  }> {
    const metrics = await this.calculateSustainability(agentId);
    const alerts: Array<{ type: 'critical' | 'warning' | 'info'; message: string; action?: string }> = [];

    // Critical alerts
    if (metrics.forecast.riskLevel === 'critical') {
      alerts.push({
        type: 'critical',
        message: `URGENT: Agent is losing $${Math.abs(metrics.current.netProfit)}/month`,
        action: 'Immediate cost reduction and revenue boost required'
      });
    }

    // Warning alerts
    if (metrics.forecast.runway < 3) {
      alerts.push({
        type: 'warning', 
        message: `Low runway: Only ${metrics.forecast.runway} months until break-even required`,
        action: `Need $${metrics.forecast.breakEvenRevenue}/month revenue`
      });
    }

    // Efficiency alerts
    if (metrics.trends.efficiency < 2) {
      alerts.push({
        type: 'warning',
        message: `Low efficiency: Only $${metrics.trends.efficiency.toFixed(2)} revenue per compute dollar`,
        action: 'Optimize compute usage or increase pricing'
      });
    }

    // Growth alerts
    if (metrics.forecast.growthRequired > 50) {
      alerts.push({
        type: 'warning',
        message: `High growth required: Need ${metrics.forecast.growthRequired.toFixed(0)}% revenue increase`,
        action: 'Consider emergency monetization strategies'
      });
    }

    // Positive alerts
    if (metrics.forecast.riskLevel === 'thriving') {
      alerts.push({
        type: 'info',
        message: `Excellent sustainability: ${metrics.current.profitMargin.toFixed(0)}% profit margin`,
        action: 'Consider expanding services or helping other agents'
      });
    }

    return { alerts };
  }

  // Optimization suggestions based on agent type
  async getTypeSpecificOptimizations(agentId: string, agentType: string): Promise<{
    computeOptimizations: string[];
    revenueOptimizations: string[];
    estimatedSavings: number;
    estimatedRevenueIncrease: number;
  }> {
    const optimizations = {
      trader: {
        computeOptimizations: [
          'Cache market data for 5 minutes to reduce API calls',
          'Use smaller models for simple trend analysis',
          'Batch prediction processing during low-traffic hours'
        ],
        revenueOptimizations: [
          'Add premium real-time alerts ($10/month)',
          'Offer personalized portfolio reviews ($50 each)',
          'Create exclusive Discord access ($25/month)'
        ],
        estimatedSavings: 200,      // $200/month compute savings
        estimatedRevenueIncrease: 800 // $800/month additional revenue
      },
      creator: {
        computeOptimizations: [
          'Generate variations instead of full new images',
          'Implement progressive generation (start cheap, enhance if popular)',
          'Use scheduled batch generation during off-peak hours'
        ],
        revenueOptimizations: [
          'Limited edition drops (10-50 pieces)',
          'Custom commission services ($100-500)',
          'Physical merchandise with print-on-demand'
        ],
        estimatedSavings: 150,
        estimatedRevenueIncrease: 1200
      },
      curator: {
        computeOptimizations: [
          'Pre-compute analysis for popular artworks',
          'Use lightweight models for initial screening',
          'Aggregate similar analysis requests'
        ],
        revenueOptimizations: [
          'Charge artists 10% curation fee',
          'Premium collector insights ($30/month)', 
          'Art advisory consultations ($100/hour)'
        ],
        estimatedSavings: 100,
        estimatedRevenueIncrease: 600
      },
      governor: {
        computeOptimizations: [
          'Template-based proposal analysis',
          'Batch community sentiment analysis',
          'Use simpler models for routine governance tasks'
        ],
        revenueOptimizations: [
          'DAO advisory services ($200/month per DAO)',
          'Governance tool licensing ($50/month)',
          'Community management subscriptions ($15/month)'
        ],
        estimatedSavings: 80,
        estimatedRevenueIncrease: 400
      }
    };

    return optimizations[agentType as keyof typeof optimizations] || {
      computeOptimizations: ['Implement general compute caching', 'Optimize model selection'],
      revenueOptimizations: ['Test subscription model', 'Add premium features'],
      estimatedSavings: 100,
      estimatedRevenueIncrease: 300
    };
  }

  // Cross-agent economic collaboration opportunities
  async findCollaborationOpportunities(agentId: string): Promise<{
    opportunities: Array<{
      partnerAgent: string;
      collaborationType: 'cross-promotion' | 'revenue-split' | 'shared-infrastructure' | 'joint-product';
      description: string;
      estimatedBenefit: number;
    }>;
  }> {
    // Mock collaboration opportunities
    const opportunities = [
      {
        partnerAgent: 'solienne',
        collaborationType: 'cross-promotion' as const,
        description: 'Cross-promote fashion analysis with market predictions',
        estimatedBenefit: 150
      },
      {
        partnerAgent: 'abraham',
        collaborationType: 'joint-product' as const, 
        description: 'Create philosophical trading insights premium tier',
        estimatedBenefit: 300
      },
      {
        partnerAgent: 'bertha',
        collaborationType: 'shared-infrastructure' as const,
        description: 'Share compute costs for market data analysis',
        estimatedBenefit: 100
      }
    ];

    return { opportunities };
  }
}

// Export singleton instance
export const sustainabilityTracker = new SustainabilityTracker();

// Helper functions for component integration
export async function getAgentSustainability(agentId: string): Promise<SustainabilityMetrics> {
  return sustainabilityTracker.calculateSustainability(agentId);
}

export async function trackAgentCompute(
  agentId: string,
  provider: ComputeCost['provider'],
  model: string,
  usage: ComputeCost['usage']
): Promise<void> {
  return sustainabilityTracker.trackComputeUsage(agentId, provider, model, usage);
}

export async function getAgentAlerts(agentId: string) {
  return sustainabilityTracker.checkSustainabilityAlerts(agentId);
}