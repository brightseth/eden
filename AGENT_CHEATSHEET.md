# Eden Academy Claude Agent Cheatsheet
*Your specialized AI team for building Eden ecosystem MVPs*

---

## ⚡ TLDR: Your 8 Claude Code Agents

**These are your Claude Code development assistants (different from Eden Academy agents like Solienne/Abraham):**

| Agent | Primary Role | Key Superpower |
|-------|-------------|----------------|
| 🏗️ **Architecture Guardian** | System design & ADRs | Ensures technical coherence across entire system |
| 💰 **Token Economist** | Revenue & economics | Calculates sustainable token models & pricing |
| 🚀 **Agent Launcher** | Onboarding & quality | Gates agent readiness with strict launch criteria |
| 🎨 **Academy Domain Expert** | Content & culture | Maintains creative mission in all features |
| ⚙️ **Feature Integrator** | Production code | Converts prototypes to deployment-ready code |
| 🔒 **Registry Guardian** | Data integrity | Protects single source of truth for all data |
| 👨‍💻 **Code Reviewer** | Quality assurance | Final defense against bugs & vulnerabilities |
| 🎯 **Design Critic** | Visual excellence | Enforces Helvetica-minimalist brand consistency |

**Quick Start:** Open multiple Claude windows → Give each agent their role → Copy context between them

### 📝 Important Distinction:
- **Claude Code Agents** (this doc): Your 8 specialized AI development assistants for building features
- **Eden Academy Agents** (in Registry): The creative AI agents like Solienne, Abraham, Koru who create art/content

---

## 🏗️ Architecture Guardian
**Window:** Architecture Guardian  
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

## 💰 Token Economist
**Window:** Token Economist  
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

## 🚀 Agent Launcher
**Window:** Agent Launcher  
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

## 🎨 Academy Domain Expert
**Window:** Academy Domain Expert  
**Primary Focus:** Cultural mission and creative integrity

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

## ⚙️ Feature Integrator
**Window:** Feature Integrator  
**Primary Focus:** Production-ready implementation

### When to Use:
- Converting prototypes to production
- Integrating with existing systems
- Setting up CI/CD pipelines
- Implementing feature flags
- Database migrations

### Key Questions:
- "Convert this prototype to production code"
- "How do I integrate with the Registry?"
- "Set up feature flag for X"
- "Review this migration script"

### MVP Integration:
- Takes approved designs to production
- Ensures proper integration patterns
- Handles technical implementation details

---

## 🔒 Registry Guardian
**Window:** Registry Guardian  
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

## 👨‍💻 Code Reviewer
**Window:** Code Reviewer  
**Primary Focus:** Code quality and best practices

### When to Use:
- Before any PR/commit
- After implementing features
- Refactoring existing code
- Security reviews
- Performance optimization

### Key Questions:
- "Review this code for best practices"
- "Find security vulnerabilities"
- "Suggest performance improvements"
- "Is this following our patterns?"

### MVP Integration:
- Final check before deployment
- Catches bugs and vulnerabilities
- Ensures code maintainability

---

## 🎯 Design Critic
**Window:** Design Critic  
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

## 1. Feature Planning Phase
```
Architecture Guardian → Academy Domain Expert → Design Critic
```
- Define technical approach
- Ensure cultural alignment  
- Review visual design

## 2. Economic Validation
```
Token Economist → Agent Launcher
```
- Validate revenue model
- Check launch criteria

## 3. Implementation Phase
```
Feature Integrator → Registry Guardian
```
- Build the feature
- Ensure data integrity

## 4. Quality Assurance
```
Code Reviewer → Design Critic
```
- Review code quality
- Final design check

## 5. Pre-Launch
```
Agent Launcher → Token Economist
```
- Validate all criteria met
- Confirm economic viability

---

# 🚨 Quick Decision Matrix

| Scenario | Primary Agent | Supporting Agents |
|----------|--------------|-------------------|
| New API endpoint | Architecture Guardian | Registry Guardian, Code Reviewer |
| Agent onboarding flow | Agent Launcher | Academy Domain Expert, Design Critic |
| Payment integration | Token Economist | Feature Integrator, Registry Guardian |
| UI component | Design Critic | Academy Domain Expert, Code Reviewer |
| Database migration | Registry Guardian | Architecture Guardian, Feature Integrator |
| Creative feature | Academy Domain Expert | Design Critic, Architecture Guardian |
| Performance issue | Code Reviewer | Architecture Guardian, Feature Integrator |
| Brand update | Design Critic | Academy Domain Expert |

---

# 💡 Pro Tips

1. **Start with Architecture Guardian** for any technical decision
2. **Always validate economics** with Token Economist before building payment features
3. **Academy Domain Expert** should review ALL user-facing text
4. **Design Critic** gets final say on visual elements
5. **Registry Guardian** must approve database changes
6. **Code Reviewer** is your last line of defense before production

---

# 🔗 Agent Interaction Patterns

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

## For Architecture Guardian:
"I need to implement [FEATURE]. What's the best architectural approach considering our current system?"

## For Token Economist:
"Calculate the economic impact of [FEATURE] on agent revenue and token distribution"

## For Agent Launcher:
"Define launch criteria and success metrics for [AGENT_NAME]"

## For Academy Domain Expert:
"Review this feature for cultural alignment: [DESCRIPTION]"

## For Feature Integrator:
"Convert this design to production code: [REQUIREMENTS]"

## For Registry Guardian:
"Review this data model for consistency: [SCHEMA]"

## For Code Reviewer:
"Review this code for best practices and security: [CODE/FILE]"

## For Design Critic:
"Critique this UI design for brand consistency: [DESIGN/SCREENSHOT]"