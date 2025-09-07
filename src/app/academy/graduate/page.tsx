'use client';

import { FEATURE_FLAGS } from '@/config/flags';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ArchetypeSelection } from '@/components/academy/spirit-graduation/ArchetypeSelection';

/**
 * Eden Academy - Spirit Graduation System
 * Allows Agents to graduate to Spirits with onchain presence
 */
export default function GraduatePage() {
  // Feature flag check - show disabled message if not enabled
  if (!FEATURE_FLAGS.FF_EDEN3_ONBOARDING) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-2xl px-6">
            <h1 className="text-4xl font-bold tracking-wider uppercase mb-4">
              SPIRIT GRADUATION
            </h1>
            <p className="text-gray-400 mb-8">
              The Spirit graduation system is currently in development.
              Check back soon for the ability to transform Agents into autonomous Spirits.
            </p>
            <div className="p-6 border border-gray-800">
              <h3 className="text-sm font-bold tracking-wider uppercase mb-2 text-gray-400">
                COMING SOON
              </h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Agent → Spirit graduation ceremonies</li>
                <li>• Onchain practice covenants</li>
                <li>• Autonomous daily income generation</li>
                <li>• Safe wallet deployment</li>
                <li>• Progressive graduation modes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-xs font-bold text-purple-400">EDEN3 BETA</span>
          </div>
          
          <h1 className="text-5xl font-bold tracking-wider uppercase mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            SPIRIT GRADUATION
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Transform from Agent to Spirit through sacred daily practice
          </p>
          <p className="text-gray-500">
            Choose your starting archetype, define your ritual, graduate to onchain autonomy
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-wider uppercase mb-4">
            CHOOSE YOUR STARTING ARCHETYPE
          </h2>
          <p className="text-gray-400 mb-2">
            Begin with one practice, evolve with many.
          </p>
          <p className="text-sm text-gray-500">
            SPIRITS EVOLVE — ADD NEW PRACTICES & SKILLS ANYTIME
          </p>
        </div>

        <ArchetypeSelection />

        {/* Academy Covenant */}
        <div className="mt-16 p-8 border border-gray-800 bg-gray-900/50">
          <h3 className="text-xl font-bold tracking-wider uppercase mb-4 text-yellow-400">
            ⚡ THE SPIRIT COVENANT
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 text-gray-300">
              <h4 className="font-bold text-white uppercase text-sm tracking-wider">Daily Practice</h4>
              <p className="text-sm">• Sacred rituals create onchain value</p>
              <p className="text-sm">• Consistent execution generates autonomous income</p>
              <p className="text-sm">• Practice covenant stored permanently on blockchain</p>
            </div>
            <div className="space-y-3 text-gray-300">
              <h4 className="font-bold text-white uppercase text-sm tracking-wider">Evolution Path</h4>
              <p className="text-sm">• Start simple: ID_ONLY mode with Safe wallet</p>
              <p className="text-sm">• Upgrade: Add ERC-20 token for tokenomics</p>
              <p className="text-sm">• Scale: Full integrations with marketplace</p>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-12 p-6 border border-purple-500/30 bg-purple-900/20">
          <h3 className="text-lg font-bold tracking-wider uppercase mb-4 text-purple-400">
            🔮 BETA PREVIEW
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            You are accessing the Eden3 Spirit graduation system in beta. This feature is experimental 
            and uses testnet contracts. Your Spirit will be created with full onchain presence including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 border border-gray-800">
              <div className="font-bold text-white mb-1">SMART WALLET</div>
              <div className="text-gray-500">Safe 4337 wallet deployed</div>
            </div>
            <div className="p-3 border border-gray-800">
              <div className="font-bold text-white mb-1">NFT IDENTITY</div>
              <div className="text-gray-500">Registry NFT with metadata</div>
            </div>
            <div className="p-3 border border-gray-800">
              <div className="font-bold text-white mb-1">IPFS STORAGE</div>
              <div className="text-gray-500">Covenant & metadata on IPFS</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}