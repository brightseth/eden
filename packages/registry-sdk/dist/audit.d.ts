interface AuditEvent {
    timestamp: string;
    traceId: string;
    operation: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    userId?: string;
    userEmail?: string;
    userRole?: string;
    agentId?: string;
    requestHeaders: Record<string, string>;
    requestBody?: any;
    responseStatus: number;
    responseTime: number;
    error?: string;
    metadata?: Record<string, unknown>;
}
interface AuditConfig {
    enableConsoleLog: boolean;
    enableFileLog: boolean;
    enableRemoteLog: boolean;
    logDirectory: string;
    maxFileSize: number;
    rotateDaily: boolean;
    includeHeaders: string[];
    excludeHeaders: string[];
    remoteLogUrl?: string;
}
export declare class AuditLogger {
    private config;
    private logBuffer;
    private flushInterval;
    constructor(config?: Partial<AuditConfig>);
    private ensureLogDirectory;
    private filterHeaders;
    private generateTraceId;
    logOperation(params: {
        operation: string;
        method: AuditEvent['method'];
        endpoint: string;
        userId?: string;
        userEmail?: string;
        userRole?: string;
        agentId?: string;
        requestHeaders: Record<string, string | undefined>;
        requestBody?: any;
        responseStatus: number;
        responseTime: number;
        error?: string;
        metadata?: Record<string, unknown>;
        traceId?: string;
    }): Promise<void>;
    private sanitizeRequestBody;
    private logToConsole;
    private flushBuffer;
    private writeToFile;
    private sendToRemote;
    auditGatewayCall(params: {
        operation: string;
        endpoint: string;
        method: AuditEvent['method'];
        headers: Record<string, string | undefined>;
        body?: any;
        responseStatus: number;
        responseTime: number;
        userId?: string;
        userEmail?: string;
        error?: string;
        traceId?: string;
    }): Promise<void>;
    auditAuthEvent(params: {
        operation: 'login' | 'logout' | 'token_validation' | 'permission_check';
        userEmail?: string;
        userId?: string;
        success: boolean;
        error?: string;
        metadata?: Record<string, unknown>;
    }): Promise<void>;
    auditCacheEvent(params: {
        operation: 'hit' | 'miss' | 'set' | 'invalidate';
        key: string;
        ttl?: number;
        source: 'redis' | 'memory';
        metadata?: Record<string, unknown>;
    }): Promise<void>;
    auditCircuitBreakerEvent(params: {
        operation: 'open' | 'close' | 'trip';
        failures: number;
        metadata?: Record<string, unknown>;
    }): Promise<void>;
    getStats(): {
        bufferSize: number;
        config: AuditConfig;
    };
    shutdown(): Promise<void>;
}
export declare const auditLogger: AuditLogger;
export declare function auditGatewayCall(params: Parameters<AuditLogger['auditGatewayCall']>[0]): Promise<void>;
export declare function auditAuthEvent(params: Parameters<AuditLogger['auditAuthEvent']>[0]): Promise<void>;
export declare function auditCacheEvent(params: Parameters<AuditLogger['auditCacheEvent']>[0]): Promise<void>;
export {};
