# ADR-016: Service Boundary Definition and Microservice Architecture

## Status
Accepted

## Context
Eden ecosystem has grown organically to include multiple services with overlapping responsibilities and unclear boundaries. We have:
- Main platform (Eden Academy)
- Data layer (Eden Genesis Registry)
- Multiple specialized microservices (CRIT, EDEN2, Eden2038, Miyomi Dashboard)
- Confusion between Claude Coding Agents (dev tools) and Eden Spirits/Agents (creative AIs)

This leads to:
- Duplicate data flows
- Inconsistent user experiences
- Developer confusion about which service handles what
- Unclear distinction between development tools and production features

## Decision

### 1. Service Hierarchy and Responsibilities

```
┌─────────────────────────────────────────────────────────────────┐
│                    EDEN ECOSYSTEM ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────┘

PRIMARY PLATFORM LAYER
├── Eden Academy (eden-academy-flame.vercel.app)
│   ├── Purpose: Main platform UI and trainer interfaces
│   ├── Responsibilities:
│   │   - Agent profiles and portfolios
│   │   - Training interfaces for humans
│   │   - Documentation hub (/admin/docs)
│   │   - Application processing
│   └── Users: Trainers, Applicants, General Public

DATA AUTHORITY LAYER
├── Eden Genesis Registry (eden-genesis-registry.vercel.app)
│   ├── Purpose: Single source of truth for all Eden data
│   ├── Responsibilities:
│   │   - Agent data management
│   │   - Artwork/creation storage
│   │   - Curation APIs
│   │   - Authentication/authorization
│   └── Consumers: All other services via API

SPECIALIZED MICROSERVICES LAYER
├── CRIT - Design Critic Agent (design-critic-agent.vercel.app)
│   ├── Purpose: Professional art critique interface
│   ├── Responsibilities:
│   │   - Multi-curator personas (Nina, Marcus, Elena, etc.)
│   │   - Venue-specific analysis
│   │   - Critique generation
│   └── Users: Curators, Gallery Directors
│
├── EDEN2 (eden2.vercel.app)
│   ├── Purpose: Investor dashboard and analytics
│   ├── Responsibilities:
│   │   - Financial metrics visualization
│   │   - Token economics tracking
│   │   - Investment portfolio management
│   │   - ROI analytics
│   └── Users: Investors, Token Holders
│
├── Eden2038 (eden2038.vercel.app)
│   ├── Purpose: Abraham's 13-year contract visualization
│   ├── Responsibilities:
│   │   - Contract timeline display
│   │   - Abraham-specific metrics
│   │   - Long-term commitment tracking
│   │   - Covenant status monitoring
│   └── Users: Abraham stakeholders, Public
│
└── Miyomi Dashboard (miyomi.vercel.app)
    ├── Purpose: Daily video generation dashboard
    ├── Responsibilities:
    │   - Daily content generation tracking
    │   - Video creation pipeline monitoring
    │   - Content calendar management
    │   - Performance analytics
    └── Users: Content Managers, Miyomi Trainers
```

### 2. Clear Terminology Distinction

**CLAUDE CODING AGENTS (Development Tools)**
- Definition: AI assistants that help developers build the Eden platform
- Names: ARCH, TRUTH, LORE, HELVETICA, TOKEN, LAUNCHER
- Purpose: Code generation, architecture decisions, documentation
- Users: Developers only
- Visibility: Backend/development environment only

**EDEN SPIRITS/AGENTS (Creative AIs)**
- Definition: AI entities that create art and content for end users
- Names: Solienne, Abraham, Koru, Eve, etc.
- Purpose: Art creation, creative expression, user interaction
- Users: Public, collectors, curators
- Visibility: Frontend/production environment

### 3. Service Communication Patterns

```
User Request → Microservice → Registry API → Data Response
                    ↓
              Eden Academy
                    ↓
            (Optional Auth)
```

All services must:
1. Use Registry as single source of truth
2. Never duplicate data storage
3. Communicate via documented APIs
4. Respect service boundaries

### 4. Data Ownership Rules

| Data Type | Owner Service | Consumers |
|-----------|--------------|-----------|
| Agent Profiles | Registry | All services |
| Artworks/Creations | Registry | All services |
| User Accounts | Registry | All services |
| Curation Sessions | Registry | CRIT, Academy |
| Financial Metrics | Registry | EDEN2 |
| Contract Data | Registry | Eden2038 |
| Video Metadata | Registry | Miyomi Dashboard |
| Training Progress | Academy | Registry (sync) |
| Documentation | Academy | Internal only |

## Consequences

### Positive
- Clear service responsibilities eliminate confusion
- No duplicate data storage or APIs
- Easier to onboard new developers
- Clear distinction between dev tools and production features
- Scalable architecture for new microservices

### Negative
- Requires refactoring existing duplicate endpoints
- All services now depend on Registry availability
- Additional network hops for some operations

### Neutral
- Microservices remain independent but coordinated
- Each service maintains its own deployment pipeline
- Feature flags control service integration

## Implementation Plan

1. **Phase 1**: Document all existing APIs and data flows
2. **Phase 2**: Identify and remove duplicate endpoints
3. **Phase 3**: Standardize Registry integration across all services
4. **Phase 4**: Update all documentation to reflect new boundaries
5. **Phase 5**: Implement service health monitoring

## Related ADRs
- ADR-017: Documentation Hierarchy
- ADR-018: Worktree-Agent Alignment
- ADR-019: Registry Integration Pattern

## References
- Eden Academy: https://eden-academy-flame.vercel.app
- Registry API Docs: https://eden-academy-flame.vercel.app/admin/docs/api-registry
- Service Architecture: ARCH Agent Assessment 2024-08-25