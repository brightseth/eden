'use client';

/**
 * Launch Dashboard Component
 * Provides real-time monitoring and control of staged feature launches
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play, 
  SkipForward, 
  RotateCcw,
  Settings 
} from 'lucide-react';
import type { LaunchStage, LaunchMetrics } from '@/lib/launch/staged-launch';

interface FeatureStatus {
  currentStage?: LaunchStage;
  recentMetrics: LaunchMetrics[];
  nextAdvancement?: string;
  flagConfig: {
    key: string;
    description: string;
    rolloutStrategy: string;
    rollbackPlan?: string;
  };
}

interface LaunchDashboardData {
  features: Record<string, FeatureStatus>;
  timestamp: string;
}

const STAGE_ORDER: LaunchStage[] = ['off', 'dev', 'beta', 'gradual', 'full'];
const STAGE_COLORS = {
  off: 'bg-gray-500',
  dev: 'bg-blue-500',
  beta: 'bg-yellow-500',
  gradual: 'bg-orange-500',
  full: 'bg-green-500'
};

export default function LaunchDashboard() {
  const [data, setData] = useState<LaunchDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch launch status data
  const fetchData = async () => {
    try {
      const response = await fetch('/api/launch/status');
      if (!response.ok) throw new Error('Failed to fetch launch status');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Execute launch action
  const executeAction = async (featureKey: string, action: string, stage?: LaunchStage, reason?: string) => {
    setActionLoading(`${featureKey}-${action}`);
    
    try {
      const response = await fetch('/api/launch/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, featureKey, stage, reason })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Action failed');
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate stage progress percentage
  const getStageProgress = (stage?: LaunchStage): number => {
    if (!stage) return 0;
    const index = STAGE_ORDER.indexOf(stage);
    return ((index + 1) / STAGE_ORDER.length) * 100;
  };

  // Get metrics summary
  const getMetricsSummary = (metrics: LaunchMetrics[]) => {
    if (metrics.length === 0) return null;
    
    const recent = metrics.slice(-10); // Last 10 metrics
    return {
      avgSuccessRate: recent.reduce((sum, m) => sum + m.successRate, 0) / recent.length,
      avgErrorCount: recent.reduce((sum, m) => sum + m.errorCount, 0) / recent.length,
      avgResponseTime: recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length,
      avgUserEngagement: recent.reduce((sum, m) => sum + m.userEngagement, 0) / recent.length
    };
  };

  // Auto-refresh data
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Activity className="animate-spin h-8 w-8" />
        <span className="ml-2">Loading launch dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading dashboard: {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Launch Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and control staged feature launches
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {Object.entries(data.features).map(([featureKey, status]) => {
          const summary = getMetricsSummary(status.recentMetrics);
          const currentStageIndex = status.currentStage ? STAGE_ORDER.indexOf(status.currentStage) : -1;
          const canAdvance = currentStageIndex < STAGE_ORDER.length - 1;
          const canRollback = currentStageIndex > 0;

          return (
            <Card key={featureKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{featureKey}</CardTitle>
                    <CardDescription>
                      {status.flagConfig.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${STAGE_COLORS[status.currentStage || 'off']} text-white`}
                  >
                    {status.currentStage || 'off'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stage Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Launch Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(getStageProgress(status.currentStage))}%
                    </span>
                  </div>
                  <Progress value={getStageProgress(status.currentStage)} className="h-2" />
                  
                  {/* Stage indicators */}
                  <div className="flex justify-between mt-2">
                    {STAGE_ORDER.map((stage, index) => {
                      const isActive = status.currentStage === stage;
                      const isPassed = currentStageIndex > index;
                      
                      return (
                        <div key={stage} className="flex flex-col items-center">
                          <div className={`
                            w-3 h-3 rounded-full 
                            ${isActive ? STAGE_COLORS[stage] : isPassed ? 'bg-green-300' : 'bg-gray-300'}
                          `} />
                          <span className="text-xs mt-1 capitalize">{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metrics Summary */}
                {summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(summary.avgSuccessRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {summary.avgErrorCount.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(summary.avgResponseTime)}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {(summary.avgUserEngagement * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {status.currentStage === 'off' && (
                    <Button
                      size="sm"
                      onClick={() => executeAction(featureKey, 'start')}
                      disabled={actionLoading === `${featureKey}-start`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Launch
                    </Button>
                  )}
                  
                  {canAdvance && status.currentStage !== 'off' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => executeAction(featureKey, 'advance')}
                      disabled={actionLoading === `${featureKey}-advance`}
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Advance Stage
                    </Button>
                  )}
                  
                  {canRollback && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => executeAction(featureKey, 'rollback', undefined, 'Manual rollback')}
                      disabled={actionLoading === `${featureKey}-rollback`}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rollback
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`/api/launch/metrics?feature=${featureKey}&limit=100`, '_blank')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    View Metrics
                  </Button>
                </div>

                {/* Rollback Plan */}
                {status.flagConfig.rollbackPlan && (
                  <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                    <strong>Rollback Plan:</strong> {status.flagConfig.rollbackPlan}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
}