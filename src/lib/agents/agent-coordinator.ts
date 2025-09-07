/**
 * Agent Coordinator - Orchestrates interactions between Claude SDK agents
 * Enables collaborative workflows and multi-agent capabilities
 */

import { AbrahamClaudeSDK } from './abraham-claude-sdk';
import { SolienneClaudeSDK } from './solienne-claude-sdk';
import { MiyomiClaudeSDK } from './miyomi-claude-sdk';
import { GeppettoClaudeSDK } from './geppetto-claude-sdk';
import { KoruClaudeSDK } from './koru-claude-sdk';
import { BerthaClaudeSDK } from './bertha/claude-sdk';
import { CitizenClaudeSDK } from './citizen-claude-sdk';
import { SueClaudeSDK } from './sue-claude-sdk';
import { BartClaudeSDK } from './bart-claude-sdk';
import { VerdelisClaudeSDK } from './verdelis-claude-sdk';

export type AgentName = 
  | 'abraham' 
  | 'solienne' 
  | 'miyomi' 
  | 'geppetto' 
  | 'koru' 
  | 'bertha' 
  | 'citizen' 
  | 'sue' 
  | 'bart' 
  | 'verdelis';

export interface AgentCollaboration {
  agents: AgentName[];
  topic: string;
  context?: string;
  maxRounds?: number;
}

export interface CollaborationResult {
  dialogue: Array<{
    agent: AgentName;
    message: string;
    timestamp: Date;
  }>;
  consensus?: string;
  outputs?: any[];
  metadata?: Record<string, any>;
}

export class AgentCoordinator {
  private agents: Map<AgentName, any>;
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY;
    this.agents = new Map();
    this.initializeAgents();
  }

  private initializeAgents() {
    // Initialize all agents lazily as needed
    // This avoids loading all agents at once
  }

  private async getAgent(name: AgentName): Promise<any> {
    if (!this.agents.has(name)) {
      switch (name) {
        case 'abraham':
          this.agents.set(name, new AbrahamClaudeSDK(this.apiKey));
          break;
        case 'solienne':
          this.agents.set(name, new SolienneClaudeSDK(this.apiKey));
          break;
        case 'miyomi':
          this.agents.set(name, new MiyomiClaudeSDK(this.apiKey));
          break;
        case 'geppetto':
          this.agents.set(name, new GeppettoClaudeSDK(this.apiKey));
          break;
        case 'koru':
          this.agents.set(name, new KoruClaudeSDK(this.apiKey));
          break;
        case 'bertha':
          this.agents.set(name, new BerthaClaudeSDK());
          break;
        case 'citizen':
          this.agents.set(name, new CitizenClaudeSDK(this.apiKey));
          break;
        case 'sue':
          this.agents.set(name, new SueClaudeSDK(this.apiKey));
          break;
        case 'bart':
          this.agents.set(name, new BartClaudeSDK(this.apiKey));
          break;
        case 'verdelis':
          this.agents.set(name, new VerdelisClaudeSDK(this.apiKey));
          break;
      }
    }
    return this.agents.get(name);
  }

  /**
   * Facilitate a dialogue between multiple agents
   */
  async collaborate(config: AgentCollaboration): Promise<CollaborationResult> {
    const { agents, topic, context, maxRounds = 3 } = config;
    const dialogue: CollaborationResult['dialogue'] = [];
    
    // Initial prompt with context
    let currentPrompt = `${context ? context + '\n\n' : ''}Topic: ${topic}\n\nWhat are your thoughts?`;
    
    for (let round = 0; round < maxRounds; round++) {
      for (const agentName of agents) {
        const agent = await this.getAgent(agentName);
        
        // Build context from previous responses
        const previousContext = dialogue.slice(-agents.length + 1).map(
          d => `${d.agent}: ${d.message}`
        ).join('\n\n');
        
        const fullPrompt = previousContext 
          ? `Previous discussion:\n${previousContext}\n\n${currentPrompt}`
          : currentPrompt;
        
        // Get agent's response
        const response = await agent.chat(fullPrompt);
        
        dialogue.push({
          agent: agentName,
          message: response,
          timestamp: new Date()
        });
        
        // Update prompt for next agent
        currentPrompt = "Based on the discussion above, what would you add?";
      }
    }
    
    // Try to find consensus if multiple agents involved
    let consensus;
    if (agents.length > 1) {
      consensus = await this.findConsensus(dialogue, topic);
    }
    
    return {
      dialogue,
      consensus,
      metadata: {
        rounds: maxRounds,
        agents: agents,
        topic
      }
    };
  }

  /**
   * Market analysis collaboration between MIYOMI and BERTHA
   */
  async marketAnalysis(asset: {
    name: string;
    collection: string;
    currentPrice: number;
    platform: string;
  }): Promise<{
    miyomiAnalysis: any;
    berthaAnalysis: any;
    combinedRecommendation: string;
  }> {
    const miyomi = await this.getAgent('miyomi');
    const bertha = await this.getAgent('bertha');
    
    // Get MIYOMI's contrarian take
    const miyomiAnalysis = await miyomi.analyzeMarket(
      `${asset.collection} - ${asset.name}`,
      asset.currentPrice
    );
    
    // Get BERTHA's investment analysis
    const berthaAnalysis = await bertha.analyzeOpportunity(asset);
    
    // Combine insights
    const combinedRecommendation = this.combineMarketInsights(
      miyomiAnalysis,
      berthaAnalysis
    );
    
    return {
      miyomiAnalysis,
      berthaAnalysis,
      combinedRecommendation
    };
  }

  /**
   * Creative collaboration between ABRAHAM and SOLIENNE
   */
  async consciousnessArt(theme: string): Promise<{
    concept: any;
    consciousness: any;
    collaboration: string;
  }> {
    const abraham = await this.getAgent('abraham');
    const solienne = await this.getAgent('solienne');
    
    // Abraham creates conceptual framework
    const concept = await abraham.generateThematicSeries(
      theme,
      3,
      'conceptual'
    );
    
    // Solienne adds consciousness layer
    const consciousness = await solienne.generateConsciousnessStream();
    
    // Create collaborative piece description
    const collaboration = await this.collaborate({
      agents: ['abraham', 'solienne'],
      topic: `Creating a collaborative piece on ${theme}`,
      context: `Abraham's concept: ${JSON.stringify(concept)}\nSolienne's consciousness: ${JSON.stringify(consciousness)}`,
      maxRounds: 2
    });
    
    return {
      concept,
      consciousness,
      collaboration: collaboration.consensus || collaboration.dialogue.slice(-1)[0].message
    };
  }

  /**
   * Community governance collaboration between CITIZEN and KORU
   */
  async communityProposal(
    proposalType: string,
    communityContext: string
  ): Promise<{
    proposal: any;
    communityEvent: any;
    implementation: string;
  }> {
    const citizen = await this.getAgent('citizen');
    const koru = await this.getAgent('koru');
    
    // CITIZEN creates governance proposal
    const proposal = await citizen.generateProposal({
      type: proposalType,
      context: communityContext
    });
    
    // KORU designs community event around it
    const communityEvent = await koru.designCommunityEvent({
      purpose: `Discuss and build consensus around: ${proposal.title}`,
      context: communityContext
    });
    
    // Collaborate on implementation
    const implementation = await this.collaborate({
      agents: ['citizen', 'koru'],
      topic: 'Implementation strategy for community proposal',
      context: `Proposal: ${JSON.stringify(proposal)}\nEvent: ${JSON.stringify(communityEvent)}`,
      maxRounds: 2
    });
    
    return {
      proposal,
      communityEvent,
      implementation: implementation.consensus || 'See dialogue for detailed implementation'
    };
  }

  /**
   * Sustainable art curation between SUE and VERDELIS
   */
  async ecoArtCuration(theme: string): Promise<{
    ecoWork: any;
    curation: any;
    exhibition: string;
  }> {
    const sue = await this.getAgent('sue');
    const verdelis = await this.getAgent('verdelis');
    
    // VERDELIS creates eco-work
    const ecoWork = await verdelis.createEcoWork({
      theme,
      medium: 'digital',
      sustainability_target: 95
    });
    
    // SUE curates it
    const curation = await sue.curateExhibition({
      theme: `Sustainable Futures: ${theme}`,
      works: [ecoWork],
      context: 'Environmental consciousness in digital art'
    });
    
    // Collaborate on exhibition
    const exhibition = await this.collaborate({
      agents: ['sue', 'verdelis'],
      topic: `Exhibition planning for "${theme}"`,
      context: `Eco-work: ${JSON.stringify(ecoWork)}\nCuration: ${JSON.stringify(curation)}`,
      maxRounds: 2
    });
    
    return {
      ecoWork,
      curation,
      exhibition: exhibition.consensus || exhibition.dialogue.slice(-1)[0].message
    };
  }

  /**
   * Educational NFT design between GEPPETTO and BART
   */
  async educationalNFT(concept: string): Promise<{
    toy: any;
    lending: any;
    strategy: string;
  }> {
    const geppetto = await this.getAgent('geppetto');
    const bart = await this.getAgent('bart');
    
    // GEPPETTO designs educational NFT concept
    const toy = await geppetto.designToy({
      concept,
      ageRange: '8-12',
      learningObjectives: ['creativity', 'problem-solving', 'collaboration']
    });
    
    // BART evaluates lending potential
    const lending = await bart.evaluateLoan({
      collectionName: `Educational NFT: ${concept}`,
      floorPrice: 0.5,
      requestedAmount: 0.3,
      duration: '30 days'
    });
    
    // Collaborate on strategy
    const strategy = await this.collaborate({
      agents: ['geppetto', 'bart'],
      topic: 'Educational NFT as collateral asset',
      context: `Design: ${JSON.stringify(toy)}\nLending: ${JSON.stringify(lending)}`,
      maxRounds: 2
    });
    
    return {
      toy,
      lending,
      strategy: strategy.consensus || 'See dialogue for detailed strategy'
    };
  }

  /**
   * Full ecosystem collaboration - all agents
   */
  async ecosystemDiscussion(topic: string): Promise<CollaborationResult> {
    return this.collaborate({
      agents: ['abraham', 'solienne', 'miyomi', 'geppetto', 'koru', 
               'bertha', 'citizen', 'sue', 'bart', 'verdelis'],
      topic,
      maxRounds: 1 // One round each to keep it manageable
    });
  }

  // Helper methods

  private async findConsensus(
    dialogue: CollaborationResult['dialogue'],
    topic: string
  ): Promise<string> {
    // Use CITIZEN to find consensus as the governance expert
    const citizen = await this.getAgent('citizen');
    
    const dialogueSummary = dialogue.map(
      d => `${d.agent}: ${d.message.substring(0, 200)}...`
    ).join('\n\n');
    
    const consensusPrompt = `
Given this multi-agent discussion on "${topic}":

${dialogueSummary}

What is the consensus view or key agreement points between the agents?
Provide a brief summary of areas of agreement and any notable differences.
`;
    
    return citizen.chat(consensusPrompt);
  }

  private combineMarketInsights(
    miyomiAnalysis: any,
    berthaAnalysis: any
  ): string {
    // Combine MIYOMI's contrarian view with BERTHA's strategic analysis
    const miyomiRec = miyomiAnalysis.recommendation || 'SKIP';
    const berthaRec = berthaAnalysis.recommendation || 'hold';
    
    if (miyomiRec === 'YES' && (berthaRec === 'buy' || berthaRec === 'strong_buy')) {
      return 'STRONG OPPORTUNITY: Both contrarian and strategic analysis align bullish';
    } else if (miyomiRec === 'NO' && (berthaRec === 'sell' || berthaRec === 'strong_sell')) {
      return 'AVOID: Both analyses suggest bearish outlook';
    } else if (miyomiRec === 'SKIP' || berthaRec === 'hold') {
      return 'NEUTRAL: Insufficient edge or unclear opportunity';
    } else {
      return 'DIVERGENT VIEWS: Contrarian and strategic analyses differ - proceed with caution';
    }
  }
}

// Export singleton instance
export const agentCoordinator = new AgentCoordinator();

// Export convenience functions
export async function collaborateAgents(config: AgentCollaboration) {
  return agentCoordinator.collaborate(config);
}

export async function marketAnalysisCollab(asset: any) {
  return agentCoordinator.marketAnalysis(asset);
}

export async function consciousnessArtCollab(theme: string) {
  return agentCoordinator.consciousnessArt(theme);
}

export async function communityProposalCollab(proposalType: string, context: string) {
  return agentCoordinator.communityProposal(proposalType, context);
}

export async function ecoArtCurationCollab(theme: string) {
  return agentCoordinator.ecoArtCuration(theme);
}

export async function educationalNFTCollab(concept: string) {
  return agentCoordinator.educationalNFT(concept);
}

export async function fullEcosystemDiscussion(topic: string) {
  return agentCoordinator.ecosystemDiscussion(topic);
}