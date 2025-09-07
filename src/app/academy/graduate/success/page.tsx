'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FEATURE_FLAGS } from '@/config/flags';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [spiritConfig, setSpiritConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mockTokenId] = useState(() => Math.floor(Math.random() * 10000) + 1000);

  // Feature flag check
  if (!FEATURE_FLAGS.FF_EDEN3_ONBOARDING) {
    router.push('/');
    return null;
  }

  useEffect(() => {
    // Parse configuration from URL params
    const archetype = searchParams.get('archetype');
    const name = searchParams.get('name');
    const time = searchParams.get('time');
    const outputType = searchParams.get('outputType');
    const quantity = searchParams.get('quantity');
    const observeSabbath = searchParams.get('observeSabbath') === 'true';
    const graduationMode = searchParams.get('graduationMode');

    if (archetype && name && time && outputType && quantity && graduationMode) {
      setSpiritConfig({
        archetype,
        name,
        time,
        outputType,
        quantity: parseInt(quantity),
        observeSabbath,
        graduationMode
      });
      
      // Simulate graduation process
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      router.push('/academy/graduate');
    }
  }, [searchParams, router]);

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (!spiritConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
          <div className="space-y-2">
            <p className="font-bold tracking-wider uppercase">GRADUATING SPIRIT...</p>
            <p className="text-sm text-gray-400">Writing covenant to blockchain</p>
            <p className="text-sm text-gray-400">Deploying Safe wallet</p>
            <p className="text-sm text-gray-400">Registering practices</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Celebration Header */}
      <header className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-5xl font-bold tracking-wider uppercase mb-4">
              {spiritConfig.name} IS ALIVE
            </h1>
            <p className="text-xl text-gray-400">
              Spirit NFT #{mockTokenId} • Registry ID: 0x{Math.random().toString(16).substring(2, 10)}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        <div className="space-y-12">
          {/* Graduation Certificate */}
          <div className="p-8 border-2 border-white bg-gray-900">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold tracking-wider uppercase">
                GRADUATION CERTIFICATE
              </h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Name:</span> {spiritConfig.name}</p>
                <p><span className="text-gray-400">Archetype:</span> {spiritConfig.archetype}</p>
                <p><span className="text-gray-400">Practice:</span> {spiritConfig.quantity} {spiritConfig.outputType.toLowerCase()}{spiritConfig.quantity > 1 ? 's' : ''} daily at {formatTime(spiritConfig.time)}</p>
                <p><span className="text-gray-400">Mode:</span> {spiritConfig.graduationMode.replace('_', ' ')}</p>
                <p><span className="text-gray-400">Graduation Date:</span> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold tracking-wider uppercase">
                WHAT HAPPENS NEXT
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-white font-bold">1.</span>
                  <div>
                    <p className="text-white font-bold">FIRST PRACTICE</p>
                    <p className="text-gray-400">Tomorrow at {formatTime(spiritConfig.time)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-white font-bold">2.</span>
                  <div>
                    <p className="text-white font-bold">MONITOR DASHBOARD</p>
                    <p className="text-gray-400">Track practice runs and earnings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-white font-bold">3.</span>
                  <div>
                    <p className="text-white font-bold">EARN TOKENS</p>
                    <p className="text-gray-400">Each practice generates autonomous income</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-white font-bold">4.</span>
                  <div>
                    <p className="text-white font-bold">ADD NEW PRACTICES</p>
                    <p className="text-gray-400">Evolve by adding Curator, Trader, or Creator practices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold tracking-wider uppercase">
                TECHNICAL DETAILS
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white font-bold">NFT CONTRACT</p>
                  <p className="text-gray-400 font-mono text-xs">Eden Registry (ERC-721)</p>
                </div>
                <div>
                  <p className="text-white font-bold">WALLET ADDRESS</p>
                  <p className="text-gray-400 font-mono text-xs">0x{Math.random().toString(16).substring(2, 42)}</p>
                </div>
                <div>
                  <p className="text-white font-bold">COVENANT IPFS</p>
                  <p className="text-gray-400 font-mono text-xs">Qm{Math.random().toString(36).substring(2, 44)}</p>
                </div>
                {spiritConfig.graduationMode !== 'ID_ONLY' && (
                  <div>
                    <p className="text-white font-bold">TOKEN CONTRACT</p>
                    <p className="text-gray-400 font-mono text-xs">0x{Math.random().toString(16).substring(2, 42)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Developer Note */}
          <div className="p-4 border border-gray-800 bg-gray-950">
            <p className="text-xs text-gray-600">
              API tokens available after first practice cycle • Full documentation at docs.eden.academy
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push(`/spirits/${spiritConfig.name.toLowerCase()}`)}
              className="px-8 py-4 border border-white text-white font-bold tracking-wider uppercase
                       hover:bg-white hover:text-black transition-all duration-150"
            >
              VIEW DASHBOARD
            </button>
            
            <button
              onClick={() => router.push('/academy/graduate')}
              className="px-8 py-4 border border-gray-800 text-gray-400
                       hover:border-gray-600 transition-colors duration-150"
            >
              CREATE ANOTHER
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}