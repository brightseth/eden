// Main Registry SDK Client
// Following ADR-019 Registry Integration Pattern

import { RequestConfig, TelemetryData } from './types/common';
import { createRegistryError } from './utils/errors';
import { withRetry, RetryConfig, CircuitBreaker } from './utils/retry';
import { MemoryCache, defaultCache } from './utils/cache';
import { AgentService } from './services/agents';
import { AuthService } from './services/auth';
import { WorksService } from './services/works';

export interface EnhancedRequestConfig extends RequestConfig {
  retries?: RetryConfig;
  circuitBreaker?: {
    threshold?: number;
    timeout?: number;
    monitorWindow?: number;
  };
}

export class RegistryClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;
  private cache: MemoryCache;
  private telemetryEnabled: boolean;
  private retryConfig?: RetryConfig;
  private circuitBreaker?: CircuitBreaker;

  // Service instances
  public readonly agents: AgentService;
  public readonly auth: AuthService;
  public readonly works: WorksService;

  constructor(config: EnhancedRequestConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://eden-genesis-registry.vercel.app/api/v1';
    this.apiKey = config.apiKey || '';
    this.timeout = config.timeout || 10000;
    this.telemetryEnabled = config.telemetry ?? true;
    this.retryConfig = config.retries;
    
    // Initialize cache
    if (config.cache !== false) {
      this.cache = defaultCache;
    } else {
      this.cache = new MemoryCache(0); // Disabled cache
    }

    // Initialize circuit breaker if configured
    if (config.circuitBreaker) {
      this.circuitBreaker = new CircuitBreaker(
        config.circuitBreaker.threshold,
        config.circuitBreaker.timeout,
        config.circuitBreaker.monitorWindow
      );
    }

    // Initialize service clients
    this.agents = new AgentService(this.request.bind(this), this.cache, this.retryConfig);
    this.auth = new AuthService(this.request.bind(this), this.cache, this.retryConfig);
    this.works = new WorksService(this.request.bind(this), this.cache, this.retryConfig);
  }

  /**
   * Core request method with enhanced error handling, retries, and telemetry
   */
  public async request<T>(
    path: string,
    options: RequestInit = {},
    customRetries?: number
  ): Promise<T> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    const url = `${this.baseUrl}${path}`;
    
    const makeRequest = async (): Promise<T> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeout);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
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
          
          const error = createRegistryError(
            response.status,
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            errorData,
            requestId
          );

          // Log telemetry for errors
          if (this.telemetryEnabled) {
            this.logTelemetry({
              service: 'registry-client',
              endpoint: path,
              duration: Date.now() - startTime,
              cached: false,
              retries: customRetries ? (this.retryConfig?.maxRetries || 3) - customRetries : 0,
              status: response.status,
              requestId,
              timestamp: new Date().toISOString()
            });
          }

          throw error;
        }

        const result = await response.json();

        // Log successful telemetry
        if (this.telemetryEnabled) {
          this.logTelemetry({
            service: 'registry-client',
            endpoint: path,
            duration: Date.now() - startTime,
            cached: false,
            retries: customRetries ? (this.retryConfig?.maxRetries || 3) - customRetries : 0,
            status: response.status,
            requestId,
            timestamp: new Date().toISOString()
          });
        }

        return result;
      } catch (error) {
        clearTimeout(timeout);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            const timeoutError = createRegistryError(408, 'Request timeout', undefined, requestId);
            
            if (this.telemetryEnabled) {
              this.logTelemetry({
                service: 'registry-client',
                endpoint: path,
                duration: Date.now() - startTime,
                cached: false,
                retries: customRetries ? (this.retryConfig?.maxRetries || 3) - customRetries : 0,
                status: 408,
                requestId,
                timestamp: new Date().toISOString()
              });
            }
            
            throw timeoutError;
          }
        }

        // Re-throw Registry errors as-is
        if (error instanceof Error && 'statusCode' in error) {
          throw error;
        }

        // Wrap other errors
        const networkError = createRegistryError(
          0,
          error instanceof Error ? error.message : 'Network error',
          undefined,
          requestId
        );

        if (this.telemetryEnabled) {
          this.logTelemetry({
            service: 'registry-client',
            endpoint: path,
            duration: Date.now() - startTime,
            cached: false,
            retries: customRetries ? (this.retryConfig?.maxRetries || 3) - customRetries : 0,
            status: 0,
            requestId,
            timestamp: new Date().toISOString()
          });
        }

        throw networkError;
      }
    };

    // Apply circuit breaker if configured
    if (this.circuitBreaker) {
      return this.circuitBreaker.execute(makeRequest);
    }

    return makeRequest();
  }

  /**
   * Health check for the Registry API
   */
  async health(): Promise<{
    status: string;
    version: string;
    timestamp: string;
  }> {
    return this.request('/health');
  }

  /**
   * Get API information
   */
  async info(): Promise<{
    version: string;
    endpoints: string[];
    rateLimit: {
      requests: number;
      window: number;
    };
  }> {
    return this.request('/info');
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Invalidate cache by tag
   */
  invalidateCacheByTag(tag: string): number {
    return this.cache.invalidateByTag(tag);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hits: number;
    misses: number;
  } {
    // This would require additional tracking in the cache implementation
    // For now, return basic size info
    return {
      size: this.cache.size(),
      hits: 0, // Would need to track this
      misses: 0 // Would need to track this
    };
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(): string | null {
    return this.circuitBreaker?.getState() || null;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<EnhancedRequestConfig>): void {
    if (config.baseUrl !== undefined) this.baseUrl = config.baseUrl;
    if (config.apiKey !== undefined) this.apiKey = config.apiKey;
    if (config.timeout !== undefined) this.timeout = config.timeout;
    if (config.telemetry !== undefined) this.telemetryEnabled = config.telemetry;
    if (config.retries !== undefined) this.retryConfig = config.retries;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logTelemetry(data: TelemetryData): void {
    if (typeof window !== 'undefined') {
      // Browser environment - could send to analytics service
      console.debug('[Registry SDK Telemetry]', data);
    } else {
      // Node.js environment - could log to structured logging service
      console.debug('[Registry SDK Telemetry]', JSON.stringify(data));
    }
  }
}

/**
 * Factory function for creating Registry client instances
 */
export function createRegistryClient(config?: EnhancedRequestConfig): RegistryClient {
  return new RegistryClient(config);
}

/**
 * Default Registry client instance
 */
export const registryClient = new RegistryClient();