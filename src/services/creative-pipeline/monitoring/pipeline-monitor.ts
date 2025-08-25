/**
 * Creative Pipeline Monitoring & Observability System
 * 
 * Production-ready monitoring for the creator-to-agent pipeline with
 * comprehensive metrics, logging, and performance tracking.
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';

interface PipelineMetric {
  creatorProfileId: string;
  metricType: 'performance' | 'conversion' | 'quality' | 'business';
  metricName: string;
  metricValue: number;
  metricUnit: string;
  stage?: string;
  metadata?: Record<string, any>;
}

interface PipelineAlert {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'performance' | 'error' | 'conversion' | 'quality';
  message: string;
  metadata: Record<string, any>;
  creatorId?: string;
  stage?: string;
}

interface PipelineHealthMetrics {
  totalCreators: number;
  activeCreators: number;
  stageDistribution: Record<string, number>;
  conversionRates: Record<string, number>;
  averageProcessingTimes: Record<string, number>;
  errorRates: Record<string, number>;
  qualityScores: {
    averageCulturalAlignment: number;
    averageReadinessScore: number;
    completionRate: number;
  };
  economicMetrics: {
    averageProjectedRevenue: number;
    topRevenueModel: string;
    economicValidationRate: number;
  };
}

export class CreativePipelineMonitor {
  private supabase: ReturnType<typeof createServerSupabaseClient>;
  private alertHandlers: Map<string, (alert: PipelineAlert) => void> = new Map();

  constructor() {
    this.supabase = createServerSupabaseClient();
    this.setupDefaultAlertHandlers();
  }

  /**
   * Record a pipeline metric
   */
  async recordMetric(metric: PipelineMetric): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('pipeline_metrics')
        .insert({
          creator_profile_id: metric.creatorProfileId,
          metric_type: metric.metricType,
          metric_name: metric.metricName,
          metric_value: metric.metricValue,
          metric_unit: metric.metricUnit,
          stage: metric.stage,
          metadata: metric.metadata || {}
        });

      if (error) {
        console.error('Failed to record pipeline metric:', error);
        // Don't throw - monitoring shouldn't break the pipeline
      }

      // Check for alerts based on metric values
      await this.checkMetricAlerts(metric);

    } catch (error) {
      console.error('Error recording pipeline metric:', error);
    }
  }

  /**
   * Record multiple metrics efficiently
   */
  async recordMetrics(metrics: PipelineMetric[]): Promise<void> {
    try {
      const metricsData = metrics.map(metric => ({
        creator_profile_id: metric.creatorProfileId,
        metric_type: metric.metricType,
        metric_name: metric.metricName,
        metric_value: metric.metricValue,
        metric_unit: metric.metricUnit,
        stage: metric.stage,
        metadata: metric.metadata || {}
      }));

      const { error } = await this.supabase
        .from('pipeline_metrics')
        .insert(metricsData);

      if (error) {
        console.error('Failed to record pipeline metrics batch:', error);
      }

      // Check for alerts
      for (const metric of metrics) {
        await this.checkMetricAlerts(metric);
      }

    } catch (error) {
      console.error('Error recording pipeline metrics batch:', error);
    }
  }

  /**
   * Track stage completion with comprehensive metrics
   */
  async trackStageCompletion(
    creatorId: string,
    stage: string,
    success: boolean,
    processingTimeMs: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const metrics: PipelineMetric[] = [
      {
        creatorProfileId: creatorId,
        metricType: 'performance',
        metricName: 'stage_processing_time',
        metricValue: processingTimeMs,
        metricUnit: 'milliseconds',
        stage,
        metadata: { success, ...metadata }
      },
      {
        creatorProfileId: creatorId,
        metricType: 'conversion',
        metricName: 'stage_completion',
        metricValue: success ? 1 : 0,
        metricUnit: 'boolean',
        stage,
        metadata
      }
    ];

    // Add quality metrics if available
    if (metadata.culturalAlignment) {
      metrics.push({
        creatorProfileId: creatorId,
        metricType: 'quality',
        metricName: 'cultural_alignment_score',
        metricValue: metadata.culturalAlignment,
        metricUnit: 'percentage',
        stage,
        metadata
      });
    }

    if (metadata.readinessScore) {
      metrics.push({
        creatorProfileId: creatorId,
        metricType: 'quality',
        metricName: 'readiness_score',
        metricValue: metadata.readinessScore,
        metricUnit: 'percentage',
        stage,
        metadata
      });
    }

    await this.recordMetrics(metrics);

    // Log stage completion
    console.log(`Stage ${stage} ${success ? 'completed' : 'failed'} for creator ${creatorId} in ${processingTimeMs}ms`);
  }

  /**
   * Track economic validation metrics
   */
  async trackEconomicValidation(
    creatorId: string,
    revenueModel: string,
    projectedRevenue: number,
    validationScore: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const metrics: PipelineMetric[] = [
      {
        creatorProfileId: creatorId,
        metricType: 'business',
        metricName: 'projected_monthly_revenue',
        metricValue: projectedRevenue,
        metricUnit: 'currency_cents',
        metadata: { revenueModel, ...metadata }
      },
      {
        creatorProfileId: creatorId,
        metricType: 'business',
        metricName: 'economic_validation_score',
        metricValue: validationScore,
        metricUnit: 'percentage',
        metadata: { revenueModel, ...metadata }
      }
    ];

    await this.recordMetrics(metrics);

    // Alert if economic validation is low
    if (validationScore < 50) {
      await this.triggerAlert({
        severity: 'medium',
        type: 'quality',
        message: `Low economic validation score (${validationScore}%) for creator ${creatorId}`,
        metadata: { creatorId, revenueModel, validationScore },
        creatorId
      });
    }
  }

  /**
   * Get comprehensive pipeline health metrics
   */
  async getPipelineHealthMetrics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<PipelineHealthMetrics> {
    try {
      const timeThreshold = this.getTimeThreshold(timeRange);

      // Get basic creator statistics
      const { data: creatorStats } = await this.supabase
        .from('creator_profiles')
        .select('onboarding_stage, cultural_alignment, readiness_score, created_at, last_activity_at');

      const totalCreators = creatorStats?.length || 0;
      const activeCreators = creatorStats?.filter(c => 
        new Date(c.last_activity_at) > timeThreshold
      ).length || 0;

      // Calculate stage distribution
      const stageDistribution: Record<string, number> = {};
      creatorStats?.forEach(creator => {
        stageDistribution[creator.onboarding_stage] = 
          (stageDistribution[creator.onboarding_stage] || 0) + 1;
      });

      // Get conversion rates
      const conversionRates = await this.calculateConversionRates(timeThreshold);

      // Get average processing times
      const averageProcessingTimes = await this.calculateAverageProcessingTimes(timeThreshold);

      // Get error rates
      const errorRates = await this.calculateErrorRates(timeThreshold);

      // Calculate quality scores
      const qualityScores = {
        averageCulturalAlignment: this.calculateAverage(
          creatorStats?.map(c => c.cultural_alignment).filter(Boolean) || []
        ),
        averageReadinessScore: this.calculateAverage(
          creatorStats?.map(c => c.readiness_score).filter(Boolean) || []
        ),
        completionRate: ((stageDistribution['completed'] || 0) / totalCreators) * 100
      };

      // Get economic metrics
      const economicMetrics = await this.calculateEconomicMetrics(timeThreshold);

      return {
        totalCreators,
        activeCreators,
        stageDistribution,
        conversionRates,
        averageProcessingTimes,
        errorRates,
        qualityScores,
        economicMetrics
      };

    } catch (error) {
      console.error('Error getting pipeline health metrics:', error);
      throw error;
    }
  }

  /**
   * Get creator-specific metrics
   */
  async getCreatorMetrics(creatorId: string): Promise<{
    totalMetrics: number;
    processingTimes: Record<string, number>;
    qualityProgression: Array<{ stage: string; score: number; date: string }>;
    economicProjection: { revenue: number; model: string } | null;
  }> {
    try {
      const { data: metrics } = await this.supabase
        .from('pipeline_metrics')
        .select('*')
        .eq('creator_profile_id', creatorId)
        .order('recorded_at', { ascending: false });

      const totalMetrics = metrics?.length || 0;

      // Calculate processing times by stage
      const processingTimes: Record<string, number> = {};
      metrics?.filter(m => m.metric_name === 'stage_processing_time').forEach(m => {
        if (m.stage) {
          processingTimes[m.stage] = m.metric_value;
        }
      });

      // Get quality progression
      const qualityProgression = metrics?.filter(m => 
        m.metric_name === 'cultural_alignment_score' || m.metric_name === 'readiness_score'
      ).map(m => ({
        stage: m.stage || 'unknown',
        score: m.metric_value,
        date: m.recorded_at
      })) || [];

      // Get latest economic projection
      const economicMetric = metrics?.find(m => m.metric_name === 'projected_monthly_revenue');
      const economicProjection = economicMetric ? {
        revenue: economicMetric.metric_value,
        model: economicMetric.metadata?.revenueModel || 'unknown'
      } : null;

      return {
        totalMetrics,
        processingTimes,
        qualityProgression,
        economicProjection
      };

    } catch (error) {
      console.error('Error getting creator metrics:', error);
      throw error;
    }
  }

  /**
   * Register alert handler
   */
  registerAlertHandler(type: string, handler: (alert: PipelineAlert) => void): void {
    this.alertHandlers.set(type, handler);
  }

  /**
   * Trigger an alert
   */
  private async triggerAlert(alert: PipelineAlert): Promise<void> {
    try {
      // Log alert
      console.warn(`Pipeline Alert [${alert.severity}]: ${alert.message}`, alert.metadata);

      // Call registered handlers
      const handler = this.alertHandlers.get(alert.type);
      if (handler) {
        handler(alert);
      }

      // Store alert for later analysis (optional)
      // Could implement an alerts table here

    } catch (error) {
      console.error('Error triggering pipeline alert:', error);
    }
  }

  /**
   * Check if a metric should trigger alerts
   */
  private async checkMetricAlerts(metric: PipelineMetric): Promise<void> {
    // Performance alerts
    if (metric.metricName === 'stage_processing_time' && metric.metricValue > 30000) {
      await this.triggerAlert({
        severity: 'medium',
        type: 'performance',
        message: `Slow processing time: ${metric.metricValue}ms for stage ${metric.stage}`,
        metadata: metric.metadata || {},
        creatorId: metric.creatorProfileId,
        stage: metric.stage
      });
    }

    // Quality alerts
    if (metric.metricName === 'cultural_alignment_score' && metric.metricValue < 40) {
      await this.triggerAlert({
        severity: 'low',
        type: 'quality',
        message: `Low cultural alignment score: ${metric.metricValue}%`,
        metadata: metric.metadata || {},
        creatorId: metric.creatorProfileId,
        stage: metric.stage
      });
    }

    // Conversion alerts
    if (metric.metricName === 'stage_completion' && metric.metricValue === 0) {
      await this.triggerAlert({
        severity: 'low',
        type: 'conversion',
        message: `Stage completion failed for stage ${metric.stage}`,
        metadata: metric.metadata || {},
        creatorId: metric.creatorProfileId,
        stage: metric.stage
      });
    }
  }

  /**
   * Setup default alert handlers
   */
  private setupDefaultAlertHandlers(): void {
    // Console logging handler
    this.registerAlertHandler('performance', (alert) => {
      console.warn('Performance Alert:', alert.message, alert.metadata);
    });

    this.registerAlertHandler('error', (alert) => {
      console.error('Error Alert:', alert.message, alert.metadata);
    });

    this.registerAlertHandler('quality', (alert) => {
      console.info('Quality Alert:', alert.message, alert.metadata);
    });

    this.registerAlertHandler('conversion', (alert) => {
      console.warn('Conversion Alert:', alert.message, alert.metadata);
    });
  }

  // Helper methods
  private getTimeThreshold(range: string): Date {
    const now = new Date();
    switch (range) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  private async calculateConversionRates(timeThreshold: Date): Promise<Record<string, number>> {
    try {
      const { data: conversionMetrics } = await this.supabase
        .from('pipeline_metrics')
        .select('stage, metric_value')
        .eq('metric_name', 'stage_completion')
        .gte('recorded_at', timeThreshold.toISOString());

      const conversionRates: Record<string, number> = {};
      const stageCounts: Record<string, { completed: number; total: number }> = {};

      conversionMetrics?.forEach(metric => {
        if (metric.stage) {
          if (!stageCounts[metric.stage]) {
            stageCounts[metric.stage] = { completed: 0, total: 0 };
          }
          stageCounts[metric.stage].total++;
          if (metric.metric_value === 1) {
            stageCounts[metric.stage].completed++;
          }
        }
      });

      Object.entries(stageCounts).forEach(([stage, counts]) => {
        conversionRates[stage] = (counts.completed / counts.total) * 100;
      });

      return conversionRates;
    } catch (error) {
      console.error('Error calculating conversion rates:', error);
      return {};
    }
  }

  private async calculateAverageProcessingTimes(timeThreshold: Date): Promise<Record<string, number>> {
    try {
      const { data: processingMetrics } = await this.supabase
        .from('pipeline_metrics')
        .select('stage, metric_value')
        .eq('metric_name', 'stage_processing_time')
        .gte('recorded_at', timeThreshold.toISOString());

      const averageProcessingTimes: Record<string, number> = {};
      const stageTimes: Record<string, number[]> = {};

      processingMetrics?.forEach(metric => {
        if (metric.stage) {
          if (!stageTimes[metric.stage]) {
            stageTimes[metric.stage] = [];
          }
          stageTimes[metric.stage].push(metric.metric_value);
        }
      });

      Object.entries(stageTimes).forEach(([stage, times]) => {
        averageProcessingTimes[stage] = this.calculateAverage(times);
      });

      return averageProcessingTimes;
    } catch (error) {
      console.error('Error calculating average processing times:', error);
      return {};
    }
  }

  private async calculateErrorRates(timeThreshold: Date): Promise<Record<string, number>> {
    // Implementation would track error rates by stage
    // For now, return empty object
    return {};
  }

  private async calculateEconomicMetrics(timeThreshold: Date): Promise<{
    averageProjectedRevenue: number;
    topRevenueModel: string;
    economicValidationRate: number;
  }> {
    try {
      const { data: economicMetrics } = await this.supabase
        .from('pipeline_metrics')
        .select('metric_name, metric_value, metadata')
        .in('metric_name', ['projected_monthly_revenue', 'economic_validation_score'])
        .gte('recorded_at', timeThreshold.toISOString());

      const revenueMetrics = economicMetrics?.filter(m => m.metric_name === 'projected_monthly_revenue') || [];
      const validationMetrics = economicMetrics?.filter(m => m.metric_name === 'economic_validation_score') || [];

      const averageProjectedRevenue = this.calculateAverage(revenueMetrics.map(m => m.metric_value));

      // Count revenue models
      const revenueModelCounts: Record<string, number> = {};
      revenueMetrics.forEach(metric => {
        const model = metric.metadata?.revenueModel || 'unknown';
        revenueModelCounts[model] = (revenueModelCounts[model] || 0) + 1;
      });

      const topRevenueModel = Object.entries(revenueModelCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';

      const validationScores = validationMetrics.map(m => m.metric_value);
      const economicValidationRate = validationScores.filter(score => score >= 70).length / 
        Math.max(validationScores.length, 1) * 100;

      return {
        averageProjectedRevenue,
        topRevenueModel,
        economicValidationRate
      };
    } catch (error) {
      console.error('Error calculating economic metrics:', error);
      return {
        averageProjectedRevenue: 0,
        topRevenueModel: 'unknown',
        economicValidationRate: 0
      };
    }
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
}

// Singleton instance for global use
export const pipelineMonitor = new CreativePipelineMonitor();

// Convenience functions for common monitoring tasks
export const monitoringHelpers = {
  trackStageStart: (creatorId: string, stage: string) => {
    pipelineMonitor.recordMetric({
      creatorProfileId: creatorId,
      metricType: 'performance',
      metricName: 'stage_start',
      metricValue: 1,
      metricUnit: 'count',
      stage,
      metadata: { timestamp: new Date().toISOString() }
    });
  },

  trackStageSuccess: (creatorId: string, stage: string, processingTimeMs: number, metadata: any = {}) => {
    pipelineMonitor.trackStageCompletion(creatorId, stage, true, processingTimeMs, metadata);
  },

  trackStageError: (creatorId: string, stage: string, error: Error, processingTimeMs: number) => {
    pipelineMonitor.trackStageCompletion(creatorId, stage, false, processingTimeMs, {
      error: error.message,
      errorType: error.constructor.name
    });
  },

  trackEconomicValidation: (creatorId: string, data: any) => {
    pipelineMonitor.trackEconomicValidation(
      creatorId,
      data.revenueModel,
      data.projectedRevenue,
      data.validationScore,
      data.metadata
    );
  }
};