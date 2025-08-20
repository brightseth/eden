'use client';

import { useState } from 'react';
import { Settings, CheckCircle2, AlertCircle, Wifi, Key, Zap, Shield } from 'lucide-react';

interface SetupProps {
  agentName: string;
}

export function Setup({ agentName }: SetupProps) {
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  const configurations = [
    {
      id: 'blockchain',
      title: 'Blockchain Configuration',
      status: 'configured',
      icon: <Key className="w-4 h-4" />,
      items: [
        { name: 'Ethereum Mainnet', status: 'connected', value: 'Connected via Infura' },
        { name: 'Wallet Address', status: 'configured', value: '0x742d...3a9f' },
        { name: 'Gas Settings', status: 'configured', value: 'Auto-optimize enabled' },
        { name: 'Private Key Security', status: 'secured', value: 'Hardware wallet integration' }
      ]
    },
    {
      id: 'creation',
      title: 'Creation Engine',
      status: 'configured',
      icon: <Zap className="w-4 h-4" />,
      items: [
        { name: 'AI Model', status: 'loaded', value: 'Custom LoRA v2.1' },
        { name: 'Style Consistency', status: 'calibrated', value: '98.5% match rate' },
        { name: 'Output Quality', status: 'optimized', value: '4K resolution' },
        { name: 'Generation Speed', status: 'optimized', value: '45s average' }
      ]
    },
    {
      id: 'automation',
      title: 'Automation Systems',
      status: 'partial',
      icon: <Settings className="w-4 h-4" />,
      items: [
        { name: 'Daily Schedule', status: 'configured', value: '12:00 UTC daily' },
        { name: 'Auction Creation', status: 'configured', value: 'Auto-deploy enabled' },
        { name: 'Backup Systems', status: 'pending', value: 'Not configured' },
        { name: 'Monitoring', status: 'partial', value: 'Basic alerts only' }
      ]
    },
    {
      id: 'platforms',
      title: 'Platform Integrations',
      status: 'configured',
      icon: <Wifi className="w-4 h-4" />,
      items: [
        { name: 'OpenSea', status: 'connected', value: 'API v2 integrated' },
        { name: 'Foundation', status: 'connected', value: 'Auto-listing enabled' },
        { name: 'Twitter API', status: 'connected', value: 'Auto-posting configured' },
        { name: 'Farcaster', status: 'connected', value: 'Social updates enabled' }
      ]
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      status: 'needs-attention',
      icon: <Shield className="w-4 h-4" />,
      items: [
        { name: 'Smart Contract Audit', status: 'pending', value: 'Scheduled with Lattice' },
        { name: 'Access Controls', status: 'configured', value: 'Multi-sig enabled' },
        { name: 'Backup Recovery', status: 'partial', value: 'Seed phrase secured' },
        { name: 'Insurance Coverage', status: 'pending', value: 'Under review' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
      case 'connected':
      case 'loaded':
      case 'calibrated':
      case 'optimized':
      case 'secured':
        return <CheckCircle2 className="w-3 h-3 text-green-400" />;
      case 'partial':
        return <AlertCircle className="w-3 h-3 text-yellow-400" />;
      case 'pending':
      case 'needs-attention':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured':
        return 'text-green-400';
      case 'partial':
        return 'text-yellow-400';
      case 'needs-attention':
        return 'text-red-400';
      default:
        return 'text-gray-500';
    }
  };

  const systemHealth = {
    overall: 85,
    uptime: '99.7%',
    lastIssue: '3 days ago',
    criticalIssues: 1
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase">System Health</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{systemHealth.overall}%</div>
          <div className="text-xs text-gray-500">overall status</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500 uppercase">Uptime</span>
          </div>
          <div className="text-2xl font-bold">{systemHealth.uptime}</div>
          <div className="text-xs text-gray-500">last 30 days</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-500 uppercase">Issues</span>
          </div>
          <div className="text-2xl font-bold">{systemHealth.criticalIssues}</div>
          <div className="text-xs text-gray-500">critical</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500 uppercase">Last Issue</span>
          </div>
          <div className="text-2xl font-bold">{systemHealth.lastIssue.split(' ')[0]}</div>
          <div className="text-xs text-gray-500">days ago</div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">SYSTEM CONFIGURATION</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {configurations.map((config) => (
            <div key={config.id} className="p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedConfig(
                  selectedConfig === config.id ? null : config.id
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">{config.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{config.title}</div>
                    <div className={`text-xs ${getStatusColor(config.status)}`}>
                      {config.status.replace('-', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.status)}
                  <span className="text-xs text-gray-500">
                    {config.items.filter(item => 
                      ['configured', 'connected', 'loaded', 'calibrated', 'optimized', 'secured'].includes(item.status)
                    ).length}/{config.items.length}
                  </span>
                </div>
              </div>

              {selectedConfig === config.id && (
                <div className="mt-4 pl-7 space-y-3">
                  {config.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-xs">{item.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 border border-gray-800 hover:border-green-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">RUN DIAGNOSTICS</div>
          <div className="text-xs text-gray-500">Check all systems and connections</div>
        </button>
        
        <button className="p-4 border border-gray-800 hover:border-blue-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">UPDATE SETTINGS</div>
          <div className="text-xs text-gray-500">Modify configuration parameters</div>
        </button>

        <button className="p-4 border border-gray-800 hover:border-red-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">EMERGENCY STOP</div>
          <div className="text-xs text-gray-500">Halt all automated operations</div>
        </button>
      </div>

      {/* Recent Changes */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">RECENT CONFIGURATION CHANGES</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {[
            { date: '2025-08-19', change: 'Updated gas optimization settings', user: 'System Auto' },
            { date: '2025-08-18', change: 'Connected new Twitter API keys', user: 'Admin' },
            { date: '2025-08-16', change: 'Enabled backup monitoring alerts', user: 'Admin' },
            { date: '2025-08-15', change: 'Updated creation engine parameters', user: 'Gene Kogan' }
          ].map((log, idx) => (
            <div key={idx} className="p-3 flex justify-between items-center">
              <div>
                <div className="text-xs font-medium">{log.change}</div>
                <div className="text-xs text-gray-500">by {log.user}</div>
              </div>
              <div className="text-xs text-gray-500">{log.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}