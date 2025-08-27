/**
 * CITIZEN Economic Model
 * Governance services and DAO facilitation revenue streams
 */

export interface GovernanceRevenue {
  // Service-based revenue streams
  facilitation: {
    proposalDrafting: number;      // Fee per proposal drafted
    consensusBuilding: number;     // Fee per consensus analysis
    meetingFacilitation: number;   // Fee per governance meeting
    conflictResolution: number;    // Fee per mediation session
  };
  
  // Subscription-based services
  subscriptions: {
    fellowshipManagement: number;  // Monthly fee for DAO management
    governanceConsulting: number;  // Monthly fee for advisory services
    democraticTools: number;       // Monthly fee for governance tooling
    communityModeration: number;   // Monthly fee for community management
  };

  // Performance bonuses
  bonuses: {
    highParticipation: number;     // Bonus for >80% participation rates
    consensusAchievement: number;  // Bonus for >70% consensus scores
    conflictPrevention: number;    // Bonus for reducing governance conflicts
    fellowshipGrowth: number;      // Bonus for fellowship expansion
  };

  // Value-added services
  premium: {
    customGovernance: number;      // Fee for custom governance frameworks
    legalCompliance: number;       // Fee for regulatory compliance advice  
    stakeholderMapping: number;    // Fee for stakeholder analysis
    governanceAudits: number;      // Fee for governance health audits
  };
}

export class CitizenEconomics {
  private baseRates: GovernanceRevenue;
  private performanceMultipliers: Record<string, number>;

  constructor() {
    this.baseRates = {
      facilitation: {
        proposalDrafting: 250,      // $250 per proposal
        consensusBuilding: 150,     // $150 per analysis
        meetingFacilitation: 200,   // $200 per meeting
        conflictResolution: 300     // $300 per mediation
      },
      subscriptions: {
        fellowshipManagement: 2500, // $2,500/month base
        governanceConsulting: 1800, // $1,800/month advisory
        democraticTools: 800,       // $800/month for tooling
        communityModeration: 1200   // $1,200/month moderation
      },
      bonuses: {
        highParticipation: 500,     // $500 bonus for >80% participation
        consensusAchievement: 400,  // $400 bonus for >70% consensus
        conflictPrevention: 300,    // $300 bonus for conflict reduction
        fellowshipGrowth: 200       // $200 bonus per 10 new members
      },
      premium: {
        customGovernance: 5000,     // $5,000 per custom framework
        legalCompliance: 3000,      // $3,000 per compliance review
        stakeholderMapping: 1500,   // $1,500 per stakeholder analysis
        governanceAudits: 2000      // $2,000 per governance audit
      }
    };

    this.performanceMultipliers = {
      excellentHealth: 1.3,   // 30% bonus for >85% governance health
      goodHealth: 1.1,        // 10% bonus for >70% governance health
      needsImprovement: 0.9   // 10% reduction for <50% governance health
    };
  }

  /**
   * Calculate monthly revenue for CITIZEN
   */
  calculateMonthlyRevenue(
    governanceHealth: number,
    proposalsProcessed: number,
    meetingsFacilitated: number,
    conflictsResolved: number,
    fellowshipSize: number,
    participationRate: number
  ): {
    totalRevenue: number;
    breakdown: Record<string, number>;
    projectedAnnual: number;
  } {
    let revenue = 0;
    const breakdown: Record<string, number> = {};

    // Base subscription revenue
    const baseSubscription = this.baseRates.subscriptions.fellowshipManagement;
    breakdown.baseSubscription = baseSubscription;
    revenue += baseSubscription;

    // Facilitation services
    const facilitationRevenue = 
      (proposalsProcessed * this.baseRates.facilitation.proposalDrafting) +
      (meetingsFacilitated * this.baseRates.facilitation.meetingFacilitation) +
      (conflictsResolved * this.baseRates.facilitation.conflictResolution) +
      (proposalsProcessed * this.baseRates.facilitation.consensusBuilding * 0.8); // 80% of proposals get analysis

    breakdown.facilitation = facilitationRevenue;
    revenue += facilitationRevenue;

    // Performance bonuses
    let bonuses = 0;
    if (participationRate > 0.8) {
      bonuses += this.baseRates.bonuses.highParticipation;
    }
    if (governanceHealth > 0.7) {
      bonuses += this.baseRates.bonuses.consensusAchievement;
    }
    if (conflictsResolved < proposalsProcessed * 0.1) { // Low conflict rate
      bonuses += this.baseRates.bonuses.conflictPrevention;
    }
    
    // Fellowship growth bonus (calculated quarterly, prorated monthly)
    const fellowshipGrowthBonus = Math.floor(fellowshipSize / 10) * this.baseRates.bonuses.fellowshipGrowth / 3;
    bonuses += fellowshipGrowthBonus;

    breakdown.bonuses = bonuses;
    revenue += bonuses;

    // Premium services (estimated 1-2 per month)
    const premiumServices = 
      (this.baseRates.premium.governanceAudits * 0.5) + // 1 audit every 2 months
      (this.baseRates.premium.stakeholderMapping * 0.3); // Occasional stakeholder analysis

    breakdown.premiumServices = premiumServices;
    revenue += premiumServices;

    // Apply performance multiplier
    const healthMultiplier = this.getHealthMultiplier(governanceHealth);
    const adjustedRevenue = revenue * healthMultiplier;

    breakdown.healthMultiplier = adjustedRevenue - revenue;

    return {
      totalRevenue: Math.round(adjustedRevenue),
      breakdown,
      projectedAnnual: Math.round(adjustedRevenue * 12)
    };
  }

  /**
   * Validate launch criteria for CITIZEN
   */
  validateLaunchCriteria(
    currentMetrics: {
      governanceHealth: number;
      fellowshipSize: number;
      monthlyProposals: number;
      participationRate: number;
      consensusScore: number;
    }
  ): {
    meetsRevenueCriteria: boolean;
    projectedRevenue: number;
    projectedRetention: number;
    operationalEfficiency: number;
    recommendations: string[];
  } {
    const monthlyRevenue = this.calculateMonthlyRevenue(
      currentMetrics.governanceHealth,
      currentMetrics.monthlyProposals,
      8, // Estimated meetings per month
      2, // Estimated conflicts per month
      currentMetrics.fellowshipSize,
      currentMetrics.participationRate
    );

    // CITIZEN's unique launch criteria
    const meetsRevenueCriteria = monthlyRevenue.totalRevenue >= 7500; // $7,500/month target
    const projectedRetention = this.calculateRetention(currentMetrics);
    const operationalEfficiency = this.calculateEfficiency(currentMetrics);

    const recommendations: string[] = [];
    
    if (monthlyRevenue.totalRevenue < 7500) {
      recommendations.push('Increase fellowship size or proposal frequency to meet revenue target');
    }
    if (projectedRetention < 30) {
      recommendations.push('Improve engagement mechanisms to increase member retention');
    }
    if (operationalEfficiency < 45) {
      recommendations.push('Optimize governance processes to improve efficiency metrics');
    }
    if (currentMetrics.governanceHealth < 0.7) {
      recommendations.push('Focus on consensus building and conflict resolution');
    }

    return {
      meetsRevenueCriteria,
      projectedRevenue: monthlyRevenue.totalRevenue,
      projectedRetention,
      operationalEfficiency,
      recommendations
    };
  }

  private getHealthMultiplier(governanceHealth: number): number {
    if (governanceHealth >= 0.85) {
      return this.performanceMultipliers.excellentHealth;
    } else if (governanceHealth >= 0.70) {
      return this.performanceMultipliers.goodHealth;
    } else if (governanceHealth < 0.50) {
      return this.performanceMultipliers.needsImprovement;
    } else {
      return 1.0; // No multiplier for average health
    }
  }

  private calculateRetention(metrics: {
    governanceHealth: number;
    participationRate: number;
    consensusScore: number;
  }): number {
    // Governance retention is based on engagement and satisfaction
    const baseRetention = 25;
    const healthBonus = metrics.governanceHealth * 20;
    const participationBonus = metrics.participationRate * 15;
    const consensusBonus = metrics.consensusScore * 10;

    return Math.min(90, baseRetention + healthBonus + participationBonus + consensusBonus);
  }

  private calculateEfficiency(metrics: {
    monthlyProposals: number;
    fellowshipSize: number;
    governanceHealth: number;
  }): number {
    // Efficiency = proposals processed per fellowship member per month * health factor
    const proposalsPerMember = metrics.monthlyProposals / Math.max(1, metrics.fellowshipSize / 100);
    const baseEfficiency = Math.min(50, proposalsPerMember * 20);
    const healthMultiplier = metrics.governanceHealth;

    return Math.round(baseEfficiency * healthMultiplier);
  }

  /**
   * Generate revenue projections for different scenarios
   */
  generateProjections(scenarios: {
    conservative: { fellowshipSize: number; proposalsPerMonth: number; governanceHealth: number };
    optimistic: { fellowshipSize: number; proposalsPerMonth: number; governanceHealth: number };
    aggressive: { fellowshipSize: number; proposalsPerMonth: number; governanceHealth: number };
  }): Record<string, any> {
    const projections: Record<string, any> = {};

    Object.entries(scenarios).forEach(([scenario, metrics]) => {
      const monthlyRevenue = this.calculateMonthlyRevenue(
        metrics.governanceHealth,
        metrics.proposalsPerMonth,
        Math.min(20, metrics.proposalsPerMonth * 2), // Meetings scale with proposals
        Math.max(1, metrics.proposalsPerMonth * 0.1), // ~10% conflict rate
        metrics.fellowshipSize,
        metrics.governanceHealth * 0.9 // Participation correlates with health
      );

      projections[scenario] = {
        monthlyRevenue: monthlyRevenue.totalRevenue,
        annualRevenue: monthlyRevenue.projectedAnnual,
        breakdown: monthlyRevenue.breakdown
      };
    });

    return projections;
  }
}

export const citizenEconomics = new CitizenEconomics();