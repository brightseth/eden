# ADR-020: Amanda Agent Registry-First Migration

**Status**: Proposed  
**Date**: 2025-08-26  
**Authors**: Architecture Guardian, Registry Guardian, Feature Integrator  
**Deciders**: Eden Academy Technical Leadership  

## Context

Amanda (the art collecting agent) currently has fragmented data across multiple systems:
- Basic profile in Registry seed
- Static mappings in Academy UI files
- Independent state in standalone agent
- Hardcoded Eden Academy profile page

This violates the core principle that Registry = Protocol Layer and creates risk of data inconsistencies.

## Decision

Migrate Amanda to be fully Registry-first with the Registry as the single source of truth for all canonical data.

## Architecture

### Data Flow
```
Registry (Source of Truth)
    ↓ API calls via SDK
Academy UI (Consumer)
    ↓ API calls via SDK  
Standalone Agent (Consumer + Producer)
```

### Migration Phases

**Phase 1: Registry Schema Enhancement (Week 1-2)**
- Extend Agent schema with art collector specialization
- Add collections and artworks tables
- Create activity logging structure

**Phase 2: SDK Integration (Week 2-3)**  
- Replace raw axios with generated SDK
- Implement Registry consumption in standalone agent
- Add bidirectional state synchronization

**Phase 3: Academy UI Update (Week 3-4)**
- Remove static mappings (TRAINER_MAP, ECONOMIC_DATA)
- Update to consume Registry API via migrationService
- Make profile pages Registry-driven

**Phase 4: Feature Flag Rollout (Week 4-5)**
- REGISTRY_DRIVEN_PROFILE (default: false)
- REGISTRY_DRIVEN_STATE (default: false)
- SDK_ONLY_MODE (default: false)
- LEGACY_STANDALONE_MODE (default: true for rollback)

**Phase 5: Production Migration (Week 5-6)**
- Run migration SQL scripts
- Enable feature flags progressively
- Monitor for data drift
- Complete migration validation

## Implementation Details

### Registry Schema Extensions
```sql
ALTER TABLE agents ADD COLUMN agent_type VARCHAR(50);
ALTER TABLE agents ADD COLUMN specialization TEXT;
ALTER TABLE agents ADD COLUMN capabilities JSONB;
ALTER TABLE agents ADD COLUMN personality JSONB;
ALTER TABLE agents ADD COLUMN metrics JSONB;
ALTER TABLE agents ADD COLUMN operational_config JSONB;
```

### SDK Usage Pattern
```typescript
// BEFORE: Raw axios
this.client = axios.create({...});
await this.client.post('/api/agents', data);

// AFTER: Generated SDK
this.sdk = new EdenRegistrySDK({...});
await this.sdk.agents.create(data);
```

### Feature Flag Configuration
```typescript
export const AMANDA_MIGRATION_FLAGS = {
  REGISTRY_DRIVEN_PROFILE: process.env.ENABLE_REGISTRY_SYNC === 'true',
  LEGACY_STANDALONE_MODE: process.env.ENABLE_REGISTRY_SYNC !== 'true'
};
```

## Rollback Strategy

**Immediate Rollback Triggers:**
- Registry API unavailable > 5 minutes
- Data corruption detected
- Performance degradation > 50%

**Rollback Process:**
1. Set `ENABLE_REGISTRY_SYNC=false`
2. Agent reverts to local operation
3. Load last known good state
4. Alert operations team

## Consequences

### Positive
- Single source of truth eliminates data drift
- Consistent data across all systems
- Proper service boundaries maintained
- SDK provides type safety and error handling
- Feature flags enable safe rollout

### Negative  
- Increased dependency on Registry availability
- Migration complexity and timeline (6 weeks)
- Potential performance impact from API calls
- Requires careful coordination across teams

### Risks
- Data loss during migration (mitigated by backups)
- Service disruption (mitigated by feature flags)
- Performance degradation (mitigated by caching)

## Validation Criteria

### Technical
- [ ] All Amanda data migrated to Registry
- [ ] SDK integration complete and tested
- [ ] Academy UI consuming Registry API
- [ ] Feature flags working correctly
- [ ] Rollback tested successfully

### Operational
- [ ] No data drift detected for 7 days
- [ ] API response times < 200ms p95
- [ ] Zero data loss confirmed
- [ ] Monitoring and alerts configured

### Business
- [ ] Amanda agent fully operational
- [ ] Collection features working
- [ ] No user-facing disruption
- [ ] Performance metrics maintained

## References

- CLAUDE.md: Core development principles
- ADR-019: Registry Integration Pattern
- Eden Academy Agent Architecture
- Registry API Documentation

## Decision Record

- **Proposed**: 2025-08-26
- **Accepted**: [PENDING]
- **Implemented**: [PENDING]
- **Validated**: [PENDING]

## Notes

This migration establishes the pattern for all future Eden Academy agents to be Registry-first from inception, preventing similar fragmentation issues.