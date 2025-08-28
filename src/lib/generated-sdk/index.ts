// Registry SDK - ADR-019 Compliant Architecture
// Main exports following Registry Integration Pattern

// Main client (new architecture)
export { RegistryClient, createRegistryClient, registryClient } from './client';
export type { EnhancedRequestConfig } from './client';

// Service clients
export { AgentService } from './services/agents';
export { AuthService } from './services/auth';
export { WorksService } from './services/works';

// Types
export type * from './types/common';
export type * from './types/agents';
export type * from './types/auth';
export type * from './types/works';

// Utilities
export * from './utils/errors';
export { withRetry, CircuitBreaker } from './utils/retry';
export type { RetryConfig } from './utils/retry';
export { MemoryCache, cached, defaultCache, generateCacheKey } from './utils/cache';
export type { CacheOptions, CacheEntry } from './utils/cache';

// Legacy compatibility exports (deprecated but maintained for backward compatibility)
export { 
  RegistryApiClient, 
  RegistryApiError,
  createRegistryApiClient,
  registryApi 
} from './registry-api';
export type {
  Agent,
  Profile,
  Persona,
  Creation,
  Application,
  ApiResponse,
  RequestConfig
} from './registry-api';

// Re-export specific commonly used types at top level for convenience
export type { 
  Agent, 
  Profile, 
  Persona,
  AgentCounts
} from './types/agents';
export type { 
  User,
  WalletAuthResponse,
  AuthResponse,
  MagicLinkResponse,
  ApplicationResponse
} from './types/auth';
export type { 
  Creation,
  CreateCreationParams,
  UpdateCreationParams
} from './types/works';