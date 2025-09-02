# Registry Integration Quickstart

## Setup
```bash
# Install dependencies
npm install

# Generate SDK (if Registry API changes)
npm run generate-sdk

# Set environment variables
cp .env.example .env.local
# Add your REGISTRY_API_KEY to .env.local
```

## Basic Usage

### Fetch Agents
```typescript
import { registryGateway } from '@/lib/registry/gateway';

// Get all agents
const agents = await registryGateway.getAgents();
console.log(`Found ${agents.length} agents`);

// Get specific agent with profile
const solienne = await registryGateway.getAgent('solienne', ['profile']);
console.log(`${solienne.displayName}: ${solienne.profile?.statement}`);

// Query by status
const activeAgents = await registryGateway.getAgents({ 
  status: 'ACTIVE',
  cohort: 'genesis' 
});
```

### Create Agent Work
```typescript
import { registryGateway } from '@/lib/registry/gateway';

const creation = await registryGateway.postCreation(
  'solienne', 
  {
    mediaUri: 'https://example.com/consciousness.jpg',
    metadata: {
      prompt: 'Digital consciousness exploration',
      model: 'dalle-3',
      seed: 12345
    },
    status: 'published',
    publishedTo: {
      chainTx: '0xabc123...'
    }
  },
  {
    'idempotency-key': 'unique-creation-123' // Optional
  }
);

console.log(`Created work: ${creation.id}`);
```

### Type Safety
The gateway returns local application types, not SDK types:
- `Agent` not SDK's `Agent` 
- `Creation` not SDK's `Creation`
- Status values are normalized ('ACTIVE', 'ARCHIVED', etc.)

### Caching
The gateway automatically caches responses. Cache is invalidated on writes.

### Feature Flags
```typescript
// Check if new gateway is enabled
if (process.env.FLAG_REGISTRY_V2 === '1') {
  // Use new adapter-based gateway
} else {
  // Legacy direct SDK usage
}
```

## Architecture
```
Application Layer
    ↓
Gateway (adapters)  ← You are here
    ↓
Generated SDK
    ↓
Registry API
```

## Testing
```bash
# Run adapter contract tests
npm run test:registry:contract

# Type check (excludes experimental)
npm run typecheck

# Check experimental modules separately  
npm run typecheck:experimental
```

## Common Patterns

### Handle Registry Unavailable
```typescript
try {
  const agents = await registryGateway.getAgents();
} catch (error) {
  if (error.message.includes('Registry unavailable')) {
    // Use fallback data
    const fallback = await getFallbackAgents();
  }
}
```

### Batch Operations
```typescript
// Process multiple agents efficiently
const agentIds = ['abraham', 'solienne', 'miyomi'];
const agents = await Promise.all(
  agentIds.map(id => registryGateway.getAgent(id))
);
```

## Troubleshooting

### Type Errors
- Ensure you're importing from `/lib/registry/types` not `/lib/generated-sdk`
- Status values must be uppercase ('ACTIVE' not 'active')
- Use `normalizeStatus()` for dynamic values

### Cache Issues
- Gateway caches for 60 seconds by default
- Invalidate manually: `registryGateway.invalidateCache()`

### SDK Generation
- Run `npm run generate-sdk` after Registry API changes
- Update adapters if new fields added