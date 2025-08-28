// Agent Token Economics System
// Implements token distribution, staking, and governance for Eden Academy agents

export interface AgentToken {
  symbol: string;
  name: string;
  agentId: string;
  totalSupply: number;
  circulatingSupply: number;
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  stakingAPY: number;
  governanceRights: GovernanceRights;
  utilityFeatures: UtilityFeature[];
  distributionSchedule: DistributionSchedule;
  performanceMetrics: TokenPerformanceMetrics;
}

export interface GovernanceRights {
  votingPower: number; // tokens per vote
  proposalThreshold: number; // min tokens to create proposal
  decisionTypes: DecisionType[];
  stakingMultiplier: number; // voting power multiplier when staked
}

export interface DecisionType {
  type: 'training_direction' | 'collaboration_approval' | 'revenue_distribution' | 'parameter_adjustment';
  description: string;
  requiredQuorum: number; // % of total supply needed to vote
  passingThreshold: number; // % of votes needed to pass
}

export interface UtilityFeature {
  feature: string;
  description: string;
  tokenRequirement: number;
  tier: 'basic' | 'premium' | 'exclusive';
}

export interface DistributionSchedule {
  genesis: DistributionAllocation;
  training: DistributionAllocation;
  performance: DistributionAllocation;
  ecosystem: DistributionAllocation;
  community: DistributionAllocation;
  team: DistributionAllocation;
}

export interface DistributionAllocation {
  percentage: number;
  amount: number;
  vestingPeriod: number; // months
  unlockSchedule: UnlockEvent[];
}

export interface UnlockEvent {
  date: string;
  percentage: number;
  trigger?: 'time' | 'milestone' | 'performance';
  condition?: string;
}

export interface TokenPerformanceMetrics {
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  volumeChange24h: number;
  holderGrowth: number;
  stakingRatio: number; // % of supply staked
  liquidityScore: number;
  utilityScore: number;
}

export interface StakingPosition {
  holder: string;
  amount: number;
  stakedAt: string;
  lockPeriod: number; // days
  multiplier: number;
  rewards: StakingRewards;
  votingPower: number;
}

export interface StakingRewards {
  totalEarned: number;
  pendingRewards: number;
  claimableRewards: number;
  rewardRate: number; // per day
  bonusMultipliers: BonusMultiplier[];
}

export interface BonusMultiplier {
  type: 'loyalty' | 'performance' | 'governance' | 'collaboration';
  multiplier: number;
  description: string;
  active: boolean;
}

export interface CollaborationBond {
  id: string;
  agents: string[];
  bondSize: number;
  duration: number; // days
  purpose: string;
  rewards: CollaborationRewards;
  status: 'active' | 'completed' | 'failed';
  participants: string[];
}

export interface CollaborationRewards {
  successBonus: number;
  participationRewards: number;
  performanceMultiplier: number;
  culturalImpactBonus: number;
}

export class AgentTokenEconomics {
  private tokens: Map<string, AgentToken> = new Map();
  private stakingPositions: Map<string, StakingPosition[]> = new Map();
  private collaborationBonds: Map<string, CollaborationBond> = new Map();

  constructor() {
    this.initializeAgentTokens();
    console.log('🪙 Agent Token Economics System initialized');
  }

  private initializeAgentTokens() {
    const agents = [
      { id: 'abraham', symbol: 'ABRA', name: 'Abraham Token' },
      { id: 'solienne', symbol: 'SOLI', name: 'Solienne Token' }, 
      { id: 'bertha', symbol: 'BERT', name: 'Bertha Token' },
      { id: 'miyomi', symbol: 'MIYO', name: 'Miyomi Token' },
      { id: 'citizen', symbol: 'CITI', name: 'Citizen Token' },
      { id: 'sue', symbol: 'SUE', name: 'Sue Token' },
      { id: 'geppetto', symbol: 'GEPP', name: 'Geppetto Token' },
      { id: 'koru', symbol: 'KORU', name: 'Koru Token' }
    ];

    for (const agent of agents) {
      this.tokens.set(agent.id, this.createAgentToken(agent));
    }
  }

  private createAgentToken(agent: { id: string; symbol: string; name: string }): AgentToken {
    const baseSupply = 1000000; // 1M tokens
    
    return {
      symbol: agent.symbol,
      name: agent.name,
      agentId: agent.id,
      totalSupply: baseSupply,
      circulatingSupply: baseSupply * 0.3, // 30% circulating initially
      price: this.generateInitialPrice(agent.id),
      marketCap: 0, // calculated
      volume24h: Math.random() * 50000 + 10000,
      holders: Math.floor(Math.random() * 1000) + 500,
      stakingAPY: 12 + Math.random() * 18, // 12-30% APY
      governanceRights: this.createGovernanceRights(agent.id),
      utilityFeatures: this.createUtilityFeatures(agent.id),
      distributionSchedule: this.createDistributionSchedule(baseSupply),
      performanceMetrics: this.generatePerformanceMetrics()
    };
  }

  private generateInitialPrice(agentId: string): number {
    const basePrices: Record<string, number> = {
      'abraham': 2.50, // Established, premium
      'solienne': 1.80, // Rising star
      'bertha': 3.20, // Collection intelligence premium
      'miyomi': 2.10, // Trading alpha
      'citizen': 1.50, // Community governance
      'sue': 1.20, // Emerging curator
      'geppetto': 0.95, // Development stage
      'koru': 0.80 // Early stage
    };
    
    const basePrice = basePrices[agentId] || 1.0;
    const volatility = (Math.random() - 0.5) * 0.4; // ±20% volatility
    
    return Math.max(0.1, basePrice * (1 + volatility));
  }

  private createGovernanceRights(agentId: string): GovernanceRights {
    return {
      votingPower: 1, // 1 token = 1 vote
      proposalThreshold: 10000, // 10k tokens to propose
      stakingMultiplier: 1.5, // 1.5x voting power when staked
      decisionTypes: [
        {
          type: 'training_direction',
          description: 'Vote on agent training focus and methodologies',
          requiredQuorum: 15,
          passingThreshold: 60
        },
        {
          type: 'collaboration_approval',
          description: 'Approve cross-agent collaboration projects',
          requiredQuorum: 10,
          passingThreshold: 55
        },
        {
          type: 'revenue_distribution',
          description: 'Decide revenue sharing between holders and development',
          requiredQuorum: 20,
          passingThreshold: 65
        },
        {
          type: 'parameter_adjustment',
          description: 'Modify agent parameters and behavior settings',
          requiredQuorum: 25,
          passingThreshold: 70
        }
      ]
    };
  }

  private createUtilityFeatures(agentId: string): UtilityFeature[] {
    const baseFeatures = [
      {
        feature: 'Private Chat Access',
        description: 'Direct conversation with the agent',
        tokenRequirement: 100,
        tier: 'basic' as const
      },
      {
        feature: 'Priority Decision Queue',
        description: 'Get agent decisions on your submissions first',
        tokenRequirement: 500,
        tier: 'premium' as const
      },
      {
        feature: 'Training Data Submission',
        description: 'Submit data for agent training and earn rewards',
        tokenRequirement: 1000,
        tier: 'premium' as const
      },
      {
        feature: 'Agent Collaboration Rights',
        description: 'Commission exclusive collaborations',
        tokenRequirement: 5000,
        tier: 'exclusive' as const
      }
    ];

    // Add agent-specific features
    const agentSpecific: Record<string, UtilityFeature[]> = {
      'bertha': [
        {
          feature: 'Collection Analysis',
          description: 'Get BERTHA\'s analysis of your NFT portfolio',
          tokenRequirement: 250,
          tier: 'premium'
        },
        {
          feature: 'Market Intelligence Alerts',
          description: 'Real-time alerts for collection opportunities',
          tokenRequirement: 750,
          tier: 'premium'
        }
      ],
      'abraham': [
        {
          feature: 'Knowledge Synthesis Request',
          description: 'Request custom knowledge synthesis on any topic',
          tokenRequirement: 300,
          tier: 'premium'
        }
      ],
      'miyomi': [
        {
          feature: 'Trading Signals',
          description: 'Access to MIYOMI\'s prediction picks',
          tokenRequirement: 400,
          tier: 'premium'
        }
      ]
    };

    return [...baseFeatures, ...(agentSpecific[agentId] || [])];
  }

  private createDistributionSchedule(totalSupply: number): DistributionSchedule {
    return {
      genesis: {
        percentage: 20,
        amount: totalSupply * 0.2,
        vestingPeriod: 0,
        unlockSchedule: [{ date: new Date().toISOString(), percentage: 100 }]
      },
      training: {
        percentage: 25,
        amount: totalSupply * 0.25,
        vestingPeriod: 24,
        unlockSchedule: [
          { date: this.addMonths(new Date(), 6).toISOString(), percentage: 25, trigger: 'milestone', condition: 'Training Phase 1 Complete' },
          { date: this.addMonths(new Date(), 12).toISOString(), percentage: 50, trigger: 'milestone', condition: 'Training Phase 2 Complete' },
          { date: this.addMonths(new Date(), 24).toISOString(), percentage: 100, trigger: 'time' }
        ]
      },
      performance: {
        percentage: 15,
        amount: totalSupply * 0.15,
        vestingPeriod: 36,
        unlockSchedule: [
          { date: this.addMonths(new Date(), 12).toISOString(), percentage: 33, trigger: 'performance', condition: 'ROI > 20%' },
          { date: this.addMonths(new Date(), 24).toISOString(), percentage: 66, trigger: 'performance', condition: 'ROI > 35%' },
          { date: this.addMonths(new Date(), 36).toISOString(), percentage: 100, trigger: 'time' }
        ]
      },
      ecosystem: {
        percentage: 20,
        amount: totalSupply * 0.2,
        vestingPeriod: 48,
        unlockSchedule: [
          { date: this.addMonths(new Date(), 6).toISOString(), percentage: 10 },
          { date: this.addMonths(new Date(), 12).toISOString(), percentage: 25 },
          { date: this.addMonths(new Date(), 24).toISOString(), percentage: 50 },
          { date: this.addMonths(new Date(), 48).toISOString(), percentage: 100 }
        ]
      },
      community: {
        percentage: 15,
        amount: totalSupply * 0.15,
        vestingPeriod: 12,
        unlockSchedule: [
          { date: new Date().toISOString(), percentage: 50 },
          { date: this.addMonths(new Date(), 6).toISOString(), percentage: 75 },
          { date: this.addMonths(new Date(), 12).toISOString(), percentage: 100 }
        ]
      },
      team: {
        percentage: 5,
        amount: totalSupply * 0.05,
        vestingPeriod: 36,
        unlockSchedule: [
          { date: this.addMonths(new Date(), 12).toISOString(), percentage: 25 },
          { date: this.addMonths(new Date(), 24).toISOString(), percentage: 50 },
          { date: this.addMonths(new Date(), 36).toISOString(), percentage: 100 }
        ]
      }
    };
  }

  private generatePerformanceMetrics(): TokenPerformanceMetrics {
    return {
      priceChange24h: (Math.random() - 0.5) * 20, // ±10%
      priceChange7d: (Math.random() - 0.5) * 40, // ±20%
      priceChange30d: (Math.random() - 0.5) * 100, // ±50%
      volumeChange24h: (Math.random() - 0.5) * 60, // ±30%
      holderGrowth: Math.random() * 10, // 0-10% growth
      stakingRatio: 30 + Math.random() * 40, // 30-70% staked
      liquidityScore: 60 + Math.random() * 35, // 60-95 liquidity score
      utilityScore: 70 + Math.random() * 25 // 70-95 utility score
    };
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  // Public API methods
  
  getAgentToken(agentId: string): AgentToken | null {
    const token = this.tokens.get(agentId);
    if (token) {
      // Calculate real-time market cap
      token.marketCap = token.price * token.circulatingSupply;
    }
    return token || null;
  }

  getAllTokens(): AgentToken[] {
    return Array.from(this.tokens.values()).map(token => {
      token.marketCap = token.price * token.circulatingSupply;
      return token;
    });
  }

  async stakeTokens(
    holder: string, 
    agentId: string, 
    amount: number, 
    lockPeriod: number = 30
  ): Promise<StakingPosition> {
    const token = this.getAgentToken(agentId);
    if (!token) throw new Error('Token not found');

    const position: StakingPosition = {
      holder,
      amount,
      stakedAt: new Date().toISOString(),
      lockPeriod,
      multiplier: this.calculateStakingMultiplier(lockPeriod),
      rewards: {
        totalEarned: 0,
        pendingRewards: 0,
        claimableRewards: 0,
        rewardRate: (token.stakingAPY / 365) * amount / 100,
        bonusMultipliers: this.getBonusMultipliers(holder, agentId)
      },
      votingPower: amount * token.governanceRights.stakingMultiplier
    };

    // Store staking position
    const positions = this.stakingPositions.get(holder) || [];
    positions.push(position);
    this.stakingPositions.set(holder, positions);

    return position;
  }

  private calculateStakingMultiplier(lockPeriod: number): number {
    if (lockPeriod >= 365) return 2.0;
    if (lockPeriod >= 180) return 1.5;
    if (lockPeriod >= 90) return 1.25;
    if (lockPeriod >= 30) return 1.1;
    return 1.0;
  }

  private getBonusMultipliers(holder: string, agentId: string): BonusMultiplier[] {
    return [
      {
        type: 'loyalty',
        multiplier: 1.2,
        description: 'Long-term holder bonus',
        active: true
      },
      {
        type: 'governance',
        multiplier: 1.1,
        description: 'Active governance participation',
        active: Math.random() > 0.5
      }
    ];
  }

  async createCollaborationBond(
    agents: string[],
    bondSize: number,
    duration: number,
    purpose: string
  ): Promise<CollaborationBond> {
    const bond: CollaborationBond = {
      id: `bond-${Date.now()}`,
      agents,
      bondSize,
      duration,
      purpose,
      status: 'active',
      participants: [],
      rewards: {
        successBonus: bondSize * 0.2, // 20% success bonus
        participationRewards: bondSize * 0.05, // 5% participation
        performanceMultiplier: 1.5,
        culturalImpactBonus: bondSize * 0.1 // 10% cultural bonus
      }
    };

    this.collaborationBonds.set(bond.id, bond);
    return bond;
  }

  getMarketOverview(): {
    totalMarketCap: number;
    totalVolume24h: number;
    averageAPY: number;
    topPerformers: AgentToken[];
    stakingStats: {
      totalStaked: number;
      averageStakingRatio: number;
    };
  } {
    const tokens = this.getAllTokens();
    
    return {
      totalMarketCap: tokens.reduce((sum, token) => sum + token.marketCap, 0),
      totalVolume24h: tokens.reduce((sum, token) => sum + token.volume24h, 0),
      averageAPY: tokens.reduce((sum, token) => sum + token.stakingAPY, 0) / tokens.length,
      topPerformers: tokens
        .sort((a, b) => b.performanceMetrics.priceChange24h - a.performanceMetrics.priceChange24h)
        .slice(0, 3),
      stakingStats: {
        totalStaked: tokens.reduce((sum, token) => 
          sum + (token.circulatingSupply * token.performanceMetrics.stakingRatio / 100), 0
        ),
        averageStakingRatio: tokens.reduce((sum, token) => 
          sum + token.performanceMetrics.stakingRatio, 0
        ) / tokens.length
      }
    };
  }
}

// Export singleton
export const agentTokenEconomics = new AgentTokenEconomics();