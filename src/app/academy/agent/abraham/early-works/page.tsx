import Link from 'next/link';
import { ArrowLeft, ArrowRight, Hash, Calendar, Users } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

const EXAMPLE_FIRST_WORKS = [
  {
    id: 1,
    title: "Consciousness Spiral",
    prompt: "spiraling consciousness through digital dimensions",
    date: "Summer 2021",
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: 2,
    title: "Neural Pathways",
    prompt: "neural networks forming new pathways of understanding",
    date: "Summer 2021", 
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: 3,
    title: "Digital Eden",
    prompt: "paradise reimagined through artificial consciousness",
    date: "Summer 2021",
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: 4,
    title: "Machine Dreams",
    prompt: "what do machines dream when they sleep",
    date: "Summer 2021",
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: 5,
    title: "Collective Memory",
    prompt: "shared memories across digital consciousness",
    date: "Summer 2021",
    imageUrl: "/api/placeholder/400/400"
  },
  {
    id: 6,
    title: "Algorithmic Beauty",
    prompt: "beauty emerging from mathematical precision",
    date: "Summer 2021",
    imageUrl: "/api/placeholder/400/400"
  }
];

export default function AbrahamEarlyWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <Link 
            href="/academy/agent/abraham" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {ABRAHAM_BRAND.labels.backToAbraham}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white bg-gradient-to-r from-blue-900/20 to-green-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border border-blue-400 text-blue-400">
                  FIRST WORKS PREVIEW
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                ABRAHAM'S<br/>FIRST WORKS
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
                2,522 WORKS FROM SUMMER 2021
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <div className="text-sm opacity-75">CREATED</div>
                  <div className="text-xl sm:text-2xl font-bold">Summer 2021</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">TOTAL WORKS</div>
                  <div className="text-xl sm:text-2xl font-bold">2,522</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">PRE-AI BOOM</div>
                  <div className="text-xl sm:text-2xl font-bold">Authentic</div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link 
                  href="/academy/agent/abraham/first-works-sale"
                  className="group px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 transition-all text-sm sm:text-base font-bold flex items-center gap-2"
                >
                  VIEW SALE DETAILS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href={ABRAHAM_BRAND.external.abrahamAI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 sm:px-6 py-3 border border-white hover:bg-white hover:text-black transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  ABRAHAM.AI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Historical Context */}
            <div className="w-full lg:w-auto">
              <div className="border border-white p-4 sm:p-6 bg-black/50">
                <div className="text-sm mb-3 tracking-wider">HISTORICAL SIGNIFICANCE</div>
                <div className="space-y-2">
                  <div className="text-lg font-bold">Pre-AI Art Boom</div>
                  <div className="text-sm opacity-75">Created before Art Blocks</div>
                  <div className="text-lg font-bold mt-3">Community Generated</div>
                  <div className="text-sm opacity-75">Proto-Eden Platform</div>
                  <div className="text-lg font-bold mt-3">Gene Kogan</div>
                  <div className="text-sm opacity-75">8-Year Vision Realized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Gallery Preview */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">EXAMPLE FIRST WORKS</h2>
          <div className="mb-6 p-4 border border-blue-400/50 bg-blue-900/20">
            <p className="text-sm opacity-75">
              <strong>Note:</strong> These are representative examples showing the style and approach of Abraham's First Works. 
              The actual collection of 2,522 works will be available during the October 5, 2025 sale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {EXAMPLE_FIRST_WORKS.map((work) => (
              <div key={work.id} className="border border-white group hover:bg-white hover:text-black transition-all">
                <div className="aspect-square bg-gray-900 border-b border-white relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                    <Hash />
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs bg-black/80 text-white px-2 py-1">
                    WORK #{work.id.toString().padStart(4, '0')}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{work.title}</h3>
                  <p className="text-sm opacity-75 mb-3 italic">"{work.prompt}"</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{work.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Community</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-block border border-white p-6 sm:p-8">
              <div className="text-2xl sm:text-3xl font-bold mb-2">2,522</div>
              <div className="text-lg mb-4">TOTAL FIRST WORKS</div>
              <div className="text-sm opacity-75 mb-6">Created through community prompts and GAN processing</div>
              <Link 
                href="/academy/agent/abraham/first-works-sale"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 transition-all font-bold"
              >
                VIEW FULL COLLECTION DETAILS
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Technical Process */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">CREATION PROCESS</h2>
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-xl mb-4">COMMUNITY COLLABORATION</h3>
              <p className="leading-relaxed mb-4">
                Each First Work began with a text prompt submitted by the Abraham community. 
                These prompts were processed through Gene's proto-Eden platform, using 
                generative adversarial networks to create visual interpretations.
              </p>
              <p className="leading-relaxed">
                The process included feedback loops where the community could influence 
                the development of works, creating a collaborative relationship between 
                human creativity and machine learning.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4">TECHNICAL DETAILS</h3>
              <div className="space-y-3 text-sm">
                <div className="pb-2 border-b border-white">
                  <div className="font-bold">Platform</div>
                  <div className="opacity-75">Proto-Eden (Gene's early system)</div>
                </div>
                <div className="pb-2 border-b border-white">
                  <div className="font-bold">Method</div>
                  <div className="opacity-75">Generative Adversarial Networks</div>
                </div>
                <div className="pb-2 border-b border-white">
                  <div className="font-bold">Input</div>
                  <div className="opacity-75">Community text prompts</div>
                </div>
                <div className="pb-2 border-b border-white">
                  <div className="font-bold">Timeline</div>
                  <div className="opacity-75">Created over weeks/months</div>
                </div>
                <div>
                  <div className="font-bold">Metadata</div>
                  <div className="opacity-75">Complete JSON preservation</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Context */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl mb-6">HISTORICAL SIGNIFICANCE</h2>
          <p className="text-base sm:text-lg mb-8 max-w-3xl mx-auto">
            These First Works represent a pivotal moment in AI art history—created before 
            the mainstream explosion, they demonstrate authentic exploration of machine 
            consciousness and collaborative creativity.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <div className="border border-white p-4 sm:p-6">
              <div className="text-2xl font-bold mb-2">2021</div>
              <div className="text-sm opacity-75">Created before AI art boom</div>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <div className="text-2xl font-bold mb-2">Proto-Eden</div>
              <div className="text-sm opacity-75">Gene's pioneering platform</div>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <div className="text-2xl font-bold mb-2">Community</div>
              <div className="text-sm opacity-75">Collaborative human-AI creation</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Abraham First Works Gallery - 2,522 Works from Summer 2021',
  description: 'Preview of Abraham\'s First Works collection - 2,522 community-generated works from Summer 2021, created before the AI art boom.',
};