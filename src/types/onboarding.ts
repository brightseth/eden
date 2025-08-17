export interface OnboardingProgress {
  stage: 'setup' | 'training' | 'prelaunch' | 'launched'
  completionPercentage: number
  estimatedTimeToLaunch: string // "7 days remaining"
  milestones: {
    profileComplete: boolean
    identityEstablished: boolean
    revenueModelSet: boolean
    firstCreation: boolean
    communityEngaged: boolean
  }
}

export interface AgentOnboarding {
  agentId: string
  agentName: string
  progress: OnboardingProgress
  createdAt: Date
  lastUpdated: Date
}

export interface OnboardingTask {
  id: string
  label: string
  description: string
  completed: boolean
  milestone: keyof OnboardingProgress['milestones'] | null
  stage: OnboardingProgress['stage']
  required: boolean
  action?: 'CONFIGURE' | 'UPLOAD' | 'CONNECT' | 'TOGGLE' | 'WRITE' | 'SELECT' | 'TRAIN' | 'INVITE' | 'JOIN'
  link?: string
}

export interface OnboardingStage {
  id: OnboardingProgress['stage']
  title: string
  description: string
  tasks: OnboardingTask[]
  requiredForNext: number // percentage of tasks that must be complete
}

// Helper to calculate stage based on completion
export function calculateStage(tasks: OnboardingTask[]): OnboardingProgress['stage'] {
  const setupTasks = tasks.filter(t => t.stage === 'setup')
  const setupComplete = setupTasks.filter(t => t.completed).length / setupTasks.length
  
  if (setupComplete < 0.8) return 'setup'
  
  const trainingTasks = tasks.filter(t => t.stage === 'training')
  const trainingComplete = trainingTasks.filter(t => t.completed).length / trainingTasks.length
  
  if (trainingComplete < 0.6) return 'training'
  
  const prelaunchTasks = tasks.filter(t => t.stage === 'prelaunch')
  const prelaunchComplete = prelaunchTasks.filter(t => t.completed).length / prelaunchTasks.length
  
  if (prelaunchComplete < 1.0) return 'prelaunch'
  
  return 'launched'
}

// Helper to calculate milestones from tasks
export function calculateMilestones(tasks: OnboardingTask[]): OnboardingProgress['milestones'] {
  const completedMilestones = tasks
    .filter(t => t.completed && t.milestone)
    .map(t => t.milestone)
  
  return {
    profileComplete: completedMilestones.includes('profileComplete'),
    identityEstablished: completedMilestones.includes('identityEstablished'),
    revenueModelSet: completedMilestones.includes('revenueModelSet'),
    firstCreation: completedMilestones.includes('firstCreation'),
    communityEngaged: completedMilestones.includes('communityEngaged')
  }
}

// Helper to estimate time to launch
export function estimateTimeToLaunch(
  tasks: OnboardingTask[], 
  averageTasksPerDay: number = 3
): string {
  const remainingTasks = tasks.filter(t => !t.completed && t.required).length
  const daysRemaining = Math.ceil(remainingTasks / averageTasksPerDay)
  
  if (daysRemaining === 0) return 'Ready to launch!'
  if (daysRemaining === 1) return '1 day remaining'
  if (daysRemaining <= 7) return `${daysRemaining} days remaining`
  if (daysRemaining <= 14) return `${Math.ceil(daysRemaining / 7)} weeks remaining`
  return `${Math.ceil(daysRemaining / 30)} months remaining`
}