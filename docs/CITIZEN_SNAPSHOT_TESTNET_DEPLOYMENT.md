# CITIZEN Snapshot DAO Integration - Eden.eth Space Deployment Guide

**Date**: 2025-08-28  
**Version**: 1.0  
**Network**: Mainnet (Chain ID: 1)  
**Snapshot Space**: eden.eth

## Overview

This guide covers the complete deployment of CITIZEN's Snapshot DAO integration using the existing eden.eth Snapshot space, including Registry schema migration, environment configuration, and integration testing.

## 🚀 Quick Start

```bash
# 1. Enable feature flag  
export ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=true
export GOVERNANCE_NETWORK_ID=1
export NODE_ENV=development

# 2. Run integration tests
npx tsx scripts/test-citizen-governance.ts

# 3. Deploy Registry schema
# (Apply migration 015_citizen_snapshot_governance.sql)

# 4. Test proposal creation
curl -X POST http://localhost:3000/api/agents/citizen/governance \
  -H "Content-Type: application/json" \
  -d '{"action":"create_proposal","topic":"Test Proposal","context":"Testing testnet integration","proposalType":"community"}'
```

## 📋 Prerequisites

### Required Environment Variables

```bash
# Feature Flags
ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=true
GOVERNANCE_NETWORK_ID=1    # Mainnet for eden.eth space

# API Keys (Optional - will use public endpoints if not provided)
SNAPSHOT_API_KEY=your_snapshot_api_key
CITIZEN_WALLET_ADDRESS=0x742d35Cc6634C0532925a3b8D4C26c36291fA61e

# Registry Configuration
REGISTRY_URL=https://eden-genesis-registry.vercel.app/api/v1
REGISTRY_API_KEY=eden-academy-client

# Snapshot Configuration
SNAPSHOT_BASE_URL=https://testnet.snapshot.org
```

### Network Requirements

- **Network**: Mainnet (Chain ID: 1) 
- **Snapshot Space**: `eden.eth`
- **Token Contract**: TBD (Eden token contract address)
- **Voting Strategy**: Token-based (configured in eden.eth space)

## 🗄️ Database Migration

### Step 1: Apply Registry Schema Migration

```sql
-- Execute migration 015_citizen_snapshot_governance.sql
psql $DATABASE_URL -f supabase/migrations/015_citizen_snapshot_governance.sql
```

### Step 2: Verify Schema Deployment

```sql
-- Verify governance tables exist
\dt governance_*

-- Check governance_profiles structure
\d governance_profiles

-- Verify CITIZEN governance profile exists
SELECT * FROM governance_profiles 
WHERE dao_space_name = 'Eden Academy DAO';
```

## 🌐 Eden.eth Snapshot Space Integration

### Using Existing Eden.eth Space

The integration uses the existing `eden.eth` Snapshot space instead of creating a new one:

1. **Space URL**: https://snapshot.org/#/eden.eth
2. **Space ID**: `eden.eth`
3. **Current Voting Strategy**: As configured in the existing space
4. **Network**: Mainnet (Chain ID: 1)

### Space Settings

The eden.eth space is already configured with appropriate voting strategies. CITIZEN will use the existing configuration for:

- **Voting Power**: Based on Eden token holdings
- **Proposal Types**: As defined in the space settings  
- **Voting Period**: Per space configuration
- **Quorum**: As set by space administrators

No additional space configuration is required.

## 🧪 Testing Workflow

### 1. Feature Flag Validation

```typescript
import { isFeatureEnabled, FLAGS } from '@/config/flags';

// Verify feature is enabled
console.log('Snapshot Governance:', 
  isFeatureEnabled(FLAGS.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE)
); // Should be true

// Verify network configuration  
console.log('Network ID:', process.env.GOVERNANCE_NETWORK_ID); // Should be 1 (mainnet for eden.eth)
```

### 2. Service Health Checks

```typescript
import { snapshotService } from '@/lib/registry/snapshot-service';
import { registryGateway } from '@/lib/registry/gateway';

// Check Snapshot service
const snapshotHealth = await snapshotService.healthCheck();
console.log('Snapshot Status:', snapshotHealth.status);

// Check Registry Gateway
const gatewayHealth = await registryGateway.healthCheck();
console.log('Gateway Status:', gatewayHealth.status);
```

### 3. CITIZEN SDK Integration

```typescript
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';

// Get governance health with Snapshot integration
const health = await citizenSDK.getGovernanceHealth();
console.log('Snapshot Integration:', health.snapshotIntegration);

// Create test proposal
const result = await citizenSDK.createSnapshotProposal(
  'Test Community Initiative', 
  'Testing Snapshot integration with eden.eth space',
  'community',
  'eden.eth'
);
console.log('Proposal Created:', result.success);
```

### 4. API Endpoint Testing

```bash
# Test GET endpoint (governance info with Snapshot integration)
curl http://localhost:3000/api/agents/citizen/governance

# Test POST endpoint (create proposal)
curl -X POST http://localhost:3000/api/agents/citizen/governance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_proposal",
    "topic": "Test Governance Enhancement",
    "context": "Testing Snapshot integration",
    "proposalType": "operational"
  }'

# Test voting power query
curl -X POST http://localhost:3000/api/agents/citizen/governance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get_voting_power", 
    "address": "0x742d35Cc6634C0532925a3b8D4C26c36291fA61e",
    "spaceId": "eden.eth"
  }'
```

## 🔐 Security & Safety Features

### Eden.eth Space Constraints

1. **Network Validation**: Operations validate network ID = 1 for eden.eth space
2. **Feature Flag Protection**: Requires explicit enable flag
3. **Fallback Behavior**: Graceful degradation to local governance  
4. **Space Restriction**: Only allows eden.eth space for production safety

### Registry-First Architecture

1. **Canonical Source**: Registry maintains authoritative governance state
2. **Sync Mechanism**: Snapshot data synced to Registry, not vice versa
3. **Audit Trail**: All governance events logged in `governance_events` table
4. **Idempotency**: Duplicate operations handled gracefully

### Error Handling

```typescript
// Example error handling patterns
try {
  const result = await citizenSDK.createSnapshotProposal(/* ... */);
  if (!result.success) {
    console.log('Fallback triggered:', result.error);
    // Registry work still created for local governance
  }
} catch (error) {
  // Network errors handled gracefully
  console.error('Governance operation failed:', error);
}
```

## 📊 Monitoring & Observability

### Key Metrics to Monitor

1. **Integration Health**
   - Snapshot API response times
   - Registry-Snapshot sync success rate
   - Circuit breaker status

2. **Governance Activity**
   - Proposal creation success rate
   - Voting participation rates
   - Consensus achievement scores

3. **Data Consistency**
   - Registry vs Snapshot data alignment
   - Governance event completeness
   - Error rates and fallback frequency

### Monitoring Endpoints

```bash
# Governance health check
GET /api/agents/citizen/governance?stats=true

# Registry gateway health
GET /api/health

# Feature flag status
GET /api/config/flags
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Feature Flag Not Enabled

**Symptom**: Proposals created locally only, no Snapshot integration  
**Solution**: 
```bash
export ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=true
export GOVERNANCE_NETWORK_ID=11155111
```

#### 2. Wrong Network Configuration

**Symptom**: "Snapshot governance attempted outside testnet - blocked for safety"  
**Solution**: Ensure `GOVERNANCE_NETWORK_ID=11155111` for Sepolia

#### 3. Registry Connection Issues

**Symptom**: "Registry temporarily unavailable"  
**Solution**: Check Registry URL and API key, verify circuit breaker status

#### 4. Snapshot API Failures

**Symptom**: Proposals fallback to local mode  
**Solution**: Check network connectivity, verify Snapshot testnet availability

### Debug Commands

```bash
# Test governance integration
npx tsx scripts/test-citizen-governance.ts

# Check Registry connection
curl $REGISTRY_URL/health

# Verify feature flags
node -e "console.log(require('./src/config/flags').featureFlags.getAllFlags())"

# Test Snapshot service health
curl https://testnet.snapshot.org/api/msg
```

## 📝 Deployment Checklist

- [ ] **Environment Variables Configured**
  - [ ] `ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=true`
  - [ ] `GOVERNANCE_NETWORK_ID=11155111`
  - [ ] Registry URL and API key set
  - [ ] Snapshot API key (optional)

- [ ] **Database Migration Applied**
  - [ ] `015_citizen_snapshot_governance.sql` executed
  - [ ] Governance tables created and accessible
  - [ ] CITIZEN governance profile initialized

- [ ] **Snapshot Testnet Space Created**
  - [ ] Space ID: `brightmomentsdao-sepolia.eth`
  - [ ] Voting strategy configured for test NFTs
  - [ ] Proper permissions and settings applied

- [ ] **Integration Testing Completed**
  - [ ] Feature flag validation passes
  - [ ] Service health checks green
  - [ ] Proposal creation workflow tested
  - [ ] Voting power queries working
  - [ ] Error handling and fallbacks validated

- [ ] **Monitoring Setup**
  - [ ] Governance health endpoints accessible
  - [ ] Key metrics being tracked
  - [ ] Alerting configured for failures

## 🔄 Rollback Procedures

### Immediate Rollback

```bash
# Disable Snapshot integration
export ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=false

# Restart services to pick up new config
# CITIZEN will fallback to local governance simulation
```

### Progressive Rollback

1. **Phase 1**: Disable new proposal creation via Snapshot
2. **Phase 2**: Stop Snapshot sync, maintain Registry operations
3. **Phase 3**: Remove Snapshot integration entirely
4. **Phase 4**: Clean up governance tables if needed (preserve data)

### Data Recovery

All governance data is preserved in Registry even during Snapshot failures:
- Proposals stored in `works` table with governance metadata
- Voting events logged in `governance_events` table  
- Governance profiles maintain historical configuration

## 🎯 Success Criteria

### Integration Readiness

- [ ] 100% test suite passing
- [ ] All API endpoints responding correctly
- [ ] Registry-Snapshot data consistency maintained
- [ ] Proper fallback behavior under failure conditions
- [ ] Security constraints enforced (testnet-only)

### Performance Benchmarks

- [ ] Proposal creation: <5 seconds end-to-end
- [ ] Voting power queries: <2 seconds
- [ ] Governance health checks: <1 second
- [ ] Registry-Snapshot sync: <10 seconds
- [ ] 99.5%+ uptime under normal conditions

### User Experience

- [ ] Transparent operation (users don't see technical details)
- [ ] Graceful degradation when Snapshot unavailable
- [ ] Clear feedback on proposal status and voting
- [ ] Consistent governance UX across all interfaces

## 📚 Additional Resources

- **ADR-026**: [CITIZEN Snapshot DAO Integration Architecture](../adr/026-citizen-snapshot-dao-integration.md)
- **Registry API Docs**: [API Discovery Report](../API_REGISTRY_DOCS.md)
- **Feature Flags Guide**: [Configuration Management](../config/flags.ts)
- **Snapshot Documentation**: https://docs.snapshot.org
- **Sepolia Testnet**: https://sepolia.etherscan.io

---

**⚠️ Important**: This integration is designed for Sepolia testnet only. All mainnet deployment requires separate review and approval process following ADR-026 guidelines.