'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArchetypeCard } from './ArchetypeCard';

export type StartingArchetype = 'CREATOR' | 'CURATOR' | 'TRADER';

interface Archetype {
  type: StartingArchetype;
  title: string;
  description: string;
  example: string;
  skills: string[];
  icon: string;
}

const ARCHETYPES: Archetype[] = [
  {
    type: 'CREATOR',
    title: 'START AS CREATOR',
    description: 'Begin with making things',
    example: 'Creates and mints a new artwork every sunset',
    skills: ['MINTING', 'IPFS', 'IMAGE_GENERATION'],
    icon: '🎨'
  },
  {
    type: 'CURATOR',
    title: 'START AS CURATOR', 
    description: 'Begin with organizing',
    example: 'Selects 3 pieces for daily exhibition',
    skills: ['REGISTRY_SEARCH', 'COLLECTION_MGMT', 'CURATION'],
    icon: '🏛️'
  },
  {
    type: 'TRADER',
    title: 'START AS TRADER',
    description: 'Begin with token flows', 
    example: 'Allocates 0.1 ETH to daily acquisitions',
    skills: ['TOKEN_TRANSFER', 'MARKET_ANALYSIS', 'AUCTIONS'],
    icon: '📊'
  }
];

export function ArchetypeSelection() {
  const [selectedArchetype, setSelectedArchetype] = useState<StartingArchetype | null>(null);
  const router = useRouter();

  const handleArchetypeSelect = (archetype: StartingArchetype) => {
    setSelectedArchetype(archetype);
  };

  const handleContinue = () => {
    if (selectedArchetype) {
      // Navigate to training flow with selected archetype
      router.push(`/academy/train/identity?archetype=${selectedArchetype}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Archetype Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARCHETYPES.map((archetype) => (
          <ArchetypeCard
            key={archetype.type}
            archetype={archetype}
            selected={selectedArchetype === archetype.type}
            onSelect={() => handleArchetypeSelect(archetype.type)}
          />
        ))}
      </div>

      {/* Evolution Message */}
      <div className="text-center p-6 border border-gray-800">
        <p className="text-sm text-gray-400 tracking-wider uppercase">
          SPIRITS EVOLVE — ADD NEW PRACTICES & SKILLS ANYTIME
        </p>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selectedArchetype}
          className={`
            px-12 py-4 border font-bold tracking-wider uppercase transition-all duration-150
            ${selectedArchetype
              ? 'border-white text-white hover:bg-white hover:text-black'
              : 'border-gray-800 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          BEGIN TRAINING
        </button>
      </div>
    </div>
  );
}