# ADR-020: Spirit Registry Federation Pattern

## Status
**PROPOSED** - Ready for implementation and testing

## Context

Eden Academy needs to integrate with Henry's spirit-registry to provide onchain verification and token data for agents while maintaining our established single source of truth architecture.

### Current Architecture
- Eden Genesis Registry: Authoritative data source for all agent information
- Eden Academy: Pure UI presentation layer, no local storage
- Generated SDK pattern for all API communication
- Circuit breaker patterns for resilience

### Integration Requirements
- Maintain Registry as single source of truth
- Add onchain data (verification, tokens) as supplemental information  
- Preserve backward compatibility
- Enable rollback via feature flags
- Follow existing patterns (Gateway, SDK, Circuit Breaker)

## Decision

**Implement Gateway Aggregation Pattern** - Spirit Registry will be integrated as a federated data source through Eden Genesis Registry, maintaining single source of truth while enriching data with onchain information.

### Architecture Pattern
```
Eden Genesis Registry (Data Authority)
├── Core Agent Data (authoritative)
└── Spirit Registry Client → spirit-registry.vercel.app (supplemental)
                                └── Onchain Data (verification, tokens)
```

### Data Flow
```
Eden Academy Request
    ↓
Generated SDK Client
    ↓
Eden Genesis Registry API
    ↓
Data Reconciliation Service
    ├── Registry Data (primary)
    └── Spirit Registry Data (supplemental)
    ↓
Unified Response with Optional Onchain Data
```

## Implementation

### 1. Feature Flags
```typescript
ENABLE_SPIRIT_REGISTRY: false          // Main integration toggle
ENABLE_DATA_RECONCILIATION: false      // Data merging toggle  
ENABLE_ONCHAIN_BADGES: false          // UI display toggle
```

### 2. Data Reconciliation Rules
- **Registry Data Takes Precedence**: Core agent information (name, status, description, trainer) from Registry is authoritative
- **Spirit Data is Supplemental**: Onchain data (token address, verification, holders) enhances but doesn't override
- **Conflict Resolution**: Registry wins on conflicts, log discrepancies for monitoring
- **Circuit Breaker**: If Spirit Registry fails, fallback to Registry-only data

### 3. API Contract
```typescript
interface ReconciledAgent extends Agent {
  onchain?: OnchainData | null;         // Optional onchain enhancement
  lastSyncAt?: string;                  // Data freshness indicator
  dataSource: 'registry' | 'registry+spirit' | 'fallback';
}
```

### 4. Backward Compatibility
- Existing Eden Academy UI works without changes
- Onchain fields are optional, default to null if unavailable
- Generated SDK maintains existing interface
- Feature flags enable gradual rollout

## Consequences

### Positive
- **Maintains Architecture Integrity**: Single source of truth preserved
- **Enhances Agent Profiles**: Onchain verification adds credibility  
- **Rollback Safety**: Feature flags allow instant rollback
- **Performance Resilience**: Circuit breaker prevents Spirit Registry outages from affecting Eden Academy
- **Development Velocity**: Existing patterns reduce implementation complexity

### Negative
- **Increased Complexity**: Data reconciliation adds another system dependency
- **Latency Impact**: Additional API call may slow agent profile loading
- **Data Consistency Overhead**: Need monitoring for Registry/Spirit data conflicts

### Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Spirit Registry downtime | Eden Academy shows partial data | Circuit breaker falls back to Registry-only mode |
| Data inconsistency | Agent profiles show conflicting info | Registry data takes precedence, log conflicts |
| Performance degradation | Slower page loads | Aggressive caching (5min TTL), async loading |
| Schema evolution | Breaking changes in spirit API | Contract validation, API versioning |

## Rollout Plan

### Phase 1: Infrastructure (Week 1)
- [x] Add feature flags with default OFF
- [x] Implement Spirit Registry client with retries/timeouts
- [x] Create data reconciliation service
- [x] Add test endpoint: `/api/test/spirit-integration`

### Phase 2: Integration Testing (Week 2)  
- [ ] Test against Henry's spirit-registry endpoint
- [ ] Validate data reconciliation rules
- [ ] Performance testing under load
- [ ] Circuit breaker validation

### Phase 3: UI Enhancement (Week 3)
- [ ] Add onchain badges to agent cards (behind ENABLE_ONCHAIN_BADGES flag)
- [ ] Display verification status in profiles
- [ ] Token holder counts and addresses

### Phase 4: Production Rollout (Week 4)
- [ ] Enable ENABLE_SPIRIT_REGISTRY in production
- [ ] Monitor for data conflicts and performance impact
- [ ] Gradual rollout to all agents based on metrics

## Monitoring

### Success Metrics
- Spirit Registry availability > 95%
- Data reconciliation conflicts < 1% of requests  
- Agent profile load time increase < 200ms
- Zero fallback failures (Registry always available)

### Alerting
- Spirit Registry response time > 5s
- Data reconciliation failure rate > 5%
- Circuit breaker activation (Spirit Registry down)

## Testing Strategy

### Unit Tests
- Spirit Registry client retry logic
- Data reconciliation conflict resolution
- Feature flag behavior

### Integration Tests  
- End-to-end agent profile loading with Spirit data
- Circuit breaker activation and recovery
- Data consistency validation

### Performance Tests
- Agent profile loading under concurrent load
- Memory usage with data reconciliation
- Cache effectiveness metrics

## Decision Rationale

**Why Gateway Aggregation vs Direct Federation?**
- Maintains single source of truth principle
- Reduces Eden Academy complexity (no dual API calls)
- Enables unified caching and circuit breaking
- Preserves existing SDK patterns

**Why Registry Data Takes Precedence?**
- Registry has been the authoritative source
- Training data, profiles, and progress tracking live in Registry  
- Spirit Registry focuses on blockchain/token data specifically
- Clear ownership boundaries reduce conflict complexity

**Why Feature Flags for Everything?**
- New integration with external service carries risk
- Gradual rollout enables performance validation
- Instant rollback capability if issues arise
- A/B testing for UI enhancements

## References

- ADR-019: Registry Integration Pattern
- ADR-016: Service Boundary Definition  
- Spirit Registry API: https://spirit-registry.vercel.app/api/docs
- Feature Flag Documentation: /src/config/flags.ts

## Notes

This ADR establishes the foundation for onchain data integration while preserving Eden Academy's architectural integrity. The pattern can be extended for future blockchain integrations (NFT metadata, trading data, etc.) following the same principles.

## Review and Approval

- [ ] Architecture Guardian Review  
- [ ] Token Economist Review (economic implications)
- [ ] Registry Guardian Review (data consistency)
- [ ] Academy Domain Expert Review (cultural impact)

---
*Generated by TRUTH Agent - Eden Academy Data Integrity Guardian*  
*Date: 2025-08-26*