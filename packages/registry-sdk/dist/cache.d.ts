interface CacheConfig {
    redisUrl?: string;
    defaultTTL?: number;
    keyPrefix?: string;
    enableCompression?: boolean;
    maxRetries?: number;
    connectTimeout?: number;
}
export declare class RegistryCache {
    private client;
    private config;
    private connected;
    private fallbackCache;
    constructor(config?: CacheConfig);
    private setupRedisHandlers;
    private getKey;
    private compress;
    private decompress;
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
    del(key: string): Promise<boolean>;
    invalidatePattern(pattern: string): Promise<number>;
    invalidateAgent(agentId: string): Promise<number>;
    invalidateCreations(agentId: string): Promise<number>;
    getStats(): Promise<{
        connected: boolean;
        redisInfo?: any;
        fallbackSize: number;
        hitRate?: number;
    }>;
    cleanupFallback(): number;
    healthCheck(): Promise<{
        redis: boolean;
        fallback: boolean;
        totalEntries: number;
    }>;
}
export declare const registryCache: RegistryCache;
export declare function cacheGet<T>(key: string): Promise<T | null>;
export declare function cacheSet<T>(key: string, value: T, ttl?: number): Promise<boolean>;
export declare function cacheInvalidate(key: string): Promise<boolean>;
export declare function cacheInvalidatePattern(pattern: string): Promise<number>;
export {};
