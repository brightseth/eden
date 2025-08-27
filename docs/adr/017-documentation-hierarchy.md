# ADR-017: Documentation Hierarchy and Organization

## Status
Accepted

## Context
Documentation is currently scattered across:
- 20+ markdown files in project root
- Various README files in subdirectories
- Mixed terminology between Claude Coding Agents and Eden Spirits
- No clear information architecture
- Duplicate content in multiple files

This causes:
- Information silos
- Inconsistent terminology
- Difficulty finding documentation
- Maintenance overhead

## Decision

### 1. Centralized Documentation Structure

All documentation moves to `/admin/docs` with this hierarchy:

```
/admin/docs/
├── index.md                    # Documentation hub homepage
├── architecture/               # System design and ADRs
│   ├── adrs/                  # Architecture Decision Records
│   │   ├── 001-xxx.md
│   │   └── ...
│   ├── service-map.md         # Service architecture diagram
│   ├── data-flow.md           # Data flow documentation
│   └── tech-stack.md          # Technology choices
│
├── coding-agents/              # Claude Coding Agent documentation
│   ├── cheatsheet.md          # 6 coding agents quick reference
│   ├── arch.md                # ARCH agent detailed guide
│   ├── truth.md               # TRUTH agent detailed guide
│   ├── lore.md                # LORE agent detailed guide
│   ├── helvetica.md           # HELVETICA agent detailed guide
│   ├── token.md               # TOKEN agent detailed guide
│   └── launcher.md            # LAUNCHER agent detailed guide
│
├── eden-spirits/               # Eden Creative Agent documentation
│   ├── overview.md            # What are Eden Spirits?
│   ├── solienne.md            # Solienne profile and capabilities
│   ├── abraham.md             # Abraham profile and capabilities
│   ├── koru.md                # Koru profile and capabilities
│   └── others.md              # Other spirits in development
│
├── api-registry/               # API and Registry documentation
│   ├── overview.md            # API architecture overview
│   ├── endpoints.md           # Complete endpoint reference
│   ├── authentication.md      # Auth patterns and requirements
│   ├── examples/              # Code examples
│   └── postman/               # Postman collections
│
├── platform/                   # Platform operation docs
│   ├── deployment.md          # Deployment procedures
│   ├── monitoring.md          # Monitoring and observability
│   ├── feature-flags.md       # Feature flag management
│   └── rollback.md            # Rollback procedures
│
├── microservices/              # Specialized microservice docs
│   ├── crit.md                # CRIT design critic service
│   ├── eden2.md               # EDEN2 investor dashboard
│   ├── eden2038.md            # Eden2038 Abraham contract viewer
│   └── miyomi.md              # Miyomi daily video dashboard
│
├── development/                # Development workflow docs
│   ├── worktrees.md           # Git worktree setup
│   ├── local-setup.md         # Local development setup
│   ├── testing.md             # Testing strategies
│   └── pr-process.md          # Pull request process
│
└── migration/                  # Legacy migration docs
    ├── overview.md            # Migration strategy
    ├── content-map.md         # Content migration mapping
    └── checklist.md           # Migration checklist
```

### 2. Documentation Naming Conventions

**Claude Coding Agents** (always uppercase in docs):
- ARCH, TRUTH, LORE, HELVETICA, TOKEN, LAUNCHER
- Always prefixed with "Claude Coding Agent" on first reference
- Use format: "ARCH (Architecture Guardian)"

**Eden Spirits/Agents** (proper case in docs):
- Solienne, Abraham, Koru, Eve, etc.
- Always prefixed with "Eden Spirit" or "Eden Agent" on first reference
- Include role: "Solienne (Visual Artist Spirit)"

### 3. File Migration Plan

| Current Location | New Location | Action |
|-----------------|--------------|--------|
| /AGENT_CHEATSHEET.md | /admin/docs/coding-agents/cheatsheet.md | Move & update |
| /API_REGISTRY_DOCS.md | /admin/docs/api-registry/overview.md | Move & split |
| /WORKTREE_SETUP.md | /admin/docs/development/worktrees.md | Move |
| /SITEMAP.md | /admin/docs/platform/sitemap.md | Move & update |
| /MIGRATION_*.md | /admin/docs/migration/ | Move all |
| /PLATFORM_AUDIT.md | /admin/docs/platform/audit.md | Move |
| Other root .md files | Archive or move to appropriate subdirectory | Case by case |

### 4. Documentation Standards

Every documentation file must include:
```markdown
---
title: Document Title
category: coding-agents|eden-spirits|api|platform|development
last-updated: 2024-08-25
author: ARCH|TRUTH|LORE|HELVETICA|TOKEN|LAUNCHER|Human
---
```

### 5. Auto-generated Documentation

The documentation viewer will:
1. Auto-scan `/admin/docs` directory
2. Generate navigation from folder structure
3. Create search index from all content
4. Display last-updated timestamps
5. Show related documents

## Consequences

### Positive
- Single source of truth for all documentation
- Clear distinction between coding agents and Eden spirits
- Improved findability via structured hierarchy
- Easier maintenance and updates
- Auto-generated navigation and search

### Negative
- Requires updating all existing links
- Initial migration effort
- Need to retrain team on new structure

### Neutral
- Documentation becomes part of deployment
- Version controlled with code
- Searchable via documentation viewer

## Implementation Plan

1. **Phase 1**: Create new directory structure
2. **Phase 2**: Migrate and consolidate existing files
3. **Phase 3**: Update all internal links
4. **Phase 4**: Deploy updated documentation viewer
5. **Phase 5**: Archive old documentation files

## Related ADRs
- ADR-016: Service Boundary Definition
- ADR-018: Worktree-Agent Alignment
- ADR-019: Registry Integration Pattern

## References
- Current Documentation: https://eden-academy.vercel.app/admin/docs
- Documentation Viewer Component: /src/components/admin/docs/DocumentationViewer.tsx