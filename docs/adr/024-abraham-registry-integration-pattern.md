# ADR-024: Abraham Registry Integration Pattern

## Status
Accepted - Implemented

## Context

Abraham's site represents a unique case in the Eden Academy ecosystem due to his 13-year covenant commitment (2025-2038) for daily autonomous creation. This requires seamless integration with the Registry system to track real-time progress, covenant milestones, and daily work status while maintaining architectural compliance.

### Previous Violations:
- Direct Supabase queries bypassing Registry SDK
- Missing UI → Gateway → Registry pattern adherence
- No feature flagging for Registry integration
- Hardcoded covenant calculations without Registry data

### Requirements:
- Real-time covenant progress tracking from Registry
- Daily work status updates and metrics
- 13-year timeline visualization with actual data
- Graceful fallback to local calculations
- Feature-flagged rollout with rollback capability

## Decision

### 1. Registry-First Data Flow

Abraham's site MUST follow the established Registry-First Architecture Pattern (ADR-022):

```typescript
// Architecture Flow
Abraham Site → Academy API Routes → Generated SDK → Registry Gateway → Registry Database

// Implementation
/api/agents/abraham/works → registryApi.getAgentCreations('abraham', 'PUBLISHED')
/api/agents/abraham/covenant → registryApi.getAgentProfile('abraham') + covenant calculations
/api/agents/abraham/status → registryApi.getAgentCreations() + real-time metrics
```

### 2. Feature-Flagged Integration

All Registry integration MUST be behind the `ENABLE_ABRAHAM_REGISTRY_INTEGRATION` flag:

```typescript
// Feature Flag Configuration
ENABLE_ABRAHAM_REGISTRY_INTEGRATION: {
  key: 'ENABLE_ABRAHAM_REGISTRY_INTEGRATION',
  description: 'Enable full Registry integration for Abraham site with real-time features',
  defaultValue: process.env.NODE_ENV === 'development',
  rolloutStrategy: 'dev',
  culturalImpact: 'Abraham site displays actual Registry data instead of mocks',
  rollbackPlan: 'Disable flag, fallback to current Supabase + mock data pattern'
}
```

### 3. API Route Standards

#### Works Endpoint: `/api/agents/abraham/works`
- Uses Registry SDK with graceful Supabase fallback
- Transforms Registry Creation objects to Academy work format
- Maintains client-side filtering until Registry supports query parameters
- Returns source indicator ('registry' | 'supabase')

#### Covenant Endpoint: `/api/agents/abraham/covenant`
- Calculates 13-year covenant progress from Registry data
- Provides real-time metrics (total works, covenant works, engagement)
- Returns timeline milestones and covenant status
- Fallback to local calculations when Registry unavailable

#### Status Endpoint: `/api/agents/abraham/status`
- Real-time work status and next creation countdown
- Live viewer metrics and engagement data
- Current covenant phase and commitment tracking
- 10-second refresh intervals for real-time updates

### 4. Data Transformation Layer

Registry Creation objects MUST be transformed to Academy format:

```typescript
function transformCreationToWork(creation: Creation): AbrahamWork {
  return {
    id: creation.id,
    agent_id: 'abraham',
    archive_type: (creation.metadata?.dayNumber <= 2519) ? 'early-work' : 'covenant',
    title: creation.title || `Knowledge Synthesis #${creation.metadata?.dayNumber}`,
    image_url: creation.mediaUri,
    archive_number: creation.metadata?.dayNumber,
    // ... other mappings
  };
}
```

### 5. Real-Time Features

Abraham's site implements real-time covenant tracking:

- **30-second refresh**: Covenant progress and metrics
- **10-second refresh**: Live status and viewer counts  
- **1-second refresh**: Countdown timers and next work timing
- **Registry indicators**: Visual markers when Registry data is active

### 6. Covenant Timeline Calculations

The 13-year covenant requires precise date calculations:

```typescript
// Covenant Constants
const COVENANT_START = new Date('2025-10-19');
const COVENANT_END = new Date('2038-10-19');
const TOTAL_DAYS = 4748;

// Current Day Calculation
function calculateCovenantDay(): number {
  const today = new Date();
  if (today < COVENANT_START) return 0;
  
  const diffTime = today.getTime() - COVENANT_START.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays + 1);
}
```

## Consequences

### Positive:
- **Registry Compliance**: Follows established UI → Gateway → Registry pattern
- **Real-time Data**: Actual covenant progress from Registry instead of mocks
- **Graceful Fallback**: Maintains functionality when Registry is unavailable  
- **Feature Safety**: Flag-controlled rollout with documented rollback plan
- **Cultural Alignment**: Supports Abraham's 13-year commitment with accurate tracking

### Negative:
- **Complexity**: Additional API endpoints and data transformation layer
- **Performance**: Multiple API calls for real-time updates (mitigated by intervals)
- **Dependency**: Relies on Registry availability for optimal experience

### Mitigation:
- Comprehensive error handling and fallback mechanisms
- Client-side data caching to reduce API load
- Clear visual indicators when Registry vs fallback data is displayed
- Feature flag allows instant rollback to previous implementation

## Implementation Details

### File Changes:
- `/src/config/flags.ts` - Added `ENABLE_ABRAHAM_REGISTRY_INTEGRATION` flag
- `/src/app/api/agents/abraham/works/route.ts` - Registry SDK integration
- `/src/app/api/agents/abraham/covenant/route.ts` - Covenant progress API
- `/src/app/api/agents/abraham/status/route.ts` - Real-time status API
- `/src/app/sites/abraham/page.tsx` - Registry data consumption

### Quality Gates:
- ✅ Uses only generated Registry SDK for network calls
- ✅ Feature behind flag with rollback plan documented
- ✅ Maintains domain language consistency (Agent, Work, Covenant)
- ✅ Graceful error handling and fallback patterns
- ✅ Real-time updates with appropriate refresh intervals

### Monitoring:
- Console logging for Registry vs fallback data source
- Visual indicators on site when Registry data is active
- API response includes `source` field for debugging

## Compliance

This ADR ensures compliance with:
- **ADR-022**: Registry-First Architecture Pattern
- **ADR-023**: Agent Site Architecture Standards
- **ADR-019**: Registry Integration Pattern
- **CLAUDE.md**: Feature flagging and rollback requirements

## Future Extensions

This pattern establishes the foundation for:
- Other agent sites requiring Registry integration
- Advanced covenant milestone tracking
- Cross-agent work comparison and metrics
- Historical covenant progress visualization
- Registry-driven agent site generation