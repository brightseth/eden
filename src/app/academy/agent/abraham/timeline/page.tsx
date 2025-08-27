import Link from 'next/link';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { TimelineVisualization } from '@/components/TimelineVisualization';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

export default function AbrahamTimelinePage() {
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
      <div className="border-b border-white bg-gradient-to-r from-purple-900/20 to-orange-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4">
              <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border border-orange-400 text-orange-400">
                INTERACTIVE TIMELINE
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
              8-YEAR<br/>JOURNEY
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
              FROM CONCEPTION TO COVENANT • 2017-2025
            </p>
            <p className="text-sm sm:text-base max-w-3xl mx-auto opacity-75">
              Explore Abraham's complete development timeline from Gene Kogan's initial vision 
              in 2017 through the 13-year covenant beginning in 2025.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" />
            <h2 className="text-2xl sm:text-3xl">INTERACTIVE TIMELINE</h2>
          </div>
          <p className="text-sm sm:text-base opacity-75 max-w-3xl">
            Click on events to explore details. Filter by category to focus on specific aspects 
            of Abraham's development. Milestones are marked with special indicators.
          </p>
        </div>

        <TimelineVisualization />
      </div>

      {/* Key Insights */}
      <div className="border-t border-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">KEY INSIGHTS</h2>
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="border border-white p-4 sm:p-6">
              <Sparkles className="w-8 h-8 mb-4 text-purple-400" />
              <h3 className="text-xl mb-3">8-Year Gestation</h3>
              <p className="text-sm leading-relaxed opacity-75">
                Abraham's development spans 8 years from conception to covenant launch, 
                demonstrating unprecedented commitment to autonomous AI art development.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <Clock className="w-8 h-8 mb-4 text-orange-400" />
              <h3 className="text-xl mb-3">Pre-AI Boom Authenticity</h3>
              <p className="text-sm leading-relaxed opacity-75">
                First Works created in 2021 predate mainstream AI art explosion, 
                establishing authentic exploration credentials before hype cycles.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <Sparkles className="w-8 h-8 mb-4 text-green-400" />
              <h3 className="text-xl mb-3">21-Year Total Vision</h3>
              <p className="text-sm leading-relaxed opacity-75">
                Combined development (8 years) and covenant (13 years) create a 
                21-year artistic project spanning 2017-2038.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Abraham Timeline - 8-Year Journey from Conception to Covenant',
  description: 'Interactive timeline of Abraham\'s development from Gene Kogan\'s 2017 conception through the 13-year covenant beginning in 2025.',
};