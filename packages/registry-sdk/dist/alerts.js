"use strict";
// Alerting System for Registry Guardian
// Monitors failures and inconsistencies, sends notifications
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
exports.alertSystem = exports.AlertSystem = void 0;
exports.triggerAlert = triggerAlert;
exports.getActiveAlerts = getActiveAlerts;
exports.checkAlerts = checkAlerts;
class AlertSystem {
    constructor() {
        this.rules = new Map();
        this.channels = [];
        this.alerts = new Map();
        this.lastAlerts = new Map(); // Track cooldowns
        this.checkInterval = null;
        this.setupDefaultRules();
        this.setupDefaultChannels();
        this.startMonitoring();
    }
    setupDefaultRules() {
        // Circuit breaker open
        this.addRule({
            id: 'circuit-breaker-open',
            name: 'Circuit Breaker Open',
            condition: (metrics) => metrics.circuitBreaker?.isOpen === true,
            severity: 'critical',
            cooldown: 300, // 5 minutes
            enabled: true
        });
        // High failure rate
        this.addRule({
            id: 'high-failure-rate',
            name: 'High Failure Rate',
            condition: (metrics) => metrics.circuitBreaker?.failures > 3,
            severity: 'high',
            cooldown: 180, // 3 minutes
            enabled: true
        });
        // Cache unavailable
        this.addRule({
            id: 'cache-unavailable',
            name: 'Redis Cache Unavailable',
            condition: (metrics) => metrics.cache?.redis === false,
            severity: 'medium',
            cooldown: 600, // 10 minutes
            enabled: true
        });
        // Low cache hit rate
        this.addRule({
            id: 'low-cache-hit-rate',
            name: 'Low Cache Hit Rate',
            condition: (metrics) => metrics.cache?.stats?.hitRate < 50,
            severity: 'low',
            cooldown: 1800, // 30 minutes
            enabled: true
        });
        // Data consistency failures
        this.addRule({
            id: 'consistency-failures',
            name: 'Data Consistency Failures',
            condition: (metrics) => metrics.consistency?.summary?.failed > 0,
            severity: 'high',
            cooldown: 300, // 5 minutes
            enabled: true
        });
        // Registry unhealthy
        this.addRule({
            id: 'registry-unhealthy',
            name: 'Registry Status Unhealthy',
            condition: (metrics) => metrics.status === 'unhealthy',
            severity: 'critical',
            cooldown: 180, // 3 minutes
            enabled: true
        });
    }
    setupDefaultChannels() {
        // Console logging (always enabled for development)
        this.channels.push({
            type: 'console',
            config: {
                colors: true,
                timestamp: true
            },
            enabled: true
        });
        // Webhook (if configured)
        if (process.env.ALERT_WEBHOOK_URL) {
            this.channels.push({
                type: 'webhook',
                config: {
                    url: process.env.ALERT_WEBHOOK_URL,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Registry-Guardian-Alerts/1.0'
                    }
                },
                enabled: true
            });
        }
    }
    addRule(rule) {
        this.rules.set(rule.id, rule);
        console.log(`[Alerts] Added rule: ${rule.name}`);
    }
    removeRule(ruleId) {
        return this.rules.delete(ruleId);
    }
    addChannel(channel) {
        this.channels.push(channel);
    }
    startMonitoring() {
        // Check every 30 seconds
        this.checkInterval = setInterval(() => {
            this.checkRules();
        }, 30000);
        console.log('[Alerts] Monitoring started');
    }
    async checkRules(customMetrics) {
        try {
            // Import here to avoid circular dependency
            const { registryGateway } = await Promise.resolve().then(() => __importStar(require('./gateway')));
            const { checkConsistency } = await Promise.resolve().then(() => __importStar(require('./monitor')));
            // Gather metrics
            const health = await registryGateway.healthCheck();
            const consistency = await checkConsistency().catch(e => null);
            const metrics = {
                ...health,
                consistency,
                ...customMetrics
            };
            // Check each rule
            for (const [ruleId, rule] of this.rules.entries()) {
                if (!rule.enabled)
                    continue;
                // Check cooldown
                const lastAlert = this.lastAlerts.get(ruleId) || 0;
                const now = Date.now();
                if (now - lastAlert < rule.cooldown * 1000) {
                    continue; // Still in cooldown
                }
                // Evaluate condition
                try {
                    if (rule.condition(metrics)) {
                        await this.triggerAlert(rule, metrics);
                    }
                }
                catch (error) {
                    console.error(`[Alerts] Error evaluating rule ${rule.id}:`, error);
                }
            }
        }
        catch (error) {
            console.error('[Alerts] Error checking rules:', error);
        }
    }
    async triggerAlert(rule, metrics) {
        const alertId = `${rule.id}-${Date.now()}`;
        const alert = {
            id: alertId,
            ruleId: rule.id,
            timestamp: new Date().toISOString(),
            severity: rule.severity,
            message: this.generateMessage(rule, metrics),
            metrics,
            resolved: false
        };
        this.alerts.set(alertId, alert);
        this.lastAlerts.set(rule.id, Date.now());
        console.log(`[Alerts] 🚨 ALERT: ${rule.name} (${rule.severity})`);
        // Send to all channels
        for (const channel of this.channels) {
            if (channel.enabled) {
                try {
                    await this.sendAlert(alert, channel);
                }
                catch (error) {
                    console.error(`[Alerts] Failed to send alert via ${channel.type}:`, error);
                }
            }
        }
    }
    generateMessage(rule, metrics) {
        switch (rule.id) {
            case 'circuit-breaker-open':
                return `Circuit breaker is OPEN after ${metrics.circuitBreaker.failures} failures. Registry requests are being blocked.`;
            case 'high-failure-rate':
                return `High failure rate detected: ${metrics.circuitBreaker.failures} failures. Circuit breaker may trip soon.`;
            case 'cache-unavailable':
                return `Redis cache is unavailable. Falling back to memory cache. Performance may be degraded.`;
            case 'low-cache-hit-rate':
                return `Cache hit rate is low: ${metrics.cache.stats?.hitRate?.toFixed(1) || 'unknown'}%. Consider cache tuning.`;
            case 'consistency-failures':
                const failed = metrics.consistency?.summary?.failed || 0;
                return `${failed} data consistency check(s) failed. Registry data may be inconsistent.`;
            case 'registry-unhealthy':
                return `Registry Gateway status is UNHEALTHY. Service may be experiencing issues.`;
            default:
                return `Alert triggered: ${rule.name}`;
        }
    }
    async sendAlert(alert, channel) {
        switch (channel.type) {
            case 'console':
                this.sendConsoleAlert(alert, channel);
                break;
            case 'webhook':
                await this.sendWebhookAlert(alert, channel);
                break;
            case 'email':
                await this.sendEmailAlert(alert, channel);
                break;
        }
    }
    sendConsoleAlert(alert, channel) {
        const colors = {
            low: '\x1b[36m', // Cyan
            medium: '\x1b[33m', // Yellow
            high: '\x1b[35m', // Magenta
            critical: '\x1b[31m' // Red
        };
        const reset = '\x1b[0m';
        const color = colors[alert.severity];
        console.log(`${color}🚨 [${alert.severity.toUpperCase()}]${reset} ${alert.message}\n` +
            `   Rule: ${alert.ruleId}\n` +
            `   Time: ${alert.timestamp}\n` +
            `   ID: ${alert.id}`);
    }
    async sendWebhookAlert(alert, channel) {
        const payload = {
            alert: {
                id: alert.id,
                severity: alert.severity,
                message: alert.message,
                timestamp: alert.timestamp,
                rule: alert.ruleId
            },
            service: 'Registry Guardian',
            metrics: alert.metrics
        };
        const response = await fetch(channel.config.url, {
            method: channel.config.method || 'POST',
            headers: channel.config.headers || {},
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
        }
    }
    async sendEmailAlert(alert, channel) {
        // Email implementation would go here
        // For now, just log that we would send email
        console.log(`[Alerts] Would send email alert: ${alert.message}`);
    }
    // Manual alert triggering
    async triggerManualAlert(params) {
        const alert = {
            id: `manual-${Date.now()}`,
            ruleId: 'manual',
            timestamp: new Date().toISOString(),
            severity: params.severity,
            message: params.message,
            metrics: params.metrics || {},
            resolved: false
        };
        this.alerts.set(alert.id, alert);
        for (const channel of this.channels) {
            if (channel.enabled) {
                try {
                    await this.sendAlert(alert, channel);
                }
                catch (error) {
                    console.error(`[Alerts] Failed to send manual alert via ${channel.type}:`, error);
                }
            }
        }
    }
    // Get active alerts
    getActiveAlerts() {
        return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
    }
    // Resolve alert
    resolveAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (alert && !alert.resolved) {
            alert.resolved = true;
            alert.resolvedAt = new Date().toISOString();
            return true;
        }
        return false;
    }
    // Get alert statistics
    getStats() {
        return {
            totalRules: this.rules.size,
            enabledRules: Array.from(this.rules.values()).filter(r => r.enabled).length,
            totalChannels: this.channels.length,
            enabledChannels: this.channels.filter(c => c.enabled).length,
            activeAlerts: this.getActiveAlerts().length,
            totalAlerts: this.alerts.size
        };
    }
    // Shutdown
    shutdown() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('[Alerts] Monitoring stopped');
    }
}
exports.AlertSystem = AlertSystem;
// Export singleton instance
exports.alertSystem = new AlertSystem();
// Cleanup on process exit
process.on('beforeExit', () => {
    exports.alertSystem.shutdown();
});
// Convenience functions
async function triggerAlert(params) {
    return exports.alertSystem.triggerManualAlert(params);
}
function getActiveAlerts() {
    return exports.alertSystem.getActiveAlerts();
}
async function checkAlerts() {
    return exports.alertSystem.checkRules();
}
