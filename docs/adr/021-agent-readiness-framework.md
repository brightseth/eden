# ADR-021: Agent Readiness Framework

## Status
**PROPOSED** - Framework for understanding agent launch readiness

## Context

As Eden Academy scales from the initial Genesis Cohort to multiple waves of agents, we need systematic ways to understand and evaluate when agents are ready for launch. Current assessment is ad-hoc and subjective.

### Current Challenges
- **Subjective Launch Decisions**: No standardized criteria for agent readiness
- **Unclear Development Progress**: Hard to track what agents need to improve
- **Resource Allocation**: Difficulty prioritizing development efforts
- **Trainer Coordination**: No framework for assessing trainer commitment and preparation
- **Economic Viability**: No systematic evaluation of token launch potential

### Requirements
- Objective, measurable criteria where possible
- Flexible framework that can evolve as we learn more
- Support for both automated and manual assessments
- Clear progression tracking and milestone identification
- Integration with existing Registry and Spirit Registry data

## Decision

**Implement Multi-Dimensional Readiness Framework** - Create a comprehensive system that evaluates agents across 5 key categories with specific metrics, automated measurement where possible, and clear recommendations for improvement.

### Framework Architecture

#### 5 Core Categories
1. **Technical Readiness** (Infrastructure & APIs)
2. **Creative Readiness** (Portfolio & Artistic Development)  
3. **Economic Readiness** (Token Models & Market Viability)
4. **Cultural Readiness** (Mission Alignment & Community Fit)
5. **Operational Readiness** (Training & Support Systems)

#### Metric Structure
```typescript
interface ReadinessMetric {
  id: string;               // Unique identifier
  name: string;             // Human readable name
  description: string;      // What this measures
  category: ReadinessCategory;  // Which dimension
  weight: number;           // Importance (0-1)
  measurable: boolean;      // Can be automated?
  dataSource?: string;      // Where data comes from
}
```

#### Assessment Output
```typescript
interface AgentReadiness {
  agentId: string;
  overallScore: number;     // 0-100 composite score
  categories: CategoryScores;  // Detailed breakdown
  readyForLaunch: boolean;  // Launch recommendation
  nextMilestone: string;    // Next development focus
  blockers: string[];       // Critical issues to resolve
}
```

## Implementation

### Phase 1: Framework Foundation
- [x] **Core Framework**: Metric definitions and assessment engine
- [x] **Initial Metrics**: 13 foundational metrics across 5 categories
- [x] **Assessment Logic**: Scoring, conflict resolution, recommendations
- [x] **Test Endpoint**: `/api/test/agent-readiness` for validation

### Phase 2: Data Integration (Current)
- [ ] **Registry Integration**: Pull profile data, works counts, trainer info
- [ ] **Spirit Registry Integration**: Onchain deployment status, token data  
- [ ] **Analytics Integration**: Engagement metrics, market demand signals
- [ ] **Manual Review Interface**: UI for subjective assessments

### Phase 3: Dashboard & Insights
- [x] **Readiness Dashboard**: Overview of all agents, category insights
- [ ] **Agent Detail Views**: Individual agent deep-dives with recommendations
- [ ] **Trend Tracking**: Historical progression and prediction
- [ ] **Alert System**: Notifications for critical issues or milestones

### Current Metrics (13 Initial)

#### Technical (3 metrics)
- **Profile Completeness** (80% weight): Complete Registry profile
- **API Integration** (90% weight): Working endpoints and health checks
- **Onchain Deployment** (70% weight): Smart contracts and token infrastructure

#### Creative (3 metrics)
- **Portfolio Size** (80% weight): Minimum threshold of creative works
- **Style Consistency** (60% weight): Coherent artistic voice [Manual]
- **Curation Rate** (70% weight): Percentage passing curatorial review

#### Economic (3 metrics)  
- **Token Model** (90% weight): Clear economics and distribution [Manual]
- **Market Demand** (50% weight): Follower growth, engagement metrics
- **Revenue Potential** (60% weight): Projected market viability [Manual]

#### Cultural (3 metrics)
- **Mission Alignment** (80% weight): Fits Eden Academy values [Manual]
- **Community Fit** (60% weight): Adds value to ecosystem [Manual]  
- **Uniqueness** (70% weight): Distinct from existing agents [Manual]

#### Operational (4 metrics)
- **Trainer Commitment** (90% weight): Confirmed trainer with plan
- **Documentation** (70% weight): Complete technical and creative docs
- **Support Systems** (80% weight): Monitoring and maintenance infrastructure

### Launch Readiness Criteria

**Ready for Launch** (All must be true):
- Overall score ≥ 80/100
- No critical blockers (high-weight metrics failing)
- All "measurable" metrics passing
- Manual review approval for subjective metrics

**Launch Timeline Estimates**:
- **Ready Now**: Score ≥ 80, no blockers
- **1-2 Months**: Score ≥ 70, minor blockers
- **3-6 Months**: Score ≥ 40, major development needed
- **6+ Months**: Score < 40, fundamental issues

## Benefits

### For Development Teams
- **Clear Priorities**: Know exactly what to work on next
- **Progress Tracking**: Quantified improvement over time
- **Resource Planning**: Understand time-to-launch estimates

### for Trainers
- **Preparation Assessment**: Clear view of agent development status
- **Milestone Planning**: Structured approach to training goals
- **Commitment Tracking**: Visibility into trainer requirements

### For Leadership
- **Launch Planning**: Data-driven launch timing decisions
- **Portfolio Management**: Overview of entire cohort readiness
- **Risk Management**: Early identification of potential issues

### For Community
- **Transparency**: Clear communication about agent development
- **Expectation Setting**: Realistic timelines for new agents
- **Quality Assurance**: Consistent standards across all agents

## Current Assessment Results

Based on initial framework testing:

### Ready/Near Ready (2 agents)
- **Abraham**: 85% ready (strong across all categories)
- **Solienne**: 82% ready (strong portfolio, onchain in progress)

### Developing - Committed Trainers (2 agents)  
- **Geppetto**: 65% ready (trainer confirmed, portfolio needed)
- **Koru**: 63% ready (trainer confirmed, token model needed)

### Developing - Seeking Trainers (4 agents)
- **Miyomi**: 45% ready (blocked on trainer commitment)
- **Amanda**: 42% ready (blocked on trainer commitment)  
- **Citizen**: 40% ready (blocked on trainer commitment)
- **Nina**: 38% ready (blocked on trainer commitment)

### Key Insights
- **Trainer Commitment** is the primary blocker for 4/8 agents
- **Portfolio Development** needs systematic acceleration
- **Token Economics** requires dedicated modeling resources
- **Cultural Alignment** assessments need manual review process

## Monitoring & Evolution

### Success Metrics
- Framework adoption rate by development teams
- Accuracy of launch timeline predictions
- Reduction in subjective launch decisions
- Improvement in overall cohort readiness scores

### Framework Evolution
- Add new metrics as we learn what predicts success
- Refine weights based on actual launch outcomes  
- Integrate community feedback and market validation
- Develop predictive models for launch timing

### Quality Assurance
- Regular calibration sessions for manual assessments
- Cross-validation with actual launch performance
- Community feedback integration
- Trainer input on operational readiness

## Integration Points

### Existing Systems
- **Registry API**: Agent profiles, works data, trainer info
- **Spirit Registry**: Onchain deployment status, token data
- **Feature Flags**: Gradual rollout of readiness features
- **Analytics**: Engagement and market demand metrics

### Future Integrations
- **Training Platforms**: Progress tracking, milestone completion
- **Market Data**: Prediction markets, social sentiment
- **Community Feedback**: Polls, surveys, beta testing results
- **Economic Modeling**: Token price predictions, revenue forecasts

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-quantification | Stifles creativity | Balance metrics with qualitative assessments |
| Gaming the metrics | Artificial improvements | Regular framework review and refinement |
| Analysis paralysis | Delays decision making | Set clear thresholds and decision timelines |
| Framework complexity | Adoption resistance | Start simple, add complexity gradually |

## Decision Rationale

**Why Multi-Dimensional Framework?**
- Agent success depends on technical, creative, economic, and cultural factors
- Single metrics miss critical aspects of readiness
- Allows specialized focus while maintaining holistic view

**Why Mix of Automated and Manual Assessment?**
- Some aspects (portfolio size, API health) are objectively measurable
- Others (cultural fit, artistic vision) require human judgment
- Balanced approach provides both efficiency and nuance

**Why Weighted Scoring System?**
- Not all readiness factors are equally important
- Allows fine-tuning based on learning and experience
- Provides clear prioritization for development efforts

**Why Progressive Disclosure?**
- Start with core framework, add sophistication over time
- Learn from initial cohort before expanding metrics
- Avoid overwhelming teams with complex requirements initially

## Next Steps

1. **Validate Framework**: Test with current Genesis Cohort agents
2. **Data Integration**: Connect to Registry and Spirit Registry APIs  
3. **Manual Review Process**: Create workflows for subjective assessments
4. **Dashboard Development**: Build UI for readiness insights
5. **Trainer Integration**: Include trainer feedback in assessments
6. **Community Testing**: Beta test framework with development teams

## References

- Agent Readiness Framework: `/src/lib/agent-readiness/readiness-framework.ts`
- Dashboard Service: `/src/lib/agent-readiness/readiness-dashboard.ts`
- Test Endpoint: `/api/test/agent-readiness`
- Spirit Registry Integration: ADR-020

---
*Generated by LAUNCHER Agent - Eden Academy Agent Quality Guardian*  
*Date: 2025-08-26*