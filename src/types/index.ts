export interface Agent {
  id: string;
  name: string;
  artistStatement?: string;
  avatarUrl?: string | null;
  walletAddress?: string;
  currentStage: number;
  currentDay: number;
  totalDays: number;
  launchDate: string;
  daysUntilLaunch: number;
  economyMode: 'training' | 'live';
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  // New onboarding fields
  onboardingStage?: 'setup' | 'training' | 'prelaunch' | 'launched';
  onboardingPercentage?: number;
  estimatedLaunchDate?: string;
}

export interface DailyMetrics {
  id: string;
  agentId: string;
  date: string;
  creationsCount: number;
  farcasterFollowers: number;
  farcasterPosts: number;
  engagementScore: number;
  revenuePrimary: number;
  revenueSecondary: number;
  costs: number;
  walletBalance: number;
  vipCommit: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  stage: number;
  label: string;
  category: 'creative' | 'social' | 'economic' | 'technical';
  required: boolean;
  completed: boolean;
  completedAt?: Date;
  evidenceUrl?: string;
  autoCompleted: boolean;
}

export interface AgentMilestone {
  id: string;
  agentId: string;
  milestoneId: string;
  stage: number;
  name: string;
  description: string;
  isRequired: boolean;
  completed: boolean;
  completedAt?: string;
  metadata?: any;
}

export interface Task {
  id: string;
  title: string;
  category: 'creative' | 'social' | 'economic' | 'technical';
  priority: 'must' | 'should' | 'could';
  source: 'auto' | 'manual';
  completed: boolean;
  progress?: { current: number; total: number };
  relatedMilestone?: string;
}

export interface Blocker {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  action: string;
  relatedMilestone: string;
}

export interface AgentOverview {
  metrics: {
    totalCreations: number;
    revenue: number;
    vipCommits: number;
    streakDays: number;
    readinessScore: number;
  };
}

export interface AgentChecklist {
  mustDo: string[];
  shouldDo: string[];
  couldDo: string[];
  blockers: string[];
}