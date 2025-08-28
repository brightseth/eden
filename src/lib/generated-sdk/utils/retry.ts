// Retry logic utilities for Registry SDK
// Following ADR-019 Registry Integration Pattern

export interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  exponentialBackoff?: boolean;
  retryableStatuses?: number[];
  retryableErrors?: string[];
}

export interface RetryResult<T> {
  data: T;
  attemptCount: number;
  totalDelay: number;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  exponentialBackoff: true,
  retryableStatuses: [500, 502, 503, 504, 408, 429],
  retryableErrors: ['AbortError', 'TimeoutError', 'NetworkError']
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<RetryResult<T>> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error;
  let totalDelay = 0;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      const data = await fn();
      return {
        data,
        attemptCount: attempt + 1,
        totalDelay
      };
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on the last attempt
      if (attempt === finalConfig.maxRetries) {
        break;
      }

      // Check if error is retryable
      if (!isRetryableError(error, finalConfig)) {
        break;
      }

      // Calculate delay for next attempt
      const delay = calculateDelay(attempt, finalConfig);
      totalDelay += delay;

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError!;
}

function isRetryableError(error: any, config: Required<RetryConfig>): boolean {
  // Check for HTTP status codes
  if (error.statusCode && config.retryableStatuses.includes(error.statusCode)) {
    return true;
  }

  // Check for error names/types
  if (error.name && config.retryableErrors.includes(error.name)) {
    return true;
  }

  // Check for specific error codes
  if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return true;
  }

  return false;
}

function calculateDelay(attempt: number, config: Required<RetryConfig>): number {
  let delay = config.baseDelay;

  if (config.exponentialBackoff) {
    // Exponential backoff with jitter
    delay = config.baseDelay * Math.pow(2, attempt);
    
    // Add random jitter (±25%)
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    delay += jitter;
  }

  // Cap at maximum delay
  return Math.min(delay, config.maxDelay);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Circuit breaker implementation for additional reliability
export class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private monitorWindow: number = 300000 // 5 minutes
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }

    // Reset failure count after monitor window
    setTimeout(() => {
      if (Date.now() - this.lastFailureTime >= this.monitorWindow) {
        this.failures = 0;
      }
    }, this.monitorWindow);
  }

  getState(): string {
    return this.state;
  }
}