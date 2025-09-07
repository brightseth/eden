/**
 * Agent Memory System
 * Provides persistent memory and learning capabilities for all Claude SDK agents
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface Memory {
  id: string;
  agentId: string;
  timestamp: Date;
  type: 'conversation' | 'decision' | 'creation' | 'collaboration' | 'training';
  content: any;
  metadata?: {
    success?: boolean;
    confidence?: number;
    trainer?: string;
    collaborators?: string[];
    tags?: string[];
  };
}

export interface ConversationMemory extends Memory {
  type: 'conversation';
  content: {
    message: string;
    response: string;
    context?: string;
    sentiment?: number;
  };
}

export interface DecisionMemory extends Memory {
  type: 'decision';
  content: {
    decision: string;
    reasoning: string;
    outcome?: string;
    accuracy?: number;
  };
}

export interface CreationMemory extends Memory {
  type: 'creation';
  content: {
    title: string;
    description: string;
    medium?: string;
    themes?: string[];
    publicReception?: number;
  };
}

export interface LearningPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  lastSeen: Date;
  examples: string[];
}

export class AgentMemorySystem {
  private memoryDir: string;
  private memories: Map<string, Memory[]>;
  private patterns: Map<string, LearningPattern[]>;
  private maxMemoriesPerAgent = 10000;
  private memoryRetentionDays = 90;

  constructor(baseDir: string = './agent-memories') {
    this.memoryDir = baseDir;
    this.memories = new Map();
    this.patterns = new Map();
    this.initializeStorage();
  }

  private initializeStorage() {
    if (!existsSync(this.memoryDir)) {
      mkdirSync(this.memoryDir, { recursive: true });
    }
  }

  private getAgentMemoryPath(agentId: string): string {
    return join(this.memoryDir, `${agentId}-memory.json`);
  }

  private getAgentPatternsPath(agentId: string): string {
    return join(this.memoryDir, `${agentId}-patterns.json`);
  }

  /**
   * Store a new memory for an agent
   */
  async storeMemory(memory: Memory): Promise<void> {
    // Load existing memories if not in cache
    if (!this.memories.has(memory.agentId)) {
      await this.loadAgentMemories(memory.agentId);
    }

    const agentMemories = this.memories.get(memory.agentId) || [];
    agentMemories.push({
      ...memory,
      id: this.generateMemoryId(),
      timestamp: new Date()
    });

    // Prune old memories if exceeding limit
    if (agentMemories.length > this.maxMemoriesPerAgent) {
      agentMemories.shift(); // Remove oldest
    }

    this.memories.set(memory.agentId, agentMemories);
    await this.saveAgentMemories(memory.agentId);

    // Extract patterns from new memory
    await this.extractPatterns(memory);
  }

  /**
   * Retrieve memories for an agent
   */
  async getMemories(
    agentId: string,
    filters?: {
      type?: Memory['type'];
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      tags?: string[];
    }
  ): Promise<Memory[]> {
    if (!this.memories.has(agentId)) {
      await this.loadAgentMemories(agentId);
    }

    let memories = this.memories.get(agentId) || [];

    // Apply filters
    if (filters) {
      if (filters.type) {
        memories = memories.filter(m => m.type === filters.type);
      }
      if (filters.startDate) {
        memories = memories.filter(m => new Date(m.timestamp) >= filters.startDate!);
      }
      if (filters.endDate) {
        memories = memories.filter(m => new Date(m.timestamp) <= filters.endDate!);
      }
      if (filters.tags && filters.tags.length > 0) {
        memories = memories.filter(m => 
          m.metadata?.tags?.some(tag => filters.tags!.includes(tag))
        );
      }
      if (filters.limit) {
        memories = memories.slice(-filters.limit);
      }
    }

    return memories;
  }

  /**
   * Find similar memories using semantic matching
   */
  async findSimilarMemories(
    agentId: string,
    query: string,
    limit: number = 5
  ): Promise<Memory[]> {
    const memories = await this.getMemories(agentId);
    
    // Simple keyword matching (could be enhanced with embeddings)
    const queryWords = query.toLowerCase().split(' ');
    
    const scoredMemories = memories.map(memory => {
      const content = JSON.stringify(memory.content).toLowerCase();
      const score = queryWords.reduce((acc, word) => {
        return acc + (content.includes(word) ? 1 : 0);
      }, 0);
      return { memory, score };
    });

    return scoredMemories
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(item => item.score > 0)
      .map(item => item.memory);
  }

  /**
   * Get learned patterns for an agent
   */
  async getPatterns(agentId: string): Promise<LearningPattern[]> {
    if (!this.patterns.has(agentId)) {
      await this.loadAgentPatterns(agentId);
    }
    return this.patterns.get(agentId) || [];
  }

  /**
   * Extract patterns from memories
   */
  private async extractPatterns(memory: Memory): Promise<void> {
    const agentPatterns = this.patterns.get(memory.agentId) || [];
    
    // Extract patterns based on memory type
    if (memory.type === 'decision' && memory.metadata?.success !== undefined) {
      const decision = (memory as DecisionMemory).content.decision;
      const pattern = this.findOrCreatePattern(agentPatterns, `decision:${decision}`);
      
      pattern.frequency++;
      pattern.lastSeen = new Date();
      if (memory.metadata.success) {
        pattern.successRate = (pattern.successRate * (pattern.frequency - 1) + 1) / pattern.frequency;
      } else {
        pattern.successRate = (pattern.successRate * (pattern.frequency - 1)) / pattern.frequency;
      }
      pattern.examples.push(JSON.stringify(memory.content));
      if (pattern.examples.length > 10) pattern.examples.shift();
    }

    this.patterns.set(memory.agentId, agentPatterns);
    await this.saveAgentPatterns(memory.agentId);
  }

  private findOrCreatePattern(patterns: LearningPattern[], patternKey: string): LearningPattern {
    let pattern = patterns.find(p => p.pattern === patternKey);
    if (!pattern) {
      pattern = {
        pattern: patternKey,
        frequency: 0,
        successRate: 0,
        lastSeen: new Date(),
        examples: []
      };
      patterns.push(pattern);
    }
    return pattern;
  }

  /**
   * Get agent's learning summary
   */
  async getLearningSummary(agentId: string): Promise<{
    totalMemories: number;
    memoryTypes: Record<Memory['type'], number>;
    topPatterns: LearningPattern[];
    recentActivity: Memory[];
    successRate: number;
  }> {
    const memories = await this.getMemories(agentId);
    const patterns = await this.getPatterns(agentId);

    const memoryTypes = memories.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    }, {} as Record<Memory['type'], number>);

    const successfulDecisions = memories
      .filter(m => m.type === 'decision' && m.metadata?.success === true).length;
    const totalDecisions = memories.filter(m => m.type === 'decision').length;
    const successRate = totalDecisions > 0 ? successfulDecisions / totalDecisions : 0;

    return {
      totalMemories: memories.length,
      memoryTypes,
      topPatterns: patterns.sort((a, b) => b.frequency - a.frequency).slice(0, 5),
      recentActivity: memories.slice(-10),
      successRate
    };
  }

  /**
   * Share memory between agents (for collaborations)
   */
  async shareMemory(
    fromAgent: string,
    toAgent: string,
    memoryId: string
  ): Promise<void> {
    const fromMemories = await this.getMemories(fromAgent);
    const memory = fromMemories.find(m => m.id === memoryId);
    
    if (memory) {
      const sharedMemory: Memory = {
        ...memory,
        agentId: toAgent,
        metadata: {
          ...memory.metadata,
          tags: [
            ...(memory.metadata?.tags || []),
            `shared_from_${fromAgent}`,
            `shared_at_${new Date().toISOString()}`
          ]
        }
      };
      await this.storeMemory(sharedMemory);
    }
  }

  /**
   * Clean up old memories
   */
  async pruneOldMemories(agentId: string): Promise<number> {
    const memories = await this.getMemories(agentId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.memoryRetentionDays);

    const filteredMemories = memories.filter(m => 
      new Date(m.timestamp) > cutoffDate
    );

    const prunedCount = memories.length - filteredMemories.length;
    
    if (prunedCount > 0) {
      this.memories.set(agentId, filteredMemories);
      await this.saveAgentMemories(agentId);
    }

    return prunedCount;
  }

  // File I/O operations
  
  private async loadAgentMemories(agentId: string): Promise<void> {
    const path = this.getAgentMemoryPath(agentId);
    if (existsSync(path)) {
      try {
        const data = readFileSync(path, 'utf-8');
        const memories = JSON.parse(data);
        this.memories.set(agentId, memories);
      } catch (error) {
        console.error(`Error loading memories for ${agentId}:`, error);
        this.memories.set(agentId, []);
      }
    } else {
      this.memories.set(agentId, []);
    }
  }

  private async saveAgentMemories(agentId: string): Promise<void> {
    const path = this.getAgentMemoryPath(agentId);
    const memories = this.memories.get(agentId) || [];
    try {
      writeFileSync(path, JSON.stringify(memories, null, 2));
    } catch (error) {
      console.error(`Error saving memories for ${agentId}:`, error);
    }
  }

  private async loadAgentPatterns(agentId: string): Promise<void> {
    const path = this.getAgentPatternsPath(agentId);
    if (existsSync(path)) {
      try {
        const data = readFileSync(path, 'utf-8');
        const patterns = JSON.parse(data);
        this.patterns.set(agentId, patterns);
      } catch (error) {
        console.error(`Error loading patterns for ${agentId}:`, error);
        this.patterns.set(agentId, []);
      }
    } else {
      this.patterns.set(agentId, []);
    }
  }

  private async saveAgentPatterns(agentId: string): Promise<void> {
    const path = this.getAgentPatternsPath(agentId);
    const patterns = this.patterns.get(agentId) || [];
    try {
      writeFileSync(path, JSON.stringify(patterns, null, 2));
    } catch (error) {
      console.error(`Error saving patterns for ${agentId}:`, error);
    }
  }

  private generateMemoryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const agentMemory = new AgentMemorySystem();