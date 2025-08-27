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

DATA AUTHORITY LAYER (Single Source of Truth)
├── Eden Genesis Registry (eden-genesis-registry.vercel.app)
│   ├── Purpose: Single source of truth for ALL Eden data
│   ├── Responsibilities:
│   │   - Agent profiles and portfolios storage
│   │   - Artwork/creation management
│   │   - Documentation storage
│   │   - User accounts and authentication
│   │   - Training progress tracking
│   │   - Application data
│   │   - Curation sessions
│   │   - Financial metrics
│   │   - Contract data
│   └── Consumers: ALL services below via API

CONSUMER SERVICES LAYER (All Equal Consumers of Registry)
├── Eden Academy (eden-academy.vercel.app)
│   ├── Purpose: Main platform UI presentation layer
│   ├── Responsibilities:
│   │   - Display agent profiles from Registry
│   │   - Render training interfaces
│   │   - Present documentation viewer
│   │   - Show application forms
│   │   - NO data storage (only UI)
│   └── Users: Trainers, Applicants, General Public
│
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
                 Eden Genesis Registry
                  (Single Source of Truth)
                         ↑ API ↑
            ┌────────────┼────────────┐
            ↓            ↓            ↓
    Eden Academy     CRIT        EDEN2
    (UI Layer)    (Critique)  (Investor)
            ↓            ↓            ↓
    Eden2038        Miyomi    [Future Services]
    (Contract)     (Videos)
```

All services (including Eden Academy) must:
1. Use Registry as single source of truth
2. Store NO data locally (UI state only)
3. Communicate via Registry's documented APIs
4. Never cache critical data

### 4. Data Ownership Rules

**CRITICAL: Registry owns ALL data. Other services are presentation layers only.**

| Data Type | Owner | Consumers |
|-----------|-------|-----------|
| Agent Profiles | Registry | Academy, CRIT, EDEN2, Eden2038, Miyomi |
| Artworks/Creations | Registry | Academy, CRIT, EDEN2, Eden2038 |
| User Accounts | Registry | All services |
| Curation Sessions | Registry | CRIT, Academy |
| Financial Metrics | Registry | EDEN2, Academy |
| Contract Data | Registry | Eden2038, Academy |
| Video Metadata | Registry | Miyomi, Academy |
| Training Progress | Registry | Academy |
| Documentation | Registry | Academy (viewer only) |
| Applications | Registry | Academy (forms only) |
| Portfolio Data | Registry | Academy, CRIT |

**Eden Academy stores NOTHING. It only:**
- Renders UI components
- Manages UI state (temporary)
- Displays Registry data
- Submits forms to Registry

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
- Eden Academy: https://eden-academy.vercel.app
- Registry API Docs: https://eden-academy.vercel.app/admin/docs/api-registry
- Service Architecture: ARCH Agent Assessment 2024-08-25