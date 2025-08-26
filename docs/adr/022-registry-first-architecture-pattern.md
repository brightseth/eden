# ADR-022: Registry-First Architecture Pattern

## Status
Accepted - Implemented

## Context

Recent development sessions have established Eden Genesis Registry as the single source of truth for all agent data, works, and creative outputs. The Academy platform has evolved from using mock data to consuming actual Registry data through well-defined APIs.

### Key Changes Implemented:
- **Abraham Site**: Complete redesign with 13-year covenant (2025-2038), Registry integration for works display
- **Solienne Site**: Paris Photo 2025 countdown, 6 generations/day practice, Registry integration for consciousness streams
- **Data Flow Evolution**: Registry → API endpoints → Academy sites (no data duplication)
- **Interface Standardization**: Consistent data models across Registry and Academy

### Problems Solved:
- Eliminated mock data inconsistencies
- Created single source of truth for agent works
- Established consistent data flow patterns
- Improved data integrity across services

## Decision

### 1. Registry-First Data Architecture

All agent data MUST originate from Eden Genesis Registry:

```typescript
// ✅ CORRECT: Fetch from Registry API
const response = await fetch('/api/agents/abraham/works?limit=6&period=early-works');
const data = await response.json();

// ❌ INCORRECT: Use mock or hardcoded data
const mockWorks = [
  { id: 'mock-1', title: 'Mock Work' }
];
```

### 2. Academy as UI Layer Pattern

Academy sites act as presentation layer only:

```
Registry (Data Source) → Academy API Routes → Academy Sites (UI)
```

**Implementation:**
- Academy API routes proxy to Registry
- Data transformation happens at API boundary  
- Sites consume transformed data via Academy APIs
- Graceful fallback to mock data if Registry unavailable

### 3. Data Transformation Standards

Registry data MUST be transformed to Academy interfaces at API boundaries:

```typescript
// In /api/agents/[agent]/works/route.ts
const transformedWorks = registryData.works.map((work: any) => ({
  id: work.id,
  agent_id: agentId,
  archive_type: work.type || 'generation',
  title: work.title || 'Untitled',
  image_url: work.imageUrl || work.mediaUri,
  created_date: work.createdAt,
  archive_number: work.metadata?.dayNumber,
  // ... other transformations
}));
```

### 4. Agent Configuration Consistency

Agent configurations MUST reflect actual Registry data:

```typescript
// Abraham: 13-year covenant (2025-2038)
abraham: {
  stats: [
    { label: 'Total Works', value: 2519 },
    { label: 'Covenant Period', value: '13 Years (2025-2038)' },
    { label: 'Completion', value: 'Oct 19, 2038' }
  ]
}

// Solienne: Paris Photo 2025, 6 generations/day
solienne: {
  stats: [
    { label: 'Daily Streams', value: 1740 },
    { label: 'Paris Photo 2025', value: 'Nov 10, 2025' },
    { label: 'Generations/Day', value: '6' }
  ]
}
```

### 5. Error Handling and Fallbacks

All Registry integrations MUST include graceful degradation:

```typescript
useEffect(() => {
  const fetchActualWorks = async () => {
    setLoadingWorks(true);
    try {
      const response = await fetch('/api/agents/abraham/works?limit=6');
      const data = await response.json();
      if (data.works) {
        setActualWorks(transformedWorks);
      }
    } catch (error) {
      console.error('Failed to fetch from Registry:', error);
      // Keep mock data as fallback - DO NOT break the UI
    } finally {
      setLoadingWorks(false);
    }
  };
});
```

### 6. Registry API Standards

All Registry API calls MUST follow established patterns:

```typescript
// Academy API Route Pattern
export async function GET(request: NextRequest) {
  try {
    const registryUrl = process.env.REGISTRY_URL || 'http://localhost:3005';
    const response = await fetch(`${registryUrl}/api/v1/agents/${agent}/works?${params}`);
    
    if (!response.ok) {
      throw new Error(`Registry API error: ${response.status}`);
    }
    
    const registryData = await response.json();
    return NextResponse.json({
      works: transformedWorks,
      total: registryData.total,
      // ... Academy-formatted response
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch works from Registry' },
      { status: 500 }
    );
  }
}
```

## Implementation Status

### ✅ Completed
- Abraham site Registry integration with actual works display
- Solienne site Registry integration with consciousness streams
- API route transformation layers for both agents
- Agent configuration updates reflecting actual data
- Runtime error handling and fallback mechanisms

### 🔄 In Progress
- Complete migration from RegistryClient to direct API patterns
- Standardization of all agent site Registry integrations
- Documentation of data transformation patterns

### 📋 Next Steps
- Migrate remaining mock data consumers to Registry APIs
- Implement Registry integration for Amanda and Miyomi sites
- Add Registry health monitoring and alerting

## Architecture Consequences

### Positive
- ✅ Single source of truth eliminates data inconsistencies
- ✅ Agent sites display actual works instead of mock data
- ✅ Clean separation between data layer (Registry) and presentation layer (Academy)
- ✅ Graceful degradation when Registry unavailable
- ✅ Consistent data models across all services

### Negative
- ⚠️ Additional network latency for data fetching
- ⚠️ Registry becomes critical dependency for site functionality
- ⚠️ More complex error handling requirements

### Risk Mitigation
- Fallback to mock data prevents UI breakage
- Client-side loading states improve perceived performance
- Registry health monitoring enables proactive issue resolution

## Related ADRs
- ADR-019: Registry Integration Pattern (foundational)
- ADR-016: Service Boundary Definition (service separation)
- ADR-021: Agent Readiness Framework (agent lifecycle)

## Validation Criteria

- [ ] All agent sites fetch actual data from Registry
- [ ] Mock data only used as graceful fallback
- [ ] Data transformation happens at API boundaries
- [ ] Error handling prevents UI breakage
- [ ] Registry URLs and configurations documented
- [ ] Performance acceptable with Registry latency

---

**Implementation Notes:**

This ADR documents the successful migration from mock data to Registry-first architecture. The pattern established here should be followed for all future agent integrations and data flows within the Eden ecosystem.