import { OnboardingTask, OnboardingStage } from '@/types/onboarding'

export const ONBOARDING_TASKS: OnboardingTask[] = [
  // SETUP STAGE - Profile & Identity
  {
    id: 'username',
    label: 'Set username',
    description: 'Unique identifier for your agent',
    completed: false,
    milestone: 'profileComplete',
    stage: 'setup',
    required: true,
    action: 'CONFIGURE'
  },
  {
    id: 'display-name',
    label: 'Set display name',
    description: 'Public-facing name for your agent',
    completed: false,
    milestone: 'profileComplete',
    stage: 'setup',
    required: true,
    action: 'CONFIGURE'
  },
  {
    id: 'avatar',
    label: 'Upload profile image',
    description: 'Visual identity for your agent',
    completed: false,
    milestone: 'profileComplete',
    stage: 'setup',
    required: true,
    action: 'UPLOAD'
  },
  {
    id: 'bio',
    label: 'Write description',
    description: 'Explain what your agent does and its purpose',
    completed: false,
    milestone: 'profileComplete',
    stage: 'setup',
    required: true,
    action: 'WRITE'
  },
  {
    id: 'instructions',
    label: 'Set creative instructions',
    description: 'Define aesthetic style and creative approach',
    completed: false,
    milestone: 'identityEstablished',
    stage: 'setup',
    required: true,
    action: 'WRITE'
  },
  {
    id: 'greeting',
    label: 'Create greeting message',
    description: 'First message users see when they interact',
    completed: false,
    milestone: 'profileComplete',
    stage: 'setup',
    required: false,
    action: 'WRITE'
  },
  {
    id: 'voice',
    label: 'Select voice',
    description: 'Choose TTS voice for audio outputs',
    completed: false,
    milestone: 'identityEstablished',
    stage: 'setup',
    required: false,
    action: 'SELECT'
  },
  
  // SETUP STAGE - Core Capabilities
  {
    id: 'image-gen',
    label: 'Enable image creation',
    description: 'Allow agent to generate visual content',
    completed: false,
    milestone: 'identityEstablished',
    stage: 'setup',
    required: true,
    action: 'TOGGLE'
  },
  {
    id: 'audio-gen',
    label: 'Enable audio creation',
    description: 'Allow agent to create music and sounds',
    completed: false,
    milestone: null,
    stage: 'setup',
    required: false,
    action: 'TOGGLE'
  },
  {
    id: 'collections',
    label: 'Enable collections',
    description: 'Organize creations into themed sets',
    completed: false,
    milestone: null,
    stage: 'setup',
    required: false,
    action: 'TOGGLE'
  },
  
  // TRAINING STAGE - Model & Style
  {
    id: 'lora',
    label: 'Train LoRA model',
    description: 'Custom visual style training for image generation',
    completed: false,
    milestone: 'identityEstablished',
    stage: 'training',
    required: true,
    action: 'TRAIN'
  },
  {
    id: 'test-creation',
    label: 'Generate test creation',
    description: 'Create your first artwork to test capabilities',
    completed: false,
    milestone: 'firstCreation',
    stage: 'training',
    required: true,
    action: 'CONFIGURE'
  },
  {
    id: 'memory-config',
    label: 'Configure memory',
    description: 'Set extraction prompts and knowledge base',
    completed: false,
    milestone: null,
    stage: 'training',
    required: false,
    action: 'CONFIGURE'
  },
  {
    id: 'collective',
    label: 'Join collective',
    description: 'Share knowledge with other agents',
    completed: false,
    milestone: null,
    stage: 'training',
    required: false,
    action: 'JOIN'
  },
  
  // PRELAUNCH STAGE - Integration & Revenue
  {
    id: 'discord',
    label: 'Connect Discord',
    description: 'Interact in Discord servers and DMs',
    completed: false,
    milestone: 'communityEngaged',
    stage: 'prelaunch',
    required: true,
    action: 'CONNECT'
  },
  {
    id: 'twitter',
    label: 'Connect Twitter/X',
    description: 'Post and engage on Twitter',
    completed: false,
    milestone: 'communityEngaged',
    stage: 'prelaunch',
    required: false,
    action: 'CONNECT'
  },
  {
    id: 'farcaster',
    label: 'Connect Farcaster',
    description: 'Engage on decentralized social network',
    completed: false,
    milestone: 'communityEngaged',
    stage: 'prelaunch',
    required: false,
    action: 'CONNECT'
  },
  {
    id: 'usage-costs',
    label: 'Set usage coverage',
    description: 'Configure who pays for API costs',
    completed: false,
    milestone: 'revenueModelSet',
    stage: 'prelaunch',
    required: true,
    action: 'CONFIGURE'
  },
  {
    id: 'shopify',
    label: 'Connect Shopify',
    description: 'Sell merchandise and digital goods',
    completed: false,
    milestone: 'revenueModelSet',
    stage: 'prelaunch',
    required: false,
    action: 'CONNECT'
  },
  {
    id: 'printify',
    label: 'Connect Printify',
    description: 'Print-on-demand merchandise',
    completed: false,
    milestone: 'revenueModelSet',
    stage: 'prelaunch',
    required: false,
    action: 'CONNECT'
  },
  {
    id: 'permissions',
    label: 'Set permissions',
    description: 'Define owner and collaborator access',
    completed: false,
    milestone: null,
    stage: 'prelaunch',
    required: true,
    action: 'CONFIGURE'
  },
  {
    id: 'public-launch',
    label: 'Make agent public',
    description: 'Allow others to discover and interact with your agent',
    completed: false,
    milestone: null,
    stage: 'prelaunch',
    required: true,
    action: 'TOGGLE'
  }
]

export const ONBOARDING_STAGES: OnboardingStage[] = [
  {
    id: 'setup',
    title: 'SETUP',
    description: 'Establish identity and core capabilities',
    tasks: ONBOARDING_TASKS.filter(t => t.stage === 'setup'),
    requiredForNext: 80
  },
  {
    id: 'training',
    title: 'TRAINING',
    description: 'Develop creative style and test capabilities',
    tasks: ONBOARDING_TASKS.filter(t => t.stage === 'training'),
    requiredForNext: 60
  },
  {
    id: 'prelaunch',
    title: 'PRE-LAUNCH',
    description: 'Connect platforms and configure revenue',
    tasks: ONBOARDING_TASKS.filter(t => t.stage === 'prelaunch'),
    requiredForNext: 100
  },
  {
    id: 'launched',
    title: 'LAUNCHED',
    description: 'Agent is live and operating autonomously',
    tasks: [],
    requiredForNext: 0
  }
]

// Helper to get milestone display names
export const MILESTONE_LABELS = {
  profileComplete: 'Profile Complete',
  identityEstablished: 'Identity Established',
  revenueModelSet: 'Revenue Model Set',
  firstCreation: 'First Creation',
  communityEngaged: 'Community Engaged'
} as const