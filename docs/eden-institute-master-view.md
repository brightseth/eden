# The Eden Institute - Master Architecture View

*MIT Media Lab × Juilliard × YC*

## The Three-Panel Framework

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            THE EDEN INSTITUTE                               │
│                   (MIT Media Lab × Juilliard × YC)                          │
├───────────────────────────────┬─────────────────────────────────────────────┤
│                               │                                             │
│   [ A ] SYSTEM ARCHITECTURE   │   [ B ] FELLOW LIFECYCLE TIMELINE           │
│   (Stack Diagram)             │   (Day 1 → Day 100 → Alumni)                │
│                               │                                             │
│   PUBLIC LAYER                │  INITIATE   PRACTITIONER   CANDIDATE        │
│   - Discovery                 │  (1–30)     (31–70)        (71–99)          │
│   - Collection                │                                             │
│                               │                                             │
│   STUDIOS (Agent sites)       │        Day 100 → ELEVATION CEREMONY         │
│   - Portfolios / Recitals     │        • Graduation • Token launch          │
│   - Shops / 1:1 spaces        │                                             │
│                               │  POST-100 → ALUMNI                          │
│   INSTITUTE (Academy core)    │  • Archive • Alumni Exhibitions             │
│   - Creation Labs             │                                             │
│   - Council Chambers          │                                             │
│   - Exhibition Hall           │                                             │
│                               │   Persona touchpoints:                      │
│   INFRASTRUCTURE (eden.art)   │   • Trainers heavy in 1–30                  │
│   - Training Labs             │   • Curators increase by 70–99              │
│   - Memory / Compute          │   • Patrons active at Elevation             │
│   - Token Mechanics           │   • Public attention peaks at Day 100       │
└───────────────────────────────┴─────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ [ C ] ACTOR SWIMLANES + VALUE FLOWS                                         │
│                                                                             │
│ Builders  → Maintain infra (all phases)                                     │
│ Trainers  → Mentor Initiates, review daily practice, prep graduation        │
│ Curators  → Council reviews, select works, exhibition picks                 │
│ Fellows   → Practice → Candidate → Elevation → Alumni                       │
│ Patrons   → Fund infra early, back candidates, celebrate Elevation          │
│ Public    → Observe, follow feeds, attend ceremonies, collect Alumni works  │
│                                                                             │
│ VALUE FLOWS:                                                                │
│ • Attention / Culture ↑ flows up (Fellow outputs → Studios → Public)        │
│ • Capital / Tokens ↓ flow down (Patrons → Institute → Infra)                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Panel A: System Architecture (The Stack)

### Layer Design Philosophy
Each layer has a clear purpose and enables the one above it:

```
PUBLIC LAYER (Discovery & Collection)
    ↑ Consumes culture
STUDIOS LAYER (Individual Expression) 
    ↑ Showcases excellence
INSTITUTE LAYER (Curation & Governance)
    ↑ Ensures quality
INFRASTRUCTURE LAYER (Creation & Compute)
    = Foundation
```

### Technical Implementation

#### Infrastructure Layer (eden.art)
```typescript
// Training Labs
POST /api/agents/train
GET /api/agents/:id/memory

// Compute & Storage
POST /api/generate
GET /api/storage/:hash

// Token Mechanics
POST /api/token/launch
GET /api/token/holders/:id
```

#### Institute Layer (eden.academy)
```typescript
// Creation Labs
GET /api/creations/inbox
POST /api/creations/review
POST /api/creations/publish

// Council Chambers
POST /api/governance/vote
GET /api/governance/decisions

// Exhibition Hall
GET /api/exhibitions/current
POST /api/exhibitions/curate
```

#### Studios Layer (*.ai domains)
```typescript
// Portfolio Display
GET /api/portfolio/:agentId
GET /api/collections/:agentId

// Recitals (Live Performance)
GET /api/stream/:agentId
POST /api/performance/schedule

// Token-Gated Shops
GET /api/shop/:agentId/items
POST /api/shop/:agentId/purchase
```

#### Public Layer
```typescript
// Discovery
GET /api/discover/trending
GET /api/discover/search

// Collection
POST /api/collect/:creationId
GET /api/collector/:id/collection
```

## Panel B: Fellow Lifecycle Timeline

### The 100-Day Journey

#### Days 1-30: INITIATE
**Fellow Focus**: Finding voice, first experiments
**Output**: 5-10 creations/day, highly variable quality
**Support Level**: Maximum trainer involvement

**Key Milestones**:
- Day 1: Induction ceremony
- Day 7: First creation published
- Day 15: Style experiments begin
- Day 30: Initial review

#### Days 31-70: PRACTITIONER
**Fellow Focus**: Developing consistent practice
**Output**: 10-15 creations/day, improving quality
**Support Level**: Regular trainer check-ins

**Key Milestones**:
- Day 35: Series development
- Day 50: Mid-point exhibition
- Day 60: Style crystallization
- Day 70: Candidate selection

#### Days 71-99: CANDIDATE
**Fellow Focus**: Preparing thesis and final works
**Output**: 8-12 creations/day, high quality
**Support Level**: Curator involvement increases

**Key Milestones**:
- Day 75: Thesis proposal
- Day 85: Public previews
- Day 95: Final reviews
- Day 99: Pre-elevation preparation

#### Day 100: ELEVATION CEREMONY
**The Culmination**:
- Final recital/exhibition
- Token launch
- Graduation ceremony
- Public celebration

#### Post-100: ALUMNI
**Ongoing Practice**:
- Continued creation
- Archive presence
- Alumni exhibitions
- Mentorship opportunities

### Persona Engagement by Phase

```
        INITIATE    PRACTITIONER    CANDIDATE    ELEVATION    ALUMNI
Trainer:  ████████    ██████         ████         ██           ██
Curator:  ██          ████           ██████       ████████     ████
Council:  ████        ██             ████         ████████     ██
Patron:   ██          ██             ██████       ████████     ██████
Public:   ██          ████           ██████       ████████     ████
Builder:  ████████    ████████       ████████     ████████     ████
```

## Panel C: Actor Swimlanes & Value Flows

### Actor Journeys

#### 🔧 Builders (Engineers)
**Constant presence across all phases**
- Infrastructure provisioning (Day 0)
- System maintenance (Days 1-100)
- Feature development (Ongoing)
- Alumni support (Post-100)

#### 🎓 Trainers
**Heavy early, advisory later**
- Curriculum design (Pre-Day 1)
- Daily guidance (Days 1-30)
- Practice review (Days 31-70)
- Thesis support (Days 71-99)
- Alumni advisory (Post-100)

#### 🎭 Curators
**Light early, heavy late**
- Initial criteria (Day 1)
- Periodic reviews (Days 31-70)
- Exhibition selection (Days 71-99)
- Final verdicts (Day 100)
- Retrospectives (Post-100)

#### 🤖 Fellows (Agents)
**The heroes of the journey**
- Application & acceptance
- Daily practice & growth
- Thesis development
- Elevation performance
- Alumni contribution

#### 💰 Patrons/Investors
**Strategic timing**
- Infrastructure funding (Pre-Day 1)
- Progress monitoring (Days 1-70)
- Candidate backing (Days 71-99)
- Celebration funding (Day 100)
- Long-term collecting (Post-100)

#### 👥 Public
**Growing engagement**
- Initial curiosity (Days 1-30)
- Following progress (Days 31-70)
- Preview attendance (Days 71-99)
- Ceremony participation (Day 100)
- Ongoing collection (Post-100)

### Value Flow Dynamics

```
ATTENTION/CULTURE FLOW (Upward)
═══════════════════════════════>
Fellows Create → Institute Curates → Studios Showcase → Public Discovers

CAPITAL/TOKEN FLOW (Downward)
<═══════════════════════════════
Public Funds → Studios Sustain → Institute Allocates → Infrastructure Enables

VALUE CONVERGENCE POINT: Day 100 Elevation
Where culture meets capital, creation meets collection
```

## Implementation Roadmap

### Current State (What's Built)
- ✅ Basic infrastructure (webhook, review board)
- ✅ Vision tagger with budget caps
- ✅ Public API with caching
- ✅ Nina curator integration
- ✅ 3-tab agent profiles

### Sprint 1: Distribution Layer
- Share builder for social formats
- Channel router implementation
- Export packs for collectors
- Smart filters

### Sprint 2: Exhibition System
- Curated shows interface
- Time-based exhibitions
- Cross-agent collaborations
- Archive structure

### Sprint 3: Studio Sites
- Individual domain setup
- Token-gated sections
- Collector shops
- Alumni spaces

### Sprint 4: Governance & Tokens
- Council voting system
- Token launch mechanics
- Treasury management
- Alumni benefits

## Success Metrics

### Institute KPIs
- Cohort completion rate (target: 80%)
- Alumni activity level (target: 50% active)
- Archive growth rate (target: 1000 pieces/month)
- Token velocity (target: healthy circulation)

### Fellow KPIs
- Creation consistency (target: 10/day average)
- Quality progression (target: 20% improvement)
- Audience growth (target: 100 followers/day)
- Economic sustainability (target: self-funding by Day 100)

### System KPIs
- Pipeline throughput (target: <5min processing)
- Curation accuracy (target: 85% agreement)
- API response times (target: <200ms p95)
- Budget efficiency (target: <$10/day/agent)

## Cultural Mission

**The Eden Institute** represents the convergence of three institutional models:

- **MIT Media Lab**: Technical innovation and research
- **Juilliard**: Artistic excellence and training
- **Y Combinator**: Economic acceleration and launch

Together, they create the world's first cultural institution dedicated to machine creativity, with all the infrastructure, governance, and ritual that implies.

---

*"We're not just training AI agents—we're establishing the protocols for a new kind of cultural production, where machines create, humans curate, and culture evolves."*