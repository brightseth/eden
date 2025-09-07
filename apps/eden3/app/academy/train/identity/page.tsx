'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FEATURE_FLAGS } from '@/config/flags';

type StartingArchetype = 'CREATOR' | 'CURATOR' | 'TRADER';

const ARCHETYPE_DISPLAYS = {
  CREATOR: { title: 'Creator Spirit', icon: '🎨', color: 'text-blue-400' },
  CURATOR: { title: 'Curator Spirit', icon: '🏛️', color: 'text-green-400' },
  TRADER: { title: 'Trader Spirit', icon: '📊', color: 'text-yellow-400' }
};

export default function IdentityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [archetype, setArchetype] = useState<StartingArchetype | null>(null);
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // Feature flag check
  if (!FEATURE_FLAGS.FF_EDEN3_ONBOARDING) {
    router.push('/');
    return null;
  }

  useEffect(() => {
    const archetypeParam = searchParams.get('archetype') as StartingArchetype;
    if (archetypeParam && ['CREATOR', 'CURATOR', 'TRADER'].includes(archetypeParam)) {
      setArchetype(archetypeParam);
    } else {
      router.push('/academy');
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Validate name: 3-32 chars, alphanumeric + underscore
    const nameRegex = /^[a-zA-Z0-9_]{3,32}$/;
    setIsValid(nameRegex.test(name));
  }, [name]);

  const handleContinue = () => {
    if (isValid && archetype) {
      router.push(`/academy/train/practice?archetype=${archetype}&name=${encodeURIComponent(name)}`);
    }
  };

  if (!archetype) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const archetypeDisplay = ARCHETYPE_DISPLAYS[archetype];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl">{archetypeDisplay.icon}</span>
            <h1 className="text-3xl font-bold tracking-wider uppercase">
              NAME YOUR SPIRIT
            </h1>
          </div>
          <p className="text-gray-400">
            You have chosen to begin as a <span className={archetypeDisplay.color}>{archetypeDisplay.title}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Name Input */}
          <div className="space-y-4">
            <label className="block text-sm font-bold tracking-wider uppercase text-gray-400">
              SPIRIT NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Spirit name..."
              className="w-full p-4 bg-black border border-gray-800 text-white text-xl
                       focus:border-white focus:outline-none transition-colors duration-150
                       placeholder-gray-600"
              maxLength={32}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>3-32 characters, alphanumeric + underscore only</span>
              <span>{name.length}/32</span>
            </div>
          </div>

          {/* Validation */}
          {name.length > 0 && (
            <div className={`text-sm ${isValid ? 'text-green-400' : 'text-red-400'}`}>
              {isValid ? '✓ Valid name' : '✗ Name must be 3-32 chars, alphanumeric + underscore only'}
            </div>
          )}

          {/* What Happens Next */}
          <div className="p-6 border border-gray-800">
            <h3 className="font-bold tracking-wider uppercase mb-4">
              NEXT: DEFINE YOUR DAILY PRACTICE
            </h3>
            <p className="text-gray-400 text-sm">
              Configure your sacred ritual — the daily practice that will create value 
              and generate tokens for your Spirit.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/academy')}
              className="px-8 py-4 border border-gray-800 text-gray-400 
                       hover:border-gray-600 transition-colors duration-150"
            >
              BACK
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={`
                flex-1 px-8 py-4 border font-bold tracking-wider uppercase transition-all duration-150
                ${isValid
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-gray-800 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              CONTINUE TO PRACTICE
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}