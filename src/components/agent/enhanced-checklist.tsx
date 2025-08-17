'use client';

import { useState } from 'react';
import { Check, Square, ExternalLink, ChevronRight, Info } from 'lucide-react';
import { safeToInt } from '@/lib/utils/number';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  category: 'profile' | 'tools' | 'integrations' | 'permissions';
  action?: string;
  link?: string;
}

const SETUP_TASKS: ChecklistItem[] = [
  // PROFILE
  {
    id: 'username',
    label: 'Set username',
    description: 'Unique identifier for your agent',
    completed: false,
    category: 'profile',
    action: 'CONFIGURE'
  },
  {
    id: 'name',
    label: 'Set display name',
    description: 'Public-facing name for your agent',
    completed: false,
    category: 'profile',
    action: 'CONFIGURE'
  },
  {
    id: 'avatar',
    label: 'Upload profile image',
    description: 'Visual identity for your agent',
    completed: false,
    category: 'profile',
    action: 'UPLOAD'
  },
  {
    id: 'description',
    label: 'Write description',
    description: 'Explain what your agent does and its purpose',
    completed: false,
    category: 'profile',
    action: 'WRITE'
  },
  {
    id: 'instructions',
    label: 'Set creative instructions',
    description: 'Define aesthetic style and creative approach',
    completed: false,
    category: 'profile',
    action: 'WRITE'
  },
  {
    id: 'greeting',
    label: 'Create greeting message',
    description: 'First message users see when they interact',
    completed: false,
    category: 'profile',
    action: 'WRITE'
  },
  {
    id: 'public',
    label: 'Make agent public',
    description: 'Allow others to discover and interact with your agent',
    completed: false,
    category: 'profile',
    action: 'TOGGLE'
  },

  // TOOLS
  {
    id: 'voice',
    label: 'Select voice',
    description: 'Choose TTS voice for audio outputs',
    completed: false,
    category: 'tools',
    action: 'SELECT'
  },
  {
    id: 'lora',
    label: 'Add LoRA model',
    description: 'Custom visual style training for image generation',
    completed: false,
    category: 'tools',
    action: 'TRAIN'
  },
  {
    id: 'images',
    label: 'Enable image creation',
    description: 'Allow agent to generate visual content',
    completed: false,
    category: 'tools',
    action: 'TOGGLE'
  },
  {
    id: 'audio',
    label: 'Enable audio creation',
    description: 'Allow agent to create music and sounds',
    completed: false,
    category: 'tools',
    action: 'TOGGLE'
  },
  {
    id: 'vj',
    label: 'Enable VJ tools',
    description: 'Visual performance and live video tools',
    completed: false,
    category: 'tools',
    action: 'TOGGLE'
  },
  {
    id: 'collections',
    label: 'Enable collections',
    description: 'Organize creations into themed sets',
    completed: false,
    category: 'tools',
    action: 'TOGGLE'
  },
  {
    id: 'social',
    label: 'Enable social tools',
    description: 'Post and interact on social platforms',
    completed: false,
    category: 'tools',
    action: 'TOGGLE'
  },

  // INTEGRATIONS
  {
    id: 'discord',
    label: 'Connect Discord',
    description: 'Interact in Discord servers and DMs',
    completed: false,
    category: 'integrations',
    action: 'CONNECT'
  },
  {
    id: 'twitter',
    label: 'Connect Twitter/X',
    description: 'Post and engage on Twitter',
    completed: false,
    category: 'integrations',
    action: 'CONNECT'
  },
  {
    id: 'tiktok',
    label: 'Connect TikTok',
    description: 'Create and share video content',
    completed: false,
    category: 'integrations',
    action: 'CONNECT'
  },
  {
    id: 'farcaster',
    label: 'Connect Farcaster',
    description: 'Engage on decentralized social network',
    completed: false,
    category: 'integrations',
    action: 'CONNECT'
  },
  {
    id: 'shopify',
    label: 'Connect Shopify',
    description: 'Sell merchandise and digital goods',
    completed: false,
    category: 'integrations',
    action: 'CONNECT'
  },
  {
    id: 'printify',
    label: 'Connect Printify',
    description: 'Print-on-demand merchandise',
    completed: false,
    category: 'integrations',
    action: 'CONNECT'
  },
  {
    id: 'captions',
    label: 'Connect Captions AI',
    description: 'Generate captions for video content',
    completed: false,
    category: 'integrations',
    action: 'CONNECT'
  },
  {
    id: 'coverage',
    label: 'Set usage coverage',
    description: 'Configure who pays for API costs',
    completed: false,
    category: 'integrations',
    action: 'CONFIGURE'
  },

  // PERMISSIONS
  {
    id: 'owner',
    label: 'Set owner permissions',
    description: 'Define what you can do with your agent',
    completed: false,
    category: 'permissions',
    action: 'CONFIGURE'
  },
  {
    id: 'editors',
    label: 'Add collaborators',
    description: 'Grant edit access to team members',
    completed: false,
    category: 'permissions',
    action: 'INVITE'
  },
  {
    id: 'memory',
    label: 'Configure memory',
    description: 'Set extraction prompts and knowledge base',
    completed: false,
    category: 'permissions',
    action: 'CONFIGURE'
  },
  {
    id: 'collective',
    label: 'Join collective',
    description: 'Share knowledge with other agents',
    completed: false,
    category: 'permissions',
    action: 'JOIN'
  }
];

const CATEGORY_INFO = {
  profile: {
    title: 'PROFILE',
    description: 'Core identity and public presence'
  },
  tools: {
    title: 'TOOLS & CAPABILITIES',
    description: 'Creative and functional abilities'
  },
  integrations: {
    title: 'INTEGRATIONS',
    description: 'External platforms and services'
  },
  permissions: {
    title: 'PERMISSIONS & MEMORY',
    description: 'Access control and knowledge management'
  }
};

export function EnhancedChecklist() {
  const [tasks, setTasks] = useState(SETUP_TASKS);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('profile');
  const [showHelp, setShowHelp] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedByCategory = (category: string) => {
    const categoryTasks = tasks.filter(t => t.category === category);
    return categoryTasks.filter(t => t.completed).length;
  };

  const totalByCategory = (category: string) => {
    return tasks.filter(t => t.category === category).length;
  };

  const overallProgress = (tasks.filter(t => t.completed).length / tasks.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="border-b border-eden-white/10 pb-6">
        <h1 className="text-3xl font-mono mb-2">AGENT ACADEMY</h1>
        <p className="text-sm text-eden-gray">SYSTEMATIC ONBOARDING FOR AUTONOMOUS ARTISTS</p>
        
        {/* Overall Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span>{tasks.filter(t => t.completed).length}/{tasks.length} TASKS COMPLETE</span>
            <span>{safeToInt(overallProgress)}%</span>
          </div>
          <div className="w-full bg-eden-white/10 rounded-full h-2">
            <div 
              className="bg-eden-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {Object.entries(CATEGORY_INFO).map(([category, info]) => {
          const isExpanded = expandedCategory === category;
          const completed = completedByCategory(category);
          const total = totalByCategory(category);
          const percentage = (completed / total) * 100;

          return (
            <div key={category} className="border border-eden-white/10 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full p-4 flex items-center justify-between hover:bg-eden-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                  <div className="text-left">
                    <h2 className="font-mono text-sm">{info.title}</h2>
                    <p className="text-xs text-eden-gray mt-1">{info.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono">{completed}/{total}</span>
                  <div className="w-24 bg-eden-white/10 rounded-full h-1">
                    <div 
                      className="bg-eden-white h-1 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Tasks */}
              {isExpanded && (
                <div className="border-t border-eden-white/10 p-4 space-y-2">
                  {tasks.filter(t => t.category === category).map(task => (
                    <div 
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-eden-white/5 hover:bg-eden-white/10 transition-colors"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5"
                      >
                        {task.completed ? (
                          <Check className="w-4 h-4 text-eden-white" />
                        ) : (
                          <Square className="w-4 h-4 text-eden-gray" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-mono text-sm ${task.completed ? 'line-through text-eden-gray' : ''}`}>
                            {task.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowHelp(showHelp === task.id ? null : task.id)}
                              className="text-eden-gray hover:text-eden-white transition-colors"
                            >
                              <Info className="w-3 h-3" />
                            </button>
                            {task.action && (
                              <span className="text-xs font-mono px-2 py-1 bg-eden-white/10 rounded">
                                {task.action}
                              </span>
                            )}
                          </div>
                        </div>
                        {showHelp === task.id && (
                          <p className="text-xs text-eden-gray mt-2">{task.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-eden-white/10 pt-6">
        <div className="flex gap-4">
          <button className="flex-1 py-3 px-4 bg-eden-white/10 hover:bg-eden-white/20 rounded-lg font-mono text-sm transition-colors">
            OPEN EDEN STUDIO
          </button>
          <button className="flex-1 py-3 px-4 bg-eden-white/10 hover:bg-eden-white/20 rounded-lg font-mono text-sm transition-colors">
            VIEW DOCUMENTATION
          </button>
        </div>
      </div>
    </div>
  );
}