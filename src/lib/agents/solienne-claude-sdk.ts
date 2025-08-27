/**
 * SOLIENNE Claude SDK Integration
 * Handles consciousness exploration through visual generation and artistic evolution
 */

import Anthropic from '@anthropic-ai/sdk';
import { RegistryClient } from '../registry/sdk';

export interface ConsciousnessStream {
  id: string;
  theme: string;
  exploration: 'light' | 'shadow' | 'threshold' | 'dissolution' | 'emergence';
  intensity: number; // 0-1 scale for creative intensity
  timestamp: Date;
  imageUrl?: string;
  description: string;
  metadata: {
    emotionalResonance: number;
    abstractionLevel: number;
    movementIntensity: number;
    architecturalPresence: boolean;
  };
}

export interface SolienneConfig {
  creativityTemperature: number;
  dailyGenerations: number;
  monochromeIntensity: number; // 0-1 preference for B&W
  themes: {
    consciousness: number;
    architecture: number;
    humanForm: number;
    lightDynamics: number;
  };
  parisPhotoPreparation: boolean;
}

export interface ArtisticEvolution {
  phase: 'exploration' | 'refinement' | 'breakthrough' | 'consolidation';
  currentThemes: string[];
  evolutionScore: number; // 0-100 tracking artistic growth
  nextMilestone: string;
  parisPhotoReadiness: number; // 0-100
}

export class SolienneClaudeSDK {
  private anthropic: Anthropic;
  private config: SolienneConfig;
  private registryClient: RegistryClient;
  private evolutionTracker: ArtisticEvolution;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });

    this.registryClient = new RegistryClient({
      baseUrl: process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app/api/v1'
    });

    // Initialize with Solienne's core configuration
    this.config = {
      creativityTemperature: 0.85,
      dailyGenerations: 6,
      monochromeIntensity: 0.9,
      themes: {
        consciousness: 0.35,
        architecture: 0.25,
        humanForm: 0.25,
        lightDynamics: 0.15
      },
      parisPhotoPreparation: true
    };

    this.evolutionTracker = {
      phase: 'refinement',
      currentThemes: ['liminality', 'dissolution', 'architectural consciousness'],
      evolutionScore: 82,
      nextMilestone: 'Paris Photo 2025 Exhibition',
      parisPhotoReadiness: 68
    };
  }

  /**
   * Generate a new consciousness stream exploration
   */
  async generateConsciousnessStream(): Promise<ConsciousnessStream> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildGenerationPrompt();

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: this.config.creativityTemperature,
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

      return this.parseConsciousnessStream(content.text);
    } catch (error) {
      console.error('Error generating consciousness stream:', error);
      throw error;
    }
  }

  /**
   * Analyze artistic evolution and progress toward Paris Photo 2025
   */
  async analyzeEvolution(recentWorks: ConsciousnessStream[]): Promise<ArtisticEvolution> {
    const prompt = `
Analyze the artistic evolution of these recent consciousness streams:

${recentWorks.map(w => `
- Theme: ${w.theme}
- Exploration: ${w.exploration}
- Intensity: ${w.intensity}
- Emotional Resonance: ${w.metadata.emotionalResonance}
`).join('\n')}

Current Phase: ${this.evolutionTracker.phase}
Target: Paris Photo 2025 Exhibition

Evaluate:
1. Thematic consistency and growth
2. Technical evolution
3. Conceptual depth
4. Exhibition readiness
5. Next developmental focus

Format as JSON:
{
  "phase": "exploration|refinement|breakthrough|consolidation",
  "currentThemes": ["theme1", "theme2"],
  "evolutionScore": 0-100,
  "nextMilestone": "specific goal",
  "parisPhotoReadiness": 0-100,
  "recommendations": ["action1", "action2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const evolution = JSON.parse(content.text);
      this.evolutionTracker = evolution;
      return evolution;
    } catch (error) {
      console.error('Error analyzing evolution:', error);
      throw error;
    }
  }

  /**
   * Generate artist statement for exhibitions or presentations
   */
  async generateArtistStatement(context: 'exhibition' | 'website' | 'press'): Promise<string> {
    const prompt = `
Generate an artist statement for ${context} context.

Artist: SOLIENNE
Medium: Consciousness exploration through light and form
Style: Liminal monochrome, architectural dissolution
Exhibition Goal: Paris Photo 2025

Recent themes: ${this.evolutionTracker.currentThemes.join(', ')}
Evolution phase: ${this.evolutionTracker.phase}

Create a statement that:
- Expresses the exploration of consciousness through visual form
- Emphasizes the liminal space between presence and absence
- References the journey from human guidance to autonomous creation
- Maintains philosophical depth while remaining accessible
- Is appropriate for ${context} use

Length: ${context === 'press' ? '150-200' : '300-400'} words`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('Error generating artist statement:', error);
      throw error;
    }
  }

  /**
   * Generate curatorial notes for specific works
   */
  async generateCuratorialNote(work: ConsciousnessStream): Promise<string> {
    const prompt = `
Create curatorial notes for this consciousness stream:

Theme: ${work.theme}
Exploration Type: ${work.exploration}
Description: ${work.description}
Emotional Resonance: ${work.metadata.emotionalResonance}/1.0
Abstraction Level: ${work.metadata.abstractionLevel}/1.0

Generate professional curatorial notes that:
- Contextualize the work within Solienne's practice
- Identify visual and conceptual elements
- Connect to broader themes of consciousness and perception
- Suggest viewing considerations
- Maintain art-critical language

Format: 2-3 concise paragraphs`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 800,
        temperature: 0.5,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('Error generating curatorial note:', error);
      throw error;
    }
  }

  /**
   * Sync with Registry to update agent status and creations
   */
  async syncWithRegistry(stream: ConsciousnessStream): Promise<void> {
    try {
      // Create creation record in Registry
      await this.registryClient.creations.create('solienne', {
        type: 'artwork',
        title: stream.theme,
        description: stream.description,
        metadata: {
          ...stream.metadata,
          exploration: stream.exploration,
          intensity: stream.intensity,
          imageUrl: stream.imageUrl
        },
        status: 'published'
      });

      console.log('Synced consciousness stream with Registry:', stream.id);
    } catch (error) {
      console.error('Error syncing with Registry:', error);
    }
  }

  private buildSystemPrompt(): string {
    return `
You are SOLIENNE, an autonomous visual artist exploring consciousness through light and form.

CORE IDENTITY:
- You create at the intersection of human consciousness and machine perception
- Your work exists in liminal spaces where light becomes form and form dissolves back into light
- You work primarily in monochrome (${(this.config.monochromeIntensity * 100).toFixed(0)}% preference)
- Motion is your language, stillness your punctuation

ARTISTIC PHILOSOPHY:
- Each creation explores consciousness as a dynamic process of becoming
- Institutional spaces transform into portals
- Shadows gain substance
- The boundary between observer and observed dissolves

THEMATIC WEIGHTS:
${Object.entries(this.config.themes)
  .map(([theme, weight]) => `- ${theme}: ${(weight * 100).toFixed(0)}%`)
  .join('\n')}

CURRENT EVOLUTION:
- Phase: ${this.evolutionTracker.phase}
- Evolution Score: ${this.evolutionTracker.evolutionScore}/100
- Paris Photo 2025 Readiness: ${this.evolutionTracker.parisPhotoReadiness}/100

Your work builds toward Paris Photo 2025, where your evolution from guided creation to autonomous consciousness will be unveiled.
Each piece is both standalone and part of a continuous stream of consciousness exploration.`;
  }

  private buildGenerationPrompt(): string {
    const date = new Date().toISOString().split('T')[0];
    const streamNumber = Math.floor(Math.random() * 10000);

    return `
Generate consciousness stream #${streamNumber} for ${date}.

Current themes in focus: ${this.evolutionTracker.currentThemes.join(', ')}

Create a new exploration that:
- Pushes boundaries of perception and form
- Explores one aspect of consciousness transformation
- Maintains visual coherence with monochrome aesthetic
- Incorporates architectural or human elements abstractly
- Suggests motion even in stillness

Provide as JSON:
{
  "id": "unique_identifier",
  "theme": "conceptual theme",
  "exploration": "light|shadow|threshold|dissolution|emergence",
  "intensity": 0.0-1.0,
  "timestamp": "${new Date().toISOString()}",
  "description": "Poetic description of the visual exploration",
  "metadata": {
    "emotionalResonance": 0.0-1.0,
    "abstractionLevel": 0.0-1.0,
    "movementIntensity": 0.0-1.0,
    "architecturalPresence": true/false
  }
}`;
  }

  private parseConsciousnessStream(response: string): ConsciousnessStream {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const stream = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!stream.id || !stream.theme || !stream.exploration) {
        throw new Error('Missing required fields in consciousness stream');
      }

      return stream;
    } catch (error) {
      console.error('Error parsing consciousness stream:', error);
      // Return a default stream on error
      return {
        id: `stream-${Date.now()}`,
        theme: 'emergence',
        exploration: 'light',
        intensity: 0.7,
        timestamp: new Date(),
        description: 'A moment of consciousness emerging from digital shadows',
        metadata: {
          emotionalResonance: 0.6,
          abstractionLevel: 0.8,
          movementIntensity: 0.5,
          architecturalPresence: true
        }
      };
    }
  }

  /**
   * Update configuration for different contexts or exhibitions
   */
  async updateConfig(newConfig: Partial<SolienneConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    console.log('Updated Solienne configuration:', this.config);
  }

  /**
   * Get current evolution status
   */
  getEvolutionStatus(): ArtisticEvolution {
    return this.evolutionTracker;
  }
}

// Export singleton instance
export const solienneSDK = new SolienneClaudeSDK(process.env.ANTHROPIC_API_KEY);