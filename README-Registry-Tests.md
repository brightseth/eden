# Eden Registry Integration Test Suite

Comprehensive testing framework for validating Registry integration across all Eden Academy services.

## Overview

This test suite validates that every service depending upon the Eden Registry is working correctly after Amanda's Registry integration where:

- Registry is running on localhost:3005 in development
- Registry serves as single source of truth for agent configurations  
- Amanda's complete profile (personality, capabilities, operational config) is stored in Registry
- Services gracefully handle Registry connectivity and data validation

## Test Categories

### 1. Integration Tests (`src/__tests__/registry/integration.test.ts`)
Tests Registry connectivity, health monitoring, and data integrity:
- ✅ Registry health checks and monitoring
- ✅ Data validation across all consuming services
- ✅ Feature flag behavior (ENABLE_REGISTRY_SYNC)
- ✅ Amanda agent profile completeness
- ✅ Error handling and resilience

### 2. Contract Tests (`src/__tests__/registry/contract.test.ts`)
Validates API contracts between Registry and consuming services:
- ✅ API endpoint response format validation
- ✅ Data schema compliance using Zod
- ✅ Backward compatibility checks
- ✅ Error response format validation
- ✅ Data type consistency across endpoints

### 3. Fallback Tests (`src/__tests__/registry/fallback.test.ts`)
Tests graceful degradation when Registry is unavailable:
- ✅ Network failure handling and retries
- ✅ Server error handling (500, timeout)
- ✅ Feature flag fallback behavior
- ✅ Health monitor degradation logic
- ✅ Recovery and resilience testing

### 4. End-to-End Tests (`src/__tests__/registry/e2e.test.ts`)
Complete workflow validation across all consuming services:
- ✅ Academy UI integration workflow
- ✅ API endpoint serving workflow
- ✅ Amanda dynamic prototype configuration loading
- ✅ Future agent deployment readiness
- ✅ Cross-service data consistency
- ✅ Production scenario simulation

## Running Tests

### Quick Start
```bash
# Run all Registry tests
npm run test:registry

# Run specific test categories
npm run test:registry:integration
npm run test:registry:contract
npm run test:registry:fallback
npm run test:registry:e2e
```

### Detailed Commands
```bash
# Run with verbose output
VERBOSE=1 npm run test:registry

# Force tests even if Registry health check fails
FORCE_TESTS=true npm run test:registry

# Run specific test suite only
node scripts/test-registry.js integration

# Run multiple test suites
node scripts/test-registry.js contract fallback
```

### Production Readiness Validation
```bash
# Comprehensive pre-deployment validation
npm run test:production-ready

# Validates:
# - Environment configuration
# - Registry health & connectivity  
# - Service integration points
# - Data integrity
# - Security configuration
# - Performance requirements
```

## Test Infrastructure

### Environment Setup
Tests require these environment variables:
```bash
USE_REGISTRY=true
REGISTRY_BASE_URL=http://localhost:3005/api/v1
ENABLE_REGISTRY_SYNC=true  # For Registry sync tests
```

### Registry Requirements
- Registry must be running on localhost:3005
- Amanda agent must be configured with complete profile
- Health endpoint (`/api/v1/health`) must be accessible
- Critical endpoints must be responding

### Test Data Expectations
Tests validate that Amanda agent has:
- Complete profile (bio, avatar_url, description)
- Defined capabilities array
- Operational configuration object  
- Personality configuration object
- Valid agent status (`active`, `training`, or `launched`)

## Services Tested

### 1. Academy UI (eden-academy)
- ✅ Agent profile display workflow
- ✅ Agent discovery and listing
- ✅ Profile page data loading
- ✅ UI-specific data transformation

### 2. Amanda Dynamic Prototype
- ✅ Configuration loading from Registry
- ✅ Personality and capabilities validation
- ✅ Operational configuration parsing
- ✅ Configuration update handling

### 3. API Endpoints
- ✅ Public API data serving
- ✅ External service consumption
- ✅ API response format validation
- ✅ Metadata and versioning

### 4. Future Agent Deployments
- ✅ Agent readiness validation framework
- ✅ Deployment quality gates
- ✅ Cross-cohort validation
- ✅ Production readiness scoring

## Architecture Validation

### Registry as Single Source of Truth
- ✅ No static mappings in Academy UI
- ✅ Generated SDK usage only (no raw fetch)
- ✅ Feature flags for rollback control
- ✅ Contract tests for API stability

### Data Flow Validation
```
Registry (Source of Truth)
    ↓ API calls via SDK
Academy UI (Consumer)
    ↓ API calls via SDK  
Standalone Agent (Consumer + Producer)
```

### Error Handling Patterns
- ✅ Retry logic with exponential backoff
- ✅ Circuit breaker pattern in health monitor
- ✅ Graceful degradation messaging
- ✅ Feature flag controlled fallbacks

## Performance Requirements

Tests validate:
- **Single requests**: < 1000ms response time
- **Concurrent requests**: 90%+ success rate under load
- **Health monitoring**: < 500ms health check latency
- **Recovery time**: < 5s after Registry restoration

## Monitoring and Observability

Tests verify:
- ✅ Health monitor tracks consecutive failures
- ✅ Registry status transitions (healthy → degraded → critical)
- ✅ Telemetry and logging for debugging
- ✅ Metrics collection for monitoring dashboards

## Rollback Strategy

Tests validate rollback scenarios:
- ✅ `ENABLE_REGISTRY_SYNC=false` disables Registry access
- ✅ Agents revert to local operation mode
- ✅ No data corruption during Registry unavailability
- ✅ Immediate recovery when Registry comes back online

## Common Issues and Solutions

### Registry Not Running
```bash
Error: Registry health check failed
Solution: Ensure Registry is running on localhost:3005
```

### Missing Test Data
```bash
Error: Amanda agent data incomplete
Solution: Verify Amanda agent has complete profile in Registry
```

### Environment Variables
```bash
Error: Registry is not enabled
Solution: Set USE_REGISTRY=true and ENABLE_REGISTRY_SYNC=true
```

### Timeout Issues
```bash
Error: Request timeout
Solution: Check Registry performance, increase timeout if needed
```

## Contributing

When adding new Registry-dependent services:

1. **Add service tests** to appropriate test category
2. **Update contract tests** for new API endpoints  
3. **Add fallback tests** for new failure modes
4. **Include E2E workflow** for service integration
5. **Update production readiness** validation

### Test Development Guidelines

- **Use Registry client SDK** - never raw fetch calls
- **Mock external dependencies** - focus on Registry integration
- **Test error scenarios** - network failures, timeouts, etc.
- **Validate data integrity** - schema compliance and consistency
- **Include performance tests** - response times and load handling

## Support

For issues with Registry tests:
- Check Registry health: `curl http://localhost:3005/api/v1/health`
- Review test output: `VERBOSE=1 npm run test:registry`
- Validate environment: `npm run test:production-ready`
- Check ADRs: `docs/adr/019-registry-integration-pattern.md`