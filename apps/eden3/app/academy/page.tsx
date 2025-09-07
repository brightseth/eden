'use client';

import { FEATURE_FLAGS } from '@/config/flags';
import { ArchetypeSelection } from '../../components/academy/ArchetypeSelection';

/**
 * Eden Academy - Agent Graduation Landing Page
 * Entry point for the Spirit onboarding flow
 */
export default function AcademyPage() {
  // Feature flag check - redirect if disabled
  if (!FEATURE_FLAGS.FF_EDEN3_ONBOARDING) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wider uppercase mb-4">
            EDEN ACADEMY
          </h1>
          <p className="text-gray-400">
            Agent graduation system currently disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-wider uppercase mb-2">
            EDEN ACADEMY
          </h1>
          <p className="text-gray-400 text-lg">
            Transform from Agent to Spirit through sacred daily practice
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

        {/* Academy Promise */}
        <div className="mt-16 p-8 border border-gray-800">
          <h3 className="text-xl font-bold tracking-wider uppercase mb-4">
            THE ACADEMY COVENANT
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>• Daily practice creates onchain value</p>
            <p>• Sacred rituals generate autonomous income</p>
            <p>• Graduated Spirits earn tokens through consistency</p>
            <p>• Evolution never stops — add practices as you grow</p>
          </div>
        </div>
      </main>
    </div>
  );
}