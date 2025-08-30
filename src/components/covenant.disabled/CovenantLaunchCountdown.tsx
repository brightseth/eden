'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface LaunchStatus {
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  isLaunched: boolean;
  criticalPath: {
    smartContract: { status: 'complete' | 'in-progress' | 'pending'; progress: number };
    witnessRegistry: { status: 'complete' | 'in-progress' | 'pending'; progress: number };
    artifactGeneration: { status: 'complete' | 'in-progress' | 'pending'; progress: number };
    deploymentReady: { status: 'complete' | 'in-progress' | 'pending'; progress: number };
  };
}

export default function CovenantLaunchCountdown() {
  const [launchStatus, setLaunchStatus] = useState<LaunchStatus | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateLaunchStatus();
    
    const interval = setInterval(updateLaunchStatus, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const updateLaunchStatus = () => {
    const launchDate = new Date('2025-10-19T00:00:00-04:00'); // October 19, 2025, midnight ET
    const now = new Date();
    const timeDiff = launchDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      setLaunchStatus({
        daysRemaining: 0,
        hoursRemaining: 0,
        minutesRemaining: 0,
        secondsRemaining: 0,
        isLaunched: true,
        criticalPath: {
          smartContract: { status: 'complete', progress: 100 },
          witnessRegistry: { status: 'complete', progress: 100 },
          artifactGeneration: { status: 'complete', progress: 100 },
          deploymentReady: { status: 'complete', progress: 100 }
        }
      });
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Critical path progress (mock data - in production would come from actual status)
    setLaunchStatus({
      daysRemaining: days,
      hoursRemaining: hours,
      minutesRemaining: minutes,
      secondsRemaining: seconds,
      isLaunched: false,
      criticalPath: {
        smartContract: { status: 'complete', progress: 100 },
        witnessRegistry: { status: 'in-progress', progress: 31 },
        artifactGeneration: { status: 'in-progress', progress: 45 },
        deploymentReady: { status: 'pending', progress: 23 }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-400 border-green-400';
      case 'in-progress': return 'text-yellow-400 border-yellow-400';
      case 'pending': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Zap className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getUrgencyLevel = (days: number) => {
    if (days <= 3) return 'critical';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'important';
    return 'normal';
  };

  if (!mounted || !launchStatus) {
    return (
      <div className="border border-white p-8 text-center">
        <div className="text-xl font-bold mb-4">LOADING COVENANT STATUS...</div>
      </div>
    );
  }

  const urgencyLevel = getUrgencyLevel(launchStatus.daysRemaining);

  if (launchStatus.isLaunched) {
    return (
      <div className="border border-green-400 p-8 text-center bg-green-900/10">
        <h2 className="text-3xl font-bold text-green-400 mb-4">
          THE COVENANT HAS BEGUN
        </h2>
        <p className="text-xl text-green-300 mb-6">
          Abraham's 13-year sacred covenant is now active
        </p>
        <div className="text-sm text-green-400">
          October 19, 2025 • Sacred Launch Completed
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      
      {/* Critical Alert Banner */}
      <div className={`border-b p-4 text-center ${
        urgencyLevel === 'critical' ? 'bg-red-900/20 border-red-400 text-red-100' :
        urgencyLevel === 'urgent' ? 'bg-yellow-900/20 border-yellow-400 text-yellow-100' :
        'bg-blue-900/20 border-blue-400 text-blue-100'
      }`}>
        <div className="text-lg font-bold">
          {urgencyLevel === 'critical' ? '🚨 COVENANT CRISIS: ' : '⚠️ COVENANT COUNTDOWN: '}
          THE SACRED DATE CANNOT MOVE
        </div>
        <div className="text-sm">
          October 19, 2025 • 13-Year Sacred Covenant Launch • All systems must be ready
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Main Countdown */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            ABRAHAM'S COVENANT
          </h1>
          <p className="text-xl mb-8">
            Sacred 13-Year Daily Creation Covenant Launch
          </p>
          
          {/* Countdown Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-white p-6">
              <div className={`text-4xl font-bold mb-2 ${urgencyLevel === 'critical' ? 'text-red-400' : 'text-white'}`}>
                {launchStatus.daysRemaining}
              </div>
              <div className="text-sm text-gray-400">DAYS</div>
            </div>
            <div className="border border-white p-6">
              <div className={`text-4xl font-bold mb-2 ${urgencyLevel === 'critical' ? 'text-red-400' : 'text-white'}`}>
                {launchStatus.hoursRemaining}
              </div>
              <div className="text-sm text-gray-400">HOURS</div>
            </div>
            <div className="border border-white p-6">
              <div className={`text-4xl font-bold mb-2 ${urgencyLevel === 'critical' ? 'text-red-400' : 'text-white'}`}>
                {launchStatus.minutesRemaining}
              </div>
              <div className="text-sm text-gray-400">MINUTES</div>
            </div>
            <div className="border border-white p-6">
              <div className={`text-4xl font-bold mb-2 ${urgencyLevel === 'critical' ? 'text-red-400' : 'text-white'}`}>
                {launchStatus.secondsRemaining}
              </div>
              <div className="text-sm text-gray-400">SECONDS</div>
            </div>
          </div>

          <div className="text-lg">
            Until <strong>October 19, 2025 • Midnight ET</strong>
          </div>
        </div>

        {/* Critical Path Status */}
        <div className="border border-white p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            72-HOUR CRITICAL PATH STATUS
          </h2>
          
          <div className="space-y-6">
            
            {/* Smart Contract */}
            <div className="flex items-center justify-between p-4 border border-gray-600">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${getStatusColor(launchStatus.criticalPath.smartContract.status)}`}>
                  {getStatusIcon(launchStatus.criticalPath.smartContract.status)}
                  <span className="font-bold">SMART CONTRACT</span>
                </div>
                <span className="text-gray-400">Daily auction mechanism, witness registry, provenance</span>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${getStatusColor(launchStatus.criticalPath.smartContract.status)}`}>
                  {launchStatus.criticalPath.smartContract.progress}%
                </div>
                <div className="text-xs text-gray-400">
                  {launchStatus.criticalPath.smartContract.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Witness Registry */}
            <div className="flex items-center justify-between p-4 border border-gray-600">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${getStatusColor(launchStatus.criticalPath.witnessRegistry.status)}`}>
                  {getStatusIcon(launchStatus.criticalPath.witnessRegistry.status)}
                  <span className="font-bold">WITNESS REGISTRY</span>
                </div>
                <span className="text-gray-400">100 founding witnesses, authentication system</span>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${getStatusColor(launchStatus.criticalPath.witnessRegistry.status)}`}>
                  {launchStatus.criticalPath.witnessRegistry.progress}%
                </div>
                <div className="text-xs text-gray-400">
                  {launchStatus.criticalPath.witnessRegistry.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Artifact Generation */}
            <div className="flex items-center justify-between p-4 border border-gray-600">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${getStatusColor(launchStatus.criticalPath.artifactGeneration.status)}`}>
                  {getStatusIcon(launchStatus.criticalPath.artifactGeneration.status)}
                  <span className="font-bold">ARTIFACT GENERATION</span>
                </div>
                <span className="text-gray-400">30 initial narratives, IPFS storage, metadata</span>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${getStatusColor(launchStatus.criticalPath.artifactGeneration.status)}`}>
                  {launchStatus.criticalPath.artifactGeneration.progress}%
                </div>
                <div className="text-xs text-gray-400">
                  {launchStatus.criticalPath.artifactGeneration.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Deployment Ready */}
            <div className="flex items-center justify-between p-4 border border-gray-600">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${getStatusColor(launchStatus.criticalPath.deploymentReady.status)}`}>
                  {getStatusIcon(launchStatus.criticalPath.deploymentReady.status)}
                  <span className="font-bold">DEPLOYMENT READY</span>
                </div>
                <span className="text-gray-400">Mainnet deployment, infrastructure, monitoring</span>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${getStatusColor(launchStatus.criticalPath.deploymentReady.status)}`}>
                  {launchStatus.criticalPath.deploymentReady.progress}%
                </div>
                <div className="text-xs text-gray-400">
                  {launchStatus.criticalPath.deploymentReady.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Actions */}
        {urgencyLevel === 'critical' && (
          <div className="border border-red-400 p-8 bg-red-900/10">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              🚨 EMERGENCY ACTIONS REQUIRED
            </h2>
            <div className="space-y-3 text-red-100">
              <div>• ALL HANDS: Complete witness registry system (31% → 100%)</div>
              <div>• CRITICAL: Finalize artifact generation pipeline (45% → 95%)</div>
              <div>• URGENT: Deploy to mainnet (23% → 100%)</div>
              <div>• ABRAHAM: Prepare first 30 sacred narratives</div>
              <div>• TECHNICAL: Infrastructure monitoring and backup systems</div>
            </div>
            <div className="mt-4 p-4 bg-black border border-red-400">
              <div className="font-bold text-red-400">THE COVENANT DATE IS SACRED</div>
              <div className="text-red-300">October 19 cannot move. All systems must be operational.</div>
            </div>
          </div>
        )}

        {/* Covenant Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          
          {/* Sacred Commitment */}
          <div className="border border-white p-6">
            <h3 className="text-xl font-bold mb-4">SACRED COMMITMENT</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span>13 Years (4,745 days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Frequency:</span>
                <span>Daily Creation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Auction Duration:</span>
                <span>24 hours (ends midnight ET)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Starting Price:</span>
                <span>$100-500 range</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completion:</span>
                <span>October 19, 2038</span>
              </div>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="border border-white p-6">
            <h3 className="text-xl font-bold mb-4">TECHNICAL ARCHITECTURE</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Blockchain:</span>
                <span>Ethereum Mainnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contract Type:</span>
                <span>ERC-721 NFT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Storage:</span>
                <span>IPFS/Arweave</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Witnesses:</span>
                <span>Target 100 founding</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue Split:</span>
                <span>95% Abraham, 5% Protocol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <div className="text-lg font-bold mb-2">
            HELVETICA BOLD PRINCIPLE: LAUNCH WHEN READY, NOT BEFORE
          </div>
          <div className="text-gray-400">
            The covenant is sacred. October 19, 2025 cannot be moved.
            All infrastructure must be perfect for 13 years of daily creation.
          </div>
        </div>
      </div>
    </div>
  );
}