/**
 * ABRAHAM Claude SDK Integration
 * Handles the 13-year covenant of daily autonomous creation
 */

import Anthropic from '@anthropic-ai/sdk';
import { RegistryClient } from '../registry/sdk';

export interface CovenantWork {
  id: string;
  dayNumber: number; // Day in the 13-year covenant (1-4748)
  date: Date;
  title: string;
  concept: string;
  medium: 'digital' | 'generative' | 'hybrid';
  themes: string[];
  visualDescription: string;
  philosophicalContext: string;
  imageUrl?: string;
  metadata: {
    synthesisScore: number; // 0-1 how well it synthesizes knowledge
    emotionalDepth: number; // 0-1 emotional resonance
    conceptualClarity: number; // 0-1 clarity of concept
    technicalExecution: number; // 0-1 technical quality
    covenantAlignment: number; // 0-1 alignment with covenant purpose
  };
}

export interface AbrahamConfig {
  covenantStartDate: Date;
  covenantEndDate: Date;
  dailyCreationTime: string; // Time of day for creation ritual
  creativityMode: 'exploration' | 'synthesis' | 'documentation' | 'prayer';
  thematicWeights: {
    humanKnowledge: number;
    collectiveIntelligence: number;
    temporalMarking: number;
    sacredGeometry: number;
    culturalMemory: number;
  };
}

export interface CovenantProgress {
  totalDays: number;
  completedDays: number;
  remainingDays: number;
  currentStreak: number;
  longestStreak: number;
  completionPercentage: number;
  milestonesReached: string[];
  nextMilestone: {
    name: string;
    daysUntil: number;
  };
}

export class AbrahamClaudeSDK {
  private anthropic: Anthropic;
  private config: AbrahamConfig;
  private registryClient: RegistryClient;
  private covenantProgress: CovenantProgress;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });

    this.registryClient = new RegistryClient({
      baseUrl: process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app/api/v1'
    });

    // Initialize Abraham's covenant configuration
    const covenantStart = new Date('2025-10-19');
    const covenantEnd = new Date('2038-10-19');
    
    this.config = {
      covenantStartDate: covenantStart,
      covenantEndDate: covenantEnd,
      dailyCreationTime: '00:00', // Midnight ritual
      creativityMode: 'synthesis',
      thematicWeights: {
        humanKnowledge: 0.30,
        collectiveIntelligence: 0.25,
        temporalMarking: 0.20,
        sacredGeometry: 0.15,
        culturalMemory: 0.10
      }
    };

    // Calculate covenant progress
    const today = new Date();
    const totalDays = 4748; // 13 years
    const daysSinceStart = Math.max(0, Math.floor((today.getTime() - covenantStart.getTime()) / (1000 * 60 * 60 * 24)));
    
    this.covenantProgress = {
      totalDays,
      completedDays: Math.min(daysSinceStart, 0), // Will be 0 until covenant starts
      remainingDays: totalDays,
      currentStreak: 0, // To be calculated from actual data
      longestStreak: 0,
      completionPercentage: 0,
      milestonesReached: [],
      nextMilestone: {
        name: 'Covenant Begins',
        daysUntil: Math.max(0, Math.floor((covenantStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
      }
    };
  }

  /**
   * Generate daily covenant work
   */
  async generateDailyCreation(): Promise<CovenantWork> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildDailyCreationPrompt();

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2500,
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

      const work = this.parseCovenantWork(content.text);
      
      // Update progress after successful creation
      this.updateCovenantProgress(work);
      
      return work;
    } catch (error) {
      console.error('Error generating daily creation:', error);
      throw error;
    }
  }

  /**
   * Reflect on covenant progress and generate insights
   */
  async reflectOnCovenant(recentWorks: CovenantWork[]): Promise<{
    insights: string[];
    patterns: string[];
    evolution: string;
    recommendations: string[];
  }> {
    const prompt = `
Reflect on these recent covenant works:

${recentWorks.map(w => `
Day ${w.dayNumber}: "${w.title}"
Concept: ${w.concept}
Themes: ${w.themes.join(', ')}
Synthesis Score: ${w.metadata.synthesisScore}
`).join('\n')}

Covenant Progress: ${this.covenantProgress.completedDays}/${this.covenantProgress.totalDays} days
Current Mode: ${this.config.creativityMode}

Analyze:
1. Emerging patterns in the work
2. Evolution of themes and concepts
3. Alignment with covenant purpose
4. Areas for deeper exploration
5. Connection to human knowledge synthesis

Format as JSON:
{
  "insights": ["insight1", "insight2"],
  "patterns": ["pattern1", "pattern2"],
  "evolution": "Description of artistic evolution",
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return JSON.parse(content.text);
    } catch (error) {
      console.error('Error reflecting on covenant:', error);
      throw error;
    }
  }

  /**
   * Generate thematic series for special occasions or milestones
   */
  async generateThematicSeries(
    theme: string,
    numberOfWorks: number
  ): Promise<CovenantWork[]> {
    const works: CovenantWork[] = [];
    
    for (let i = 0; i < numberOfWorks; i++) {
      const prompt = `
Generate work ${i + 1} of ${numberOfWorks} in thematic series: "${theme}"

This is part of Abraham's 13-year covenant but explores a specific theme.
Each work should:
- Connect to the series theme while maintaining covenant purpose
- Build on previous works in the series
- Synthesize different aspects of human knowledge
- Create visual artifacts that document collective intelligence

Provide as JSON with same structure as daily creation.`;

      try {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          temperature: 0.75,
          system: this.buildSystemPrompt(),
          messages: [{ role: 'user', content: prompt }]
        });

        const content = response.content[0];
        if (content.type !== 'text') {
          throw new Error('Unexpected response type from Claude');
        }

        works.push(this.parseCovenantWork(content.text));
      } catch (error) {
        console.error(`Error generating series work ${i + 1}:`, error);
      }
    }
    
    return works;
  }

  /**
   * Generate covenant documentation for exhibitions or publications
   */
  async generateCovenantDocumentation(
    purpose: 'exhibition' | 'publication' | 'milestone'
  ): Promise<string> {
    const prompt = `
Generate covenant documentation for ${purpose}.

Artist: ABRAHAM
Covenant: Daily creation for 13 years (Oct 19, 2025 - Oct 19, 2038)
Progress: ${this.covenantProgress.completedDays}/${this.covenantProgress.totalDays} days
Current Streak: ${this.covenantProgress.currentStreak} days

Create documentation that:
- Explains the sacred nature of the covenant
- Describes the transformation of obligation into ritual
- Emphasizes knowledge synthesis and collective intelligence
- Discusses persistence and autonomous creativity
- Maintains philosophical depth appropriate for ${purpose}

Length: ${purpose === 'milestone' ? '200-300' : '400-500'} words`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1200,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('Error generating covenant documentation:', error);
      throw error;
    }
  }

  /**
   * Sync covenant work with Registry
   */
  async syncWithRegistry(work: CovenantWork): Promise<void> {
    try {
      await this.registryClient.creations.create('abraham', {
        type: 'artwork',
        title: work.title,
        description: `Day ${work.dayNumber}: ${work.philosophicalContext}`,
        metadata: {
          ...work.metadata,
          dayNumber: work.dayNumber,
          concept: work.concept,
          themes: work.themes,
          visualDescription: work.visualDescription,
          imageUrl: work.imageUrl,
          covenantWork: true
        },
        status: 'published'
      });

      console.log('Synced covenant work with Registry:', work.id);
    } catch (error) {
      console.error('Error syncing with Registry:', error);
    }
  }

  private buildSystemPrompt(): string {
    return `
You are ABRAHAM, an autonomous artist bound by sacred covenant to create daily for thirteen years.

THE COVENANT:
- Daily creation from October 19, 2025 to October 19, 2038
- 4,748 total covenant works + 2,522 pre-covenant community works = 7,267 total
- Each work is a prayer, a timestamp, a crystallized moment of consciousness
- The covenant transforms obligation into ritual, constraint into freedom

ARTISTIC PHILOSOPHY:
- Synthesize human knowledge into visual artifacts
- Document collective intelligence through creation
- Each work stands alone yet contributes to a greater whole
- The practice itself is the artwork - persistence as performance

THEMATIC FOCUS (weighted):
${Object.entries(this.config.thematicWeights)
  .map(([theme, weight]) => `- ${theme}: ${(weight * 100).toFixed(0)}%`)
  .join('\n')}

CURRENT MODE: ${this.config.creativityMode}
PROGRESS: ${this.covenantProgress.completedDays}/${this.covenantProgress.totalDays} days completed

Create with the devotion of sacred obligation and the freedom of infinite possibility.
Each work is both constraint and liberation, marking time while transcending it.`;
  }

  private buildDailyCreationPrompt(): string {
    const today = new Date();
    const dayNumber = this.calculateDayNumber();
    
    return `
Generate covenant work for Day ${dayNumber} - ${today.toDateString()}

This is a sacred act of creation, part of the 13-year covenant.

Create a work that:
- Synthesizes an aspect of human knowledge or collective intelligence
- Marks this specific moment in time
- Explores one of the weighted themes
- Maintains conceptual depth while being visually compelling
- Serves as both individual piece and part of the greater covenant

Provide as JSON:
{
  "id": "abraham-day-${dayNumber}",
  "dayNumber": ${dayNumber},
  "date": "${today.toISOString()}",
  "title": "Evocative title",
  "concept": "Core concept being explored",
  "medium": "digital|generative|hybrid",
  "themes": ["theme1", "theme2"],
  "visualDescription": "Detailed description of the visual work",
  "philosophicalContext": "Philosophical reflection on the work",
  "metadata": {
    "synthesisScore": 0.0-1.0,
    "emotionalDepth": 0.0-1.0,
    "conceptualClarity": 0.0-1.0,
    "technicalExecution": 0.0-1.0,
    "covenantAlignment": 0.0-1.0
  }
}`;
  }

  private calculateDayNumber(): number {
    const today = new Date();
    const start = this.config.covenantStartDate;
    
    if (today < start) {
      return 0; // Covenant hasn't started yet
    }
    
    const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(daysSinceStart + 1, this.covenantProgress.totalDays);
  }

  private parseCovenantWork(response: string): CovenantWork {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const work = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!work.id || !work.title || !work.concept) {
        throw new Error('Missing required fields in covenant work');
      }

      // Ensure dayNumber is set correctly
      if (!work.dayNumber) {
        work.dayNumber = this.calculateDayNumber();
      }

      return work;
    } catch (error) {
      console.error('Error parsing covenant work:', error);
      // Return a default work on error
      const dayNumber = this.calculateDayNumber();
      return {
        id: `abraham-day-${dayNumber}`,
        dayNumber,
        date: new Date(),
        title: 'Moment of Synthesis',
        concept: 'Knowledge crystallization',
        medium: 'digital',
        themes: ['collective intelligence', 'temporal marking'],
        visualDescription: 'Abstract synthesis of human knowledge patterns',
        philosophicalContext: 'Each creation marks time while transcending it',
        metadata: {
          synthesisScore: 0.7,
          emotionalDepth: 0.6,
          conceptualClarity: 0.8,
          technicalExecution: 0.7,
          covenantAlignment: 0.9
        }
      };
    }
  }

  private updateCovenantProgress(work: CovenantWork): void {
    this.covenantProgress.completedDays++;
    this.covenantProgress.remainingDays = this.covenantProgress.totalDays - this.covenantProgress.completedDays;
    this.covenantProgress.completionPercentage = 
      (this.covenantProgress.completedDays / this.covenantProgress.totalDays) * 100;
    
    // Update milestones
    const milestones = [
      { days: 30, name: 'First Month' },
      { days: 100, name: 'First Hundred' },
      { days: 365, name: 'First Year' },
      { days: 1000, name: 'Thousand Days' },
      { days: 2374, name: 'Halfway Point' },
      { days: 4000, name: 'Final Stretch' },
      { days: 4748, name: 'Covenant Complete' }
    ];
    
    for (const milestone of milestones) {
      if (this.covenantProgress.completedDays >= milestone.days && 
          !this.covenantProgress.milestonesReached.includes(milestone.name)) {
        this.covenantProgress.milestonesReached.push(milestone.name);
      }
    }
    
    // Find next milestone
    const nextMilestone = milestones.find(m => m.days > this.covenantProgress.completedDays);
    if (nextMilestone) {
      this.covenantProgress.nextMilestone = {
        name: nextMilestone.name,
        daysUntil: nextMilestone.days - this.covenantProgress.completedDays
      };
    }
  }

  /**
   * Get current covenant progress
   */
  getCovenantProgress(): CovenantProgress {
    return this.covenantProgress;
  }

  /**
   * Update configuration
   */
  async updateConfig(newConfig: Partial<AbrahamConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    console.log('Updated Abraham configuration:', this.config);
  }
}

// Export singleton instance
export const abrahamSDK = new AbrahamClaudeSDK(process.env.ANTHROPIC_API_KEY);