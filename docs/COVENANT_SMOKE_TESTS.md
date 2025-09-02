# Abraham Covenant - Production Smoke Tests
**Last Updated**: September 2, 2025  
**Tagged Release**: `covenant-ready` (commit: 86cc93b)  
**Launch Date**: October 19, 2025 (51 days)

## 🚀 30-Second Health Check

Run these commands to validate covenant infrastructure in production:

```bash
# Set your deployment URL
export ACADEMY_URL="https://academy.eden2.io"
# Or for staging: export ACADEMY_URL="https://eden-academy.vercel.app"

# 1. Check Witness Registration API
curl -s -o /dev/null -w "Witnesses API: %{http_code}\n" \
  $ACADEMY_URL/api/covenant/witnesses

# 2. Check Notification System
curl -s -o /dev/null -w "Notifications API: %{http_code}\n" \
  $ACADEMY_URL/api/covenant/notifications

# 3. Check Covenant Page
curl -s -o /dev/null -w "Covenant Page: %{http_code}\n" \
  $ACADEMY_URL/academy/abraham/covenant

# 4. Check Registry Health
curl -s -o /dev/null -w "Registry Health: %{http_code}\n" \
  $ACADEMY_URL/api/registry/health

# 5. Check Main Academy
curl -s -o /dev/null -w "Academy Home: %{http_code}\n" \
  $ACADEMY_URL/
```

**Expected Results**: All should return `200` (or `308` for redirects)

## 📋 Detailed Validation Tests

### Test 1: Witness Registration (GET)
```bash
curl -X GET "$ACADEMY_URL/api/covenant/witnesses" \
  -H "Content-Type: application/json" | jq '.'
```
**Expected**: JSON array of witnesses (may be empty initially)

### Test 2: Witness Count Check
```bash
curl -s "$ACADEMY_URL/api/covenant/witnesses" | jq '. | length'
```
**Expected**: Number (0 or more)

### Test 3: Test Witness Registration (POST)
```bash
curl -X POST "$ACADEMY_URL/api/covenant/witnesses" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890123456789012345678901234567890",
    "email": "test@example.com",
    "transaction_hash": "0xtest",
    "block_number": 12345,
    "notification_preferences": {
      "dailyAuctions": true,
      "milestones": true,
      "emergency": true
    }
  }' | jq '.'
```
**Expected**: Success response with witness number

### Test 4: Notification System Health
```bash
curl -X GET "$ACADEMY_URL/api/covenant/notifications?action=status" \
  -H "Content-Type: application/json" | jq '.'
```
**Expected**: Status object with notification configuration

### Test 5: Test Notification (Admin Only)
```bash
# This should only work with proper auth in production
curl -X POST "$ACADEMY_URL/api/covenant/notifications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "action": "test_milestone",
    "testEmails": ["test@example.com"]
  }' | jq '.'
```
**Expected**: 401 without auth, success with valid admin token

## 🔒 API Contract (FROZEN)

These endpoints are frozen as of `covenant-ready` tag. Any changes must be:
1. Behind a new feature flag
2. On a new endpoint version (e.g., `/api/covenant/v2/`)
3. Backward compatible

### Frozen Endpoints:
- `GET /api/covenant/witnesses` - List all witnesses
- `POST /api/covenant/witnesses` - Register new witness
- `GET /api/covenant/witnesses/:address` - Get specific witness
- `GET /api/covenant/notifications` - Notification status
- `POST /api/covenant/notifications` - Send notifications (admin)

### Frozen Schema:
```typescript
interface WitnessRegistration {
  address: string;
  ens_name?: string;
  email?: string;
  transaction_hash: string;
  block_number: number;
  notification_preferences: {
    dailyAuctions: boolean;
    milestones: boolean;
    emergency: boolean;
  };
}
```

## 🎯 Critical Milestones

### September 19, 2025 (30 days out)
- [ ] Load test witness registration (target: 1000 witnesses)
- [ ] Test email delivery at scale
- [ ] Verify smart contract deployment on testnet

### October 12, 2025 (7 days out)
- [ ] Final API stress test
- [ ] Notification system dry run
- [ ] Database backup procedures verified
- [ ] Emergency rollback plan tested

### October 19, 2025 (Launch Day)
- [ ] 00:00 PST - Covenant begins
- [ ] Monitor witness registration rate
- [ ] Send launch notifications
- [ ] Begin daily auction cycle

## 🚨 Emergency Procedures

### If Witness Registration Fails:
```bash
# Check database connection
curl "$ACADEMY_URL/api/health"

# Check Supabase status
curl "$ACADEMY_URL/api/covenant/witnesses?limit=1"

# Fallback: Direct database insert (requires Supabase access)
```

### If Notifications Fail:
```bash
# Check Resend API status
curl -X GET "https://api.resend.com/health"

# Manual notification trigger
curl -X POST "$ACADEMY_URL/api/covenant/notifications" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"action": "manual_send", "witnesses": ["address1", "address2"]}'
```

## 📊 Monitoring Dashboard

Quick status check dashboard:
```bash
#!/bin/bash
# save as check-covenant.sh

echo "=== COVENANT SYSTEM STATUS ==="
echo ""
echo "Checking: ${ACADEMY_URL:-https://academy.eden2.io}"
echo ""

# API Health
echo -n "Witnesses API: "
curl -s -o /dev/null -w "%{http_code}\n" $ACADEMY_URL/api/covenant/witnesses

echo -n "Notifications: "
curl -s -o /dev/null -w "%{http_code}\n" $ACADEMY_URL/api/covenant/notifications

# Witness Count
COUNT=$(curl -s $ACADEMY_URL/api/covenant/witnesses | jq '. | length')
echo "Total Witnesses: $COUNT"

# Days to Launch
LAUNCH="2025-10-19"
TODAY=$(date +%Y-%m-%d)
DAYS=$(( ($(date -j -f "%Y-%m-%d" "$LAUNCH" +%s) - $(date +%s)) / 86400 ))
echo "Days to Launch: $DAYS"

echo ""
echo "=== END STATUS CHECK ==="
```

## 🏷️ Version History

- `covenant-ready` (Sep 2, 2025): Initial production deployment
- Next milestone: `covenant-30days` (Sep 19, 2025)
- Launch: `covenant-live` (Oct 19, 2025)

---

**Note**: Keep this document updated with any operational changes. Last validated: September 2, 2025