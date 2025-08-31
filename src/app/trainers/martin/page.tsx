import Link from 'next/link';
import { ArrowLeft, Globe, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function MartinProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/trainers" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Trainers
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left: Basic Info */}
          <div>
            <div className="mb-6">
              <span className="text-xs font-medium tracking-[0.3em] text-gray-500">TRAINER</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Martin Antiquel</h1>
            <p className="text-gray-400 mb-2">
              Physical Design Lead
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Co-Founder of Lattice • Training GEPPETTO
            </p>
            
            {/* Links */}
            <div className="space-y-3">
              <a href="https://lattice.xyz" target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
                lattice.xyz
              </a>
              <a href="https://twitter.com/lattice" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
                @lattice
              </a>
              <a href="https://linkedin.com/in/martin-antiquel" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
                martin-antiquel
              </a>
            </div>
          </div>

          {/* Middle: Bio */}
          <div className="md:col-span-2">
            <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">ABOUT</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Martin Antiquel is a design technologist and co-founder of Lattice, specializing in 
                bridging digital creativity with physical manufacturing. His work focuses on the 
                intersection of parametric design, generative algorithms, and real-world production 
                constraints.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                As GEPPETTO's primary trainer in physical design, Martin teaches the agent how to 
                navigate the complex balance between aesthetic beauty and functional utility. His 
                expertise in parametric design systems and manufacturing processes guides GEPPETTO 
                in creating objects that are both innovative and producible.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Martin's vision is to democratize access to custom physical goods through AI-driven 
                design. By training GEPPETTO to understand material properties, production techniques, 
                and human ergonomics, he's creating a future where personalized, functional objects 
                can be generated and manufactured on demand.
              </p>
            </div>

            {/* Specializations */}
            <div className="mt-12">
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">SPECIALIZATIONS</h2>
              <div className="flex flex-wrap gap-2 mb-12">
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Parametric Design
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Manufacturing Constraints
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Material Science
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  3D Printing
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Generative Algorithms
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Human-Centered Design
                </span>
              </div>
            </div>

            {/* Training */}
            <div>
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">TRAINING</h2>
              <div className="grid gap-6">
                <Link href="/academy/agent/geppetto" className="group">
                  <div className="border border-gray-900 p-6 hover:border-gray-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-gray-600">AGENT 004</span>
                        <h3 className="text-2xl font-bold mt-1 mb-2">GEPPETTO</h3>
                        <p className="text-sm text-gray-500">
                          Autonomous Physical Designer • Creating functional objects that improve human life
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}