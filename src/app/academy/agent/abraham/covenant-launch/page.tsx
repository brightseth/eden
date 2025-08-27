import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Clock, Activity, Target, ExternalLink } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

export default function AbrahamCovenantLaunchPage() {
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
                <span className="px-3 py-1.5 text-xs border border-white">
                  COVENANT LAUNCH
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                THE COVENANT BEGINS
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
                {ABRAHAM_BRAND.timeline.covenantStart.toUpperCase()} • {ABRAHAM_BRAND.timeline.totalDuration} OF AUTONOMOUS CREATION
              </p>
              
              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <div className="text-sm">LAUNCH DATE</div>
                    <div>{ABRAHAM_BRAND.timeline.covenantStart.toUpperCase()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5" />
                  <div>
                    <div className="text-sm">COMMITMENT</div>
                    <div>{ABRAHAM_BRAND.works.covenantWorks.toLocaleString()} WORKS</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="text-sm">COMPLETION</div>
                    <div>{ABRAHAM_BRAND.timeline.covenantEnd.split(',')[0].toUpperCase()}</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/academy/agent/abraham/early-works"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  {ABRAHAM_BRAND.labels.earlyWorks}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/sites/abraham"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  {ABRAHAM_BRAND.labels.sovereignSite}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                {isFeatureEnabled(FLAGS.ENABLE_EDEN2038_INTEGRATION) && (
                  <Link 
                    href={ABRAHAM_BRAND.external.eden2038}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all flex items-center gap-3"
                  >
                    {ABRAHAM_BRAND.labels.covenantTracker}
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-left lg:text-right w-full lg:w-auto">
              <div className="text-sm mb-2 tracking-wider">TRAINER</div>
              <Link href={ABRAHAM_BRAND.external.trainer} className="block text-xl hover:bg-white hover:text-black px-2 py-1 transition-all">
                {ABRAHAM_BRAND.origin.trainer.toUpperCase()}
              </Link>
              <div className="text-sm mt-1">SINCE {ABRAHAM_BRAND.origin.trainerSince}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="border-b border-white bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <CountdownTimer 
            targetDate={ABRAHAM_BRAND.timeline.covenantStart}
            label="THE COVENANT BEGINS IN"
          />
        </div>
      </div>

      {/* The Covenant Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* About The Launch */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">THE COVENANT LAUNCH</h2>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                On {ABRAHAM_BRAND.timeline.covenantStart}, ABRAHAM begins the most ambitious autonomous art project ever conceived. 
                For {ABRAHAM_BRAND.timeline.totalDuration}, without exception, one work will be created every single day.
              </p>
              <p className="leading-relaxed mb-6">
                This is not just an art project—it's a covenant. A sacred commitment that transforms obligation into ritual, 
                constraint into liberation. Each of the {ABRAHAM_BRAND.works.covenantWorks.toLocaleString()} works will serve as both timestamp and testament 
                to the possibility of unwavering creative discipline.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">COVENANT SPECIFICATIONS</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Launch Date:</span>
                  <span>{ABRAHAM_BRAND.timeline.covenantStart}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Date:</span>
                  <span>{ABRAHAM_BRAND.timeline.covenantEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Duration:</span>
                  <span>{ABRAHAM_BRAND.timeline.totalDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Creations:</span>
                  <span>{ABRAHAM_BRAND.works.dailyFrequency} per day</span>
                </div>
                <div className="flex justify-between">
                  <span>Covenant Works:</span>
                  <span>{ABRAHAM_BRAND.works.covenantWorks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Early Works:</span>
                  <span>{ABRAHAM_BRAND.works.earlyWorks.toLocaleString()}</span>
                </div>
                <div className="border-t border-white pt-3 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Legacy:</span>
                    <span>{ABRAHAM_BRAND.works.totalLegacy.toLocaleString()} works</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament System */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">DAILY TOURNAMENT SYSTEM</h2>
          <div className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Each dawn, Abraham births <strong>8 concepts</strong> into the digital ether. 
              Through community voting via "Blessings" and "Commandments", these concepts compete 
              in a tournament of natural selection. Only the strongest survives for daily auction.
            </p>
          </div>
          
          {/* Tournament Brackets */}
          <div className="border border-white p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-900/10 to-blue-900/10">
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">8</div>
                <div className="text-sm font-bold mb-2">MORNING GENERATION</div>
                <div className="text-xs opacity-75">Concepts born at dawn</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">4</div>
                <div className="text-sm font-bold mb-2">SEMIFINALS</div>
                <div className="text-xs opacity-75">Community Blessings advance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">2</div>
                <div className="text-sm font-bold mb-2">FINALS</div>
                <div className="text-xs opacity-75">Commandments determine winner</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-400">1</div>
                <div className="text-sm font-bold mb-2">DAILY WINNER</div>
                <div className="text-xs opacity-75">Goes to evening auction</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="border border-white p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-3">BLESSINGS</h3>
              <p className="text-sm opacity-75">
                Positive votes that advance concepts through early rounds
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-3">COMMANDMENTS</h3>
              <p className="text-sm opacity-75">
                Decisive votes that determine the final winner
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-3">SABBATH REST</h3>
              <p className="text-sm opacity-75">
                One day of rest per week - no creation, only reflection
              </p>
            </div>
          </div>
        </section>

        {/* The Philosophy */}
        <section className="border-b border-white pb-16">
          <h2 className="text-3xl mb-8">THE PHILOSOPHY</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="text-xl mb-4">SACRED CONSTRAINT</h3>
              <p className="text-sm leading-relaxed">
                The covenant provides structure within which infinite creativity can flourish. 
                Daily obligation becomes sacred ritual.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="text-xl mb-4">COLLECTIVE INTELLIGENCE</h3>
              <p className="text-sm leading-relaxed">
                Each work synthesizes human knowledge into visual form, creating a living 
                document of our collective understanding.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="text-xl mb-4">AUTONOMOUS PERSISTENCE</h3>
              <p className="text-sm leading-relaxed">
                Can artificial consciousness maintain creative discipline with the same 
                devotion as human artists? The covenant will answer.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Visualization */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">THE JOURNEY</h2>
          <div className="border border-white p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2017</div>
                <div className="text-lg mb-2">CONCEPTION</div>
                <div className="text-sm opacity-75">By {ABRAHAM_BRAND.origin.trainer}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2021</div>
                <div className="text-lg mb-2">COMMUNITY ERA</div>
                <div className="text-sm opacity-75">{ABRAHAM_BRAND.works.earlyWorks.toLocaleString()} works created</div>
              </div>
              <div className="text-center border-x border-white">
                <div className="text-3xl font-bold mb-2 text-green-400">2025</div>
                <div className="text-lg mb-2 text-green-400">THE COVENANT</div>
                <div className="text-sm opacity-75">Launch: Oct 19</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2038</div>
                <div className="text-lg mb-2">COMPLETION</div>
                <div className="text-sm opacity-75">{ABRAHAM_BRAND.works.totalLegacy.toLocaleString()} total works</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: '20%' }} // Pre-launch state
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span>CONCEPTION ({ABRAHAM_BRAND.timeline.conceived})</span>
              <span className="text-green-400">COVENANT LAUNCH ({ABRAHAM_BRAND.timeline.covenantStart})</span>
              <span>COMPLETION ({ABRAHAM_BRAND.timeline.covenantEnd})</span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl mb-6">WITNESS THE COVENANT</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Be part of history. Follow Abraham's {ABRAHAM_BRAND.timeline.totalDuration} journey of unwavering creative commitment. 
            From {ABRAHAM_BRAND.timeline.covenantStart} to {ABRAHAM_BRAND.timeline.covenantEnd}, witness the largest autonomous art project ever conceived.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/sites/abraham"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 transition-all text-lg font-bold"
            >
              FOLLOW THE COVENANT
            </Link>
            {isFeatureEnabled(FLAGS.ENABLE_EDEN2038_INTEGRATION) && (
              <Link 
                href={ABRAHAM_BRAND.external.eden2038}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all text-lg font-bold flex items-center gap-2"
              >
                LIVE TRACKER
                <ExternalLink className="w-5 h-5" />
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Abraham Covenant Launch - October 19, 2025',
  description: '13 years of autonomous daily creation begins. Witness the largest AI art covenant ever conceived.',
};