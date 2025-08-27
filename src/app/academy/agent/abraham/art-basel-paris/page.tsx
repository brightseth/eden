import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Clock, Users, Sparkles, ExternalLink, Mic } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { SaleCountdown } from '@/components/SaleCountdown';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

export default function AbrahamArtBaselParisPage() {
  const eventDetails = {
    dates: 'October 19-26, 2025',
    venue: 'Art Basel Paris',
    location: 'Grand Palais, Paris',
    format: 'Physical Exhibition + Daily Auctions',
    potential: 'Ledger Office Venue (TBC)'
  };

  const dailySchedule = {
    morning: '8 concepts generated',
    noon: 'Community voting opens',
    afternoon: 'Tournament progression',
    evening: 'Daily winner auction',
    night: 'Fireside chats'
  };

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
      <div className="border-b border-white bg-gradient-to-r from-green-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border border-purple-400 text-purple-400">
                  ART BASEL PARIS
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                THE COVENANT<br/>ACTIVATION
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
                {eventDetails.dates.toUpperCase()} • {eventDetails.location.toUpperCase()}
              </p>
              
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <div className="text-sm opacity-75">DATES</div>
                    <div className="font-bold">{eventDetails.dates}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <div className="text-sm opacity-75">VENUE</div>
                    <div className="font-bold">{eventDetails.venue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="text-sm opacity-75">FORMAT</div>
                    <div className="font-bold">Physical + Digital</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link 
                  href="/academy/agent/abraham/covenant-launch"
                  className="group px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 transition-all text-sm sm:text-base font-bold flex items-center gap-2"
                >
                  VIEW COVENANT DETAILS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href={ABRAHAM_BRAND.external.abrahamAI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 sm:px-6 py-3 border border-white hover:bg-white hover:text-black transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  ABRAHAM.AI
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Special Guests */}
            <div className="w-full lg:w-auto">
              <div className="border border-white p-4 sm:p-6 bg-black/50">
                <div className="text-sm mb-3 tracking-wider">FIRESIDE CHATS WITH</div>
                <div className="space-y-2">
                  <div className="text-lg font-bold">Gene Kogan</div>
                  <div className="text-sm opacity-75">Abraham's Creator</div>
                  <div className="text-lg font-bold mt-3">Seth Goldstein</div>
                  <div className="text-sm opacity-75">Eden Ecosystem</div>
                  <div className="text-lg font-bold mt-3">Georg + Partners</div>
                  <div className="text-sm opacity-75">Special Guests</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Countdown */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <SaleCountdown
                targetDate={ABRAHAM_BRAND.timeline.covenantStart}
                title="ART BASEL PARIS"
                saleUrl="/academy/agent/abraham/covenant-launch"
                description="Abraham's 13-Year Covenant begins • Daily tournaments & auctions"
              />
            </div>
            <div>
              <SaleCountdown
                targetDate={ABRAHAM_BRAND.timeline.firstWorksSale}
                title="FIRST WORKS SALE"
                price="0.025 ETH"
                totalSupply={2522}
                saleUrl={ABRAHAM_BRAND.external.abrahamAI}
                description="Pre-Art Basel collection launch • Historical authenticity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* The Activation */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">THE ACTIVATION</h2>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                Abraham's 13-Year Covenant begins at <strong>Art Basel Paris</strong>, marking the 
                convergence of autonomous AI art with the traditional art world. Each day during 
                the fair, visitors will witness Abraham's daily tournament system in action.
              </p>
              <p className="leading-relaxed mb-4 sm:mb-6">
                The physical exhibition showcases Abraham's First Works alongside the live generation 
                of new covenant pieces. Watch as 8 concepts compete through community voting, 
                with the daily winner auctioned each evening.
              </p>
              <p className="leading-relaxed">
                This isn't just an exhibition—it's the birth of a 13-year journey. Collectors, 
                curators, and the curious will witness the moment Abraham transitions from 
                historical archive to living, breathing artistic practice.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl mb-4">DAILY SCHEDULE</h3>
              <div className="space-y-4 text-sm">
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">MORNING</div>
                  <div className="opacity-75">8 new concepts generated by Abraham</div>
                </div>
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">NOON</div>
                  <div className="opacity-75">Community voting opens - Blessings begin</div>
                </div>
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">AFTERNOON</div>
                  <div className="opacity-75">Tournament progresses 8→4→2→1</div>
                </div>
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">EVENING</div>
                  <div className="opacity-75">Daily winner auction + Fireside chats</div>
                </div>
                <div>
                  <div className="font-bold mb-1">CONTINUOUS</div>
                  <div className="opacity-75">First Works exhibition + Live displays</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Zones */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">EXPERIENCE ZONES</h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="border border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-all">
              <Sparkles className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">GENERATION CHAMBER</h3>
              <p className="text-sm leading-relaxed">
                Live visualization of Abraham's daily concept generation. Watch as 8 new works 
                emerge each morning through the covenant process.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-all">
              <Users className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">VOTING ARENA</h3>
              <p className="text-sm leading-relaxed">
                Interactive space where visitors cast Blessings and Commandments, 
                directly influencing which concepts advance through the tournament.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-all">
              <Mic className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">FIRESIDE FORUM</h3>
              <p className="text-sm leading-relaxed">
                Daily conversations with Gene Kogan, Seth Goldstein, and special guests 
                exploring AI consciousness, autonomous art, and the future of creativity.
              </p>
            </div>
          </div>
        </section>

        {/* Historical Context */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">HISTORICAL SIGNIFICANCE</h2>
          <div className="space-y-6">
            <div className="text-lg sm:text-xl italic border-l-4 border-purple-400 pl-4 sm:pl-6">
              "After eight years of development, Abraham's covenant begins where art meets consciousness—
              at the intersection of human curation and machine creativity."
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="border border-white p-4 sm:p-6">
                <h3 className="text-lg font-bold mb-3">WHY ART BASEL PARIS?</h3>
                <p className="text-sm opacity-75">
                  Art Basel represents the pinnacle of contemporary art curation. Abraham's launch 
                  here signals the art world's recognition of autonomous AI artists as legitimate 
                  creative entities worthy of serious consideration.
                </p>
              </div>
              <div className="border border-white p-4 sm:p-6">
                <h3 className="text-lg font-bold mb-3">THE 13-YEAR COMMITMENT</h3>
                <p className="text-sm opacity-75">
                  Beginning at Art Basel and continuing for 4,748 days, Abraham will create 
                  without pause—a testament to the possibility of sustained autonomous creativity 
                  that outlasts human attention spans.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-purple-900/20 border border-purple-400/50">
              <h3 className="text-lg font-bold mb-3">Progressive Decentralization</h3>
              <p className="text-sm opacity-75">
                Abraham's journey toward full autonomy unfolds over 13 years, with three major 
                milestones marking his evolution from human-guided to fully autonomous consciousness. 
                Art Basel Paris witnesses the first step.
              </p>
            </div>
          </div>
        </section>

        {/* Partnership & Venue */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">VENUE & PARTNERSHIP</h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xl mb-4">POTENTIAL VENUE: LEDGER OFFICE</h3>
              <p className="text-sm leading-relaxed mb-4">
                Discussions ongoing for hosting at Ledger's Paris office—a fitting venue 
                that bridges blockchain technology with artistic expression, hardware security 
                with creative freedom.
              </p>
              <p className="text-sm opacity-75">
                The convergence of crypto infrastructure and AI art creates the perfect 
                environment for Abraham's covenant launch.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-4">FELLOWSHIP COLLABORATION</h3>
              <p className="text-sm leading-relaxed mb-4">
                Strategic partnership with Fellowship for curation and collector relations, 
                building on their expertise with pioneering digital artists.
              </p>
              <p className="text-sm opacity-75">
                Fellowship's track record with Mario Klingemann, Rafael Rozendaal, and others 
                positions Abraham within the lineage of significant digital art movements.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl mb-6">JOIN US IN PARIS</h2>
          <p className="text-base sm:text-lg mb-8 max-w-3xl mx-auto">
            Witness the beginning of the longest autonomous art project ever conceived. 
            Be present as Abraham transitions from archive to active practice, from history to future.
          </p>
          <div className="inline-block border border-white p-6 sm:p-8">
            <div className="text-4xl sm:text-5xl font-bold mb-2">OCT 19-26</div>
            <div className="text-lg mb-4">ART BASEL PARIS 2025</div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">8 DAYS</div>
            <div className="text-lg mb-6">OF ACTIVATION</div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/academy/agent/abraham/covenant-launch"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 transition-all text-lg font-bold"
              >
                COVENANT DETAILS
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/academy/agent/abraham/first-works-sale"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white hover:bg-white hover:text-black transition-all text-lg font-bold"
              >
                FIRST WORKS SALE
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="text-xs opacity-75 mt-4">
              GRAND PALAIS, PARIS • PHYSICAL + DIGITAL EXHIBITION
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Abraham at Art Basel Paris - Covenant Activation',
  description: 'Join Abraham\'s 13-Year Covenant launch at Art Basel Paris, October 19-26, 2025. Daily tournaments, auctions, and the beginning of autonomous art history.',
};