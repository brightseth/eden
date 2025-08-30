// EMERGENCY COVENANT DASHBOARD
// Critical Path: HOUR 18-24 - Real-time witness registry monitoring

'use client';

import React, { useState, useEffect } from 'react';

interface WitnessStats {
  totalWitnesses: number;
  targetWitnesses: number;
  percentComplete: number;
  criticalStatus: string;
  recentWitnesses: {
    address: string;
    ensName?: string;
    witnessNumber: number;
    timestamp: string;
  }[];
}

export default function CovenantDashboard() {
  const [stats, setStats] = useState<WitnessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate days until October 19, 2025
  const launchDate = new Date('2025-10-19T00:00:00-04:00');
  const now = new Date();
  const daysRemaining = Math.ceil((launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    fetchWitnessStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchWitnessStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchWitnessStats() {
    try {
      const response = await fetch('/api/covenant/witnesses?includeStats=true');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setError(null);
      } else {
        setError('Failed to fetch witness statistics');
      }
    } catch (err) {
      setError('API connection failed');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-helvetica flex items-center justify-center">
        <div className="text-2xl font-bold uppercase">Loading Dashboard...</div>
      </div>
    );
  }

  const statusColor = stats?.criticalStatus === 'CRITICAL' ? 'border-red-500 bg-red-900/20' :
                      stats?.criticalStatus === 'WARNING' ? 'border-yellow-500 bg-yellow-900/20' :
                      stats?.criticalStatus === 'PROGRESS' ? 'border-blue-500 bg-blue-900/20' :
                      'border-green-500 bg-green-900/20';

  const statusTextColor = stats?.criticalStatus === 'CRITICAL' ? 'text-red-400' :
                          stats?.criticalStatus === 'WARNING' ? 'text-yellow-400' :
                          stats?.criticalStatus === 'PROGRESS' ? 'text-blue-400' :
                          'text-green-400';

  return (
    <div className="min-h-screen bg-black text-white font-helvetica">
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            COVENANT DASHBOARD
          </h1>
          <p className="text-xl mt-2 opacity-75">
            Real-time Witness Registry Monitoring
          </p>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {error && (
          <div className="border border-red-500 p-6 mb-8 bg-red-900/20">
            <div className="text-red-400 font-bold">SYSTEM ERROR</div>
            <div className="mt-2">{error}</div>
            <div className="text-sm opacity-75 mt-2">
              Check database deployment and API endpoints
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Launch Countdown */}
          <div className="border border-white p-6">
            <h2 className="text-2xl font-bold uppercase mb-4">Launch Countdown</h2>
            <div className="text-5xl font-bold mb-2">{daysRemaining}</div>
            <div className="text-lg uppercase">Days Remaining</div>
            <div className="text-sm opacity-75 mt-2">October 19, 2025</div>
            
            {daysRemaining <= 7 && (
              <div className="mt-4 text-red-400 font-bold">
                🚨 CRITICAL: Launch date approaching!
              </div>
            )}
          </div>

          {/* Witness Progress */}
          <div className="border border-white p-6">
            <h2 className="text-2xl font-bold uppercase mb-4">Witness Registry</h2>
            <div className="text-5xl font-bold mb-2">
              {stats?.totalWitnesses || 0}/{stats?.targetWitnesses || 100}
            </div>
            <div className="text-lg uppercase">Founding Witnesses</div>
            <div className="text-sm opacity-75 mt-2">
              {stats?.percentComplete || 0}% Complete
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-800 h-2 rounded">
              <div 
                className="h-2 bg-white rounded transition-all duration-300"
                style={{ width: `${stats?.percentComplete || 0}%` }}
              />
            </div>
          </div>

          {/* Critical Status */}
          <div className={`border p-6 ${statusColor}`}>
            <h2 className="text-2xl font-bold uppercase mb-4">System Status</h2>
            <div className={`text-3xl font-bold mb-2 ${statusTextColor}`}>
              {stats?.criticalStatus || 'UNKNOWN'}
            </div>
            <div className="text-lg uppercase">Registry Health</div>
            <div className="text-sm opacity-75 mt-2">
              {stats?.criticalStatus === 'CRITICAL' ? 'Need immediate action' :
               stats?.criticalStatus === 'WARNING' ? 'Accelerate recruitment' :
               stats?.criticalStatus === 'PROGRESS' ? 'On track for launch' :
               'Launch ready!'}
            </div>
          </div>

        </div>

        {/* Recent Witnesses */}
        <div className="border border-white">
          <div className="p-6 border-b border-white">
            <h2 className="text-2xl font-bold uppercase">Recent Witnesses</h2>
          </div>
          
          <div className="p-6">
            {stats?.recentWitnesses && stats.recentWitnesses.length > 0 ? (
              <div className="space-y-4">
                {stats.recentWitnesses.map((witness, index) => (
                  <div key={witness.address} className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <div>
                      <div className="font-bold">
                        Witness #{witness.witnessNumber}
                      </div>
                      <div className="text-sm opacity-75">
                        {witness.ensName || `${witness.address.slice(0, 8)}...${witness.address.slice(-6)}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {new Date(witness.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs opacity-75">
                        {new Date(witness.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 opacity-75">
                <div className="text-xl mb-2">No witnesses registered yet</div>
                <div className="text-sm">Waiting for first founding witness...</div>
              </div>
            )}
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Recruitment Status */}
          <div className="border border-white p-6">
            <h3 className="text-xl font-bold uppercase mb-4">Recruitment Needed</h3>
            {stats && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Witnesses Needed:</span>
                  <span className="font-bold">
                    {Math.max(0, stats.targetWitnesses - stats.totalWitnesses)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Rate Required:</span>
                  <span className="font-bold">
                    {Math.ceil(Math.max(0, stats.targetWitnesses - stats.totalWitnesses) / Math.max(1, daysRemaining))}
                    /day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time Pressure:</span>
                  <span className={`font-bold ${daysRemaining <= 14 ? 'text-red-400' : 'text-white'}`}>
                    {daysRemaining <= 7 ? 'EXTREME' :
                     daysRemaining <= 14 ? 'HIGH' :
                     daysRemaining <= 30 ? 'MODERATE' : 'LOW'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* System Health */}
          <div className="border border-white p-6">
            <h3 className="text-xl font-bold uppercase mb-4">System Health</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Database:</span>
                <span className={error ? 'text-red-400' : 'text-green-400'}>
                  {error ? 'ERROR' : 'OPERATIONAL'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>API Endpoints:</span>
                <span className={error ? 'text-red-400' : 'text-green-400'}>
                  {error ? 'FAILED' : 'RESPONDING'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Update:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-sm opacity-75">
            <p className="text-red-400 font-bold">EMERGENCY 72-HOUR IMPLEMENTATION</p>
            <p className="mt-2">
              Dashboard auto-refreshes every 30 seconds | October 19, 2025 launch target
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}