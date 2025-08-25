# ADR-015: Unified Design System Architecture

**Status**: Proposed  
**Date**: 2025-01-25  
**Deciders**: Eden Architecture Team, Design Critic Agent, Architecture Guardian  
**Consulted**: Brand Guidelines, Existing Codebase Audit  
**Informed**: Development Team, Product Team  

## Context

Eden ecosystem has grown to include multiple platforms (Eden Academy, Eden Jobs, Design Critic Agent, Miyomi Dashboard) with fragmented design implementations, creating brand incoherence and poor user experience.

### Current State Issues:
- **Visual Identity Crisis**: 4 different design approaches across platforms
- **Brand Violations**: Gradients and colors violating brutal minimalist aesthetic
- **Component Chaos**: Inconsistent buttons, spacing, typography
- **User Journey Fragmentation**: No unified navigation or authentication
- **Technical Debt**: Each platform rebuilding similar UI components

### Architecture Context:
Following ADR-012's Registry Gateway pattern, the design system must align with Eden's brutal minimalist brand:
- Black/white color scheme only
- Helvetica Neue typography, uppercase headers
- 8px grid system
- Sharp edges (no rounded corners)
- No gradients or color accents (except single accent for CTAs)

## Decision

We will implement a **Progressive Design System Architecture** with:

### 1. Shared Design Token System
Create `@eden/design-tokens` package with CSS custom properties:
```css
:root {
  /* Colors */
  --eden-black: #000000;
  --eden-white: #FFFFFF; 
  --eden-gray-100: #1A1A1A;
  --eden-gray-200: #333333;
  
  /* Typography */
  --eden-font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --eden-letter-spacing: 0.05em;
  
  /* Spacing (8px grid) */
  --eden-space-1: 8px;
  --eden-space-2: 16px;
  --eden-space-3: 24px;
  --eden-space-4: 32px;
}
```

### 2. Component Library Strategy
- **Phase 1**: Extract existing Eden Academy components as canonical source
- **Phase 2**: Create shared `@eden/ui-components` React package
- **Phase 3**: Migrate all platforms to use shared components

### 3. Implementation Priority
1. **Eden Jobs Portal** (immediate gradient violations fix)
2. **Design Critic Agent** (token integration)
3. **Eden Academy** (component extraction)
4. **Agent Dashboards** (Miyomi, etc.)

### 4. Architectural Integration
- Design system respects ADR-012 Gateway pattern
- Components integrate with existing authentication flows
- Feature flags enable progressive rollout
- Maintains cross-platform compatibility

## Consequences

### ✅ Positive
- **Brand Coherence**: Enforces brutal minimalist aesthetic across all platforms
- **Developer Velocity**: Shared components reduce duplication
- **User Experience**: Consistent navigation and interactions
- **Maintenance**: Single source of truth for design changes
- **Scalability**: Foundation for 685+ agent platform growth

### ⚠️ Negative
- **Migration Effort**: Requires updating existing codebases
- **Coordination**: Teams must align on component API changes
- **Initial Velocity**: Short-term slowdown during migration

### ⚡ Risks
- **Brand Drift**: Without governance, platforms may diverge again
- **Technical Debt**: Rushed migration could create inconsistencies
- **User Disruption**: Major UI changes may confuse existing users

## Implementation Plan

### Phase 1: Foundation (Week 1-2)
- Create `@eden/design-tokens` package
- Fix Eden Jobs gradient violations immediately
- Document component API standards

### Phase 2: Component Library (Week 3-4)
- Extract Eden Academy components
- Create `@eden/ui-components` package
- Establish design system governance

### Phase 3: Migration (Week 5-8)
- Migrate Design Critic Agent
- Migrate agent dashboards
- Implement unified navigation

### Phase 4: Governance (Ongoing)
- Weekly design reviews
- Automated visual regression testing
- Component usage monitoring

## Compliance

This ADR supports:
- **ADR-012**: Registry Gateway pattern - components respect service boundaries
- **Brand Guidelines**: Enforces brutal minimalism across all platforms
- **Feature Flag Strategy**: Progressive rollout with rollback capability
- **Domain Consistency**: Maintains Agent/Work/Cohort vocabulary

## Monitoring

Success metrics:
- 100% gradient removal from all platforms
- <2 second page load time maintained
- 0 brand guideline violations in new components
- 95% component reuse across platforms

---

**Next Actions:**
1. Team review and approval of this ADR
2. Create design tokens package
3. Begin Eden Jobs gradient removal
4. Establish component extraction plan