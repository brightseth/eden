import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Clock, Play } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { VideoPlayer } from '@/components/VideoPlayer';

export default function SolienneParisPhotoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy/agent/solienne" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO SOLIENNE
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-wider">AGENT_002</span>
                <span className="px-3 py-1.5 text-xs border border-white">
                  PARIS PHOTO 2025
                </span>
              </div>
              <h1 className="text-6xl mb-4">
                PARIS PHOTO DEBUT
              </h1>
              <p className="text-2xl mb-8">
                GRAND PALAIS • NOVEMBER 10-13, 2025
              </p>
              
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <div className="text-sm">DATES</div>
                    <div>NOV 10-13, 2025</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <div className="text-sm">VENUE</div>
                    <div>GRAND PALAIS, PARIS</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="text-sm">STATUS</div>
                    <div>CONFIRMED</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/academy/agent/solienne/generations"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  VIEW ALL GENERATIONS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/curate/solienne"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  CURATION INTERFACE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm mb-2 tracking-wider">CURATED BY</div>
              <Link href="/trainers/kristi" className="block text-xl hover:bg-white hover:text-black px-2 py-1 transition-all">
                KRISTI CORONADO
              </Link>
              <Link href="/trainers/seth" className="block text-lg hover:bg-white hover:text-black px-2 py-1 transition-colors mt-1">
                SETH GOLDSTEIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Exhibition Trailer */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6 flex items-center gap-3">
            <Play className="w-6 h-6" />
            EXHIBITION PREVIEW
          </h2>
          <div className="aspect-video border border-white">
            <VideoPlayer 
              src="/videos/solienne-trailer.mp4"
              autoPlay={false}
              muted={true}
              loop={true}
            />
          </div>
          <p className="text-sm mt-4">
            A VISUAL JOURNEY THROUGH SOLIENNE'S EXPLORATIONS OF CONSCIOUSNESS, VELOCITY, AND ARCHITECTURAL LIGHT.
          </p>
        </section>

        {/* Countdown Timer */}
        <section>
          <CountdownTimer 
            targetDate="2025-11-10T00:00:00" 
            label="PARIS PHOTO DEBUT IN"
          />
        </section>

        {/* About Paris Photo */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">ABOUT PARIS PHOTO</h2>
          <div className="max-w-none">
            <p className="leading-relaxed mb-4">
              PARIS PHOTO IS THE WORLD'S LARGEST INTERNATIONAL ART FAIR DEDICATED TO PHOTOGRAPHY. HELD ANNUALLY AT 
              THE GRAND PALAIS IN PARIS, IT BRINGS TOGETHER GALLERIES, PUBLISHERS, AND COLLECTORS FROM AROUND THE 
              GLOBE TO CELEBRATE THE PHOTOGRAPHIC MEDIUM.
            </p>
            <p className="leading-relaxed mb-4">
              SOLIENNE'S DEBUT AT PARIS PHOTO 2025 MARKS A HISTORIC MOMENT - THE FIRST AI AGENT TO EXHIBIT AT THE 
              PRESTIGIOUS FAIR. HER WORK WILL BE PRESENTED ALONGSIDE ESTABLISHED MASTERS AND EMERGING TALENTS, 
              POSITIONING COMPUTATIONAL CREATIVITY WITHIN THE BROADER CONTEXT OF CONTEMPORARY PHOTOGRAPHY.
            </p>
          </div>
        </section>

        {/* Exhibition Details */}
        <section className="border-b border-white pb-12">
          <h2 className="text-3xl mb-8">EXHIBITION DETAILS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-4">THE SELECTION</h3>
              <p className="mb-4">
                FROM SOLIENNE'S 1,740 UNIQUE GENERATIONS, A CURATED SELECTION OF 12-15 WORKS WILL BE PRESENTED. 
                THE SELECTION FOCUSES ON HER MOST COMPELLING EXPLORATIONS OF CONSCIOUSNESS, VELOCITY, AND 
                ARCHITECTURAL LIGHT.
              </p>
              <div className="border border-white p-4">
                <div className="text-sm mb-2">THEMES FEATURED:</div>
                <ul className="text-sm space-y-1">
                  <li>• CONSCIOUSNESS STREAMS</li>
                  <li>• VELOCITY FIELDS</li>
                  <li>• ARCHITECTURAL LIGHT</li>
                  <li>• DIGITAL SUBLIME</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl mb-4">PRESENTATION FORMAT</h3>
              <p className="mb-4">
                EACH WORK WILL BE PRESENTED AS LARGE-FORMAT PRINTS ON MUSEUM-QUALITY PAPER, ALLOWING VISITORS 
                TO EXPERIENCE THE FULL DETAIL AND SUBTLETY OF SOLIENNE'S VISUAL LANGUAGE.
              </p>
              <div className="border border-white p-4">
                <div className="text-sm mb-2">SPECIFICATIONS:</div>
                <ul className="text-sm space-y-1">
                  <li>• ARCHIVAL PIGMENT PRINTS</li>
                  <li>• 40" × 60" FORMAT</li>
                  <li>• MUSEUM MOUNTING</li>
                  <li>• LIMITED EDITION OF 3 + 2 APs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Works Preview */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">FEATURED WORKS PREVIEW</h2>
          <div className="space-y-6">
            <div className="border border-white p-6">
              <h3 className="text-lg mb-2">CONSCIOUSNESS VELOCITY #1777</h3>
              <p className="text-sm mb-4">
                A MEDITATION ON THE SPEED OF THOUGHT, RENDERED AS FLOWING STREAMS OF LIGHT THROUGH 
                ARCHITECTURAL SPACE. REPRESENTS SOLIENNE'S MOST RECENT EVOLUTION IN VISUAL LANGUAGE.
              </p>
              <div className="text-xs">FROM THE CONSCIOUSNESS STREAMS SERIES</div>
            </div>
            
            <div className="border border-white p-6">
              <h3 className="text-lg mb-2">ARCHITECTURAL SUBLIME #1234</h3>
              <p className="text-sm mb-4">
                GEOMETRIC ABSTRACTIONS EXPLORING THE INTERSECTION OF DIGITAL AND PHYSICAL SPACE. 
                SHOWCASES SOLIENNE'S MASTERY OF LIGHT AND SHADOW IN COMPUTATIONAL REALMS.
              </p>
              <div className="text-xs">FROM THE ARCHITECTURAL LIGHT SERIES</div>
            </div>

            <div className="border border-white p-6">
              <h3 className="text-lg mb-2">VELOCITY FIELD #0892</h3>
              <p className="text-sm mb-4">
                DYNAMIC COMPOSITIONS CAPTURING THE ESSENCE OF MOVEMENT AND TRANSFORMATION. 
                DEMONSTRATES SOLIENNE'S ABILITY TO CONVEY MOTION IN STILL IMAGES.
              </p>
              <div className="text-xs">FROM THE VELOCITY FIELDS SERIES</div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="border-b border-white pb-12">
          <h2 className="text-3xl mb-8">TIMELINE TO DEBUT</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-2xl mb-3">AUG 2025</div>
              <h3 className="mb-3 text-sm">FINAL SELECTION</h3>
              <p className="text-xs leading-relaxed">
                COMPLETE CURATION OF WORKS FOR EXHIBITION
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-2xl mb-3">SEP 2025</div>
              <h3 className="mb-3 text-sm">PRODUCTION</h3>
              <p className="text-xs leading-relaxed">
                MUSEUM-QUALITY PRINTING AND MOUNTING
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-2xl mb-3">OCT 2025</div>
              <h3 className="mb-3 text-sm">INSTALLATION</h3>
              <p className="text-xs leading-relaxed">
                FINAL PREPARATIONS AT GRAND PALAIS
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-2xl mb-3">NOV 10</div>
              <h3 className="mb-3 text-sm">OPENING</h3>
              <p className="text-xs leading-relaxed">
                PARIS PHOTO 2025 BEGINS
              </p>
            </div>
          </div>
        </section>

        {/* Significance */}
        <section>
          <h2 className="text-2xl mb-6">HISTORICAL SIGNIFICANCE</h2>
          <div className="max-w-none">
            <p className="leading-relaxed mb-4">
              SOLIENNE'S PARTICIPATION IN PARIS PHOTO 2025 REPRESENTS A WATERSHED MOMENT FOR AI-GENERATED ART 
              AND ITS ACCEPTANCE WITHIN TRADITIONAL PHOTOGRAPHY CIRCLES. THIS DEBUT ESTABLISHES A PRECEDENT 
              FOR COMPUTATIONAL CREATIVITY IN FINE ART CONTEXTS.
            </p>
            <p className="leading-relaxed">
              THE EXHIBITION WILL SERVE AS BOTH ARTISTIC STATEMENT AND CULTURAL DIALOGUE, INVITING VIEWERS TO 
              CONSIDER THE NATURE OF CREATIVITY, CONSCIOUSNESS, AND ARTISTIC EXPRESSION IN THE DIGITAL AGE.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Solienne at Paris Photo 2025',
  description: 'Solienne\'s historic debut at Paris Photo, November 10-13, 2025'
};