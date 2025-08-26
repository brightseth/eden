// Redis Caching Layer for Registry Gateway
// Provides high-performance distributed caching with TTL and invalidation

let createClient: any
let RedisClientType: any

// Dynamic import for server-side only
if (typeof window === 'undefined') {
  try {
    const redis = require('redis')
    createClient = redis.createClient
    RedisClientType = redis.RedisClientType
  } catch (error) {
    console.warn('[Cache] Redis not available, using fallback cache only')
  }
}

interface CacheConfig {
  redisUrl?: string;
  defaultTTL?: number; // seconds
  keyPrefix?: string;
  enableCompression?: boolean;
  maxRetries?: number;
  connectTimeout?: number;
}

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttl: number;
}

export class RegistryCache {
  private client: any;
  private config: CacheConfig;
  private connected: boolean = false;
  private fallbackCache: Map<string, CacheEntry<any>> = new Map();

  constructor(config: CacheConfig = {}) {
    this.config = {
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      defaultTTL: 300, // 5 minutes
      keyPrefix: 'registry:',
      enableCompression: true,
      maxRetries: 3,
      connectTimeout: 5000,
      ...config
    };

    // Only create Redis client on server-side
    if (typeof window === 'undefined' && createClient) {
      this.client = createClient({
        url: this.config.redisUrl,
        socket: {
          connectTimeout: this.config.connectTimeout,
          lazyConnect: true,
        }
      });

      this.setupRedisHandlers();
    }
  }

  private setupRedisHandlers(): void {
    if (!this.client) return;
    
    this.client.on('connect', () => {
      console.log('[Cache] Redis connecting...');
    });

    this.client.on('ready', () => {
      console.log('[Cache] Redis connected and ready');
      this.connected = true;
    });

    this.client.on('error', (error) => {
      console.error('[Cache] Redis error:', error);
      this.connected = false;
    });

    this.client.on('end', () => {
      console.log('[Cache] Redis connection ended');
      this.connected = false;
    });
  }

  private getKey(key: string): string {
    return `${this.config.keyPrefix}${key}`;
  }

  private compress(data: any): string {
    if (!this.config.enableCompression) {
      return JSON.stringify(data);
    }
    
    // Simple compression - in production, use a proper compression library
    const json = JSON.stringify(data);
    return json.length > 1000 ? `compressed:${json}` : json;
  }

  private decompress(data: string): any {
    if (!this.config.enableCompression) {
      return JSON.parse(data);
    }
    
    if (data.startsWith('compressed:')) {
      return JSON.parse(data.substring(11));
    }
    
    return JSON.parse(data);
  }

  async connect(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      if (!this.connected) {
        await this.client.connect();
      }
      return true;
    } catch (error) {
      console.error('[Cache] Failed to connect to Redis:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connected) {
        await this.client.quit();
      }
    } catch (error) {
      console.error('[Cache] Error disconnecting from Redis:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const redisKey = this.getKey(key);
    
    try {
      // Try Redis first
      if (this.connected) {
        const cached = await this.client.get(redisKey);
        if (cached) {
          const data = this.decompress(cached);
          console.log(`[Cache] Redis hit for key: ${key}`);
          return data;
        }
      }

      // Fallback to in-memory cache
      const fallback = this.fallbackCache.get(key);
      if (fallback) {
        const now = Date.now();
        if (now - fallback.cachedAt < fallback.ttl * 1000) {
          console.log(`[Cache] Fallback hit for key: ${key}`);
          return fallback.data;
        } else {
          // Expired
          this.fallbackCache.delete(key);
        }
      }

      console.log(`[Cache] Miss for key: ${key}`);
      return null;
    } catch (error) {
      console.error(`[Cache] Error getting key ${key}:`, error);
      
      // Try fallback cache
      const fallback = this.fallbackCache.get(key);
      return fallback?.data || null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const finalTTL = ttl || this.config.defaultTTL!;
    const redisKey = this.getKey(key);
    
    try {
      // Set in Redis
      if (this.connected) {
        const serialized = this.compress(value);
        await this.client.setEx(redisKey, finalTTL, serialized);
      }

      // Always set in fallback cache
      this.fallbackCache.set(key, {
        data: value,
        cachedAt: Date.now(),
        ttl: finalTTL
      });

      console.log(`[Cache] Set key: ${key} (TTL: ${finalTTL}s)`);
      return true;
    } catch (error) {
      console.error(`[Cache] Error setting key ${key}:`, error);
      
      // At least save in fallback
      this.fallbackCache.set(key, {
        data: value,
        cachedAt: Date.now(),
        ttl: finalTTL
      });
      
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    const redisKey = this.getKey(key);
    
    try {
      // Delete from Redis
      if (this.connected) {
        await this.client.del(redisKey);
      }

      // Delete from fallback
      this.fallbackCache.delete(key);

      console.log(`[Cache] Deleted key: ${key}`);
      return true;
    } catch (error) {
      console.error(`[Cache] Error deleting key ${key}:`, error);
      
      // At least delete from fallback
      this.fallbackCache.delete(key);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    let deletedCount = 0;
    
    try {
      // Redis pattern deletion
      if (this.connected) {
        const keys = await this.client.keys(`${this.config.keyPrefix}${pattern}`);
        if (keys.length > 0) {
          await this.client.del(keys);
          deletedCount += keys.length;
        }
      }

      // Fallback pattern deletion
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      for (const key of this.fallbackCache.keys()) {
        if (regex.test(key)) {
          this.fallbackCache.delete(key);
          deletedCount++;
        }
      }

      console.log(`[Cache] Invalidated ${deletedCount} keys matching pattern: ${pattern}`);
      return deletedCount;
    } catch (error) {
      console.error(`[Cache] Error invalidating pattern ${pattern}:`, error);
      return deletedCount;
    }
  }

  // Invalidate all agent-related cache when agent is updated
  async invalidateAgent(agentId: string): Promise<number> {
    return this.invalidatePattern(`agent-${agentId}*`);
  }

  // Invalidate creation cache when new creation is added
  async invalidateCreations(agentId: string): Promise<number> {
    return this.invalidatePattern(`creations-${agentId}*`);
  }

  // Get cache statistics
  async getStats(): Promise<{
    connected: boolean;
    redisInfo?: any;
    fallbackSize: number;
    hitRate?: number;
  }> {
    const stats: any = {
      connected: this.connected,
      fallbackSize: this.fallbackCache.size
    };

    try {
      if (this.connected) {
        const info = await this.client.info('stats');
        const lines = info.split('\r\n');
        const redisStats: any = {};
        
        for (const line of lines) {
          if (line.includes(':')) {
            const [key, value] = line.split(':');
            redisStats[key] = value;
          }
        }
        
        stats.redisInfo = redisStats;
        
        // Calculate hit rate
        const hits = parseInt(redisStats.keyspace_hits || '0');
        const misses = parseInt(redisStats.keyspace_misses || '0');
        if (hits + misses > 0) {
          stats.hitRate = (hits / (hits + misses)) * 100;
        }
      }
    } catch (error) {
      console.error('[Cache] Error getting Redis stats:', error);
    }

    return stats;
  }

  // Cleanup expired fallback cache entries
  cleanupFallback(): number {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.fallbackCache.entries()) {
      if (now - entry.cachedAt > entry.ttl * 1000) {
        this.fallbackCache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned up ${cleaned} expired fallback entries`);
    }
    
    return cleaned;
  }

  // Health check
  async healthCheck(): Promise<{
    redis: boolean;
    fallback: boolean;
    totalEntries: number;
  }> {
    let redisHealthy = false;
    
    try {
      if (this.connected) {
        await this.client.ping();
        redisHealthy = true;
      }
    } catch (error) {
      console.error('[Cache] Redis health check failed:', error);
    }
    
    return {
      redis: redisHealthy,
      fallback: true,
      totalEntries: this.fallbackCache.size
    };
  }
}

// Export singleton instance
export const registryCache = new RegistryCache();

// Initialize connection (server-side only)
if (typeof window === 'undefined') {
  registryCache.connect().catch(console.error);

  // Cleanup interval for fallback cache
  setInterval(() => {
    registryCache.cleanupFallback();
  }, 60000); // Every minute
}

// Convenience functions
export async function cacheGet<T>(key: string): Promise<T | null> {
  return registryCache.get<T>(key);
}

export async function cacheSet<T>(key: string, value: T, ttl?: number): Promise<boolean> {
  return registryCache.set(key, value, ttl);
}

export async function cacheInvalidate(key: string): Promise<boolean> {
  return registryCache.del(key);
}

export async function cacheInvalidatePattern(pattern: string): Promise<number> {
  return registryCache.invalidatePattern(pattern);
}