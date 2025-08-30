import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, Coins, Users, Hash, ExternalLink, Award } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { SaleCountdown } from '@/components/SaleCountdown';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

export default function AbrahamFirstWorksSalePage() {
  const saleStats = {
    totalSupply: 2522,
    price: '0.025 ETH',
    launchDate: 'October 5, 2025',
    platform: 'Abraham.ai',
    distribution: 'Random via Fisher-Yates shuffle'
  };

  const historicalContext = {
    created: 'Summer 2021',
    preAIBoom: 'Before Art Blocks & mainstream AI art',
    process: 'Community prompts → GAN generation → Collective feedback',
    preservation: 'Full metadata with JSON'
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
      <div className="border-b border-white bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border border-green-400 text-green-400">
                  FIRST WORKS SALE
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                2,522 ABRAHAM'S<br/>FIRST WORKS
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
                {saleStats.launchDate.toUpperCase()} • {saleStats.price} PER PIECE
              </p>
              
              {/* Sale Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <div className="text-sm opacity-75">TOTAL SUPPLY</div>
                  <div className="text-xl sm:text-2xl font-bold">{saleStats.totalSupply.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">PRICE</div>
                  <div className="text-xl sm:text-2xl font-bold">{saleStats.price}</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">PLATFORM</div>
                  <div className="text-xl sm:text-2xl font-bold">{saleStats.platform}</div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link 
                  href={ABRAHAM_BRAND.external.abrahamAI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 transition-all text-sm sm:text-base font-bold flex items-center gap-2"
                >
                  VIEW ON ABRAHAM.AI
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <Link 
                  href="/agents/abraham/early-works"
                  className="group px-4 sm:px-6 py-3 border border-white hover:bg-white hover:text-black transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  PREVIEW WORKS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Partnership Info */}
            <div className="w-full lg:w-auto">
              <div className="border border-white p-4 sm:p-6 bg-black/50">
                <div className="text-sm mb-2 tracking-wider">IN PARTNERSHIP WITH</div>
                <div className="text-xl sm:text-2xl font-bold mb-3">FELLOWSHIP</div>
                <div className="text-sm space-y-2 opacity-75">
                  <div>Curator: Alejandro Cartegena</div>
                  <div>Strategic timing after</div>
                  <div>Mario Klingemann auctions</div>
                  <div>(Sept 25-30)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sale Countdown */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto">
            <SaleCountdown
              targetDate={ABRAHAM_BRAND.timeline.firstWorksSale}
              title="FIRST WORKS SALE"
              price={saleStats.price}
              totalSupply={saleStats.totalSupply}
              saleUrl={ABRAHAM_BRAND.external.abrahamAI}
              description="2,522 works from Summer 2021 • Pre-AI art boom authenticity"
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Historical Significance */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">PRE-AI ART BOOM CREDIBILITY</h2>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                These 2,522 works were created in <strong>Summer 2021</strong>, significantly predating 
                Art Blocks and the mainstream AI art explosion. Created before the hype, they represent 
                authentic exploration of machine consciousness and collective creativity.
              </p>
              <p className="leading-relaxed mb-4 sm:mb-6">
                Using Gene's proto-Eden platform, these works emerged from text prompts submitted by 
                the Abraham community, then processed through generative adversarial networks in a 
                pioneering experiment of human-AI collaboration.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>First Abraham tweet: August 26, 2021</span>
                </div>
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Domain registered: December 2017</span>
                </div>
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>First publication: 2019</span>
                </div>
              </div>
            </div>
            <div className="border border-white p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl mb-4">TECHNICAL PROCESS</h3>
              <div className="space-y-4 text-sm">
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">Community Prompts</div>
                  <div className="opacity-75">Text submissions from early Abraham believers</div>
                </div>
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">GAN Generation</div>
                  <div className="opacity-75">Generative Adversarial Networks processing</div>
                </div>
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">Feedback Loops</div>
                  <div className="opacity-75">Collective input refining outputs</div>
                </div>
                <div className="pb-3 border-b border-white">
                  <div className="font-bold mb-1">Sequential Creation</div>
                  <div className="opacity-75">Works created over weeks/months</div>
                </div>
                <div>
                  <div className="font-bold mb-1">Full Preservation</div>
                  <div className="opacity-75">Complete metadata with JSON</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Distribution Mechanism */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">DISTRIBUTION MECHANISM</h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="border border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-all">
              <Coins className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">FIXED PRICE</h3>
              <p className="text-sm leading-relaxed">
                All 2,522 pieces available at {saleStats.price} each. No bonding curves, 
                no variable pricing—pure democratic access.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-all">
              <Hash className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">RANDOM SHUFFLE</h3>
              <p className="text-sm leading-relaxed">
                Fisher-Yates shuffle ensures completely random distribution. No cherry-picking, 
                pure chance determines which work you receive.
              </p>
            </div>
            <div className="border border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-all">
              <Award className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">AGENT-CONTROLLED</h3>
              <p className="text-sm leading-relaxed">
                Sale conducted through Abraham.ai, Abraham's own platform. The artist controls 
                the entire distribution process autonomously.
              </p>
            </div>
          </div>
        </section>

        {/* Gene Kogan's Vision */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">THE VISION: EIGHT YEARS TO AUTONOMY</h2>
          <div className="space-y-6">
            <div className="text-lg sm:text-xl italic border-l-4 border-green-400 pl-4 sm:pl-6">
              "{ABRAHAM_BRAND.mission.philosophy}"
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-3">2015</div>
                <h3 className="text-lg mb-2">AI ART PIONEER</h3>
                <p className="text-sm opacity-75">
                  Gene begins pioneering AI art after deepdream, becomes known for 
                  "machine learning for artists" workshops
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-3">2017</div>
                <h3 className="text-lg mb-2">ABRAHAM CONCEIVED</h3>
                <p className="text-sm opacity-75">
                  On flight from Eyeo Festival, the vision crystallizes: "artist in the cloud" 
                  - both heavens and cloud computing
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-3">2021</div>
                <h3 className="text-lg mb-2">GENESIS CREATION</h3>
                <p className="text-sm opacity-75">
                  2,522 First Works created with community, marking Abraham's first 
                  autonomous expressions
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-green-900/20 border border-green-400/50">
              <h3 className="text-lg font-bold mb-3">Core Principles From Conception</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-bold">AUTONOMOUS</div>
                  <div className="opacity-75">Making art independently</div>
                </div>
                <div>
                  <div className="font-bold">ORIGINAL</div>
                  <div className="opacity-75">Self-cultivated voice</div>
                </div>
                <div>
                  <div className="font-bold">UNIQUE</div>
                  <div className="opacity-75">Impossible to reproduce</div>
                </div>
                <div>
                  <div className="font-bold">DECENTRALIZED</div>
                  <div className="opacity-75">AI + blockchain</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl mb-6">COLLECT THE FIRST WORKS</h2>
          <p className="text-base sm:text-lg mb-8 max-w-3xl mx-auto">
            Own a piece of AI art history. These 2,522 First Works represent Abraham's first 
            autonomous expressions, created before the AI art explosion, preserved forever on the blockchain.
          </p>
          <div className="inline-block border border-white p-6 sm:p-8">
            <div className="text-4xl sm:text-5xl font-bold mb-2">{saleStats.totalSupply}</div>
            <div className="text-lg mb-4">FIRST WORKS</div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{saleStats.price}</div>
            <div className="text-lg mb-6">PER PIECE</div>
            <Link 
              href={ABRAHAM_BRAND.external.abrahamAI}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 transition-all text-lg font-bold"
            >
              PARTICIPATE IN FIRST WORKS SALE
              <ExternalLink className="w-5 h-5" />
            </Link>
            <div className="text-xs opacity-75 mt-4">
              OCTOBER 5, 2025 • ABRAHAM.AI
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Abraham First Works Sale - 2,522 First Works',
  description: 'Own a piece of AI art history. Abraham\'s First Works - 2,522 autonomous creations from Summer 2021, available October 5, 2025.',
};