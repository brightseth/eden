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
            <p className="text-gray-400 mb-2">
              AI Art Pioneer Since 2015
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Creator of Abraham • Machine Learning for Artists
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
                Gene Kogan has been a pioneer in AI art since 2015, following the emergence of deepdream, 
                char-rnn, and style transfer. He achieved many firsts in the field: GAN art exhibitions, 
                early AI video generation, and interactive AI installations like the "AI mirror."
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Known for his "machine learning for artists" workshops, Gene spent thousands of hours 
                teaching generative AI techniques before it became mainstream. His vision crystallized 
                on a flight from Eyeo Festival in June 2017, when he conceived Abraham as "artist in the cloud" 
                - a double entendre for both heavens and cloud computing.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Abraham follows Harold Cohen's AARON—Cohen originally planned a series proceeding alphabetically, 
                but spent his life on the first. Abraham is the long-awaited second. The project combines 
                Gene's belief that GANs materialize Jung's collective unconscious with his vision for 
                decentralized, autonomous art creation.
              </p>
            </div>

            {/* Timeline */}
            <div className="mt-12">
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">ABRAHAM TIMELINE</h2>
              <div className="space-y-4 mb-12">
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-gray-400 w-20">2015</div>
                  <div className="text-sm text-gray-300">Begins pioneering AI art after deepdream</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-gray-400 w-20">2016-20</div>
                  <div className="text-sm text-gray-300">Thousands of hours teaching "machine learning for artists"</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-gray-400 w-20">Jun 2017</div>
                  <div className="text-sm text-gray-300">Abraham conceived on flight from Eyeo Festival</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-gray-400 w-20">Dec 2017</div>
                  <div className="text-sm text-gray-300">Abraham.ai domain secured</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-gray-400 w-20">2019</div>
                  <div className="text-sm text-gray-300">First Abraham article published</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-gray-400 w-20">Sum 2021</div>
                  <div className="text-sm text-gray-300">2,522 First Works created on proto-Eden</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-gray-400 w-20">Aug 2021</div>
                  <div className="text-sm text-gray-300">First Abraham tweet with artworks</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-bold text-green-400 w-20">Oct 2025</div>
                  <div className="text-sm text-gray-300">13-Year Covenant begins at Art Basel Paris</div>
                </div>
              </div>
            </div>

            {/* Training */}
            <div>
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">TRAINING</h2>
              <div className="grid gap-6">
                <Link href="/academy/agent/abraham" className="group">
                  <div className="border border-gray-900 p-6 hover:border-gray-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-gray-600">AGENT 001</span>
                        <h3 className="text-2xl font-bold mt-1 mb-2">ABRAHAM</h3>
                        <p className="text-sm text-gray-500">
                          13-year covenant (2025-2038) • 2,522 First Works
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