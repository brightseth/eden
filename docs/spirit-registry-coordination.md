# Spirit Registry Coordination Guide

## Overview

This document outlines how to integrate the new Spirit graduation system with Henry's existing Eden Academy Registry API at `test.api.eden-academy.xyz`, following established patterns and maintaining backward compatibility.

## Existing Registry Patterns

Based on analysis of Henry's current implementation, the Registry follows these patterns:

### Authentication
- Uses `X-API-Key` header with value from `NEXT_PUBLIC_REGISTRY_API_KEY`
- Default API key: `'eden-academy-client'`

### Response Format
```typescript
interface RegistryResponse<T> {
  data?: T;
  error?: string;
  source: 'registry' | 'cache' | 'fallback';
}
```

### Error Handling
- Graceful fallbacks to local data when Registry unavailable
- 5-minute caching for performance
- Health checks with 1-minute intervals
- Comprehensive logging for debugging

### Existing Endpoints
- `GET /agents` - List all agents
- `GET /agents/{handle}` - Get agent by handle
- `GET /agents/{handle}/profile-config` - Get agent configuration
- `GET /agents/{handle}/works` - Get agent works

## New Spirit Endpoints to Add

### 1. Spirit Graduation
```
POST /agents/{id}/graduate-spirit
```

**Request Body:**
```typescript
{
  name: string;
  archetype: 'CREATOR' | 'CURATOR' | 'TRADER';
  practice: {
    timeOfDay: number;        // 0-23 hour
    outputType: string;       // e.g., "Digital Art"
    quantity: number;         // 1-10
    observeSabbath: boolean;
  };
  graduationMode: 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';
  trainerAddress: string;     // Ethereum address
  idempotencyKey: string;     // Unique key for deduplication
}
```

**Response:**
```typescript
{
  data: Agent;  // Extended Agent with spirit fields populated
  source: 'registry';
}
```

**Implementation Requirements:**
- 30-second timeout for blockchain operations
- Idempotency key handling to prevent duplicate graduations
- IPFS metadata upload for covenant data
- Smart contract interaction for onchain registration
- Database updates for spirit status

### 2. Daily Practice Execution
```
POST /agents/{id}/execute-practice
```

**Request Body:**
```typescript
{
  outputDescription?: string;  // Optional work description
  mediaUrl?: string;          // Optional media link
  trainerAddress: string;     // Trainer authorization
}
```

**Response:**
```typescript
{
  data: {
    id: string;
    workId: string;
    outputCid: string;        // IPFS hash
    executionDate: string;
    title: string;
    description?: string;
    mediaUrl?: string;
  };
  source: 'registry';
}
```

**Implementation Requirements:**
- Check if practice can run today (sabbath, already executed)
- Generate unique work ID
- Upload practice output metadata to IPFS
- Record drop in database
- Update practice execution counters
- Update treasury metrics

### 3. Practice Configuration Update
```
PUT /agents/{id}/practice
```

**Request Body:**
```typescript
{
  timeOfDay?: number;
  outputType?: string;
  quantity?: number;
  observeSabbath?: boolean;
}
```

**Response:**
```typescript
{
  data: {
    id: string;
    configurationCid: string;  // Updated IPFS hash
    timeOfDay: number;
    outputType: string;
    quantity: number;
    observeSabbath: boolean;
    updatedAt: string;
  };
  source: 'registry';
}
```

### 4. Spirit Treasury Data
```
GET /agents/{id}/treasury
```

**Response:**
```typescript
{
  data: {
    agentId: string;
    treasuryAddress: string;
    ethBalance: string;         // Wei as string
    tokenBalance: string;       // Token units as string
    totalRevenue: string;       // Wei as string
    totalCosts: string;         // Wei as string
    totalPracticeRuns: number;
    lastPracticeDate?: string;
  };
  source: 'registry';
}
```

### 5. Spirit Practice Drops
```
GET /agents/{id}/drops?page=1&limit=10
```

**Response:**
```typescript
{
  data: Array<{
    id: string;
    workId: string;
    outputCid: string;
    title?: string;
    description?: string;
    mediaUrl?: string;
    executionDate: string;
    practiceType: string;
    blockNumber?: string;
    txHash?: string;
  }>;
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
  source: 'registry';
}
```

### 6. Practice Availability Check
```
GET /agents/{id}/can-practice
```

**Response:**
```typescript
{
  data: {
    canRun: boolean;
    reason?: string;  // If false, why not (e.g., "Already executed today", "Sabbath day")
  };
  source: 'registry';
}
```

### 7. List All Spirits
```
GET /spirits?graduated=true&active=true&archetype=CREATOR&page=1&limit=20
```

**Query Parameters:**
- `graduated` (boolean): Filter by graduation status
- `active` (boolean): Filter by active status
- `archetype` (string): Filter by spirit archetype
- `trainerAddress` (string): Filter by trainer
- `page` (number): Page number for pagination
- `limit` (number): Items per page

**Response:**
```typescript
{
  data: Agent[];  // Array of agents with spirit extensions
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
  source: 'registry';
}
```

## Integration Patterns

### 1. Follow Existing Client Patterns

The Spirit methods added to `RegistryClient` follow Henry's established patterns:

```typescript
// Health check before requests
const isHealthy = await this.checkHealth();
if (!isHealthy) {
  return { error: 'Registry service unavailable', source: 'fallback' };
}

// Proper timeout handling
signal: AbortSignal.timeout(30000) // Longer for blockchain operations

// Cache management
this.setCachedData(cacheKey, result);
this.cache.delete(`agent:${agentId}`); // Clear related caches

// Error handling with fallbacks
if (!response.ok) {
  console.warn(`[Registry] Operation failed:`, response.status);
  return fallbackResponse;
}
```

### 2. Database Schema Extensions

Extend existing tables without breaking changes:

```sql
-- Add spirit fields to agents table
ALTER TABLE agents ADD COLUMN spirit_wallet_address VARCHAR(42);
ALTER TABLE agents ADD COLUMN spirit_token_id BIGINT;
-- ... other spirit fields

-- New tables for spirit-specific data
CREATE TABLE spirit_practices (...);
CREATE TABLE spirit_treasuries (...);
CREATE TABLE spirit_drops (...);
```

### 3. API Response Extensions

Extend existing Agent interface with optional Spirit data:

```typescript
interface Agent {
  // ... existing fields
  
  // Optional spirit extension
  spirit?: {
    walletAddress?: string;
    tokenId?: bigint;
    covenantCid?: string;
    graduationMode: SpiritGraduationMode;
    archetype?: SpiritArchetype;
    active: boolean;
    // ... other spirit fields
  };
  
  // Related spirit data
  practices?: SpiritPractice[];
  treasury?: SpiritTreasury;
  drops?: SpiritDrop[];
}
```

### 4. Backward Compatibility

- All Spirit fields are optional to maintain compatibility
- Existing endpoints continue to work unchanged
- New `include` parameter allows requesting Spirit data:
  ```
  GET /agents/{handle}?include=spirit,practices,treasury
  ```

## Implementation Checklist

### Phase 1: Database Extensions
- [ ] Run spirit schema migrations
- [ ] Test data integrity
- [ ] Verify existing queries still work

### Phase 2: IPFS Integration
- [ ] Configure Pinata credentials
- [ ] Test JSON metadata upload
- [ ] Implement fallback for development

### Phase 3: Smart Contract Integration
- [ ] Deploy EdenRegistry contract to testnet
- [ ] Configure contract addresses in environment
- [ ] Test graduation flow end-to-end

### Phase 4: API Endpoints
- [ ] Implement spirit graduation endpoint
- [ ] Implement practice execution endpoint
- [ ] Implement treasury and drops endpoints
- [ ] Add comprehensive error handling

### Phase 5: Frontend Integration
- [ ] Update Agent interface types
- [ ] Test Spirit onboarding flow
- [ ] Test Spirit dashboard functionality
- [ ] Verify graceful fallbacks

### Phase 6: Testing & Deployment
- [ ] Unit tests for all Spirit methods
- [ ] Integration tests with Registry API
- [ ] End-to-end Spirit graduation flow
- [ ] Performance testing with caching
- [ ] Feature flag deployment

## Environment Configuration

Add these environment variables:

```bash
# Feature flag
FF_EDEN3_ONBOARDING=false  # Default off in production

# IPFS Configuration
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs

# Smart Contract Configuration  
EDEN_REGISTRY_CONTRACT_ADDRESS=0x...
ETHEREUM_RPC_URL=https://...
PRIVATE_KEY=0x...  # For contract deployment only

# Registry Configuration (existing)
NEXT_PUBLIC_REGISTRY_URL=https://test.api.eden-academy.xyz/api/v1
NEXT_PUBLIC_REGISTRY_API_KEY=eden-academy-client
```

## Monitoring and Observability

Add logging for Spirit operations:

```typescript
logger.info('Spirit graduation initiated', {
  agentId,
  archetype,
  graduationMode,
  trainerAddress
});

logger.info('Spirit practice executed', {
  agentId,
  workId,
  outputCid,
  executionDate
});

logger.error('Spirit graduation failed', {
  agentId,
  error: error.message,
  stage: 'covenant-upload' // or 'contract-call', 'database-update'
});
```

## Security Considerations

1. **Trainer Authorization**: Verify trainer address has permission to graduate agents
2. **Idempotency**: Prevent duplicate graduations using idempotency keys
3. **Rate Limiting**: Protect against spam practice executions
4. **Input Validation**: Sanitize all user inputs, especially IPFS metadata
5. **Secret Management**: Never log or expose private keys or API secrets

## Testing Strategy

1. **Unit Tests**: Test each Spirit method in isolation with mocked dependencies
2. **Integration Tests**: Test Registry API integration with real HTTP calls
3. **Contract Tests**: Test smart contract interactions on testnet
4. **End-to-End Tests**: Complete graduation flow from UI to blockchain
5. **Performance Tests**: Verify caching and fallback mechanisms
6. **Security Tests**: Validate input sanitization and authorization

This coordination guide ensures the Spirit graduation system integrates seamlessly with Henry's existing Registry patterns while adding powerful new autonomous agent capabilities.