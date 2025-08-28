# ADR-026: CITIZEN Snapshot DAO Integration Architecture

**Date**: 2025-08-28  
**Status**: Accepted  
**Context**: CITIZEN Agent requires enhanced DAO governance capabilities through Snapshot integration  

## Context

CITIZEN agent serves as the AI governance coordinator for the Bright Moments DAO, managing 10,000 CryptoCitizens NFT holders through rough consensus mechanisms. The current implementation includes basic governance simulation but lacks real-world DAO integration capabilities.

The community has requested integration with Snapshot.org for off-chain voting, proposal creation, and governance coordination to enable sophisticated DAO participation while maintaining Eden Academy's registry-first architecture principles.

## Decision

We will integrate CITIZEN with Snapshot DAO governance through a testnet-first approach starting on Sepolia, maintaining strict adherence to our Registry-first architecture pattern established in ADR-022.

### Architecture Principles

1. **Registry Authority**: All governance data must flow through Registry as the canonical source of truth
2. **Gateway Mediation**: No direct Snapshot API calls from CITIZEN - all external calls via Gateway
3. **Data Consistency**: Registry maintains authoritative governance state, syncs to Snapshot
4. **Testnet Validation**: Full implementation and testing on Sepolia before mainnet deployment

### Schema Extensions

#### Registry GovernanceProfile Schema
```typescript
interface GovernanceProfile {
  id: ULID;
  agentId: ULID;
  daoSpaceName: string;           // "brightmomentsdao-testnet.eth"
  snapshotSpaceId: string;        // Snapshot space identifier  
  votingPower: {
    tokenSymbol: string;          // "CryptoCitizens"
    contractAddress: string;      // Sepolia test contract
    votingWeight: number;         // 1 NFT = 1 vote
    delegationEnabled: boolean;
  };
  governanceRole: 'FACILITATOR' | 'MEMBER' | 'OBSERVER';
  proposalRights: {
    canCreate: boolean;
    canVeto: boolean;
    minimumHoldings: number;
  };
  consensusFramework: 'ROUGH_CONSENSUS' | 'MAJORITY' | 'SUPERMAJORITY';
  networkId: number;              // 11155111 for Sepolia
  lastSyncAt: Date;
  metadata: object;
}
```

#### Enhanced Work Schema for Governance
```typescript
interface GovernanceWork extends Work {
  governanceType: 'snapshot_proposal' | 'consensus_building' | 'voting_coordination';
  snapshotProposalId?: string;
  networkId: number;              // Sepolia testnet
  votingPeriod: {
    start: Date;
    end: Date;
  };
  votingResults?: {
    for: number;
    against: number; 
    abstain: number;
    quorum: number;
  };
  consensusScore: number;         // 0-1 consensus achievement
}
```

### Data Flow Architecture

```
Proposal Creation:
CITIZEN → Registry API → Gateway → Snapshot Testnet → Registry (canonical storage)

Voting Coordination:
Registry ← Gateway ← Snapshot Testnet (periodic sync)
Registry → CITIZEN (real-time updates via webhooks)

Vote Casting:
CITIZEN → Registry API → Gateway → Snapshot Testnet → Registry (vote recording)
```

### Gateway Service Integration

New Gateway endpoints required:
- `POST /api/v1/governance/snapshot/proposal` - Create testnet proposals
- `GET /api/v1/governance/snapshot/spaces/{spaceId}` - Fetch space data
- `GET /api/v1/governance/snapshot/proposals/{proposalId}` - Get proposal details
- `POST /api/v1/governance/snapshot/vote` - Submit votes
- `GET /api/v1/governance/snapshot/voting-power/{address}` - Check voting power

### CitizenClaudeSDK Enhancements

```typescript
export class CitizenClaudeSDK {
  async createSnapshotProposal(proposal: GovernanceProposal): Promise<GovernanceWork> {
    // Submit to Registry API (creates canonical Work record)
    // Registry handles Snapshot submission via Gateway
    return registryWorkId; // Return Registry ID, not Snapshot ID
  }
  
  async getGovernanceHealth(): Promise<GovernanceHealthMetrics> {
    // All metrics from Registry (canonical source)
    return await this.registryClient.getGovernanceMetrics();
  }
  
  async processVotingResults(workId: string): Promise<ConsensusAnalysis> {
    // Analyze from Registry data only
    return await this.registryClient.analyzeConsensus(workId);
  }
}
```

## Testnet Implementation Plan

### Phase 1: Registry Schema & Core Infrastructure
- Deploy GovernanceProfile table to Registry
- Extend Work schema with governance fields
- Create database migration scripts
- Setup Sepolia testnet environment variables

### Phase 2: Gateway Snapshot Integration  
- Implement SnapshotService for testnet
- Create Gateway API endpoints
- Setup authentication for Snapshot API calls
- Configure rate limiting and error handling

### Phase 3: CITIZEN Integration
- Enhanced CitizenClaudeSDK with governance methods
- Registry-first data flow implementation  
- Real-time sync between Registry and Snapshot
- Webhook system for governance updates

### Phase 4: Testing & Validation
- Comprehensive governance workflow tests
- Registry-Snapshot data consistency validation
- Performance testing under load
- Security audit of governance data flow

## Security Considerations

1. **No Direct API Access**: CITIZEN cannot hold Snapshot API keys
2. **Registry Authorization**: Governance operations require proper Registry permissions  
3. **Data Integrity**: Registry maintains canonical state, resolves conflicts
4. **Audit Trail**: Complete governance activity logging in Registry
5. **Testnet Isolation**: Full validation on Sepolia before mainnet consideration

## Feature Flag Configuration

```typescript
// config/flags.ts
export const flags = {
  CITIZEN_SNAPSHOT_GOVERNANCE: {
    enabled: false,  // Default off
    testnet: true,   // Sepolia only initially
    networkId: 11155111, // Sepolia
    rollbackPlan: 'Disable governance integration, revert to simulation mode'
  }
}
```

## Rollback Strategy

**Immediate Rollback**:
- Disable `CITIZEN_SNAPSHOT_GOVERNANCE` feature flag
- CITIZEN reverts to local governance simulation
- Registry data preserved for historical analysis

**Progressive Migration**:
- Gradual rollout from testnet to mainnet
- A/B testing with governance simulation fallback
- Full data migration path if architecture changes needed

## Success Metrics

### Integration Health
- 99.9% Registry-Snapshot data consistency on testnet
- <2s governance data sync latency
- Zero data drift incidents between platforms

### Governance Effectiveness  
- 25%+ increase in DAO participation rates (measured on testnet)
- 95%+ proposal success rate (well-formed proposals)
- <24hr average proposal discussion resolution time

### Technical Performance
- 100% Gateway API success rate for governance calls
- <500ms Registry governance API response times  
- Zero security incidents with governance data

## Consequences

### Positive
- ✅ Maintains Registry-first architecture integrity
- ✅ Enables sophisticated real-world DAO governance
- ✅ Provides comprehensive consensus building capabilities
- ✅ Creates reusable pattern for other agent governance needs
- ✅ Full testnet validation reduces mainnet risk

### Negative  
- ⚠️ Increases system complexity with external dependency
- ⚠️ Requires Registry schema changes and migration
- ⚠️ Additional operational overhead for Snapshot sync monitoring
- ⚠️ Testnet-to-mainnet transition complexity

### Neutral
- 🔄 Establishes Eden Academy as leader in AI-DAO governance
- 🔄 Creates foundation for multi-network DAO participation
- 🔄 Enables future governance token economics integration

## Implementation

This ADR authorizes immediate implementation of CITIZEN Snapshot DAO integration starting with Sepolia testnet, following the registry-first architecture pattern, with full production readiness validation before any mainnet consideration.