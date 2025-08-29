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
declare class SnapshotService {
    private config;
    private traceCounter;
    constructor();
    private generateTraceId;
    private makeSnapshotRequest;
    private cachedRequest;
    createProposal(spaceId: string, proposal: GovernanceProposal): Promise<SnapshotProposal>;
    getSpace(spaceId: string): Promise<SnapshotSpace>;
    getProposal(proposalId: string): Promise<SnapshotProposal>;
    getSpaceProposals(spaceId: string, limit?: number): Promise<SnapshotProposal[]>;
    getVotingPower(spaceId: string, address: string): Promise<VotingPowerResult>;
    castVote(proposalId: string, choice: number, address: string): Promise<{
        success: boolean;
        txHash?: string;
    }>;
    syncProposalData(proposalId: string, registryWorkId: string): Promise<ProposalSyncResult>;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        network: number;
        endpoint: string;
        latency?: number;
        error?: string;
    }>;
    isTestnetOnly(): boolean;
    isEdenSpace(): boolean;
    getConfig(): SnapshotConfig;
}
export declare const snapshotService: SnapshotService;
export type { GovernanceProposal, SnapshotProposal, VotingPowerResult, ProposalSyncResult, SnapshotSpace };
