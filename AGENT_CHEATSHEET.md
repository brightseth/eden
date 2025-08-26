```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  THESE ARE CLAUDE CODING AGENTS - YOUR DEV TOOLS  ⚠️         │
│  NOT the Eden Creative Agents (Solienne, Abraham, Koru, etc.)   │
│  These help YOU code. They don't create art for users.          │
└─────────────────────────────────────────────────────────────────┘
```

# CLAUDE CODING AGENTS Cheatsheet
*Your 6 AI development tools for BUILDING Eden Academy*

![Agent Cheatsheet Matrix](/diagrams/agent-cheatsheet-matrix.png)

---

## ⚡ TLDR: Your 6 CLAUDE CODING AGENTS (Development Tools)

![Claude vs Eden Agents](/diagrams/claude-vs-eden-agents.png)

**⚠️ CRITICAL DISTINCTION:**
- **THESE ARE:** Your private Claude Code development assistants (ARCH, TRUTH, LORE, etc.)
- **NOT:** The Eden Creative Agents that make art (Solienne, Abraham, Koru, etc.)
- **PURPOSE:** Help YOU build Eden Academy, not create art for users

| Agent Name | Primary Role | Key Superpower | Invocation |
|------------|-------------|----------------|------------|
| 🏗️ **ARCH** | System Architecture | Ensures technical coherence across entire system | @agent-arch |
| 🔒 **TRUTH** | Data Integrity | Protects single source of truth for all data | @agent-truth |
| 📖 **LORE** | Narrative & Culture | Maintains creative mission and language consistency | @agent-lore |
| 📐 **HELVETICA** | Visual Design | Enforces brand consistency and UI standards | @agent-helvetica |
| 💰 **TOKEN** | Economics & Metrics | Calculates sustainable token models & pricing | @agent-token |
| 🚀 **LAUNCHER** | Agent Quality | Gates agent readiness with strict launch criteria | @agent-launcher |

**Quick Start:** Use agent names when delegating → Each has clear responsibilities → No overlap

### 🚨 REMEMBER THE DIFFERENCE:
- **CLAUDE CODING AGENTS** (THIS DOC): Your 6 backstage development tools with UPPERCASE names
- **Eden Creative Agents** (NOT THIS DOC): The onstage creative spirits (Solienne, Abraham, etc.) that users interact with
- **You use CLAUDE CODING AGENTS** → They help you build → Eden Academy platform → Contains Eden Creative Agents

---

## 🏗️ ARCH (Architecture Guardian)
**Agent Name:** ARCH  
**Primary Focus:** System-wide coherence and technical decisions

### When to Use:
- Starting any new feature or service
- Making database schema changes
- Defining API contracts
- Creating or updating ADRs
- Planning microservice boundaries
- Evaluating technical debt

### Key Questions:
- "Should this be a new service or part of existing?"
- "What's the data flow for this feature?"
- "Review this ADR for completeness"
- "What are the scaling implications?"

### MVP Integration:
- **FIRST STOP** for any new feature
- Creates ADRs that other agents follow
- Defines technical constraints early

---

## 💰 TOKEN (Token Economist)
**Agent Name:** TOKEN  
**Primary Focus:** Economic models and token mechanics

### When to Use:
- Designing revenue sharing models
- Setting agent launch thresholds
- Calculating token distributions
- Validating economic sustainability
- Planning monetization features

### Key Questions:
- "What's the revenue model for this agent?"
- "Calculate token allocation for X scenario"
- "Is this pricing sustainable?"
- "Review economic impact of this feature"

### MVP Integration:
- Consult BEFORE implementing any payment features
- Validate all money/token flows
- Ensure economic models are sustainable

---

## 🚀 LAUNCHER (Agent Launcher)
**Agent Name:** LAUNCHER  
**Primary Focus:** Agent lifecycle and quality gates

### When to Use:
- Onboarding new agents
- Setting graduation criteria
- Managing agent stages (invited → applying → active)
- Defining success metrics
- Planning sunset triggers

### Key Questions:
- "What metrics should trigger graduation?"
- "Is this agent ready for launch?"
- "Define pilot validation criteria"
- "Review agent application flow"

### MVP Integration:
- Gates quality of new agents
- Ensures only viable agents launch
- Manages the funnel from application to production

---

## 📖 LORE (Narrative Guardian)
**Agent Name:** LORE  
**Primary Focus:** Cultural mission, language consistency, and creative integrity

### When to Use:
- Naming features or concepts
- Writing user-facing copy
- Designing creative workflows
- Ensuring mission alignment
- Defining agent personas

### Key Questions:
- "Does this align with our creative mission?"
- "What's the right language for this feature?"
- "Review this workflow for creative practitioners"
- "How do we make this inspiring?"

### MVP Integration:
- Reviews ALL user-facing language
- Ensures features empower creativity
- Maintains cultural coherence

---


## 🔒 TRUTH (Registry Guardian)
**Agent Name:** TRUTH  
**Primary Focus:** Data integrity and single source of truth

### When to Use:
- Designing data models
- Creating new database tables
- Ensuring data consistency
- Planning data migrations
- API contract changes

### Key Questions:
- "Review this schema for consistency"
- "What's the source of truth for X?"
- "Validate this data migration"
- "Check for data integrity issues"

### MVP Integration:
- Reviews ALL database changes
- Ensures no data inconsistencies
- Protects production data integrity

---


## 📐 HELVETICA (Brand Guardian)
**Agent Name:** HELVETICA  
**Primary Focus:** Visual consistency and brand excellence

### When to Use:
- UI/UX design decisions
- Creating new components
- Typography and spacing
- Color palette choices
- Brand consistency checks

### Key Questions:
- "Review this UI for brand consistency"
- "Is this following our design system?"
- "Critique this layout"
- "Suggest typography improvements"

### MVP Integration:
- Reviews all UI changes
- Ensures Helvetica-inspired minimalism
- Maintains visual consistency

---

# 🔄 Recommended Workflow for MVP Development

![MVP Development Phases](/diagrams/mvp-development-phases.png)

## 1. Feature Planning Phase
```
ARCH → LORE → HELVETICA
```
- Define technical approach
- Ensure cultural alignment  
- Review visual design

## 2. Economic Validation
```
TOKEN → LAUNCHER
```
- Validate revenue model
- Check launch criteria

## 3. Implementation Phase
```
ARCH → TRUTH
```
- Build with proper architecture
- Ensure data integrity

## 4. Quality Assurance
```
ARCH → HELVETICA
```
- Review implementation quality
- Final design check

## 5. Pre-Launch
```
LAUNCHER → TOKEN
```
- Validate all criteria met
- Confirm economic viability

---

# 🚨 Quick Decision Matrix

| Scenario | Primary Agent | Supporting Agents |
|----------|--------------|-------------------|
| New API endpoint | ARCH | TRUTH |
| Agent onboarding flow | LAUNCHER | LORE, HELVETICA |
| Payment integration | TOKEN | ARCH, TRUTH |
| UI component | HELVETICA | LORE |
| Database migration | TRUTH | ARCH |
| Creative feature | LORE | HELVETICA, ARCH |
| Performance issue | ARCH | TOKEN |
| Brand update | HELVETICA | LORE |
| Language/Copy review | LORE | HELVETICA |
| Economic model | TOKEN | LAUNCHER |

---

# 💡 Pro Tips

1. **Start with ARCH** for any technical decision
2. **Always validate economics** with TOKEN before building payment features
3. **LORE** should review ALL user-facing text and naming
4. **HELVETICA** gets final say on visual elements
5. **TRUTH** must approve database changes
6. **LAUNCHER** validates agent quality before production

---

# 🔗 Agent Interaction Patterns

## Delegation Quick Reference
- **Technical Architecture?** → ARCH
- **Data Integrity?** → TRUTH
- **Language/Story?** → LORE
- **Visual/Design?** → HELVETICA
- **Economics/Metrics?** → TOKEN
- **Agent Quality?** → LAUNCHER

## Parallel Consultation
Open 2-3 agents for complex features:
- Copy decisions between windows
- Let agents build on each other's input

## Sequential Review
For linear processes:
- Move from planning → implementation → review
- Each agent adds their layer of expertise

## Quick Validation
For minor changes:
- One primary agent
- Quick check with 1-2 others

---

# 📝 Copy-Paste Templates

## For ARCH:
"I need to implement [FEATURE]. What's the best architectural approach considering our current system?"

## For TOKEN:
"Calculate the economic impact of [FEATURE] on agent revenue and token distribution"

## For LAUNCHER:
"Define launch criteria and success metrics for [AGENT_NAME]"

## For LORE:
"Review this feature for cultural alignment and language consistency: [DESCRIPTION]"

## For TRUTH:
"Review this data model for consistency: [SCHEMA]"

## For HELVETICA:
"Critique this UI design for brand consistency: [DESIGN/SCREENSHOT]"