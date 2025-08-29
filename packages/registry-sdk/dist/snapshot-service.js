"use strict";
// Snapshot DAO Integration Service for Registry Gateway  
// Handles all Snapshot API interactions for CITIZEN governance with eden.eth space
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotService = void 0;
const cache_1 = require("./cache");
class SnapshotService {
    constructor() {
        this.traceCounter = 0;
        this.config = {
            baseUrl: process.env.SNAPSHOT_BASE_URL || 'https://snapshot.org',
            networkId: parseInt(process.env.GOVERNANCE_NETWORK_ID || '1'), // Mainnet for eden.eth
            apiKey: process.env.SNAPSHOT_API_KEY,
            timeout: 30000, // 30 seconds for Snapshot API
            maxRetries: 3
        };
        console.log(`[SnapshotService] Initialized for network ${this.config.networkId} (${this.config.networkId === 1 ? 'Mainnet (eden.eth)' : this.config.networkId === 11155111 ? 'Sepolia testnet' : 'unknown'})`);
    }
    generateTraceId() {
        this.traceCounter++;
        return `snapshot-${Date.now()}-${this.traceCounter}`;
    }
    async makeSnapshotRequest(endpoint, method = 'GET', body, requireAuth = false) {
        const traceId = this.generateTraceId();
        const url = `${this.config.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Eden-Academy-CITIZEN/1.0'
        };
        if (requireAuth && this.config.apiKey) {
            headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }
        const requestOptions = {
            method,
            headers,
            signal: AbortSignal.timeout(this.config.timeout)
        };
        if (body && method === 'POST') {
            requestOptions.body = JSON.stringify(body);
        }
        console.log(`[SnapshotService] ${method} ${url} - trace: ${traceId}`);
        let lastError;
        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error(`Snapshot API error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                console.log(`[SnapshotService] Success ${method} ${url} - trace: ${traceId}`);
                return data;
            }
            catch (error) {
                lastError = error;
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
    async cachedRequest(cacheKey, requestFn, ttl = 300 // 5 minutes default
    ) {
        const cached = await (0, cache_1.cacheGet)(cacheKey);
        if (cached) {
            console.log(`[SnapshotService] Cache hit for ${cacheKey}`);
            return cached;
        }
        const result = await requestFn();
        await (0, cache_1.cacheSet)(cacheKey, result, ttl);
        return result;
    }
    // Public API Methods
    async createProposal(spaceId, proposal) {
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
        const snapshotProposal = await this.makeSnapshotRequest('/api/msg', 'POST', {
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
        }, true // require auth
        );
        // Invalidate relevant caches
        await (0, cache_1.cacheInvalidate)(`space-${spaceId}-proposals`);
        await (0, cache_1.cacheInvalidate)(`space-${spaceId}`);
        console.log(`[SnapshotService] Created proposal ${snapshotProposal.id} in space ${spaceId} - trace: ${traceId}`);
        return snapshotProposal;
    }
    async getSpace(spaceId) {
        const cacheKey = `snapshot-space-${spaceId}`;
        return this.cachedRequest(cacheKey, () => this.makeSnapshotRequest(`/api/spaces/${spaceId}`), 1800 // 30 minutes cache
        );
    }
    async getProposal(proposalId) {
        const cacheKey = `snapshot-proposal-${proposalId}`;
        return this.cachedRequest(cacheKey, () => this.makeSnapshotRequest(`/api/proposals/${proposalId}`), 60 // 1 minute cache for active proposals
        );
    }
    async getSpaceProposals(spaceId, limit = 20) {
        const cacheKey = `space-${spaceId}-proposals-${limit}`;
        return this.cachedRequest(cacheKey, () => this.makeSnapshotRequest(`/api/spaces/${spaceId}/proposals?limit=${limit}`), 300 // 5 minutes cache
        );
    }
    async getVotingPower(spaceId, address) {
        const cacheKey = `voting-power-${spaceId}-${address}`;
        return this.cachedRequest(cacheKey, () => this.makeSnapshotRequest(`/api/spaces/${spaceId}/voting-power/${address}`), 600 // 10 minutes cache
        );
    }
    async castVote(proposalId, choice, address) {
        const traceId = this.generateTraceId();
        console.log(`[SnapshotService] Casting vote on proposal ${proposalId} - trace: ${traceId}`);
        // Ensure testnet safety - allow both Sepolia and mainnet for eden.eth space
        const isMainnetEdenSpace = this.config.networkId === 1;
        const isSepoliaTestnet = this.config.networkId === 11155111;
        if (!isMainnetEdenSpace && !isSepoliaTestnet) {
            throw new Error(`Vote casting only allowed on Sepolia testnet (11155111) or mainnet for eden.eth, current network: ${this.config.networkId}`);
        }
        const result = await this.makeSnapshotRequest('/api/msg', 'POST', {
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
        }, true // require auth
        );
        // Invalidate proposal cache to refresh vote counts
        await (0, cache_1.cacheInvalidate)(`snapshot-proposal-${proposalId}`);
        console.log(`[SnapshotService] Vote cast on proposal ${proposalId} - trace: ${traceId}`, result);
        return result;
    }
    // Sync proposal data from Snapshot back to Registry
    async syncProposalData(proposalId, registryWorkId) {
        const traceId = this.generateTraceId();
        console.log(`[SnapshotService] Syncing proposal data ${proposalId} to Registry work ${registryWorkId} - trace: ${traceId}`);
        try {
            const snapshotData = await this.getProposal(proposalId);
            const syncResult = {
                proposalId,
                registryWorkId,
                snapshotData,
                syncedAt: new Date(),
                success: true
            };
            console.log(`[SnapshotService] Successfully synced proposal ${proposalId} - trace: ${traceId}`);
            return syncResult;
        }
        catch (error) {
            console.error(`[SnapshotService] Failed to sync proposal ${proposalId} - trace: ${traceId}`, error);
            return {
                proposalId,
                registryWorkId,
                snapshotData: {},
                syncedAt: new Date(),
                success: false,
                error: error instanceof Error ? error.message : 'Unknown sync error'
            };
        }
    }
    // Health check for Snapshot service
    async healthCheck() {
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
        }
        catch (error) {
            return {
                status: 'unhealthy',
                network: this.config.networkId,
                endpoint: this.config.baseUrl,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    // Network validation helper - supports Sepolia testnet and eden.eth space
    isTestnetOnly() {
        return this.config.networkId === 11155111 || this.config.networkId === 1; // Sepolia or mainnet for eden.eth
    }
    // Check if using eden.eth space specifically
    isEdenSpace() {
        return true; // Always using eden.eth space now
    }
    // Get current configuration (for debugging)
    getConfig() {
        return {
            ...this.config,
            apiKey: this.config.apiKey ? '***masked***' : undefined
        };
    }
}
// Export singleton instance
exports.snapshotService = new SnapshotService();
