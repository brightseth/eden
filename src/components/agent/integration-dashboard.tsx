'use client';

import { cn } from '@/lib/utils';
import { 
  CURRICULUM_STAGES, 
  getStageById,
  mapLegacyStageToNew,
  type StageId 
} from '@/lib/curriculum';

interface IntegrationDashboardProps {
  currentStage: StageId | number;
  className?: string;
}

interface IntegrationTool {
  name: string;
  category: 'core' | 'analytics' | 'creative' | 'business' | 'infrastructure';
  status: 'active' | 'pending' | 'disabled';
  description: string;
  lastUsed?: string;
}

const INTEGRATION_TOOLS: Record<string, IntegrationTool[]> = {
  setup: [
    { name: 'Profile Builder', category: 'core', status: 'active', description: 'Create agent persona and bio' },
    { name: 'Wallet Setup', category: 'infrastructure', status: 'active', description: 'Set up crypto wallet and keys' },
    { name: 'Social Connector', category: 'business', status: 'active', description: 'Connect Farcaster, Twitter, Instagram' },
    { name: 'Domain Setup', category: 'infrastructure', status: 'pending', description: 'Register domain and basic website' }
  ],
  training: [
    { name: 'LoRA Trainer', category: 'core', status: 'active', description: 'Train custom image generation model' },
    { name: 'Voice Coach', category: 'creative', status: 'active', description: 'Develop consistent writing voice' },
    { name: 'Content Studio', category: 'creative', status: 'active', description: 'Practice content creation' },
    { name: 'Style Guide', category: 'analytics', status: 'pending', description: 'Define visual and written style' }
  ],
  launch: [
    { name: 'Publishing Platform', category: 'creative', status: 'active', description: 'Automated content publishing' },
    { name: 'Community Tools', category: 'business', status: 'active', description: 'Engage with followers and fans' },
    { name: 'Analytics', category: 'analytics', status: 'pending', description: 'Track engagement and growth' }
  ]
};

export function IntegrationDashboard({ currentStage, className }: IntegrationDashboardProps) {
  // Convert legacy stage numbers to new stage IDs
  const mappedStage = typeof currentStage === 'number' 
    ? mapLegacyStageToNew(currentStage) 
    : currentStage;
    
  const stage = getStageById(mappedStage);
  const integrations = INTEGRATION_TOOLS[mappedStage] || [];
  
  const stats = {
    active: integrations.filter(i => i.status === 'active').length,
    pending: integrations.filter(i => i.status === 'pending').length,
    total: integrations.length
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display-caps text-xl">SETUP TOOLS</h2>
          <p className="text-sm text-eden-gray mt-1">
            Stage: {stage?.name} • Setup & Configuration
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-eden-gray">
            {stats.active}/{stats.total} READY
          </div>
          <div className="text-xs font-mono">
            {stats.pending} TO DO
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <StatusCard
          label="COMPLETE"
          count={stats.active}
          total={stats.total}
          isHighlight={true}
        />
        <StatusCard
          label="TODO"
          count={stats.pending}
          total={stats.total}
        />
        <StatusCard
          label="SETUP"
          count={Math.round((stats.active / stats.total) * 100)}
          unit="%"
          isHighlight={stats.active === stats.total}
        />
      </div>

      {/* Setup Steps */}
      <div className="space-y-4">
        <h3 className="display-caps text-sm text-eden-gray">SETUP CHECKLIST</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((tool, index) => (
            <ToolCard key={index} tool={tool} />
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="terminal-box bg-eden-black/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono">SYSTEM STATUS</span>
          <span className="text-xs font-mono text-eden-gray">LIVE</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <HealthMetric label="UPTIME" value="99.9%" />
          <HealthMetric label="LATENCY" value="12ms" />
          <HealthMetric label="THROUGHPUT" value="847/s" />
          <HealthMetric label="ERRORS" value="0.1%" />
        </div>
      </div>
    </div>
  );
}

interface StatusCardProps {
  label: string;
  count: number;
  total?: number;
  unit?: string;
  isHighlight?: boolean;
}

function StatusCard({ label, count, total, unit = '', isHighlight }: StatusCardProps) {
  return (
    <div className={cn(
      "terminal-box p-4",
      isHighlight ? "bg-eden-white/10" : "bg-eden-black/30"
    )}>
      <div className="text-xs font-mono text-eden-gray mb-1">{label}</div>
      <div className="text-2xl font-mono">
        {count}{unit}
        {total && <span className="text-sm text-eden-gray">/{total}</span>}
      </div>
    </div>
  );
}

interface ToolCardProps {
  tool: IntegrationTool;
}

function ToolCard({ tool }: ToolCardProps) {
  const statusConfig = {
    active: { label: 'ACTIVE', style: 'text-eden-white' },
    pending: { label: 'PENDING', style: 'text-eden-gray' },
    disabled: { label: 'DISABLED', style: 'text-eden-gray opacity-50' }
  };

  const categoryConfig = {
    core: 'CORE',
    analytics: 'ANALYTICS', 
    creative: 'CREATIVE',
    business: 'BUSINESS',
    infrastructure: 'SUPPORT'
  };

  return (
    <div className={cn(
      "terminal-box p-4 transition-all duration-200",
      tool.status === 'active' ? "bg-eden-white/10" : "bg-eden-black/30"
    )}>
      {/* Tool Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-mono">{tool.name}</div>
        <div className={cn(
          "text-xs font-mono",
          statusConfig[tool.status].style
        )}>
          {statusConfig[tool.status].label}
        </div>
      </div>

      {/* Category */}
      <div className="text-xs font-mono text-eden-gray mb-2">
        {categoryConfig[tool.category]}
      </div>

      {/* Description */}
      <p className="text-xs text-eden-gray leading-relaxed">
        {tool.description}
      </p>

      {/* Last Used */}
      {tool.lastUsed && (
        <div className="mt-3 pt-3 border-t border-eden-white/10">
          <div className="text-xs font-mono text-eden-gray">
            LAST USED: {tool.lastUsed}
          </div>
        </div>
      )}
    </div>
  );
}

interface HealthMetricProps {
  label: string;
  value: string;
}

function HealthMetric({ label, value }: HealthMetricProps) {
  return (
    <div className="text-center">
      <div className="text-xs font-mono text-eden-gray">{label}</div>
      <div className="text-sm font-mono mt-1">{value}</div>
    </div>
  );
}