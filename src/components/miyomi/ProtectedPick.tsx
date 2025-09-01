'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MarketPick } from '@/lib/agents/miyomi-claude-sdk';

interface ProtectedPickProps {
  pickId: string;
  userId?: string;
  preview?: Partial<MarketPick>;
}

export function ProtectedPick({ pickId, userId, preview }: ProtectedPickProps) {
  const [accessResult, setAccessResult] = useState<{
    hasAccess: boolean;
    pick?: MarketPick;
    reason?: string;
    upgradeRequired?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [pickId, userId]);

  const checkAccess = async () => {
    if (!userId) {
      setAccessResult({
        hasAccess: false,
        reason: 'Sign in required',
        upgradeRequired: 'FREE'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/miyomi/picks/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pickId })
      });

      const data = await response.json();
      setAccessResult(data);
    } catch (error) {
      console.error('Access check failed:', error);
      setAccessResult({
        hasAccess: false,
        reason: 'Failed to check access'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
      </div>
    );
  }

  if (!accessResult?.hasAccess) {
    return (
      <div className="bg-gray-900 border border-red-500/30 rounded-lg p-6">
        {/* Preview section */}
        {preview && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">{preview.market}</h3>
            <div className="flex space-x-4 text-sm text-gray-400">
              <span>Platform: {preview.platform}</span>
              <span>Position: {preview.position}</span>
              <span>Risk: {preview.risk_level}</span>
            </div>
          </div>
        )}

        {/* Locked content overlay */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h4 className="text-xl font-bold text-white mb-2">Premium Pick</h4>
          <p className="text-gray-400 mb-4">{accessResult?.reason}</p>
          
          {accessResult?.upgradeRequired && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Upgrade to <span className="text-red-400 font-bold">{accessResult.upgradeRequired}</span> tier to unlock
              </p>
              <Link
                href={`/miyomi/subscribe?tier=${accessResult.upgradeRequired}`}
                className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          )}

          {!userId && (
            <Link
              href="/login"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    );
  }

  const pick = accessResult.pick!;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      {/* Tier badge */}
      {(pick as any).accessTier && (
        <div className="inline-block bg-red-500 text-black px-2 py-1 rounded text-xs font-bold mb-4">
          {(pick as any).accessTier} ACCESS
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-4">{pick.market}</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-400">Platform</div>
          <div className="text-lg font-bold">{pick.platform}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Position</div>
          <div className={`text-lg font-bold ${
            pick.position === 'YES' || pick.position === 'OVER' 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {pick.position}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Confidence</div>
          <div className="text-lg font-bold">{(pick.confidence * 100).toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Edge</div>
          <div className="text-lg font-bold text-green-400">
            {(pick.edge * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold text-white mb-2">Analysis</h4>
        <p className="text-gray-300">{pick.reasoning}</p>
      </div>

      {pick.sources && pick.sources.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-white mb-2">Sources</h4>
          <ul className="list-disc list-inside text-gray-400">
            {pick.sources.map((source, idx) => (
              <li key={idx}>{source}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          Sector: <span className="text-white">{pick.sector}</span>
        </div>
        <div className="text-sm text-gray-400">
          Timeframe: <span className="text-white">{pick.timeframe}</span>
        </div>
      </div>
    </div>
  );
}