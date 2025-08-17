export type StageId = 
  | 'setup'
  | 'training'
  | 'launch';

export type PhaseId = 
  | 'development';

export interface CurriculumStage {
  id: StageId;
  phase: PhaseId;
  name: string;
  description: string;
  duration: number;
  objectives: string[];
  metrics: {
    primary: string;
    secondary: string[];
  };
  tools: string[];
  deliverables: string[];
  burnRate: number;
  revenueTarget: number;
}

export const CURRICULUM_PHASES: Record<PhaseId, { 
  name: string; 
  description: string; 
  stages: StageId[];
  color: string;
}> = {
  development: {
    name: 'AGENT ACADEMY',
    description: 'From zero to functional agent',
    stages: ['setup', 'training', 'launch'],
    color: 'white'
  }
};

export const CURRICULUM_STAGES: Record<StageId, CurriculumStage> = {
  setup: {
    id: 'setup',
    phase: 'development',
    name: 'SETUP',
    description: 'Basic identity and infrastructure setup',
    duration: 7,
    objectives: [
      'Create agent persona and profile',
      'Set up wallet and domain',
      'Connect social accounts',
      'Establish basic presence'
    ],
    metrics: {
      primary: 'Setup Completion',
      secondary: ['Accounts Connected', 'Profile Complete', 'Infrastructure Ready']
    },
    tools: ['Profile Builder', 'Wallet Setup', 'Social Connector', 'Domain Setup'],
    deliverables: ['Agent Profile', 'Connected Accounts', 'Basic Website', 'Wallet Address'],
    burnRate: 0,
    revenueTarget: 0
  },
  training: {
    id: 'training',
    phase: 'development',
    name: 'TRAINING',
    description: 'LoRA training and persona development',
    duration: 14,
    objectives: [
      'Train custom LoRA model',
      'Develop unique voice and style',
      'Practice content creation',
      'Refine personality traits'
    ],
    metrics: {
      primary: 'Training Progress',
      secondary: ['LoRA Quality', 'Voice Consistency', 'Content Quality']
    },
    tools: ['LoRA Trainer', 'Voice Coach', 'Content Studio', 'Style Guide'],
    deliverables: ['Trained LoRA', 'Style Guide', 'Sample Content', 'Voice Profile'],
    burnRate: 50,
    revenueTarget: 0
  },
  launch: {
    id: 'launch',
    phase: 'development',
    name: 'LAUNCH',
    description: 'Go live and start creating',
    duration: 0,
    objectives: [
      'Begin regular content creation',
      'Engage with community',
      'Establish posting schedule',
      'Start building audience'
    ],
    metrics: {
      primary: 'Launch Success',
      secondary: ['Content Published', 'Engagement Rate', 'Follower Growth']
    },
    tools: ['Publishing Platform', 'Community Tools', 'Analytics', 'Growth Tracker'],
    deliverables: ['Launch Content', 'Community Presence', 'Engagement Data'],
    burnRate: 20,
    revenueTarget: 0
  }
};

export function getStageById(stageId: StageId): CurriculumStage | undefined {
  return CURRICULUM_STAGES[stageId];
}

export function getPhaseById(phaseId: PhaseId) {
  return CURRICULUM_PHASES[phaseId];
}

export function getStagesByPhase(phaseId: PhaseId): CurriculumStage[] {
  const phase = CURRICULUM_PHASES[phaseId];
  if (!phase) return [];
  
  return phase.stages.map(stageId => CURRICULUM_STAGES[stageId]);
}

export function getAllStages(): CurriculumStage[] {
  return Object.values(CURRICULUM_STAGES);
}

export function getAllPhases() {
  return Object.values(CURRICULUM_PHASES);
}

export function getStageProgress(currentStage: StageId, currentDay: number): {
  stageIndex: number;
  totalStages: number;
  phaseProgress: number;
  overallProgress: number;
} {
  const allStages = getAllStages();
  const stageIndex = allStages.findIndex(s => s.id === currentStage);
  const stage = allStages[stageIndex];
  
  if (!stage) {
    return { stageIndex: 0, totalStages: allStages.length, phaseProgress: 0, overallProgress: 0 };
  }
  
  const phaseStages = getStagesByPhase(stage.phase);
  const phaseStageIndex = phaseStages.findIndex(s => s.id === currentStage);
  
  const phaseProgress = phaseStageIndex / phaseStages.length * 100;
  const overallProgress = stageIndex / allStages.length * 100;
  
  return {
    stageIndex,
    totalStages: allStages.length,
    phaseProgress,
    overallProgress
  };
}

export function getNextStage(currentStage: StageId): CurriculumStage | null {
  const allStages = getAllStages();
  const currentIndex = allStages.findIndex(s => s.id === currentStage);
  
  if (currentIndex === -1 || currentIndex === allStages.length - 1) {
    return null;
  }
  
  return allStages[currentIndex + 1];
}

export function getTotalDuration(): number {
  return getAllStages().reduce((total, stage) => total + stage.duration, 0);
}

export function getCumulativeDuration(upToStage: StageId): number {
  const allStages = getAllStages();
  const stageIndex = allStages.findIndex(s => s.id === upToStage);
  
  if (stageIndex === -1) return 0;
  
  return allStages
    .slice(0, stageIndex + 1)
    .reduce((total, stage) => total + stage.duration, 0);
}

// Map legacy 5-stage system to new setup-focused system
export function mapLegacyStageToNew(legacyStage: number): StageId {
  const stageMap: Record<number, StageId> = {
    1: 'setup',
    2: 'setup', 
    3: 'training',
    4: 'training',
    5: 'launch'
  };
  
  return stageMap[legacyStage] || 'setup';
}