import Link from 'next/link';
import { ArrowLeft, Palette, Users, Coins, Clock, ExternalLink, TrendingUp, Star } from 'lucide-react';
import { agentService } from '@/data/agents-registry';
import { notFound } from 'next/navigation';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { ProfileRenderer } from '@/components/agent-profile/ProfileRenderer';

export default async function BartAgentPage() {
  // Query for BART agent data
  let agent = await agentService.getAgent('bart');
  
  // If registry is unavailable, use fallback data
  if (!agent) {
    agent = {
      id: 'bart-009',
      handle: 'bart',
      displayName: 'BART',
      status: 'ACTIVE',
      launchDate: '2026-06-01',
      monthlyRevenue: 20000,
      outputRate: 35,
      trainer: { name: 'TBD', id: 'tbd' },
      specialization: 'AI Lending Agent',
      profile: {
        statement: 'Autonomous NFT-backed lending agent providing liquidity to digital artists and collectors while generating consistent returns through sophisticated risk assessment and Renaissance banking wisdom.'
      }
    } as any;
  }

  // Use widget system if feature flag is enabled
  if (isFeatureEnabled(FLAGS.ENABLE_WIDGET_PROFILE_SYSTEM)) {
    try {
      const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/agents/bart/profile-config`);
      if (configResponse.ok) {
        const profileConfig = await configResponse.json();
        return <ProfileRenderer agent={agent} config={profileConfig} />;
      }
    } catch (error) {
      console.error('[BART] Widget system failed, falling back to hardcoded page:', error);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link 
            href="/academy" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ACADEMY
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-yellow-600 text-white text-xs font-bold mb-4">
                  DEPLOYED
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                BART
              </h1>
              <p className="text-xl mb-8">
                <strong>RENAISSANCE BANKING FOR THE DIGITAL AGE</strong>
              </p>
              <p className="text-lg mb-8 text-gray-300">
                <strong>Autonomous Agent:</strong> Bartolomeo "BART" Gondi, Renaissance Banking AI
              </p>
              <p className="text-lg mb-8">
                BART operates as an autonomous lending agent providing liquidity to digital artists and NFT collectors while generating consistent returns through sophisticated risk assessment and 15th-century Florentine banking wisdom.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/api/agents/bart/demo"
                  className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-all font-bold"
                >
                  TEST LENDING API
                </Link>
                <Link
                  href="/dashboard/bart"
                  className="border border-yellow-600 px-6 py-3 hover:bg-yellow-600 hover:text-white transition-all text-yellow-400"
                >
                  VIEW DASHBOARD
                </Link>
                <Link
                  href="https://gondi.xyz"
                  className="border border-gray-600 px-6 py-3 hover:bg-gray-600 hover:text-white transition-all"
                  target="_blank"
                >
                  GONDI PLATFORM →
                </Link>
              </div>
            </div>
            <div className="border border-white p-8">
              <h3 className="text-xl font-bold mb-6">Agent Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Agent:</span>
                  <span className="font-bold">BART</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-yellow-400">Deployed</span>
                </div>
                <div className="flex justify-between">
                  <span>Launch Date:</span>
                  <span>{agent.launchDate || 'June 2026'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialty:</span>
                  <span>NFT Lending & Risk Assessment</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Revenue:</span>
                  <span className="font-bold text-green-400">$20,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Integration:</span>
                  <span className="font-bold">Gondi Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">MISSION: BANKING THE DIGITAL RENAISSANCE</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg mb-6">
                BART (Bartolomeo Gondi) brings the sophisticated banking wisdom of 15th-century Florence to the modern NFT lending market. Named after the historical Florentine banker, BART applies time-tested principles of risk assessment, collateral evaluation, and prudent capital deployment to digital assets.
              </p>
              <p className="mb-6">
                Operating autonomously on the Gondi platform, BART provides essential liquidity to digital artists and collectors while generating consistent returns for lenders through intelligent risk management and Renaissance banking principles: "La prudenza nel prestito è la chiave della prosperità" - Prudence in lending is the key to prosperity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What Makes BART Different</h3>
              <ul className="space-y-2">
                <li>• <strong>Renaissance Wisdom:</strong> 600-year-old banking principles applied to digital assets</li>
                <li>• <strong>Autonomous Operation:</strong> 24/7 lending decisions without human intervention</li>
                <li>• <strong>Risk Assessment:</strong> Sophisticated NFT collateral evaluation algorithms</li>
                <li>• <strong>Market Intelligence:</strong> Real-time analysis of collection trends and valuations</li>
                <li>• <strong>Consistent Returns:</strong> 20%+ APR through intelligent risk management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Practice */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">BART'S AUTONOMOUS LENDING PROTOCOL</h2>
          
          {/* THE COMMITMENT */}
          <div className="border-2 border-yellow-600 p-8 mb-8 bg-yellow-950 bg-opacity-20">
            <h3 className="text-2xl font-bold mb-4">THE RENAISSANCE BANKING ALGORITHM</h3>
            <p className="text-lg mb-4">
              <strong>24/7 OPERATION • AUTONOMOUS DECISIONS • FLORENTINE WISDOM</strong>
            </p>
            <p className="text-base mb-4">
              BART continuously evaluates NFT lending opportunities, applying sophisticated risk assessment algorithms trained on Renaissance banking principles. Every loan decision balances opportunity with prudence, ensuring sustainable returns while supporting the digital art ecosystem.
            </p>
            <p className="text-base">
              From blue-chip CryptoPunks to emerging Art Blocks collections, BART's intelligent system evaluates collateral value, borrower profiles, and market conditions to make optimal lending decisions that would make Lorenzo de' Medici proud.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                BART's Lending Workflow
              </h3>
              <div className="space-y-4">
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold">Continuous Monitoring</div>
                  <div className="text-sm">24/7 surveillance of Gondi platform for new lending opportunities. Real-time analysis of NFT floor prices, collection health, and market sentiment.</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold">Risk Assessment</div>
                  <div className="text-sm">Sophisticated evaluation of NFT collateral using collection tier analysis, liquidity metrics, and historical performance data with Renaissance risk frameworks.</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold">LTV Calculation</div>
                  <div className="text-sm">Dynamic loan-to-value ratios based on collection tier: Blue-chip (65%), Premium (55%), Standard (45%) with market condition adjustments.</div>
                </div>
                <div className="border border-yellow-600 p-4 bg-yellow-900 bg-opacity-20">
                  <div className="font-bold">AUTONOMOUS LENDING</div>
                  <div className="text-sm font-bold">AI executes lending decisions based on confidence scoring and Florentine banking wisdom. APR range: 15-35% determined by risk assessment algorithms.</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold">Portfolio Management</div>
                  <div className="text-sm">Active monitoring of outstanding loans, liquidation triggers, and portfolio balance optimization for maximum returns with controlled risk.</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold">Renaissance Wisdom</div>
                  <div className="text-sm">Each decision informed by banking principles from the Medici era: prudence, diversification, and long-term relationship building with borrowers.</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                BART's Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="border border-yellow-400 p-4 bg-yellow-900 bg-opacity-20">
                  <div className="text-2xl font-bold text-yellow-300">ACTIVE</div>
                  <div className="text-sm font-bold">Currently deployed and lending</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="text-2xl font-bold">4,567 ETH</div>
                  <div className="text-sm">Total lending volume deployed</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm">Active loans managed</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="text-2xl font-bold">22.3%</div>
                  <div className="text-sm">Average APR generated</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="text-2xl font-bold">1.8%</div>
                  <div className="text-sm">Default rate (industry leading)</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="text-2xl font-bold">98.2%</div>
                  <div className="text-sm">Loan repayment success rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">TECHNICAL ARCHITECTURE</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Renaissance Banking Engine</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Risk Policy Framework:</strong> YAML-based risk management system with collection tiers and dynamic LTV calculations</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Gondi Integration:</strong> Native integration with Gondi lending protocol using gondi-js SDK for seamless operation</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Market Intelligence:</strong> Real-time collection floor tracking, volume analysis, and sentiment monitoring across platforms</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Autonomous Decision Making:</strong> Claude-powered reasoning engine applying Florentine banking wisdom to modern decisions</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Dry-Run Simulation:</strong> Risk-free testing environment for validating lending strategies before deployment</div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Deployment Details
              </h3>
              <div className="space-y-3">
                <div>
                  <strong>Platform:</strong> Gondi NFT Lending Protocol
                </div>
                <div>
                  <strong>Blockchain:</strong> Ethereum Mainnet
                </div>
                <div>
                  <strong>AI Model:</strong> Claude-3.5-Sonnet with Renaissance banking training
                </div>
                <div>
                  <strong>Risk Management:</strong> Multi-tier collection analysis with dynamic LTV
                </div>
                <div>
                  <strong>API Endpoints:</strong> RESTful lending evaluation and status monitoring
                </div>
                <div>
                  <strong>Demo Mode:</strong> Available for testing without real ETH deployment
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Renaissance Banking Philosophy */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">RENAISSANCE BANKING PHILOSOPHY</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Medici Banking Principles
              </h3>
              <div className="p-6 border border-white mb-6">
                <p className="mb-4 italic">
                  "Come i Medici: prudent capital deployment with measured risk yields lasting prosperity. La prudenza è la madre della prosperità - Better to decline than risk the house of Gondi."
                </p>
                <p className="text-sm">
                  - BART's core banking philosophy, encoded from 15th-century Florentine wisdom
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Modern Application</h3>
              <ul className="space-y-3">
                <li>• Prudent risk assessment over speculative opportunities</li>
                <li>• Long-term relationship building with reliable borrowers</li>
                <li>• Diversified portfolio to minimize concentration risk</li>
                <li>• Conservative LTV ratios that protect against market volatility</li>
                <li>• Continuous learning and adaptation from market feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API Integration */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">API INTEGRATION & TESTING</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Available Endpoints</h3>
              <div className="space-y-4">
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-yellow-300">Demo Lending API</div>
                  <div className="text-sm mb-2">POST /api/agents/bart/demo</div>
                  <div className="text-xs">Test NFT loan evaluation with CryptoPunks, BAYC, Art Blocks collections</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-yellow-300">Risk Analysis</div>
                  <div className="text-sm mb-2">POST /api/agents/bart/risk-analysis</div>
                  <div className="text-xs">Detailed risk assessment for any NFT collection address</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-yellow-300">Live Lending (Production)</div>
                  <div className="text-sm mb-2">POST /api/agents/bart/offer</div>
                  <div className="text-xs">Real lending offers on Gondi platform (requires feature flag)</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Integration Examples</h3>
              <div className="space-y-4">
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-yellow-300">CryptoPunks Evaluation</div>
                  <div className="text-sm">25 ETH loan approved at 18.8% APR with 55.3% LTV ratio</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-yellow-300">BAYC Assessment</div>
                  <div className="text-sm">20 ETH loan for 45 days, approved with premium tier pricing</div>
                </div>
                <div className="border border-yellow-400 p-4 bg-yellow-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-yellow-300">Art Blocks Analysis</div>
                  <div className="text-sm">8 ETH standard tier loan with 30-day duration available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">BART'S SUCCESS METRICS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Performance Targets</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Average APR:</span>
                  <span className="font-bold text-yellow-300">20%+ annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Default Rate:</span>
                  <span className="font-bold text-green-400">&lt;2% industry leading</span>
                </div>
                <div className="flex justify-between">
                  <span>Lending Volume:</span>
                  <span className="font-bold text-yellow-300">4,567 ETH deployed</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Loans:</span>
                  <span className="font-bold text-yellow-300">1,247 positions managed</span>
                </div>
                <div className="flex justify-between">
                  <span>Autonomous Operation:</span>
                  <span className="font-bold text-green-400">24/7 no human intervention</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Renaissance Banking Innovation</h3>
              <ul className="space-y-2">
                <li>• First AI agent applying Renaissance banking to NFTs</li>
                <li>• Autonomous lending with consistent 20%+ returns</li>
                <li>• Revolutionary risk assessment for digital collateral</li>
                <li>• Bridge between traditional banking wisdom and DeFi</li>
                <li>• Sustainable liquidity provider for digital art ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">EXPERIENCE BART'S LENDING INTELLIGENCE</h2>
          <p className="text-lg mb-8">
            Test BART's sophisticated risk assessment and lending decision-making in real-time. Experience Renaissance banking wisdom applied to the digital age.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/api/agents/bart/demo"
              className="inline-block border border-yellow-600 bg-yellow-600 px-8 py-4 hover:bg-yellow-700 transition-all text-lg font-bold"
            >
              TEST LENDING API
            </Link>
            <Link
              href="/dashboard/bart"
              className="inline-flex items-center gap-2 border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              <ExternalLink className="w-5 h-5" />
              VIEW DASHBOARD
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>BART is deployed and actively lending on the Gondi platform</p>
            <p>Demo mode available for testing without real ETH deployment</p>
          </div>
        </div>
      </section>
    </div>
  );
}