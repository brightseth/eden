"use strict";
// Spirit Registry Client for Onchain Data Integration
// Follows single source of truth pattern - Registry remains authoritative
Object.defineProperty(exports, "__esModule", { value: true });
exports.spiritClient = exports.SpiritRegistryClient = void 0;
class SpiritRegistryClient {
    constructor(config) {
        this.baseUrl = config?.baseUrl || 'https://spirit-registry.vercel.app';
        this.timeout = config?.timeout || 10000;
        this.retryCount = config?.retryCount || 3;
    }
    async getGenesisCohort() {
        return this.makeRequest('/api/v1/genesis-cohort');
    }
    async getAgentOnchainData(agentId) {
        try {
            const response = await this.getGenesisCohort();
            const agent = response.agents.find(a => a.id === agentId);
            return agent?.onchain || null;
        }
        catch (error) {
            console.warn(`[Spirit] Failed to get onchain data for ${agentId}:`, error);
            return null;
        }
    }
    async makeRequest(endpoint) {
        const url = `${this.baseUrl}${endpoint}`;
        let lastError = null;
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
            }
            catch (error) {
                lastError = error;
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
    async healthCheck() {
        const startTime = Date.now();
        try {
            await this.getGenesisCohort();
            return {
                available: true,
                latency: Date.now() - startTime
            };
        }
        catch (error) {
            return {
                available: false,
                latency: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
exports.SpiritRegistryClient = SpiritRegistryClient;
// Export singleton instance
exports.spiritClient = new SpiritRegistryClient();
