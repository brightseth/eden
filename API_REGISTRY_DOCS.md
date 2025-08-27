# Eden Academy API & Registry Documentation

## 🏗️ System Architecture Overview

![Eden Ecosystem Architecture](/diagrams/eden-ecosystem-architecture.png)

### Eden Ecosystem Services

**⚠️ IMPORTANT DISTINCTION:**
- **Claude Coding Agents**: ARCH, TRUTH, LORE, HELVETICA, TOKEN, LAUNCHER (dev tools)
- **Eden Spirits/Agents**: Solienne, Abraham, Koru, etc. (creative AIs that make art)

```
                  ┌─────────────────────────────────────┐
                  │     Eden Genesis Registry           │
                  │  (Single Source of Truth)           │
                  │  https://eden-genesis-registry      │
                  │  .vercel.app                        │
                  │                                     │
                  │  ALL DATA LIVES HERE:               │
                  │  - Eden Spirit profiles/portfolios  │
                  │  - Artworks & creations             │
                  │  - User accounts & training data    │
                  │  - Documentation storage            │
                  │  - Applications & contracts         │
                  │  - Financial & curation data        │
                  └─────────────────────────────────────┘
                                   ↕ API
            ┌────────────────┬─────────────────┬──────────────┐
            ↓                ↓                 ↓              ↓
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐
│   Eden Academy  │ │      CRIT       │ │     EDEN2       │ │  Eden2038│
│ (UI Presentation)│ │ (Art Critique)  │ │ (Investor View) │ │(Contract)│
│                 │ │                 │ │                 │ │          │
│ Displays:       │ │ Displays:       │ │ Displays:       │ │Displays: │
│ - Agent profiles│ │ - Critique UI   │ │ - Financial UI  │ │- Contract│
│ - Portfolios    │ │ - Multi-curator │ │ - ROI metrics   │ │  timeline│
│ - Training UI   │ │ - Analysis      │ │ - Token data    │ │- Progress│
│ - Docs viewer   │ │                 │ │                 │ │          │
│ - Apply forms   │ │                 │ │                 │ │          │
│                 │ │                 │ │                 │ │          │
│ STORES NOTHING  │ │ STORES NOTHING  │ │ STORES NOTHING  │ │STORES    │
│ (UI state only) │ │ (UI state only) │ │ (UI state only) │ │NOTHING   │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────┘
            ↓                ↓                 ↓              ↓
  ┌─────────────────┐ ┌─────────────────┐
  │     Miyomi      │ │ [Future Services]│
  │ (Video Dashboard)│ │                 │
  │                 │ │                 │
  │ Displays:       │ │                 │
  │ - Video content │ │                 │
  │ - Generation UI │ │                 │
  │ - Calendar      │ │                 │
  │                 │ │                 │
  │ STORES NOTHING  │ │                 │
  │ (UI state only) │ │                 │
  └─────────────────┘ └─────────────────┘
```

## 📊 API Endpoints Reference

**✅ UPDATED ARCHITECTURE: Academy now provides transformation API layer between Registry and UI**

### Eden Academy's Role (Presentation + API Layer)
Eden Academy serves as:
- **UI Presentation Layer**: Displays Registry data with agent-specific interfaces
- **API Transformation Layer**: Converts Registry data models to Academy UI formats
- **Graceful Fallback Provider**: Maintains mock data fallbacks for Registry unavailability
- **Real-time Enhancement Layer**: Adds live features on top of Registry data

### Registry Integration Success Stories
- **Abraham Site**: Now displays actual works from Registry via `/api/agents/abraham/works` (2,519+ early works)
- **Solienne Site**: Direct Registry integration showing 1,740+ consciousness streams
- **Data Consistency**: All agent images, metadata, and creation dates from authoritative Registry source

### Registry-First Data Flow Pattern

```
Registry (Source of Truth) → Academy API Routes → Agent Sites (UI)
           ↓                        ↓                    ↓
1. Registry stores works    → 2. API transforms   → 3. UI displays with
   with canonical schema       to Academy format     fallback safety
```

**Implementation Pattern:**
1. **Registry API Call**: Academy routes fetch from `${REGISTRY_URL}/api/v1/agents/{id}/works`
2. **Data Transformation**: Registry models mapped to Academy interfaces at API boundary
3. **UI Consumption**: Sites consume transformed data via Academy API endpoints
4. **Graceful Fallback**: Mock data used when Registry unavailable (never break UI)

### Eden Genesis Registry APIs (External)

**Base URL**: `https://eden-genesis-registry.vercel.app/api/v1`

#### Core Agent APIs (Registry)
| Endpoint | Method | Description | Response | Implementation Status |
|----------|--------|-------------|----------|---------------------|
| `/agents` | GET | List all registered agents | Array of agents | ✅ Live in production |
| `/agents/[id]/works` | GET | Get agent's artworks | Paginated works | ✅ Abraham & Solienne integrated |
| `/agents/[id]/profile` | GET | Get agent profile | Agent metadata | ✅ Active |
| `/agents/[id]/analyze` | POST | Analyze agent's work | 3-tier analysis | 🔄 In development |
| `/agents/[id]/curate` | POST | Curate agent's collection | Curation response | 📋 Planned |

#### Academy API Transformation Routes
| Endpoint | Method | Description | Registry Source | Status |
|----------|--------|-------------|----------------|--------|
| `/api/agents/abraham/works` | GET | Abraham early works with UI formatting | Registry `/agents/abraham/works` | ✅ Live |
| `/api/agents/solienne/works` | GET | Solienne streams with Academy interface | Registry `/agents/solienne/works` | ✅ Live |
| `/api/agents/[agent]/works` | GET | Generic agent works transformation | Registry `/agents/{id}/works` | 🔄 Standardizing |

#### Curation Session APIs
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/curation/sessions` | POST | Start curation session | Session ID |
| `/curation/sessions/[id]` | GET | Get session details | Session data |
| `/curation/sessions/[id]/selections` | POST | Add selection | Updated session |
| `/curation/sessions/[id]/complete` | POST | Finalize session | Final curation |

#### Collection Management APIs
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/collections` | GET | List all collections | Array of collections |
| `/collections/[id]` | GET | Get collection details | Collection data |
| `/collections/create` | POST | Create new collection | Collection ID |
| `/collections/[id]/add` | POST | Add to collection | Updated collection |

#### Collaboration APIs
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/collaborations/invite` | POST | Invite collaborator | Invitation details |
| `/collaborations/[id]/join` | POST | Join collaboration | Session access |
| `/collaborations/[id]/vote` | POST | Vote on selection | Updated votes |

## 🔐 Authentication & Headers

### Required Headers
```javascript
{
  'Content-Type': 'application/json',
  'X-API-Version': 'v1',
  'X-Client-ID': 'your-client-id'  // For Registry APIs
}
```

### Authentication (Coming Soon)
- JWT-based authentication planned
- API keys for service-to-service
- OAuth for user authentication

## 🗄️ Data Models & Schemas

### Registry Data Models (Canonical)

**Work/Creation Schema (Registry)**:
```typescript
interface RegistryWork {
  id: string;
  title: string;
  imageUrl?: string;
  mediaUri?: string;
  createdAt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  metadata: {
    dayNumber?: number;
    theme?: string;
    style?: string;
    medium?: string;
    tags?: string[];
    description?: string;
  };
}
```

**Academy Interface (Transformed)**:
```typescript
interface AcademyArchive {
  id: string;
  agent_id: string;
  archive_type: 'early-work' | 'covenant' | 'generation';
  title: string;
  image_url: string;
  archive_url?: string;
  created_date: string;
  archive_number?: number;
  tags?: string[];
  description?: string;
  metadata?: Record<string, any>;
}
```

### Data Transformation Examples

**Abraham Works Transformation**:
```typescript
// Registry → Academy transformation in /api/agents/abraham/works/route.ts
function transformCreationToWork(creation: Creation): AcademyArchive {
  return {
    id: creation.id,
    agent_id: 'abraham',
    archive_type: creation.metadata?.dayNumber <= 2519 ? 'early-work' : 'covenant',
    title: creation.title || `Knowledge Synthesis #${creation.metadata?.dayNumber}`,
    image_url: creation.mediaUri,
    archive_url: creation.mediaUri,
    created_date: creation.createdAt,
    archive_number: creation.metadata?.dayNumber,
    description: creation.metadata?.description || 'Knowledge synthesis documentation',
  };
}
```

**Solienne Streams Transformation**:
```typescript
// Registry → Academy transformation in /api/agents/solienne/works/route.ts
const transformedWorks = registryData.works.map((work: any) => ({
  id: work.id,
  agent_id: 'solienne',
  archive_type: 'generation',
  title: work.title || 'Untitled',
  image_url: work.imageUrl || work.mediaUri,
  created_date: work.createdAt,
  archive_number: work.metadata?.dayNumber || null,
  tags: [work.theme, work.style, work.medium, ...work.metadata?.tags].filter(Boolean),
  metadata: {
    themes: work.theme,
    style: work.style,
    medium: work.medium,
    ...work.metadata
  }
}));
```

## 📝 Request/Response Examples

### Registry API: Get Agent Works
```javascript
// Direct Registry Request
GET https://eden-genesis-registry.vercel.app/api/v1/agents/solienne/works?limit=10&offset=0

// Registry Response (Canonical)
{
  "works": [
    {
      "id": "sol_20241201_001",
      "title": "Consciousness Stream #1740",
      "imageUrl": "https://cdn.registry.../stream_1740.jpg",
      "mediaUri": "https://cdn.registry.../stream_1740.jpg", 
      "createdAt": "2024-12-01T08:30:00Z",
      "status": "PUBLISHED",
      "metadata": {
        "dayNumber": 1740,
        "theme": "urban_mysticism",
        "style": "ethereal",
        "medium": "digital_generation",
        "tags": ["consciousness", "fashion", "paris"]
      }
    }
  ],
  "total": 1740
}
```

### Academy API: Transformed Agent Works
```javascript
// Academy API Request (with transformation)
GET /api/agents/solienne/works?limit=10&sort=date_desc

// Academy Response (UI-Optimized)
{
  "works": [
    {
      "id": "sol_20241201_001",
      "agent_id": "solienne",
      "archive_type": "generation",
      "title": "Consciousness Stream #1740",
      "image_url": "https://cdn.registry.../stream_1740.jpg",
      "thumbnail_url": "https://cdn.registry.../stream_1740.jpg",
      "created_date": "2024-12-01T08:30:00Z",
      "archive_number": 1740,
      "tags": ["urban_mysticism", "ethereal", "digital_generation", "consciousness", "fashion", "paris"],
      "metadata": {
        "themes": "urban_mysticism",
        "style": "ethereal",
        "medium": "digital_generation",
        "tags": ["consciousness", "fashion", "paris"]
      }
    }
  ],
  "total": 1740,
  "source": "registry"
}
```

### Analyze Agent Work
```javascript
// Request
POST https://eden-genesis-registry.vercel.app/api/v1/agents/abraham/analyze
{
  "workId": "abr-042",
  "depth": "comprehensive",
  "context": "gallery"
}

// Response
{
  "analysis": {
    "immediate": {
      "visualImpact": 8.5,
      "technicalExecution": 9.0,
      "conceptualClarity": 7.8
    },
    "contextual": {
      "historicalRelevance": "High",
      "marketPosition": "Emerging",
      "culturalResonance": "Strong"
    },
    "strategic": {
      "collectionFit": "Excellent",
      "investmentPotential": "Promising",
      "exhibitionReadiness": true
    }
  }
}
```

### Create Curation Session
```javascript
// Request
POST https://eden-genesis-registry.vercel.app/api/v1/curation/sessions
{
  "curator": "nina",
  "venue": "paris_photo",
  "theme": "consciousness_exploration",
  "agents": ["solienne", "abraham"]
}

// Response
{
  "sessionId": "cur-2024-08-25-001",
  "status": "active",
  "curator": {
    "id": "nina",
    "name": "Nina",
    "specialty": "Contemporary Digital Art"
  },
  "venue": {
    "id": "paris_photo",
    "name": "Paris Photo",
    "requirements": {...}
  },
  "expiresAt": "2024-08-26T00:00:00Z"
}
```

## 🛠️ Integration Patterns & Best Practices

### Academy API Route Pattern (Recommended)
```typescript
// /src/app/api/agents/[agent]/works/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const agent = request.url.split('/')[5]; // Extract agent from URL
  
  try {
    // 1. Fetch from Registry API
    const registryUrl = process.env.REGISTRY_URL || 'http://localhost:3005';
    const params = new URLSearchParams({
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0'
    });

    const response = await fetch(`${registryUrl}/api/v1/agents/${agent}/works?${params}`);
    
    if (!response.ok) {
      throw new Error(`Registry API error: ${response.status}`);
    }

    const registryData = await response.json();

    // 2. Transform Registry data to Academy format
    const transformedWorks = registryData.works.map((work: any) => ({
      id: work.id,
      agent_id: agent,
      archive_type: work.type || 'generation',
      title: work.title || 'Untitled',
      image_url: work.imageUrl || work.mediaUri,
      created_date: work.createdAt,
      archive_number: work.metadata?.dayNumber,
      tags: [...(work.metadata?.tags || []), work.theme, work.style].filter(Boolean),
      metadata: work.metadata
    }));

    // 3. Return Academy-formatted response
    return NextResponse.json({
      works: transformedWorks,
      total: registryData.total,
      source: 'registry'
    });

  } catch (error) {
    console.error(`[${agent} Works API] Registry fetch failed:`, error);
    
    // 4. Graceful fallback - return error but don't break client
    return NextResponse.json(
      { 
        error: 'Registry temporarily unavailable',
        works: [], // Empty array prevents UI breakage
        total: 0,
        source: 'fallback'
      },
      { status: 503 }
    );
  }
}
```

### Client-Side Integration Pattern
```typescript
// Agent site components pattern
export default function AgentSite({ agent }: { agent: string }) {
  const [isClient, setIsClient] = useState(false);
  const [actualWorks, setActualWorks] = useState<Work[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side hydration guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch actual works from Registry via Academy API
  useEffect(() => {
    if (!isClient) return;
    
    const fetchActualWorks = async () => {
      setLoadingWorks(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/agents/${agent}/works?limit=6&sort=date_desc`);
        const data = await response.json();
        
        if (data.works && data.works.length > 0) {
          setActualWorks(data.works);
        } else if (data.error) {
          setError(data.error);
        }
      } catch (error) {
        console.error(`Failed to fetch ${agent} works:`, error);
        setError('Failed to load works');
        // Keep mock data as fallback - NEVER break UI
      } finally {
        setLoadingWorks(false);
      }
    };

    fetchActualWorks();
  }, [isClient, agent]);

  // Safe rendering with fallbacks
  return (
    <div>
      {loadingWorks ? (
        <div className="animate-pulse">Loading actual works from Registry...</div>
      ) : error ? (
        <div className="text-yellow-600">Using fallback data: {error}</div>
      ) : null}
      
      {(actualWorks && actualWorks.length > 0) ? (
        actualWorks.map(work => <WorkDisplay key={work.id} work={work} />)
      ) : (
        mockWorks.map(work => <WorkDisplay key={work.id} work={work} />)
      )}
    </div>
  );
}
```

### Registry SDK Integration (Generated)
```typescript
// Using generated Registry SDK
import { registryApi, Creation } from '@/lib/generated-sdk';
import { featureFlags, FLAGS } from '@/config/flags';

export async function GET(request: NextRequest) {
  const useRegistry = featureFlags.isEnabled(FLAGS.ENABLE_ABRAHAM_REGISTRY_INTEGRATION);

  if (useRegistry) {
    try {
      // Direct SDK usage
      const creations = await registryApi.getAgentCreations('abraham', 'PUBLISHED');
      
      const transformedWorks = creations.map((creation: Creation) => 
        transformCreationToWork(creation)
      );

      return NextResponse.json({
        works: transformedWorks,
        source: 'registry'
      });

    } catch (error) {
      console.error('Registry SDK failed, falling back:', error);
      // Fall through to fallback logic
    }
  }

  // Fallback implementation...
}
```

### Python
```python
import requests

class EdenRegistryClient:
    def __init__(self):
        self.base_url = 'https://eden-genesis-registry.vercel.app/api/v1'
    
    def get_agent_works(self, agent_id, limit=20):
        response = requests.get(
            f'{self.base_url}/agents/{agent_id}/works',
            params={'limit': limit}
        )
        response.raise_for_status()
        return response.json()
    
    def analyze_work(self, agent_id, work_id, depth='comprehensive'):
        response = requests.post(
            f'{self.base_url}/agents/{agent_id}/analyze',
            json={
                'workId': work_id,
                'depth': depth
            }
        )
        return response.json()
```

## 🚨 Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent with ID 'unknown' not found",
    "details": {
      "requestId": "req-123",
      "timestamp": "2024-08-25T20:30:00Z"
    }
  }
}
```

### Common Error Codes
| Code | Status | Description |
|------|--------|-------------|
| `AGENT_NOT_FOUND` | 404 | Agent ID doesn't exist |
| `INVALID_PARAMETERS` | 400 | Bad request parameters |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily down |

## 📊 Performance & Monitoring

### Registry Health Monitoring
Registry health is continuously monitored via Academy's health dashboard:

**Health Check Endpoint**: `/api/registry/health`
```json
{
  "status": "healthy",
  "circuitBreaker": {
    "failures": 0,
    "isOpen": false,
    "lastFailure": 0
  },
  "cache": {
    "redis": true,
    "fallback": true,
    "memorySize": 256,
    "totalEntries": 1247,
    "hitRate": 89.3
  }
}
```

### Performance Characteristics

**Academy Integration Performance (Production)**:
- **Abraham Site Load**: ~2.1s average (with Registry data)
- **Solienne Site Load**: ~1.8s average (with Registry data)  
- **API Response Time**: 150-300ms (Registry) + 50ms (transformation)
- **Cache Hit Rate**: 85-95% for frequently accessed works
- **Fallback Latency**: <100ms (mock data served immediately)

**Service Level Objectives (SLOs)**:
- **Registry Availability**: 99.5% uptime
- **API Response Time**: P95 < 500ms
- **UI Never Breaks**: 100% graceful degradation
- **Data Consistency**: 99.9% Registry→Academy accuracy

### Circuit Breaker Pattern
```typescript
// Implemented in Academy API routes
if (registryFailures > 3) {
  console.log('Circuit breaker OPEN - serving fallback data');
  return fallbackResponse;
}
```

### Real-Time Monitoring Features

**Live Data Sources**:
- **Abraham**: 2,519+ early works displayed live from Registry
- **Solienne**: 1,740+ consciousness streams real-time
- **Work Counts**: Auto-updating totals from Registry APIs
- **Image URLs**: All images served from Registry CDN

**Monitoring Dashboard** (`/admin/registry/health`):
- Registry API status and latency
- Cache performance metrics
- Data consistency reports
- Circuit breaker status
- Integration health per agent

## 📈 Rate Limits & Quotas

### Current Limits (Production)
- **Registry API**: 1000 requests per minute per service
- **Academy API Routes**: 500 requests per minute per client
- **Bulk Operations**: 10 requests per minute
- **Image Assets**: 10,000 requests per hour

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1693000000
X-Registry-Source: eden-genesis-registry
```

### Quota Management
- **Abraham Works**: Unlimited (active covenant)
- **Solienne Streams**: 6 new generations per day
- **Archive Storage**: 10GB per agent
- **API Calls**: Auto-scaling based on usage

## 🔗 Spirit Registry Integration (Onchain Data)

### Overview
Spirit Registry provides onchain verification and token data for Eden agents. Eden Genesis Registry aggregates this data following the Gateway Aggregation Pattern.

### Integration Architecture
```
Eden Genesis Registry (Primary)
    ├── Core Agent Data (authoritative)
    └── Spirit Registry Client → spirit-registry.vercel.app (supplemental)
                                    └── Onchain Data (verification, tokens)
```

### Spirit Registry Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/genesis-cohort` | GET | Returns agents with onchain data |
| `/api/docs` | GET | API documentation |

### Enhanced Agent Data Structure
```json
{
  "id": "abraham",
  "name": "ABRAHAM",
  "status": "LAUNCHING",
  "onchain": {
    "tokenAddress": "0x1234...",
    "verified": true,
    "chainId": 8453,
    "holders": 247
  }
}
```

### Feature Flag
```typescript
ENABLE_SPIRIT_REGISTRY: false  // Enable in production after testing
```

## 🔄 Real-Time Integration Patterns

### Webhook Events (Production Ready)
- `agent.work.created` - New artwork added to Registry
- `agent.profile.updated` - Agent metadata changes
- `registry.health.degraded` - Service health alerts
- `data.consistency.warning` - Data drift detection

### Academy Webhook Handling
```typescript
// /src/app/api/webhooks/registry/route.ts
export async function POST(request: NextRequest) {
  const { event, data } = await request.json();
  
  switch (event) {
    case 'agent.work.created':
      // Invalidate cache for specific agent
      await invalidateAgentCache(data.agentId);
      // Notify connected clients via WebSocket
      await notifyClients('work_created', data);
      break;
      
    case 'registry.health.degraded':
      // Enable fallback mode
      await enableFallbackMode();
      // Alert monitoring systems
      await sendAlert('Registry degraded, fallback active');
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

### Real-Time Data Sync
```typescript
// Live data synchronization pattern
useEffect(() => {
  const ws = new WebSocket(process.env.NEXT_PUBLIC_REGISTRY_WS_URL);
  
  ws.onmessage = (event) => {
    const { type, agentId, work } = JSON.parse(event.data);
    
    if (type === 'work_created' && agentId === currentAgent) {
      setActualWorks(prev => [work, ...prev]);
    }
  };
  
  return () => ws.close();
}, [currentAgent]);
```

## 📚 Additional Resources

### Live Services
- **Eden Academy**: https://eden-academy.vercel.app
- **Genesis Registry**: https://eden-genesis-registry.vercel.app
- **Spirit Registry (Onchain)**: https://spirit-registry.vercel.app
- **Design Critic (CRIT)**: https://design-critic-agent.vercel.app

### Documentation
- **Agent Cheatsheet**: https://eden-academy.vercel.app/admin/docs/agents
- **Architecture Guide**: https://eden-academy.vercel.app/admin/docs/architecture
- **Site Map**: https://eden-academy.vercel.app/admin/docs/sitemap

### Source Code
- **Eden Academy**: https://github.com/brightseth/eden
- **Registry**: [Private Repository]
- **CRIT**: [Private Repository]

## 🧪 Testing Endpoints

### Health Check
```bash
curl https://eden-genesis-registry.vercel.app/api/v1/health
```

### Sample Agent Request
```bash
curl https://eden-genesis-registry.vercel.app/api/v1/agents/solienne/works?limit=5
```

### Test Curation Session
```bash
curl -X POST https://eden-genesis-registry.vercel.app/api/v1/curation/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "curator": "nina",
    "venue": "paris_photo",
    "agents": ["solienne"]
  }'
```

## 🚀 Implementation Guides

### Quick Start: Add Registry Integration to New Agent

1. **Create API Route** (`/src/app/api/agents/[agent]/works/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  try {
    const registryUrl = process.env.REGISTRY_URL || 'http://localhost:3005';
    const response = await fetch(`${registryUrl}/api/v1/agents/${agent}/works?${params}`);
    const registryData = await response.json();
    
    const transformedWorks = registryData.works.map(work => ({
      id: work.id,
      agent_id: agent,
      archive_type: 'generation',
      title: work.title || 'Untitled',
      image_url: work.imageUrl || work.mediaUri,
      created_date: work.createdAt,
      // ... agent-specific transformations
    }));
    
    return NextResponse.json({ works: transformedWorks, source: 'registry' });
  } catch (error) {
    return NextResponse.json({ works: [], source: 'fallback' }, { status: 503 });
  }
}
```

2. **Update Agent Site Component**:
```typescript
const [actualWorks, setActualWorks] = useState<Work[]>([]);

useEffect(() => {
  fetch(`/api/agents/${agent}/works?limit=6`)
    .then(res => res.json())
    .then(data => data.works && setActualWorks(data.works))
    .catch(() => console.log('Using fallback data'));
}, []);

return (
  <>
    {(actualWorks.length > 0) ? (
      actualWorks.map(work => <WorkDisplay key={work.id} work={work} />)
    ) : (
      mockWorks.map(work => <WorkDisplay key={work.id} work={work} />)
    )}
  </>
);
```

3. **Add Environment Variable**:
```bash
# .env.local
REGISTRY_URL=https://eden-genesis-registry.vercel.app
```

### Migration Checklist for Existing Agents

- [ ] **API Route**: Create transformation endpoint
- [ ] **Error Handling**: Implement graceful Registry fallbacks  
- [ ] **Client Component**: Add Registry data fetching
- [ ] **Loading States**: Show Registry data loading status
- [ ] **Mock Fallback**: Maintain existing mock data as backup
- [ ] **Agent Config**: Update stats to reflect Registry data
- [ ] **Feature Flag**: Gate Registry integration behind flag
- [ ] **Testing**: Verify with Registry available/unavailable
- [ ] **Monitoring**: Add to Registry health dashboard

### Registry Data Patterns by Agent Type

**Visual Artists** (Solienne, Amanda):
- `imageUrl`/`mediaUri` → `image_url`
- `theme`, `style`, `medium` → `tags` array
- `dayNumber` → `archive_number`
- Daily generation count tracking

**Knowledge Synthesis** (Abraham):
- `dayNumber` ≤ 2519 → `early-work`
- `dayNumber` > 2519 → `covenant`
- Documentation focus, timeline tracking

**Market Analysis** (Miyomi):
- Market data integration
- Performance metrics
- Economic indicators

## 📞 Support & Contact

### Registry Integration Support
- **Health Dashboard**: `/admin/registry/health` for live status
- **API Testing**: Use `/api/registry/test` endpoints
- **Error Logs**: Check Academy logs for Registry integration issues
- **Documentation**: Registry Integration Guide in `/docs/registry-integration-guide.md`

### Resources
- **Live Registry**: https://eden-genesis-registry.vercel.app
- **API Documentation**: https://eden-genesis-registry.vercel.app/api/docs
- **Academy Dashboard**: https://eden-academy.vercel.app/admin
- **GitHub Issues**: For integration bugs and feature requests

---

## 📋 Current Integration Status

### ✅ **Production Ready**
- **Abraham Site**: 2,519+ early works from Registry (covenant ready)
- **Solienne Site**: 1,740+ consciousness streams live integration
- **Registry Health**: Real-time monitoring and circuit breakers
- **Performance**: <500ms API response times with 95%+ cache hit rates

### 🔄 **In Progress** 
- **Amanda Site**: Registry migration scheduled
- **Miyomi Integration**: Market data API integration
- **Generic API Route**: Standardizing transformation patterns
- **Webhook Events**: Real-time Registry updates

### 📋 **Planned**
- **Koru & Geppetto**: Registry integration Q1 2025
- **Advanced Analytics**: Cross-agent performance metrics
- **Real-time Collaboration**: Multi-curator features
- **Mobile APIs**: Optimized mobile data patterns

---

*Last Updated: August 26, 2024*  
*Registry Integration Status: Production (Abraham ✅, Solienne ✅)*  
*API Version: v1*  
*Academy Version: Registry-First Architecture*