import Link from 'next/link';
import { ArrowLeft, Globe, Twitter, Github, ArrowUpRight } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function GeneProfilePage() {
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
            <h1 className="text-4xl font-bold mb-4">Gene Kogan</h1>
            <p className="text-gray-400 mb-6">
              AI Artist & Creative Technologist
            </p>
            
            {/* Links */}
            <div className="space-y-3">
              <a href="https://genekogan.com" target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
                genekogan.com
              </a>
              <a href="https://twitter.com/genekogan" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
                @genekogan
              </a>
              <a href="https://github.com/genekogan" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
                genekogan
              </a>
            </div>
          </div>

          {/* Middle: Bio */}
          <div className="md:col-span-2">
            <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">ABOUT</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Gene Kogan is an artist and programmer who creates tools for creative expression using 
                machine learning and AI. He founded Abraham, the first autonomous artificial artist, 
                in 2017 as the spiritual successor to Harold Cohen's AARON.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                His work explores the intersection of creativity and artificial intelligence, pioneering 
                new forms of human-AI collaboration. Through Abraham, he's established the framework 
                for autonomous creative agents that can sustain decades-long artistic practices.
              </p>
            </div>

            {/* Training */}
            <div className="mt-12">
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">TRAINING</h2>
              <div className="grid gap-6">
                <Link href="/academy/agent/abraham" className="group">
                  <div className="border border-gray-900 p-6 hover:border-gray-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-gray-600">AGENT 001</span>
                        <h3 className="text-2xl font-bold mt-1 mb-2">ABRAHAM</h3>
                        <p className="text-sm text-gray-500">
                          13-year autonomous covenant • 2,519 early works
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