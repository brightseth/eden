# Domain Management Guide

## Overview
This guide ensures Eden Academy maintains consistent domain references and prevents the recurring issue of incorrect domain usage.

## ✅ CORRECT Domain
**Eden Academy:** `eden-academy.vercel.app`

## ❌ INCORRECT Domains (Never Use)
- `eden-academy-flame.vercel.app`
- `eden-academy-ftf22wjgo-edenprojects.vercel.app`

## Centralized Domain Configuration

All domain references are managed through `/src/config/domains.ts`:

```typescript
import { URLS, DOMAINS } from '@/config/domains';

// ✅ CORRECT - Use centralized config
const academyUrl = URLS.EDEN_ACADEMY;

// ❌ WRONG - Hard-coded domain
const academyUrl = 'https://eden-academy-flame.vercel.app';
```

## Validation Tools

### 1. Domain Validator
Scans codebase for incorrect domain references:
```bash
npm run validate-domains
```

### 2. Domain Fixer
Automatically fixes incorrect domain references:
```bash
npm run fix-domains
```

### 3. Pre-commit Hook
Automatically runs validation before each commit to prevent incorrect domains from entering the codebase.

## Usage Examples

### ✅ Frontend Components
```typescript
import { getEdenAcademyUrl } from '@/config/domains';

export function ShareButton() {
  const academyUrl = getEdenAcademyUrl();
  return (
    <a href={`${academyUrl}/admin/docs`}>
      View Documentation
    </a>
  );
}
```

### ✅ API Routes
```typescript
import { URLS } from '@/config/domains';

export async function GET() {
  const registryUrl = process.env.NEXT_PUBLIC_REGISTRY_URL || URLS.EDEN_GENESIS_REGISTRY_API;
  // Use registryUrl...
}
```

### ✅ Environment Variables
```bash
NEXT_PUBLIC_EDEN_ACADEMY_URL=https://eden-academy.vercel.app
```

## Development Workflow

### Before Making Changes
1. **Check domains.ts**: Use centralized configuration
2. **Run validation**: `npm run validate-domains`
3. **Review changes**: Ensure no hard-coded domains

### Adding New Services
1. **Update domains.ts**: Add new domain to centralized config
2. **Update validator**: Add to CORRECT_DOMAINS list if needed
3. **Document usage**: Update this guide with examples

### Fixing Domain Issues
1. **Run fixer**: `npm run fix-domains` (automatic)
2. **Manual review**: Check complex cases manually
3. **Validate**: `npm run validate-domains`
4. **Test**: Verify functionality still works

## Common Pitfalls

### ❌ Hard-coded URLs
```typescript
// WRONG
const url = 'https://eden-academy-flame.vercel.app/api/health';
```

### ✅ Use Configuration
```typescript
// CORRECT
import { URLS } from '@/config/domains';
const url = `${URLS.EDEN_ACADEMY}/api/health`;
```

### ❌ Copy-paste from Documentation
```markdown
<!-- WRONG - outdated documentation -->
Visit https://eden-academy-flame.vercel.app
```

### ✅ Use Current Domain
```markdown
<!-- CORRECT -->
Visit https://eden-academy.vercel.app
```

## Emergency Procedures

### If Incorrect Domains Are Deployed
1. **Immediate**: Run `npm run fix-domains`
2. **Validate**: Run `npm run validate-domains` 
3. **Test**: Verify all URLs resolve correctly
4. **Deploy**: Push fixes to production immediately

### If Validation Blocks Deployment
1. **Check errors**: Review validation output
2. **Use fixer**: Run automated fix script
3. **Manual review**: Check any remaining issues
4. **Re-validate**: Confirm all issues resolved

## Architecture Integration

This domain management system integrates with:
- **ADR-016**: Service boundary definitions
- **ADR-019**: Registry integration pattern
- **Feature flags**: Environment-specific overrides
- **Generated SDK**: API client configurations

## Monitoring

### Health Checks
- Automated validation in CI/CD
- Pre-commit hooks prevent bad commits
- Manual validation tools available

### Metrics
- Track domain validation failures
- Monitor URL resolution success rates
- Alert on configuration drift

## Support

### When to Use This Guide
- Adding new features with URLs
- Updating documentation
- Debugging URL resolution issues
- Onboarding new team members

### Escalation
- **Technical Issues**: Check validation script output
- **Process Issues**: Update this guide
- **Architecture Changes**: Create new ADR

---

**Remember**: Domain consistency prevents user confusion and maintains professional brand standards. When in doubt, use the centralized configuration and validation tools.