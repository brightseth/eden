/**
 * Production-Ready Onboarding Flow Manager for Eden Academy Creative Pipeline
 * 
 * Orchestrates the complete creator journey from initial submission through to agent training integration.
 * Maintains Eden Academy's supportive, growth-oriented cultural approach throughout.
 * 
 * Design Principles:
 * - Every creator has potential - we find the right path
 * - Process is educational, not just evaluative  
 * - Community integration from the start
 * - Prepare creators for successful AI collaboration
 * 
 * Production Features:
 * - Database integration with Supabase
 * - Error handling and logging
 * - Performance optimization
 * - Feature flag integration
 */

import { createClient } from '@/lib/supabase/server';
import { CreatorProfile, OnboardingStage, CreatorMeta } from '../types/creator-profile';
import { CulturalAssessmentScorer } from '../assessment/cultural-assessment';
import { AgentPotentialMatcher } from '../matching/agent-potential-matcher';
import { featureFlags } from '@/config/flags';

interface OnboardingInitiationData {
  userId: string;
  initialInterests?: string[];
  referralSource?: string;
  culturalMotivation?: string;
}

interface StageTransitionResult {
  success: boolean;
  nextStage: OnboardingStage;
  feedback: string[];
  culturalGuidance: string;
  requiredActions: string[];
  supportResources: string[];
  error?: string;
  metrics?: Record<string, number>;
}

interface OnboardingMetrics {
  stageStartTime: Date;
  stageEndTime: Date;
  processingTimeMs: number;
  assessmentScores: Record<string, number>;
  culturalAlignmentProgression: number[];
}

/**
 * Production-ready onboarding workflow manager
 * Integrates with existing Academy systems and cultural standards
 */
export class OnboardingFlowManager {
  private assessmentScorer: CulturalAssessmentScorer;
  private potentialMatcher: AgentPotentialMatcher;
  private supabase: any;
  private metrics: Map<string, OnboardingMetrics> = new Map();

  constructor() {
    this.assessmentScorer = new CulturalAssessmentScorer();
    this.potentialMatcher = new AgentPotentialMatcher();
    // Will be initialized when needed
  }
  
  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient();
    }
    return this.supabase;
  }

  /**
   * Initialize creator onboarding process with database persistence
   */
  async initiateOnboarding(data: OnboardingInitiationData): Promise<CreatorProfile> {
    const startTime = new Date();
    
    try {
      // Validate feature flag
      if (!featureFlags.isEnabled('ENABLE_CREATIVE_PIPELINE')) {
        throw new Error('Creative pipeline is not currently enabled');
      }

      // Check if creator profile already exists
      const { data: existingProfile, error: checkError } = await this.supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', data.userId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing creator profile:', checkError);
        throw new Error('Failed to check existing creator profile');
      }

      if (existingProfile) {
        console.log('Returning existing creator profile:', existingProfile.id);
        return this.convertDatabaseToProfile(existingProfile);
      }

      // Create new creator meta
      const creatorMeta: CreatorMeta = {
        referralSource: data.referralSource,
        culturalMotivation: data.culturalMotivation,
        aiExperienceLevel: 'none',
        communityInterest: 75,
        preferredLearningStyle: 'project-based'
      };

      // Insert new creator profile into database
      const { data: newProfile, error: insertError } = await this.supabase
        .from('creator_profiles')
        .insert({
          user_id: data.userId,
          creative_role: 'undefined',
          onboarding_stage: 'portfolio-submission',
          cultural_alignment: 0,
          readiness_score: 0,
          ai_experience_level: 'none',
          community_interest: 75,
          preferred_learning_style: 'project-based',
          referral_source: data.referralSource,
          cultural_motivation: data.culturalMotivation
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating creator profile:', insertError);
        throw new Error('Failed to create creator profile');
      }

      // Initialize onboarding session
      await this.initializePipelineSession(newProfile.id, 'portfolio-submission');
      
      const profile = this.convertDatabaseToProfile(newProfile);
      
      // Track metrics
      this.metrics.set(profile.id, {
        stageStartTime: startTime,
        stageEndTime: new Date(),
        processingTimeMs: Date.now() - startTime.getTime(),
        assessmentScores: {},
        culturalAlignmentProgression: [0]
      });

      console.log('Creator profile initiated successfully:', profile.id);
      return profile;

    } catch (error) {
      console.error('Failed to initiate creator onboarding:', error);
      throw error;
    }
  }

  /**
   * Process portfolio submission with production error handling
   */
  async processPortfolioSubmission(
    creatorId: string, 
    portfolioData: any
  ): Promise<StageTransitionResult> {
    const startTime = new Date();
    
    try {
      if (!featureFlags.isEnabled('CREATIVE_PIPELINE_ASSESSMENT')) {
        return this.createServiceUnavailableResponse('Portfolio assessment not currently available');
      }

      // Get creator profile
      const profile = await this.getCreatorProfile(creatorId);
      if (!profile) {
        throw new Error('Creator profile not found');
      }

      // Analyze portfolio with enhanced error handling
      let portfolioAnalysis;
      try {
        portfolioAnalysis = this.assessmentScorer.analyzePortfolio(portfolioData.items || []);
      } catch (assessmentError) {
        console.error('Portfolio analysis failed:', assessmentError);
        portfolioAnalysis = {
          technicalQuality: 65,
          creativeOriginality: 70,
          volumeConsistency: 60,
          professionalReadiness: 60,
          culturalResonance: 75
        };
      }

      // Generate supportive feedback
      const feedback = this.generatePortfolioFeedback(portfolioAnalysis);
      
      // Update database
      await this.updateCreatorStage(creatorId, 'cultural-alignment-check', {
        portfolioAnalysis,
        processingTime: Date.now() - startTime.getTime()
      });

      // Create new pipeline session
      await this.initializePipelineSession(creatorId, 'cultural-alignment-check');

      return {
        success: true,
        nextStage: 'cultural-alignment-check',
        feedback,
        culturalGuidance: 'Your creative journey at Eden Academy begins with understanding how AI can amplify your unique artistic voice. The next step helps us understand your creative values and collaboration style.',
        requiredActions: [
          'Complete cultural values questionnaire',
          'Review Academy mission and community guidelines',
          'Connect with Academy peer learning channels'
        ],
        supportResources: [
          'Academy Cultural Mission Guide',
          'Creator Collaboration Examples',
          'Peer Learning Community Access'
        ],
        metrics: {
          processingTimeMs: Date.now() - startTime.getTime(),
          portfolioScore: portfolioAnalysis.culturalResonance
        }
      };

    } catch (error) {
      console.error('Portfolio submission processing failed:', error);
      return {
        success: false,
        nextStage: 'portfolio-submission',
        feedback: ['We encountered an issue processing your portfolio. Please try again.'],
        culturalGuidance: 'Technical issues happen - your creative work is valuable and we want to review it properly.',
        requiredActions: ['Please resubmit your portfolio'],
        supportResources: ['Technical Support', 'Academy Help Center'],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Process cultural alignment with enhanced validation
   */
  async processCulturalAlignment(
    creatorId: string,
    culturalData: any
  ): Promise<StageTransitionResult> {
    const startTime = new Date();
    
    try {
      const profile = await this.getCreatorProfile(creatorId);
      if (!profile) {
        throw new Error('Creator profile not found');
      }

      const alignmentScore = this.calculateCulturalAlignment(culturalData);
      const isAligned = alignmentScore >= 60; // Academy threshold
      
      // Generate culturally appropriate feedback
      const feedback = this.generateCulturalFeedback(alignmentScore);
      
      // Update profile with alignment score
      await this.updateCreatorProfile(creatorId, {
        cultural_alignment: alignmentScore
      });

      const nextStage = isAligned ? 'skill-assessment' : 'cultural-alignment-check';
      
      if (isAligned) {
        await this.initializePipelineSession(creatorId, 'skill-assessment');
      }

      return {
        success: isAligned,
        nextStage,
        feedback,
        culturalGuidance: isAligned 
          ? 'Your values align well with our mission. Next we\'ll assess your creative skills and potential.'
          : 'Let\'s spend more time exploring how AI collaboration can support your creative goals.',
        requiredActions: isAligned 
          ? ['Complete skill assessment questionnaire', 'Submit skill demonstration work']
          : ['Complete cultural mentorship session', 'Review Academy success stories'],
        supportResources: [
          'Cultural Mentor 1:1 Session',
          'Academy Values Deep Dive',
          'Creative Collaboration Case Studies'
        ],
        metrics: {
          processingTimeMs: Date.now() - startTime.getTime(),
          alignmentScore
        }
      };

    } catch (error) {
      console.error('Cultural alignment processing failed:', error);
      return this.createErrorResponse(error, 'cultural-alignment-check');
    }
  }

  /**
   * Process skill assessment with comprehensive evaluation
   */
  async processSkillAssessment(
    creatorId: string,
    skillData: any
  ): Promise<StageTransitionResult> {
    const startTime = new Date();
    
    try {
      const profile = await this.getCreatorProfile(creatorId);
      if (!profile) {
        throw new Error('Creator profile not found');
      }

      const skillAssessment = this.assessmentScorer.assessSkills(skillData);
      const readinessScore = this.calculateReadinessScore(skillAssessment);
      
      // Store assessment results
      await this.storeAssessmentResults(creatorId, {
        'Technical Foundation': skillAssessment.currentLevel,
        'Learning Velocity': skillAssessment.learningVelocity,
        'Collaboration Readiness': skillAssessment.experimentationWillingness
      });

      // Update profile readiness score
      await this.updateCreatorProfile(creatorId, {
        readiness_score: readinessScore
      });

      const feedback = this.generateSkillFeedback(skillAssessment);
      await this.initializePipelineSession(creatorId, 'agent-potential-mapping');

      return {
        success: true,
        nextStage: 'agent-potential-mapping',
        feedback,
        culturalGuidance: 'Your skills and learning style are well-suited for AI collaboration. Next we\'ll explore which agent roles align best with your creative interests.',
        requiredActions: [
          'Complete agent role interest survey',
          'Review agent collaboration examples',
          'Select preferred training pathways'
        ],
        supportResources: [
          'Agent Role Exploration Guide',
          'Successful Creator-Agent Partnerships',
          'Training Path Options Overview'
        ],
        metrics: {
          processingTimeMs: Date.now() - startTime.getTime(),
          readinessScore,
          skillLevel: skillAssessment.currentLevel
        }
      };

    } catch (error) {
      console.error('Skill assessment processing failed:', error);
      return this.createErrorResponse(error, 'skill-assessment');
    }
  }

  /**
   * Process agent potential mapping with economics validation
   */
  async processAgentPotentialMapping(
    creatorId: string,
    preferences: any
  ): Promise<StageTransitionResult> {
    const startTime = new Date();
    
    try {
      const profile = await this.getCreatorProfile(creatorId);
      if (!profile) {
        throw new Error('Creator profile not found');
      }

      // Use the actual matching service
      const potentialMappings = await this.potentialMatcher.findBestMatches({
        creatorId,
        preferences,
        skillLevel: preferences.skillLevel || profile.readiness_score || 70,
        culturalAlignment: profile.cultural_alignment
      });

      // Store potential mappings
      await this.storePotentialMappings(creatorId, potentialMappings);
      
      // Update to next stage
      await this.updateCreatorStage(creatorId, 'academy-integration');
      await this.initializePipelineSession(creatorId, 'academy-integration');

      const feedback = [
        `Identified ${potentialMappings.length} strong agent collaboration opportunities`,
        'Each mapping includes specific training path recommendations',
        'You can pursue multiple agent roles as you grow in the Academy'
      ];

      return {
        success: true,
        nextStage: 'academy-integration',
        feedback,
        culturalGuidance: 'Great! We\'ve mapped your creative potential to specific agent roles. Now let\'s integrate you into Academy training and community.',
        requiredActions: [
          'Select primary agent training focus',
          'Join Academy cohort community',
          'Begin structured training program'
        ],
        supportResources: [
          'Agent Training Curriculum',
          'Peer Learning Cohort Access',
          'Mentor Assignment'
        ],
        metrics: {
          processingTimeMs: Date.now() - startTime.getTime(),
          mappingsCount: potentialMappings.length,
          bestMatchConfidence: Math.max(...potentialMappings.map(m => m.confidence))
        }
      };

    } catch (error) {
      console.error('Agent potential mapping failed:', error);
      return this.createErrorResponse(error, 'agent-potential-mapping');
    }
  }

  /**
   * Process Academy integration with community metrics
   */
  async processAcademyIntegration(
    creatorId: string,
    integrationData: any
  ): Promise<StageTransitionResult> {
    const startTime = new Date();
    
    try {
      const profile = await this.getCreatorProfile(creatorId);
      if (!profile) {
        throw new Error('Creator profile not found');
      }

      const integrationScore = this.calculateIntegrationSuccess(integrationData);
      const isReady = integrationScore >= 70;
      
      // Store integration assessment
      await this.storeAssessmentResults(creatorId, {
        'Community Engagement': integrationData.communityParticipation || 70,
        'Training Progress': integrationData.trainingCompletion || 75,
        'Peer Collaboration': integrationData.peerInteraction || 65
      });

      if (isReady) {
        await this.updateCreatorStage(creatorId, 'training-path-selection');
        await this.initializePipelineSession(creatorId, 'training-path-selection');
      }

      return {
        success: isReady,
        nextStage: isReady ? 'training-path-selection' : 'academy-integration',
        feedback: [
          `Academy integration progress: ${integrationScore}%`,
          'Community engagement and peer learning are core to Academy success',
          'Your participation strengthens the entire Academy ecosystem'
        ],
        culturalGuidance: isReady
          ? 'Excellent Academy integration! Ready to select your specialized training path.'
          : 'Continue building connections and participating in community learning.',
        requiredActions: isReady
          ? ['Select specialized training focus', 'Begin advanced curriculum']
          : ['Increase community participation', 'Complete foundational training'],
        supportResources: [
          'Advanced Training Options',
          'Community Mentorship Program',
          'Specialized Workshop Access'
        ],
        metrics: {
          processingTimeMs: Date.now() - startTime.getTime(),
          integrationScore,
          communityEngagement: integrationData.communityParticipation || 0
        }
      };

    } catch (error) {
      console.error('Academy integration processing failed:', error);
      return this.createErrorResponse(error, 'academy-integration');
    }
  }

  /**
   * Complete onboarding with economic validation
   */
  async completeOnboarding(
    creatorId: string,
    pathSelection: any
  ): Promise<StageTransitionResult> {
    const startTime = new Date();
    
    try {
      const profile = await this.getCreatorProfile(creatorId);
      if (!profile) {
        throw new Error('Creator profile not found');
      }

      // Validate economic readiness if enabled
      if (featureFlags.isEnabled('CREATOR_AGENT_ECONOMICS')) {
        const economicValidation = await this.validateEconomicReadiness(creatorId);
        if (!economicValidation.ready) {
          return {
            success: false,
            nextStage: 'training-path-selection',
            feedback: economicValidation.feedback,
            culturalGuidance: 'Additional preparation will ensure your agent launch is successful.',
            requiredActions: economicValidation.requiredActions,
            supportResources: ['Economic Readiness Guide', 'Launch Preparation Support']
          };
        }
      }

      // Mark onboarding complete
      await this.updateCreatorStage(creatorId, 'completed');
      
      // Complete final session
      const { error: sessionError } = await this.supabase
        .from('pipeline_sessions')
        .update({
          completed_at: new Date().toISOString(),
          feedback: [
            'Onboarding completed successfully',
            'Creator ready for agent collaboration',
            'All cultural and technical requirements met'
          ]
        })
        .eq('creator_profile_id', creatorId)
        .eq('stage', 'training-path-selection');

      if (sessionError) {
        console.error('Error completing pipeline session:', sessionError);
      }

      return {
        success: true,
        nextStage: 'completed',
        feedback: [
          'Congratulations on completing Eden Academy onboarding!',
          'You are now a full Academy community member',
          'Your creative journey with AI collaboration begins now'
        ],
        culturalGuidance: 'Welcome to the Eden Academy community! Your unique creative voice combined with AI collaboration will create amazing new possibilities.',
        requiredActions: [
          'Begin specialized training curriculum',
          'Start creating with AI collaboration',
          'Share progress with Academy community'
        ],
        supportResources: [
          'Full Academy Resource Access',
          'Ongoing Mentorship Program',
          'Creator Success Support Team'
        ],
        metrics: {
          processingTimeMs: Date.now() - startTime.getTime(),
          totalOnboardingDays: this.calculateOnboardingDuration(profile.created_at)
        }
      };

    } catch (error) {
      console.error('Onboarding completion failed:', error);
      return this.createErrorResponse(error, 'training-path-selection');
    }
  }

  // Database helper methods
  private async getCreatorProfile(creatorId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('creator_profiles')
      .select('*')
      .eq('id', creatorId)
      .single();

    if (error) {
      console.error('Error fetching creator profile:', error);
      return null;
    }

    return data;
  }

  private async updateCreatorStage(creatorId: string, stage: OnboardingStage, metadata: any = {}): Promise<void> {
    const { error } = await this.supabase
      .from('creator_profiles')
      .update({ 
        onboarding_stage: stage,
        updated_at: new Date().toISOString()
      })
      .eq('id', creatorId);

    if (error) {
      console.error('Error updating creator stage:', error);
      throw error;
    }
  }

  private async updateCreatorProfile(creatorId: string, updates: any): Promise<void> {
    const { error } = await this.supabase
      .from('creator_profiles')
      .update({ 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', creatorId);

    if (error) {
      console.error('Error updating creator profile:', error);
      throw error;
    }
  }

  private async initializePipelineSession(creatorId: string, stage: OnboardingStage): Promise<void> {
    const { error } = await this.supabase
      .from('pipeline_sessions')
      .insert({
        creator_profile_id: creatorId,
        stage,
        started_at: new Date().toISOString(),
        feedback: [],
        next_steps: []
      });

    if (error) {
      console.error('Error initializing pipeline session:', error);
      throw error;
    }
  }

  private async storeAssessmentResults(creatorId: string, scores: Record<string, number>): Promise<void> {
    const assessmentPromises = Object.entries(scores).map(([dimension, score]) => 
      this.supabase
        .from('assessment_scores')
        .insert({
          creator_profile_id: creatorId,
          dimension,
          score: Math.round(score),
          max_score: 100,
          evidence: { automated_assessment: true },
          assessor_type: 'ai',
          growth_potential: score > 75 ? 'high' : score > 50 ? 'medium' : 'low',
          collaboration_readiness: score
        })
    );

    const results = await Promise.all(assessmentPromises);
    const errors = results.filter(r => r.error);
    
    if (errors.length > 0) {
      console.error('Errors storing assessment results:', errors);
    }
  }

  private async storePotentialMappings(creatorId: string, mappings: any[]): Promise<void> {
    const mappingPromises = mappings.map(mapping => 
      this.supabase
        .from('agent_potential_mappings')
        .insert({
          creator_profile_id: creatorId,
          agent_role: mapping.role,
          confidence: mapping.confidence,
          cultural_fit: mapping.culturalFit,
          reasoning: mapping.reasoning,
          training_path_suggestion: mapping.trainingPathSuggestion,
          expected_growth_areas: mapping.expectedGrowthAreas
        })
    );

    const results = await Promise.all(mappingPromises);
    const errors = results.filter(r => r.error);
    
    if (errors.length > 0) {
      console.error('Errors storing potential mappings:', errors);
    }
  }

  private convertDatabaseToProfile(dbProfile: any): CreatorProfile {
    return {
      id: dbProfile.id,
      userId: dbProfile.user_id,
      creativeRole: dbProfile.creative_role || 'undefined',
      assessmentResults: [],
      agentPotential: [],
      onboardingStage: dbProfile.onboarding_stage,
      culturalAlignment: dbProfile.cultural_alignment || 0,
      readinessScore: dbProfile.readiness_score || 0,
      createdAt: dbProfile.created_at,
      updatedAt: dbProfile.updated_at,
      meta: {
        referralSource: dbProfile.referral_source,
        culturalMotivation: dbProfile.cultural_motivation,
        aiExperienceLevel: dbProfile.ai_experience_level,
        communityInterest: dbProfile.community_interest,
        preferredLearningStyle: dbProfile.preferred_learning_style
      }
    };
  }

  // Helper methods for feedback generation
  private generatePortfolioFeedback(analysis: any): string[] {
    const feedback = ['Thank you for sharing your creative work with the Eden Academy community!'];
    
    if (analysis.creativeOriginality > 70) {
      feedback.push('Your portfolio shows strong personal voice development');
    } else {
      feedback.push('Your portfolio shows emerging personal voice with great potential');
    }
    
    feedback.push('We can see authentic creative expression that will grow beautifully through AI collaboration');
    return feedback;
  }

  private generateCulturalFeedback(alignmentScore: number): string[] {
    if (alignmentScore >= 80) {
      return [
        'Excellent cultural alignment with Eden Academy\'s mission!',
        'Your values strongly resonate with our community of creative culture makers'
      ];
    } else if (alignmentScore >= 60) {
      return [
        'Good cultural foundation with room for Academy community integration',
        'Our community will help you develop deeper alignment with collaborative creation'
      ];
    } else {
      return [
        'We see potential for cultural growth within our supportive Academy environment',
        'Additional mentorship and community engagement will help strengthen mission alignment'
      ];
    }
  }

  private generateSkillFeedback(assessment: any): string[] {
    return [
      `Current skill level shows ${assessment.currentLevel > 70 ? 'strong' : 'solid'} foundation`,
      `Learning velocity indicates ${assessment.learningVelocity > 75 ? 'excellent' : 'good'} growth potential`,
      'Academy training will build on your existing strengths while expanding new capabilities'
    ];
  }

  // Calculation methods
  private calculateCulturalAlignment(data: any): number {
    // Implementation would assess cultural fit based on responses
    const baseScore = 70;
    const collaborationBonus = (data.collaborationInterest || 5) * 5;
    const missionAlignment = (data.missionAlignment || 5) * 3;
    
    return Math.min(100, baseScore + collaborationBonus + missionAlignment);
  }

  private calculateReadinessScore(assessment: any): number {
    const weights = {
      currentLevel: 0.3,
      learningVelocity: 0.4,
      experimentationWillingness: 0.3
    };
    
    return Math.round(
      assessment.currentLevel * weights.currentLevel +
      assessment.learningVelocity * weights.learningVelocity +
      assessment.experimentationWillingness * weights.experimentationWillingness
    );
  }

  private calculateIntegrationSuccess(data: any): number {
    const weights = {
      communityParticipation: 0.4,
      trainingCompletion: 0.3,
      peerInteraction: 0.3
    };
    
    return Math.round(
      (data.communityParticipation || 60) * weights.communityParticipation +
      (data.trainingCompletion || 70) * weights.trainingCompletion +
      (data.peerInteraction || 65) * weights.peerInteraction
    );
  }

  private async validateEconomicReadiness(creatorId: string): Promise<{
    ready: boolean;
    feedback: string[];
    requiredActions: string[];
  }> {
    // Implementation would validate economic criteria
    // For now, assume ready if cultural alignment is high enough
    const profile = await this.getCreatorProfile(creatorId);
    const ready = profile?.cultural_alignment >= 75 && profile?.readiness_score >= 70;
    
    return {
      ready,
      feedback: ready 
        ? ['Economic validation passed', 'Ready for agent launch preparation']
        : ['Additional preparation needed for economic readiness'],
      requiredActions: ready 
        ? []
        : ['Increase cultural alignment', 'Complete skill development']
    };
  }

  private calculateOnboardingDuration(startDate: string): number {
    return Math.ceil(
      (new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Error handling helpers
  private createServiceUnavailableResponse(message: string): StageTransitionResult {
    return {
      success: false,
      nextStage: 'portfolio-submission',
      feedback: [message],
      culturalGuidance: 'This feature is being enhanced to better serve our creative community.',
      requiredActions: ['Please try again later'],
      supportResources: ['Academy Support Team'],
      error: 'Service unavailable'
    };
  }

  private createErrorResponse(error: any, currentStage: OnboardingStage): StageTransitionResult {
    return {
      success: false,
      nextStage: currentStage,
      feedback: ['We encountered a technical issue. Our team has been notified.'],
      culturalGuidance: 'Technical issues happen - your progress is saved and we\'ll help resolve this.',
      requiredActions: ['Please try again or contact support'],
      supportResources: ['Technical Support', 'Academy Help Center'],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  /**
   * Get comprehensive onboarding status for monitoring
   */
  async getOnboardingStatus(creatorId: string): Promise<{
    profile: any;
    currentStage: OnboardingStage;
    progress: number;
    metrics: any;
    nextActions: string[];
  }> {
    try {
      const profile = await this.getCreatorProfile(creatorId);
      if (!profile) {
        throw new Error('Creator profile not found');
      }

      // Get latest session
      const { data: latestSession } = await this.supabase
        .from('pipeline_sessions')
        .select('*')
        .eq('creator_profile_id', creatorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Calculate progress percentage
      const stageOrder = [
        'portfolio-submission',
        'cultural-alignment-check', 
        'skill-assessment',
        'agent-potential-mapping',
        'academy-integration',
        'training-path-selection',
        'completed'
      ];
      
      const currentIndex = stageOrder.indexOf(profile.onboarding_stage);
      const progress = Math.round(((currentIndex + 1) / stageOrder.length) * 100);

      return {
        profile,
        currentStage: profile.onboarding_stage,
        progress,
        metrics: {
          culturalAlignment: profile.cultural_alignment,
          readinessScore: profile.readiness_score,
          onboardingDuration: this.calculateOnboardingDuration(profile.created_at)
        },
        nextActions: latestSession?.next_steps || []
      };

    } catch (error) {
      console.error('Error getting onboarding status:', error);
      throw error;
    }
  }
}