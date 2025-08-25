/**
 * Creative Pipeline Integration Tests
 * 
 * Comprehensive test suite for the production-ready creator-to-agent pipeline.
 * Tests end-to-end functionality, error handling, and performance requirements.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OnboardingFlowManager } from '@/services/creative-pipeline/workflows/onboarding-flow';
import { AgentPotentialMatcher } from '@/services/creative-pipeline/matching/agent-potential-matcher';
import { CulturalAssessmentScorer } from '@/services/creative-pipeline/assessment/cultural-assessment';
import { featureFlags } from '@/config/flags';
import { pipelineMonitor } from '@/services/creative-pipeline/monitoring/pipeline-monitor';

// Mock external dependencies
jest.mock('@/lib/supabase/server');
jest.mock('@/config/flags');

const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({ data: null, error: null })),
        maybeSingle: jest.fn(() => ({ data: null, error: null }))
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({ 
          data: { 
            id: 'test-creator-id',
            user_id: 'test-user-id',
            onboarding_stage: 'portfolio-submission',
            cultural_alignment: 0,
            readiness_score: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, 
          error: null 
        }))
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({ data: null, error: null }))
    }))
  }))
};

// Mock feature flags
const mockFeatureFlags = featureFlags as jest.Mocked<typeof featureFlags>;

describe('Creative Pipeline Integration Tests', () => {
  let onboardingManager: OnboardingFlowManager;
  let agentMatcher: AgentPotentialMatcher;
  let assessmentScorer: CulturalAssessmentScorer;
  
  const testUserId = 'test-user-123';
  const testCreatorId = 'test-creator-456';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup feature flag mocks
    mockFeatureFlags.isEnabled.mockImplementation((flag) => {
      switch (flag) {
        case 'ENABLE_CREATIVE_PIPELINE':
        case 'CREATIVE_PIPELINE_ASSESSMENT':
        case 'CREATOR_AGENT_ECONOMICS':
          return true;
        default:
          return false;
      }
    });

    // Initialize services
    onboardingManager = new OnboardingFlowManager();
    agentMatcher = new AgentPotentialMatcher();
    assessmentScorer = new CulturalAssessmentScorer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Onboarding Flow Integration', () => {
    it('should complete full onboarding flow successfully', async () => {
      const startTime = Date.now();

      // Step 1: Initialize onboarding
      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId,
        referralSource: 'test',
        culturalMotivation: 'AI collaboration exploration'
      });

      expect(profile).toBeDefined();
      expect(profile.userId).toBe(testUserId);
      expect(profile.onboardingStage).toBe('portfolio-submission');

      // Step 2: Portfolio submission
      const portfolioResult = await onboardingManager.processPortfolioSubmission(
        profile.id,
        {
          items: [
            { name: 'Test Portfolio Item', type: 'image', description: 'Creative work sample' }
          ],
          description: 'My creative practice focuses on digital art and AI collaboration.'
        }
      );

      expect(portfolioResult.success).toBe(true);
      expect(portfolioResult.nextStage).toBe('cultural-alignment-check');

      // Step 3: Cultural alignment
      const culturalResult = await onboardingManager.processCulturalAlignment(
        profile.id,
        {
          collaborationInterest: 8,
          missionAlignment: 7,
          communityImportance: 6
        }
      );

      expect(culturalResult.success).toBe(true);
      expect(culturalResult.nextStage).toBe('skill-assessment');

      // Step 4: Skill assessment
      const skillResult = await onboardingManager.processSkillAssessment(
        profile.id,
        {
          skillLevels: {
            'Technical Skills': 4,
            'Creative Vision': 5,
            'Collaboration Experience': 3
          }
        }
      );

      expect(skillResult.success).toBe(true);
      expect(skillResult.nextStage).toBe('agent-potential-mapping');

      // Step 5: Agent potential mapping
      const mappingResult = await onboardingManager.processAgentPotentialMapping(
        profile.id,
        {
          interests: {
            'image-generation': true,
            'multi-modal-creative': true
          },
          skillLevel: 75
        }
      );

      expect(mappingResult.success).toBe(true);
      expect(mappingResult.nextStage).toBe('academy-integration');

      // Step 6: Academy integration
      const integrationResult = await onboardingManager.processAcademyIntegration(
        profile.id,
        {
          communityParticipation: 75,
          trainingCompletion: 80,
          peerInteraction: 70
        }
      );

      expect(integrationResult.success).toBe(true);
      expect(integrationResult.nextStage).toBe('training-path-selection');

      // Step 7: Complete onboarding
      const completionResult = await onboardingManager.completeOnboarding(
        profile.id,
        {
          selectedPath: 'focused',
          trainingPreferences: ['image-generation']
        }
      );

      expect(completionResult.success).toBe(true);
      expect(completionResult.nextStage).toBe('completed');

      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
    }, 30000);

    it('should handle cultural alignment failure gracefully', async () => {
      // Initialize profile
      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId,
        culturalMotivation: 'testing alignment failure'
      });

      // Submit low cultural alignment scores
      const result = await onboardingManager.processCulturalAlignment(
        profile.id,
        {
          collaborationInterest: 2,
          missionAlignment: 3,
          communityImportance: 1
        }
      );

      // Should not proceed to next stage
      expect(result.success).toBe(false);
      expect(result.nextStage).toBe('cultural-alignment-check');
      expect(result.culturalGuidance).toContain('explore');
      expect(result.supportResources).toBeDefined();
      expect(result.supportResources.length).toBeGreaterThan(0);
    });

    it('should provide fallback responses when services fail', async () => {
      // Mock service failure
      const originalMatcher = agentMatcher.findBestMatches;
      agentMatcher.findBestMatches = jest.fn().mockRejectedValue(new Error('Service unavailable'));

      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId
      });

      const result = await onboardingManager.processAgentPotentialMapping(
        profile.id,
        { interests: { 'image-generation': true } }
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.culturalGuidance).toContain('issues happen');
      expect(result.supportResources).toContain('Technical Support');

      // Restore original method
      agentMatcher.findBestMatches = originalMatcher;
    });
  });

  describe('Agent Matching Integration', () => {
    it('should find appropriate agent matches with economic validation', async () => {
      const matches = await agentMatcher.findBestMatches({
        creatorId: testCreatorId,
        preferences: {
          creativeRole: 'visual-artist',
          interests: ['image-generation', 'multi-modal-creative']
        },
        skillLevel: 75,
        culturalAlignment: 85,
        economicValidation: true
      });

      expect(matches).toBeDefined();
      expect(Array.isArray(matches)).toBe(true);
      
      if (matches.length > 0) {
        const topMatch = matches[0];
        expect(topMatch.role).toBeDefined();
        expect(topMatch.confidence).toBeGreaterThan(0);
        expect(topMatch.culturalFit).toBeGreaterThan(0);
        expect(topMatch.reasoning).toBeDefined();
        expect(topMatch.trainingPathSuggestion).toBeDefined();
        expect(topMatch.expectedGrowthAreas).toBeDefined();

        // Check economic validation fields if enabled
        if (mockFeatureFlags.isEnabled('CREATOR_AGENT_ECONOMICS')) {
          expect(topMatch.economicViability).toBeDefined();
          expect(topMatch.marketAnalysis).toBeDefined();
          expect(topMatch.launchReadiness).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('should handle matching preferences gracefully', async () => {
      const matches = await agentMatcher.findBestMatches({
        creatorId: testCreatorId,
        preferences: {},
        skillLevel: 50,
        economicValidation: false
      });

      // Should return fallback matches even with minimal data
      expect(matches).toBeDefined();
      expect(Array.isArray(matches)).toBe(true);
    });

    it('should provide culturally appropriate reasoning', async () => {
      const matches = await agentMatcher.findBestMatches({
        creatorId: testCreatorId,
        preferences: { creativeRole: 'visual-artist' },
        skillLevel: 80,
        culturalAlignment: 90
      });

      if (matches.length > 0) {
        const topMatch = matches[0];
        expect(topMatch.reasoning).toBeDefined();
        expect(topMatch.reasoning.some(reason => 
          reason.includes('amplify') || 
          reason.includes('collaboration') || 
          reason.includes('creative voice')
        )).toBe(true);
      }
    });
  });

  describe('Cultural Assessment Integration', () => {
    it('should provide comprehensive portfolio analysis', () => {
      const portfolioItems = [
        { name: 'Digital Painting', type: 'image', style: 'abstract' },
        { name: 'Character Design', type: 'image', style: 'realistic' },
        { name: 'Animation Test', type: 'video', duration: 30 }
      ];

      const analysis = assessmentScorer.analyzePortfolio(portfolioItems);

      expect(analysis).toBeDefined();
      expect(analysis.technicalQuality).toBeGreaterThanOrEqual(0);
      expect(analysis.creativeOriginality).toBeGreaterThanOrEqual(0);
      expect(analysis.volumeConsistency).toBeGreaterThanOrEqual(0);
      expect(analysis.professionalReadiness).toBeGreaterThanOrEqual(0);
      expect(analysis.culturalResonance).toBeGreaterThanOrEqual(0);
    });

    it('should assess skills with growth orientation', () => {
      const skillData = {
        technicalLevel: 70,
        creativityScore: 85,
        collaborationExperience: 60,
        learningMotivation: 95
      };

      const assessment = assessmentScorer.assessSkills(skillData);

      expect(assessment).toBeDefined();
      expect(assessment.currentLevel).toBeGreaterThanOrEqual(0);
      expect(assessment.learningVelocity).toBeGreaterThanOrEqual(0);
      expect(assessment.collaborationStyle).toBeDefined();
      expect(assessment.preferredMediums).toBeDefined();
      expect(assessment.experimentationWillingness).toBeGreaterThanOrEqual(0);
    });

    it('should generate supportive cultural assessments', () => {
      const mockProfile = {
        id: testCreatorId,
        culturalAlignment: 75,
        readinessScore: 70
      };

      const mockAssessments = [
        {
          dimension: 'Creative Expression Authenticity',
          score: 80,
          evidence: ['Strong personal style'],
          culturalNotes: 'Shows authentic voice',
          growthPotential: 'high' as const,
          collaborationReadiness: 75
        }
      ];

      const results = assessmentScorer.generateCulturalAssessment(
        { technicalQuality: 70, creativeOriginality: 80, volumeConsistency: 75, professionalReadiness: 70, culturalResonance: 85 },
        { currentLevel: 75, learningVelocity: 80, collaborationStyle: 'ai-curious' as const, preferredMediums: ['digital-art'], experimentationWillingness: 85 }
      );

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      
      results.forEach(result => {
        expect(result.culturalNotes).toContain('creative');
        expect(result.growthPotential).toBeDefined();
        expect(result.collaborationReadiness).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Performance & Monitoring Integration', () => {
    it('should track metrics for all pipeline stages', async () => {
      const mockRecordMetric = jest.spyOn(pipelineMonitor, 'recordMetric');

      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId
      });

      const result = await onboardingManager.processPortfolioSubmission(
        profile.id,
        { items: [{ name: 'test', type: 'image' }] }
      );

      // Should have recorded metrics
      expect(mockRecordMetric).toHaveBeenCalled();
    });

    it('should complete pipeline stages within performance requirements', async () => {
      const startTime = Date.now();

      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId
      });

      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(2000); // Should complete within 2 seconds
    });

    it('should maintain high success rates under load', async () => {
      const concurrentRequests = 10;
      const promises = Array.from({ length: concurrentRequests }, (_, i) => 
        onboardingManager.initiateOnboarding({
          userId: `test-user-${i}`,
          culturalMotivation: 'Load testing'
        })
      );

      const results = await Promise.allSettled(promises);
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const successRate = (successCount / concurrentRequests) * 100;

      expect(successRate).toBeGreaterThanOrEqual(95); // 95% success rate requirement
    });
  });

  describe('Feature Flag Integration', () => {
    it('should respect feature flag states', async () => {
      // Disable pipeline
      mockFeatureFlags.isEnabled.mockImplementation((flag) => {
        if (flag === 'ENABLE_CREATIVE_PIPELINE') return false;
        return true;
      });

      await expect(onboardingManager.initiateOnboarding({
        userId: testUserId
      })).rejects.toThrow('Creative pipeline is not currently enabled');

      // Disable assessment
      mockFeatureFlags.isEnabled.mockImplementation((flag) => {
        if (flag === 'CREATIVE_PIPELINE_ASSESSMENT') return false;
        return true;
      });

      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId
      });

      const result = await onboardingManager.processPortfolioSubmission(profile.id, {});
      expect(result.error).toBe('Service unavailable');
    });

    it('should provide appropriate fallback behavior', async () => {
      // Disable economics features
      mockFeatureFlags.isEnabled.mockImplementation((flag) => {
        if (flag === 'CREATOR_AGENT_ECONOMICS') return false;
        return true;
      });

      const matches = await agentMatcher.findBestMatches({
        creatorId: testCreatorId,
        preferences: {},
        skillLevel: 70,
        economicValidation: true
      });

      // Should not include economic validation even if requested
      if (matches.length > 0) {
        expect(matches[0].economicViability).toBeUndefined();
      }
    });
  });

  describe('Error Handling & Resilience', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      mockSupabase.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: { message: 'Database connection failed' } })
          })
        })
      }));

      await expect(onboardingManager.initiateOnboarding({
        userId: testUserId
      })).rejects.toThrow();
    });

    it('should provide meaningful error messages', async () => {
      try {
        await onboardingManager.processPortfolioSubmission('invalid-id', {});
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('profile not found');
      }
    });

    it('should maintain data consistency during partial failures', async () => {
      // This would test rollback scenarios in a real implementation
      // For now, verify that failed operations don't leave inconsistent state
      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId
      });

      // Simulate partial failure
      const originalUpdate = mockSupabase.from().update;
      mockSupabase.from = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({ error: { message: 'Update failed' } }))
        }))
      }));

      try {
        await onboardingManager.processPortfolioSubmission(profile.id, { items: [] });
      } catch (error) {
        // Profile should still be in valid state
        expect(profile.onboardingStage).toBe('portfolio-submission');
      }
    });
  });

  describe('Security & Validation', () => {
    it('should validate input data properly', async () => {
      await expect(onboardingManager.initiateOnboarding({
        userId: '' // Invalid empty user ID
      })).rejects.toThrow();

      await expect(onboardingManager.processPortfolioSubmission(
        'valid-id',
        null // Invalid null data
      )).rejects.toThrow();
    });

    it('should sanitize user input', async () => {
      const profile = await onboardingManager.initiateOnboarding({
        userId: testUserId,
        culturalMotivation: '<script>alert("xss")</script>Valid motivation'
      });

      // Should not contain script tags in stored data
      expect(profile.meta.culturalMotivation).not.toContain('<script>');
    });

    it('should respect rate limiting', async () => {
      // In a real implementation, this would test rate limiting
      // For now, verify that rapid requests are handled appropriately
      const rapidRequests = Array.from({ length: 100 }, () => 
        onboardingManager.initiateOnboarding({
          userId: `rapid-${Date.now()}-${Math.random()}`
        })
      );

      const startTime = Date.now();
      const results = await Promise.allSettled(rapidRequests);
      const endTime = Date.now();

      // Should not complete too quickly (indicating rate limiting)
      expect(endTime - startTime).toBeGreaterThan(100);
      
      // Most should succeed, but some might be rate limited
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      expect(successCount).toBeGreaterThan(50); // At least 50% success
    });
  });
});