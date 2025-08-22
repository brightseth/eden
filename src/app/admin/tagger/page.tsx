'use client';

import { useState, useEffect } from 'react';
import { 
  Play, Pause, Settings, RefreshCw, AlertCircle, 
  CheckCircle, Clock, TrendingUp, Database 
} from 'lucide-react';

interface TaggerStatus {
  enabled: boolean;
  sample_rate: number;
  daily_limit_usd: number;
  today: {
    calls_made: number;
    usd_spent: number;
    remaining: number;
  };
  version: string;
}

export default function TaggerAdminPage() {
  const [status, setStatus] = useState<TaggerStatus | null>(null);
  const [backfillRunning, setBackfillRunning] = useState(false);
  const [backfillResult, setBackfillResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/tagger');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching tagger status:', error);
    } finally {
      setLoading(false);
    }
  };

  const runBackfill = async () => {
    setBackfillRunning(true);
    setBackfillResult(null);
    
    try {
      const res = await fetch('/api/tagger/backfill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In production, you'd get this from user input or env
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TAGGER_ADMIN_SECRET || 'dev-mode'}`
        }
      });
      
      const result = await res.json();
      setBackfillResult(result);
      
      if (res.ok) {
        // Refresh status after backfill
        setTimeout(fetchStatus, 2000);
      }
    } catch (error) {
      console.error('Error running backfill:', error);
      setBackfillResult({ error: 'Failed to run backfill' });
    } finally {
      setBackfillRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading tagger status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tagger Administration</h1>
              <p className="text-gray-400">
                Manage AI vision tagging system and backfill operations
              </p>
            </div>
            <button
              onClick={fetchStatus}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Status</h3>
              {status?.enabled ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Pause className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p className="text-2xl font-mono">
              {status?.enabled ? 'ENABLED' : 'DISABLED'}
            </p>
            <p className="text-sm text-gray-400">
              Sample: {((status?.sample_rate || 0) * 100).toFixed(0)}%
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Today's Usage</h3>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-mono">
              {status?.today.calls_made || 0}
            </p>
            <p className="text-sm text-gray-400">
              calls made
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Budget</h3>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-mono">
              ${status?.today.usd_spent?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-400">
              of ${status?.daily_limit_usd || 0} limit
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Remaining</h3>
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-mono">
              ${status?.today.remaining?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-400">
              budget left
            </p>
          </div>
        </div>

        {/* Backfill Section */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Backfill Operations</h2>
              <p className="text-gray-400">
                Tag all existing works that don't have AI analysis yet
              </p>
            </div>
            
            <button
              onClick={runBackfill}
              disabled={backfillRunning || !status?.enabled}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {backfillRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Backfill
                </>
              )}
            </button>
          </div>

          {/* Backfill Results */}
          {backfillResult && (
            <div className={`mt-6 p-4 rounded border ${
              backfillResult.error 
                ? 'bg-red-950/50 border-red-800 text-red-400'
                : 'bg-green-950/50 border-green-800 text-green-400'
            }`}>
              {backfillResult.error ? (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Backfill Failed</h4>
                    <p>{backfillResult.error}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Backfill Completed</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Total works: {backfillResult.total_works}</p>
                      <p>Already tagged: {backfillResult.already_tagged}</p>
                      <p>Queued for tagging: {backfillResult.queued_for_tagging}</p>
                      <p>Successfully processed: {backfillResult.processed}</p>
                      <p>Errors: {backfillResult.errors}</p>
                    </div>
                    {backfillResult.message && (
                      <p className="mt-2 font-medium">{backfillResult.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configuration */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" />
            <h2 className="text-xl font-bold">Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">Environment Variables</h3>
              <div className="space-y-2 text-sm font-mono bg-gray-900 p-4 rounded">
                <div>TAGGER_ENABLED={status?.enabled ? 'true' : 'false'}</div>
                <div>TAGGER_SAMPLE={status?.sample_rate}</div>
                <div>TAGGER_DAILY_USD=${status?.daily_limit_usd}</div>
                <div>TAGGER_VERSION={status?.version}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-left">
                  View Recent Failures
                </button>
                <button className="w-full px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-left">
                  Download Usage Report
                </button>
                <button className="w-full px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-left">
                  Reset Daily Budget
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-950/30 border border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="text-yellow-300">
              <h4 className="font-bold">Development Mode</h4>
              <p className="text-sm">
                This admin panel is only available in development mode or with proper authentication.
                In production, ensure TAGGER_ADMIN_SECRET is set and used for authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}