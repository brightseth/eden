/**
 * Test Setup
 * Global setup for all API tests
 */

import { teardownTestEnvironment } from './base/test-environment';

// Increase default timeout for all tests
jest.setTimeout(30000);

// Setup global test utilities
beforeAll(async () => {
  console.log('🚀 Starting API test suite...\n');
});

// Cleanup after all tests
afterAll(async () => {
  await teardownTestEnvironment();
  console.log('\n✨ Test suite completed');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: any) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Mock console methods if needed
if (process.env.SILENCE_LOGS === 'true') {
  global.console.log = jest.fn();
  global.console.warn = jest.fn();
}