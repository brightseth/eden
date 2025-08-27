/**
 * Test Helpers
 * Common utilities and assertions for API testing
 */

import { ApiResponse } from './api-test-client';

/**
 * Assert successful response (2xx status)
 */
export function assertSuccess<T = any>(response: ApiResponse<T>, message?: string): asserts response is ApiResponse<T> & { data: T } {
  if (!response.ok || response.status < 200 || response.status >= 300) {
    throw new Error(
      message || `Expected success response, got ${response.status}: ${response.error}`
    );
  }
  if (response.data === undefined) {
    throw new Error('Expected response data but got undefined');
  }
}

/**
 * Assert error response
 */
export function assertError(response: ApiResponse, expectedStatus?: number, message?: string) {
  if (response.ok) {
    throw new Error(message || `Expected error response, but request succeeded`);
  }
  if (expectedStatus !== undefined && response.status !== expectedStatus) {
    throw new Error(
      message || `Expected status ${expectedStatus}, got ${response.status}`
    );
  }
}

/**
 * Assert response status code
 */
export function assertStatus(response: ApiResponse, expectedStatus: number, message?: string) {
  if (response.status !== expectedStatus) {
    throw new Error(
      message || `Expected status ${expectedStatus}, got ${response.status}`
    );
  }
}

/**
 * Assert response contains specific headers
 */
export function assertHeaders(response: ApiResponse, headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => {
    const actual = response.headers.get(key);
    if (actual !== value) {
      throw new Error(
        `Expected header ${key} to be "${value}", got "${actual}"`
      );
    }
  });
}

/**
 * Assert response time is within limits
 */
export function assertResponseTime(response: ApiResponse, maxMs: number, message?: string) {
  if (response.duration > maxMs) {
    throw new Error(
      message || `Response took ${response.duration}ms, expected less than ${maxMs}ms`
    );
  }
}

/**
 * Assert object has required properties
 */
export function assertProperties<T extends Record<string, any>>(
  obj: T,
  properties: Array<keyof T>,
  message?: string
) {
  properties.forEach(prop => {
    if (!(prop in obj)) {
      throw new Error(
        message || `Expected object to have property "${String(prop)}"`
      );
    }
  });
}

/**
 * Assert array length
 */
export function assertArrayLength<T>(
  arr: T[],
  expected: number | { min?: number; max?: number },
  message?: string
) {
  if (typeof expected === 'number') {
    if (arr.length !== expected) {
      throw new Error(
        message || `Expected array length ${expected}, got ${arr.length}`
      );
    }
  } else {
    if (expected.min !== undefined && arr.length < expected.min) {
      throw new Error(
        message || `Expected array length >= ${expected.min}, got ${arr.length}`
      );
    }
    if (expected.max !== undefined && arr.length > expected.max) {
      throw new Error(
        message || `Expected array length <= ${expected.max}, got ${arr.length}`
      );
    }
  }
}

/**
 * Retry a test function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    multiplier?: number;
    maxDelay?: number;
    shouldRetry?: (error: any, attempt: number) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    multiplier = 2,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: any;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !shouldRetry(error, attempt)) {
        throw error;
      }
      
      await sleep(currentDelay);
      currentDelay = Math.min(currentDelay * multiplier, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create test data factories
 */
export function createTestData<T>(defaults: T): (overrides?: Partial<T>) => T {
  return (overrides = {}) => ({
    ...defaults,
    ...overrides,
  });
}

/**
 * Measure execution time
 */
export async function measureTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { result, duration };
}

/**
 * Poll for a condition to be true
 */
export async function pollUntil(
  condition: () => boolean | Promise<boolean>,
  options: {
    timeout?: number;
    interval?: number;
    message?: string;
  } = {}
): Promise<void> {
  const {
    timeout = 30000,
    interval = 1000,
    message = 'Condition was not met within timeout',
  } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await sleep(interval);
  }

  throw new Error(message);
}

/**
 * Generate random test data
 */
export const random = {
  string: (length = 10): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  },
  
  number: (min = 0, max = 100): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  boolean: (): boolean => Math.random() > 0.5,
  
  email: (): string => `test.${random.string(8)}@example.com`,
  
  uuid: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  
  date: (start?: Date, end?: Date): Date => {
    const startTime = start?.getTime() || Date.now() - 365 * 24 * 60 * 60 * 1000; // 1 year ago
    const endTime = end?.getTime() || Date.now();
    return new Date(startTime + Math.random() * (endTime - startTime));
  },
  
  pick: <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  },
};