"use strict";
// Comprehensive Audit Logging for Registry Guardian
// Tracks all Registry operations for compliance and debugging
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = exports.AuditLogger = void 0;
exports.auditGatewayCall = auditGatewayCall;
exports.auditAuthEvent = auditAuthEvent;
exports.auditCacheEvent = auditCacheEvent;
class AuditLogger {
    constructor(config) {
        this.logBuffer = [];
        this.flushInterval = null;
        this.config = {
            enableConsoleLog: process.env.AUDIT_CONSOLE === 'true',
            enableFileLog: process.env.AUDIT_FILE !== 'false', // default to true
            enableRemoteLog: process.env.AUDIT_REMOTE === 'true',
            logDirectory: process.env.AUDIT_LOG_DIR || './logs/audit',
            maxFileSize: 50 * 1024 * 1024, // 50MB
            rotateDaily: true,
            includeHeaders: ['authorization', 'user-agent', 'x-trace-id', 'x-forwarded-for'],
            excludeHeaders: ['cookie', 'set-cookie'],
            remoteLogUrl: process.env.AUDIT_REMOTE_URL,
            ...config
        };
        // Start flush interval for batched logging
        this.flushInterval = setInterval(() => {
            this.flushBuffer();
        }, 5000); // Flush every 5 seconds
        this.ensureLogDirectory();
    }
    async ensureLogDirectory() {
        // File operations only work server-side
        if (typeof window !== 'undefined')
            return;
        try {
            const { mkdir } = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            await mkdir(this.config.logDirectory, { recursive: true });
        }
        catch (error) {
            console.error('[Audit] Failed to create log directory:', error);
        }
    }
    filterHeaders(headers) {
        const filtered = {};
        if (!headers || typeof headers !== 'object') {
            return filtered;
        }
        for (const [key, value] of Object.entries(headers)) {
            if (!value)
                continue;
            const lowerKey = key.toLowerCase();
            // Include if in includeHeaders or exclude if in excludeHeaders
            if (this.config.includeHeaders.length > 0) {
                if (this.config.includeHeaders.includes(lowerKey)) {
                    filtered[key] = value;
                }
            }
            else if (!this.config.excludeHeaders.includes(lowerKey)) {
                filtered[key] = value;
            }
        }
        return filtered;
    }
    generateTraceId() {
        return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async logOperation(params) {
        const event = {
            timestamp: new Date().toISOString(),
            traceId: params.traceId || this.generateTraceId(),
            operation: params.operation,
            method: params.method,
            endpoint: params.endpoint,
            userId: params.userId,
            userEmail: params.userEmail,
            userRole: params.userRole,
            agentId: params.agentId,
            requestHeaders: this.filterHeaders(params.requestHeaders),
            requestBody: this.sanitizeRequestBody(params.requestBody),
            responseStatus: params.responseStatus,
            responseTime: params.responseTime,
            error: params.error,
            metadata: params.metadata
        };
        // Add to buffer for batched processing
        this.logBuffer.push(event);
        // Immediate console logging for critical events
        if (this.config.enableConsoleLog) {
            this.logToConsole(event);
        }
        // Immediate flush for errors
        if (params.error || params.responseStatus >= 400) {
            await this.flushBuffer();
        }
    }
    sanitizeRequestBody(body) {
        if (!body)
            return body;
        // Clone to avoid modifying original
        const sanitized = JSON.parse(JSON.stringify(body));
        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth'];
        const sanitizeObject = (obj) => {
            if (typeof obj !== 'object' || obj === null)
                return obj;
            for (const [key, value] of Object.entries(obj)) {
                if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                    obj[key] = '[REDACTED]';
                }
                else if (typeof value === 'object') {
                    sanitizeObject(value);
                }
            }
        };
        sanitizeObject(sanitized);
        return sanitized;
    }
    logToConsole(event) {
        const level = event.error || event.responseStatus >= 400 ? 'error' : 'info';
        const color = level === 'error' ? '\x1b[31m' : '\x1b[36m';
        const reset = '\x1b[0m';
        console.log(`${color}[Audit]${reset} ${event.timestamp} ${event.traceId} ` +
            `${event.method} ${event.endpoint} ${event.responseStatus} ${event.responseTime}ms` +
            (event.error ? ` ERROR: ${event.error}` : '') +
            (event.userEmail ? ` USER: ${event.userEmail}` : ''));
    }
    async flushBuffer() {
        if (this.logBuffer.length === 0)
            return;
        const events = [...this.logBuffer];
        this.logBuffer = [];
        try {
            // File logging
            if (this.config.enableFileLog) {
                await this.writeToFile(events);
            }
            // Remote logging
            if (this.config.enableRemoteLog && this.config.remoteLogUrl) {
                await this.sendToRemote(events);
            }
        }
        catch (error) {
            console.error('[Audit] Failed to flush log buffer:', error);
            // Put events back if they failed to write
            this.logBuffer.unshift(...events);
        }
    }
    async writeToFile(events) {
        // File operations only work server-side
        if (typeof window !== 'undefined')
            return;
        try {
            const { appendFile } = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const { join } = await Promise.resolve().then(() => __importStar(require('path')));
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const filename = this.config.rotateDaily
                ? `registry-audit-${date}.jsonl`
                : 'registry-audit.jsonl';
            const filepath = join(this.config.logDirectory, filename);
            const logLines = events.map(event => JSON.stringify(event)).join('\n') + '\n';
            await appendFile(filepath, logLines, 'utf8');
        }
        catch (error) {
            console.error('[Audit] Failed to write to file:', error);
            throw error;
        }
    }
    async sendToRemote(events) {
        if (!this.config.remoteLogUrl)
            return;
        try {
            const response = await fetch(this.config.remoteLogUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Registry-Audit/1.0'
                },
                body: JSON.stringify({ events })
            });
            if (!response.ok) {
                throw new Error(`Remote logging failed: ${response.status} ${response.statusText}`);
            }
        }
        catch (error) {
            console.error('[Audit] Failed to send to remote:', error);
            throw error;
        }
    }
    // Audit specific operations
    async auditGatewayCall(params) {
        await this.logOperation({
            ...params,
            metadata: {
                source: 'gateway',
                userAgent: params.headers['user-agent'],
                clientIp: params.headers['x-forwarded-for'] || params.headers['x-real-ip']
            }
        });
    }
    async auditAuthEvent(params) {
        await this.logOperation({
            operation: `auth.${params.operation}`,
            method: 'POST',
            endpoint: '/auth',
            userId: params.userId,
            userEmail: params.userEmail,
            requestHeaders: {},
            responseStatus: params.success ? 200 : 401,
            responseTime: 0,
            error: params.error,
            metadata: {
                source: 'auth',
                ...params.metadata
            }
        });
    }
    async auditCacheEvent(params) {
        await this.logOperation({
            operation: `cache.${params.operation}`,
            method: 'GET',
            endpoint: '/cache',
            requestHeaders: {},
            responseStatus: 200,
            responseTime: 0,
            metadata: {
                source: 'cache',
                cacheKey: params.key,
                cacheSource: params.source,
                ttl: params.ttl,
                ...params.metadata
            }
        });
    }
    async auditCircuitBreakerEvent(params) {
        await this.logOperation({
            operation: `circuit_breaker.${params.operation}`,
            method: 'POST',
            endpoint: '/circuit-breaker',
            requestHeaders: {},
            responseStatus: 200,
            responseTime: 0,
            metadata: {
                source: 'circuit_breaker',
                failures: params.failures,
                ...params.metadata
            }
        });
    }
    // Get audit statistics
    getStats() {
        return {
            bufferSize: this.logBuffer.length,
            config: this.config
        };
    }
    // Cleanup
    async shutdown() {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
            this.flushInterval = null;
        }
        // Final flush
        await this.flushBuffer();
    }
}
exports.AuditLogger = AuditLogger;
// Export singleton instance
exports.auditLogger = new AuditLogger();
// Cleanup on process exit (server-side only)
if (typeof window === 'undefined' && typeof process !== 'undefined') {
    process.on('beforeExit', () => {
        exports.auditLogger.shutdown();
    });
}
// Convenience functions
async function auditGatewayCall(params) {
    return exports.auditLogger.auditGatewayCall(params);
}
async function auditAuthEvent(params) {
    return exports.auditLogger.auditAuthEvent(params);
}
async function auditCacheEvent(params) {
    return exports.auditLogger.auditCacheEvent(params);
}
