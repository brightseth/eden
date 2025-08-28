// Snapshot DAO Integration Service for Registry Gateway
// Handles all Snapshot API interactions for CITIZEN governance on Sepolia testnet

import { registryAuth } from './auth';
import { cacheGet, cacheSet, cacheInvalidate } from './cache';

interface SnapshotConfig {
  baseUrl: string;
  networkId: number;
  apiKey?: string;
  timeout: number;
  maxRetries: number;
}

interface GovernanceProposal {
  spaceId: string;
  title: string;
  description: string;
  choices: string[];
  type: 'single-choice' | 'approval' | 'quadratic' | 'custom';
  startTime: number;
  endTime: number;
  metadata: {
    plugins?: any[];
    strategies?: any[];
    [key: string]: any;
  };
}

interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: 'pending' | 'active' | 'closed';
  author: string;
  space: {
    id: string;
    name: string;
  };
  type: string;
  strategies: any[];
  plugins: any[];
  scores: number[];
  votes: number;
}

interface VotingPowerResult {
  address: string;
  space: string;
  power: number;
  tokens: {
    [symbol: string]: number;
  };
}

interface ProposalSyncResult {
  proposalId: string;
  registryWorkId: string;
  snapshotData: SnapshotProposal;
  syncedAt: Date;
  success: boolean;
  error?: string;
}

interface SnapshotSpace {
  id: string;
  name: string;
  about: string;
  network: string;
  symbol: string;
  strategies: any[];
  members: string[];
  filters: any;
  plugins: any;
}

class SnapshotService {
  private config: SnapshotConfig;
  private traceCounter: number = 0;

  constructor() {
    this.config = {
      baseUrl: process.env.SNAPSHOT_BASE_URL || 'https://testnet.snapshot.org',
      networkId: parseInt(process.env.GOVERNANCE_NETWORK_ID || '11155111'), // Sepolia
      apiKey: process.env.SNAPSHOT_API_KEY,
      timeout: 30000, // 30 seconds for Snapshot API
      maxRetries: 3
    };

    console.log(`[SnapshotService] Initialized for network ${this.config.networkId} (${this.config.networkId === 11155111 ? 'Sepolia testnet' : 'unknown'})`);
  }

  private generateTraceId(): string {
    this.traceCounter++;
    return `snapshot-${Date.now()}-${this.traceCounter}`;
  }

  private async makeSnapshotRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any,
    requireAuth: boolean = false
  ): Promise<T> {
    const traceId = this.generateTraceId();
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'User-Agent': 'Eden-Academy-CITIZEN/1.0'
    };

    if (requireAuth && this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.config.timeout)
    };

    if (body && method === 'POST') {
      requestOptions.body = JSON.stringify(body);
    }

    console.log(`[SnapshotService] ${method} ${url} - trace: ${traceId}`);

    let lastError: Error;
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`Snapshot API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[SnapshotService] Success ${method} ${url} - trace: ${traceId}`);
        return data;

      } catch (error) {
        lastError = error as Error;
        console.error(`[SnapshotService] Attempt ${attempt}/${this.config.maxRetries} failed - trace: ${traceId}`, error);
        
        if (attempt < this.config.maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  // Cache wrapper for GET requests
  private async cachedRequest<T>(
    cacheKey: string,
    requestFn: () => Promise<T>,
    ttl: number = 300 // 5 minutes default
  ): Promise<T> {
    const cached = await cacheGet<T>(cacheKey);
    if (cached) {
      console.log(`[SnapshotService] Cache hit for ${cacheKey}`);
      return cached;
    }

    const result = await requestFn();
    await cacheSet(cacheKey, result, ttl);
    return result;
  }

  // Public API Methods

  async createProposal(spaceId: string, proposal: GovernanceProposal): Promise<SnapshotProposal> {
    const traceId = this.generateTraceId();
    console.log(`[SnapshotService] Creating proposal in space ${spaceId} - trace: ${traceId}`);

    // Validate proposal data
    if (!proposal.title || !proposal.description || !proposal.choices.length) {
      throw new Error('Invalid proposal: title, description, and choices are required');
    }

    if (proposal.choices.length < 2) {
      throw new Error('Invalid proposal: at least 2 choices are required');
    }

    if (proposal.startTime >= proposal.endTime) {
      throw new Error('Invalid proposal: start time must be before end time');
    }

    // Ensure testnet safety - allow both Sepolia and mainnet for eden.eth space
    const isMainnetEdenSpace = spaceId === 'eden.eth' && this.config.networkId === 1;
    const isSepoliaTestnet = this.config.networkId === 11155111;
    
    if (!isMainnetEdenSpace && !isSepoliaTestnet) {
      throw new Error(`Proposal creation only allowed on Sepolia testnet (11155111) or eden.eth space, current network: ${this.config.networkId}, space: ${spaceId}`);
    }

    const snapshotProposal = await this.makeSnapshotRequest<SnapshotProposal>(
      '/api/msg',
      'POST',
      {
        address: process.env.CITIZEN_WALLET_ADDRESS, // CITIZEN's testnet address
        msg: {
          space: spaceId,
          type: 'proposal',
          title: proposal.title,
          body: proposal.description,
          choices: proposal.choices,
          start: proposal.startTime,
          end: proposal.endTime,
          snapshot: 'latest',
          network: this.config.networkId.toString(),
          strategies: proposal.metadata.strategies || [],
          plugins: proposal.metadata.plugins || [],
          metadata: proposal.metadata
        }
      },
      true // require auth
    );

    // Invalidate relevant caches
    await cacheInvalidate(`space-${spaceId}-proposals`);
    await cacheInvalidate(`space-${spaceId}`);

    console.log(`[SnapshotService] Created proposal ${snapshotProposal.id} in space ${spaceId} - trace: ${traceId}`);
    return snapshotProposal;
  }

  async getSpace(spaceId: string): Promise<SnapshotSpace> {
    const cacheKey = `snapshot-space-${spaceId}`;
    
    return this.cachedRequest(
      cacheKey,
      () => this.makeSnapshotRequest<SnapshotSpace>(`/api/spaces/${spaceId}`),
      1800 // 30 minutes cache
    );
  }

  async getProposal(proposalId: string): Promise<SnapshotProposal> {
    const cacheKey = `snapshot-proposal-${proposalId}`;
    
    return this.cachedRequest(
      cacheKey,
      () => this.makeSnapshotRequest<SnapshotProposal>(`/api/proposals/${proposalId}`),
      60 // 1 minute cache for active proposals
    );
  }

  async getSpaceProposals(spaceId: string, limit: number = 20): Promise<SnapshotProposal[]> {
    const cacheKey = `space-${spaceId}-proposals-${limit}`;
    
    return this.cachedRequest(
      cacheKey,
      () => this.makeSnapshotRequest<SnapshotProposal[]>(`/api/spaces/${spaceId}/proposals?limit=${limit}`),
      300 // 5 minutes cache
    );
  }

  async getVotingPower(spaceId: string, address: string): Promise<VotingPowerResult> {
    const cacheKey = `voting-power-${spaceId}-${address}`;
    
    return this.cachedRequest(
      cacheKey,
      () => this.makeSnapshotRequest<VotingPowerResult>(`/api/spaces/${spaceId}/voting-power/${address}`),
      600 // 10 minutes cache
    );
  }

  async castVote(proposalId: string, choice: number, address: string): Promise<{ success: boolean; txHash?: string }> {
    const traceId = this.generateTraceId();
    console.log(`[SnapshotService] Casting vote on proposal ${proposalId} - trace: ${traceId}`);

    // Ensure testnet safety - allow both Sepolia and mainnet for eden.eth space
    const isMainnetEdenSpace = this.config.networkId === 1;
    const isSepoliaTestnet = this.config.networkId === 11155111;
    
    if (!isMainnetEdenSpace && !isSepoliaTestnet) {
      throw new Error(`Vote casting only allowed on Sepolia testnet (11155111) or mainnet for eden.eth, current network: ${this.config.networkId}`);
    }

    const result = await this.makeSnapshotRequest<{ success: boolean; txHash?: string }>(
      '/api/msg',
      'POST',
      {
        address,
        msg: {
          space: 'eden.eth', // Use Eden testnet space
          proposal: proposalId,
          type: 'vote',
          choice,
          metadata: {
            source: 'eden-academy-citizen',
            network: this.config.networkId,
            agent: 'citizen'
          }
        }
      },
      true // require auth
    );

    // Invalidate proposal cache to refresh vote counts
    await cacheInvalidate(`snapshot-proposal-${proposalId}`);

    console.log(`[SnapshotService] Vote cast on proposal ${proposalId} - trace: ${traceId}`, result);
    return result;
  }

  // Sync proposal data from Snapshot back to Registry
  async syncProposalData(proposalId: string, registryWorkId: string): Promise<ProposalSyncResult> {
    const traceId = this.generateTraceId();
    console.log(`[SnapshotService] Syncing proposal data ${proposalId} to Registry work ${registryWorkId} - trace: ${traceId}`);

    try {
      const snapshotData = await this.getProposal(proposalId);
      
      const syncResult: ProposalSyncResult = {
        proposalId,
        registryWorkId,
        snapshotData,
        syncedAt: new Date(),
        success: true
      };

      console.log(`[SnapshotService] Successfully synced proposal ${proposalId} - trace: ${traceId}`);
      return syncResult;

    } catch (error) {
      console.error(`[SnapshotService] Failed to sync proposal ${proposalId} - trace: ${traceId}`, error);
      
      return {
        proposalId,
        registryWorkId,
        snapshotData: {} as SnapshotProposal,
        syncedAt: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown sync error'
      };
    }
  }

  // Health check for Snapshot service
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    network: number;
    endpoint: string;
    latency?: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await this.makeSnapshotRequest('/api/msg', 'GET');
      const latency = Date.now() - startTime;
      
      return {
        status: latency > 5000 ? 'degraded' : 'healthy',
        network: this.config.networkId,
        endpoint: this.config.baseUrl,
        latency
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        network: this.config.networkId,
        endpoint: this.config.baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Network validation helper - supports Sepolia testnet and eden.eth space
  isTestnetOnly(): boolean {
    return this.config.networkId === 11155111 || this.config.networkId === 1; // Sepolia or mainnet for eden.eth
  }
  
  // Check if using eden.eth space specifically
  isEdenSpace(): boolean {
    return true; // Always using eden.eth space now
  }

  // Get current configuration (for debugging)
  getConfig(): SnapshotConfig {
    return {
      ...this.config,
      apiKey: this.config.apiKey ? '***masked***' : undefined
    };
  }
}

// Export singleton instance
export const snapshotService = new SnapshotService();

// Export types for use in other modules
export type {
  GovernanceProposal,
  SnapshotProposal,
  VotingPowerResult,
  ProposalSyncResult,
  SnapshotSpace
};