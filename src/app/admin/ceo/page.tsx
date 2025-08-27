'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Crown, Users, TrendingUp, GitBranch, Target, Calendar, 
  BarChart3, Globe, Rocket, Shield, Settings, FileText,
  Clock, AlertTriangle, CheckCircle, Activity
} from 'lucide-react';

// CEO Dashboard Sections
const ceoTools = [
  {
    title: 'Agent Cheatsheet',
    description: 'Claude Coding Agents - Your 6 AI development tools',
    href: '/admin/ceo/agents',
    icon: Users,
    category: 'Development',
    priority: 'high'
  },
  {
    title: 'Company Metrics',
    description: 'Real-time Eden Academy performance dashboard',
    href: '/admin/ceo/metrics',
    icon: TrendingUp,
    category: 'Analytics',
    priority: 'high'
  },
  {
    title: 'Agent Status',
    description: 'Production agent health and performance',
    href: '/admin/ceo/agent-status',
    icon: Activity,
    category: 'Operations',
    priority: 'high'
  },
  {
    title: 'Strategic Planning',
    description: 'Roadmap, OKRs, and strategic initiatives',
    href: '/admin/ceo/strategy',
    icon: Target,
    category: 'Strategy',
    priority: 'high'
  },
  {
    title: 'Team Dashboard',
    description: 'Team performance, capacity, and projects',
    href: '/admin/ceo/team',
    icon: Shield,
    category: 'Management',
    priority: 'medium'
  },
  {
    title: 'Financial Overview',
    description: 'Revenue, costs, and token economics',
    href: '/admin/ceo/finance',
    icon: BarChart3,
    category: 'Finance',
    priority: 'high'
  },
  {
    title: 'System Health',
    description: 'Infrastructure monitoring and alerts',
    href: '/admin/ceo/health',
    icon: AlertTriangle,
    category: 'Operations',
    priority: 'medium'
  },
  {
    title: 'Calendar & Tasks',
    description: 'Executive calendar and priority tracking',
    href: '/admin/ceo/calendar',
    icon: Calendar,
    category: 'Productivity',
    priority: 'high'
  },
  {
    title: 'Documentation Hub',
    description: 'System docs, ADRs, and deployment guides',
    href: '/admin/docs',
    icon: FileText,
    category: 'Development',
    priority: 'high'
  },
  {
    title: 'API Explorer',
    description: 'Interactive API documentation and testing',
    href: '/dashboard/api-explorer',
    icon: Settings,
    category: 'Development',
    priority: 'medium'
  }
];

// Quick Actions
const quickActions = [
  { title: 'Deploy to Production', icon: Rocket, action: 'deploy', danger: false },
  { title: 'Emergency Stop', icon: AlertTriangle, action: 'emergency', danger: true },
  { title: 'Backup Registry', icon: Shield, action: 'backup', danger: false },
  { title: 'View Git Status', icon: GitBranch, action: 'git', danger: false }
];

// Key Metrics Summary (mock data - would be real API calls)
const keyMetrics = [
  { label: 'Active Agents', value: '2', change: '+0', status: 'stable' },
  { label: 'Works Generated', value: '4,259+', change: '+147', status: 'up' },
  { label: 'System Uptime', value: '99.9%', change: '+0.1%', status: 'up' },
  { label: 'Daily Revenue', value: '$2,430', change: '+12%', status: 'up' }
];

export default function CEODashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Development', 'Operations', 'Strategy', 'Analytics', 'Management', 'Finance', 'Productivity'];
  
  const filteredTools = selectedCategory === 'All' 
    ? ceoTools 
    : ceoTools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold">CEO Command Center</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Executive dashboard for Eden Academy leadership and company operations
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric) => (
            <div key={metric.label} className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{metric.label}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  metric.status === 'up' ? 'bg-green-500/20 text-green-400' :
                  metric.status === 'down' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 p-6 bg-gray-900/30 border border-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-orange-400" />
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.action}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    action.danger 
                      ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {action.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* CEO Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isHighPriority = tool.priority === 'high';
            
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`block p-6 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  isHighPriority
                    ? 'border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500'
                    : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 rounded-lg ${
                    isHighPriority ? 'bg-yellow-500/20' : 'bg-gray-800'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isHighPriority ? 'text-yellow-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{tool.title}</h3>
                      {isHighPriority && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        tool.category === 'Development' ? 'bg-blue-500/20 text-blue-400' :
                        tool.category === 'Operations' ? 'bg-red-500/20 text-red-400' :
                        tool.category === 'Strategy' ? 'bg-purple-500/20 text-purple-400' :
                        tool.category === 'Analytics' ? 'bg-green-500/20 text-green-400' :
                        tool.category === 'Management' ? 'bg-orange-500/20 text-orange-400' :
                        tool.category === 'Finance' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Documentation & Activity */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          
          {/* Quick Documentation Access */}
          <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Documentation & Guides
            </h2>
            <div className="space-y-3">
              <Link 
                href="/admin/docs" 
                className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold">System Documentation</div>
                    <div className="text-xs text-gray-400">ADRs, architecture, deployment guides</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/CEO-DASHBOARD.md" 
                className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="font-semibold">CEO Dashboard Report</div>
                    <div className="text-xs text-gray-400">Complete agent status & deployment guide</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/api-explorer" 
                className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold">API Explorer</div>
                    <div className="text-xs text-gray-400">Interactive API testing & documentation</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/admin/ceo/live-status" 
                className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="font-semibold">Live Agent Status</div>
                    <div className="text-xs text-gray-400">Real-time 8-agent deployment dashboard</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Activity
            </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>ABRAHAM completed daily work generation (2,522 total works)</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>SOLIENNE generated 20 consciousness streams (1,740 total)</span>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Registry sync completed successfully</span>
              <span className="text-xs text-gray-500">6 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Eden Academy deployed to production</span>
              <span className="text-xs text-gray-500">8 hours ago</span>
            </div>
          </div>
        </div>
        
        </div>

      </div>
    </div>
  );
}