# ADR-019: Registry Integration Pattern and Network Communication Standards

## Status
Accepted

## Context
Multiple services need to communicate with Eden Genesis Registry:
- Eden Academy (main platform)
- CRIT (design critic)
- EDEN2 (investor dashboard)
- Eden2038 (Abraham contract viewer)
- Miyomi Dashboard (daily videos)

Current issues:
- Inconsistent API calls (some use fetch, others use custom clients)
- No standardized error handling
- Missing retry logic
- Duplicate API client implementations
- No contract validation

## Decision

### 1. Generated SDK Pattern

All services MUST use a generated TypeScript SDK for Registry communication:

```typescript
// NEVER do this (raw fetch):
❌ fetch('https://eden-genesis-registry.vercel.app/api/v1/agents')

// ALWAYS do this (generated SDK):
✅ import { RegistryClient } from '@eden/registry-sdk';
   const client = new RegistryClient();
   const agents = await client.agents.list();
```

### 2. SDK Architecture

```
@eden/registry-sdk/
├── src/
│   ├── client.ts           # Main client class
│   ├── types/              # Generated TypeScript types
│   │   ├── agents.ts
│   │   ├── works.ts
│   │   ├── curations.ts
│   │   └── common.ts
│   ├── services/           # Service-specific clients
│   │   ├── agents.ts
│   │   ├── works.ts
│   │   ├── curations.ts
│   │   └── auth.ts
│   └── utils/              # Shared utilities
│       ├── errors.ts       # Error handling
│       ├── retry.ts        # Retry logic
│       └── cache.ts        # Response caching
```

### 3. Client Configuration

```typescript
interface RegistryClientConfig {
  baseUrl?: string;           // Default: production Registry URL
  apiKey?: string;            // Optional API key
  timeout?: number;           // Default: 30000ms
  retries?: number;           // Default: 3
  cache?: boolean;            // Default: true for GET requests
  telemetry?: boolean;        // Default: true
}

// Usage across services:
const client = new RegistryClient({
  apiKey: process.env.REGISTRY_API_KEY,
  timeout: 10000,
  retries: 3,
  cache: true,
  telemetry: true
});
```

### 4. Standardized Error Handling

```typescript
// All errors extend BaseRegistryError
class BaseRegistryError extends Error {
  code: string;
  statusCode?: number;
  requestId: string;
  timestamp: Date;
}

// Specific error types
class AgentNotFoundError extends BaseRegistryError {}
class RateLimitError extends BaseRegistryError {}
class ValidationError extends BaseRegistryError {}
class NetworkError extends BaseRegistryError {}

// Usage
try {
  const agent = await client.agents.get('solienne');
} catch (error) {
  if (error instanceof AgentNotFoundError) {
    // Handle missing agent
  } else if (error instanceof RateLimitError) {
    // Handle rate limiting
  }
}
```

### 5. Contract Validation

All responses validated against OpenAPI schema:

```yaml
# registry-openapi.yaml
openapi: 3.0.0
info:
  title: Eden Genesis Registry API
  version: 1.0.0
paths:
  /agents/{id}:
    get:
      parameters:
        - name: id
          schema:
            type: string
            pattern: '^[a-z0-9-]+$'
      responses:
        200:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Agent'
```

### 6. Service-Specific Clients

Each microservice gets a tailored client:

```typescript
// Eden Academy Client
import { RegistryClient } from '@eden/registry-sdk';
export const registry = new RegistryClient({
  cache: true,
  telemetry: true
});

// CRIT Client (needs critique-specific endpoints)
import { RegistryClient } from '@eden/registry-sdk';
export const registry = new RegistryClient({
  apiKey: process.env.CRIT_API_KEY,
  timeout: 60000  // Longer timeout for analysis
});

// EDEN2 Client (investor metrics)
import { RegistryClient } from '@eden/registry-sdk';
export const registry = new RegistryClient({
  apiKey: process.env.EDEN2_API_KEY,
  cache: false  // Always fresh data for investors
});
```

### 7. Telemetry and Monitoring

All SDK calls automatically log:
- Request/response times
- Error rates
- Cache hit rates
- Retry attempts
- Circuit breaker status

```typescript
// Automatic telemetry
{
  service: 'eden-academy',
  endpoint: '/agents/solienne',
  duration: 145,
  cached: false,
  retries: 0,
  status: 200,
  requestId: 'req_abc123',
  timestamp: '2024-08-25T20:00:00Z'
}
```

### 8. Migration Path

1. **Phase 1**: Generate SDK from OpenAPI spec
2. **Phase 2**: Replace raw fetch calls in Eden Academy
3. **Phase 3**: Migrate CRIT to use SDK
4. **Phase 4**: Migrate EDEN2 and Eden2038
5. **Phase 5**: Migrate Miyomi Dashboard
6. **Phase 6**: Deprecate all raw fetch patterns

## Consequences

### Positive
- Type safety across all Registry calls
- Consistent error handling
- Automatic retry and caching
- Contract validation prevents breaking changes
- Centralized telemetry and monitoring
- Reduced code duplication

### Negative
- Additional build step for SDK generation
- All services must update when SDK changes
- Initial migration effort required

### Neutral
- SDK becomes a shared dependency
- Version management required
- Registry API becomes the contract

## Implementation Plan

1. **Week 1**: Create OpenAPI specification for Registry
2. **Week 2**: Generate initial SDK with TypeScript types
3. **Week 3**: Implement retry, caching, and error handling
4. **Week 4**: Migrate Eden Academy to SDK
5. **Week 5**: Migrate all microservices
6. **Week 6**: Add telemetry and monitoring

## Related ADRs
- ADR-016: Service Boundary Definition
- ADR-017: Documentation Hierarchy
- ADR-018: Worktree-Agent Alignment

## References
- OpenAPI Specification: https://swagger.io/specification/
- TypeScript SDK Generator: https://github.com/OpenAPITools/openapi-generator
- Registry API: https://eden-genesis-registry.vercel.app/api/v1