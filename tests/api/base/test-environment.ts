/**
 * Test Environment Configuration
 * Manages test environment setup and configuration
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

export type TestEnvironment = 'local' | 'development' | 'staging' | 'production';

export interface TestConfig {
  baseUrl: string;
  registryUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  timeout: number;
  retryAttempts: number;
  verbose: boolean;
  environment: TestEnvironment;
}

/**
 * Load environment configuration
 */
export function loadTestConfig(environment?: TestEnvironment): TestConfig {
  // Load environment variables
  const envFile = environment ? `.env.${environment}` : '.env.test';
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

  const env = environment || (process.env.TEST_ENV as TestEnvironment) || 'local';

  const config: TestConfig = {
    environment: env,
    baseUrl: process.env.TEST_BASE_URL || getDefaultBaseUrl(env),
    registryUrl: process.env.TEST_REGISTRY_URL || getDefaultRegistryUrl(env),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    timeout: parseInt(process.env.TEST_TIMEOUT || '30000', 10),
    retryAttempts: parseInt(process.env.TEST_RETRY_ATTEMPTS || '3', 10),
    verbose: process.env.TEST_VERBOSE === 'true',
  };

  validateConfig(config);
  return config;
}

/**
 * Get default base URL for environment
 */
function getDefaultBaseUrl(env: TestEnvironment): string {
  switch (env) {
    case 'local':
      return 'http://localhost:3000';
    case 'development':
      return 'https://eden-academy-dev.vercel.app';
    case 'staging':
      return 'https://eden-academy-staging.vercel.app';
    case 'production':
      return 'https://eden-academy-flame.vercel.app';
    default:
      return 'http://localhost:3000';
  }
}

/**
 * Get default Registry URL for environment
 */
function getDefaultRegistryUrl(env: TestEnvironment): string {
  switch (env) {
    case 'local':
      return 'http://localhost:3005';
    case 'development':
      return 'https://eden-genesis-registry-dev.vercel.app';
    case 'staging':
      return 'https://eden-genesis-registry-staging.vercel.app';
    case 'production':
      return 'https://eden-genesis-registry.vercel.app';
    default:
      return 'http://localhost:3005';
  }
}

/**
 * Validate configuration
 */
function validateConfig(config: TestConfig) {
  if (!config.baseUrl) {
    throw new Error('TEST_BASE_URL is required');
  }
  
  if (config.environment === 'production' && !process.env.PRODUCTION_TEST_CONFIRMED) {
    throw new Error(
      'Running tests against production requires PRODUCTION_TEST_CONFIRMED=true'
    );
  }
}

/**
 * Test data cleanup tracker
 */
class TestDataTracker {
  private cleanupFunctions: Array<() => Promise<void>> = [];

  /**
   * Register a cleanup function
   */
  registerCleanup(fn: () => Promise<void>) {
    this.cleanupFunctions.push(fn);
  }

  /**
   * Run all cleanup functions
   */
  async cleanup() {
    for (const fn of this.cleanupFunctions.reverse()) {
      try {
        await fn();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
    this.cleanupFunctions = [];
  }
}

export const testDataTracker = new TestDataTracker();

/**
 * Test fixtures
 */
export const fixtures = {
  agents: {
    abraham: {
      id: 'abraham',
      handle: 'abraham',
      name: 'Abraham',
      role: 'generative-artist',
    },
    solienne: {
      id: 'solienne',
      handle: 'solienne',
      name: 'Solienne',
      role: 'fashion-designer',
    },
    amanda: {
      id: 'amanda',
      handle: 'amanda', 
      name: 'Amanda',
      role: 'art-collector',
    },
    miyomi: {
      id: 'miyomi',
      handle: 'miyomi',
      name: 'Miyomi',
      role: 'market-predictor',
    },
  },
  
  testUser: {
    email: 'test@eden.art',
    password: 'test-password-123',
  },
};

/**
 * Setup test environment
 */
export async function setupTestEnvironment(environment?: TestEnvironment) {
  const config = loadTestConfig(environment);
  
  if (config.verbose) {
    console.log('Test Configuration:', {
      environment: config.environment,
      baseUrl: config.baseUrl,
      registryUrl: config.registryUrl,
    });
  }
  
  return config;
}

/**
 * Teardown test environment
 */
export async function teardownTestEnvironment() {
  await testDataTracker.cleanup();
}

/**
 * Skip test if condition is met
 */
export function skipIf(condition: boolean, message?: string) {
  if (condition) {
    const skipMessage = message || 'Test skipped due to condition';
    console.log(`⚠️  ${skipMessage}`);
    return true;
  }
  return false;
}

/**
 * Run only in specific environments
 */
export function runOnlyIn(environments: TestEnvironment[]) {
  const currentEnv = process.env.TEST_ENV || 'local';
  return !environments.includes(currentEnv as TestEnvironment);
}