# ADR-033: No Agent Extraction Pre-v3.0

**Date**: 2025-08-31  
**Status**: ACCEPTED  
**Decision Maker**: Seth (Engineering Lead)  
**Architectural Review**: Architecture Guardian (Score: 9.0/10 with guardrails)

## Context

Following achievement of 9.2/10 architectural excellence, proposal emerged to extract individual agents (Solienne, Miyomi, Citizen) into sovereign `/agents/*` directories with independent deployments. This ADR establishes firm boundaries against premature agent extraction that would fragment proven Registry-First Architecture (ADR-022) and three-tier agent pattern.

## Decision

**NO AGENT EXTRACTION UNTIL v3.0** - Maintain unified Academy + Registry architecture.

### Approved: Safe Cleanup & Organization
```
/eden-ecosystem/
  /archive/legacy/     # eden2*, waves/*, downloads/*
  /resources/
    /docs/            # ADRs, runbooks  
    /branding/        # HELVETICA tokens, design system
    /tools/           # deployment, audit scripts
```

### Rejected: Agent Service Fragmentation
```
/agents/solienne/     ❌ Breaks three-tier architecture
/agents/miyomi/       ❌ Violates Registry-First pattern
/agents/citizen/      ❌ Multiplies operational complexity
```

### Alternative: Sovereign Surfaces Within Academy
- **Canonical paths**: `/agents/solienne` (within Academy)
- **CNAME option**: `solienne.ai` → reverse-proxy to Academy subpaths
- **Brand skins**: Feature-flagged agent theming without infrastructure sprawl
- **Zero new services**: All data flows through Registry

## Rationale

### Architectural Excellence Preservation
- Current **9.2/10 score** achieved through Registry-First discipline
- Three-tier pattern (`/academy/agent/` → `/sites/` → `/dashboard/`) proven in production
- **ADR-022 compliance**: Registry as single source of truth working exceptionally

### Risk Mitigation
- **Operational complexity**: 2 services → 6+ services multiplies failure surfaces
- **Security sprawl**: Each extracted service requires separate hardening
- **Registry fragmentation**: Risk of parallel data sources breaking authority model
- **Development overhead**: Context switching between repositories

### Business Value Analysis
- **No clear revenue benefit** from agent extraction at current scale
- **User experience degradation** from fragmented interface
- **Technical debt introduction** without corresponding business justification

## Hard Gates for Future Agent Extraction

Agent extraction ONLY permitted when **ALL THREE** conditions are met:

### 1. Distribution Requirement
- External partner/event requires independent domain
- Isolated deployment cadence mandated by business partnership
- Technical impossibility to serve via Academy reverse-proxy

### 2. Revenue Justification  
- Incremental, **provable revenue** from agent-specific funnel
- Academy hosting creates measurable business conflict
- ROI calculation shows extraction cost < revenue benefit

### 3. Compliance Boundary
- Legal/regulatory requirement for service isolation
- Data residency laws forcing geographic separation
- PII/GDPR boundaries requiring architectural separation

## Implementation Guardrails

### CI Enforcement Rules
```yaml
# .github/workflows/architectural-guard.yml
- name: Block Direct DB Access
  run: |
    if grep -r "import.*prisma" src/app/api --exclude-dir=registry && 
       [ "$ENABLE_REGISTRY_ENFORCEMENT" = "1" ]; then
      echo "❌ Direct DB access detected outside Registry"
      exit 1
    fi
```

### Repository Policy
- **No new top-level repositories** for individual agents
- **All PRs must reference Registry schemas** for data changes  
- **Feature flags required** for agent-specific functionality

### Observability Requirements
- **Registry health**: p95 < 250ms, 99.9% uptime
- **Academy error rate**: < 0.5%  
- **Schema drift monitoring**: automated alerts
- **Agent roster health**: counts vs Registry validation

## Success Metrics

### Short Term (30 days)
- **Archive cleanup**: 100% legacy projects organized
- **Shared resources**: Design tokens package operational
- **CI guardrails**: Direct DB access blocking enabled
- **Sovereign surfaces**: solienne.ai reverse-proxy prototype

### Long Term (90 days)
- **Zero architectural violations**: No agent extraction proposals
- **Maintained excellence**: 9.0+ architectural score
- **Operational stability**: SLO compliance > 99%
- **Developer velocity**: Reduced context switching overhead

## Rollback Plan

If extraction becomes necessary despite guardrails:

1. **Business case documentation** required (revenue/compliance/distribution)
2. **Migration strategy** with data consistency guarantees
3. **Monitoring expansion** to cover distributed services  
4. **Security review** for expanded attack surface
5. **Rollback capability** to unified architecture within 24 hours

## Related ADRs

- **ADR-022**: Registry-First Architecture Pattern (foundational)
- **ADR-016**: Service Boundary Definition  
- **ADR-023**: Three-Tier Agent Architecture

## Review Schedule

- **Quarterly review**: Q4 2025, Q1 2026, Q2 2026
- **Emergency review**: Upon meeting any hard gate condition
- **v3.0 planning**: Full architectural review for extraction consideration

---

**Decision Rationale**: Preserve architectural excellence through disciplined constraint. Agent extraction introduces complexity without corresponding value. Focus resources on strengthening proven patterns rather than fragmenting successful architecture.

**Architecture Guardian Certification**: This decision maintains 9.2/10 architectural excellence and provides clear framework for future extraction when business justification emerges.