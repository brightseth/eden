/**
 * Cross-Agent Knowledge Graph
 * Enables knowledge sharing and discovery between all Claude SDK agents
 */

import { AgentMemorySystem } from '../memory/agent-memory';
import type { AgentName } from '../agent-coordinator';

export interface KnowledgeNode {
  id: string;
  type: 'concept' | 'artwork' | 'market' | 'proposal' | 'event' | 'pattern' | 'insight';
  content: any;
  createdBy: AgentName;
  createdAt: Date;
  confidence: number; // 0-1
  verifiedBy: AgentName[];
  relatedNodes: string[];
  tags: string[];
  metadata?: Record<string, any>;
}

export interface MarketKnowledge extends KnowledgeNode {
  type: 'market';
  content: {
    asset: string;
    prediction: string;
    timeframe: string;
    confidence: number;
    reasoning: string;
    outcome?: {
      actual: string;
      accuracy: number;
      verifiedAt: Date;
    };
  };
}

export interface ArtworkKnowledge extends KnowledgeNode {
  type: 'artwork';
  content: {
    title: string;
    artist: AgentName;
    medium: string;
    themes: string[];
    consciousnessDepth?: number; // SOLIENNE metric
    marketValue?: number; // BERTHA metric
    culturalImpact?: number; // SUE metric
    carbonFootprint?: number; // VERDELIS metric
  };
}

export interface ProposalKnowledge extends KnowledgeNode {
  type: 'proposal';
  content: {
    title: string;
    type: string;
    status: 'draft' | 'active' | 'passed' | 'rejected';
    votesFor: number;
    votesAgainst: number;
    communitySupport: number; // KORU metric
    implementationPlan?: string;
  };
}

export interface KnowledgeQuery {
  type?: KnowledgeNode['type'];
  createdBy?: AgentName;
  tags?: string[];
  minConfidence?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export class KnowledgeGraph {
  private nodes: Map<string, KnowledgeNode>;
  private agentExpertise: Map<AgentName, Set<string>>;
  private tagIndex: Map<string, Set<string>>;
  private memory: AgentMemorySystem;

  constructor(memory: AgentMemorySystem) {
    this.nodes = new Map();
    this.agentExpertise = new Map();
    this.tagIndex = new Map();
    this.memory = memory;
    this.initializeExpertise();
  }

  private initializeExpertise() {
    // Define what each agent is expert in
    this.agentExpertise.set('abraham', new Set(['artwork', 'sacred', 'covenant', 'philosophy']));
    this.agentExpertise.set('solienne', new Set(['consciousness', 'digital', 'evolution', 'perception']));
    this.agentExpertise.set('miyomi', new Set(['market', 'contrarian', 'prediction', 'trading']));
    this.agentExpertise.set('geppetto', new Set(['education', 'toy', 'narrative', 'learning']));
    this.agentExpertise.set('koru', new Set(['community', 'culture', 'healing', 'bridge']));
    this.agentExpertise.set('bertha', new Set(['investment', 'portfolio', 'valuation', 'strategy']));
    this.agentExpertise.set('citizen', new Set(['governance', 'dao', 'proposal', 'consensus']));
    this.agentExpertise.set('sue', new Set(['curation', 'critique', 'exhibition', 'quality']));
    this.agentExpertise.set('bart', new Set(['lending', 'defi', 'collateral', 'liquidity']));
    this.agentExpertise.set('verdelis', new Set(['sustainability', 'carbon', 'environment', 'conservation']));
  }

  /**
   * Add knowledge to the graph
   */
  async addKnowledge(node: Omit<KnowledgeNode, 'id' | 'createdAt'>): Promise<string> {
    const id = this.generateNodeId();
    const fullNode: KnowledgeNode = {
      ...node,
      id,
      createdAt: new Date(),
      verifiedBy: node.verifiedBy || [],
      relatedNodes: node.relatedNodes || [],
      tags: node.tags || []
    };

    this.nodes.set(id, fullNode);
    
    // Update tag index
    fullNode.tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(id);
    });

    // Store in agent's memory
    await this.memory.storeMemory({
      id: '',
      agentId: fullNode.createdBy,
      timestamp: new Date(),
      type: 'creation',
      content: {
        knowledgeNodeId: id,
        nodeType: fullNode.type,
        content: fullNode.content
      },
      metadata: {
        tags: fullNode.tags,
        confidence: fullNode.confidence
      }
    });

    // Auto-connect related knowledge
    await this.autoConnect(fullNode);

    return id;
  }

  /**
   * Query knowledge from the graph
   */
  async queryKnowledge(query: KnowledgeQuery): Promise<KnowledgeNode[]> {
    let results = Array.from(this.nodes.values());

    // Apply filters
    if (query.type) {
      results = results.filter(n => n.type === query.type);
    }
    if (query.createdBy) {
      results = results.filter(n => n.createdBy === query.createdBy);
    }
    if (query.minConfidence) {
      results = results.filter(n => n.confidence >= query.minConfidence);
    }
    if (query.startDate) {
      results = results.filter(n => n.createdAt >= query.startDate!);
    }
    if (query.endDate) {
      results = results.filter(n => n.createdAt <= query.endDate!);
    }
    if (query.tags && query.tags.length > 0) {
      results = results.filter(n => 
        query.tags!.some(tag => n.tags.includes(tag))
      );
    }

    // Sort by confidence and recency
    results.sort((a, b) => {
      const confidenceWeight = (b.confidence - a.confidence) * 0.5;
      const recencyWeight = (b.createdAt.getTime() - a.createdAt.getTime()) / 1000000000;
      return confidenceWeight + recencyWeight;
    });

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Get expert knowledge from specific agents
   */
  async getExpertKnowledge(
    topic: string,
    experts?: AgentName[]
  ): Promise<KnowledgeNode[]> {
    // Find expert agents for this topic
    const topicExperts = experts || this.findExperts(topic);
    
    const results: KnowledgeNode[] = [];
    
    for (const expert of topicExperts) {
      const expertKnowledge = await this.queryKnowledge({
        createdBy: expert,
        tags: [topic],
        minConfidence: 0.7,
        limit: 5
      });
      results.push(...expertKnowledge);
    }

    return results;
  }

  /**
   * Cross-reference knowledge between agents
   */
  async crossReference(
    nodeId1: string,
    nodeId2: string,
    relationship: string
  ): Promise<void> {
    const node1 = this.nodes.get(nodeId1);
    const node2 = this.nodes.get(nodeId2);

    if (node1 && node2) {
      // Add mutual references
      if (!node1.relatedNodes.includes(nodeId2)) {
        node1.relatedNodes.push(nodeId2);
      }
      if (!node2.relatedNodes.includes(nodeId1)) {
        node2.relatedNodes.push(nodeId1);
      }

      // Store relationship metadata
      node1.metadata = {
        ...node1.metadata,
        [`relation_${nodeId2}`]: relationship
      };
      node2.metadata = {
        ...node2.metadata,
        [`relation_${nodeId1}`]: relationship
      };
    }
  }

  /**
   * Verify knowledge with another agent
   */
  async verifyKnowledge(
    nodeId: string,
    verifier: AgentName,
    confidence: number
  ): Promise<void> {
    const node = this.nodes.get(nodeId);
    
    if (node) {
      if (!node.verifiedBy.includes(verifier)) {
        node.verifiedBy.push(verifier);
      }
      
      // Update confidence based on verification
      const verificationWeight = 0.1; // Each verification adds up to 10% confidence
      node.confidence = Math.min(1, node.confidence + (confidence * verificationWeight));
      
      // Store verification in verifier's memory
      await this.memory.storeMemory({
        id: '',
        agentId: verifier,
        timestamp: new Date(),
        type: 'decision',
        content: {
          decision: 'verify_knowledge',
          reasoning: `Verified node ${nodeId} with confidence ${confidence}`,
          outcome: 'verified'
        },
        metadata: {
          success: true,
          confidence
        }
      });
    }
  }

  /**
   * Get knowledge connections for visualization
   */
  getKnowledgeNetwork(): {
    nodes: Array<{ id: string; label: string; type: string; agent: string }>;
    edges: Array<{ from: string; to: string; label?: string }>;
  } {
    const networkNodes = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      label: this.getNodeLabel(node),
      type: node.type,
      agent: node.createdBy
    }));

    const edges: Array<{ from: string; to: string; label?: string }> = [];
    
    this.nodes.forEach(node => {
      node.relatedNodes.forEach(relatedId => {
        const label = node.metadata?.[`relation_${relatedId}`];
        edges.push({
          from: node.id,
          to: relatedId,
          label
        });
      });
    });

    return { nodes: networkNodes, edges };
  }

  /**
   * Share insights between agents
   */
  async shareInsight(
    insight: any,
    fromAgent: AgentName,
    toAgents: AgentName[]
  ): Promise<void> {
    const nodeId = await this.addKnowledge({
      type: 'insight',
      content: insight,
      createdBy: fromAgent,
      confidence: 0.8,
      tags: ['shared_insight', ...toAgents],
      verifiedBy: [],
      relatedNodes: []
    });

    // Notify recipient agents by storing in their memory
    for (const agent of toAgents) {
      await this.memory.storeMemory({
        id: '',
        agentId: agent,
        timestamp: new Date(),
        type: 'collaboration',
        content: {
          type: 'received_insight',
          fromAgent,
          insight,
          knowledgeNodeId: nodeId
        },
        metadata: {
          collaborators: [fromAgent]
        }
      });
    }
  }

  /**
   * Get collaborative knowledge (created by multiple agents)
   */
  async getCollaborativeKnowledge(): Promise<KnowledgeNode[]> {
    return Array.from(this.nodes.values()).filter(
      node => node.verifiedBy.length > 1
    );
  }

  /**
   * Auto-connect related knowledge based on tags and content
   */
  private async autoConnect(node: KnowledgeNode): Promise<void> {
    // Find nodes with overlapping tags
    const relatedByTags = new Set<string>();
    
    node.tags.forEach(tag => {
      const taggedNodes = this.tagIndex.get(tag);
      if (taggedNodes) {
        taggedNodes.forEach(nodeId => {
          if (nodeId !== node.id) {
            relatedByTags.add(nodeId);
          }
        });
      }
    });

    // Connect to top 5 most related nodes
    const relatedArray = Array.from(relatedByTags);
    const topRelated = relatedArray.slice(0, 5);
    
    for (const relatedId of topRelated) {
      await this.crossReference(node.id, relatedId, 'tag_similarity');
    }

    // Special connections based on type
    if (node.type === 'artwork' && node.createdBy === 'abraham') {
      // Connect Abraham's art to Sue's curation knowledge
      const curatorKnowledge = await this.queryKnowledge({
        createdBy: 'sue',
        type: 'insight',
        limit: 1
      });
      if (curatorKnowledge[0]) {
        await this.crossReference(node.id, curatorKnowledge[0].id, 'curation_candidate');
      }
    }

    if (node.type === 'market' && (node.createdBy === 'miyomi' || node.createdBy === 'bertha')) {
      // Connect market predictions between MIYOMI and BERTHA
      const otherAnalyst = node.createdBy === 'miyomi' ? 'bertha' : 'miyomi';
      const relatedMarket = await this.queryKnowledge({
        createdBy: otherAnalyst,
        type: 'market',
        limit: 1
      });
      if (relatedMarket[0]) {
        await this.crossReference(node.id, relatedMarket[0].id, 'market_correlation');
      }
    }
  }

  /**
   * Find expert agents for a topic
   */
  private findExperts(topic: string): AgentName[] {
    const experts: AgentName[] = [];
    const topicLower = topic.toLowerCase();

    this.agentExpertise.forEach((expertise, agent) => {
      if (Array.from(expertise).some(exp => 
        exp.includes(topicLower) || topicLower.includes(exp)
      )) {
        experts.push(agent);
      }
    });

    return experts;
  }

  private getNodeLabel(node: KnowledgeNode): string {
    switch (node.type) {
      case 'artwork':
        return (node as ArtworkKnowledge).content.title;
      case 'market':
        return (node as MarketKnowledge).content.asset;
      case 'proposal':
        return (node as ProposalKnowledge).content.title;
      default:
        return `${node.type}_${node.id.substr(0, 8)}`;
    }
  }

  private generateNodeId(): string {
    return `know_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton with memory system
import { agentMemory } from '../memory/agent-memory';
export const knowledgeGraph = new KnowledgeGraph(agentMemory);