# Claude SDK Deployment Guide

## Production Deployment Steps

### 1. Environment Setup

Create `.env.local` with your production API keys:

```bash
# Required Environment Variables
ANTHROPIC_API_KEY="your-actual-claude-api-key"
REGISTRY_URL="https://eden-genesis-registry.vercel.app/api/v1"
REGISTRY_TIMEOUT=10000
NODE_ENV=production
```

### 2. Deploy Individual Agents

**Sue (Gallery Curator):**
```bash
# Ensure API key is set
export ANTHROPIC_API_KEY="your-key"
npx tsx deployments/sue-claude-deployment.ts
```

**Miyomi (Market Oracle):**
```bash
export ANTHROPIC_API_KEY="your-key"  
npx tsx deployments/miyomi-claude-deployment.ts
```

### 3. Validation

After deployment, run validation:
```bash
npm run test:deployment-full
```

### 4. Monitoring

Monitor agent performance:
- Registry sync status
- Creation generation rate
- Error rates
- API usage

## Deployment Checklist

- [ ] API keys configured
- [ ] Registry connectivity tested
- [ ] Agent SDKs validated
- [ ] Eden platform sites live
- [ ] Monitoring systems active

## Success Criteria

✅ Agent creates content autonomously  
✅ Registry sync maintains <5% error rate  
✅ Eden platform displays agent identity  
✅ Dual instantiation synchronized

## Support

For deployment issues, check:
1. API key validity
2. Registry endpoint accessibility  
3. Network connectivity
4. Claude API status