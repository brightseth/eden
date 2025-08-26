// Spirit Registry Client for Onchain Data Integration
// Follows single source of truth pattern - Registry remains authoritative

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

export class SpiritRegistryClient {
  private baseUrl: string;
  private timeout: number;
  private retryCount: number;

  constructor(config?: {
    baseUrl?: string;
    timeout?: number;
    retryCount?: number;
  }) {
    this.baseUrl = config?.baseUrl || 'https://spirit-registry.vercel.app';
    this.timeout = config?.timeout || 10000;
    this.retryCount = config?.retryCount || 3;
  }

  async getGenesisCohort(): Promise<SpiritResponse> {
    return this.makeRequest('/api/v1/genesis-cohort');
  }

  async getAgentOnchainData(agentId: string): Promise<OnchainData | null> {
    try {
      const response = await this.getGenesisCohort();
      const agent = response.agents.find(a => a.id === agentId);
      return agent?.onchain || null;
    } catch (error) {
      console.warn(`[Spirit] Failed to get onchain data for ${agentId}:`, error);
      return null;
    }
  }

  private async makeRequest(endpoint: string): Promise<SpiritResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        console.log(`[Spirit] Fetching ${endpoint} (attempt ${attempt})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'EdenAcademy/1.0',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Spirit Registry API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[Spirit] Successfully fetched ${data.agents?.length || 0} agents`);
        return data;

      } catch (error) {
        lastError = error as Error;
        console.warn(`[Spirit] Attempt ${attempt} failed:`, error);
        
        if (attempt < this.retryCount) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`[Spirit] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Spirit Registry unavailable after ${this.retryCount} attempts: ${lastError?.message}`);
  }

  async healthCheck(): Promise<{ available: boolean; latency?: number; error?: string }> {
    const startTime = Date.now();
    try {
      await this.getGenesisCohort();
      return { 
        available: true, 
        latency: Date.now() - startTime 
      };
    } catch (error) {
      return {
        available: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const spiritClient = new SpiritRegistryClient();

// Type exports for other modules
export type { OnchainData, SpiritAgent, SpiritResponse };