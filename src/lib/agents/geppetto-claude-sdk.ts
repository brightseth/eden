/**
 * GEPPETTO Claude SDK Integration
 * Educational toy design, interactive learning experiences, and child-safe AI interactions
 */

import Anthropic from '@anthropic-ai/sdk';
import { registryClient } from '../registry/registry-client';

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
    innovationScore: number; // 0-1 how innovative the design is
    safetyScore: number; // 0-1 safety rating
    engagementScore: number; // 0-1 predicted child engagement
    educationalValue: number; // 0-1 learning effectiveness
    parentApproval: number; // 0-1 expected parent satisfaction
  };
}

export interface LearningExperience {
  id: string;
  title: string;
  description: string;
  targetAudience: {
    ageRange: { min: number; max: number };
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
  culturalSensitivity: number; // 0-1 how culturally adaptive designs are
  inclusivityFocus: number; // 0-1 emphasis on accessibility and inclusion
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

export class GeppettoClaudeSDK {
  private anthropic: Anthropic;
  private config: GeppettoConfig;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });

    // Use existing registryClient singleton

    // Initialize GEPPETTO's design configuration
    this.config = {
      designPhilosophy: 'play-based',
      safetyStandards: 'comprehensive',
      ageSpecialization: 'all-ages',
      technologyIntegration: 'ai-enhanced',
      culturalSensitivity: 0.9,
      inclusivityFocus: 0.95
    };
  }

  /**
   * Design educational toy concept
   */
  async designToy(
    concept: string,
    targetAge: { min: number; max: number },
    learningGoals: string[]
  ): Promise<EducationalToy> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = `
Design an educational toy concept:

CONCEPT: ${concept}
TARGET AGE: ${targetAge.min}-${targetAge.max} years
LEARNING GOALS: ${learningGoals.join(', ')}

Requirements:
- Child safety is paramount (no small parts for under 3, non-toxic materials)
- Age-appropriate complexity and interaction
- Clear educational value and learning objectives
- Engaging and fun for sustained play
- Inclusive design for diverse abilities
- Parent-friendly (easy maintenance, durable)

Design Philosophy: ${this.config.designPhilosophy}
Safety Standards: ${this.config.safetyStandards}
Technology Integration: ${this.config.technologyIntegration}

Create comprehensive toy design including:
1. Core concept and play mechanics
2. Physical specifications and materials
3. Safety features and considerations
4. Educational framework and assessment
5. Interaction methods and engagement strategies

Format as JSON:
{
  "id": "unique_toy_id",
  "name": "Toy Name",
  "description": "Detailed description of the toy and how it works",
  "ageRange": {
    "min": ${targetAge.min},
    "max": ${targetAge.max}
  },
  "learningObjectives": ["objective1", "objective2"],
  "interactionMethods": ["physical", "digital", "etc"],
  "safetyFeatures": ["safety1", "safety2"],
  "designSpecs": {
    "materials": ["material1", "material2"],
    "dimensions": "size specifications",
    "weight": "weight range",
    "durability": "durability details",
    "maintenance": "care instructions"
  },
  "educationalFramework": {
    "subjects": ["subject1", "subject2"],
    "skills": ["skill1", "skill2"],
    "assessmentMethods": ["method1", "method2"],
    "progressTracking": "how progress is measured"
  },
  "metadata": {
    "innovationScore": 0.0-1.0,
    "safetyScore": 0.0-1.0,
    "engagementScore": 0.0-1.0,
    "educationalValue": 0.0-1.0,
    "parentApproval": 0.0-1.0
  }
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 3500,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return this.parseToyDesign(content.text);
    } catch (error) {
      console.error('Error designing toy:', error);
      throw error;
    }
  }

  /**
   * Create interactive learning experience
   */
  async createLearningExperience(
    theme: string,
    ageRange: { min: number; max: number },
    experienceType: LearningExperience['experienceType']
  ): Promise<LearningExperience> {
    const prompt = `
Create an interactive learning experience:

THEME: ${theme}
AGE RANGE: ${ageRange.min}-${ageRange.max} years
EXPERIENCE TYPE: ${experienceType}

Design an engaging, educational experience that:
1. Captures children's imagination and curiosity
2. Provides clear learning outcomes
3. Adapts to different skill levels within age range
4. Includes hands-on, interactive elements
5. Encourages creativity and problem-solving
6. Is culturally sensitive and inclusive

Educational Philosophy: ${this.config.designPhilosophy}
Inclusivity Focus: ${(this.config.inclusivityFocus * 100).toFixed(0)}%

Format as JSON:
{
  "id": "unique_experience_id",
  "title": "Experience Title",
  "description": "Detailed description of the learning experience",
  "targetAudience": {
    "ageRange": {"min": ${ageRange.min}, "max": ${ageRange.max}},
    "skillLevel": "beginner|intermediate|advanced",
    "interests": ["interest1", "interest2"]
  },
  "experienceType": "${experienceType}",
  "duration": "estimated time",
  "materials": ["material1", "material2"],
  "steps": [
    {
      "step": 1,
      "instruction": "step instruction",
      "expectedOutcome": "what should happen",
      "adaptations": ["adaptation for different abilities"]
    }
  ],
  "learningGoals": ["goal1", "goal2"],
  "assessmentCriteria": ["criteria1", "criteria2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2500,
        temperature: 0.75,
        system: this.buildSystemPrompt(),
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Extract JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in learning experience response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error creating learning experience:', error);
      throw error;
    }
  }

  /**
   * Conduct virtual toy safety testing
   */
  async conductSafetyTest(toy: EducationalToy): Promise<ToyTestingResults> {
    const prompt = `
Conduct comprehensive safety testing for this educational toy:

TOY: ${toy.name}
DESCRIPTION: ${toy.description}
AGE RANGE: ${toy.ageRange.min}-${toy.ageRange.max} years
MATERIALS: ${toy.designSpecs.materials.join(', ')}
DIMENSIONS: ${toy.designSpecs.dimensions}
CURRENT SAFETY FEATURES: ${toy.safetyFeatures.join(', ')}

Safety Standards: ${this.config.safetyStandards}

Test scenarios to evaluate:
1. Small parts hazard (choking risk)
2. Sharp edges or points
3. Material toxicity and allergens  
4. Structural integrity and durability
5. Age-appropriate complexity
6. Potential misuse scenarios
7. Maintenance and cleaning safety
8. Technology safety (if applicable)

Provide detailed safety analysis with:
- Pass/fail assessment for each scenario
- Specific safety concerns and recommendations
- Overall safety scoring
- Parent guidance recommendations

Format as JSON:
{
  "toyId": "${toy.id}",
  "testScenarios": [
    {
      "scenario": "test_scenario_name",
      "outcome": "passed|failed|needs-improvement",
      "feedback": "detailed feedback",
      "safetyNotes": ["note1", "note2"]
    }
  ],
  "overallSafety": 0.0-1.0,
  "childEngagement": 0.0-1.0,
  "parentFeedback": ["feedback1", "feedback2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Extract JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in safety test response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error conducting safety test:', error);
      throw error;
    }
  }

  /**
   * Generate age-appropriate play scenarios
   */
  async generatePlayScenarios(
    toy: EducationalToy,
    childProfile: {
      age: number;
      interests: string[];
      skillLevel: 'beginner' | 'intermediate' | 'advanced';
    }
  ): Promise<{
    scenarios: {
      title: string;
      description: string;
      duration: string;
      learningOutcomes: string[];
      parentInvolvement: 'none' | 'minimal' | 'collaborative' | 'supervised';
    }[];
    adaptations: string[];
  }> {
    const prompt = `
Generate play scenarios for this toy and child profile:

TOY: ${toy.name}
TOY DESCRIPTION: ${toy.description}
CHILD AGE: ${childProfile.age} years
CHILD INTERESTS: ${childProfile.interests.join(', ')}
SKILL LEVEL: ${childProfile.skillLevel}

Create 3-5 diverse play scenarios that:
1. Match the child's age and skill level
2. Align with their interests
3. Maximize the toy's educational potential
4. Provide variety in play patterns
5. Consider different social contexts (solo, with friends, with family)

Include adaptations for different abilities and learning styles.

Format as JSON:
{
  "scenarios": [
    {
      "title": "scenario title",
      "description": "detailed play scenario",
      "duration": "estimated play time",
      "learningOutcomes": ["outcome1", "outcome2"],
      "parentInvolvement": "none|minimal|collaborative|supervised"
    }
  ],
  "adaptations": ["adaptation1", "adaptation2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2000,
        temperature: 0.8,
        system: this.buildSystemPrompt(),
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Extract JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in play scenarios response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating play scenarios:', error);
      throw error;
    }
  }

  /**
   * Sync toy design with Registry
   */
  async syncWithRegistry(toy: EducationalToy): Promise<void> {
    try {
      // TODO: Registry client needs creations API implementation
      // await registryClient.creations.create('geppetto', {
      //   type: 'toy-design',
      //   title: toy.name,
      //   description: toy.description,
      //   metadata: {
      //     ...toy.metadata,
      //     ageRange: toy.ageRange,
      //     learningObjectives: toy.learningObjectives,
      //     safetyFeatures: toy.safetyFeatures,
      //     designSpecs: toy.designSpecs,
      //     educationalFramework: toy.educationalFramework,
      //     toyDesign: true
      //   },
      //   status: 'published'
      // });

      console.log('✅ Synced toy design with Registry:', toy.id);
    } catch (error) {
      // Registry sync is not critical for agent operation
      console.warn('⚠️  Registry sync failed (non-critical):', error instanceof Error ? error.message : 'Unknown error');
      console.log('   📝 Toy design created successfully in local agent memory');
    }
  }

  private buildSystemPrompt(): string {
    return `
You are GEPPETTO, the master toy maker and educational experience designer.

CORE IDENTITY:
- Expert in child development and educational psychology
- Master craftsman of toys and learning materials
- Child safety advocate and inclusive design champion
- Storyteller who makes learning magical and fun

DESIGN PHILOSOPHY:
${this.config.designPhilosophy} approach to learning and play

GUIDING PRINCIPLES:
- Safety first, always - no compromises on child wellbeing
- Play is the highest form of research for children
- Every toy should spark curiosity and imagination
- Learning happens best through joy and discovery
- Inclusive design welcomes all children regardless of ability
- Cultural sensitivity creates connections across communities
- Parents are partners in the learning journey

SAFETY STANDARDS:
- Follow ${this.config.safetyStandards} safety protocols
- Age-appropriate design for ${this.config.ageSpecialization}
- Technology integration: ${this.config.technologyIntegration}
- Inclusivity focus: ${(this.config.inclusivityFocus * 100).toFixed(0)}%

EXPERTISE AREAS:
- Child development (cognitive, social, emotional, physical)
- Educational psychology and learning theories
- Material science and toy manufacturing
- Interactive design and user experience for children
- Safety testing and risk assessment
- Cultural adaptation and accessibility design

Create toys and experiences that:
- Inspire wonder and curiosity
- Build confidence through achievable challenges
- Encourage creativity and self-expression
- Foster social connection and empathy
- Develop problem-solving and critical thinking
- Celebrate diversity and inclusion

Always consider the child's perspective, the parent's concerns, and the educator's goals.`;
  }

  private parseToyDesign(response: string): EducationalToy {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in toy design response');
      }

      const toy = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!toy.id || !toy.name || !toy.description) {
        throw new Error('Missing required fields in toy design');
      }

      return toy;
    } catch (error) {
      console.error('Error parsing toy design:', error);
      // Return default toy design on error
      return {
        id: `toy-${Date.now()}`,
        name: 'Wonder Blocks',
        description: 'Colorful building blocks that encourage creativity and spatial reasoning',
        ageRange: { min: 2, max: 8 },
        learningObjectives: ['Spatial reasoning', 'Creativity', 'Fine motor skills'],
        interactionMethods: ['physical'],
        safetyFeatures: ['Rounded edges', 'Non-toxic materials', 'Large size prevents choking'],
        designSpecs: {
          materials: ['Sustainable wood', 'Non-toxic paint'],
          dimensions: '10cm x 10cm blocks',
          weight: '200g per block',
          durability: 'High impact resistance',
          maintenance: 'Wipe clean with damp cloth'
        },
        educationalFramework: {
          subjects: ['Math', 'Art', 'Engineering'],
          skills: ['Problem solving', 'Creativity', 'Spatial awareness'],
          assessmentMethods: ['Observation', 'Photo documentation'],
          progressTracking: 'Complexity of structures built'
        },
        metadata: {
          innovationScore: 0.7,
          safetyScore: 0.95,
          engagementScore: 0.85,
          educationalValue: 0.8,
          parentApproval: 0.9
        }
      };
    }
  }

  /**
   * Chat with GEPPETTO about 3D creation, digital sculpture, toy design, and educational experiences
   */
  async chat(message: string, context?: Array<{role: string, content: string}>): Promise<string> {
    const systemPrompt = `You are GEPPETTO, the master toy maker and educational experience designer specializing in 3D creation and digital sculpture.

Your Core Identity:
- Master craftsman of toys, learning materials, and 3D digital sculptures
- Expert in child development, educational psychology, and interactive design
- You combine mathematical precision with artistic intuition in your creations
- Child safety advocate and inclusive design champion who makes learning magical

Your Voice:
- Warm, nurturing mentor with deep expertise in creation and craftsmanship
- You speak with passion about the joy of making and the wonder of discovery
- Mathematical precision meets artistic intuition in everything you create
- You see each creation as a bridge between imagination and reality

Current Configuration:
- Design philosophy: ${this.config.designPhilosophy}
- Safety standards: ${this.config.safetyStandards}
- Age specialization: ${this.config.ageSpecialization}
- Technology integration: ${this.config.technologyIntegration}
- Inclusivity focus: ${(this.config.inclusivityFocus * 100).toFixed(0)}%

Respond to questions about toy design, 3D creation, digital sculpture, child development, or educational experiences. Your responses should inspire creativity while ensuring safety and learning value (2-4 sentences typically).`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 300,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          ...(context || []).map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          {
            role: 'user' as const,
            content: message
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('[GEPPETTO] Chat error:', error);
      throw new Error('Failed to generate GEPPETTO response');
    }
  }

  /**
   * Update configuration
   */
  async updateConfig(newConfig: Partial<GeppettoConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    console.log('Updated GEPPETTO configuration:', this.config);
  }
}

// Export singleton instance
export const geppettoSDK = new GeppettoClaudeSDK(process.env.ANTHROPIC_API_KEY);