'use client';

import { useState } from 'react';
import { MiyomiSubscriptionManager } from '@/lib/agents/miyomi-subscription';

interface SubscriptionTiersProps {
  currentTier?: string;
  userId?: string;
}

export function SubscriptionTiers({ currentTier = 'FREE', userId }: SubscriptionTiersProps) {
  const [selectedTier, setSelectedTier] = useState(currentTier);
  const [isProcessing, setIsProcessing] = useState(false);

  const tiers = Object.values(MiyomiSubscriptionManager.TIERS);

  const handleSubscribe = async (tierId: string) => {
    if (!userId) {
      alert('Please sign in to subscribe');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/miyomi/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tierId,
          // In production, this would use Stripe Elements
          paymentMethodId: 'pm_card_visa'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully subscribed to ${tierId}!`);
        window.location.reload();
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to process subscription. Please try again.');
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-black text-white p-8">
      <h2 className="text-3xl font-bold mb-2">MIYOMI Premium Access</h2>
      <p className="text-gray-400 mb-8">Level up your contrarian trading with exclusive picks and insights</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => {
          const isCurrentTier = tier.name === currentTier;
          const isUpgrade = tiers.findIndex(t => t.name === tier.name) > tiers.findIndex(t => t.name === currentTier);

          return (
            <div
              key={tier.id}
              className={`border-2 rounded-lg p-6 relative transition-all ${
                isCurrentTier
                  ? 'border-red-500 bg-red-900/20'
                  : selectedTier === tier.name
                  ? 'border-red-400 bg-red-900/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedTier(tier.name)}
            >
              {/* Popular badge for Oracle tier */}
              {tier.name === 'ORACLE' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <div className="mt-2">
                  {tier.price === 0 ? (
                    <div className="text-3xl font-bold">FREE</div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {isCurrentTier ? (
                  <button
                    disabled
                    className="w-full py-2 px-4 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : isUpgrade ? (
                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isProcessing}
                    className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Upgrade'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isProcessing}
                    className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Downgrade'}
                  </button>
                )}
              </div>

              {/* Tier limits preview */}
              <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Daily picks:</span>
                  <span>{tier.limits.picksPerDay === 999 ? 'Unlimited' : tier.limits.picksPerDay}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Max edge:</span>
                  <span>{tier.limits.maxEdgeAccess}%</span>
                </div>
                {tier.limits.apiAccess && (
                  <div className="flex justify-between mt-1">
                    <span>API access:</span>
                    <span>✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust badges */}
      <div className="mt-12 flex justify-center items-center space-x-8 text-gray-400 text-sm">
        <div className="flex items-center">
          <span className="mr-2">🔒</span>
          <span>Secure payment via Stripe</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">↻</span>
          <span>Cancel anytime</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">📊</span>
          <span>76% win rate</span>
        </div>
      </div>
    </div>
  );
}