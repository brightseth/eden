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
  RegistryError,
  ExperimentalApplication,
  ApplicationGatewayResponse
} from './types';

const DEFAULT_TIMEOUT = 3000; // 3 seconds - faster timeout for better UX
const MAX_RETRIES = 2; // Reduce retries for faster failure
const RETRY_DELAY = 1000; // Start with 1 second

class RegistryClient {
  private baseUrl: string;
  private apiKey: string;
  private useRegistry: boolean;
  private isHealthy: boolean = true;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds

  constructor() {
    this.baseUrl = process.env.REGISTRY_BASE_URL || 'https://eden-genesis-registry.vercel.app/api/v1';
    this.apiKey = process.env.REGISTRY_API_KEY || '';
    this.useRegistry = process.env.USE_REGISTRY === 'true';
  }

  private generateTraceId(): string {
    return `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Standardized response format handler
  private handleResponse<T>(response: any, expectedShape?: (item: any) => boolean): T {
    // Handle direct response (most Registry endpoints return data directly)
    if (expectedShape && expectedShape(response)) {
      return response as T;
    }

    // Handle wrapped response format {data: ...}
    if (response.data !== undefined) {
      if (expectedShape && expectedShape(response.data)) {
        return response.data as T;
      }
      return response.data as T;
    }

    // Handle collection format {agents: [...], creations: [...], etc}
    const collectionKeys = ['agents', 'creations', 'personas', 'artifacts', 'profiles'];
    for (const key of collectionKeys) {
      if (response[key] !== undefined) {
        return response[key] as T;
      }
    }

    // Log unexpected format for debugging
    console.warn('[Registry Client] Unexpected response format:', {
      keys: Object.keys(response),
      sample: typeof response === 'object' ? JSON.stringify(response).slice(0, 200) : response
    });

    // Return response as-is if no pattern matches
    return response as T;
  }

  // Circuit breaker - quickly fail if Registry is known to be unhealthy
  private async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Use cached health status if recent
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isHealthy;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000); // Very short timeout for health check
      
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        headers: { 'x-eden-client': 'eden-academy-health' }
      });
      
      clearTimeout(timeout);
      this.isHealthy = response.ok;
      this.lastHealthCheck = now;
      
      return this.isHealthy;
    } catch (error) {
      this.isHealthy = false;
      this.lastHealthCheck = now;
      
      console.log(`[Registry] Health check failed - will use fallback for ${this.healthCheckInterval}ms`);
      return false;
    }
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
    
    const response = await this.fetchWithRetry<any>(url);
    
    // Use standardized handler with agent array validation
    return this.handleResponse<Agent[]>(response, (data) => Array.isArray(data));
  }

  async getAgent(id: string, include?: string[]): Promise<Agent> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const params = include ? `?include=${include.join(',')}` : '';
    const url = `${this.baseUrl}/agents/${id}${params}`;
    
    const response = await this.fetchWithRetry<any>(url);
    
    // Use standardized handler with agent shape validation
    return this.handleResponse<Agent>(response, (data) => 
      typeof data === 'object' && data !== null && ('id' in data || 'handle' in data)
    );
  }

  // Helper method to get agent by handle
  async getAgentByHandle(handle: string): Promise<Agent | null> {
    const agents = await this.getAgents();
    return agents.find(agent => agent.handle === handle) || null;
  }

  async getAgentProfile(id: string): Promise<Profile> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${id}/profile`;
    const response = await this.fetchWithRetry<any>(url);
    
    // Use standardized handler with profile shape validation
    return this.handleResponse<Profile>(response, (data) => 
      typeof data === 'object' && data !== null && 'agentId' in data
    );
  }

  async getAgentPersonas(id: string): Promise<Persona[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${id}/personas`;
    const response = await this.fetchWithRetry<any>(url);
    return this.handleResponse<Persona[]>(response, (data) => Array.isArray(data));
  }

  async getAgentArtifacts(id: string): Promise<Artifact[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${id}/artifacts`;
    const response = await this.fetchWithRetry<any>(url);
    return this.handleResponse<Artifact[]>(response, (data) => Array.isArray(data));
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
    const response = await this.fetchWithRetry<any>(url);
    return this.handleResponse<Creation[]>(response, (data) => Array.isArray(data));
  }

  async postCreation(agentId: string, creation: CreationPost): Promise<Creation> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/agents/${agentId}/creations`;
    const response = await this.fetchWithRetry<any>(url, {
      method: 'POST',
      body: JSON.stringify(creation),
    });
    return this.handleResponse<Creation>(response, (data) => 
      typeof data === 'object' && data !== null && 'id' in data
    );
  }

  async getDashboardProgress(cohort?: string): Promise<Progress[]> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const params = cohort ? `?cohort=${cohort}` : '';
    const url = `${this.baseUrl}/dashboard/progress${params}`;
    const response = await this.fetchWithRetry<any>(url);
    return this.handleResponse<Progress[]>(response, (data) => Array.isArray(data));
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

    // Quick health check with circuit breaker
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      return { 
        agents: [], 
        isFromRegistry: false, 
        error: 'Registry is currently unhealthy - skipping to save time' 
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

  // Get health status information
  getHealthStatus(): { 
    isEnabled: boolean, 
    isHealthy: boolean, 
    lastCheck: number, 
    nextCheck: number 
  } {
    return {
      isEnabled: this.useRegistry,
      isHealthy: this.isHealthy,
      lastCheck: this.lastHealthCheck,
      nextCheck: this.lastHealthCheck + this.healthCheckInterval
    };
  }

  // Manually reset health status (for testing/admin purposes)
  resetHealth(): void {
    this.isHealthy = true;
    this.lastHealthCheck = 0;
    console.log('[Registry] Health status reset - will re-check on next request');
  }

  // NEW METHODS FOR EXPERIMENTAL APPLICATIONS
  
  /**
   * Submit experimental application form (like Bertha trainer form)
   */
  async submitExperimentalApplication(application: ExperimentalApplication): Promise<ApplicationGatewayResponse> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/applications/experimental`;
    const response = await this.fetchWithRetry<ApplicationGatewayResponse>(url, {
      method: 'POST',
      body: JSON.stringify(application),
    });
    return response;
  }

  /**
   * Submit application through Gateway (intelligent routing)
   */
  async submitApplicationThroughGateway(application: ExperimentalApplication): Promise<ApplicationGatewayResponse> {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const url = `${this.baseUrl}/applications/gateway`;
    const response = await this.fetchWithRetry<ApplicationGatewayResponse>(url, {
      method: 'POST',
      body: JSON.stringify(application),
    });
    return response;
  }

  /**
   * Get experimental applications for review
   */
  async getExperimentalApplications(includeExperimental: boolean = true) {
    if (!this.useRegistry) {
      throw new Error('Registry is not enabled. Set USE_REGISTRY=true');
    }

    const params = includeExperimental ? '?experimental=true' : '';
    const url = `${this.baseUrl}/applications/experimental${params}`;
    const response = await this.fetchWithRetry<any>(url);
    return this.handleResponse<any[]>(response, (data) => Array.isArray(data));
  }

  /**
   * Check system health with all new features
   */
  async getSystemHealth() {
    if (!this.useRegistry) {
      return { status: 'disabled', message: 'Registry is not enabled' };
    }

    const url = `${this.baseUrl}/monitoring/health`;
    const response = await this.fetchWithRetry<any>(url);
    return response;
  }
}

// Export singleton instance (lazy-initialized)
let _registryClient: RegistryClient | null = null;

export const getRegistryClient = () => {
  if (!_registryClient) {
    _registryClient = new RegistryClient();
  }
  return _registryClient;
};

// For backward compatibility
export const registryClient = new Proxy({} as RegistryClient, {
  get(target, prop, receiver) {
    return Reflect.get(getRegistryClient(), prop, receiver);
  }
});

// Export for Next.js ISR helpers
export async function getAgentsForISR(query?: AgentQuery) {
  const client = getRegistryClient();
  const { agents, revalidate } = await client.getAgentsWithISR(query);
  return {
    props: { agents },
    revalidate,
  };
}