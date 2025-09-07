'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FEATURE_FLAGS } from '@/config/flags';
import { GraduationModeCard } from '@/components/academy/GraduationModeCard';

type GraduationMode = 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';

interface GraduationOption {
  mode: GraduationMode;
  title: string;
  description: string;
  features: string[];
  complexity: 'Simple' | 'Advanced' | 'Expert';
}

const GRADUATION_MODES: GraduationOption[] = [
  {
    mode: 'ID_ONLY',
    title: 'ID ONLY',
    description: 'Registry NFT + Safe Wallet',
    features: [
      'Spirit NFT in Eden Registry',
      'Safe smart wallet (4337)',
      'Basic practice tracking',
      'No token creation'
    ],
    complexity: 'Simple'
  },
  {
    mode: 'ID_PLUS_TOKEN',
    title: 'ID + TOKEN',
    description: 'Above + ERC-20 Token',
    features: [
      'Everything in ID Only',
      'Personal ERC-20 token',
      'Token rewards for practices',
      'Basic tokenomics'
    ],
    complexity: 'Advanced'
  },
  {
    mode: 'FULL_STACK',
    title: 'FULL STACK',
    description: 'Everything + Integrations',
    features: [
      'Everything in ID + Token',
      'Shopify integration',
      'Print-on-demand setup',
      'Advanced treasury management',
      'External API integrations'
    ],
    complexity: 'Expert'
  }
];

export default function GraduationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedMode, setSelectedMode] = useState<GraduationMode>('ID_ONLY'); // Default to simplest
  const [agentConfig, setAgentConfig] = useState<any>(null);

  // Feature flag check
  if (!FEATURE_FLAGS.FF_EDEN3_ONBOARDING) {
    router.push('/');
    return null;
  }

  useEffect(() => {
    // Parse all the configuration from previous steps
    const archetype = searchParams.get('archetype');
    const name = searchParams.get('name');
    const time = searchParams.get('time');
    const outputType = searchParams.get('outputType');
    const quantity = searchParams.get('quantity');
    const observeSabbath = searchParams.get('observeSabbath') === 'true';

    if (archetype && name && time && outputType && quantity) {
      setAgentConfig({
        archetype,
        name,
        time,
        outputType,
        quantity: parseInt(quantity),
        observeSabbath
      });
    } else {
      router.push('/academy/graduate');
    }
  }, [searchParams, router]);

  const handleContinue = () => {
    if (agentConfig) {
      const params = new URLSearchParams({
        ...agentConfig,
        quantity: agentConfig.quantity.toString(),
        observeSabbath: agentConfig.observeSabbath.toString(),
        graduationMode: selectedMode
      });
      router.push(`/academy/graduate/success?${params.toString()}`);
    }
  };

  if (!agentConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-wider uppercase mb-2">
            CHOOSE GRADUATION MODE
          </h1>
          <p className="text-gray-400">
            Select the complexity level for <span className="text-white">{agentConfig.name}</span>'s 
            onchain presence
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GRADUATION_MODES.map((mode) => (
              <GraduationModeCard
                key={mode.mode}
                mode={mode}
                selected={selectedMode === mode.mode}
                onSelect={() => setSelectedMode(mode.mode)}
              />
            ))}
          </div>

          {/* Recommendation */}
          <div className="p-6 border border-gray-800 bg-gray-900">
            <h3 className="font-bold tracking-wider uppercase mb-4">
              💡 RECOMMENDATION
            </h3>
            <p className="text-gray-400 text-sm">
              New Spirits should start with <span className="text-white font-bold">ID ONLY</span> mode.
              You can always upgrade later by adding tokens and integrations as your practice matures.
            </p>
          </div>

          {/* Final Review */}
          <div className="p-6 border border-gray-800">
            <h3 className="font-bold tracking-wider uppercase mb-4">
              FINAL REVIEW
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Name:</span> {agentConfig.name}
              </div>
              <div>
                <span className="text-gray-400">Archetype:</span> {agentConfig.archetype}
              </div>
              <div>
                <span className="text-gray-400">Practice:</span> {agentConfig.quantity} {agentConfig.outputType.toLowerCase()}{agentConfig.quantity > 1 ? 's' : ''} at {agentConfig.time}
              </div>
              <div>
                <span className="text-gray-400">Mode:</span> {selectedMode.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-8 py-4 border border-gray-800 text-gray-400 
                       hover:border-gray-600 transition-colors duration-150"
            >
              BACK
            </button>
            
            <button
              onClick={handleContinue}
              className="flex-1 px-8 py-4 border border-white text-white font-bold 
                       tracking-wider uppercase hover:bg-white hover:text-black 
                       transition-all duration-150"
            >
              GRADUATE TO SPIRIT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}