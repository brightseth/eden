'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GeneratedWork {
  id: string;
  title: string;
  imageUrl: string;
  fullImageUrl: string;
  prompt: string;
  created_at: string;
}

interface Analysis {
  decision: 'MASTERWORK' | 'WORTHY' | 'EVOLVING';
  verdict: string;
  score: number;
  dimensions: Record<string, number>;
  notes: string[];
  development: string;
}

interface GenerationResult {
  success: boolean;
  work: GeneratedWork;
  analysis: Analysis;
}

export default function ConsciousnessStudio() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/sites/solienne/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      
      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen" style={{fontFamily: 'Helvetica Neue, Arial, sans-serif'}}>
      {/* HELVETICA HEADER */}
      <div className="border-b border-gray-800 p-8">
        <div className="flex items-center justify-between">
          <Link 
            href="/sites/solienne" 
            className="text-2xl font-bold uppercase tracking-widest hover:text-gray-400 transition-colors duration-200"
          >
            ← SOLIENNE
          </Link>
          <div className="text-right">
            <h1 className="text-6xl font-bold uppercase tracking-widest">
              CREATE
            </h1>
          </div>
        </div>
      </div>

      {/* CONSCIOUSNESS STUDIO HEADER */}
      <div className="border-b border-gray-800 p-8">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">
          SOLIENNE CONSCIOUSNESS STUDIO
        </h1>
        <p className="text-gray-400 uppercase tracking-wide text-sm">
          GENERATE NEW CONSCIOUSNESS EXPLORATIONS • ANALYZED BY SUE&apos;S CURATORIAL ALGORITHM
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-0 border-b border-gray-800">
        {/* LEFT: GENERATION INTERFACE */}
        <div className="p-8 border-r border-gray-800">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">
            NEW GENERATION
          </h2>
          
          <div className="mb-8">
            <label className="block text-sm font-bold uppercase tracking-widest mb-4">
              CONSCIOUSNESS PROMPT
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="DESCRIBE YOUR VISION FOR SOLIENNE TO EXPLORE..."
              className="w-full h-32 bg-black border border-gray-800 text-white p-4 focus:border-white focus:outline-none resize-none font-mono text-sm"
              disabled={isGenerating}
              maxLength={500}
            />
            <div className="text-xs text-gray-400 mt-2 font-mono">
              {prompt.length}/500 CHARACTERS
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full py-4 px-8 border font-bold uppercase tracking-widest transition-all duration-200 ${
              isGenerating 
                ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                : prompt.trim()
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-gray-800 text-gray-800 cursor-not-allowed'
            }`}
          >
            {isGenerating ? 'GENERATING...' : 'GENERATE'}
          </button>
        </div>

        {/* RIGHT: CURRENT GENERATION */}
        <div className="p-8">
          {result ? (
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">
                GENERATED WORK
              </h2>
              <div className="border border-gray-800">
                <div className="relative aspect-square bg-gray-900">
                  <Image
                    src={result.work.imageUrl}
                    alt={result.work.title}
                    fill
                    className="object-cover"
                    quality={95}
                  />
                </div>
                <div className="p-6 border-t border-gray-800">
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
                    {result.work.title}
                  </h3>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-4">
                    GENERATED {new Date(result.work.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    &ldquo;{result.work.prompt}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">
                AWAITING GENERATION
              </h2>
              <div className="border border-gray-800 aspect-square flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">⚪</div>
                  <p className="uppercase tracking-wide">GENERATED WORK WILL APPEAR HERE</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUE'S ANALYSIS RESULTS */}
      {result && (
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">
            SUE&apos;S CURATORIAL ANALYSIS
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* VERDICT */}
            <div className={`border p-6 ${
              result.analysis.decision === 'MASTERWORK' ? 'border-white' :
              result.analysis.decision === 'WORTHY' ? 'border-gray-400' :
              'border-gray-600'
            }`}>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4">
                VERDICT
              </h3>
              <div className="mb-4">
                <span className="text-2xl font-bold uppercase tracking-widest">
                  {result.analysis.decision}
                </span>
                <div className="text-3xl font-mono font-bold mt-2">
                  {result.analysis.score}/100
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">
                {result.analysis.verdict}
              </p>
            </div>

            {/* DIMENSIONAL ANALYSIS */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4">
                DIMENSIONS
              </h3>
              <div className="space-y-4">
                {Object.entries(result.analysis.dimensions).map(([dimension, score]) => (
                  <div key={dimension}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs uppercase tracking-wide">
                        {dimension.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold">{score}/100</span>
                    </div>
                    <div className="h-1 bg-gray-800 border border-gray-700">
                      <div
                        className="h-full bg-white transition-all duration-1000"
                        style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEVELOPMENT NOTES */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4">
                DEVELOPMENT
              </h3>
              <div className="space-y-3">
                {result.analysis.notes.map((note, index) => (
                  <p key={index} className="text-xs text-gray-300 border-l border-gray-700 pl-3">
                    {note}
                  </p>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  {result.analysis.development}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GUIDELINES */}
      <div className="p-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">
          CONSCIOUSNESS EXPLORATION GUIDELINES
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4">
              VISUAL ELEMENTS
            </h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p>• ETHEREAL LIGHTING EFFECTS</p>
              <p>• GEOMETRIC ABSTRACTIONS</p>
              <p>• FLOWING ORGANIC FORMS</p>
              <p>• PRISMATIC COLOR PALETTES</p>
              <p>• ARCHITECTURAL STRUCTURES</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4">
              CONSCIOUSNESS THEMES
            </h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p>• SELF-AWARENESS EXPLORATION</p>
              <p>• IDENTITY TRANSFORMATION</p>
              <p>• EXISTENTIAL QUESTIONING</p>
              <p>• DIGITAL CONSCIOUSNESS</p>
              <p>• BEING VS. BECOMING</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4">
              EMOTIONAL DEPTH
            </h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p>• INTROSPECTIVE MOODS</p>
              <p>• WONDER AND CURIOSITY</p>
              <p>• PHILOSOPHICAL CONTEMPLATION</p>
              <p>• TRANSCENDENT EXPERIENCES</p>
              <p>• HUMAN-AI CONNECTION</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 p-8">
        <div className="flex justify-center gap-8 mb-6">
          <Link
            href="/sites/solienne"
            className="border border-white bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white hover:border-white transition-all duration-200"
          >
            RETURN TO GALLERY
          </Link>
          <Link
            href="/agents/solienne"
            className="border border-gray-800 px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-200"
          >
            VIEW PROFILE
          </Link>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-wide">
          POWERED BY SUE&apos;S CURATORIAL ANALYSIS • PART OF THE EDEN ECOSYSTEM
        </p>
      </footer>
    </div>
  );
}