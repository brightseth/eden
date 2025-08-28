# CLAUDE.md – Project Status & Contribution Guide

## Current Status (2025-08-28)

### 🎯 **CITIZEN Social Integration: DEPLOYED & READY**

**Latest Achievement**: Complete social platform integration system for community-first governance coordination

#### What's Live:
- ✅ **Comprehensive Social Integration**: Farcaster, Discord, Twitter connectors ready
- ✅ **30-Day Re-engagement Strategy**: Community-first approach with listening phase
- ✅ **BrightMoments Team Overview**: Clean shareable URL at `/bm-overview`
- ✅ **Community Health Monitoring**: Real-time sentiment tracking with auto-pause
- ✅ **Daily Practice Coordinator**: 28 pieces of scheduled content ready
- ✅ **Snapshot DAO Integration**: Eden.eth governance space connected

**Production URL**: https://eden-academy-flame.vercel.app/bm-overview

### 🚀 **Ready to Deploy Systems**

#### CITIZEN Social Coordination (Awaiting Credentials)
- **Status**: Fully implemented, awaiting social platform credentials
- **Strategy**: 4-phase rollout (Listening → Acknowledgment → Value → Governance)
- **Safety**: Auto-pause triggers, sentiment monitoring, human approval workflows
- **Integration**: Cross-platform coordination with governance proposal broadcasting

#### Public Agent Access System (Live)
- **Status**: ✅ LIVE IN PRODUCTION
- **URL**: https://eden-academy-flame.vercel.app/agents/[slug]
- **Coverage**: All 8 agents accessible with interactive chat
- **Features**: Works galleries, economic metrics, rate limiting

#### MIYOMI Live Trading Interface (Ready)
- **Status**: ✅ COMPLETE & FUNCTIONAL
- **Implementation**: Real-time dashboard with WebSocket streaming
- **Database**: Requires migration `014_miyomi_launch.sql` for production
- **Architecture**: Live P&L calculations with position tracking

### 📊 **System Architecture Status**

#### Registry Integration
- **Pattern**: Registry-first architecture (ADR-022) 
- **Configuration**: Local development on port 3000
- **Status**: Document storage working, graceful fallbacks implemented
- **Migration**: ADR-022 deprecated, moved to Registry docs system

#### Feature Flags & Deployment
- **Social Integration**: `ENABLE_CITIZEN_SOCIAL_INTEGRATION=true`
- **Governance**: `ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=true`  
- **Deployment**: Staged launch system with 5-stage rollout complete
- **Security**: Comprehensive hardening with rate limiting, input validation

#### Database & Storage
- **Supabase**: Academy database with governance tables added
- **Registry**: Local development with production fallbacks
- **Storage**: Agent works, lore data, governance events tracked
- **Schema**: Governance profiles, events, proposal tracking

### 🔄 **Next Session Priorities**

1. **Social Platform Activation** (Waiting for BM team approval)
   - Farcaster credentials via Neynar
   - Discord bot setup with governance channels  
   - Twitter API access for coordination posts
   - Begin 7-day listening phase

2. **Production Deployments**
   - MIYOMI trading interface (migrate database)
   - BERTHA analytics dashboard (production-ready)
   - Apply security hardening to production

3. **Community Engagement**
   - Launch CITIZEN re-engagement campaign
   - Henry & Keith CITIZEN collaboration testing
   - BrightMoments governance coordination

## 🛠️ **Development Guidelines**

### Core Rules
- Obey ADRs; propose changes via new ADR
- Only use the **generated SDK** for network calls
- Keep domain terms consistent: Agent, Work, Cohort (see KNOWLEDGE.md)
- All new features ship behind a flag with rollback plan
- Provide: spec → plan → PR with contract tests

### Architecture Patterns
- **Registry-First**: All data flows through Registry when available
- **Feature Flags**: New functionality controlled via environment flags  
- **Security-First**: Rate limiting, input validation, auth middleware
- **Community-First**: CITIZEN prioritizes authentic engagement over metrics

### Current Tech Stack
- **Frontend**: Next.js 15.4.6 with TypeScript
- **Database**: Supabase with Prisma ORM
- **APIs**: Generated SDK, Registry integration
- **Styling**: Tailwind CSS with Eden Academy design system (black/white Helvetica)
- **AI**: Anthropic Claude for agent intelligence
- **Deployment**: Vercel with feature flag controls

## 📋 **File Organization**

### Key Documentation
- `/docs/CITIZEN_*` - Complete social integration documentation
- `/docs/adr/` - Architectural decision records
- `/docs/registry-integration-guide.md` - Registry patterns and usage

### Implementation Files  
- `/src/lib/agents/citizen-*` - CITIZEN social integration system
- `/src/lib/agents/social-platforms/` - Platform connectors
- `/src/app/api/agents/citizen/social/` - Social coordination API
- `/src/app/bm-overview/` - BrightMoments team shareable page

### Configuration
- `.env.local` - Development environment with all API keys
- `config/flags.ts` - Feature flag definitions
- Registry running locally on port 3000

## 🎨 **Design System**

### Visual Identity
- **Colors**: Black background (`bg-black`), white text (`text-white`)
- **Typography**: Helvetica Neue, bold, all caps for headers
- **Layout**: 8px grid system (`--grid-base: 8px`)
- **Borders**: White borders (`border-white`) throughout
- **Spacing**: Consistent with CSS custom properties

### Component Patterns
- Minimal aesthetic with high contrast
- Clean borders and structured layouts
- Responsive design with mobile-first approach
- Accessibility through proper contrast ratios

## 📚 **Key Documents for Reference**

### Strategic
- **CITIZEN_COMMUNITY_REENGAGEMENT_STRATEGY.md**: 30-day community-first approach
- **CITIZEN_BM_TEAM_OVERVIEW.md**: Executive summary for partnership approval
- **CITIZEN_DAILY_CONTENT_TEMPLATES.md**: Ready-to-deploy content across platforms

### Technical  
- **CITIZEN_SOCIAL_INTEGRATION_SUMMARY.md**: Complete implementation overview
- **CITIZEN_SOCIAL_INTEGRATION_DEPLOYMENT.md**: Setup and deployment guide
- **ADR-026**: CITIZEN-Snapshot integration architecture

### Process
- **CITIZEN_COMMUNITY_HEALTH_MONITORING.md**: Sentiment tracking and adaptation system
- **CITIZEN_SOCIAL_INTEGRATION_DEPLOYMENT.md**: Platform setup instructions

---

## 🤖 **AI Agent Collaboration Notes**

When working on Eden Academy:
1. **Reference KNOWLEDGE.md** for current architecture context
2. **Follow ADRs strictly** - they define system boundaries
3. **Use feature flags** for all new functionality
4. **Maintain domain consistency** - Agent, Work, Cohort terminology
5. **Document architectural decisions** via new ADRs when needed
6. **Test against Registry integration** patterns
7. **Prioritize community needs** over technical complexity

**Current Focus**: CITIZEN social integration represents a new model for AI agents in DAO governance - community-first, value-driven, and genuinely helpful to collective decision-making. The system is ready to serve the BrightMoments community respectfully and effectively.

**Ready for BrightMoments team approval and social credential activation!** 🚀