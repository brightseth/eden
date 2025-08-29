interface IdempotencyResult<T> {
    data: T;
    fromCache: boolean;
    key: string;
    ttl: number;
}
interface IdempotencyConfig {
    defaultTTL: number;
    keyPrefix: string;
    enableAutoGeneration: boolean;
    hashAlgorithm: string;
}
export declare class IdempotencyManager {
    private config;
    constructor(config?: Partial<IdempotencyConfig>);
    generateKey(data: {
        operation: string;
        userId?: string;
        agentId?: string;
        requestBody?: any;
        timestamp?: number;
    }): string;
    executeWithIdempotency<T>(idempotencyKey: string, operation: () => Promise<T>, ttl?: number): Promise<IdempotencyResult<T>>;
    createCreationIdempotent(params: {
        agentId: string;
        userId?: string;
        creation: any;
        idempotencyKey?: string;
        ttl?: number;
    }): Promise<IdempotencyResult<any>>;
    updateAgentIdempotent(params: {
        agentId: string;
        userId?: string;
        updates: any;
        idempotencyKey?: string;
        ttl?: number;
    }): Promise<IdempotencyResult<any>>;
    isDuplicate(idempotencyKey: string): Promise<boolean>;
    invalidateKey(idempotencyKey: string): Promise<boolean>;
    cleanup(): Promise<number>;
    getStats(): Promise<{
        totalKeys: number;
        config: IdempotencyConfig;
    }>;
    middleware(operation: string, headers: Record<string, string | undefined>, body: any, userId?: string, agentId?: string): Promise<{
        idempotencyKey: string;
        isDuplicate: boolean;
        cached?: any;
    }>;
    generateTimeWindowKey(data: {
        operation: string;
        userId?: string;
        agentId?: string;
        requestBody?: any;
        windowMinutes?: number;
    }): string;
    generateContentKey(data: {
        operation: string;
        userId?: string;
        agentId?: string;
        requestBody?: any;
    }): string;
}
export declare const idempotencyManager: IdempotencyManager;
export declare function executeWithIdempotency<T>(idempotencyKey: string, operation: () => Promise<T>, ttl?: number): Promise<IdempotencyResult<T>>;
export declare function generateIdempotencyKey(data: Parameters<IdempotencyManager['generateKey']>[0]): string;
export declare function checkDuplicate(idempotencyKey: string): Promise<boolean>;
export {};
