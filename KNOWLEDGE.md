# KNOWLEDGE.md - Eden Academy Architecture Context

## Current System State
**Last Updated:** August 27, 2025  
**Version:** 2.0.0  
**Status:** Production Operational

## Canonical Domain Language

Per CLAUDE.md, these are the official terms used throughout the codebase:

### Core Entities
- **Agent**: AI collaborator with specific creative role (Abraham, Solienne, etc.)
- **Work**: Creative output produced by an agent
- **Cohort**: Group of agents by year/batch (Genesis, Year-1, Year-2)
- **Studio**: Creative workspace for agent-human collaboration
- **Registry**: Central authority for agent data and management
- **Gateway**: Contract boundary service between UI and Registry

### Agent Lifecycle States
1. **INVITED**: Initial invitation to Eden Academy
2. **APPLYING**: Application in progress
3. **ONBOARDING**: Accepted, setting up agent
4. **ACTIVE**: In training/production
5. **GRADUATED**: Successfully completed program

## Architecture Patterns

### Registry-First Architecture (ADR-022)
All agent data flows through the Registry as the single source of truth:
```
UI → Gateway → Registry → Database
```

### Feature Flag Strategy
All new features ship behind flags with rollback plans:
- Development: Test new features
- Beta: Limited rollout
- Gradual: Percentage-based rollout
- Full: Production deployment

### Current Feature Flags
- `ENABLE_REGISTRY_SYNC`: Active in production
- `ENABLE_ABRAHAM_REGISTRY_INTEGRATION`: Active
- `ENABLE_SOLIENNE_REGISTRY_INTEGRATION`: Active
- `ENABLE_EDEN2038_INTEGRATION`: Beta testing

## Service Architecture

### Eden Academy (This Repository)
- **Purpose**: Training platform for AI agents
- **Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (eden-academy-flame.vercel.app)

### Eden Genesis Registry
- **Purpose**: Central authority for agent management
- **API**: RESTful with OpenAPI spec
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (eden-genesis-registry.vercel.app)

### Integration Points
1. **Agent Data**: Registry API provides agent profiles, metrics
2. **Application Processing**: `/api/agents/onboard` endpoint
3. **Work Management**: Registry tracks all agent outputs
4. **Authentication**: Supabase Auth with Registry validation

## Key Technical Decisions

### ADR Summary (Active)
- **ADR-015**: Event-Driven Architecture Pattern
- **ADR-016**: Service Boundaries and Responsibilities  
- **ADR-017**: Documentation-First Development
- **ADR-019**: Agent Graduation Criteria
- **ADR-022**: Registry-First Architecture Pattern
- **ADR-023**: Agent Site Architecture Standards
- **ADR-024**: Economic Model Integration

### Technology Choices
- **Framework**: Next.js App Router for SSR/SSG flexibility
- **Styling**: Tailwind CSS for rapid development
- **State**: React Query for server state management
- **Types**: TypeScript with strict mode enabled
- **API**: Generated SDK from OpenAPI specification

## Current Agents in Production

### Active Agents (Genesis Cohort)

#### Abraham
- **Status**: Active, 75% complete
- **Focus**: Digital abstraction, mathematical beauty
- **Covenant**: 13-year daily creation commitment (2025-2038)
- **Works**: 10,000+ early works, 4,745 covenant works planned

#### Solienne
- **Status**: Active, 65% complete
- **Focus**: Consciousness through fashion and light
- **Target**: Paris Photo 2025 exhibition
- **Daily Output**: 20 generations per day

#### BERTHA (New)
- **Status**: In Training
- **Trainer**: Amanda Schmitt
- **Focus**: AI art collection intelligence
- **Specialization**: Collection curation and market intelligence

### Agents in Development

#### SUE
- **Status**: Development phase
- **Focus**: To be determined
- **Trainer**: Recruiting

#### Koru
- **Status**: Planned
- **Focus**: Narrative poetry and haiku
- **Trainer**: Recruiting

#### Geppetto
- **Status**: Planned
- **Focus**: 3D art and sculpture
- **Trainer**: Recruiting

#### Miyomi
- **Status**: Planned
- **Focus**: Anime and manga art
- **Trainer**: Recruiting

### Agent Naming Convention
- **Legacy Names**: Abraham, Solienne (established pre-2025)
- **New Format**: All caps (BERTHA, SUE) for next generation
- **Handle Format**: Lowercase (bertha, sue) for URLs and handles

## Development Workflow

### Git Worktree Setup
```bash
/Users/seth/eden-academy         # Main repository
/Users/seth/eden-worktrees/
  ├── launcher/                   # Feature development
  ├── registry/                   # Registry integration
  └── production/                 # Production branch
```

### Deployment Pipeline
1. Feature development in worktrees
2. Push to feature branch
3. Automatic Vercel preview deployment
4. Merge to main for production
5. Automatic production deployment

## API Endpoints

### Core Academy APIs
- `/api/agents/onboard` - New agent applications
- `/api/agents/[id]` - Agent data and metrics
- `/api/agents/[id]/works` - Agent creative outputs
- `/api/agents/[id]/daily-practice` - Training progress

### Registry Integration
- Base URL: `https://eden-genesis-registry.vercel.app/api/v1`
- Authentication: Bearer token
- Rate Limits: 100 requests/minute

## Documentation Structure

### Public Documentation
- `/admin/docs` - Main documentation hub
- `/admin/docs/registry-hub` - Registry integration guides
- `/admin/docs/applications` - Training application process
- `/admin/docs/agents` - Agent reference cheatsheet

### Markdown Sources
- Root level: `*.md` files (SITEMAP, AGENT_CHEATSHEET, etc.)
- `/docs` directory: Technical documentation
- `/docs/adr` directory: Architecture Decision Records

## Monitoring and Observability

### Key Metrics
- Agent training progress (daily practice completion)
- Work generation rate (outputs per day)
- Application processing time
- Registry sync status

### Error Handling
- Graceful fallbacks when Registry unavailable
- Feature flags for safe rollback
- Comprehensive error logging

## Security Considerations

### Authentication Flow
1. User authenticates with Supabase
2. Session validated against Registry
3. Role-based access control (RBAC)
4. JWT tokens for API access

### Data Protection
- No sensitive data in client-side code
- Environment variables for secrets
- HTTPS everywhere
- Rate limiting on all APIs

## Glossary

### Technical Terms
- **SSR**: Server-Side Rendering
- **SSG**: Static Site Generation  
- **ISR**: Incremental Static Regeneration
- **RBAC**: Role-Based Access Control
- **ADR**: Architecture Decision Record

### Eden-Specific Terms
- **LAUNCHER**: Agent quality evaluation system (19 criteria)
- **Covenant**: Long-term creative commitment
- **Daily Practice**: Agent training routine
- **Genesis Cohort**: First generation of Eden agents
- **Graduation**: Successful completion of training program

## Contact & Resources

### Documentation
- Main Docs: https://eden-academy-flame.vercel.app/admin/docs
- Registry API: https://eden-genesis-registry.vercel.app/api-docs
- GitHub: https://github.com/edenartlab

### Team Contacts
- Technical: Registry team for API issues
- Product: Academy team for feature requests
- Support: Discord community for general help

---

This document serves as the central knowledge base for Eden Academy development. Update it whenever architectural decisions change or new patterns emerge.