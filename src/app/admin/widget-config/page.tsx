'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Save, Trash2, Eye, Settings, Copy, Download, Upload,
  Palette, Layout, Type, BarChart3, MessageCircle, Users,
  Calendar, Link as LinkIcon, FileText, Video, Coins, Handshake, Globe,
  ArrowLeft, Crown
} from 'lucide-react';
import { getAllWidgets, getWidgetsForAgentType, WidgetMetadata } from '@/lib/profile/widget-registry';
import { WidgetType, AgentProfileConfig, ProfileWidget, WidgetPosition } from '@/lib/profile/types';

// Widget type icons mapping
const WIDGET_ICONS: Record<WidgetType, any> = {
  'hero': Layout,
  'mission': FileText,
  'daily-practice': Calendar,
  'training-status': BarChart3,
  'metrics': BarChart3,
  'works-gallery': Palette,
  'countdown': Calendar,
  'trainer-info': Users,
  'social-links': LinkIcon,
  'custom-content': Type,
  'live-stream': Video,
  'token-economics': Coins,
  'collaboration': Handshake,
  'community': Globe
};

interface AgentWidgetConfig {
  agentId: string;
  agentName: string;
  agentType: string;
  hasConfig: boolean;
  widgets: ProfileWidget[];
}

export default function WidgetConfigDashboard() {
  const [agents, setAgents] = useState<AgentWidgetConfig[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedConfig, setSelectedConfig] = useState<AgentProfileConfig | null>(null);
  const [availableWidgets, setAvailableWidgets] = useState<WidgetMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load agent data and widget configurations
  useEffect(() => {
    loadAgentConfigs();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadAgentConfig(selectedAgent);
    }
  }, [selectedAgent]);

  const loadAgentConfigs = async () => {
    try {
      // Load all agents from manifest
      const agentList = [
        { id: 'abraham', name: 'Abraham', type: 'creator' },
        { id: 'solienne', name: 'Solienne', type: 'creator' },
        { id: 'citizen', name: 'Citizen', type: 'governance' },
        { id: 'bertha', name: 'Bertha', type: 'collector' },
        { id: 'miyomi', name: 'Miyomi', type: 'curator' },
        { id: 'geppetto', name: 'Geppetto', type: 'creator' },
        { id: 'bart', name: 'BART', type: 'financial' },
        { id: 'koru', name: 'Koru', type: 'wellness' },
        { id: 'sue', name: 'Sue', type: 'curator' }
      ];

      const agentConfigs = await Promise.all(
        agentList.map(async (agent) => {
          try {
            const response = await fetch(`/api/agents/${agent.id}/profile-config`);
            const hasConfig = response.ok;
            let widgets: ProfileWidget[] = [];
            
            if (hasConfig) {
              const config = await response.json();
              widgets = config.widgets || [];
            }

            return {
              agentId: agent.id,
              agentName: agent.name,
              agentType: agent.type,
              hasConfig,
              widgets
            };
          } catch (error) {
            return {
              agentId: agent.id,
              agentName: agent.name,
              agentType: agent.type,
              hasConfig: false,
              widgets: []
            };
          }
        })
      );

      setAgents(agentConfigs);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load agent configurations:', error);
      setLoading(false);
    }
  };

  const loadAgentConfig = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/profile-config`);
      if (response.ok) {
        const config = await response.json();
        setSelectedConfig(config);
        
        // Load available widgets for this agent type
        const agent = agents.find(a => a.agentId === agentId);
        if (agent) {
          const widgets = getWidgetsForAgentType(agent.agentType);
          setAvailableWidgets(widgets);
        }
      } else {
        // Create new config template
        const agent = agents.find(a => a.agentId === agentId);
        if (agent) {
          setSelectedConfig({
            agentId,
            layout: {
              type: 'standard',
              maxWidth: '4xl',
              spacing: 'normal'
            },
            widgets: [],
            navigation: {
              showBackToAcademy: true
            },
            theme: {
              background: 'bg-black text-white',
              accent: 'blue',
              borders: 'border-white'
            },
            metadata: {
              title: `${agent.agentName} - Agent Profile`,
              description: `${agent.agentName} agent profile page`
            }
          });
          
          const widgets = getWidgetsForAgentType(agent.agentType);
          setAvailableWidgets(widgets);
        }
      }
    } catch (error) {
      console.error('Failed to load agent config:', error);
    }
  };

  const addWidget = (widgetType: WidgetType) => {
    if (!selectedConfig) return;

    const widgetMetadata = availableWidgets.find(w => w.type === widgetType);
    if (!widgetMetadata) return;

    const newWidget: ProfileWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      position: {
        section: 'main',
        order: selectedConfig.widgets.length + 1
      } as WidgetPosition,
      config: {},
      visibility: { always: true }
    };

    setSelectedConfig({
      ...selectedConfig,
      widgets: [...selectedConfig.widgets, newWidget]
    });
  };

  const removeWidget = (widgetId: string) => {
    if (!selectedConfig) return;

    setSelectedConfig({
      ...selectedConfig,
      widgets: selectedConfig.widgets.filter(w => w.id !== widgetId)
    });
  };

  const updateWidgetOrder = (widgetId: string, direction: 'up' | 'down') => {
    if (!selectedConfig) return;

    const widgets = [...selectedConfig.widgets];
    const index = widgets.findIndex(w => w.id === widgetId);
    
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= widgets.length) return;

    // Swap widgets
    [widgets[index], widgets[newIndex]] = [widgets[newIndex], widgets[index]];
    
    // Update order values
    widgets.forEach((widget, i) => {
      widget.position.order = i + 1;
    });

    setSelectedConfig({
      ...selectedConfig,
      widgets
    });
  };

  const saveConfiguration = async () => {
    if (!selectedConfig) return;

    setSaving(true);
    try {
      // This would normally save to a database or generate the API file
      // For now, we'll show the generated configuration
      console.log('Saving configuration:', selectedConfig);
      
      // Update the agent's hasConfig status
      setAgents(agents.map(agent => 
        agent.agentId === selectedConfig.agentId 
          ? { ...agent, hasConfig: true, widgets: selectedConfig.widgets }
          : agent
      ));
      
      alert('Configuration saved! In production, this would generate the profile-config API endpoint.');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const exportConfiguration = () => {
    if (!selectedConfig) return;

    const configCode = `// Generated profile configuration for ${selectedConfig.agentId}
import { AgentProfileConfig } from '@/lib/profile/types';

export const ${selectedConfig.agentId.toUpperCase()}_PROFILE_CONFIG: AgentProfileConfig = ${JSON.stringify(selectedConfig, null, 2)};

export async function GET() {
  return NextResponse.json(${selectedConfig.agentId.toUpperCase()}_PROFILE_CONFIG);
}`;

    const blob = new Blob([configCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedConfig.agentId}-profile-config.ts`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading widget configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/admin/ceo"
            className="inline-flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <Crown className="w-4 h-4" />
            Back to CEO Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-gray-800 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
                Widget Configuration Dashboard
              </h1>
              <p className="text-gray-400">
                Configure agent-specific profile widgets and layouts
              </p>
            </div>
            <div className="flex items-center gap-4">
              {selectedConfig && (
                <>
                  <button
                    onClick={exportConfiguration}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-colors text-sm font-bold uppercase"
                  >
                    <Download className="w-4 h-4" />
                    Export Config
                  </button>
                  <button
                    onClick={saveConfiguration}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold uppercase disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Config'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Agent List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4">
              Agents ({agents.length})
            </h2>
            <div className="space-y-2">
              {agents.map((agent) => (
                <button
                  key={agent.agentId}
                  onClick={() => setSelectedAgent(agent.agentId)}
                  className={`w-full text-left p-4 border transition-colors ${
                    selectedAgent === agent.agentId
                      ? 'border-white bg-white/5'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{agent.agentName}</h3>
                    {agent.hasConfig ? (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 uppercase">
                    {agent.agentType} • {agent.widgets.length} widgets
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Editor */}
          <div className="lg:col-span-3">
            {selectedAgent && selectedConfig ? (
              <div className="space-y-8">
                {/* Current Widgets */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold uppercase tracking-wider">
                      Current Widgets ({selectedConfig.widgets.length})
                    </h2>
                    <span className="text-sm text-gray-400 uppercase">
                      Agent Type: {agents.find(a => a.agentId === selectedAgent)?.agentType}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedConfig.widgets.length === 0 ? (
                      <div className="border border-dashed border-gray-600 p-8 text-center">
                        <p className="text-gray-400 mb-4">No widgets configured</p>
                        <p className="text-sm text-gray-500">Add widgets from the available options below</p>
                      </div>
                    ) : (
                      selectedConfig.widgets.map((widget, index) => {
                        const IconComponent = WIDGET_ICONS[widget.type] || Layout;
                        const metadata = availableWidgets.find(w => w.type === widget.type);
                        
                        return (
                          <div
                            key={widget.id}
                            className="flex items-center gap-4 p-4 border border-gray-600 hover:border-gray-400 transition-colors"
                          >
                            <IconComponent className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">{metadata?.name || widget.type}</h3>
                                <span className="text-xs px-2 py-1 bg-gray-800 border border-gray-600 rounded">
                                  {widget.position.section}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400">
                                {metadata?.description || 'Custom widget'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">#{widget.position.order}</span>
                              <button
                                onClick={() => updateWidgetOrder(widget.id, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-800 rounded disabled:opacity-50"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => updateWidgetOrder(widget.id, 'down')}
                                disabled={index === selectedConfig.widgets.length - 1}
                                className="p-1 hover:bg-gray-800 rounded disabled:opacity-50"
                                title="Move down"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => removeWidget(widget.id)}
                                className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                                title="Remove widget"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Available Widgets */}
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-4">
                    Available Widgets ({availableWidgets.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableWidgets.map((widget) => {
                      const IconComponent = WIDGET_ICONS[widget.type] || Layout;
                      const isUsed = selectedConfig.widgets.some(w => w.type === widget.type);
                      
                      return (
                        <div
                          key={widget.type}
                          className={`p-4 border transition-colors ${
                            isUsed 
                              ? 'border-gray-700 bg-gray-800/50 opacity-75'
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <IconComponent className="w-5 h-5 text-gray-400" />
                            <h3 className="font-bold">{widget.name}</h3>
                          </div>
                          <p className="text-sm text-gray-400 mb-4">
                            {widget.description}
                          </p>
                          {widget.agentTypes && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {widget.agentTypes.map(type => (
                                <span
                                  key={type}
                                  className="text-xs px-2 py-1 bg-blue-900/30 border border-blue-600 rounded"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => addWidget(widget.type)}
                            disabled={isUsed}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-600 hover:border-white transition-colors text-sm font-bold uppercase disabled:opacity-50 disabled:hover:border-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                            {isUsed ? 'Added' : 'Add Widget'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border border-dashed border-gray-600">
                <div className="text-center">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select an agent to configure widgets</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}