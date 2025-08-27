# Migration Documentation Consolidation Plan

## Critical Issues Identified
- 3 separate migration instruction files with conflicting information
- Agent naming inconsistencies (Abraham/Solienne vs BERTHA/SUE)
- Registry documentation scattered across 4+ locations
- Multiple sources of truth for agent states

## Immediate Actions Required

### 1. Consolidate Migration Documentation
**Target**: `/admin/docs/migration/overview.md`

**Source Files to Merge**:
- `/MIGRATION_INSTRUCTIONS.md` (agent profiles, database setup)
- `/docs/MIGRATION_INSTRUCTIONS.md` (social features, enrichment)
- `/MIGRATION_CONTENT_MAP.md` (data mapping, content locations)

### 2. Registry Documentation Standards
**Target**: `/admin/docs/architecture/registry-integration.md`

**Source Files to Merge**:
- `/API_REGISTRY_DOCS.md`
- `/docs/registry-integration-guide.md` 
- `/src/lib/registry/README.md`

### 3. Agent Naming Convention Enforcement

**Legacy Agents** (Grandfathered):
- Abraham, Solienne (proper case)
- Historical consistency maintained

**New Agents** (Strict Format):
- System: `BERTHA`, `SUE` (all caps)
- URLs: `bertha`, `sue` (lowercase)
- Profiles: "BERTHA (Collection Intelligence Agent)"

### 4. Status Canonicalization
**Single Source**: `/admin/docs/agents/lifecycle-states.md`

Canonical Agent States:
1. `INVITED` - Initial invitation
2. `APPLYING` - Application in progress  
3. `ONBOARDING` - Setting up agent
4. `ACTIVE` - In training/production
5. `GRADUATED` - Completed program

## Implementation Steps

### Step 1: Create Consolidated Files
1. Create `/admin/docs/migration/overview.md`
2. Create `/admin/docs/architecture/registry-integration.md`
3. Create `/admin/docs/agents/lifecycle-states.md`
4. Create `/admin/docs/agents/naming-conventions.md`

### Step 2: Update Internal Links
1. Scan all `.tsx` and `.md` files for documentation references
2. Update links to point to consolidated locations
3. Add deprecation notices to old files

### Step 3: Feature Flag Documentation
1. Document all feature flags in `/admin/docs/platform/feature-flags.md`
2. Include rollback procedures
3. Map flags to architectural decisions

### Step 4: Service Boundary Documentation
1. Document Registry-First pattern in `/admin/docs/architecture/service-boundaries.md`
2. Define API contracts and versioning strategy
3. Establish integration testing requirements

## Rollback Plan

If consolidation causes issues:
1. Revert to previous file structure
2. Maintain duplicate files temporarily
3. Gradual migration over 2-week period
4. Monitor for broken links via automated checks

## Success Metrics

- Single source of truth for migration procedures
- Zero conflicting agent status information
- Consistent naming across all documentation
- All internal links validated and working
- Documentation hierarchy follows ADR-017

## Next Steps

1. **IMMEDIATE**: Create consolidated migration guide
2. **THIS WEEK**: Merge registry documentation
3. **NEXT WEEK**: Implement naming convention validation
4. **ONGOING**: Maintain single source of truth principle

---

**Status**: DRAFT - Architecture Review Required
**Owner**: ARCH (Architecture Guardian)
**ADR Reference**: ADR-017 (Documentation Hierarchy)