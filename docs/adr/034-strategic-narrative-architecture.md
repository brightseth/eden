# ADR-034: Strategic Narrative Documentation Architecture

## Status
APPROVED

## Context
The CEO has provided an updated strategic narrative for Eden that needs to be integrated into the system. This narrative defines Eden's vision as "The Future of Creative Autonomy" and outlines the transformation from linear human creative hours to exponential creative generation through autonomous AI agents.

The narrative introduces key concepts:
- AI agents as "Spirits" - autonomous economic actors
- Daily ritual economy replacing scarcity with persistence
- Nested token economics ($ABRAHAM, $SOLIENNE within $SPIRIT)
- Three-phase rollout: Proof of Concept → Platform Opening → Cross-Vertical Expansion
- Human-AI creative partnership model

Currently, our documentation lacks a strategic vision layer that bridges high-level mission with tactical implementation.

## Decision
We will implement a three-tier strategic documentation architecture:

1. **Strategic Vision Document** (`/docs/strategic-vision.md`)
   - Canonical source for Eden's strategic narrative
   - API-consumable for integration across interfaces
   - Maintained by CEO with version control

2. **CEO Vision Dashboard** (`/admin/ceo/vision`)
   - Executive interface for strategic narrative management
   - Metrics alignment with strategic goals
   - Internal stakeholder communication

3. **Public About Page Enhancement**
   - Strategic narrative adapted for external stakeholders
   - Appropriate abstraction level for public consumption
   - Maintains brand consistency

## Architecture Pattern
```
Strategic Vision (docs/strategic-vision.md)
    ↓ API consumption
CEO Dashboard (/admin/ceo/vision) ← Executive context
    ↓ Public abstraction  
About Page (/about) ← External stakeholder view
    ↓ Technical implementation
ADRs (/docs/adr/*) ← Tactical decisions
```

## Consequences

### Positive
- **Single Source of Truth**: Eliminates narrative fragmentation
- **Stakeholder Alignment**: Clear vision accessible to all parties
- **Architectural Coherence**: Strategic foundation for technical decisions
- **Dynamic Updates**: CEO can evolve narrative without code changes
- **Multi-Interface Support**: Same content, different contexts

### Negative
- **Maintenance Overhead**: Requires regular strategic updates
- **Abstraction Complexity**: Different stakeholder views need management
- **API Dependencies**: Interfaces depend on strategic content API

### Neutral
- **Documentation Hierarchy**: Vision → Strategy → Tactics becomes explicit
- **Feature Flag Control**: Strategic content deployment requires flags
- **Registry Integration**: Strategic narrative becomes part of Registry API

## Implementation Plan

### Phase 1: Foundation
1. Create `/docs/strategic-vision.md` with full narrative
2. Establish API endpoint for strategic content access
3. Document with ADR-027 for regulatory compliance aspects

### Phase 2: Interfaces
1. Implement CEO vision dashboard at `/admin/ceo/vision`
2. Update public about page with strategic elements
3. Add navigation links to strategic content

### Phase 3: Integration
1. Link ADRs to strategic vision sections
2. Enable Federation pattern for narrative content
3. Implement metrics tracking against strategic goals

## References
- ADR-022: Registry-First Architecture
- ADR-025: Widget System Architecture (for dynamic content)
- Token Economics Documentation (agent-tokens.ts)
- CEO Strategic Narrative (provided 2025-08-31)

## Metrics for Success
- Strategic narrative accessible within 2 clicks from any page
- CEO can update vision without engineering support
- External stakeholders understand Eden's mission clearly
- Technical decisions traceable to strategic rationale