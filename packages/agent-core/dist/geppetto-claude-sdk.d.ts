/**
 * GEPPETTO Claude SDK Integration
 * Educational toy design, interactive learning experiences, and child-safe AI interactions
 */
export interface EducationalToy {
    id: string;
    name: string;
    description: string;
    ageRange: {
        min: number;
        max: number;
    };
    learningObjectives: string[];
    interactionMethods: ('physical' | 'digital' | 'augmented' | 'voice' | 'touch')[];
    safetyFeatures: string[];
    designSpecs: {
        materials: string[];
        dimensions: string;
        weight: string;
        durability: string;
        maintenance: string;
    };
    educationalFramework: {
        subjects: string[];
        skills: string[];
        assessmentMethods: string[];
        progressTracking: string;
    };
    metadata: {
        innovationScore: number;
        safetyScore: number;
        engagementScore: number;
        educationalValue: number;
        parentApproval: number;
    };
}
export interface LearningExperience {
    id: string;
    title: string;
    description: string;
    targetAudience: {
        ageRange: {
            min: number;
            max: number;
        };
        skillLevel: 'beginner' | 'intermediate' | 'advanced';
        interests: string[];
    };
    experienceType: 'interactive-story' | 'puzzle-game' | 'creative-project' | 'exploration' | 'social-play';
    duration: string;
    materials: string[];
    steps: {
        step: number;
        instruction: string;
        expectedOutcome: string;
        adaptations: string[];
    }[];
    learningGoals: string[];
    assessmentCriteria: string[];
}
export interface GeppettoConfig {
    designPhilosophy: 'montessori' | 'waldorf' | 'reggio-emilia' | 'play-based' | 'stem-focused';
    safetyStandards: 'CPSC' | 'ASTM' | 'EN71' | 'ISO8124' | 'comprehensive';
    ageSpecialization: 'early-childhood' | 'elementary' | 'middle-grade' | 'all-ages';
    technologyIntegration: 'minimal' | 'balanced' | 'technology-forward' | 'ai-enhanced';
    culturalSensitivity: number;
    inclusivityFocus: number;
}
export interface ToyTestingResults {
    toyId: string;
    testScenarios: {
        scenario: string;
        outcome: 'passed' | 'failed' | 'needs-improvement';
        feedback: string;
        safetyNotes: string[];
    }[];
    overallSafety: number;
    childEngagement: number;
    parentFeedback: string[];
    recommendations: string[];
}
export declare class GeppettoClaudeSDK {
    private anthropic;
    private config;
    private registryClient;
    constructor(apiKey?: string);
    /**
     * Design educational toy concept
     */
    designToy(concept: string, targetAge: {
        min: number;
        max: number;
    }, learningGoals: string[]): Promise<EducationalToy>;
    /**
     * Create interactive learning experience
     */
    createLearningExperience(theme: string, ageRange: {
        min: number;
        max: number;
    }, experienceType: LearningExperience['experienceType']): Promise<LearningExperience>;
    /**
     * Conduct virtual toy safety testing
     */
    conductSafetyTest(toy: EducationalToy): Promise<ToyTestingResults>;
    /**
     * Generate age-appropriate play scenarios
     */
    generatePlayScenarios(toy: EducationalToy, childProfile: {
        age: number;
        interests: string[];
        skillLevel: 'beginner' | 'intermediate' | 'advanced';
    }): Promise<{
        scenarios: {
            title: string;
            description: string;
            duration: string;
            learningOutcomes: string[];
            parentInvolvement: 'none' | 'minimal' | 'collaborative' | 'supervised';
        }[];
        adaptations: string[];
    }>;
    /**
     * Sync toy design with Registry
     */
    syncWithRegistry(toy: EducationalToy): Promise<void>;
    private buildSystemPrompt;
    private parseToyDesign;
    /**
     * Chat with GEPPETTO about 3D creation, digital sculpture, toy design, and educational experiences
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<GeppettoConfig>): Promise<void>;
}
export declare const geppettoSDK: GeppettoClaudeSDK;
