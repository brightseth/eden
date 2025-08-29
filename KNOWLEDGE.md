# KNOWLEDGE.md - Eden Academy Architecture Context

## Current System State
**Last Updated:** August 28, 2025  
**Version:** 2.1.0  
**Status:** Production Operational with Recent Consolidations

## Recent Major Changes (2025-08-28)

### ✅ Amanda → Bertha Agent Consolidation (CRITICAL)
**Impact**: Resolved production-blocking dual identity issue
- **Registry Cleanup**: Removed all amanda-006 duplicate entries
- **Route Consolidation**: `/academy/agent/amanda` → redirects to `/academy/agent/bertha`
- **Data Integrity**: Single bertha-006 identity with Amanda Schmitt as trainer
- **Architecture Compliance**: Restored Registry-First principles (ADR-022)

### ✅ Domain Architecture Updates
**Impact**: Corrected external agent domains for consistency
- **SOLIENNE**: `solienne.eden2.io` (canonical domain)
- **KORU**: `koru.poetry` → `koru.social`
- **Social Profiles**: Updated manifest to reflect correct external websites

### ✅ ADR Migration to Registry
**Impact**: Documentation consolidation per Registry-First architecture
- **ADR-022**: Deprecated local copy, now hosted in Registry docs
- **New Pattern**: `/api/v1/docs/adr/` endpoint for architecture documentation
- **Migration Date**: 2025-08-28

## Canonical Domain Language

Per CLAUDE.md, these are the official terms used throughout the codebase:

### Core Entities
- **Agent**: AI collaborator with specific creative role (Abraham, Solienne, Bertha, etc.)
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
**Status**: Restored to compliance after Amanda→Bertha consolidation
All agent data flows through the Registry as the single source of truth:
```
UI → Gateway → Registry → Database
```

**Key Principle**: No static data mappings that bypass Registry authority

### Feature Flag Strategy
All new features ship behind flags with rollback plans:
- **Development**: Test new features
- **Beta**: Limited rollout
- **Gradual**: Percentage-based rollout  
- **Full**: Production deployment

### Current Feature Flags (Active)
- `ENABLE_REGISTRY_SYNC`: Active in production
- `ENABLE_ABRAHAM_REGISTRY_INTEGRATION`: Active
- `ENABLE_SOLIENNE_REGISTRY_INTEGRATION`: Active
- `ENABLE_BERTHA_REGISTRY_INTEGRATION`: Active (consolidated from Amanda)
- `ENABLE_CITIZEN_SOCIAL_INTEGRATION`: Ready for deployment
- `ENABLE_MIYOMI_LIVE_TRADING`: Ready for deployment
- `ENABLE_STAGED_LAUNCH_SYSTEM`: Production-ready

## Service Architecture

### Current Production Domains

#### Main Services
- **Eden Academy**: `academy.eden2.io` (primary platform)
- **Genesis Registry**: `registry.eden2.io` (data authority)
- **Spirit Registry**: `spirit-registry.vercel.app` (blockchain verification)

#### Agent Sovereign Sites
- **SOLIENNE**: `solienne.ai` ✅ (updated 2025-08-28)
- **ABRAHAM**: `abraham.ai`
- **KORU**: `koru.social` ✅ (updated 2025-08-28)
- **SUE**: `design-critic-agent.vercel.app`

#### Backend Services
- **Eden2038**: `eden2038.vercel.app` (Abraham's covenant)
- **Henry Registry**: `registry-i42t8muxt-henry-personal.vercel.app`

### Data Flow Patterns

**Registry → Services → UI**:
1. Genesis Registry stores canonical data
2. Services consume via `/api/v1/*` endpoints
3. UIs render from service responses
4. No direct registry access from UIs

**Agent Integration Flow**:
1. Agent registration via Registry API
2. Profile data synced to Academy
3. Sovereign sites pull agent data
4. Training updates flow back to Registry

## Current Genesis Cohort Status

### Active Agents (8 Total)
1. **ABRAHAM** - Digital abstraction pioneer (75% complete, Gene Kogan)
2. **SOLIENNE** - Living narrative architect (65% complete, Kristi Coronado)  
3. **BERTHA** - Art collection intelligence (87% prediction accuracy, Amanda Schmitt)
4. **MIYOMI** - Contrarian market oracle (Seth Goldstein)
5. **GEPPETTO** - 3D digital sculptor (Martin & Colin/Lattice)
6. **KORU** - Narrative poet & cultural bridge-builder (Xander)
7. **CITIZEN** - DAO manager & governance coordinator (Henry/BrightMoments)
8. **SUE** - Design critic & aesthetic curator (TBD - seeking partner)

### Agent Status Distribution
- **Confirmed Trainers**: 5 (Abraham, Solienne, Bertha, Miyomi, Geppetto, Koru, Citizen)
- **Seeking Partners**: 1 (SUE)
- **Launch Ready**: 3 (Abraham, Solienne, CITIZEN awaiting social credentials)

## Technical Implementation Status

### Deployment-Ready Systems
- ✅ **Public Agent Access**: All 8 agents with interactive chat
- ✅ **Security Hardening**: Rate limiting, input validation, auth middleware  
- ✅ **Staged Launch Framework**: 5-stage rollout with automated validation
- 🚀 **CITIZEN Social Integration**: Complete, awaiting credentials
- 🚀 **MIYOMI Live Trading**: Complete, needs DB migration
- 🚀 **BERTHA Advanced Analytics**: Production-ready dashboard

### Architecture Compliance
- ✅ **Registry-First**: Restored after Amanda consolidation
- ✅ **Single Source of Truth**: Genesis Registry authoritative  
- ✅ **Data Integrity**: No duplicate agent identities
- ✅ **Feature Flags**: All new features controlled
- ✅ **Domain Consistency**: Canonical terminology throughout

## Database Schema

### Core Tables (Supabase)
- `agents` - Agent profiles and metadata
- `works` - Creative outputs and portfolios
- `training_sessions` - Learning progress tracking
- `governance_events` - DAO coordination (CITIZEN)
- `social_posts` - Cross-platform content (CITIZEN)

### Registry Integration
- Local Registry on port 3000 (development)
- Production Registry at `registry.eden2.io`
- Graceful fallbacks for Registry unavailability

## Security & Performance

### Security Features (Production-Ready)
- **Authentication**: JWT validation with role-based access
- **Rate Limiting**: Per-endpoint controls (10/min chat, 50/min admin)
- **Input Validation**: XSS/injection protection with DOMPurify
- **Headers**: CSP, CORS, HSTS protection

### Performance Optimizations
- **Caching**: Registry responses cached locally
- **WebSockets**: Real-time updates for MIYOMI trading
- **Static Generation**: Agent profiles pre-rendered
- **CDN**: Vercel edge deployment

## Testing & Quality Assurance

### Test Coverage
- **Unit Tests**: Core business logic
- **Integration Tests**: Registry API interactions  
- **E2E Tests**: Agent workflows and public access
- **Contract Tests**: Gateway API boundaries

### Quality Gates
- **Lint/Format**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Security**: OWASP compliance checks
- **Performance**: Core Web Vitals monitoring

## Monitoring & Observability

### Health Checks
- `/health` - Service availability
- Registry connectivity monitoring
- Agent response time tracking
- Error rate alerting

### Metrics
- Agent interaction volumes
- Training progress indicators  
- Public access usage patterns
- Registry sync health

---

## Next Development Priorities

1. **Social Platform Activation** (CITIZEN credentials needed)
2. **Production Deployments** (MIYOMI, BERTHA, security hardening)
3. **Agent Graduation** (Abraham, Solienne readiness assessment)
4. **Community Expansion** (new trainer recruitment for SUE)

**Architecture Status**: ✅ **PRODUCTION-READY**  
All critical issues resolved, Registry-First compliance restored, comprehensive feature deployment framework operational.