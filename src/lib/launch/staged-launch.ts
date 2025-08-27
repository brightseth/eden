/**
 * Staged Launch System
 * Provides controlled rollout with automatic monitoring and rollback capabilities
 * 
 * Architecture:
 * - Stage-based rollout (dev -> beta -> gradual -> full)  
 * - Health monitoring with automatic rollback triggers
 * - Configuration-driven launch criteria
 * - Observability with metrics and alerts
 */

import { FEATURE_FLAGS, featureFlags, type FeatureFlag } from '@/config/flags';

export type LaunchStage = 'off' | 'dev' | 'beta' | 'gradual' | 'full';

export interface LaunchMetrics {
  successRate: number;
  errorCount: number;
  responseTime: number;
  userEngagement: number;
  timestamp: Date;
}

export interface LaunchCriteria {
  minimumSuccessRate: number;
  maximumErrorCount: number;
  maximumResponseTime: number;
  minimumUserEngagement: number;
  monitoringWindow: number; // minutes
}

export interface StageConfig {
  stage: LaunchStage;
  percentage: number; // percentage of users
  criteria: LaunchCriteria;
  duration: number; // minutes to stay in this stage before advancing
  autoAdvance: boolean;
  rollbackOnFailure: boolean;
}

export interface LaunchConfig {
  featureKey: string;
  stages: StageConfig[];
  globalCriteria: LaunchCriteria;
  alertEndpoints: string[];
  monitoringEnabled: boolean;
}

export class StagedLaunchManager {
  private launchConfigs: Map<string, LaunchConfig> = new Map();
  private currentStages: Map<string, LaunchStage> = new Map();
  private metrics: Map<string, LaunchMetrics[]> = new Map();
  private stageTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeDefaultConfigs();
  }

  private initializeDefaultConfigs(): void {
    // Widget Profile System Launch Configuration
    this.launchConfigs.set('ENABLE_WIDGET_PROFILE_SYSTEM', {
      featureKey: 'ENABLE_WIDGET_PROFILE_SYSTEM',
      stages: [
        {
          stage: 'dev',
          percentage: 0,
          criteria: {
            minimumSuccessRate: 0.95,
            maximumErrorCount: 5,
            maximumResponseTime: 2000,
            minimumUserEngagement: 0.7,
            monitoringWindow: 30
          },
          duration: 60, // 1 hour
          autoAdvance: true,
          rollbackOnFailure: true
        },
        {
          stage: 'beta',
          percentage: 5,
          criteria: {
            minimumSuccessRate: 0.98,
            maximumErrorCount: 3,
            maximumResponseTime: 1500,
            minimumUserEngagement: 0.8,
            monitoringWindow: 60
          },
          duration: 180, // 3 hours
          autoAdvance: true,
          rollbackOnFailure: true
        },
        {
          stage: 'gradual',
          percentage: 25,
          criteria: {
            minimumSuccessRate: 0.99,
            maximumErrorCount: 2,
            maximumResponseTime: 1000,
            minimumUserEngagement: 0.85,
            monitoringWindow: 120
          },
          duration: 360, // 6 hours
          autoAdvance: true,
          rollbackOnFailure: true
        },
        {
          stage: 'full',
          percentage: 100,
          criteria: {
            minimumSuccessRate: 0.995,
            maximumErrorCount: 1,
            maximumResponseTime: 800,
            minimumUserEngagement: 0.9,
            monitoringWindow: 180
          },
          duration: -1, // permanent
          autoAdvance: false,
          rollbackOnFailure: true
        }
      ],
      globalCriteria: {
        minimumSuccessRate: 0.95,
        maximumErrorCount: 10,
        maximumResponseTime: 2000,
        minimumUserEngagement: 0.7,
        monitoringWindow: 60
      },
      alertEndpoints: [
        '/api/alerts/slack',
        '/api/alerts/email'
      ],
      monitoringEnabled: true
    });
  }

  /**
   * Start staged launch for a feature
   */
  async startLaunch(featureKey: string, startStage: LaunchStage = 'dev'): Promise<boolean> {
    const config = this.launchConfigs.get(featureKey);
    if (!config) {
      console.error(`[StagedLaunch] No config found for feature: ${featureKey}`);
      return false;
    }

    // Initialize metrics tracking
    this.metrics.set(featureKey, []);
    this.currentStages.set(featureKey, startStage);

    // Update feature flag
    featureFlags.setFlag(featureKey, startStage !== 'off');

    // Start monitoring
    if (config.monitoringEnabled) {
      this.startMonitoring(featureKey);
    }

    console.log(`[StagedLaunch] Started launch for ${featureKey} at stage: ${startStage}`);
    
    // Schedule advancement if auto-advance is enabled
    const stageConfig = config.stages.find(s => s.stage === startStage);
    if (stageConfig?.autoAdvance && stageConfig.duration > 0) {
      this.scheduleStageAdvancement(featureKey, stageConfig.duration);
    }

    return true;
  }

  /**
   * Record metrics for a feature
   */
  recordMetrics(featureKey: string, metrics: LaunchMetrics): void {
    const featureMetrics = this.metrics.get(featureKey) || [];
    featureMetrics.push(metrics);
    
    // Keep only recent metrics (last 24 hours)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const filteredMetrics = featureMetrics.filter(m => m.timestamp > cutoff);
    this.metrics.set(featureKey, filteredMetrics);

    // Check if rollback is needed
    this.checkRollbackCriteria(featureKey, metrics);
  }

  /**
   * Check if current metrics meet rollback criteria
   */
  private checkRollbackCriteria(featureKey: string, currentMetrics: LaunchMetrics): void {
    const config = this.launchConfigs.get(featureKey);
    const currentStage = this.currentStages.get(featureKey);
    
    if (!config || !currentStage) return;

    const stageConfig = config.stages.find(s => s.stage === currentStage);
    if (!stageConfig?.rollbackOnFailure) return;

    const criteria = stageConfig.criteria;
    let shouldRollback = false;
    const issues: string[] = [];

    if (currentMetrics.successRate < criteria.minimumSuccessRate) {
      shouldRollback = true;
      issues.push(`Success rate ${currentMetrics.successRate} below threshold ${criteria.minimumSuccessRate}`);
    }

    if (currentMetrics.errorCount > criteria.maximumErrorCount) {
      shouldRollback = true;
      issues.push(`Error count ${currentMetrics.errorCount} exceeds threshold ${criteria.maximumErrorCount}`);
    }

    if (currentMetrics.responseTime > criteria.maximumResponseTime) {
      shouldRollback = true;
      issues.push(`Response time ${currentMetrics.responseTime}ms exceeds threshold ${criteria.maximumResponseTime}ms`);
    }

    if (currentMetrics.userEngagement < criteria.minimumUserEngagement) {
      shouldRollback = true;
      issues.push(`User engagement ${currentMetrics.userEngagement} below threshold ${criteria.minimumUserEngagement}`);
    }

    if (shouldRollback) {
      console.warn(`[StagedLaunch] Triggering rollback for ${featureKey}:`, issues);
      this.rollback(featureKey, issues.join(', '));
    }
  }

  /**
   * Advance to next stage
   */
  async advanceStage(featureKey: string): Promise<boolean> {
    const config = this.launchConfigs.get(featureKey);
    const currentStage = this.currentStages.get(featureKey);
    
    if (!config || !currentStage) return false;

    const currentIndex = config.stages.findIndex(s => s.stage === currentStage);
    if (currentIndex === -1 || currentIndex >= config.stages.length - 1) {
      console.log(`[StagedLaunch] ${featureKey} already at final stage`);
      return false;
    }

    const nextStage = config.stages[currentIndex + 1];
    
    // Check if current stage metrics meet advancement criteria
    if (!this.meetsAdvancementCriteria(featureKey)) {
      console.warn(`[StagedLaunch] Cannot advance ${featureKey}: metrics don't meet criteria`);
      return false;
    }

    // Clear current stage timer
    const timer = this.stageTimers.get(featureKey);
    if (timer) {
      clearTimeout(timer);
      this.stageTimers.delete(featureKey);
    }

    // Update stage
    this.currentStages.set(featureKey, nextStage.stage);
    
    // Update feature flag based on stage
    const shouldEnable = nextStage.stage !== 'off';
    featureFlags.setFlag(featureKey, shouldEnable);

    console.log(`[StagedLaunch] Advanced ${featureKey} to stage: ${nextStage.stage}`);

    // Schedule next advancement if auto-advance is enabled
    if (nextStage.autoAdvance && nextStage.duration > 0) {
      this.scheduleStageAdvancement(featureKey, nextStage.duration);
    }

    // Send advancement alert
    this.sendAlert(featureKey, `Advanced to stage: ${nextStage.stage}`);

    return true;
  }

  /**
   * Rollback feature to previous stage or disable completely
   */
  async rollback(featureKey: string, reason: string): Promise<void> {
    const config = this.launchConfigs.get(featureKey);
    const currentStage = this.currentStages.get(featureKey);
    
    if (!config || !currentStage) return;

    // Clear any scheduled advancement
    const timer = this.stageTimers.get(featureKey);
    if (timer) {
      clearTimeout(timer);
      this.stageTimers.delete(featureKey);
    }

    // Find previous stage or disable
    const currentIndex = config.stages.findIndex(s => s.stage === currentStage);
    let rollbackStage: LaunchStage = 'off';
    
    if (currentIndex > 0) {
      rollbackStage = config.stages[currentIndex - 1].stage;
    }

    // Update stage and feature flag
    this.currentStages.set(featureKey, rollbackStage);
    featureFlags.setFlag(featureKey, rollbackStage !== 'off');

    console.error(`[StagedLaunch] Rolled back ${featureKey} to stage: ${rollbackStage}. Reason: ${reason}`);

    // Send critical alert
    this.sendAlert(featureKey, `ROLLBACK: ${reason}`, 'critical');

    // Execute feature-specific rollback plan
    await this.executeRollbackPlan(featureKey);
  }

  /**
   * Check if current metrics meet advancement criteria
   */
  private meetsAdvancementCriteria(featureKey: string): boolean {
    const config = this.launchConfigs.get(featureKey);
    const currentStage = this.currentStages.get(featureKey);
    const recentMetrics = this.metrics.get(featureKey) || [];
    
    if (!config || !currentStage || recentMetrics.length === 0) return false;

    const stageConfig = config.stages.find(s => s.stage === currentStage);
    if (!stageConfig) return false;

    // Get metrics from monitoring window
    const windowStart = new Date(Date.now() - stageConfig.criteria.monitoringWindow * 60 * 1000);
    const windowMetrics = recentMetrics.filter(m => m.timestamp > windowStart);
    
    if (windowMetrics.length === 0) return false;

    // Calculate averages
    const avgSuccessRate = windowMetrics.reduce((sum, m) => sum + m.successRate, 0) / windowMetrics.length;
    const avgErrorCount = windowMetrics.reduce((sum, m) => sum + m.errorCount, 0) / windowMetrics.length;
    const avgResponseTime = windowMetrics.reduce((sum, m) => sum + m.responseTime, 0) / windowMetrics.length;
    const avgUserEngagement = windowMetrics.reduce((sum, m) => sum + m.userEngagement, 0) / windowMetrics.length;

    return (
      avgSuccessRate >= stageConfig.criteria.minimumSuccessRate &&
      avgErrorCount <= stageConfig.criteria.maximumErrorCount &&
      avgResponseTime <= stageConfig.criteria.maximumResponseTime &&
      avgUserEngagement >= stageConfig.criteria.minimumUserEngagement
    );
  }

  /**
   * Schedule automatic stage advancement
   */
  private scheduleStageAdvancement(featureKey: string, durationMinutes: number): void {
    const timer = setTimeout(() => {
      this.advanceStage(featureKey);
    }, durationMinutes * 60 * 1000);

    this.stageTimers.set(featureKey, timer);
  }

  /**
   * Start monitoring for a feature
   */
  private startMonitoring(featureKey: string): void {
    // This would integrate with your monitoring system
    // For now, we'll set up periodic health checks
    setInterval(() => {
      this.performHealthCheck(featureKey);
    }, 60000); // Check every minute
  }

  /**
   * Perform health check and record metrics
   */
  private async performHealthCheck(featureKey: string): Promise<void> {
    try {
      // This would integrate with your actual monitoring/metrics system
      // For now, we'll simulate basic health metrics
      
      const mockMetrics: LaunchMetrics = {
        successRate: 0.99 + (Math.random() * 0.01), // 99-100%
        errorCount: Math.floor(Math.random() * 3),   // 0-2 errors
        responseTime: 500 + (Math.random() * 500),   // 500-1000ms
        userEngagement: 0.85 + (Math.random() * 0.1), // 85-95%
        timestamp: new Date()
      };

      this.recordMetrics(featureKey, mockMetrics);
    } catch (error) {
      console.error(`[StagedLaunch] Health check failed for ${featureKey}:`, error);
    }
  }

  /**
   * Execute feature-specific rollback plan
   */
  private async executeRollbackPlan(featureKey: string): Promise<void> {
    const flag = FEATURE_FLAGS[featureKey];
    if (!flag?.rollbackPlan) return;

    console.log(`[StagedLaunch] Executing rollback plan for ${featureKey}: ${flag.rollbackPlan}`);

    // Execute specific rollback steps based on feature
    switch (featureKey) {
      case 'ENABLE_WIDGET_PROFILE_SYSTEM':
        // Clear any cached widget configurations
        // Reset to hardcoded agent profile pages
        // This would clear relevant caches and reset state
        console.log('[StagedLaunch] Widget system rollback: Falling back to hardcoded agent pages');
        break;
      
      default:
        console.log(`[StagedLaunch] No specific rollback plan for ${featureKey}`);
    }
  }

  /**
   * Send alert notification
   */
  private async sendAlert(featureKey: string, message: string, severity: 'info' | 'warning' | 'critical' = 'info'): Promise<void> {
    const config = this.launchConfigs.get(featureKey);
    if (!config || !config.alertEndpoints.length) return;

    const alert = {
      feature: featureKey,
      message,
      severity,
      timestamp: new Date().toISOString(),
      currentStage: this.currentStages.get(featureKey),
      recentMetrics: this.metrics.get(featureKey)?.slice(-5) // Last 5 metrics
    };

    // Send to each configured endpoint
    for (const endpoint of config.alertEndpoints) {
      try {
        // This would integrate with your actual alerting system
        console.log(`[StagedLaunch] Sending ${severity} alert to ${endpoint}:`, message);
        
        // Example: await fetch(endpoint, { method: 'POST', body: JSON.stringify(alert) });
      } catch (error) {
        console.error(`[StagedLaunch] Failed to send alert to ${endpoint}:`, error);
      }
    }
  }

  /**
   * Get current launch status
   */
  getLaunchStatus(featureKey: string): {
    currentStage: LaunchStage | undefined;
    recentMetrics: LaunchMetrics[];
    nextAdvancement?: Date;
  } {
    return {
      currentStage: this.currentStages.get(featureKey),
      recentMetrics: this.metrics.get(featureKey) || [],
      nextAdvancement: this.stageTimers.has(featureKey) ? 
        new Date(Date.now() + 60000) : undefined // Simplified - would track actual timer
    };
  }

  /**
   * Manually override stage (for emergency situations)
   */
  async forceStage(featureKey: string, stage: LaunchStage, reason: string): Promise<void> {
    console.warn(`[StagedLaunch] Force override ${featureKey} to stage: ${stage}. Reason: ${reason}`);
    
    // Clear any timers
    const timer = this.stageTimers.get(featureKey);
    if (timer) {
      clearTimeout(timer);
      this.stageTimers.delete(featureKey);
    }

    // Update stage and flag
    this.currentStages.set(featureKey, stage);
    featureFlags.setFlag(featureKey, stage !== 'off');

    // Send alert about manual override
    this.sendAlert(featureKey, `Manual override to ${stage}: ${reason}`, 'warning');
  }
}

// Export singleton instance
export const stagedLaunchManager = new StagedLaunchManager();