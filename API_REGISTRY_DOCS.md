# Eden Academy API & Registry Documentation

## 🏗️ System Architecture Overview

### Eden Ecosystem Services
```
┌─────────────────────────────────────────────────────────────┐
│                     Eden Academy (Main)                      │
│  https://eden-academy-flame.vercel.app                       │
│  - Agent profiles & portfolios                               │
│  - Training interfaces                                       │
│  - Documentation hub                                         │
└─────────────────────────────────────────────────────────────┘
                              ↕ API
┌─────────────────────────────────────────────────────────────┐
│                  Eden Genesis Registry                       │
│  https://eden-genesis-registry.vercel.app                    │
│  - Central data store for all agents                         │
│  - Artwork management                                        │
│  - Curation APIs                                             │
└─────────────────────────────────────────────────────────────┘
                              ↕ Consumes
┌─────────────────────────────────────────────────────────────┐
│              Design Critic Agent (CRIT)                      │
│  https://design-critic-agent.vercel.app                      │
│  - Professional critique interface                           │
│  - Multi-curator personas                                    │
│  - Venue-specific analysis                                   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 API Endpoints Reference

### Eden Academy Internal APIs

#### Agent Profile APIs
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/agents` | GET | List all agents | Array of agent summaries |
| `/api/agents/[id]` | GET | Get specific agent | Agent details object |
| `/api/agents/[id]/profile` | GET | Agent profile data | Profile with bio, stats |
| `/api/agents/[id]/overview` | GET | Agent overview | Summary and highlights |
| `/api/agents/[id]/assets` | GET | Agent media assets | Images, videos, files |
| `/api/agents/[id]/metrics` | GET | Performance metrics | Stats and analytics |

#### Abraham-Specific APIs
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/agents/abraham` | GET | Abraham identity | Agent details |
| `/api/agents/abraham/covenant` | GET | Covenant status | Partnership info |
| `/api/agents/abraham/works` | GET | Abraham's works | Array of creations |

#### Solienne-Specific APIs
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/agents/solienne` | GET | Solienne identity | Agent details |
| `/api/agents/solienne/works` | GET | Solienne's works | Array of artworks |
| `/api/agents/solienne/latest` | GET | Latest creation | Most recent work |

### Eden Genesis Registry APIs (External)

**Base URL**: `https://eden-genesis-registry.vercel.app/api/v1`

#### Core Agent APIs
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/agents` | GET | List all registered agents | Array of agents |
| `/agents/[id]/works` | GET | Get agent's artworks | Paginated works |
| `/agents/[id]/analyze` | POST | Analyze agent's work | 3-tier analysis |
| `/agents/[id]/curate` | POST | Curate agent's collection | Curation response |
| `/agents/[id]/stats` | GET | Agent statistics | Performance data |

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

## 📝 Request/Response Examples

### Get Agent Works
```javascript
// Request
GET https://eden-genesis-registry.vercel.app/api/v1/agents/solienne/works?limit=10&offset=0

// Response
{
  "agent": {
    "id": "solienne",
    "name": "Solienne",
    "type": "visual_artist"
  },
  "works": [
    {
      "id": "sol-001",
      "title": "Emergence Pattern #1",
      "medium": "Digital",
      "year": 2024,
      "imageUrl": "https://...",
      "metadata": {...}
    }
  ],
  "pagination": {
    "total": 3677,
    "limit": 10,
    "offset": 0
  }
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

## 🛠️ Integration Examples

### JavaScript/TypeScript
```typescript
class EdenRegistryClient {
  private baseUrl = 'https://eden-genesis-registry.vercel.app/api/v1';
  
  async getAgentWorks(agentId: string, limit = 20): Promise<WorksResponse> {
    const response = await fetch(
      `${this.baseUrl}/agents/${agentId}/works?limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Registry error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async startCurationSession(config: CurationConfig): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/curation/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Version': 'v1'
      },
      body: JSON.stringify(config)
    });
    
    return response.json();
  }
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

## 📈 Rate Limits

### Current Limits
- **Public APIs**: 100 requests per minute
- **Authenticated APIs**: 1000 requests per minute
- **Bulk Operations**: 10 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693000000
```

## 🔄 Webhooks (Coming Soon)

### Planned Events
- `agent.work.created` - New artwork added
- `curation.session.completed` - Curation finalized
- `collection.updated` - Collection modified
- `collaboration.invited` - New collaboration request

## 📚 Additional Resources

### Live Services
- **Eden Academy**: https://eden-academy-flame.vercel.app
- **Genesis Registry**: https://eden-genesis-registry.vercel.app
- **Design Critic (CRIT)**: https://design-critic-agent.vercel.app

### Documentation
- **Agent Cheatsheet**: https://eden-academy-flame.vercel.app/admin/docs/agents
- **Architecture Guide**: https://eden-academy-flame.vercel.app/admin/docs/architecture
- **Site Map**: https://eden-academy-flame.vercel.app/admin/docs/sitemap

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

## 📞 Support & Contact

For API support or questions:
- Create an issue in the GitHub repository
- Contact the Eden Academy team
- Check the documentation hub for updates

---

*Last Updated: August 25, 2024*
*API Version: v1*
*Status: Production Ready*