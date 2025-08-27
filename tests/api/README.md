# Eden Academy API Testing Framework

A comprehensive testing framework for the Eden Academy API endpoints, providing robust testing utilities, environment management, and test automation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test:api

# Run specific test suite
npm run test:api -- agents

# Run tests with coverage
npm run test:api:coverage

# Watch mode for development
npm run test:api -- --watch
```

## 📁 Project Structure

```
tests/api/
├── base/                      # Core testing utilities
│   ├── api-test-client.ts    # HTTP client for API requests
│   ├── test-helpers.ts       # Common assertions and utilities
│   └── test-environment.ts   # Environment configuration
├── agents/                    # Agent API tests
│   └── agents.test.ts
├── works/                     # Works API tests
│   └── works.test.ts
├── health/                    # Health check tests
│   └── health.test.ts
├── registry/                  # Registry integration tests
│   └── registry.test.ts
├── jest.config.js            # Jest configuration
├── setup.ts                  # Global test setup
├── run-tests.ts              # CLI test runner
├── .env.test                 # Test environment template
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Setup

1. Copy the environment template:
```bash
cp .env.test .env.test.local
```

2. Update the values in `.env.test.local`:
```env
TEST_BASE_URL=http://localhost:3000
TEST_REGISTRY_URL=http://localhost:3005
NEXT_PUBLIC_SUPABASE_URL=your-test-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-supabase-key
```

### Available Environments

- `local` - Local development (default)
- `development` - Development server
- `staging` - Staging environment
- `production` - Production (requires confirmation)

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { ApiTestClient } from '../base/api-test-client';
import { assertSuccess, assertStatus } from '../base/test-helpers';
import { setupTestEnvironment } from '../base/test-environment';

describe('My API Tests', () => {
  let client: ApiTestClient;

  beforeAll(async () => {
    const config = await setupTestEnvironment();
    client = new ApiTestClient(config.baseUrl + '/api');
  });

  it('should test something', async () => {
    const response = await client.get('/endpoint');
    
    assertSuccess(response);
    assertStatus(response, 200);
    expect(response.data).toHaveProperty('expectedField');
  });
});
```

### Using Test Helpers

```typescript
import {
  assertSuccess,
  assertError,
  assertStatus,
  assertProperties,
  assertArrayLength,
  assertResponseTime,
  retry,
  random,
} from '../base/test-helpers';

// Assert successful response
assertSuccess(response);

// Assert specific status
assertStatus(response, 200);

// Assert response time
assertResponseTime(response, 2000); // Max 2 seconds

// Assert object properties
assertProperties(response.data, ['id', 'name', 'email']);

// Assert array length
assertArrayLength(response.data.items, { min: 1, max: 10 });

// Retry with exponential backoff
const result = await retry(
  async () => client.get('/flaky-endpoint'),
  { maxAttempts: 3, delay: 1000 }
);

// Generate random test data
const testUser = {
  email: random.email(),
  name: random.string(10),
  age: random.number(18, 65),
};
```

### API Test Client

The `ApiTestClient` provides a clean interface for making HTTP requests:

```typescript
const client = new ApiTestClient('http://localhost:3000/api');

// GET request
const response = await client.get('/users');

// POST request
const response = await client.post('/users', {
  name: 'Test User',
  email: 'test@example.com'
});

// PUT request
const response = await client.put('/users/123', {
  name: 'Updated Name'
});

// DELETE request
const response = await client.delete('/users/123');

// With query parameters
const response = await client.get('/users', {
  query: { page: 1, limit: 10 }
});

// With custom headers
const response = await client.get('/protected', {
  headers: { Authorization: 'Bearer token' }
});

// With timeout
const response = await client.get('/slow-endpoint', {
  timeout: 5000 // 5 seconds
});
```

## 🧪 Test Suites

### Agents API Tests
Tests for agent management endpoints:
- List agents with pagination and filtering
- Get agent details
- Agent works and metrics
- Agent-specific endpoints (Abraham, Solienne, Miyomi)

### Works API Tests
Tests for creative works endpoints:
- List works with filtering and sorting
- Get work details
- Publish works
- Search and discovery
- Batch operations

### Health Check Tests
Tests for system health monitoring:
- Basic health checks
- Service status monitoring
- Registry health
- Readiness and liveness probes

### Registry Integration Tests
Tests for Registry service integration:
- Registry connectivity
- Data synchronization
- Fallback behavior
- Contract validation

## 🏃 Running Tests

### Command Line Interface

```bash
# Run all tests
npx ts-node tests/api/run-tests.ts run

# Run specific suite
npx ts-node tests/api/run-tests.ts run agents

# Run with options
npx ts-node tests/api/run-tests.ts run \
  --env development \
  --verbose \
  --bail

# List available suites
npx ts-node tests/api/run-tests.ts list

# Generate coverage report
npx ts-node tests/api/run-tests.ts coverage
```

### NPM Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test:api": "ts-node tests/api/run-tests.ts run",
    "test:api:agents": "ts-node tests/api/run-tests.ts run agents",
    "test:api:works": "ts-node tests/api/run-tests.ts run works",
    "test:api:health": "ts-node tests/api/run-tests.ts run health",
    "test:api:coverage": "ts-node tests/api/run-tests.ts coverage",
    "test:api:watch": "ts-node tests/api/run-tests.ts run --watch"
  }
}
```

### CI/CD Integration

```yaml
# GitHub Actions example
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run API tests
        run: npm run test:api
        env:
          TEST_ENV: development
          TEST_BASE_URL: ${{ secrets.TEST_BASE_URL }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## 🔍 Testing Patterns

### Testing Pagination

```typescript
it('should support pagination', async () => {
  const page1 = await client.get('/items', {
    query: { page: 1, limit: 10 }
  });
  
  const page2 = await client.get('/items', {
    query: { page: 2, limit: 10 }
  });
  
  // Ensure different results
  expect(page1.data[0].id).not.toBe(page2.data[0].id);
});
```

### Testing Filters

```typescript
it('should filter by status', async () => {
  const response = await client.get('/items', {
    query: { status: 'active' }
  });
  
  response.data.forEach(item => {
    expect(item.status).toBe('active');
  });
});
```

### Testing Error Handling

```typescript
it('should handle 404 errors', async () => {
  const response = await client.get('/items/non-existent');
  
  assertError(response, 404);
  expect(response.data?.error).toContain('not found');
});
```

### Testing Authentication

```typescript
it('should require authentication', async () => {
  const response = await client.get('/protected');
  
  assertError(response, 401);
});

it('should access protected endpoint with auth', async () => {
  const response = await client.get('/protected', {
    headers: { Authorization: 'Bearer valid-token' }
  });
  
  assertSuccess(response);
});
```

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  // Start async operation
  const startResponse = await client.post('/jobs', {
    type: 'process-data'
  });
  
  const jobId = startResponse.data.jobId;
  
  // Poll for completion
  await pollUntil(
    async () => {
      const status = await client.get(`/jobs/${jobId}`);
      return status.data.status === 'completed';
    },
    { timeout: 30000, interval: 1000 }
  );
  
  // Verify results
  const result = await client.get(`/jobs/${jobId}/result`);
  assertSuccess(result);
});
```

## 🎯 Best Practices

1. **Use descriptive test names**: Clearly describe what is being tested
2. **Test one thing at a time**: Each test should focus on a single behavior
3. **Clean up test data**: Use afterAll hooks to clean up created resources
4. **Use fixtures**: Define reusable test data in fixtures
5. **Handle async properly**: Always await async operations
6. **Test edge cases**: Include tests for error conditions and boundaries
7. **Mock external services**: Use mocks for third-party services when appropriate
8. **Keep tests independent**: Tests should not depend on each other
9. **Use appropriate timeouts**: Set reasonable timeouts for different operations
10. **Document special requirements**: Note any special setup or permissions needed

## 🐛 Debugging

### Enable Verbose Output

```bash
TEST_VERBOSE=true npm run test:api
```

### Debug Specific Test

```bash
npm run test:api -- --grep "should return agent details"
```

### Inspect Network Requests

Set `TEST_VERBOSE=true` to log all HTTP requests and responses.

### Use Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest tests/api/agents/agents.test.ts
```

## 📊 Coverage Reports

Generate and view coverage reports:

```bash
npm run test:api:coverage
open tests/api/coverage/lcov-report/index.html
```

## 🤝 Contributing

1. Write tests for new API endpoints
2. Update existing tests when APIs change
3. Maintain test coverage above 80%
4. Follow the established patterns
5. Document any special test requirements

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [API Testing Guide](https://www.postman.com/api-testing/)

## 🆘 Troubleshooting

### Tests timing out
- Increase timeout in jest.config.js or specific tests
- Check if services are running (API server, Registry, etc.)

### Environment variables not loading
- Ensure .env.test.local exists with correct values
- Check file permissions

### Database connection errors
- Verify Supabase credentials
- Check if using correct test database

### Registry connection failures
- Ensure Registry is running on expected port
- Check REGISTRY_BASE_URL configuration

For more help, check the logs with `TEST_VERBOSE=true` or open an issue.