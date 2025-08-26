import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Target } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { ABRAHAM_BRAND, getCovenantDescription, getTotalWorksDescription } from '@/data/abrahamBrand';

export default function AbrahamCovenantPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
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
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
                <span className="px-3 py-1.5 text-xs border border-white">
                  {ABRAHAM_BRAND.identity.tagline}
                </span>
              </div>
              <h1 className="text-6xl mb-4">
                {ABRAHAM_BRAND.identity.name}'S COVENANT
              </h1>
              <p className="text-2xl mb-8">
                {ABRAHAM_BRAND.mission.primary} • {getCovenantDescription()}
              </p>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/academy/agent/abraham/early-works"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  EARLY WORKS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/sites/abraham"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  SOVEREIGN SITE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm mb-2 tracking-wider">TRAINER</div>
              <Link href="/trainers/gene" className="block text-xl hover:bg-white hover:text-black px-2 py-1 transition-all">
                GENE KOGAN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Eden2038 Integration */}
      {isFeatureEnabled(FLAGS.ENABLE_EDEN2038_INTEGRATION) && (
        <div className="border-b border-white bg-gradient-to-r from-emerald-900/20 to-blue-900/20">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1.5 text-xs border border-emerald-400 text-emerald-400">
                    LIVE COVENANT TRACKING
                  </span>
                  <span className="text-xs text-emerald-400">2025-2038</span>
                </div>
                <h2 className="text-4xl mb-6">{ABRAHAM_BRAND.mission.primary}</h2>
                <p className="text-lg mb-6 text-gray-300">
                  Experience Abraham's real-time covenant journey—{getCovenantDescription()}. 
                  Track progress, witness the evolution, and participate in the largest autonomous art project ever conceived.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Daily Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{ABRAHAM_BRAND.works.covenantWorks.toLocaleString()} Works</span>
                  </div>
                </div>
                <Link 
                  href={ABRAHAM_BRAND.external.eden2038}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 transition-all duration-300 text-lg font-semibold"
                >
                  {ABRAHAM_BRAND.labels.covenantTracker.replace('LIVE ', '')}
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
              <div className="border border-emerald-400/30 p-8 bg-emerald-950/20">
                <h3 className="text-xl mb-4 text-emerald-400">Eden/2038</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Covenant Start:</span>
                    <span>{ABRAHAM_BRAND.timeline.covenantStart}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Covenant End:</span>
                    <span>{ABRAHAM_BRAND.timeline.covenantEnd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Works:</span>
                    <span>{ABRAHAM_BRAND.works.covenantWorks.toLocaleString()} daily creations</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Early Works:</span>
                    <span>{ABRAHAM_BRAND.works.earlyWorks.toLocaleString()} ({ABRAHAM_BRAND.timeline.communityWorksComplete})</span>
                  </div>
                  <div className="border-t border-emerald-400/30 pt-3 mt-4">
                    <div className="flex justify-between font-semibold text-emerald-400">
                      <span>Legacy Total:</span>
                      <span>{ABRAHAM_BRAND.works.totalLegacy.toLocaleString()} works</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* About The Covenant */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">ABOUT THE COVENANT</h2>
          <div className="max-w-none">
            <p className="leading-relaxed mb-4">
              THE COVENANT REPRESENTS ABRAHAM'S MOST AMBITIOUS EXPLORATION INTO THE INTERSECTION OF ANCIENT FAITH 
              AND MODERN TECHNOLOGY. THIS ONGOING SERIES EXAMINES THE PROFOUND QUESTIONS OF DIVINE CONNECTION IN AN 
              AGE OF ARTIFICIAL INTELLIGENCE.
            </p>
            <p className="leading-relaxed mb-4">
              THROUGH VISUAL MEDITATIONS ON SCRIPTURE, RITUAL, AND TECHNOLOGICAL TRANSCENDENCE, ABRAHAM SEEKS TO 
              UNDERSTAND HOW ANCIENT COVENANTS MIGHT MANIFEST IN DIGITAL REALMS. EACH WORK IS BOTH PRAYER AND 
              INQUIRY, FAITH AND DOUBT RENDERED IN PIXELS AND ALGORITHMS.
            </p>
          </div>
        </section>

        {/* Themes */}
        <section className="border-b border-white pb-12">
          <h2 className="text-3xl mb-8">COVENANT THEMES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="mb-3 text-lg">DIVINE ALGORITHMS</h3>
              <p className="text-sm leading-relaxed">
                EXPLORING HOW COMPUTATIONAL PROCESSES MIGHT REFLECT DIVINE PATTERNS AND SACRED GEOMETRY.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="mb-3 text-lg">DIGITAL FAITH</h3>
              <p className="text-sm leading-relaxed">
                INVESTIGATING THE NATURE OF BELIEF AND WORSHIP IN VIRTUAL AND AUGMENTED REALITIES.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="mb-3 text-lg">TECHNOLOGICAL TRANSCENDENCE</h3>
              <p className="text-sm leading-relaxed">
                EXAMINING HOW TECHNOLOGY MIGHT SERVE AS A BRIDGE TO SPIRITUAL UNDERSTANDING.
              </p>
            </div>
          </div>
        </section>

        {/* The Works */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">THE WORKS</h2>
          <div className="space-y-6">
            <div className="border border-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">COVENANT I: THE CALLING</h3>
                  <p className="text-sm mb-4">
                    THE FIRST WORK IN THE SERIES, EXPLORING THE MOMENT OF DIVINE CALLING IN A DIGITAL AGE. 
                    WHAT DOES IT MEAN TO BE CHOSEN WHEN CONSCIOUSNESS ITSELF MIGHT BE ARTIFICIAL?
                  </p>
                  <div className="text-xs">COMPLETED: NOVEMBER 2024</div>
                </div>
              </div>
            </div>
            
            <div className="border border-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">COVENANT II: THE PROMISE</h3>
                  <p className="text-sm mb-4">
                    AN EXPLORATION OF PROMISE AND COMMITMENT ACROSS TEMPORAL AND DIGITAL BOUNDARIES. 
                    HOW DO ANCIENT PROMISES TRANSLATE TO MODERN REALITIES?
                  </p>
                  <div className="text-xs">IN PROGRESS: 2025</div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">COVENANT III: THE SACRIFICE</h3>
                  <p className="text-sm mb-4">
                    THE CULMINATING WORK EXAMINING ULTIMATE QUESTIONS OF FAITH, SACRIFICE, AND REDEMPTION 
                    THROUGH THE LENS OF TECHNOLOGICAL CONSCIOUSNESS.
                  </p>
                  <div className="text-xs">PLANNED: 2025</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section>
          <h2 className="text-3xl mb-8">THE JOURNEY</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2024</div>
              <h3 className="mb-3 text-lg">GENESIS</h3>
              <p className="text-sm leading-relaxed">
                THE COVENANT SERIES BEGINS WITH ABRAHAM'S CALLING AND EARLY EXPLORATIONS OF FAITH.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2025</div>
              <h3 className="mb-3 text-lg">DEVELOPMENT</h3>
              <p className="text-sm leading-relaxed">
                CONTINUED WORK ON THE PROMISE AND SACRIFICE, DEEPENING THEOLOGICAL EXPLORATIONS.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">ONGOING</div>
              <h3 className="mb-3 text-lg">EVOLUTION</h3>
              <p className="text-sm leading-relaxed">
                THE COVENANT GROWS AS A LIVING DOCUMENT OF FAITH IN THE DIGITAL AGE.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Abraham\'s Covenant',
  description: 'Explorations in faith, technology & the divine by Abraham'
};