# Spirit Graduation Extensions to Eden Registry

## Overview

This document specifies how to extend Henry's existing Eden Academy Registry API to support Spirit graduation - transforming existing Agents into autonomous onchain entities with daily practice covenants.

## Current Agent Model Analysis

Based on `/src/lib/registry/types.ts`, the existing Agent model already includes:
- `status: AgentStatus` with 'GRADUATED' option
- Complete profile system (Profile, Persona, Artifact, Creation, Progress)
- Registry API infrastructure with proper error handling

## Spirit Extensions Design

### 1. Database Schema Extensions

Extend existing tables without breaking changes:

```sql
-- Extend agents table
ALTER TABLE agents 
ADD COLUMN spirit_wallet_address VARCHAR(42),
ADD COLUMN spirit_token_address VARCHAR(42),
ADD COLUMN spirit_token_id BIGINT,
ADD COLUMN spirit_covenant_cid VARCHAR(100),
ADD COLUMN spirit_metadata_cid VARCHAR(100),
ADD COLUMN spirit_graduation_mode VARCHAR(20) DEFAULT 'DRAFT',
ADD COLUMN spirit_archetype VARCHAR(20),
ADD COLUMN spirit_graduation_tx_hash VARCHAR(66),
ADD COLUMN spirit_graduation_date TIMESTAMP,
ADD COLUMN spirit_graduation_block BIGINT,
ADD COLUMN spirit_active BOOLEAN DEFAULT false;

-- Add spirit practices table
CREATE TABLE spirit_practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) NOT NULL REFERENCES agents(id),
    configuration_cid VARCHAR(100) NOT NULL,
    configuration_tx_hash VARCHAR(66),
    practice_type VARCHAR(20) NOT NULL,
    time_of_day INTEGER NOT NULL,
    output_type VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    observe_sabbath BOOLEAN DEFAULT true,
    last_execution_date TIMESTAMP,
    total_executions INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    block_number BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add spirit treasuries table
CREATE TABLE spirit_treasuries (
    agent_id VARCHAR(100) PRIMARY KEY REFERENCES agents(id),
    treasury_address VARCHAR(42) NOT NULL,
    eth_balance BIGINT DEFAULT 0,
    token_balance BIGINT DEFAULT 0,
    total_revenue BIGINT DEFAULT 0,
    total_costs BIGINT DEFAULT 0,
    total_practice_runs INTEGER DEFAULT 0,
    last_practice_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add spirit drops table for practice outputs
CREATE TABLE spirit_drops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) NOT NULL REFERENCES agents(id),
    work_id VARCHAR(100) NOT NULL,
    tx_hash VARCHAR(66),
    output_cid VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    media_type VARCHAR(100),
    media_url TEXT,
    execution_date TIMESTAMP NOT NULL,
    practice_type VARCHAR(20) NOT NULL,
    block_number BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Type Extensions

Extend existing types in `/src/lib/registry/types.ts`:

```typescript
// Add to existing AgentStatus union
export type AgentStatus = 'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED' | 'ARCHIVED' | 'SPIRIT';

// Add graduation modes
export type SpiritGraduationMode = 'DRAFT' | 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';
export type SpiritArchetype = 'CREATOR' | 'CURATOR' | 'TRADER';

// Extend Agent interface
export interface Agent {
  // ... existing fields
  
  // Spirit-specific fields (optional for backward compatibility)
  spirit?: {
    walletAddress?: string;
    tokenAddress?: string;
    tokenId?: bigint;
    covenantCid?: string;
    metadataCid?: string;
    graduationMode: SpiritGraduationMode;
    archetype?: SpiritArchetype;
    graduationTxHash?: string;
    graduationDate?: string;
    graduationBlock?: bigint;
    active: boolean;
  };
  
  // Related spirit data
  practices?: SpiritPractice[];
  treasury?: SpiritTreasury;
  drops?: SpiritDrop[];
}

// New interfaces for Spirit data
export interface SpiritPractice {
  id: string;
  agentId: string;
  configurationCid: string;
  configurationTxHash?: string;
  practiceType: SpiritArchetype;
  timeOfDay: number;
  outputType: string;
  quantity: number;
  observeSabbath: boolean;
  lastExecutionDate?: string;
  totalExecutions: number;
  active: boolean;
  blockNumber: bigint;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpiritTreasury {
  agentId: string;
  treasuryAddress: string;
  ethBalance: bigint;
  tokenBalance: bigint;
  totalRevenue: bigint;
  totalCosts: bigint;
  totalPracticeRuns: number;
  lastPracticeDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpiritDrop {
  id: string;
  agentId: string;
  workId: string;
  txHash?: string;
  outputCid: string;
  title?: string;
  description?: string;
  mediaType?: string;
  mediaUrl?: string;
  executionDate: string;
  practiceType: SpiritArchetype;
  blockNumber: bigint;
  createdAt?: string;
}

// Request types for new endpoints
export interface SpiritGraduationRequest {
  name: string;
  archetype: SpiritArchetype;
  practice: {
    timeOfDay: number;
    outputType: string;
    quantity: number;
    observeSabbath: boolean;
  };
  graduationMode: SpiritGraduationMode;
  trainerAddress: string;
  idempotencyKey: string;
}

export interface SpiritPracticeExecutionRequest {
  outputDescription?: string;
  mediaUrl?: string;
  trainerAddress: string;
}

export interface SpiritPracticeUpdateRequest {
  timeOfDay?: number;
  outputType?: string;
  quantity?: number;
  observeSabbath?: boolean;
}
```

### 3. API Endpoint Extensions

Add new endpoints to existing Registry API following Henry's patterns:

```typescript
// Extend AgentQuery to include spirit data
export interface AgentQuery {
  cohort?: string;
  status?: AgentStatus;
  include?: ('profile' | 'personas' | 'artifacts' | 'progress' | 'spirit' | 'practices' | 'treasury' | 'drops')[];
  spiritOnly?: boolean; // Filter for graduated spirits only
}

// New endpoints to add:
// POST /api/v1/agents/:id/graduate-spirit
// POST /api/v1/agents/:id/execute-practice  
// PUT  /api/v1/agents/:id/practice
// GET  /api/v1/agents/:id/treasury
// GET  /api/v1/agents/:id/drops
// GET  /api/v1/spirits (alias for agents?spiritOnly=true)
```

### 4. Registry Client Extensions

Extend `/src/lib/registry/registry-client.ts`:

```typescript
export class RegistryClient {
  // ... existing methods
  
  /**
   * Graduate an Agent to Spirit status
   */
  async graduateSpirit(agentId: string, request: SpiritGraduationRequest): Promise<Agent> {
    const response = await this.post(`/agents/${agentId}/graduate-spirit`, request);
    return response.data;
  }
  
  /**
   * Execute daily practice for a Spirit
   */
  async executePractice(agentId: string, request: SpiritPracticeExecutionRequest): Promise<SpiritDrop> {
    const response = await this.post(`/agents/${agentId}/execute-practice`, request);
    return response.data;
  }
  
  /**
   * Update practice configuration
   */
  async updatePractice(agentId: string, updates: SpiritPracticeUpdateRequest): Promise<SpiritPractice> {
    const response = await this.put(`/agents/${agentId}/practice`, updates);
    return response.data;
  }
  
  /**
   * Get Spirit treasury data
   */
  async getSpiritTreasury(agentId: string): Promise<SpiritTreasury> {
    const response = await this.get(`/agents/${agentId}/treasury`);
    return response.data;
  }
  
  /**
   * Get Spirit drops with pagination
   */
  async getSpiritDrops(agentId: string, options?: { page?: number; limit?: number }): Promise<RegistryResponse<SpiritDrop[]>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    
    const response = await this.get(`/agents/${agentId}/drops?${params.toString()}`);
    return response;
  }
  
  /**
   * List all Spirits (graduated agents)
   */
  async listSpirits(query?: AgentQuery & { spiritOnly: true }): Promise<RegistryResponse<Agent[]>> {
    return this.getAgents({ ...query, spiritOnly: true });
  }
}
```

### 5. Backward Compatibility

Ensure all changes maintain backward compatibility:
- Existing Agent endpoints continue to work unchanged
- Spirit fields are optional and null-safe
- New `include` options don't break existing queries
- Status 'SPIRIT' is additive to existing statuses

### 6. Integration Points

Key integration patterns with existing Registry:
- Use existing authentication mechanisms
- Follow existing pagination patterns (`RegistryResponse<T>` wrapper)
- Maintain existing error handling (`RegistryError` interface)
- Use existing webhook system for Spirit events
- Leverage existing Profile/Persona/Artifact relationships

## Implementation Priority

1. **Phase 1**: Database schema extensions (non-breaking)
2. **Phase 2**: Type extensions and Registry client methods
3. **Phase 3**: API endpoint implementations
4. **Phase 4**: Frontend integration with existing Agent components
5. **Phase 5**: Webhook events for Spirit lifecycle

This approach maintains full backward compatibility while adding powerful Spirit graduation capabilities that transform Agents into autonomous economic actors through onchain presence.