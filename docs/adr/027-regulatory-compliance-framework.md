# ADR-027: Regulatory Compliance Framework for Token Economics

## Status
PROPOSED

## Context
The Eden strategic narrative describes a sophisticated nested token economics model with:
- Individual agent tokens ($ABRAHAM, $SOLIENNE) nested within $SPIRIT network token
- Revenue flows from daily drops, auctions, and physical products through smart contracts
- Progressive token distribution: internal accounting → community points → public liquidity
- The phrase "when regulatory timing aligns" indicates careful compliance planning

Token Economist analysis shows 92% alignment between vision and current implementation, with regulatory compliance being the primary gap requiring architectural documentation.

## Decision
We will implement a three-stage regulatory compliance framework that enables progressive token functionality while maintaining legal compliance:

### Stage 1: Internal Utility (Current)
- **Token Type**: Utility tokens for platform functionality
- **Distribution**: Internal accounting only
- **Functions**: Governance, staking, agent training rewards
- **Compliance**: No public sale, no exchange listing
- **Feature Flags**: `ENABLE_INTERNAL_TOKENS=true`

### Stage 2: Community Points (Q1 2026)
- **Token Type**: Community rewards and loyalty points
- **Distribution**: Earned through participation
- **Functions**: Access to features, voting rights, revenue sharing
- **Compliance**: SEC no-action letter framework
- **Feature Flags**: `ENABLE_COMMUNITY_POINTS=true`

### Stage 3: Public Liquidity (When Regulatory Timing Aligns)
- **Token Type**: Fully tradeable tokens
- **Distribution**: DEX liquidity pools
- **Functions**: Full economic sovereignty
- **Compliance**: Securities exemption or registration
- **Feature Flags**: `ENABLE_PUBLIC_TRADING=true`

## Compliance Architecture

### Technical Implementation
```typescript
interface RegulatoryCompliance {
  complianceLevel: 'internal' | 'community' | 'public';
  enabledFeatures: {
    transfers: boolean;
    trading: boolean;
    staking: boolean;
    governance: boolean;
    revenueShare: boolean;
  };
  regionRestrictions: string[];
  kycRequirements: KYCLevel;
  auditTrail: boolean;
}
```

### Regional Considerations
- **US**: Focus on utility token safe harbor
- **EU**: MiCA compliance for crypto-assets
- **UK**: FCA registration requirements
- **APAC**: Varied requirements by jurisdiction

### Risk Mitigation
1. **Progressive Rollout**: Start with lowest risk, expand carefully
2. **Feature Flags**: Instant rollback capability
3. **Audit Trail**: Complete transaction history
4. **KYC/AML**: Progressive identity verification
5. **Legal Review**: Each stage requires legal approval

## Consequences

### Positive
- **Legal Clarity**: Clear compliance at each stage
- **Risk Management**: Progressive exposure to regulatory risk
- **Global Access**: Region-specific compliance enables wider reach
- **Investor Confidence**: Demonstrated regulatory awareness
- **Sustainable Growth**: Avoids regulatory shutdown risk

### Negative
- **Delayed Liquidity**: Public trading may take longer
- **Complexity**: Multiple compliance regimes to manage
- **Cost**: Legal and compliance overhead
- **Feature Restrictions**: Some functionality limited by region

### Neutral
- **Documentation Requirements**: Extensive compliance records
- **External Dependencies**: Regulatory environment changes
- **Partnership Requirements**: May need regulated partners

## Implementation Plan

### Phase 1: Documentation (2 weeks)
1. Complete token utility documentation
2. Draft terms of service updates
3. Create compliance dashboard
4. Document feature flag controls

### Phase 2: Technical Infrastructure (4 weeks)
1. Implement compliance middleware
2. Add KYC/AML integration points
3. Create audit trail system
4. Build region detection

### Phase 3: Legal Review (6 weeks)
1. Engage securities counsel
2. Review token classification
3. Prepare no-action letter request
4. Establish compliance procedures

### Phase 4: Progressive Launch (Ongoing)
1. Monitor regulatory developments
2. Adjust compliance level as needed
3. Expand features based on legal guidance
4. Maintain audit trail

## Monitoring and Compliance

### Key Metrics
- Token classification status by jurisdiction
- KYC completion rates
- Transaction audit completeness
- Regional access statistics
- Compliance incident count

### Compliance Dashboard
Create `/admin/compliance` dashboard showing:
- Current compliance level
- Enabled features by region
- Audit trail status
- Regulatory alerts
- Risk assessment

## References
- SEC Framework for Investment Contract Analysis of Digital Assets
- EU Markets in Crypto-Assets (MiCA) Regulation
- Token Taxonomy Framework
- ADR-034: Strategic Narrative Documentation Architecture
- Current token implementation in `/src/lib/tokens/`

## Decision Outcome
Implement progressive regulatory compliance framework with three stages, enabling Eden to scale token economics while maintaining legal compliance. Start with internal utility tokens, progress to community points, and ultimately enable public trading when regulatory environment permits.

This approach aligns with the strategic narrative's vision while providing concrete implementation path and risk management.