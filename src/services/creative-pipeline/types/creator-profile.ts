/**
 * Creator Profile & Assessment Types
 * 
 * Designed to evaluate creators for Eden Academy's collaborative agent ecosystem
 * Focus: Creative expression potential, not just technical skills
 * Cultural Alignment: Supportive growth-oriented assessment
 */

export type CreativeRole = 
  | 'visual-artist'
  | 'musician'
  | 'writer'
  | 'mixed-media'
  | 'curator'
  | 'undefined';

export type AgentRole =
  | 'image-generation'
  | 'audio-creation'
  | 'text-story-generation'
  | 'multi-modal-creative'
  | 'curation-assistant'
  | 'exploration-needed';

export type OnboardingStage = 
  | 'portfolio-submission'
  | 'cultural-alignment-check'
  | 'skill-assessment'
  | 'agent-potential-mapping'
  | 'academy-integration'
  | 'training-path-selection'
  | 'completed';

// Assessment Dimensions aligned with Eden Academy values
export interface AssessmentDimension {
  name: string;
  description: string;
  weight: number; // Cultural weight in overall assessment
  culturalAlignment: string; // How this supports Eden's mission
}

export interface CreativeAssessmentResult {
  dimension: string;
  score: number; // 0-100
  evidence: string[];
  culturalNotes: string; // How this demonstrates Academy values
  growthPotential: 'high' | 'medium' | 'low';
  collaborationReadiness: number; // 0-100, key for agent partnership
}

export interface AgentPotentialMapping {
  role: AgentRole;
  confidence: number; // 0-100
  reasoning: string[];
  culturalFit: number; // 0-100, alignment with Academy mission
  trainingPathSuggestion: string;
  expectedGrowthAreas: string[];
}

export interface CreatorMeta {
  referralSource?: string;
  culturalMotivation?: string; // Why they want to join Eden Academy
  collaborationExperience?: string;
  aiExperienceLevel: 'none' | 'basic' | 'intermediate' | 'advanced';
  communityInterest: number; // 0-100
  preferredLearningStyle: 'project-based' | 'structured' | 'peer-learning' | 'self-directed';
}

export interface CreatorProfile {
  id: string;
  userId: string;
  creativeRole: CreativeRole;
  assessmentResults: CreativeAssessmentResult[];
  agentPotential: AgentPotentialMapping[];
  onboardingStage: OnboardingStage;
  culturalAlignment: number; // 0-100, fit with Eden Academy mission
  readinessScore: number; // 0-100, overall readiness for Academy
  createdAt: string;
  updatedAt: string;
  meta: CreatorMeta;
}

export interface AssessmentScore {
  id: string;
  creatorProfileId: string;
  dimension: string;
  score: number;
  maxScore: number;
  evidence: Record<string, any>;
  assessedAt: string;
  assessorType: 'ai' | 'human' | 'peer';
  culturalNotes?: string;
}

export interface PipelineSession {
  id: string;
  creatorProfileId: string;
  stage: OnboardingStage;
  startedAt: string;
  completedAt?: string;
  feedback: string[];
  nextSteps: string[];
  culturalMentorNotes?: string;
}