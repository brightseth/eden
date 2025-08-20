'use client';

import { useState } from 'react';
import { GraduationCap, CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';

interface GraduationStatusProps {
  agentName: string;
  graduationDate: string;
}

export function GraduationStatus({ agentName, graduationDate }: GraduationStatusProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  // Calculate days until graduation
  const daysUntil = Math.ceil((new Date(graduationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.max(0, 95); // Sample: Day 95/100

  const milestones = [
    {
      id: 'identity',
      title: 'Identity & Vision',
      status: 'completed',
      completedDate: '2025-07-29',
      requirements: [
        { task: 'Core values defined', completed: true },
        { task: 'Mission statement created', completed: true },
        { task: 'Brand identity established', completed: true },
        { task: 'Visual style guide', completed: true }
      ]
    },
    {
      id: 'training',
      title: 'Model Training',
      status: 'completed',
      completedDate: '2025-09-02',
      requirements: [
        { task: 'LoRA training completed', completed: true },
        { task: 'Style consistency verified', completed: true },
        { task: 'Quality benchmarks met', completed: true },
        { task: 'Test generations approved', completed: true }
      ]
    },
    {
      id: 'infrastructure',
      title: 'Technical Infrastructure',
      status: 'in-progress',
      completedDate: null,
      requirements: [
        { task: 'Smart contract development', completed: true },
        { task: 'Security audit', completed: false },
        { task: 'Platform integration', completed: true },
        { task: 'Automation setup', completed: false }
      ]
    },
    {
      id: 'launch-prep',
      title: 'Launch Preparation',
      status: 'pending',
      completedDate: null,
      requirements: [
        { task: 'Marketing materials', completed: false },
        { task: 'Community setup', completed: false },
        { task: 'Launch announcement', completed: false },
        { task: 'First auction preparation', completed: false }
      ]
    }
  ];

  const graduationRequirements = [
    { category: 'Technical', items: ['Smart contract deployed', 'Audit completed', 'Platform live'], progress: '2/3' },
    { category: 'Creative', items: ['Style locked', 'Quality standards', 'Test creations'], progress: '3/3' },
    { category: 'Business', items: ['Revenue model', 'Marketing plan', 'Community'], progress: '1/3' },
    { category: 'Operational', items: ['Daily automation', 'Monitoring', 'Backup systems'], progress: '1/3' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'in-progress':
        return 'text-yellow-400';
      case 'pending':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500 uppercase">Progress</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{progressPercentage}%</div>
          <div className="text-xs text-gray-500">Day 95/100</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase">Days Until</span>
          </div>
          <div className="text-2xl font-bold">{daysUntil}</div>
          <div className="text-xs text-gray-500">graduation</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500 uppercase">Completed</span>
          </div>
          <div className="text-2xl font-bold">2/4</div>
          <div className="text-xs text-gray-500">milestones</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-500 uppercase">Blockers</span>
          </div>
          <div className="text-2xl font-bold">2</div>
          <div className="text-xs text-gray-500">pending items</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">ACADEMY PROGRESS</h3>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Overall Completion</span>
            <span className="text-sm font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Start</span>
            <span>Graduation: {graduationDate}</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">GRADUATION MILESTONES</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedMilestone(
                  selectedMilestone === milestone.id ? null : milestone.id
                )}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(milestone.status)}
                  <div>
                    <div className="text-sm font-medium">{milestone.title}</div>
                    <div className={`text-xs ${getStatusColor(milestone.status)}`}>
                      {milestone.status === 'completed' 
                        ? `Completed ${milestone.completedDate}` 
                        : milestone.status.replace('-', ' ').toUpperCase()
                      }
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {milestone.requirements.filter(r => r.completed).length}/{milestone.requirements.length}
                </div>
              </div>

              {selectedMilestone === milestone.id && (
                <div className="mt-4 pl-7 space-y-2">
                  {milestone.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {req.completed ? (
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-600" />
                      )}
                      <span className={req.completed ? 'text-gray-400' : 'text-white'}>
                        {req.task}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Graduation Requirements */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">GRADUATION REQUIREMENTS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {graduationRequirements.map((req, idx) => (
            <div key={idx} className="border border-gray-900 p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">{req.category}</span>
                <span className="text-xs text-gray-500">{req.progress}</span>
              </div>
              <div className="space-y-1">
                {req.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="text-xs text-gray-400">• {item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-4 border border-gray-800 hover:border-yellow-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">REVIEW BLOCKERS</div>
          <div className="text-xs text-gray-500">Address pending requirements for graduation</div>
        </button>
        
        <button className="p-4 border border-gray-800 hover:border-green-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">GRADUATION CHECKLIST</div>
          <div className="text-xs text-gray-500">View detailed requirements and timeline</div>
        </button>
      </div>
    </div>
  );
}