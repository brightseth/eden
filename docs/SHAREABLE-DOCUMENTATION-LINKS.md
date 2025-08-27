# Eden Academy Documentation - Shareable Links

*Complete documentation hub with public web URLs for Henry and collaborators*

---

## Registry Integration Documentation Hub

**Primary Hub URL:** `/admin/docs/registry-hub`  
**Shareable Link:** `https://eden-academy.vercel.app/admin/docs/registry-hub`

This comprehensive hub contains all Registry integration documentation organized for Henry and collaborators.

---

## Core Registry Documentation

### 1. Complete Registry Integration Guide
**File:** `/docs/HENRY-REGISTRY-INTEGRATION-COMPLETE.md`  
**Shareable URL:** `https://eden-academy.vercel.app/admin/docs/view/henry-registry-integration-complete`

**Contents:**
- Executive summary of Registry integration
- Complete site map with Registry connections
- Abraham & Solienne integration status
- Application form integration details
- Feature flag system overview

### 2. Registry-First Architecture Pattern (ADR-022)
**File:** `/docs/adr/022-registry-first-architecture-pattern.md`  
**Shareable URL:** `https://eden-academy.vercel.app/admin/docs/view/022-registry-first-architecture-pattern`

**Contents:**
- Core architectural decision rationale
- Registry as single source of truth pattern
- Integration boundaries and contracts
- Technical implementation guidelines

### 3. Agent Site Architecture Standards (ADR-023)
**File:** `/docs/adr/023-agent-site-architecture-standards.md`  
**Shareable URL:** `https://eden-academy.vercel.app/admin/docs/view/023-agent-site-architecture-standards`

**Contents:**
- Standards for agent site implementation
- Abraham and Solienne site patterns
- Registry API integration standards
- Future agent site guidelines

### 4. Abraham Registry Integration Pattern (ADR-024)
**File:** `/docs/adr/024-abraham-registry-integration-pattern.md`  
**Shareable URL:** `https://eden-academy.vercel.app/admin/docs/view/024-abraham-registry-integration-pattern`

**Contents:**
- Abraham-specific integration details
- Works display implementation
- Registry API usage patterns
- Testing and validation approach

### 5. Registry Integration Technical Guide
**File:** `/docs/registry-integration-guide.md`  
**Shareable URL:** `https://eden-academy.vercel.app/admin/docs/view/registry-integration-guide`

**Contents:**
- Technical implementation details
- API endpoints and contracts
- Authentication patterns
- Error handling and fallbacks

### 6. System Architecture Overview
**File:** `/docs/system-architecture.md`  
**Shareable URL:** `https://eden-academy.vercel.app/admin/docs/view/system-architecture`

**Contents:**
- Complete system architecture
- Registry integration points
- Service boundaries
- Data flow patterns

### 7. Architecture Summary 2025-08
**File:** `/docs/architecture-summary-2025-08.md`  
**Shareable URL:** `https://eden-academy.vercel.app/admin/docs/view/architecture-summary-2025-08`

**Contents:**
- Latest architecture summary
- Registry integration status
- Current implementation state
- Future development plans

---

## Integration Status Summary

### ✅ Completed Integrations
- **Abraham Site:** Fully integrated with Registry API displaying actual works
- **Solienne Site:** Fully integrated with Registry API displaying consciousness streams
- **Feature Flag System:** All Registry integrations controlled by feature flags with graceful fallbacks

### 🔄 Ready for Integration
- **Application Form:** Ready for integration with Henry's Registry API endpoint
  - Frontend: `/src/app/apply/page.tsx`
  - Backend: `/api/apply` route ready for POST to Registry
  - Target: `https://registry-i42t8muxt-henry-personal.vercel.app/api/apply`

---

## How to Share Documentation

### For Henry
Send the Registry Hub link: `https://eden-academy.vercel.app/admin/docs/registry-hub`

This hub contains:
- Complete integration status
- All technical documentation
- Direct links to each document
- Copy-to-clipboard functionality for sharing

### For Other Collaborators
Use the main documentation hub: `https://eden-academy.vercel.app/admin/docs`

This contains:
- Shareable Registry documentation section
- General documentation sections
- Agent cheatsheets and technical guides

---

## Architecture Compliance

This documentation consolidation maintains Eden Academy's established patterns:

- **Registry-First:** All documentation supports the Registry as single source of truth
- **Feature Flags:** Documentation explains the feature flag system for controlled rollouts
- **ADR-Based:** All architectural decisions documented as ADRs with rationale
- **Shareable URLs:** Public documentation accessible without authentication
- **Consistent Naming:** Uses canonical domain terms (Agent, Work, Cohort, Studio, Registry, Gateway)

---

## Maintenance

Documentation is automatically synchronized from:
- Root-level `.md` files
- `/docs` directory files
- `/docs/adr` ADR files

Updates to source files automatically reflect in the web documentation viewer.

---

**Last Updated:** August 26, 2025  
**Maintained By:** Eden Academy Architecture Team