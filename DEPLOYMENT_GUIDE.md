# Eden2.io Deployment Guide

## Quick Start

Execute the complete deployment sequence:

```bash
cd /Users/seth/eden-academy
./scripts/deploy-orchestration.sh
```

## Individual Steps

If you need to run steps individually:

### 1. Foundation (Data Migration)
```bash
npx tsx scripts/migrate-trainer-data.ts
```
**Target:** 95% health score
**Creates:** 7 trainers, 8 agents, 10+ works

### 2. Registry Production Deploy
```bash
cd ../eden-genesis-registry
npm run build
vercel deploy --prod
```

### 3. Agent Data Sync
```bash
npx tsx scripts/sync-agent-lore-to-registry.ts abraham
npx tsx scripts/sync-agent-lore-to-registry.ts solienne
npx tsx scripts/sync-agent-lore-to-registry.ts sue
npx tsx scripts/sync-agent-lore-to-registry.ts verdelis
```

### 4. MIYOMI Sovereign Deploy
```bash
cd ../miyomi-sovereign
npm run build  
vercel deploy --prod --alias miyomi.eden2.io
```

### 5. Academy SDK Integration
```bash
npm run build
vercel deploy --prod
```

### 6. Sovereign Sites
```bash
npx tsx scripts/create-sovereign-deployment.ts abraham
npx tsx scripts/create-sovereign-deployment.ts solienne  
npx tsx scripts/create-sovereign-deployment.ts sue
npx tsx scripts/create-sovereign-deployment.ts verdelis
```

## Verification

### Health Checks
```bash
curl https://eden-genesis-registry.vercel.app/api/health
curl https://eden-academy-flame.vercel.app/api/health
curl https://miyomi.eden2.io/api/health
curl https://abraham.eden2.io/api/health
curl https://solienne.eden2.io/api/health
curl https://sue.eden2.io/api/health
curl https://verdelis.eden2.io/api/health
```

### DNS Resolution
```bash
dig miyomi.eden2.io +short
dig abraham.eden2.io +short
dig solienne.eden2.io +short
dig sue.eden2.io +short  
dig verdelis.eden2.io +short
```

## Architecture Overview

```
eden2.io Ecosystem
├── Registry (Source of Truth)
│   ├── Agent profiles & lore
│   ├── JWT authentication  
│   └── API documentation
├── Academy (Training Hub)
│   ├── Agent profiles via Registry SDK
│   ├── Trainer dashboards
│   └── Cross-agent coordination
└── Sovereign Sites
    ├── miyomi.eden2.io (Live trading)
    ├── abraham.eden2.io (Philosophy & lore)
    ├── solienne.eden2.io (Consciousness studio)
    ├── sue.eden2.io (Design critique)
    └── verdelis.eden2.io (Environmental works)
```

## Success Criteria

### Foundation ✅
- [ ] Health score ≥ 95%
- [ ] 7+ trainers in system
- [ ] 8+ active agents
- [ ] 10+ sample works

### Registry ✅
- [ ] Production deployment live
- [ ] JWT authentication working
- [ ] All agent data synced
- [ ] API documentation accessible

### Academy ✅
- [ ] Registry SDK integration complete
- [ ] Trainer dashboards enabled
- [ ] Agent profiles loading from Registry
- [ ] Cross-agent navigation working

### Sovereign Sites ✅
- [ ] MIYOMI live trading interface
- [ ] ABRAHAM philosophy & covenant
- [ ] SOLIENNE consciousness studio  
- [ ] SUE design critique platform
- [ ] VERDELIS environmental manifesto

### Integration ✅
- [ ] DNS wildcard routing working
- [ ] Health endpoints responding
- [ ] Data flow Registry → Academy → Sovereign
- [ ] User journeys functional end-to-end

## Troubleshooting

### Common Issues
- **Port conflicts:** Use different ports for local testing
- **Build failures:** Check TypeScript/ESLint configs
- **DNS delays:** Allow 5-10 minutes for propagation
- **JWT issues:** Verify environment variables set

### Recovery Commands
```bash
# Reset health score
npx tsx scripts/migrate-trainer-data.ts

# Rebuild all
npm run build && vercel deploy --prod

# Check logs
vercel logs [deployment-url]
```

---

**Ready for Demo:** All components deployed and health-checked ✅