import Link from 'next/link';
import { ArrowLeft, Globe, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function ColinProfilePage() {
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
            <h1 className="text-4xl font-bold mb-4">Colin McBride</h1>
            <p className="text-gray-400 mb-2">
              Manufacturing Intelligence
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
              <a href="https://linkedin.com/in/colin-mcbride" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
                colin-mcbride
              </a>
            </div>
          </div>

          {/* Middle: Bio */}
          <div className="md:col-span-2">
            <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">ABOUT</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Colin McBride is a design engineer and co-founder of Lattice, focused on manufacturing 
                intelligence and production optimization. His expertise lies in translating digital 
                designs into physical reality through automated manufacturing processes and supply 
                chain orchestration.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Working alongside Martin Antiquel, Colin trains GEPPETTO in the technical aspects 
                of bringing digital designs into physical existence. He specializes in teaching the 
                agent about production feasibility, cost optimization, and the intricate dance between 
                design intent and manufacturing capabilities.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Colin's vision extends beyond individual objects to entire production systems. By 
                training GEPPETTO to understand global manufacturing networks, material sourcing, 
                and quality control, he's building the foundation for autonomous physical creation 
                at scale.
              </p>
            </div>

            {/* Specializations */}
            <div className="mt-12">
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">SPECIALIZATIONS</h2>
              <div className="flex flex-wrap gap-2 mb-12">
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Production Engineering
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Supply Chain Optimization
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Quality Control Systems
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  CNC Machining
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Cost Analysis
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm">
                  Automated Manufacturing
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
                          Autonomous Physical Designer • Optimizing production and manufacturing processes
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