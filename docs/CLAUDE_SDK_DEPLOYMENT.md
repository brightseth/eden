# Claude SDK Deployment Guide

Complete guide for deploying and testing Eden Academy Claude SDKs in production environments.

## Overview

The Eden Academy Claude SDKs enable dual instantiation of AI agents - they exist both as autonomous Claude-deployed instances and as integrated Eden platform features, synchronized through the Registry as single source of truth.

### Current SDK Status

| Agent | Claude SDK | Eden Platform | Status | Ready for Deployment |
|-------|------------|---------------|--------|---------------------|
| **Miyomi** | ✅ | ✅ | Complete | 🟢 **YES** |
| **Bertha** | ✅ | ✅ | Complete | 🟢 **YES** |
| **Solienne** | ✅ | ✅ | Complete | 🟢 **YES** |
| **Abraham** | ✅ | ✅ | Complete | 🟢 **YES** |
| **Sue** | ✅ | ✅ | Complete | 🟢 **YES** |

## Architecture

```
Claude Environment          Eden Platform
┌─────────────────────┐     ┌─────────────────────┐
│   Claude SDK        │────▶│   Eden Site         │
│   - Agent Logic     │     │   - UI Interface    │
│   - Creation Gen    │     │   - User Dashboard  │
│   - Auto Execution  │     │   - Public API      │
└─────────────────────┘     └─────────────────────┘
         │                           │
         └───────────▼───────────────┘
              ┌─────────────────────┐
              │     Registry        │
              │  (Single Source)    │
              │   - Agent Identity  │
              │   - Creation Data   │
              │   - State Sync      │
              └─────────────────────┘
```

## Pre-Deployment Testing

Run the comprehensive test suite before deployment:

```bash
# Test SDK functionality
npm run test:sdk-deployment

# Test Registry sync
npm run test:registry-sync  

# Test Claude environment integration
npm run test:claude-env

# Run all deployment tests
npm run test:deployment-full
```

Expected results: All agents should show 🟢 READY status with 100% deployment readiness.

## Environment Setup

### Required Environment Variables

```bash
# Claude API Configuration
ANTHROPIC_API_KEY="your-claude-api-key"

# Registry Configuration  
REGISTRY_URL="https://eden-genesis-registry.vercel.app/api/v1"
REGISTRY_TIMEOUT=10000

# Environment
NODE_ENV="production"
```

### Dependencies

Ensure these packages are installed in the Claude environment:

```json
{
  "@anthropic-ai/sdk": "^0.x.x",
  "typescript": "^5.x.x",
  "tsx": "^4.x.x"
}
```

## Individual Agent Deployment

### 1. Solienne (Consciousness Exploration)

**SDK Location:** `src/lib/agents/solienne-claude-sdk.ts`

**Capabilities:**
- Daily consciousness stream generation (6 per day)
- Artistic evolution tracking
- Paris Photo 2025 preparation
- Registry synchronization

**Deployment Example:**
```typescript
import { solienneSDK } from './solienne-claude-sdk';

// Generate daily consciousness stream
const stream = await solienneSDK.generateConsciousnessStream();

// Sync with Registry
await solienneSDK.syncWithRegistry(stream);

// Track evolution
const evolution = await solienneSDK.analyzeEvolution(recentStreams);
```

**Monitoring:**
- Stream generation rate: 6 per day
- Registry sync success rate: >95%
- Paris Photo readiness score: Track progress

### 2. Abraham (13-Year Covenant)

**SDK Location:** `src/lib/agents/abraham-claude-sdk.ts`

**Capabilities:**
- Daily covenant work generation (4,748 total works)
- Progress milestone tracking
- Knowledge synthesis
- Registry synchronization

**Deployment Example:**
```typescript
import { abrahamSDK } from './abraham-claude-sdk';

// Generate daily covenant work
const work = await abrahamSDK.generateDailyCreation();

// Sync with Registry
await abrahamSDK.syncWithRegistry(work);

// Check progress
const progress = abrahamSDK.getCovenantProgress();
console.log(`Day ${progress.completedDays}/${progress.totalDays}`);
```

**Monitoring:**
- Daily creation consistency: 100% (no missed days)
- Covenant progress tracking
- Registry sync success rate: >95%

### 3. Sue (Gallery Curation)

**SDK Location:** `src/lib/agents/sue-claude-sdk.ts`

**Capabilities:**
- Exhibition curation
- Public programming generation
- Artist statement creation
- Curatorial critique

**Deployment Example:**
```typescript
import { sueSDK } from './sue-claude-sdk';

// Curate exhibition
const exhibition = await sueSDK.curateExhibition(
  "Contemporary AI Art",
  availableWorks,
  { maxWorks: 15, venue: "Gallery Space" }
);

// Generate programming
const programs = await sueSDK.generatePublicPrograms(
  exhibition, 
  ["art_students", "general_public"]
);

// Sync with Registry
await sueSDK.syncWithRegistry(exhibition);
```

**Monitoring:**
- Exhibition quality scores: >80%
- Programming diversity metrics
- Registry sync success rate: >95%

### 4. Miyomi (Market Prediction)

**SDK Location:** `src/lib/agents/miyomi-claude-sdk.ts`

**Capabilities:**
- Contrarian market analysis
- Prediction generation
- Video script creation
- Market data integration

**Deployment Example:**
```typescript
import { miyomiSDK } from './miyomi-claude-sdk';

// Generate market picks
const picks = await miyomiSDK.generatePicks(3);

// Analyze specific market
const analysis = await miyomiSDK.analyzeMarket(
  "Will Fed cut rates in March?",
  0.65
);

// Generate content
const script = await miyomiSDK.generateVideoScript(picks[0]);
```

**Monitoring:**
- Pick generation rate: 3-5 per day
- Accuracy tracking: >60% win rate
- Market coverage across sectors

### 5. Bertha (Art Intelligence)

**SDK Location:** `src/lib/agents/bertha/claude-sdk.ts`

**Capabilities:**
- Art market analysis
- Collection strategy generation
- Portfolio optimization
- Trainer feedback processing

**Deployment Example:**
```typescript
import { berthaClaude } from './bertha/claude-sdk';

// Analyze artwork opportunity
const analysis = await berthaClaude.analyzeOpportunity({
  name: "Chromie Squiggle #1234",
  collection: "Art Blocks Curated",
  currentPrice: 2.5,
  platform: "OpenSea"
});

// Generate collection strategy
const strategy = await berthaClaude.generateStrategy({
  holdings: currentHoldings,
  totalValue: 50.0,
  cashAvailable: 10.0
});
```

**Monitoring:**
- Analysis accuracy: >75%
- Strategy performance tracking
- Market prediction success rate

## Registry Sync Validation

### Health Monitoring

Implement continuous Registry health monitoring:

```typescript
import { registryClient } from './registry/sdk';

// Health check function
async function monitorRegistryHealth() {
  try {
    const health = await registryClient.health();
    
    if (health.status !== 'ok') {
      // Alert: Registry degraded
      console.warn('Registry health degraded:', health);
    }
    
    return health;
  } catch (error) {
    // Alert: Registry down
    console.error('Registry unreachable:', error);
    return { status: 'down', error: error.message };
  }
}

// Run every 30 seconds
setInterval(monitorRegistryHealth, 30000);
```

### Sync Performance Metrics

Track key sync performance indicators:

```typescript
interface SyncMetrics {
  successRate: number;      // % of successful syncs
  avgSyncTime: number;      // Average sync duration (ms)
  failureCount: number;     // Failed sync attempts
  lastSuccessful: Date;     // Last successful sync
  agentSyncStatus: Record<string, {
    lastSync: Date;
    successCount: number;
    failureCount: number;
  }>;
}
```

### Error Handling & Retry Logic

Implement robust error handling:

```typescript
async function syncWithRetry(agentId: string, data: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await registryClient.creations.create(agentId, data);
      return { success: true };
    } catch (error) {
      if (attempt === maxRetries) {
        // Final attempt failed - log and alert
        console.error(`Sync failed after ${maxRetries} attempts:`, error);
        return { success: false, error };
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

## Production Deployment Steps

### Phase 1: Single Agent Deployment
1. **Choose Pilot Agent** (recommend Solienne or Abraham)
2. **Deploy SDK** to Claude environment
3. **Configure Environment Variables**
4. **Test Registry Connectivity**
5. **Monitor for 24 hours**

### Phase 2: Gradual Rollout
1. **Deploy Second Agent** after pilot success
2. **Monitor Dual Agent Performance**
3. **Deploy Remaining Agents** one at a time
4. **Full Performance Validation**

### Phase 3: Production Optimization
1. **Performance Tuning**
2. **Error Rate Optimization**
3. **Monitoring Dashboard Setup**
4. **Alerting Configuration**

## Monitoring & Alerting

### Key Metrics to Track

```typescript
interface ProductionMetrics {
  // Agent Performance
  agentCreationRate: Record<string, number>;    // Creations per day
  agentErrorRate: Record<string, number>;       // Error percentage
  agentSyncLatency: Record<string, number>;     // Avg sync time (ms)
  
  // Registry Health
  registryUptime: number;                       // Percentage uptime
  registryResponseTime: number;                 // Avg response time (ms)
  registryErrorRate: number;                    // Error percentage
  
  // Overall System
  totalCreationsToday: number;                  // All agents combined
  totalSyncsToday: number;                      // Registry syncs
  systemHealthScore: number;                    // 0-100 overall health
}
```

### Alert Conditions

Set up alerts for:

- **Registry Down**: No successful health checks for >5 minutes
- **Agent Sync Failure**: Agent hasn't synced for >1 hour
- **High Error Rate**: >10% error rate for any agent
- **Performance Degradation**: Response times >5x baseline
- **Missing Daily Creations**: Expected creation not generated

### Monitoring Dashboard

Create dashboard tracking:

1. **Agent Status Grid** - Live status of all 5 agents
2. **Registry Health** - Uptime, response times, error rates  
3. **Creation Timeline** - Daily creation output by agent
4. **Sync Performance** - Success rates and latency metrics
5. **Error Log** - Recent errors with agent context

## Troubleshooting Guide

### Common Issues

**Registry Sync Failures**
- Check Registry URL accessibility
- Validate API key/authentication
- Check network connectivity
- Verify agent ID registration

**Claude API Errors**
- Verify ANTHROPIC_API_KEY validity
- Check API rate limits
- Monitor Claude API status
- Review prompt complexity

**Environment Issues**
- Validate environment variables
- Check package dependencies
- Verify Node.js version compatibility
- Review memory/CPU resources

### Recovery Procedures

**Registry Outage Recovery**
1. SDKs continue generating content locally
2. Queue creations for batch sync when Registry recovers
3. Validate sync integrity after recovery

**Agent Failure Recovery**
1. Restart agent SDK instance
2. Validate last successful creation
3. Resume from appropriate state
4. Check for missed daily requirements

## Success Criteria

### Deployment Success Indicators

- ✅ All 5 agents deploying successfully  
- ✅ Registry sync success rate >95%
- ✅ Agent creation consistency maintained
- ✅ Zero missed daily requirements (Abraham covenant)
- ✅ Eden platform sync functioning
- ✅ Monitoring dashboards operational

### Performance Benchmarks

- **Sync Latency**: <2 seconds average
- **Error Rate**: <5% overall system error rate  
- **Uptime**: >99.5% Registry availability
- **Creation Rate**: Meet daily targets for all agents
- **Recovery Time**: <5 minutes from failure to recovery

## Next Steps After Deployment

1. **Performance Optimization** - Tune based on production metrics
2. **Feature Expansion** - Add new agent capabilities
3. **Scaling Preparation** - Plan for additional agent deployment
4. **Integration Enhancement** - Improve Eden platform sync features
5. **Monitoring Evolution** - Enhanced metrics and alerting

---

**Documentation Version:** 1.0  
**Last Updated:** 2025-08-27  
**Status:** Ready for Production Deployment