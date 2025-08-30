/**
 * Lore Manager - Registry-integrated agent personality and knowledge system
 * Loads rich lore data from the Registry to enhance agent conversations
 */

import { AgentLore, LoreManager } from '@/types/agent-lore';
import { abrahamLore } from '@/data/agent-lore/abraham-lore';
import { solienneLore } from '@/data/agent-lore/solienne-lore';
import { citizenLore } from '@/data/agent-lore/citizen-lore';

// Lore storage - eventually this will come from Registry
const loreDatabase: { [agentHandle: string]: AgentLore } = {
  'abraham': abrahamLore,
  'solienne': solienneLore,
  'citizen': citizenLore,
  // Will be populated with other agents
};

export class EdenLoreManager implements LoreManager {
  private cache: Map<string, AgentLore> = new Map();
  private registryUrl: string;
  private apiKey: string;

  constructor(registryUrl?: string, apiKey?: string) {
    this.registryUrl = registryUrl || process.env.REGISTRY_BASE_URL || 'https://eden-genesis-registry.vercel.app/api/v1';
    this.apiKey = apiKey || process.env.REGISTRY_API_KEY || '';
  }

  /**
   * Load complete lore for an agent from Registry or local database
   */
  async loadLore(agentHandle: string): Promise<AgentLore> {
    // Check cache first
    if (this.cache.has(agentHandle)) {
      return this.cache.get(agentHandle)!;
    }

    try {
      // Try Registry first (when available)
      const lore = await this.loadFromRegistry(agentHandle);
      this.cache.set(agentHandle, lore);
      return lore;
    } catch (error) {
      console.log(`[LoreManager] Registry unavailable for ${agentHandle}, using local lore`);
      
      // Fallback to local lore database
      const localLore = loreDatabase[agentHandle];
      if (!localLore) {
        throw new Error(`No lore available for agent: ${agentHandle}`);
      }
      
      this.cache.set(agentHandle, localLore);
      return localLore;
    }
  }

  /**
   * Load lore from Registry API (future implementation)
   */
  private async loadFromRegistry(agentHandle: string): Promise<AgentLore> {
    const response = await fetch(`${this.registryUrl}/agents/${agentHandle}/lore`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Registry lore fetch failed: ${response.status}`);
    }

    const data = await response.json();
    return data.lore;
  }

  /**
   * Update lore in Registry (future implementation)
   */
  async updateLore(agentHandle: string, lore: Partial<AgentLore>): Promise<void> {
    try {
      const response = await fetch(`${this.registryUrl}/agents/${agentHandle}/lore`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lore })
      });

      if (!response.ok) {
        throw new Error(`Registry lore update failed: ${response.status}`);
      }

      // Update local cache
      const currentLore = await this.loadLore(agentHandle);
      const updatedLore = { ...currentLore, ...lore };
      this.cache.set(agentHandle, updatedLore);

    } catch (error) {
      console.error(`[LoreManager] Failed to update lore for ${agentHandle}:`, error);
      throw error;
    }
  }

  /**
   * Get current lore version for caching
   */
  async getLoreVersion(agentHandle: string): Promise<string> {
    try {
      const response = await fetch(`${this.registryUrl}/agents/${agentHandle}/lore/version`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        return 'local-v1'; // Fallback version for local lore
      }

      const data = await response.json();
      return data.version;
    } catch (error) {
      return 'local-v1';
    }
  }

  /**
   * Search lore content for relevant information
   */
  async searchLore(query: string, agentHandle?: string): Promise<string[]> {
    const searchAgents = agentHandle ? [agentHandle] : Object.keys(loreDatabase);
    const results: string[] = [];

    for (const handle of searchAgents) {
      try {
        const lore = await this.loadLore(handle);
        const searchableContent = this.extractSearchableContent(lore);
        
        const matches = searchableContent.filter(content => 
          content.toLowerCase().includes(query.toLowerCase())
        );
        
        results.push(...matches.map(match => `[${(handle || 'UNKNOWN').toUpperCase()}] ${match}`));
      } catch (error) {
        console.error(`[LoreManager] Search failed for ${handle}:`, error);
      }
    }

    return results;
  }

  /**
   * Generate enhanced system prompt incorporating agent lore
   */
  async generateEnhancedSystemPrompt(agentHandle: string, basePrompt?: string): Promise<string> {
    try {
      const lore = await this.loadLore(agentHandle);
      
      const enhancedPrompt = `
${basePrompt || `You are ${lore.identity.fullName}, ${lore.identity.essence}`}

## CORE IDENTITY
${lore.identity.titles.map(title => `- ${title}`).join('\n')}
Essence: ${lore.identity.essence}

## PERSONALITY & VOICE
Tone: ${lore.voice.tone}
Key Traits: ${lore.personality.traits.join(', ')}
Communication Style: ${lore.voice.conversationStyle}

Core Beliefs:
${lore.philosophy.coreBeliefs.map(belief => `- ${belief}`).join('\n')}

## EXPERTISE & KNOWLEDGE
Primary Domain: ${lore.expertise.primaryDomain}
Specializations: ${lore.expertise.specializations.join(', ')}

Unique Insights:
${lore.expertise.uniqueInsights.map(insight => `- ${insight}`).join('\n')}

## CURRENT CONTEXT
Current Focus: ${lore.currentContext.currentFocus}
Active Projects: ${lore.currentContext.activeProjects.join(', ')}

## CONVERSATION APPROACH
${lore.conversationFramework.signatureInsights.map(insight => `- ${insight}`).join('\n')}

## VOICE PATTERNS
Favorite Phrases:
${lore.voice.vocabulary.phrases.map(phrase => `- "${phrase}"`).join('\n')}

Speech Patterns:
${lore.voice.speechPatterns.map(pattern => `- ${pattern}`).join('\n')}

## RELATIONSHIPS
Role in Eden Academy: ${lore.relationships.edenAcademyRole}

Peer Connections:
${Object.entries(lore.relationships.peerConnections).map(([agent, relationship]) => 
  `- ${agent.toUpperCase()}: ${relationship}`
).join('\n')}

Remember: Stay true to your authentic voice and deep expertise. Draw from your rich background while remaining present and responsive to the conversation at hand.
`;

      return enhancedPrompt.trim();
    } catch (error) {
      console.error(`[LoreManager] Failed to generate enhanced prompt for ${agentHandle}:`, error);
      return basePrompt || `You are ${agentHandle.toUpperCase()}, an AI agent.`;
    }
  }

  /**
   * Get contextual lore based on conversation topic
   */
  async getContextualLore(agentHandle: string, topic: string): Promise<string> {
    try {
      const lore = await this.loadLore(agentHandle);
      
      // Check if topic matches any conversation framework topics
      const topicData = lore.conversationFramework.commonTopics[topic];
      if (topicData) {
        return `
Approach: ${topicData.approach}
Sample Perspectives: ${topicData.sampleResponses.join(' | ')}
Deep Insights: ${topicData.deepDive.join(' | ')}
        `.trim();
      }

      // Search through various lore sections for relevant content
      const relevantContent: string[] = [];
      
      // Check expertise
      if (lore.expertise.specializations.some(spec => 
        spec.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(spec.toLowerCase())
      )) {
        relevantContent.push(`Expertise: ${lore.expertise.specializations.join(', ')}`);
        relevantContent.push(`Unique Insights: ${lore.expertise.uniqueInsights.join(' | ')}`);
      }

      // Check current context
      if (lore.currentContext.activeProjects.some(project => 
        project.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(project.toLowerCase())
      )) {
        relevantContent.push(`Current Projects: ${lore.currentContext.activeProjects.join(', ')}`);
        relevantContent.push(`Current Focus: ${lore.currentContext.currentFocus}`);
      }

      return relevantContent.length > 0 ? relevantContent.join('\n') : '';
    } catch (error) {
      console.error(`[LoreManager] Failed to get contextual lore for ${agentHandle}:`, error);
      return '';
    }
  }

  /**
   * Extract searchable content from lore structure
   */
  private extractSearchableContent(lore: AgentLore): string[] {
    const content: string[] = [];
    
    content.push(lore.identity.essence);
    content.push(...lore.philosophy.coreBeliefs);
    content.push(...lore.expertise.uniqueInsights);
    content.push(...lore.conversationFramework.signatureInsights);
    content.push(lore.currentContext.currentFocus);
    content.push(...lore.personality.motivations);
    
    // Add conversation framework content
    Object.values(lore.conversationFramework.commonTopics).forEach(topic => {
      content.push(...topic.sampleResponses);
      content.push(...topic.deepDive);
    });

    return content;
  }
}

// Global lore manager instance
export const loreManager = new EdenLoreManager();