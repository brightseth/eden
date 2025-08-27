# ADR-025: Agent Profile Widget System

## Status
Proposed

## Context

Eden Academy currently lacks a standardized system for agent profile pages, leading to architectural inconsistency and maintenance challenges. The current state includes:

### Problems Identified:
1. **Architectural Drift**: BERTHA's profile page contains 498 lines of hardcoded content, violating Registry-First principles (ADR-022)
2. **Inconsistent Data Sources**: Mixed usage of Registry APIs and static content across different agent pages  
3. **Navigation Inconsistency**: Some pages have navigation headers while others don't
4. **Content Duplication**: Similar sections (Mission, Daily Practice, Training) implemented differently across agents
5. **Maintenance Burden**: Each agent requires custom page development instead of configuration

### Current Agent Profile Landscape:
- **Abraham**: Registry-integrated with complex covenant/timeline pages
- **Solienne**: Registry-integrated with generations/paris-photo pages  
- **BERTHA**: Hardcoded 498-line page with custom content
- **Other Agents**: Basic Registry integration with minimal customization

### User Request:
The need for "a standard set of options/views/widgets/etc for the academy profile pages that are driven by the registry almost like our own version of wix or squarespace but specifically for our agents."

## Decision

We will implement a **Registry-Driven Widget System** for agent profile pages that provides website builder-like flexibility while maintaining architectural consistency.

### 1. Core Architecture Pattern

```
Registry (Profile Config) → Academy API (Widget Assembly) → Agent Profile (Rendered Widgets)
```

This maintains consistency with ADR-022 Registry-First Architecture while enabling flexible content presentation.

### 2. Widget-Based Profile System

#### Profile Configuration Model (Registry Extension)
```typescript
interface AgentProfileConfig {
  agentId: string;
  layout: ProfileLayout;
  widgets: ProfileWidget[];
  navigation: NavigationConfig;
  theme: ThemeConfig;
  metadata: ProfileMetadata;
}

interface ProfileWidget {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  config: WidgetConfig;
  visibility: WidgetVisibility;
  featureFlag?: string;
}

type WidgetType = 
  | 'hero'
  | 'mission' 
  | 'daily-practice'
  | 'training-status'
  | 'metrics'
  | 'works-gallery'
  | 'countdown'
  | 'trainer-info'
  | 'social-links'
  | 'custom-content';
```

#### Standard Widget Library
```typescript
export const STANDARD_WIDGETS = {
  hero: HeroWidget,              // Agent name, status, trainer, actions
  mission: MissionWidget,        // Agent purpose and specialization
  dailyPractice: DailyPracticeWidget,  // Output tracking and metrics
  trainingStatus: TrainingStatusWidget, // Progress through lifecycle phases
  metrics: MetricsWidget,        // Revenue, retention, efficiency metrics
  worksGallery: WorksGalleryWidget,    // Recent works display
  countdown: CountdownWidget,    // Launch or event countdowns
  trainerInfo: TrainerInfoWidget,      // Trainer profile and methodology
  socialLinks: SocialLinksWidget,      // Social media and external links
  customContent: CustomContentWidget,  // Agent-specific content
} as const;
```

### 3. Implementation Structure

#### File Organization
```
src/
├── components/
│   └── agent-profile/
│       ├── widgets/           # Reusable widget components
│       ├── layouts/           # Layout templates
│       └── ProfileRenderer.tsx # Main rendering engine
├── app/
│   └── academy/
│       └── agent/
│           └── [agent]/       
│               └── page.tsx   # Universal profile page
└── lib/
    └── profile/
        ├── widget-registry.ts # Widget catalog and loading
        ├── profile-config.ts  # Configuration management
        └── layout-engine.ts   # Layout rendering logic
```

#### Universal Profile Page Pattern
```typescript
// /src/app/academy/agent/[agent]/page.tsx
export default async function AgentProfilePage({ params }: { params: { agent: string } }) {
  // Registry-first data fetching
  const agent = await agentService.getAgent(params.agent);
  
  if (!agent) {
    notFound();
  }

  // Fetch profile configuration from Registry
  const profileConfig = await getAgentProfileConfig(params.agent);
  
  return (
    <ProfileRenderer 
      agent={agent}
      config={profileConfig}
    />
  );
}
```

### 4. Agent Lifecycle Integration

The widget system directly supports our agent lifecycle phases:

#### INVITED → APPLYING:
- Basic profile widgets (hero, mission, trainer info)
- Training countdown widget
- Application status widget

#### APPLYING → ONBOARDING:
- Add pilot revenue widget
- Enable community engagement widgets  
- Launch gate validation dashboard

#### ONBOARDING → ACTIVE:
- Full widget library access
- Daily practice widgets go live
- Revenue sharing widgets activate

#### ACTIVE → GRADUATED:
- Performance history widgets
- Alumni status indicators
- Success metrics widgets

### 5. Configuration Examples

#### BERTHA Profile Configuration (Migration Target)
```typescript
const BERTHA_PROFILE_CONFIG: AgentProfileConfig = {
  agentId: 'bertha',
  layout: { type: 'standard', maxWidth: '6xl', spacing: 'large' },
  widgets: [
    {
      id: 'hero',
      type: 'hero', 
      position: { section: 'header', order: 1 },
      config: {
        showStatus: true,
        showTrainer: true,
        primaryAction: { text: 'TRAINER INTERVIEW', href: '/sites/bertha/interview' },
        secondaryActions: [
          { text: 'VIEW TRAINING DATA', href: '/admin/bertha-training' },
          { text: 'VIEW STUDIO →', href: '/sites/amanda' }
        ]
      }
    },
    {
      id: 'mission',
      type: 'mission',
      position: { section: 'main', order: 1 },
      config: {
        title: 'MISSION',
        content: 'registry:profile.mission', // Reference Registry data
        layout: 'two-column'
      }
    }
    // Additional widgets...
  ]
};
```

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
1. Create widget system foundation
2. Implement ProfileRenderer and WidgetRenderer  
3. Build standard widget components
4. Add feature flag: `ENABLE_WIDGET_PROFILE_SYSTEM`

### Phase 2: BERTHA Migration (Week 2)
1. Extract BERTHA's content into Registry profile configuration
2. Replace hardcoded page with ProfileRenderer
3. Ensure feature parity with current implementation
4. Test with feature flag enabled

### Phase 3: Other Agents (Week 3-4)
1. Migrate Abraham, Solienne, and other agent pages
2. Standardize navigation patterns
3. Consolidate duplicate components
4. Full feature flag rollout

### Phase 4: Enhancement (Week 5+)
1. Add admin interface for profile configuration
2. Implement A/B testing for widget layouts
3. Add analytics tracking for widget performance
4. Create agent-specific custom widgets

## Benefits

### Registry Compliance
- ✅ Maintains ADR-022 Registry-First Architecture
- ✅ All content sourced from Registry with fallbacks
- ✅ Single source of truth for agent data

### Developer Experience
- ✅ Unified development patterns
- ✅ Reusable component library
- ✅ Feature flag integration for safe rollouts
- ✅ Clear separation of concerns

### Agent Lifecycle Support
- ✅ Accelerates agent onboarding (1 day vs 1 week)
- ✅ Enforces launch criteria validation through widgets
- ✅ Streamlines trainer workflows with standardized interfaces
- ✅ Supports graduation process with clear lifecycle progression

### Scalability & Maintainability
- ✅ Website builder-like flexibility for agents
- ✅ Consistent widget library reduces duplication
- ✅ Configuration-driven vs. code-driven content
- ✅ Easy addition of new agents

## Consequences

### Positive
- Dramatic reduction in agent profile development time
- Consistent user experience across all agent profiles
- Simplified trainer workflows for content updates
- Better architectural alignment with Registry-first principles
- Scalable system for future agent growth

### Negative  
- Initial migration effort for existing agents
- Learning curve for trainers adapting to widget system
- Potential over-standardization if not carefully implemented
- Increased complexity in Registry data model

### Risks & Mitigations
- **Registry Dependency**: Comprehensive fallback configurations ensure pages never break
- **Agent Identity Loss**: Widget customization preserves individual agent personality
- **Performance Impact**: Widget lazy loading and caching strategies
- **Migration Complexity**: Phased rollout with feature flags enables safe rollback

## Relationship to Other ADRs

- **Builds on ADR-022**: Registry-First Architecture Pattern - All widget data sourced from Registry
- **Extends ADR-023**: Agent Site Architecture Standards - Applies patterns to profile pages
- **Complements ADR-021**: Agent Readiness Framework - Widget system supports lifecycle tracking
- **Aligns with ADR-020**: Registry Migration patterns - Uses established migration strategies

## Success Metrics

### Technical Metrics
- All agent profiles render within 3s
- 99.9% uptime with Registry unavailable  
- Zero hardcoded content in profile pages
- <100 lines per agent profile page file

### Product Metrics
- 50% reduction in profile development time
- Consistent navigation patterns across all agents
- Improved trainer content update frequency
- Easy addition of new agents (1 day vs 1 week)

## References

- ADR-022: Registry-First Architecture Pattern
- ADR-023: Agent Site Architecture Standards
- ADR-021: Agent Readiness Framework
- Architecture Guardian Analysis: Agent Profile Page System Architecture Plan
- Agent Launcher Assessment: Agent Lifecycle Widget System Validation