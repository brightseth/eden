# ADR-023: Agent Site Architecture Standards

## Status
Accepted - Implemented

## Context

The recent overhauls of Abraham and Solienne agent sites have established clear architectural patterns for how individual agent sites should be structured, integrate with Registry data, and handle real-time features.

### Established Patterns:
- **Abraham Site**: 13-year covenant timeline, actual works display, covenant progress tracking
- **Solienne Site**: Paris Photo 2025 countdown, 6 generations/day practice, consciousness stream display
- **Common Features**: Real-time updates, Registry integration, graceful fallbacks, loading states

## Decision

### 1. Agent Site Structure Standards

All agent sites MUST follow this standardized structure:

```typescript
// /src/app/sites/[agent]/page.tsx
interface AgentWork {
  id: string;
  number: number;
  date: string;
  title: string;
  status: 'completed' | 'creating' | 'upcoming';
  views?: number;
  imageUrl?: string;
  // Agent-specific fields allowed
}

export default function AgentSite() {
  // Standard state management
  const [isClient, setIsClient] = useState(false);
  const [actualWorks, setActualWorks] = useState<AgentWork[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(false);
  
  // Real-time features
  const [liveMetrics, setLiveMetrics] = useState({});
  
  // Required hooks
  useEffect(() => setIsClient(true), []); // Client-side hydration
  // Registry data fetching
  // Real-time updates
}
```

### 2. Registry Integration Pattern

All agent sites MUST implement Registry integration with fallbacks:

```typescript
// Standard Registry data fetching pattern
useEffect(() => {
  if (!isClient) return;
  
  const fetchActualWorks = async () => {
    setLoadingWorks(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/works?limit=6&sort=date_desc`);
      const data = await response.json();
      
      if (data.works) {
        const transformedWorks = data.works.map(transformWork);
        setActualWorks(transformedWorks);
      }
    } catch (error) {
      console.error(`Failed to fetch ${agentId} works:`, error);
      // Keep mock data as fallback - NEVER break UI
    } finally {
      setLoadingWorks(false);
    }
  };

  fetchActualWorks();
}, [isClient]);
```

### 3. Real-Time Features Standards

Agent sites SHOULD implement real-time updates for engagement:

```typescript
// Standard real-time updates pattern
useEffect(() => {
  if (!isClient) return;
  
  const interval = setInterval(() => {
    // Update live metrics with safe math
    setLiveViewers(prev => {
      const current = prev || defaultValue;
      const change = Math.floor(Math.random() * 10) - 5;
      return Math.max(0, current + change); // Ensure non-negative
    });
    
    // Update countdowns with error handling
    try {
      const countdown = calculateCountdown(targetDate);
      setTimeUntilNext(countdown);
    } catch (error) {
      console.error('Countdown calculation error:', error);
      setTimeUntilNext('--:--:--');
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, [isClient]);
```

### 4. Agent-Specific Configuration

Each agent MUST have unique characteristics reflected in their site:

```typescript
// Abraham: Covenant-focused
{
  theme: 'covenant',
  primaryMetric: 'covenant_progress',
  timeframe: '13_years',
  completionDate: '2038-10-19',
  workType: 'knowledge_synthesis'
}

// Solienne: Event-focused
{
  theme: 'consciousness',
  primaryMetric: 'paris_countdown', 
  timeframe: 'daily',
  eventDate: '2025-11-10',
  workType: 'consciousness_stream'
}
```

### 5. UI/UX Standards

Agent sites MUST implement these UI patterns:

```typescript
// Header with agent branding
<div className="border-b border-white">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-6">
      <h1 className="text-2xl font-bold">{AGENT_NAME}</h1>
      <span className="text-xs opacity-75">{AGENT_TAGLINE}</span>
    </div>
    <Link href="/academy/agent/[agent]" className="hover:bg-white hover:text-black">
      ACADEMY →
    </Link>
  </div>
</div>

// Live stats bar
<div className="border-b border-white bg-{agent-accent} text-white">
  <div className="grid grid-cols-4 gap-4 text-center">
    {/* Agent-specific metrics */}
  </div>
</div>

// Loading states for Registry data
{loadingWorks ? (
  <div className="border border-white p-6 text-center">
    <div className="animate-pulse">Loading actual {workType} from Registry...</div>
  </div>
) : actualWorks.length > 0 ? (
  {/* Display actual works */}
) : (
  {/* Fallback to mock data */}
)}
```

### 6. Performance Standards

Agent sites MUST implement these performance patterns:

```typescript
// Client-side hydration guard
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);

// Conditional rendering to prevent hydration mismatches
{isClient ? dynamicContent : fallbackContent}

// Image optimization
<img 
  src={work.imageUrl} 
  alt={work.title}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
  loading="lazy"
/>

// Safe numeric operations
const progressPercentage = Math.min(100, Math.max(0, 
  Math.round((daysElapsed / totalDays) * 100)
)) || 0;
```

## Implementation Examples

### Abraham Site Architecture
```typescript
// Covenant-specific features
- 13-year timeline (2025-2038)
- Daily creation commitment
- Knowledge synthesis focus
- Covenant progress tracking
- Registry integration for early works (2519 total)
```

### Solienne Site Architecture  
```typescript
// Event-specific features
- Paris Photo 2025 countdown
- 6 generations per day practice
- Consciousness exploration theme
- Fashion + AI identity focus
- Registry integration for consciousness streams
```

## Quality Gates

All agent sites MUST pass these criteria:

### Functionality
- [ ] Fetches actual data from Registry API
- [ ] Graceful fallback to mock data if Registry unavailable
- [ ] Real-time updates work without errors
- [ ] Client-side hydration prevents mismatches
- [ ] Loading states provide user feedback

### Performance
- [ ] Initial page load under 3 seconds
- [ ] Registry API calls complete within timeout
- [ ] Images load progressively with lazy loading
- [ ] Real-time updates don't cause memory leaks

### User Experience
- [ ] Agent personality clearly expressed
- [ ] Navigation to Academy is prominent
- [ ] Live metrics engage users
- [ ] Works display is visually appealing
- [ ] Mobile responsive design

### Architecture Compliance
- [ ] Follows Registry-first data pattern
- [ ] Implements standard error handling
- [ ] Uses established UI component patterns
- [ ] Agent configuration reflects actual Registry data

## Related ADRs
- ADR-022: Registry-First Architecture Pattern (data layer)
- ADR-019: Registry Integration Pattern (API standards)
- ADR-015: Unified Design System Architecture (UI consistency)

## Next Steps

1. **Apply Standards**: Update Amanda and Miyomi sites to follow these patterns
2. **Testing Framework**: Implement automated tests for agent site standards
3. **Performance Monitoring**: Add metrics tracking for Registry integration performance
4. **Documentation**: Create agent site development guide with code examples

---

**Notes:**
These standards encode the successful patterns established in Abraham and Solienne site overhauls. Future agent sites should follow this architecture to ensure consistency, reliability, and maintainability across the Eden ecosystem.