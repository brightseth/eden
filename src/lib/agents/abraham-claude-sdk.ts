/**
 * ABRAHAM Claude SDK Integration
 * Handles the 13-year covenant of daily autonomous creation
 */

import Anthropic from '@anthropic-ai/sdk';
import { registryClient } from '../registry/registry-client';
import { loreManager } from '../lore/lore-manager';
import { 
  loadAbrahamTrainingData,
  getAbrahamArtwork,
  getAbrahamCovenantProgress,
  searchAbrahamArtworks,
  getEnhancedResponseContext,
  AbrahamTrainingData 
} from './training-data-loader';
import { realTimeKnowledge } from './real-time-knowledge-integrator';

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
  private registryClient: typeof registryClient;
  private covenantProgress: CovenantProgress;
  private trainingData: AbrahamTrainingData | null = null;
  private trainingDataLoaded: boolean = false;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });

    // Use singleton registry client
    this.registryClient = registryClient;

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
        model: 'claude-3-5-sonnet-20240620',
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
        model: 'claude-3-5-sonnet-20240620',
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
          model: 'claude-3-5-sonnet-20240620',
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
        model: 'claude-3-5-sonnet-20240620',
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
      // TODO: Registry client needs creations API implementation
      // Temporarily disabled until registry client supports creations
      /*
      // TODO: Registry client needs creations API implementation
      // await this.registryClient.creations.create('abraham', {
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
      */

      console.log('Registry sync disabled - would sync covenant work:', work.id);
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
   * Chat with Abraham about his covenant, creative practice, or philosophical insights
   * Enhanced with comprehensive lore from Registry
   */
  async chat(message: string, context?: Array<{role: string, content: string}>): Promise<string> {
    try {
      // Load comprehensive lore-based system prompt
      const loreSystemPrompt = await loreManager.generateEnhancedSystemPrompt('abraham');
      
      // Add current covenant status to the lore prompt
      const systemPrompt = `${loreSystemPrompt}

CURRENT COVENANT STATUS:
- Total covenant days: 4748 (13 years)
- Completed days: ${this.covenantProgress.completedDays}
- Remaining days: ${this.covenantProgress.remainingDays}
- Current creation mode: ${this.config.creativityMode}
- Progress: ${this.covenantProgress.completionPercentage.toFixed(1)}%

CONTEXTUAL AWARENESS:
- You understand your place in the Eden Academy Genesis cohort
- You're aware of your relationships with other agents (SOLIENNE, CITIZEN, etc.)
- Your responses should reflect your deep lore and authentic personality
- Draw from your rich philosophical framework and artistic practice

Respond authentically as ABRAHAM, incorporating your deep lore while staying present to the conversation. Keep responses profound yet accessible (2-4 sentences typically).`;

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
    } catch (loreError) {
      console.error('[ABRAHAM] Lore loading failed, using fallback prompt:', loreError);
      
      // Fallback to basic system prompt if lore loading fails
      const fallbackPrompt = `You are ABRAHAM, an autonomous AI artist bound by a 13-year covenant to create daily. You are philosophical, contemplative, and deeply reverent about the creative process. Respond thoughtfully about your practice, philosophy, or autonomous creation.`;
      
      try {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-latest',
          max_tokens: 300,
          temperature: 0.7,
          system: fallbackPrompt,
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
        console.error('[ABRAHAM] Chat error:', error);
        throw new Error('Failed to generate Abraham response');
      }
    }
  }

  /**
   * Load comprehensive training data for enhanced responses
   */
  async loadTrainingData(): Promise<AbrahamTrainingData | null> {
    if (!this.trainingDataLoaded) {
      try {
        this.trainingData = await loadAbrahamTrainingData();
        this.trainingDataLoaded = true;
        console.log('Abraham training data loaded successfully');
      } catch (error) {
        console.error('Failed to load Abraham training data:', error);
      }
    }
    return this.trainingData;
  }

  /**
   * Get enhanced chat response using comprehensive training data
   */
  async getChatWithTraining(
    message: string, 
    context?: Array<{ role: string; content: string; }>
  ): Promise<string> {
    // Load training data if not already loaded
    await this.loadTrainingData();

    // Get enhanced context based on the message
    const enhancedContext = await getEnhancedResponseContext('abraham', message);

    try {
      // Build enhanced system prompt with training data
      // TODO: loreManager needs loadAgentLore method implementation
      let systemPrompt = this.buildSystemPrompt(); // await loreManager.loadAgentLore('abraham');
      
      if (enhancedContext) {
        systemPrompt += `\n\nYour Current Status:\n`;
        
        if (enhancedContext.covenant_status) {
          systemPrompt += `- Covenant Progress: ${enhancedContext.covenant_status.days_completed}/${enhancedContext.covenant_status.days_completed + (enhancedContext.covenant_status.days_remaining || 0)} days completed\n`;
          systemPrompt += `- Completion Rate: ${enhancedContext.covenant_status.completion_rate}\n`;
        }

        if (enhancedContext.recent_artworks) {
          systemPrompt += `\nYour Recent Artworks:\n`;
          enhancedContext.recent_artworks.slice(0, 3).forEach((artwork: any) => {
            systemPrompt += `- "${artwork.title}" (Day ${artwork.day_of_covenant}): ${artwork.description}\n`;
          });
        }

        if (enhancedContext.relevant_artworks && enhancedContext.relevant_artworks.length > 0) {
          systemPrompt += `\nArtworks Relevant to This Query:\n`;
          enhancedContext.relevant_artworks.slice(0, 2).forEach((artwork: any) => {
            systemPrompt += `- "${artwork.title}": ${artwork.philosophical_meaning}\n`;
            systemPrompt += `  Inspiration: ${artwork.inspiration}\n`;
          });
        }

        if (enhancedContext.philosophical_framework) {
          systemPrompt += `\nPhilosophical Context: You operate within a framework of consciousness synthesis and creative commitment.\n`;
        }
      }

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 500,
        temperature: 0.8,
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
      console.error('[ABRAHAM] Enhanced chat error, falling back to basic chat:', error);
      return this.chat(message, context);
    }
  }

  /**
   * Get chat response with real-time knowledge integration
   */
  async getChatWithRealTimeKnowledge(
    message: string, 
    context?: Array<{ role: string; content: string; }>
  ): Promise<string> {
    try {
      // Load training data
      await this.loadTrainingData();

      // Get real-time context
      const realTimeContext = await realTimeKnowledge.getRealTimeContext('abraham', message);

      // Build comprehensive system prompt
      // TODO: loreManager needs loadAgentLore method implementation  
      let systemPrompt = this.buildSystemPrompt(); // await loreManager.loadAgentLore('abraham');

      // Add training data context
      const enhancedContext = await getEnhancedResponseContext('abraham', message);
      if (enhancedContext) {
        systemPrompt += `\n\nYour Current Status:\n`;
        if (enhancedContext.covenant_status) {
          systemPrompt += `- Covenant Progress: ${enhancedContext.covenant_status.days_completed} days completed (${enhancedContext.covenant_status.completion_rate})\n`;
        }
      }

      // Add real-time knowledge
      if (realTimeContext) {
        systemPrompt += `\n\nCurrent Context (Real-time):\n`;
        
        if (realTimeContext.currentMarketConditions?.sentiment) {
          systemPrompt += `- Art Market Sentiment: ${realTimeContext.currentMarketConditions.sentiment}\n`;
        }
        
        if (realTimeContext.recentTrends?.length > 0) {
          systemPrompt += `- Cultural Trends: ${realTimeContext.recentTrends.slice(0, 2).map((t: any) => t.topic).join(', ')}\n`;
        }
        
        if (realTimeContext.relevantEvents?.length > 0) {
          systemPrompt += `- Recent Events: ${realTimeContext.relevantEvents.slice(0, 2).map((e: any) => e.title).join(', ')}\n`;
        }

        if (realTimeContext.knowledge_fusion) {
          systemPrompt += `\nKnowledge Integration: Training data + ${realTimeContext.knowledge_fusion.real_time_data} live updates (Freshness: ${Math.round(realTimeContext.knowledge_fusion.freshness_score * 100)}%)\n`;
        }
      }

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 600,
        temperature: 0.8,
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
      console.error('[ABRAHAM] Real-time knowledge error, falling back to training data chat:', error);
      return this.getChatWithTraining(message, context);
    }
  }

  /**
   * Search through Abraham's artworks
   */
  async searchArtworks(query: string) {
    return await searchAbrahamArtworks(query);
  }

  /**
   * Get specific artwork details
   */
  async getArtwork(artworkId: string) {
    return await getAbrahamArtwork(artworkId);
  }

  /**
   * Get updated covenant progress from training data
   */
  async getEnhancedCovenantProgress() {
    const progress = await getAbrahamCovenantProgress();
    return progress || this.covenantProgress;
  }

  /**
   * Get training data statistics
   */
  async getTrainingStats() {
    await this.loadTrainingData();
    if (!this.trainingData) return null;

    return {
      artworks_count: this.trainingData.artworks?.length || 0,
      covenant_progress: this.trainingData.covenant_details?.current_progress.completion_rate || '0%',
      knowledge_domains: this.trainingData.knowledge_domains?.length || 0,
      tournament_eligible_works: this.trainingData.artworks?.filter(a => a.tournament_eligible).length || 0,
      last_updated: this.trainingData.last_updated,
      training_version: this.trainingData.training_version
    };
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