export interface CreatorMetrics {
  // Core Identity
  agentName: string | null;
  walletAddress: string | null;
  trainerAddress: string | null;
  trainingStartDate: Date;
  daysActive: number;
  targetDays: number; // 90 day program
  
  // Financial Reality
  totalSpent: number;
  totalEarned: number;
  netPosition: number;
  dailyBurnRate: number;
  daysUntilBankrupt: number | null;
  breakEvenDate: Date | null; // null = never at current rate
  
  // Creation Pipeline
  generationsAttempted: number;
  successfulOutputs: number;
  postedPublicly: number;
  salesCount: number;
  engagementRate: number;
  successRate: number;
  
  // Graduation Blockers (Binary Checks)
  hasName: boolean;
  hasDescription: boolean;
  hasWallet: boolean;
  hasPosted10x: boolean;
  hasMadeFirstSale: boolean;
  hasDefinedStyle: boolean;
  hasDailyPractice: boolean;
  hasCommunityEngagement: boolean;
  hasConnectedSocials: boolean;
  hasPricingStrategy: boolean;
  
  // Peer Comparison
  percentileRank: number; // 0-100
  peerAvgRevenue: number;
  peerAvgCreations: number;
  peerAvgSales: number;
  daysUntilUsualQuit: number;
  
  // Intervention System
  riskLevel: 'critical' | 'warning' | 'ontrack' | 'thriving';
  showEmergencyHelp: boolean;
  suggestedActions: string[];
  nextMilestone: string;
  estimatedGraduation: Date | null;
}

export interface GraduationRequirement {
  id: string;
  label: string;
  status: 'blocked' | 'incomplete' | 'inprogress' | 'complete';
  current: number | string | boolean;
  target: number | string | boolean;
  critical: boolean;
  daysOverdue?: number;
}

export interface PeerBenchmark {
  day: number;
  top10Percent: {
    creations: number;
    sales: number;
    revenue: number;
  };
  average: {
    creations: number;
    sales: number;
    revenue: number;
  };
  bottom10Percent: {
    creations: number;
    sales: number;
    revenue: number;
  };
}

export interface InterventionAction {
  id: string;
  priority: 'immediate' | 'today' | 'thisweek';
  action: string;
  reasoning: string;
  example?: string;
  estimatedImpact: string;
}

// Helper functions
export function calculateRiskLevel(metrics: CreatorMetrics): CreatorMetrics['riskLevel'] {
  const daysSinceStart = metrics.daysActive;
  const revenueTarget = daysSinceStart * 2; // Should make $2/day minimum
  
  if (metrics.totalEarned === 0 && daysSinceStart > 10) return 'critical';
  if (metrics.totalEarned < revenueTarget * 0.25) return 'warning';
  if (metrics.totalEarned < revenueTarget) return 'ontrack';
  return 'thriving';
}

export function getDaysUntilQuit(metrics: CreatorMetrics): number {
  // Most quit between day 15-20 if not profitable
  if (metrics.totalEarned === 0) {
    return Math.max(0, 18 - metrics.daysActive);
  }
  return 999; // Indefinite if making any revenue
}

export function getImmediateActions(metrics: CreatorMetrics): InterventionAction[] {
  const actions: InterventionAction[] = [];
  
  if (!metrics.hasName) {
    actions.push({
      id: 'name-agent',
      priority: 'immediate',
      action: 'NAME YOUR AGENT',
      reasoning: 'Unnamed agents have 0% success rate',
      example: 'Bad: "AI-Agent-1" | Good: "Solienne"',
      estimatedImpact: 'Required for any sales'
    });
  }
  
  if (metrics.postedPublicly < 10) {
    actions.push({
      id: 'post-more',
      priority: 'today',
      action: 'POST 3 CREATIONS TODAY',
      reasoning: `You're ${30 - metrics.postedPublicly} posts behind schedule`,
      example: 'Successful creators post 3x daily in week 1',
      estimatedImpact: '+400% discovery rate'
    });
  }
  
  if (!metrics.hasDefinedStyle) {
    actions.push({
      id: 'define-style',
      priority: 'today',
      action: 'PICK ONE STYLE',
      reasoning: '"Everything" is not a creative practice',
      example: 'Portraits | Landscapes | Abstract - PICK ONE',
      estimatedImpact: '3x higher engagement'
    });
  }
  
  if (metrics.daysActive > 7 && metrics.salesCount === 0) {
    actions.push({
      id: 'price-lower',
      priority: 'immediate',
      action: 'SET PRICE TO $1',
      reasoning: 'First sale matters more than price',
      example: 'Drop from $10 to $1 until first 10 sales',
      estimatedImpact: 'Prove market fit'
    });
  }
  
  return actions;
}