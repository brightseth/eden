/**
 * API Test Client
 * Base client for making API requests in tests with built-in utilities
 */

export interface RequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  headers: Headers;
  ok: boolean;
  duration: number;
}

export class ApiTestClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private defaultTimeout: number;

  constructor(baseUrl?: string, options?: {
    headers?: HeadersInit;
    timeout?: number;
  }) {
    this.baseUrl = baseUrl || process.env.TEST_BASE_URL || 'http://localhost:3000';
    this.defaultHeaders = options?.headers || {};
    this.defaultTimeout = options?.timeout || 30000;
  }

  /**
   * Make a GET request
   */
  async get<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   */
  async post<T = any>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Core request method
   */
  private async request<T = any>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path, options.query);
    const timeout = options.timeout || this.defaultTimeout;
    const startTime = Date.now();

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      let data: T | undefined;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          // Invalid JSON response
          console.warn('Failed to parse JSON response:', e);
        }
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
        ok: response.ok,
        duration,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      if (error.name === 'AbortError') {
        return {
          status: 0,
          headers: new Headers(),
          ok: false,
          duration,
          error: `Request timeout after ${timeout}ms`,
        };
      }

      return {
        status: 0,
        headers: new Headers(),
        ok: false,
        duration,
        error: error.message || 'Network error',
      };
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, query?: Record<string, string | number | boolean>): string {
    // Ensure path starts with / and remove any leading slash from path if baseUrl ends with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    
    const url = new URL(normalizedBase + normalizedPath);
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: HeadersInit) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get the base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Create a new client with a different base URL
   */
  withBaseUrl(baseUrl: string): ApiTestClient {
    return new ApiTestClient(baseUrl, {
      headers: this.defaultHeaders,
      timeout: this.defaultTimeout,
    });
  }
}