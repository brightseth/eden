# Registry Guardian - Eden Academy

## Overview

The Registry Guardian ensures data consistency and maintains the Registry as the single source of truth for the Eden Academy ecosystem. This implementation provides a robust, monitored data access layer suitable for both prototyping and production use.

## Architecture

```
UI Components
     ↓
[Gateway Layer] ← Circuit Breaker + Cache
     ↓
[Registry Client] ← Retry Logic + Tracing
     ↓
Eden Genesis Registry
```

## Components

### 1. Gateway (`gateway.ts`)
- **Purpose**: Enforces UI → Gateway → Registry pattern
- **Features**:
  - Circuit breaker protection
  - Response caching (1 minute TTL)
  - Trace ID generation
  - Health monitoring

### 2. Registry Client (`client.ts`)
- **Purpose**: Direct Registry API communication
- **Features**:
  - Automatic retries with exponential backoff
  - Request tracing
  - Timeout protection
  - Error logging

### 3. Data Adapter (`adapter.ts`)
- **Purpose**: Legacy compatibility during migration
- **Features**:
  - Feature flag switching (Registry vs Legacy DB)
  - Data transformation
  - Fallback caching
  - Retry queue for failed operations

### 4. Monitor (`monitor.ts`)
- **Purpose**: Data consistency monitoring
- **Features**:
  - Consistency checks
  - Data flow metrics
  - Health reporting
  - Schema validation

### 5. Types (`types.ts`)
- **Purpose**: Shared TypeScript types
- **Note**: Uses UPPERCASE enums to match Prisma schema

## Configuration

### Environment Variables

```bash
# Registry Configuration
REGISTRY_BASE_URL=https://eden-genesis-registry.vercel.app/api/v1
REGISTRY_API_KEY=your-api-key

# Feature Flags
USE_REGISTRY=true        # Enable Registry (vs legacy DB)
USE_GATEWAY=true         # Use Gateway pattern (recommended)

# Monitoring
ENABLE_REGISTRY_MONITOR=true  # Enable consistency monitoring
```

### Usage Modes

1. **Gateway Mode** (Recommended for Production)
```typescript
import { registryGateway } from '@/lib/registry';

const agents = await registryGateway.getAgents({ cohort: 'genesis' });
```

2. **Direct Registry Mode** (Testing)
```typescript
import { registryClient } from '@/lib/registry';

const agents = await registryClient.getAgents({ cohort: 'genesis' });
```

3. **Adapter Mode** (Legacy Compatibility)
```typescript
import { dataAdapter } from '@/lib/registry';

const agents = await dataAdapter.getAgents({ cohort: 'genesis' });
```

## Testing

Run the Registry Guardian test suite:

```bash
npx tsx scripts/test-registry-guardian.ts
```

This will test:
- Gateway health and circuit breaker
- Schema consistency
- Data flow patterns
- Cache effectiveness
- Consistency monitoring

## Monitoring

### Generate Consistency Report

```typescript
import { getConsistencyReport } from '@/lib/registry';

const report = await getConsistencyReport();
console.log(report);
```

### Check Specific Agent

```typescript
import { checkConsistency } from '@/lib/registry';

const report = await checkConsistency('agent-id-123');
```

### View Metrics

```typescript
import { registryMonitor } from '@/lib/registry';

const metrics = registryMonitor.getMetrics();
console.log('Data flow metrics:', metrics);
```

## Migration Path

### Phase 1: Current (Prototyping)
- Dual-mode operation (Registry + Legacy)
- Feature flags control data source
- Monitor for inconsistencies

### Phase 2: Gateway Rollout
- Enable `USE_GATEWAY=true`
- All requests flow through Gateway
- Circuit breaker protection active

### Phase 3: Registry Only
- Remove legacy adapter code
- Disable `USE_REGISTRY` flag (always true)
- Archive Supabase queries

## Best Practices

1. **Always use Gateway in production** - Provides circuit breaker and caching
2. **Monitor consistency during migration** - Run consistency checks regularly
3. **Use uppercase enums** - Match Prisma schema (ACTIVE, not active)
4. **Include trace IDs** - Helps debug issues across services
5. **Handle failures gracefully** - Gateway provides cached fallbacks

## Troubleshooting

### Circuit Breaker Open
```typescript
// Reset circuit breaker
registryGateway.resetCircuitBreaker();
```

### Clear Cache
```typescript
// Clear gateway cache
registryGateway.clearCache();
```

### Check Health
```typescript
const health = await registryGateway.healthCheck();
console.log('Gateway health:', health);
```

## Security Notes

- Never expose Registry API directly to UI
- API keys should only be in Gateway/Server
- Use environment variables for configuration
- Monitor for unauthorized access patterns

## Support

For issues or questions about the Registry Guardian:
1. Check consistency report: `npx tsx scripts/test-registry-guardian.ts`
2. Review monitoring metrics
3. Check Gateway health status
4. Contact the architecture team if issues persist