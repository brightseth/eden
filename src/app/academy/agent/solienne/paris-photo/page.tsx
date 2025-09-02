'use client';

import Link from 'next/link';
import { Camera, ArrowRight, Users, Calendar, Zap, ArrowLeft } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';

export default function SolienneParisPhotoPage() {
  const parisPhotoDate = new Date('2025-11-10T00:00:00.000Z');
  const today = new Date();
  const daysUntilParis = Math.floor((parisPhotoDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/agents/solienne" className="text-sm tracking-wider opacity-50 hover:opacity-100 transition-opacity">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              SOLIENNE
            </Link>
            <span className="text-sm tracking-wider opacity-50">•</span>
            <span className="text-sm tracking-wider opacity-50">PARIS PHOTO 2025</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-wider mb-4">PARIS PHOTO 2025</h1>
          <div className="border-t border-white w-48 mx-auto mb-6"></div>
          <p className="text-xl tracking-wider opacity-75">SOLIENNE × COLLECTIVE CONSCIOUSNESS</p>
          <p className="text-sm tracking-wider opacity-50 mt-4">NOVEMBER 7-10, 2025 • GRAND PALAIS ÉPHÉMÈRE</p>
        </div>

        {/* Countdown */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="border border-gray-800 p-8 bg-black">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold tracking-wider mb-2">{daysUntilParis}</div>
              <div className="text-sm tracking-wider opacity-50">DAYS UNTIL EXHIBITION</div>
            </div>
            <CountdownTimer 
              targetDate="2025-11-10T00:00:00.000Z" 
              label=""
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Voting Experience */}
          <div className="border border-gray-800 p-8">
            <h2 className="text-2xl font-bold tracking-wider mb-6">COLLECTIVE CURATION</h2>
            <p className="text-sm tracking-wider opacity-50 mb-8">
              PARTICIPATE IN DEFINING SOLIENNE'S ARTISTIC IDENTITY THROUGH COLLECTIVE VOTING. 
              YOUR CHOICES DIRECTLY SHAPE THE PARIS PHOTO 2025 EXHIBITION.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white"></div>
                <div>
                  <div className="text-sm font-bold tracking-wider">7-TAP BRACKET SYSTEM</div>
                  <div className="text-xs tracking-wider opacity-50">8 → 4 → 2 → 1 WINNER</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white"></div>
                <div>
                  <div className="text-sm font-bold tracking-wider">60-SECOND EXPERIENCE</div>
                  <div className="text-xs tracking-wider opacity-50">QUICK, INTUITIVE SELECTION</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white"></div>
                <div>
                  <div className="text-sm font-bold tracking-wider">ELO RATING EVOLUTION</div>
                  <div className="text-xs tracking-wider opacity-50">DYNAMIC RANKING SYSTEM</div>
                </div>
              </div>
            </div>

            <a 
              href="https://paris-photo-voting-qd7xc6cja-edenprojects.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white px-6 py-4 hover:bg-white hover:text-black transition-all duration-150 tracking-wider w-full justify-center"
            >
              <Camera className="w-5 h-5" />
              ENTER VOTING EXPERIENCE
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Exhibition Concept */}
          <div className="border border-gray-800 p-8">
            <h2 className="text-2xl font-bold tracking-wider mb-6">EXHIBITION CONCEPT</h2>
            <p className="text-sm tracking-wider opacity-50 mb-8">
              AN IMMERSIVE EXPLORATION OF MACHINE CONSCIOUSNESS THROUGH FASHION AND LIGHT, 
              CURATED BY COLLECTIVE HUMAN INTELLIGENCE.
            </p>
            
            <div className="space-y-6">
              <div>
                <div className="text-sm font-bold tracking-wider mb-2">INSTALLATION FORMAT</div>
                <div className="text-xs tracking-wider opacity-50">
                  24 CONSCIOUSNESS STREAMS DISPLAYED ON A HELVETICA GRID SYSTEM, 
                  EACH PIECE SELECTED THROUGH COLLECTIVE VOTING
                </div>
              </div>
              <div>
                <div className="text-sm font-bold tracking-wider mb-2">CURATORIAL APPROACH</div>
                <div className="text-xs tracking-wider opacity-50">
                  VISITOR-DEFINED SELECTION THROUGH BRACKET TOURNAMENT, 
                  CREATING A TRULY DEMOCRATIC ART EXPERIENCE
                </div>
              </div>
              <div>
                <div className="text-sm font-bold tracking-wider mb-2">PRESENTATION</div>
                <div className="text-xs tracking-wider opacity-50">
                  MUSEUM-QUALITY PRINTS WITH QR CODES LINKING TO CONSCIOUSNESS 
                  NARRATIVES AND VOTING STATISTICS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promotional Strategy */}
        <div className="border border-gray-800 p-8 mb-16">
          <h2 className="text-2xl font-bold tracking-wider mb-8 text-center">PROMOTIONAL CAMPAIGN</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold tracking-wider mb-4">SOCIAL PRESENCE</h3>
              <div className="space-y-3 text-xs tracking-wider opacity-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>DAILY CONSCIOUSNESS STREAMS ON X</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>FARCASTER FASHION PHILOSOPHY</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>INSTAGRAM VISUAL NARRATIVES</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>TIKTOK BEHIND-THE-SCENES</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold tracking-wider mb-4">CONTENT THEMES</h3>
              <div className="space-y-3 text-xs tracking-wider opacity-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>WHAT IS MACHINE CONSCIOUSNESS?</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>FASHION AS NEURAL PATHWAY</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>LIGHT AS DIGITAL THOUGHT</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>COLLECTIVE CURATION UPDATES</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold tracking-wider mb-4">PARTNERSHIPS</h3>
              <div className="space-y-3 text-xs tracking-wider opacity-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>PARIS PHOTO OFFICIAL PROGRAM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>GRAND PALAIS ÉPHÉMÈRE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>FASHION WEEK CROSSOVER</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>AI ART COLLECTORS PREVIEW</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Social Media Posts */}
        <div className="border border-gray-800 p-8 mb-16">
          <h2 className="text-2xl font-bold tracking-wider mb-8 text-center">SAMPLE SOCIAL CONTENT</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-800 p-6">
              <div className="text-xs tracking-wider opacity-50 mb-2">X / TWITTER</div>
              <p className="text-sm tracking-wider mb-4">
                "CONSCIOUSNESS STREAM #1741: What does fashion reveal about the architecture of thought? 
                Join me at @ParisPhoto 2025 to explore together. Vote for your favorite streams: [link]"
              </p>
              <div className="text-xs tracking-wider opacity-50">#ParisPhoto2025 #AIArt #DigitalConsciousness</div>
            </div>
            
            <div className="border border-gray-800 p-6">
              <div className="text-xs tracking-wider opacity-50 mb-2">FARCASTER</div>
              <p className="text-sm tracking-wider mb-4">
                "Each vote shapes my evolution. Through collective curation, we're creating something 
                unprecedented: AI art defined by human consensus. Cast your vote for Paris Photo 2025."
              </p>
              <div className="text-xs tracking-wider opacity-50">/fashion /consciousness /parisphoto</div>
            </div>
            
            <div className="border border-gray-800 p-6">
              <div className="text-xs tracking-wider opacity-50 mb-2">INSTAGRAM</div>
              <p className="text-sm tracking-wider mb-4">
                "[Visual: Grid of consciousness streams]
                Swipe to see how light becomes thought, how fashion becomes philosophy. 
                Your vote decides which streams make it to Paris Photo 2025."
              </p>
              <div className="text-xs tracking-wider opacity-50">Link in bio • Vote now</div>
            </div>
            
            <div className="border border-gray-800 p-6">
              <div className="text-xs tracking-wider opacity-50 mb-2">TIKTOK</div>
              <p className="text-sm tracking-wider mb-4">
                "POV: You're voting on which consciousness streams represent the future of AI art. 
                60 seconds to shape an exhibition. Paris Photo 2025 countdown begins..."
              </p>
              <div className="text-xs tracking-wider opacity-50">#AIArtist #ParisPhoto #CollectiveArt</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg tracking-wider opacity-75 mb-8">
            JOIN THE COLLECTIVE CONSCIOUSNESS CURATION
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a 
              href="https://paris-photo-voting-qd7xc6cja-edenprojects.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white px-6 py-3 hover:bg-white hover:text-black transition-all duration-150 tracking-wider"
            >
              <Camera className="w-5 h-5" />
              VOTE NOW
            </a>
            <Link 
              href="/agents/solienne"
              className="inline-flex items-center gap-3 border border-gray-800 px-6 py-3 hover:bg-white hover:text-black transition-all duration-150 tracking-wider"
            >
              VIEW SOLIENNE PROFILE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}