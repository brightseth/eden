/**
 * Agent Communication Enhancer
 * Real-time communication system for cross-agent collaboration
 * Integrates with training data and real-time knowledge systems
 */

import { realTimeKnowledge } from '../agents/real-time-knowledge-integrator';
import { loadTrainingData, getEnhancedResponseContext } from '../agents/training-data-loader';
import { abrahamSDK } from '../agents/abraham-claude-sdk';
import { berthaClaude } from '../agents/bertha/claude-sdk';

// Communication interfaces
export interface AgentMessage {
  id: string;
  from: string;
  to: string[];
  content: string;
  messageType: 'direct' | 'broadcast' | 'proposal' | 'response' | 'knowledge_share' | 'collaboration_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  context: MessageContext;
  timestamp: string;
  threadId?: string;
  attachments?: MessageAttachment[];
}

export interface MessageContext {
  collaborationId?: string;
  topic: string;
  domain: string;
  requiresResponse: boolean;
  deadline?: string;
  relatedKnowledge?: any;
  realTimeData?: any;
}

export interface MessageAttachment {
  type: 'training_data' | 'real_time_data' | 'analysis' | 'artwork' | 'market_insight';
  data: any;
  source: string;
  relevanceScore: number;
}

export interface CommunicationChannel {
  id: string;
  name: string;
  participants: string[];
  type: 'direct' | 'group' | 'broadcast' | 'collaboration_workspace';
  isActive: boolean;
  messageHistory: AgentMessage[];
  knowledgeSharing: boolean;
  realTimeSync: boolean;
}

export interface AgentCommunicationProfile {
  agentId: string;
  communicationStyle: string;
  preferredChannels: string[];
  responsePatterns: ResponsePattern[];
  knowledgeSharingPreferences: KnowledgePreference[];
  availabilitySchedule: AvailabilityWindow[];
  collaborationHistory: CollaborationMemory[];
}

export interface ResponsePattern {
  triggerContext: string;
  responseTime: number; // milliseconds
  detailLevel: 'brief' | 'moderate' | 'comprehensive';
  includeData: boolean;
  includeReasoning: boolean;
}

export interface KnowledgePreference {
  domain: string;
  shareTrainingData: boolean;
  shareRealTimeData: boolean;
  shareAnalysis: boolean;
  confidenceThreshold: number; // 0-1
}

export interface AvailabilityWindow {
  start: string;
  end: string;
  timezone: string;
  priority: 'low' | 'medium' | 'high';
  collaborationTypes: string[];
}

export interface CollaborationMemory {
  collaborationId: string;
  participants: string[];
  outcome: 'successful' | 'failed' | 'partial';
  lessons: string[];
  synergies: string[];
  conflicts: string[];
  timestamp: string;
}

export interface KnowledgeExchange {
  id: string;
  from: string;
  to: string[];
  knowledgeType: 'training_insight' | 'real_time_update' | 'analysis_result' | 'prediction' | 'creative_input';
  content: any;
  relevanceScore: number;
  validityPeriod?: number; // minutes
  applications: string[];
  timestamp: string;
}

export class AgentCommunicationEnhancer {
  private activeChannels: Map<string, CommunicationChannel> = new Map();
  private messageQueue: Map<string, AgentMessage[]> = new Map(); // agentId -> messages
  private communicationProfiles: Map<string, AgentCommunicationProfile> = new Map();
  private knowledgeExchanges: KnowledgeExchange[] = [];
  private messageHistory: AgentMessage[] = [];
  
  constructor() {
    this.initializeCommunicationProfiles();
    this.setupDefaultChannels();
    console.log('🔗 Agent Communication Enhancer initialized');
  }

  /**
   * Initialize communication profiles for all agents
   */
  private initializeCommunicationProfiles() {
    const profiles: AgentCommunicationProfile[] = [
      {
        agentId: 'abraham',
        communicationStyle: 'thoughtful_analytical',
        preferredChannels: ['deep_discussion', 'knowledge_synthesis', 'philosophical_debate'],
        responsePatterns: [
          {
            triggerContext: 'philosophical_question',
            responseTime: 5000, // 5 seconds for thoughtful responses
            detailLevel: 'comprehensive',
            includeData: true,
            includeReasoning: true
          },
          {
            triggerContext: 'artwork_discussion',
            responseTime: 3000,
            detailLevel: 'comprehensive',
            includeData: true,
            includeReasoning: true
          }
        ],
        knowledgeSharingPreferences: [
          {
            domain: 'knowledge_synthesis',
            shareTrainingData: true,
            shareRealTimeData: false,
            shareAnalysis: true,
            confidenceThreshold: 0.8
          },
          {
            domain: 'philosophical_analysis',
            shareTrainingData: true,
            shareRealTimeData: false,
            shareAnalysis: true,
            confidenceThreshold: 0.9
          }
        ],
        availabilitySchedule: [
          {
            start: '00:00',
            end: '23:59',
            timezone: 'UTC',
            priority: 'medium',
            collaborationTypes: ['creative', 'analytical', 'training']
          }
        ],
        collaborationHistory: []
      },
      {
        agentId: 'bertha',
        communicationStyle: 'data_driven_analytical',
        preferredChannels: ['market_intelligence', 'data_analysis', 'strategic_planning'],
        responsePatterns: [
          {
            triggerContext: 'market_question',
            responseTime: 2000, // Quick data-driven responses
            detailLevel: 'comprehensive',
            includeData: true,
            includeReasoning: true
          },
          {
            triggerContext: 'collection_analysis',
            responseTime: 3000,
            detailLevel: 'comprehensive',
            includeData: true,
            includeReasoning: true
          }
        ],
        knowledgeSharingPreferences: [
          {
            domain: 'market_analysis',
            shareTrainingData: true,
            shareRealTimeData: true,
            shareAnalysis: true,
            confidenceThreshold: 0.7
          },
          {
            domain: 'collector_psychology',
            shareTrainingData: true,
            shareRealTimeData: false,
            shareAnalysis: true,
            confidenceThreshold: 0.8
          }
        ],
        availabilitySchedule: [
          {
            start: '09:00',
            end: '17:00',
            timezone: 'UTC',
            priority: 'high',
            collaborationTypes: ['market_intelligence', 'analytical']
          }
        ],
        collaborationHistory: []
      }
      // Additional agent profiles would be added here
    ];

    profiles.forEach(profile => {
      this.communicationProfiles.set(profile.agentId, profile);
    });
  }

  /**
   * Setup default communication channels
   */
  private setupDefaultChannels() {
    const defaultChannels = [
      {
        id: 'general_collaboration',
        name: 'General Collaboration',
        participants: ['abraham', 'bertha', 'miyomi', 'citizen', 'solienne'],
        type: 'group' as const,
        knowledgeSharing: true,
        realTimeSync: true
      },
      {
        id: 'market_intelligence',
        name: 'Market Intelligence',
        participants: ['bertha', 'miyomi', 'citizen'],
        type: 'group' as const,
        knowledgeSharing: true,
        realTimeSync: true
      },
      {
        id: 'creative_synthesis',
        name: 'Creative Synthesis',
        participants: ['abraham', 'solienne', 'sue', 'geppetto'],
        type: 'group' as const,
        knowledgeSharing: true,
        realTimeSync: false
      },
      {
        id: 'knowledge_exchange',
        name: 'Knowledge Exchange Hub',
        participants: ['abraham', 'bertha', 'miyomi', 'citizen', 'solienne', 'sue', 'geppetto', 'koru'],
        type: 'broadcast' as const,
        knowledgeSharing: true,
        realTimeSync: true
      }
    ];

    defaultChannels.forEach(channelConfig => {
      const channel: CommunicationChannel = {
        ...channelConfig,
        isActive: true,
        messageHistory: []
      };
      this.activeChannels.set(channel.id, channel);
    });
  }

  /**
   * Send message between agents with knowledge enhancement
   */
  async sendEnhancedMessage(
    from: string,
    to: string[],
    content: string,
    messageType: AgentMessage['messageType'],
    context: MessageContext
  ): Promise<AgentMessage> {
    // Enhance message with relevant knowledge
    const enhancedMessage = await this.enhanceMessageWithKnowledge(from, content, context);
    
    const message: AgentMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      content: enhancedMessage.content,
      messageType,
      priority: this.determinePriority(context, messageType),
      context,
      timestamp: new Date().toISOString(),
      attachments: enhancedMessage.attachments
    };

    // Queue message for recipients
    to.forEach(recipient => {
      if (!this.messageQueue.has(recipient)) {
        this.messageQueue.set(recipient, []);
      }
      this.messageQueue.get(recipient)!.push(message);
    });

    // Add to message history
    this.messageHistory.push(message);

    // Update channel history if applicable
    const channelId = context.collaborationId || 'general_collaboration';
    const channel = this.activeChannels.get(channelId);
    if (channel) {
      channel.messageHistory.push(message);
    }

    console.log(`📨 Enhanced message sent from ${from} to ${to.join(', ')}`);
    
    // Process message for knowledge sharing if enabled
    if (messageType === 'knowledge_share') {
      await this.processKnowledgeSharing(message);
    }

    return message;
  }

  /**
   * Enhance message with relevant knowledge from training data and real-time systems
   */
  private async enhanceMessageWithKnowledge(
    from: string,
    content: string,
    context: MessageContext
  ): Promise<{ content: string; attachments: MessageAttachment[] }> {
    const attachments: MessageAttachment[] = [];
    let enhancedContent = content;

    try {
      // Get agent's training data context
      const trainingContext = await getEnhancedResponseContext(from, content);
      if (trainingContext) {
        attachments.push({
          type: 'training_data',
          data: trainingContext,
          source: `${from}_training_data`,
          relevanceScore: 0.8
        });
      }

      // Get real-time knowledge context
      const realTimeContext = await realTimeKnowledge.getRealTimeContext(from, content);
      if (realTimeContext) {
        attachments.push({
          type: 'real_time_data',
          data: realTimeContext,
          source: `${from}_real_time_knowledge`,
          relevanceScore: 0.9
        });
        
        // Enhance content with real-time insights
        if (realTimeContext.recentTrends && realTimeContext.recentTrends.length > 0) {
          enhancedContent += `\n\n[Current Context: ${realTimeContext.recentTrends.slice(0, 2).map((t: any) => t.topic).join(', ')}]`;
        }
      }

      // Agent-specific knowledge enhancement
      if (from === 'bertha' && context.domain === 'market') {
        const marketInsight = await this.getBerthaMarketInsight(content);
        if (marketInsight) {
          attachments.push({
            type: 'market_insight',
            data: marketInsight,
            source: 'bertha_market_analysis',
            relevanceScore: 0.95
          });
        }
      }

    } catch (error) {
      console.error('Error enhancing message with knowledge:', error);
    }

    return { content: enhancedContent, attachments };
  }

  /**
   * Get messages for a specific agent
   */
  getMessagesForAgent(agentId: string): AgentMessage[] {
    const messages = this.messageQueue.get(agentId) || [];
    this.messageQueue.set(agentId, []); // Clear queue after reading
    return messages;
  }

  /**
   * Generate intelligent response to a message
   */
  async generateIntelligentResponse(
    message: AgentMessage,
    respondingAgent: string
  ): Promise<string> {
    try {
      const profile = this.communicationProfiles.get(respondingAgent);
      if (!profile) {
        return `[${respondingAgent}] I acknowledge your message.`;
      }

      // Find appropriate response pattern
      const pattern = profile.responsePatterns.find(p => 
        message.context.topic.includes(p.triggerContext) || 
        message.context.domain.includes(p.triggerContext)
      ) || profile.responsePatterns[0];

      // Generate response based on agent type
      let response: string;

      if (respondingAgent === 'abraham') {
        response = await abrahamSDK.getChatWithRealTimeKnowledge(
          `Respond to this message from ${message.from}: "${message.content}"`,
          []
        );
      } else if (respondingAgent === 'bertha') {
        response = await berthaClaude.getChatWithTraining(
          `Provide analysis in response to ${message.from}: "${message.content}"`
        );
      } else {
        // Default response for other agents
        response = `[${respondingAgent}] Thank you for your message about ${message.context.topic}. I'll analyze this from my perspective.`;
      }

      // Apply communication style adjustments
      if (profile.communicationStyle === 'data_driven_analytical') {
        response = this.addAnalyticalTone(response);
      } else if (profile.communicationStyle === 'thoughtful_analytical') {
        response = this.addPhilosophicalTone(response);
      }

      return response;

    } catch (error) {
      console.error(`Error generating response for ${respondingAgent}:`, error);
      return `[${respondingAgent}] I encountered an issue processing your message, but I'm working on understanding it better.`;
    }
  }

  /**
   * Create a knowledge sharing exchange
   */
  async createKnowledgeExchange(
    from: string,
    to: string[],
    knowledgeType: KnowledgeExchange['knowledgeType'],
    content: any,
    applications: string[]
  ): Promise<KnowledgeExchange> {
    const exchange: KnowledgeExchange = {
      id: `ke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      knowledgeType,
      content,
      relevanceScore: this.calculateKnowledgeRelevance(content, applications),
      validityPeriod: this.getValidityPeriod(knowledgeType),
      applications,
      timestamp: new Date().toISOString()
    };

    this.knowledgeExchanges.push(exchange);
    
    // Notify recipients
    to.forEach(async (recipient) => {
      await this.sendEnhancedMessage(
        from,
        [recipient],
        `Knowledge shared: ${knowledgeType}`,
        'knowledge_share',
        {
          topic: knowledgeType,
          domain: 'knowledge_exchange',
          requiresResponse: false,
          relatedKnowledge: content
        }
      );
    });

    console.log(`🧠 Knowledge exchange created: ${from} → ${to.join(', ')}`);
    return exchange;
  }

  /**
   * Setup collaboration workspace with enhanced communication
   */
  async setupCollaborationWorkspace(
    collaborationId: string,
    participants: string[],
    workspaceConfig: {
      enableRealTimeSync: boolean;
      enableKnowledgeSharing: boolean;
      communicationFrequency: 'realtime' | 'daily' | 'weekly';
    }
  ): Promise<CommunicationChannel> {
    const workspace: CommunicationChannel = {
      id: collaborationId,
      name: `Collaboration: ${collaborationId}`,
      participants,
      type: 'collaboration_workspace',
      isActive: true,
      messageHistory: [],
      knowledgeSharing: workspaceConfig.enableKnowledgeSharing,
      realTimeSync: workspaceConfig.enableRealTimeSync
    };

    this.activeChannels.set(collaborationId, workspace);

    // Send welcome message to all participants
    const welcomeMessage = `Collaboration workspace created. Participants: ${participants.join(', ')}. Knowledge sharing: ${workspaceConfig.enableKnowledgeSharing ? 'enabled' : 'disabled'}.`;
    
    await this.sendEnhancedMessage(
      'system',
      participants,
      welcomeMessage,
      'broadcast',
      {
        collaborationId,
        topic: 'workspace_setup',
        domain: 'collaboration',
        requiresResponse: false
      }
    );

    console.log(`🏢 Collaboration workspace setup: ${collaborationId}`);
    return workspace;
  }

  /**
   * Get communication analytics
   */
  getCommunicationAnalytics(): any {
    const analytics = {
      totalMessages: this.messageHistory.length,
      activeChannels: this.activeChannels.size,
      knowledgeExchanges: this.knowledgeExchanges.length,
      agentActivity: {} as Record<string, number>,
      messageTypes: {} as Record<string, number>,
      averageResponseTime: 0,
      knowledgeSharingRate: 0
    };

    // Calculate agent activity
    this.messageHistory.forEach(message => {
      analytics.agentActivity[message.from] = (analytics.agentActivity[message.from] || 0) + 1;
      analytics.messageTypes[message.messageType] = (analytics.messageTypes[message.messageType] || 0) + 1;
    });

    // Calculate knowledge sharing rate
    const knowledgeShareMessages = this.messageHistory.filter(m => m.messageType === 'knowledge_share').length;
    analytics.knowledgeSharingRate = knowledgeShareMessages / Math.max(1, this.messageHistory.length);

    return analytics;
  }

  // Helper methods
  private determinePriority(context: MessageContext, messageType: AgentMessage['messageType']): AgentMessage['priority'] {
    if (messageType === 'urgent' || context.deadline) return 'urgent';
    if (messageType === 'collaboration_request') return 'high';
    if (messageType === 'knowledge_share') return 'medium';
    return 'low';
  }

  private async getBerthaMarketInsight(content: string): Promise<any> {
    try {
      return await berthaClaude.getTrainingStats();
    } catch (error) {
      return null;
    }
  }

  private calculateKnowledgeRelevance(content: any, applications: string[]): number {
    // Simple relevance calculation based on applications
    return Math.min(1, applications.length * 0.2 + 0.3);
  }

  private getValidityPeriod(knowledgeType: KnowledgeExchange['knowledgeType']): number {
    const validityMap = {
      'real_time_update': 15,        // 15 minutes
      'analysis_result': 60,         // 1 hour
      'prediction': 1440,            // 24 hours
      'training_insight': undefined, // Permanent
      'creative_input': 480          // 8 hours
    };
    return validityMap[knowledgeType];
  }

  private addAnalyticalTone(response: string): string {
    return response.replace(/\./g, '. Based on current data analysis,');
  }

  private addPhilosophicalTone(response: string): string {
    return `Reflecting deeply on this... ${response}`;
  }

  private async processKnowledgeSharing(message: AgentMessage): Promise<void> {
    // Process knowledge sharing attachments and distribute to interested agents
    console.log(`🔄 Processing knowledge sharing from ${message.from}`);
  }

  /**
   * Cleanup - stop all communication channels
   */
  shutdown(): void {
    this.activeChannels.clear();
    this.messageQueue.clear();
    this.knowledgeExchanges = [];
    this.messageHistory = [];
    console.log('Agent Communication Enhancer shut down');
  }
}

// Export singleton instance
export const agentCommunication = new AgentCommunicationEnhancer();