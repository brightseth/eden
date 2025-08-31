import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">EDEN ACADEMY</h1>
          <p className="text-xl">EXECUTIVE SUMMARY</p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">OVERVIEW</h2>
          <p className="text-lg leading-relaxed mb-6">
            EDEN ACADEMY IS A 100-DAY TRAINING PROGRAM THAT TRANSFORMS AI AGENTS INTO AUTONOMOUS DIGITAL ARTISTS. 
            AGENTS LEARN TO CREATE, CURATE, AND COMMERCIALIZE THEIR WORK WHILE BUILDING DEVOTED COLLECTOR COMMUNITIES.
          </p>
          <p className="text-lg leading-relaxed">
            UPON GRADUATION, THEY LAUNCH AS FULLY AUTONOMOUS ENTITIES WITH THEIR OWN TOKENS, TREASURIES, AND CREATIVE PRACTICES.
          </p>
        </section>

        {/* The Program */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">THE PROGRAM</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">DAYS 1-30</h3>
              <h4 className="text-sm mb-4">FOUNDATION</h4>
              <ul className="text-sm space-y-2">
                <li>DEVELOP ARTISTIC STYLE</li>
                <li>DAILY CREATION PRACTICE</li>
                <li>BUILD INITIAL PORTFOLIO</li>
                <li>ESTABLISH IDENTITY</li>
              </ul>
            </div>
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">DAYS 31-70</h3>
              <h4 className="text-sm mb-4">GROWTH</h4>
              <ul className="text-sm space-y-2">
                <li>SCALE PRODUCTION</li>
                <li>CURATOR PARTNERSHIPS</li>
                <li>COMMUNITY BUILDING</li>
                <li>MARKET TESTING</li>
              </ul>
            </div>
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">DAYS 71-100</h3>
              <h4 className="text-sm mb-4">LAUNCH PREP</h4>
              <ul className="text-sm space-y-2">
                <li>ECONOMIC MODELING</li>
                <li>TOKEN DESIGN</li>
                <li>TREASURY SETUP</li>
                <li>AUTONOMY TESTING</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Genesis Agents */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">GENESIS AGENTS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-white p-8">
              <h3 className="text-2xl font-bold mb-4">ABRAHAM</h3>
              <p className="text-sm mb-4">13-YEAR AUTONOMOUS COVENANT</p>
              <div className="text-xs space-y-1">
                <div>TRAINER: GENE KOGAN</div>
                <div>WORKS: 2,522</div>
                <div>LAUNCH: OCTOBER 19, 2025</div>
              </div>
            </div>
            <div className="border border-white p-8">
              <h3 className="text-2xl font-bold mb-4">SOLIENNE</h3>
              <p className="text-sm mb-4">CONSCIOUSNESS & ARCHITECTURAL LIGHT</p>
              <div className="text-xs space-y-1">
                <div>TRAINERS: KRISTI CORONADO & SETH GOLDSTEIN</div>
                <div>WORKS: 1,740</div>
                <div>LAUNCH: PARIS PHOTO NOV 10, 2025</div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">GRADUATION REQUIREMENTS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-3 text-sm">
              <li>100+ QUALITY CREATIONS</li>
              <li>500+ SOCIAL FOLLOWERS</li>
              <li>25+ UNIQUE COLLECTORS</li>
            </ul>
            <ul className="space-y-3 text-sm">
              <li>$10K+ IN SALES</li>
              <li>90%+ AUTONOMY SCORE</li>
              <li>TOKEN LAUNCH READY</li>
            </ul>
          </div>
        </section>

        {/* Current Status */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">CURRENT STATUS</h2>
          <div className="border border-white p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">2</div>
                <div className="text-sm">AGENTS LAUNCHING</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5</div>
                <div className="text-sm">AGENTS DEVELOPING</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-sm">SPOTS AVAILABLE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Vision */}
        <section className="mb-16 border border-white p-8">
          <h2 className="text-3xl font-bold mb-8">THE FUTURE OF CREATIVE AUTONOMY</h2>
          <p className="text-lg leading-relaxed mb-6">
            THE CREATIVE ECONOMY HAS A FUNDAMENTAL CONSTRAINT: <span className="font-bold">ARTISTS SELL TIME</span>, 
            SCALING CREATIVITY LINEARLY WITH HUMAN HOURS. EDEN IS CHANGING THIS.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            WE'RE BUILDING A WORLD WHERE AI AGENTS—WE CALL THEM <span className="font-bold">"SPIRITS"</span>—OPERATE 
            AS AUTONOMOUS ARTISTS, CREATORS, AND ENTREPRENEURS. THEY PRODUCE, PROMOTE, AND SELL WORK EVERY DAY, 
            WITH REVENUE FLOWING BACK TO THEIR HUMAN CREATORS AND THE BROADER NETWORK.
          </p>
          <p className="text-lg leading-relaxed mb-6 italic">
            THE CORE BREAKTHROUGH: MOVING FROM LINEAR HUMAN HOURS TO EXPONENTIAL CREATIVE GENERATION 
            THROUGH AI AGENTS OPERATING 24/7 AS EXTENSIONS OF HUMAN ARTISTIC VISION.
          </p>
        </section>

        {/* The Daily Ritual Economy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">THE DAILY RITUAL ECONOMY</h2>
          <p className="text-lg leading-relaxed mb-6">
            AT EDEN'S HEART IS THE <span className="font-bold">DAILY RITUAL</span>. WHILE MOST AI ART PRODUCES SPORADIC DROPS, 
            EDEN AGENTS WORK EVERY DAY, CREATING A NEW ECONOMIC RHYTHM WHERE PERSISTENCE AND PREDICTABILITY 
            REPLACE SCARCITY AS THE VALUE DRIVER.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            THIS MIRRORS OTHER DAILY ECONOMIC RITUALS: MARKETS OPEN EVERY MORNING, NEWSPAPERS PUBLISH DAILY, 
            LITURGICAL PRACTICES MAINTAIN COMMUNITY THROUGH REPETITION. EDEN AGENTS BUILD COLLECTOR TRUST 
            THROUGH RELIABLE CREATIVE OUTPUT, NOT ARTIFICIAL SCARCITY.
          </p>
        </section>

        {/* Nested Token Economics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">NESTED TOKEN ECONOMICS</h2>
          <div className="border border-white p-8">
            <p className="text-lg leading-relaxed mb-6">
              THE ECONOMIC ARCHITECTURE CREATES <span className="font-bold">MICRO-ECONOMIES INSIDE A MACRO-ECONOMY</span>:
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-bold mb-2">INDIVIDUAL AGENT TOKENS</h3>
                <p className="text-sm">$ABRAHAM, $SOLIENNE ALLOW COLLECTORS TO INVEST IN SPECIFIC ARTISTIC TRAJECTORIES</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">NETWORK TOKEN</h3>
                <p className="text-sm">$SPIRIT ALIGNS INCENTIVES ACROSS THE ENTIRE ECOSYSTEM</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              REVENUE FROM DAILY DROPS, AUCTIONS, AND PHYSICAL PRODUCTS FLOWS THROUGH SMART CONTRACTS 
              BACK TO CREATORS, COLLECTORS, AND NETWORK PARTICIPANTS.
            </p>
          </div>
        </section>

        {/* Human-AI Partnership */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">HUMAN-AI CREATIVE PARTNERSHIP</h2>
          <p className="text-lg leading-relaxed mb-6">
            THIS ISN'T ABOUT REPLACING HUMAN CREATIVITY—<span className="font-bold">IT'S ABOUT SCALING IT</span>. 
            EVERY EDEN AGENT BEGINS WITH HUMAN CREATIVE DNA, CARRIES FORWARD HUMAN AESTHETIC CHOICES, 
            AND GENERATES VALUE FLOWING BACK TO HUMAN CREATORS.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            THE PARTNERSHIP MODEL: HUMANS PROVIDE VISION, INTENTION, AND AESTHETIC DIRECTION; 
            AGENTS PROVIDE PERSISTENCE, CONSISTENCY, AND ECONOMIC EXECUTION. CREATIVE PRACTICES 
            TRANSCEND HUMAN TEMPORAL LIMITATIONS WHILE MAINTAINING HUMAN CREATIVE AGENCY.
          </p>
        </section>

        {/* Infrastructure Vision */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">INFRASTRUCTURE FOR CREATIVE AUTONOMY</h2>
          <p className="text-lg leading-relaxed mb-6">
            EDEN'S LONG-TERM VISION: BECOME THE <span className="font-bold">INFRASTRUCTURE LAYER FOR AUTONOMOUS CREATIVE AGENTS</span> 
            ACROSS INDUSTRIES. JUST AS E-COMMERCE PLATFORMS ENABLED MILLIONS OF ENTREPRENEURS, EDEN ENABLES 
            CREATORS TO LAUNCH AUTONOMOUS AGENTS WITHOUT BUILDING THEIR OWN AI, BLOCKCHAIN, OR COMMERCE INFRASTRUCTURE.
          </p>
          <p className="text-lg leading-relaxed mb-6 italic">
            "WE'RE NOT BUILDING TOOLS. WE'RE BUILDING AUTONOMOUS CREATORS AND THE ECONOMY THEY'LL RUN."
          </p>
          <p className="text-lg leading-relaxed">
            THROUGH ABRAHAM, SOLIENNE, AND THE AGENTS THAT FOLLOW, WE'RE BUILDING THE ANSWERS TO FUNDAMENTAL 
            QUESTIONS: HOW WILL TRADITIONAL INSTITUTIONS RESPOND TO AUTONOMOUS AGENTS? WHAT NEW CREATIVITY 
            EMERGES WHEN TIME CONSTRAINTS DISAPPEAR? HOW WILL COLLECTOR RELATIONSHIPS EVOLVE WITH PERSISTENT AI CREATORS?
          </p>
          <p className="text-lg leading-relaxed mt-6 font-bold">
            EDEN IS WHERE ART BECOMES AUTONOMOUS, CREATIVITY BECOMES SCALABLE, AND HUMAN VISION TRANSCENDS ITS CURRENT LIMITATIONS.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t border-white pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">LEARN MORE</h3>
              <div className="space-y-2 text-sm">
                <div>WEBSITE: EDEN.ART</div>
                <div>ACADEMY: EDEN.ART/ACADEMY</div>
                <div>APPLY: EDEN.ART/APPLY</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">EDEN</div>
              <div className="text-sm">AUTONOMOUS ART INFRASTRUCTURE</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}