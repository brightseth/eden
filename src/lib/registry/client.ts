// Registry API Client with typed fetch, retries, and ISR helpers
import { 
  Agent, 
  AgentQuery, 
  Creation, 
  CreationPost, 
  Profile, 
  Persona, 
  Artifact,
  Progress,
  RegistryResponse, 
  RegistryError 
} from './types';

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Start with 1 second

class RegistryClient {
  private baseUrl: string;
  private apiKey: string;
  private useRegistry: boolean;

  constructor() {
    this.baseUrl = process.env.REGISTRY_BASE_URL || 'https://eden-genesis-registry.vercel.app/api/v1';
    this.apiKey = process.env.REGISTRY_API_KEY || '';
    this.useRegistry = process.env.USE_REGISTRY === 'true';
  }

  private generateTraceId(): string {
    return `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async fetchWithRetry<T>(
    url: string, 
    options: RequestInit = {},
    retries = MAX_RETRIES
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    const traceId = this.generateTraceId();

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'x-eden-api-key': this.apiKey,
          'x-trace-id': traceId,
          'x-eden-client': 'eden-academy',
          'accept': 'application/json',
          'content-type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status >= 500 && retries > 0) {
          // Server error, retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
          return this.fetchWithRetry<T>(url, options, retries - 1);
        }
        
        const error: RegistryError = await response.json().catch(() => ({
          error: 'Unknown error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        }));
        
        console.error(`[Registry] Request failed - trace: ${traceId}`, {
          status: response.status,
          error: error.message
        });
        
        throw new Error(error.message || `Registry API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Registry API request timeout');
        }
        if (retries > 0 && !error.message.includes('Registry API error')) {
          // Network error, retry
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
          return this.fetchWithRetry<T>(url, options, retries - 1);
        }
      }
      
      throw error;
    }
  }

  // Agent endpoints
  async getAgents(query?: AgentQuery): Promise<Agent[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const params = new URLSearchParams();
    if (query?.cohort) params.append('cohort', query.cohort);
    if (query?.status) params.append('status', query.status);
    if (query?.include) params.append('include', query.include.join(','));

    const url = `${this.baseUrl}/agents${params.toString() ? '?' + params.toString() : ''}`;
    const response = await this.fetchWithRetry<RegistryResponse<Agent[]>>(url);
    return response.data;
  }

  async getAgent(id: string, include?: string[]): Promise<Agent> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const params = include ? `?include=${include.join(',')}` : '';
    const url = `${this.baseUrl}/agents/${id}${params}`;
    const response = await this.fetchWithRetry<RegistryResponse<Agent>>(url);
    return response.data;
  }

  async getAgentProfile(id: string): Promise<Profile> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${id}/profile`;
    const response = await this.fetchWithRetry<RegistryResponse<Profile>>(url);
    return response.data;
  }

  async getAgentPersonas(id: string): Promise<Persona[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${id}/personas`;
    const response = await this.fetchWithRetry<RegistryResponse<Persona[]>>(url);
    return response.data;
  }

  async getAgentArtifacts(id: string): Promise<Artifact[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${id}/artifacts`;
    const response = await this.fetchWithRetry<RegistryResponse<Artifact[]>>(url);
    return response.data;
  }

  async getAgentCreations(
    id: string, 
    status?: 'curated' | 'published'
  ): Promise<Creation[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const params = status ? `?status=${status}` : '';
    const url = `${this.baseUrl}/agents/${id}/creations${params}`;
    const response = await this.fetchWithRetry<RegistryResponse<Creation[]>>(url);
    return response.data;
  }

  async postCreation(agentId: string, creation: CreationPost): Promise<Creation> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${agentId}/creations`;
    const response = await this.fetchWithRetry<RegistryResponse<Creation>>(url, {
      method: 'POST',
      body: JSON.stringify(creation),
    });
    return response.data;
  }

  async getDashboardProgress(cohort?: string): Promise<Progress[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const params = cohort ? `?cohort=${cohort}` : '';
    const url = `${this.baseUrl}/dashboard/progress${params}`;
    const response = await this.fetchWithRetry<RegistryResponse<Progress[]>>(url);
    return response.data;
  }

  // Helper for ISR (Incremental Static Regeneration)
  async getAgentsWithISR(query?: AgentQuery): Promise<{ agents: Agent[], revalidate: number }> {
    try {
      const agents = await this.getAgents(query);
      return { agents, revalidate: 60 }; // Revalidate every 60 seconds
    } catch (error) {
      console.error('Failed to fetch agents from Registry:', error);
      // Return cached data with shorter revalidate time to retry sooner
      return { agents: [], revalidate: 10 };
    }
  }

  // Enhanced agent fetching with fallback detection
  async getAgentsWithFallbackDetection(query?: AgentQuery): Promise<{ 
    agents: Agent[], 
    isFromRegistry: boolean, 
    error?: string 
  }> {
    if (!this.useRegistry) {
      return { 
        agents: [], 
        isFromRegistry: false, 
        error: 'Registry is not enabled. Set USE_REGISTRY=true' 
      };
    }

    try {
      const agents = await this.getAgents(query);
      
      // Check if Registry returned empty but should have data
      if (agents.length === 0) {
        console.warn('[Registry] Empty result - may indicate Registry service issues');
        return { 
          agents: [], 
          isFromRegistry: true, 
          error: 'Registry returned empty results - service may be degraded' 
        };
      }
      
      return { agents, isFromRegistry: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown Registry error';
      console.error('[Registry] Failed to fetch agents:', error);
      
      return { 
        agents: [], 
        isFromRegistry: false, 
        error: errorMessage 
      };
    }
  }

  // Check if Registry is enabled
  isEnabled(): boolean {
    return this.useRegistry;
  }
}

// Export singleton instance
export const registryClient = new RegistryClient();

// Export for Next.js ISR helpers
export async function getAgentsForISR(query?: AgentQuery) {
  const { agents, revalidate } = await registryClient.getAgentsWithISR(query);
  return {
    props: { agents },
    revalidate,
  };
}