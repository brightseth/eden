# API Contract Freeze - Abraham Covenant
**Effective Date**: September 2, 2025  
**Tagged Release**: `covenant-ready`  
**Freeze Duration**: Until October 19, 2025 (Launch)

## 🔒 Frozen API Contracts

The following API endpoints are **FROZEN** and must maintain backward compatibility:

### `/api/covenant/witnesses`

#### GET - List Witnesses
```typescript
// Request
GET /api/covenant/witnesses?limit=100&offset=0

// Response
{
  witnesses: WitnessRecord[],
  total: number,
  page: number,
  pageSize: number
}
```

#### POST - Register Witness
```typescript
// Request
POST /api/covenant/witnesses
{
  address: string,           // Required: Ethereum address
  ens_name?: string,         // Optional: ENS name
  email?: string,            // Optional: Email for notifications
  transaction_hash: string,  // Required: TX hash of witness signature
  block_number: number,      // Required: Block number
  notification_preferences: {
    dailyAuctions: boolean,
    milestones: boolean,
    emergency: boolean
  }
}

// Response
{
  success: boolean,
  witness_number: number,
  message: string
}
```

### `/api/covenant/notifications`

#### GET - Notification Status
```typescript
// Request
GET /api/covenant/notifications?action=status

// Response
{
  enabled: boolean,
  provider: string,
  lastSent: string,
  queuedCount: number
}
```

#### POST - Send Notifications (Admin Only)
```typescript
// Request
POST /api/covenant/notifications
{
  action: "milestone" | "emergency" | "daily" | "test",
  data?: any,
  testEmails?: string[]
}

// Response
{
  sent: number,
  failed: number,
  errors?: string[]
}
```

## ⚠️ Breaking Change Policy

### What's Allowed:
✅ Adding optional fields to responses  
✅ Adding new optional query parameters  
✅ Adding new endpoints under `/api/covenant/v2/`  
✅ Performance improvements that don't change behavior  
✅ Bug fixes that restore documented behavior  

### What's Forbidden:
❌ Removing or renaming existing fields  
❌ Changing field types or formats  
❌ Changing required/optional status  
❌ Modifying validation rules  
❌ Changing error response formats  
❌ Altering authentication requirements  

## 🚀 Migration Strategy

If breaking changes are absolutely necessary:

1. **Create v2 Endpoint**
   ```typescript
   // Keep v1 running
   /api/covenant/witnesses     // Original (frozen)
   /api/covenant/v2/witnesses  // New version
   ```

2. **Feature Flag Migration**
   ```typescript
   const USE_COVENANT_V2 = process.env.FEATURE_COVENANT_V2 === 'true';
   
   if (USE_COVENANT_V2) {
     // New behavior
   } else {
     // Original behavior (default)
   }
   ```

3. **Deprecation Timeline**
   - Day 1: Deploy v2 behind flag
   - Day 7: Enable v2 for 10% traffic
   - Day 14: Enable v2 for 50% traffic
   - Day 21: Enable v2 for 100% traffic
   - Day 30: Deprecate v1 (after launch)

## 📊 Monitoring Requirements

Track these metrics to ensure contract compliance:

```typescript
// Required monitoring
{
  endpoint: string,
  method: string,
  status_code: number,
  response_time_ms: number,
  error_rate: number,
  schema_violations: number
}
```

### Alert Thresholds:
- Response time > 2000ms
- Error rate > 1%
- Any schema violations
- Unexpected status codes

## 🧪 Contract Testing

Run these tests before any deployment:

```bash
# 1. Schema validation
npm run test:api:covenant

# 2. Backward compatibility
npm run test:api:compat

# 3. Load testing
npm run test:load:covenant

# 4. Integration tests
npm run test:e2e:covenant
```

## 📝 Change Log

### September 2, 2025 - Initial Freeze
- Frozen endpoints: `/api/covenant/witnesses`, `/api/covenant/notifications`
- Schema version: 1.0.0
- Breaking changes: None

### Future Changes (Post-Launch)
- TBD after October 19, 2025

## 🎯 Enforcement

This contract freeze is enforced by:

1. **CI/CD Pipeline**: Tests will fail if contracts are broken
2. **Code Review**: Changes to frozen endpoints require 2 approvals
3. **Monitoring**: Alerts fire on schema violations
4. **Documentation**: This document is the source of truth

## 🔐 Security Considerations

Even during the freeze, security fixes are allowed if they:
- Don't change the API contract
- Are documented in security advisories
- Are tested thoroughly
- Include rollback procedures

## 📞 Contact

**Contract Owner**: Abraham Covenant Team  
**Technical Lead**: Seth (via Eden Academy)  
**Emergency Contact**: ops@eden2.io  

---

**Remember**: The covenant launches October 19, 2025. Every change risks the launch. When in doubt, don't change it!