# CITIZEN Dune Analytics Integration - Migration Guide

## Overview
This guide covers the deployment of enhanced Dune Analytics integration for CITIZEN's market data system, providing comprehensive on-chain verification and market intelligence.

## Pre-Migration Checklist

### 1. API Key Configuration
```bash
# Required API Keys
DUNE_API_KEY=your_dune_analytics_api_key_here
OPENSEA_API_KEY=your_opensea_api_key_here  # Optional but recommended

# Feature Flags
ENABLE_CITIZEN_DUNE=true
ENABLE_DATA_VALIDATION=true
ENABLE_MOCK_DATA=false  # Set to true for testing

# Performance Tuning
DUNE_QUERY_TIMEOUT=60000
DUNE_CACHE_TTL=1800000
```

### 2. Dependencies
- No new npm packages required
- Uses existing fetch API and environment variables
- Feature flags system implemented

### 3. Database Changes
**No database migrations required** - all data is fetched from external APIs.

## Migration Steps

### Phase 1: Feature Flag Deployment
1. Deploy feature flags configuration
2. Set `ENABLE_CITIZEN_DUNE=false` in production initially
3. Verify mock data fallback works properly

### Phase 2: API Integration Testing
1. Configure Dune API key in staging environment
2. Run integration test: `npx tsx scripts/test-dune-integration.ts`
3. Verify data consistency between OpenSea and Dune sources
4. Test all query types (collections, holders, volume trends)

### Phase 3: Gradual Rollout
1. Enable `ENABLE_CITIZEN_DUNE=true` in staging
2. Monitor for 24 hours, check logs for errors
3. Enable in production with monitoring
4. Gradually increase query frequency

### Phase 4: Full Integration
1. Enable data validation with `ENABLE_DATA_VALIDATION=true`
2. Monitor consistency scores
3. Set up alerts for data discrepancies
4. Document any query ID updates needed

## Testing Procedures

### 1. Integration Test
```bash
# Run comprehensive test suite
npx tsx scripts/test-dune-integration.ts

# Expected output:
# - Configuration status
# - Dune data fetch verification
# - Market insights generation
# - Holder analysis accuracy
# - Data validation scores
```

### 2. API Endpoint Testing
```bash
# Test enhanced market endpoint
curl "http://localhost:3000/api/agents/citizen/market?stats=true&analysis=true"

# Expected fields in response:
# - dune_analytics.verification_status
# - dune_analytics.on_chain_metrics
# - data_validation.consistency_score
# - feature_flags.dune_integration
```

### 3. Performance Monitoring
- Monitor Dune API query execution times (target: <30s)
- Check cache hit rates for market data
- Verify graceful fallback to mock data
- Monitor API rate limits and costs

## Query ID Configuration

### Current Estimated Query IDs
Based on typical Bright Moments dashboard structure:
```typescript
collections_overview: 2156789,    // Bright Moments Collection Stats
sales_history: 2156790,          // CryptoCitizens Sales & Price History  
holder_analysis: 2156791,        // Full Set & Multi-Collection Holders
volume_trends: 2156792,          // Daily/Weekly Volume Trends
floor_price_tracking: 2156793,   // Floor Price Movement Analysis
city_performance: 2156794        // Individual City Performance Metrics
```

### Finding Actual Query IDs
1. Visit https://dune.com/cat/bright-moments
2. Inspect network requests when dashboard loads
3. Look for API calls to `/api/v1/query/{id}/execute`
4. Update query IDs in `src/lib/agents/citizen-dune-integration.ts`

## Rollback Strategy

### Automatic Rollback Triggers
- 5 consecutive Dune API failures
- Query timeout exceeded (>60 seconds)
- Data consistency score below 50%
- Memory usage spike due to large datasets

### Manual Rollback Steps
1. Set `ENABLE_CITIZEN_DUNE=false` in environment
2. Restart application servers
3. Verify fallback to OpenSea + mock data
4. Monitor for stability return

### Recovery Process
1. Investigate root cause (API limits, query issues, etc.)
2. Update query IDs or timeout configurations
3. Test in staging environment
4. Gradual re-enable with monitoring

## Monitoring & Alerts

### Key Metrics to Track
- Dune API response times
- Data consistency scores
- Feature flag usage rates
- Error rates by query type
- Cache hit/miss ratios

### Recommended Alerts
- Data consistency < 70% for >1 hour
- Dune API errors > 5 in 10 minutes  
- Query timeout rate > 10%
- Missing Full Set holder data

## Cost Considerations

### Dune Analytics Costs
- Query execution costs based on compute usage
- Recommend caching results for 30 minutes
- Monitor monthly API usage limits
- Consider query optimization for large datasets

### Expected Usage
- ~6 queries per market data request
- 30-minute cache reduces API calls by 95%
- Estimated cost: $20-50/month for moderate usage

## Security Considerations

### API Key Management
- Store Dune API key in secure environment variables
- Rotate keys quarterly
- Monitor for unauthorized usage
- Use read-only API permissions where possible

### Data Privacy
- No personal data stored or transmitted
- Only public blockchain data accessed
- Comply with API terms of service

## Support & Troubleshooting

### Common Issues
1. **Query timeout**: Increase `DUNE_QUERY_TIMEOUT` or optimize queries
2. **Data inconsistency**: Check query logic and OpenSea API status
3. **Rate limits**: Implement exponential backoff
4. **Cache issues**: Clear cache and verify TTL settings

### Debug Commands
```bash
# Check feature flag status
curl "http://localhost:3000/api/agents/citizen/market" | jq .feature_flags

# Test specific collection
curl "http://localhost:3000/api/agents/citizen/market?city=venice&analysis=true"

# Validate data consistency
curl "http://localhost:3000/api/agents/citizen/market" | jq .data_validation
```

## Post-Migration Validation

### Success Criteria
- [x] Feature flags properly control integration
- [x] Dune data fetches successfully with live API key
- [x] Mock data fallback works without API key
- [x] Enhanced market insights include on-chain metrics
- [x] Data validation provides consistency scores
- [x] Integration test passes all checks
- [x] API responses include Dune verification status

### Performance Targets
- Query execution: <30 seconds average
- Data consistency: >85% score
- Cache effectiveness: >90% hit rate
- Error rate: <1% of requests

## Documentation Updates

### Files Modified
- `src/lib/agents/citizen-dune-integration.ts` - Enhanced query system
- `src/lib/agents/citizen-market-data.ts` - Integrated Dune data
- `src/app/api/agents/citizen/market/route.ts` - Enhanced API response
- `config/flags.ts` - Feature flag configuration
- `.env.example` - API key documentation

### New Files Created
- `scripts/test-dune-integration.ts` - Integration testing
- `docs/CITIZEN-DUNE-MIGRATION-GUIDE.md` - This guide

## Future Enhancements

### Phase 2 Features
- Real-time WebSocket updates from Dune
- Advanced holder tracking (Full Set → Ultra Set transitions)
- Predictive market modeling using historical trends
- Cross-collection arbitrage opportunities

### Query Optimization
- Parameterized queries for specific date ranges
- Aggregated views for faster response times
- Materialized views for common data patterns

---

**Migration Owner**: Eden Academy Development Team  
**Review Date**: 2024-08-27  
**Next Review**: 2024-09-27