// EMERGENCY WITNESS REGISTRY PAGE
// Critical Path: HOUR 18-24 - Rapid deployment for system testing

'use client';

import React from 'react';
import { WitnessRegistryInterface } from '@/components/covenant/WitnessRegistryInterface';

export default function WitnessRegistryPage() {
  return (
    <div className="min-h-screen bg-black text-white font-helvetica">
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            WITNESS REGISTRY
          </h1>
          <p className="text-xl mt-2 opacity-75">
            Join 100 Founding Witnesses | Abraham&apos;s Covenant
          </p>
        </div>
      </div>

      {/* Registry Interface */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <WitnessRegistryInterface />
      </div>

      {/* Emergency Status */}
      <div className="border-t border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-sm opacity-75">
            <p className="text-red-400 font-bold">EMERGENCY DEPLOYMENT</p>
            <p className="mt-2">
              72-hour sprint to save October 19, 2025 covenant launch
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}