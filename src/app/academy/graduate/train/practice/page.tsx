'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FEATURE_FLAGS } from '@/config/flags';

type StartingArchetype = 'CREATOR' | 'CURATOR' | 'TRADER';

const OUTPUT_TYPES = {
  CREATOR: ['ARTWORK', 'MUSIC', 'WRITING', 'PHOTOGRAPHY'],
  CURATOR: ['EXHIBITION', 'COLLECTION', 'PLAYLIST', 'SELECTION'],
  TRADER: ['ACQUISITION', 'SALE', 'ALLOCATION', 'POSITION']
};

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [archetype, setArchetype] = useState<StartingArchetype | null>(null);
  const [name, setName] = useState('');
  const [time, setTime] = useState('21:00'); // Default sunset time
  const [outputType, setOutputType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [observeSabbath, setObserveSabbath] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Feature flag check
  if (!FEATURE_FLAGS.FF_EDEN3_ONBOARDING) {
    router.push('/');
    return null;
  }

  useEffect(() => {
    const archetypeParam = searchParams.get('archetype') as StartingArchetype;
    const nameParam = searchParams.get('name');
    
    if (archetypeParam && nameParam && ['CREATOR', 'CURATOR', 'TRADER'].includes(archetypeParam)) {
      setArchetype(archetypeParam);
      setName(nameParam);
      setOutputType(OUTPUT_TYPES[archetypeParam][0]); // Set first option as default
    } else {
      router.push('/academy/graduate');
    }
  }, [searchParams, router]);

  useEffect(() => {
    setIsValid(time && outputType && quantity > 0 && quantity <= 10);
  }, [time, outputType, quantity]);

  const handleContinue = () => {
    if (isValid && archetype) {
      const params = new URLSearchParams({
        archetype,
        name,
        time,
        outputType,
        quantity: quantity.toString(),
        observeSabbath: observeSabbath.toString()
      });
      router.push(`/academy/graduate/train/graduation?${params.toString()}`);
    }
  };

  if (!archetype) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-wider uppercase mb-2">
            DEFINE YOUR PRACTICE
          </h1>
          <p className="text-gray-400">
            Configure the sacred ritual for <span className="text-white">{name}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Practice Configuration */}
          <div className="space-y-6">
            {/* When */}
            <div className="space-y-3">
              <label className="block text-sm font-bold tracking-wider uppercase text-gray-400">
                WHEN
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-4 bg-black border border-gray-800 text-white text-xl
                         focus:border-white focus:outline-none transition-colors duration-150"
              />
              <p className="text-sm text-gray-500">
                Daily practice time: {formatTime(time)}
              </p>
            </div>

            {/* What */}
            <div className="space-y-3">
              <label className="block text-sm font-bold tracking-wider uppercase text-gray-400">
                WHAT
              </label>
              <select
                value={outputType}
                onChange={(e) => setOutputType(e.target.value)}
                className="w-full p-4 bg-black border border-gray-800 text-white text-xl
                         focus:border-white focus:outline-none transition-colors duration-150"
              >
                {OUTPUT_TYPES[archetype].map((option) => (
                  <option key={option} value={option} className="bg-black">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="block text-sm font-bold tracking-wider uppercase text-gray-400">
                QUANTITY
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24 p-4 bg-black border border-gray-800 text-white text-xl text-center
                           focus:border-white focus:outline-none transition-colors duration-150"
                />
                <span className="text-gray-400">per day</span>
              </div>
            </div>

            {/* Sabbath Option */}
            <div className="flex items-center space-x-4 p-4 border border-gray-800">
              <input
                type="checkbox"
                id="sabbath"
                checked={observeSabbath}
                onChange={(e) => setObserveSabbath(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="sabbath" className="text-sm tracking-wider uppercase">
                OBSERVE SABBATH (SUNDAY REST)
              </label>
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-6 border border-gray-800 bg-gray-900">
            <h3 className="font-bold tracking-wider uppercase mb-4">
              PRACTICE PREVIEW
            </h3>
            <p className="text-lg">
              Every day at <span className="text-white font-bold">{formatTime(time)}</span>,{' '}
              <span className="text-white font-bold">{name}</span> will create{' '}
              <span className="text-white font-bold">{quantity}</span>{' '}
              <span className="text-white font-bold">{outputType.toLowerCase()}</span>
              {quantity > 1 ? 's' : ''}
              {observeSabbath && ' (except Sundays)'}
            </p>
          </div>

          {/* Sacred Ritual Note */}
          <div className="p-6 border border-gray-800">
            <h3 className="font-bold tracking-wider uppercase mb-4 text-yellow-400">
              ⚡ SACRED COVENANT
            </h3>
            <p className="text-gray-400 text-sm">
              This practice becomes your Spirit's sacred covenant — written to the blockchain 
              and executed daily to generate autonomous income. Choose wisely.
            </p>
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
              disabled={!isValid}
              className={`
                flex-1 px-8 py-4 border font-bold tracking-wider uppercase transition-all duration-150
                ${isValid
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-gray-800 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              CONTINUE TO GRADUATION
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}