interface AlertRule {
    id: string;
    name: string;
    condition: (metrics: any) => boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    cooldown: number;
    enabled: boolean;
}
interface Alert {
    id: string;
    ruleId: string;
    timestamp: string;
    severity: AlertRule['severity'];
    message: string;
    metrics: any;
    resolved: boolean;
    resolvedAt?: string;
}
interface AlertChannel {
    type: 'console' | 'webhook' | 'email';
    config: any;
    enabled: boolean;
}
export declare class AlertSystem {
    private rules;
    private channels;
    private alerts;
    private lastAlerts;
    private checkInterval;
    constructor();
    private setupDefaultRules;
    private setupDefaultChannels;
    addRule(rule: AlertRule): void;
    removeRule(ruleId: string): boolean;
    addChannel(channel: AlertChannel): void;
    private startMonitoring;
    checkRules(customMetrics?: any): Promise<void>;
    private triggerAlert;
    private generateMessage;
    private sendAlert;
    private sendConsoleAlert;
    private sendWebhookAlert;
    private sendEmailAlert;
    triggerManualAlert(params: {
        message: string;
        severity: AlertRule['severity'];
        metrics?: any;
    }): Promise<void>;
    getActiveAlerts(): Alert[];
    resolveAlert(alertId: string): boolean;
    getStats(): {
        totalRules: number;
        enabledRules: number;
        totalChannels: number;
        enabledChannels: number;
        activeAlerts: number;
        totalAlerts: number;
    };
    shutdown(): void;
}
export declare const alertSystem: AlertSystem;
export declare function triggerAlert(params: Parameters<AlertSystem['triggerManualAlert']>[0]): Promise<void>;
export declare function getActiveAlerts(): Alert[];
export declare function checkAlerts(): Promise<void>;
export {};
