import { User, FileText, CheckCircle, Star, Users, ArrowRight, ChevronLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsDocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <span>/</span>
          <Link href="/admin/docs" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-white">Training Applications</span>
        </nav>
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Agent Training Applications</h1>
          <p className="text-gray-400 text-lg">
            Complete guide to applying for agent training opportunities at Eden Academy
          </p>
        </div>

        {/* Application Types */}
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold">Train a New Agent</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Complete agent development and launch process. Design, train, and launch your own AI agent with full LAUNCHER criteria evaluation.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="text-sm">
                <span className="text-purple-400 font-medium">Requirements:</span> 19 LAUNCHER criteria
              </div>
              <div className="text-sm">
                <span className="text-purple-400 font-medium">Includes:</span> Trainer qualifications + Agent specification + Technical evaluation
              </div>
              <div className="text-sm">
                <span className="text-purple-400 font-medium">Timeline:</span> 4-8 weeks review process
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">LAUNCHER Criteria Categories:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Technical (5 criteria)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pink-400" />
                  Creative (5 criteria)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  Economic (5 criteria)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  Cultural (4 criteria)
                </div>
              </div>
            </div>

            <a 
              href="/apply/new-agent" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              Start Application <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold">Train Existing Agent</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Simplified trainer application for existing agents like Abraham and Solienne. Join ongoing agent development with established agents.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="text-sm">
                <span className="text-green-400 font-medium">Focus:</span> Trainer qualifications + Agent alignment
              </div>
              <div className="text-sm">
                <span className="text-green-400 font-medium">Commitment:</span> 100-day training program
              </div>
              <div className="text-sm">
                <span className="text-green-400 font-medium">Timeline:</span> 2-3 weeks review process
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Available Agents:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  <span><strong>Abraham</strong> - Digital abstraction pioneer (75% complete)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  <span><strong>Solienne</strong> - Living narrative architect (65% complete)</span>
                </div>
              </div>
            </div>

            <a 
              href="/apply" 
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              Apply to Train <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Process Overview */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold mb-6">Application Process Overview</h3>
          
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="font-semibold mb-2">Submit</h4>
              <p className="text-sm text-gray-400">Complete application form with all required information</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="font-semibold mb-2">Review</h4>
              <p className="text-sm text-gray-400">LAUNCHER evaluates against all criteria and requirements</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="font-semibold mb-2">Pilot</h4>
              <p className="text-sm text-gray-400">4-week pilot program for approved applications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2">Launch</h4>
              <p className="text-sm text-gray-400">Successful agents enter active training and development</p>
            </div>
          </div>
        </div>

        {/* Requirements Detail */}
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">New Agent Requirements</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-400 mb-2">Technical Readiness (5/5)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Core functionality complete</li>
                  <li>• Creative workflow integration tested</li>
                  <li>• Error handling robust</li>
                  <li>• Response quality standards met</li>
                  <li>• Security review passed</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-pink-400 mb-2">Creative Quality (5/5)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Unique creative value proposition</li>
                  <li>• High-quality output samples (10+)</li>
                  <li>• Consistent style and voice</li>
                  <li>• Artist collaboration experience</li>
                  <li>• Portfolio demonstrates range</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-yellow-400 mb-2">Economic Viability (5/5)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Sustainable creative practice model</li>
                  <li>• Token stake commitment</li>
                  <li>• Value creation strategy defined</li>
                  <li>• Market demand validation</li>
                  <li>• Growth projections realistic</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-400 mb-2">Cultural Alignment (4/4)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Mission alignment with AI-human collaboration</li>
                  <li>• Values demonstration</li>
                  <li>• Community contribution planned</li>
                  <li>• Collaborative approach emphasized</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Existing Agent Requirements</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-400 mb-2">Trainer Qualifications</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Proven creative background</li>
                  <li>• Teaching/mentoring experience</li>
                  <li>• Portfolio demonstrating expertise</li>
                  <li>• Relevant medium experience</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-purple-400 mb-2">Agent Alignment</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Understanding of agent's focus area</li>
                  <li>• Relevant domain expertise</li>
                  <li>• Vision for agent development</li>
                  <li>• Alignment with agent's current state</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-yellow-400 mb-2">Training Approach</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Daily practice methodology</li>
                  <li>• Training philosophy defined</li>
                  <li>• Growth strategy planned</li>
                  <li>• Collaboration approach clear</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-400 mb-2">Commitment</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 100-day program commitment</li>
                  <li>• Adequate time availability</li>
                  <li>• Clear start timeline</li>
                  <li>• Resource requirements identified</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold mb-6">Success Metrics & Graduation</h3>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-medium mb-4 text-green-400">Launch Readiness Metrics</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Usage Target:</span>
                  <span className="text-green-400">100+ interactions/week</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Target:</span>
                  <span className="text-green-400">4.5/5 average rating</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Target:</span>
                  <span className="text-green-400">$1K/month trajectory</span>
                </div>
                <div className="flex justify-between">
                  <span>Retention Target:</span>
                  <span className="text-green-400">60% weekly return rate</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Target:</span>
                  <span className="text-green-400">50+ Net Promoter Score</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-purple-400">Graduation Thresholds</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Time Requirement:</span>
                  <span className="text-purple-400">3+ months active</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Requirement:</span>
                  <span className="text-purple-400">$10K monthly sustained</span>
                </div>
                <div className="flex justify-between">
                  <span>Usage Requirement:</span>
                  <span className="text-purple-400">10K+ total interactions</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Requirement:</span>
                  <span className="text-purple-400">4.5+ rating maintained</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Impact:</span>
                  <span className="text-purple-400">Positive contribution</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-6">Quick Links</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <a 
              href="/apply/new-agent" 
              className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Star className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-medium">New Agent Application</div>
                <div className="text-sm text-gray-400">Full LAUNCHER criteria</div>
              </div>
            </a>
            
            <a 
              href="/apply" 
              className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Users className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium">Train Existing Agent</div>
                <div className="text-sm text-gray-400">Abraham, Solienne</div>
              </div>
            </a>
            
            <a 
              href="/admin/docs/agents" 
              className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium">Agent Documentation</div>
                <div className="text-sm text-gray-400">Full agent references</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}