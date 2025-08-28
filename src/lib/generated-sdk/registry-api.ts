// Generated Registry SDK - Type-Safe API Client
// Based on Eden Genesis Registry OpenAPI v1.0.0

export interface Agent {
  id: string;
  handle: string;
  displayName: string;
  status: 'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED' | 'ARCHIVED';
  visibility: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  cohort: string; // API returns cohort, not cohortId
  role?: string;
  prototypeUrl?: string; // Optional URL for agent prototype/demo site
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
  personas?: Persona[];
  creations?: Creation[];
  counts?: {
    creations: number;
    personas: number;
    artifacts: number;
  };
}

export interface Profile {
  statement?: string;
  manifesto?: string;
  tags?: string[];
  links?: Record<string, unknown>;
}

export interface Persona {
  id: string;
  name: string;
  version: string;
  prompt: string;
  alignmentNotes?: string;
  privacy: 'INTERNAL' | 'PUBLIC';
}

export interface Creation {
  id: string;
  title: string;
  mediaUri: string;
  metadata?: Record<string, unknown>;
  status: 'DRAFT' | 'CURATED' | 'PUBLISHED' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  applicantEmail: string;
  applicantName: string;
  track: 'AGENT' | 'TRAINER' | 'CURATOR' | 'COLLECTOR' | 'INVESTOR';
  payload: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface RequestConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
  maxRetries?: number;
}

export class RegistryApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'RegistryApiError';
  }
}

export class RegistryApiClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;
  private maxRetries: number;

  constructor(config: RequestConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://eden-genesis-registry.vercel.app/api/v1';
    this.apiKey = config.apiKey || '';
    this.timeout = config.timeout || 10000; // Increased to 10s for slow Registry responses
    this.maxRetries = config.maxRetries || 0; // Disable retries for faster failures
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
    retries: number = this.maxRetries
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Retry on 5xx errors
        if (response.status >= 500 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.request<T>(path, options, retries - 1);
        }

        throw new RegistryApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof RegistryApiError) {
        throw error;
      }

      // Retry on network errors
      if (retries > 0 && error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new RegistryApiError('Request timeout', 408);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.request<T>(path, options, retries - 1);
      }

      throw new RegistryApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // Agent endpoints
  async getAgents(params?: {
    cohort?: string;
    status?: Agent['status'];
    include?: string[];
  }): Promise<Agent[]> {
    // NOTE: Registry API currently has issues with query parameters (returns 500)
    // For now, get all agents and filter client-side
    const path = '/agents';
    
    // Registry API returns {agents: Agent[], pagination: {...}}
    // Extract just the agents array for SDK compatibility
    const response = await this.request<{agents: Agent[], pagination?: any, total?: number}>(path);
    let agents = response.agents || [];
    
    // Client-side filtering until Registry API query parameters are fixed
    if (params) {
      agents = agents.filter(agent => {
        if (params.cohort && agent.cohort !== params.cohort) return false;
        if (params.status && agent.status !== params.status) return false;
        return true;
      });
    }
    
    return agents;
  }

  async getAgent(id: string, include?: string[]): Promise<Agent> {
    const searchParams = new URLSearchParams();
    if (include) searchParams.append('include', include.join(','));

    const query = searchParams.toString();
    const path = `/agents/${id}${query ? `?${query}` : ''}`;
    
    return this.request<Agent>(path);
  }

  async createAgent(data: {
    handle: string;
    displayName: string;
    cohortId: string;
  }): Promise<Agent> {
    return this.request<Agent>('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
    return this.request<Agent>(`/agents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Profile endpoints
  async getAgentProfile(id: string): Promise<Profile> {
    return this.request<Profile>(`/agents/${id}/profile`);
  }

  async updateAgentProfile(id: string, data: Profile): Promise<Profile> {
    return this.request<Profile>(`/agents/${id}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Persona endpoints
  async getAgentPersonas(id: string): Promise<Persona[]> {
    return this.request<Persona[]>(`/agents/${id}/personas`);
  }

  async createAgentPersona(id: string, data: Omit<Persona, 'id'>): Promise<Persona> {
    return this.request<Persona>(`/agents/${id}/personas`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Creation endpoints
  async getAgentCreations(id: string, status?: Creation['status']): Promise<Creation[]> {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);

    const query = searchParams.toString();
    const path = `/agents/${id}/creations${query ? `?${query}` : ''}`;
    
    return this.request<Creation[]>(path);
  }

  async createAgentCreation(id: string, data: Omit<Creation, 'id'>): Promise<Creation> {
    return this.request<Creation>(`/agents/${id}/creations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Progress endpoints
  async getAgentProgress(id: string): Promise<any> {
    return this.request<any>(`/agents/${id}/progress`);
  }

  // Application endpoints
  async submitApplication(data: Application): Promise<Application> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Authentication endpoints
  async startMagicAuth(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/magic/start', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async completeMagicAuth(token: string): Promise<{
    token: string;
    user: any;
  }> {
    return this.request<{
      token: string;
      user: any;
    }>('/auth/magic/complete', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Webhook endpoints
  async registerWebhook(data: {
    url: string;
    events: string[];
  }): Promise<any> {
    return this.request<any>('/webhooks/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async health(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Factory function for creating API client instances
export function createRegistryApiClient(config?: RequestConfig): RegistryApiClient {
  return new RegistryApiClient(config);
}

// Default client instance
export const registryApi = new RegistryApiClient();