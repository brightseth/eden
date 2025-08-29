interface OnchainData {
    tokenAddress?: string;
    contractAddress?: string;
    walletAddress?: string;
    chainId?: number;
    verified?: boolean;
    deployedAt?: string;
    totalSupply?: string;
    holders?: number;
}
interface SpiritAgent {
    id: string;
    name: string;
    status: string;
    date?: string;
    trainer?: string;
    worksCount?: number;
    description?: string;
    hasProfile?: boolean;
    image?: string;
    onchain?: OnchainData | null;
    cohort?: string;
    createdAt?: string;
    updatedAt?: string;
}
interface SpiritResponse {
    agents: SpiritAgent[];
    meta: {
        total: number;
        launching: number;
        developing: number;
        open: number;
    };
}
export declare class SpiritRegistryClient {
    private baseUrl;
    private timeout;
    private retryCount;
    constructor(config?: {
        baseUrl?: string;
        timeout?: number;
        retryCount?: number;
    });
    getGenesisCohort(): Promise<SpiritResponse>;
    getAgentOnchainData(agentId: string): Promise<OnchainData | null>;
    private makeRequest;
    healthCheck(): Promise<{
        available: boolean;
        latency?: number;
        error?: string;
    }>;
}
export declare const spiritClient: SpiritRegistryClient;
export type { OnchainData, SpiritAgent, SpiritResponse };
