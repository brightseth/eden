// Common Registry API types and interfaces
// Following ADR-019 Registry Integration Pattern

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
  cache?: boolean;
  telemetry?: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
  tags?: string[]; // Cache invalidation tags
}

export interface TelemetryData {
  service: string;
  endpoint: string;
  duration: number;
  cached: boolean;
  retries: number;
  status: number;
  requestId: string;
  timestamp: string;
}