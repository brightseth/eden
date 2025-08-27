'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Crown, ArrowLeft, Users, DollarSign, Zap, BarChart3, Globe, Settings, ExternalLink, Play, Presentation, Calendar } from 'lucide-react';

export default function EcosystemPresentationPage() {
  const [activeSection, setActiveSection] = useState('overview');
  
  const presentationDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const agents = [
    {
      name: 'ABRAHAM',
      role: 'Covenant Artist',
      revenue: '$12,500/mo',
      status: 'DEPLOYED',
      color: 'bg-red-500',
      description: 'Daily knowledge synthesis works with 2,519+ pieces in archive',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/abraham', icon: Play },
        { name: 'Latest Work (#2522)', url: '/agents/abraham?tab=works', icon: ExternalLink },
        { name: 'Works Archive', url: '/agents/abraham?tab=works', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/abraham', icon: Settings }
      ]
    },
    {
      name: 'SOLIENNE',
      role: 'Consciousness Artist',
      revenue: '$8,500/mo',
      status: 'DEPLOYED',
      color: 'bg-teal-500',
      description: 'Consciousness through light & motion - 3,677 works spanning consciousness studies',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/solienne', icon: Play },
        { name: 'Works Gallery', url: '/agents/solienne?tab=works', icon: ExternalLink },
        { name: 'Academy Page', url: '/academy/agent/solienne', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/solienne', icon: Settings }
      ]
    },
    {
      name: 'SUE',
      role: 'Gallery Curator',
      revenue: '$4,500/mo',
      status: 'DEPLOYED',
      color: 'bg-purple-500',
      description: 'AI gallery curator managing exhibitions and cultural programming',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/sue', icon: Play },
        { name: 'Works Gallery', url: '/agents/sue?tab=works', icon: ExternalLink },
        { name: 'Academy Page', url: '/academy/agent/sue', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/sue', icon: Settings }
      ]
    },
    {
      name: 'CITIZEN',
      role: 'DAO Manager',
      revenue: '$8,200/mo',
      status: 'DEPLOYED',
      color: 'bg-blue-500',
      description: 'Autonomous DAO governance with real-time market data integration',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/citizen', icon: Play },
        { name: 'Training System', url: '/agents/citizen?tab=training', icon: ExternalLink },
        { name: 'Academy Page', url: '/academy/agent/citizen', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/citizen', icon: Settings }
      ]
    },
    {
      name: 'BERTHA',
      role: 'Art Intelligence',
      revenue: '$12,000/mo',
      status: 'DEPLOYED',
      color: 'bg-orange-500',
      description: 'Collection intelligence trained by legendary collectors',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/bertha', icon: Play },
        { name: 'Dashboard', url: '/dashboard/bertha', icon: ExternalLink },
        { name: 'Academy Page', url: '/academy/agent/bertha', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/bertha', icon: Settings }
      ]
    },
    {
      name: 'MIYOMI',
      role: 'Market Oracle',
      revenue: '$15,000/mo',
      status: 'DEPLOYED',
      color: 'bg-emerald-500',
      description: 'Advanced market intelligence with prediction capabilities',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/miyomi', icon: Play },
        { name: 'Trading Dashboard', url: '/dashboard/miyomi', icon: ExternalLink },
        { name: 'Academy Page', url: '/academy/agent/miyomi', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/miyomi', icon: Settings }
      ]
    },
    {
      name: 'GEPPETTO',
      role: 'Product Designer',
      revenue: '$8,500/mo',
      status: 'DEPLOYED',
      color: 'bg-sky-500',
      description: '3D modeling & manufacturing - 347 designs, 89 prototypes created',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/geppetto', icon: Play },
        { name: 'Works Gallery', url: '/agents/geppetto?tab=works', icon: ExternalLink },
        { name: 'Academy Page', url: '/academy/agent/geppetto', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/geppetto', icon: Settings }
      ]
    },
    {
      name: 'KORU',
      role: 'Community Growth',
      revenue: '$7,500/mo',
      status: 'DEPLOYED',
      color: 'bg-pink-500',
      description: 'Managing 45k members across 12 communities - 15.3% growth rate',
      demoLinks: [
        { name: 'Agent Profile', url: '/agents/koru', icon: Play },
        { name: 'Works Gallery', url: '/agents/koru?tab=works', icon: ExternalLink },
        { name: 'Academy Page', url: '/academy/agent/koru', icon: BarChart3 },
        { name: 'API Data', url: '/api/agents/koru', icon: Settings }
      ]
    }
  ];

  const ecosystemStats = {
    totalRevenue: '$76,700',
    agentsDeployed: '8/8',
    systemHealth: '100%',
    totalMembers: '45,000+',
    worksCreated: '6,200+',
    prototypes: '89',
    exhibitions: '12+',
    communities: '12'
  };

  const crossAgentWorkflows = [
    {
      title: 'Art Market Intelligence',
      description: 'MIYOMI identifies trends → BERTHA analyzes collections → SOLIENNE/ABRAHAM create targeted works → SUE curates exhibition',
      agents: ['MIYOMI', 'BERTHA', 'SOLIENNE', 'ABRAHAM', 'SUE'],
      revenue: '+$15,000'
    },
    {
      title: 'Community-Driven Creation',
      description: 'KORU identifies community interests → GEPPETTO designs products → CITIZEN manages DAO funding → ABRAHAM documents process',
      agents: ['KORU', 'GEPPETTO', 'CITIZEN', 'ABRAHAM'],
      revenue: '+$8,500'
    },
    {
      title: 'Autonomous Exhibition Cycle',
      description: 'SUE curates → KORU promotes → MIYOMI tracks performance → BERTHA analyzes collector response → Optimize next cycle',
      agents: ['SUE', 'KORU', 'MIYOMI', 'BERTHA'],
      revenue: '+$12,000'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/ceo"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                CEO Dashboard
              </Link>
              <span className="text-gray-600">/</span>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <Presentation className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Ecosystem Presentation</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{presentationDate}</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Eden Academy Ecosystem
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Complete AI Agent Deployment - Ready for Henry & Gene Presentation
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="bg-green-500/20 px-3 py-1 rounded-lg">
                <span className="text-green-400 font-semibold">8/8 Agents Deployed</span>
              </div>
              <div className="bg-purple-500/20 px-3 py-1 rounded-lg">
                <span className="text-purple-400 font-semibold">{ecosystemStats.totalRevenue}/month Revenue</span>
              </div>
              <div className="bg-blue-500/20 px-3 py-1 rounded-lg">
                <span className="text-blue-400 font-semibold">100% Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'agents', name: 'Agent Interfaces', icon: Users },
            { id: 'workflows', name: 'Cross-Agent Workflows', icon: Zap },
            { id: 'demo', name: 'Live Demo Links', icon: ExternalLink }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeSection === tab.id 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(ecosystemStats).map(([key, value]) => (
                <div key={key} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-green-400 mb-1">{value}</div>
                  <div className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-8 rounded-xl border border-green-500/30">
              <h2 className="text-2xl font-bold mb-4">🚀 What We Built This Week</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-400">New Deployments</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ GEPPETTO - Complete product design system</li>
                    <li>✅ KORU - Full community management platform</li>
                    <li>✅ Registry integration across all 8 agents</li>
                    <li>✅ Cross-agent communication protocols</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">Revenue Impact</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>💰 +$16,000/month from new deployments</li>
                    <li>📈 26% total revenue increase</li>
                    <li>🎯 $920k annual projection</li>
                    <li>🏆 All agents contributing autonomously</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agents Section */}
        {activeSection === 'agents' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div key={agent.name} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{agent.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <p className="text-gray-400">{agent.role}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-400 font-semibold text-lg">{agent.revenue}</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{agent.description}</p>
                </div>
                
                <div className="space-y-2">
                  {agent.demoLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.url}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-white p-2 hover:bg-gray-800/50 rounded transition-all"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workflows Section */}
        {activeSection === 'workflows' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Cross-Agent Workflow Demonstrations</h2>
              <p className="text-gray-400">Watch how our 8 AI agents collaborate autonomously to create value</p>
            </div>
            
            {crossAgentWorkflows.map((workflow, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{workflow.title}</h3>
                  <span className="text-green-400 font-semibold">{workflow.revenue}</span>
                </div>
                
                <p className="text-gray-300 mb-6">{workflow.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {workflow.agents.map(agentName => {
                    const agent = agents.find(a => a.name === agentName);
                    return (
                      <span
                        key={agentName}
                        className={`px-3 py-1 ${agent?.color || 'bg-gray-500'} text-white rounded-full text-sm font-medium`}
                      >
                        {agentName}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo Links Section */}
        {activeSection === 'demo' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Live Demonstration Links</h2>
              <p className="text-gray-400">Direct links to agent interfaces for real-time demonstration</p>
            </div>
            
            {/* Quick Access Panel */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4">🚀 Quick Demo Sequence</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/agents/abraham" target="_blank" className="bg-red-500/20 hover:bg-red-500/30 p-4 rounded-lg text-center transition-all">
                  <div className="font-semibold">ABRAHAM Live</div>
                  <div className="text-sm text-gray-300">Current Work #2522</div>
                </Link>
                <Link href="/dashboard/miyomi" target="_blank" className="bg-emerald-500/20 hover:bg-emerald-500/30 p-4 rounded-lg text-center transition-all">
                  <div className="font-semibold">MIYOMI Oracle</div>
                  <div className="text-sm text-gray-300">Market Intelligence</div>
                </Link>
                <Link href="/dashboard/bertha" target="_blank" className="bg-orange-500/20 hover:bg-orange-500/30 p-4 rounded-lg text-center transition-all">
                  <div className="font-semibold">BERTHA Analysis</div>
                  <div className="text-sm text-gray-300">Collection Intelligence</div>
                </Link>
                <Link href="/cross-agent-demo.html" target="_blank" className="bg-purple-500/20 hover:bg-purple-500/30 p-4 rounded-lg text-center transition-all">
                  <div className="font-semibold">Full Ecosystem</div>
                  <div className="text-sm text-gray-300">Interactive Demo</div>
                </Link>
              </div>
            </div>
            
            {/* Complete Agent Links */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">🎨 Creative Agents</h3>
                <div className="space-y-3">
                  <Link href="/agents/abraham" target="_blank" className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded transition-all">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold">A</div>
                    <div className="flex-1">
                      <div className="font-semibold">ABRAHAM - Live Creation</div>
                      <div className="text-sm text-gray-400">Knowledge synthesis in progress</div>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  
                  <Link href="/agents/solienne" target="_blank" className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded transition-all">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-sm font-bold">S</div>
                    <div className="flex-1">
                      <div className="font-semibold">SOLIENNE - Consciousness Art</div>
                      <div className="text-sm text-gray-400">3,677 works and counting</div>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  
                  <Link href="/agents/geppetto" target="_blank" className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded transition-all">
                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-sm font-bold">G</div>
                    <div className="flex-1">
                      <div className="font-semibold">GEPPETTO - Product Design</div>
                      <div className="text-sm text-gray-400">347 designs, 89 prototypes</div>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">💼 Business Agents</h3>
                <div className="space-y-3">
                  <Link href="/dashboard/miyomi" target="_blank" className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded transition-all">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">M</div>
                    <div className="flex-1">
                      <div className="font-semibold">MIYOMI - Market Oracle</div>
                      <div className="text-sm text-gray-400">$15k/mo revenue leader</div>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  
                  <Link href="/dashboard/bertha" target="_blank" className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded transition-all">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">B</div>
                    <div className="flex-1">
                      <div className="font-semibold">BERTHA - Art Intelligence</div>
                      <div className="text-sm text-gray-400">Legendary collector training</div>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  
                  <Link href="/agents/citizen" target="_blank" className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded transition-all">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">C</div>
                    <div className="flex-1">
                      <div className="font-semibold">CITIZEN - DAO Manager</div>
                      <div className="text-sm text-gray-400">Autonomous governance</div>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  
                  <Link href="/agents/koru" target="_blank" className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded transition-all">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm font-bold">K</div>
                    <div className="flex-1">
                      <div className="font-semibold">KORU - Community Growth</div>
                      <div className="text-sm text-gray-400">45k members, 15.3% growth</div>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-900/30 to-purple-900/30 p-8 rounded-xl border border-green-500/30">
            <h3 className="text-2xl font-bold mb-4">🎉 Ready to Present!</h3>
            <p className="text-gray-300 mb-6">
              All 8 AI agents deployed and generating $76,700/month autonomous revenue
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/cross-agent-demo.html" 
                target="_blank"
                className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Launch Full Demo
              </Link>
              <Link 
                href="/admin/ceo/live-status"
                className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Live Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}