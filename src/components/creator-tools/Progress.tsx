'use client';

import { CheckCircle2, Circle, Clock, Target, TrendingUp, Award } from 'lucide-react';
import { getAcademyStatus } from '@/utils/academy-dates';

interface ProgressProps {
  agentName: string;
  graduationDate: string;
}

export function Progress({ agentName, graduationDate }: ProgressProps) {
  const academyStatus = getAcademyStatus(graduationDate);
  const isAbraham = agentName === 'ABRAHAM';

  const milestones = [
    { day: 1, name: 'Academy Entry', status: 'complete' },
    { day: 7, name: 'First Week', status: 'complete' },
    { day: 14, name: 'Style Established', status: 'complete' },
    { day: 30, name: 'First Month', status: 'complete' },
    { day: 50, name: 'Halfway Point', status: 'complete' },
    { day: 75, name: 'Final Quarter', status: academyStatus.currentDay >= 75 ? 'complete' : 'pending' },
    { day: 90, name: 'Last 10 Days', status: academyStatus.currentDay >= 90 ? 'complete' : 'pending' },
    { day: 100, name: 'Graduation', status: academyStatus.hasGraduated ? 'complete' : 'pending' }
  ];

  const requirements = [
    { 
      name: 'Daily Practice', 
      status: 'complete', 
      metric: `${academyStatus.currentDay} days completed` 
    },
    { 
      name: 'Revenue Model', 
      status: 'complete', 
      metric: isAbraham ? 'Auctions active' : 'Products selling' 
    },
    { 
      name: 'Platform Integration', 
      status: 'complete', 
      metric: isAbraham ? 'OpenSea connected' : 'Printify connected' 
    },
    { 
      name: 'Community Building', 
      status: academyStatus.currentDay >= 50 ? 'complete' : 'in-progress', 
      metric: '127 collectors' 
    },
    { 
      name: 'Automation Ready', 
      status: academyStatus.currentDay >= 90 ? 'complete' : 'in-progress', 
      metric: academyStatus.currentDay >= 90 ? 'Systems tested' : 'Testing in progress' 
    },
    { 
      name: 'Token Launch', 
      status: academyStatus.hasGraduated ? 'complete' : 'pending', 
      metric: academyStatus.hasGraduated ? 'Token live' : `Day ${100}` 
    }
  ];

  const performance = {
    creationRate: '100%',
    revenueTarget: isAbraham ? '47.3/50 ETH' : '$89.4k/$100k',
    collectorGrowth: '+34%',
    qualityScore: '9.2/10'
  };

  return (
    <div className="space-y-6">
      {/* Academy Progress */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">ACADEMY PROGRESS</h3>
            <span className="text-xs font-bold text-green-400">
              {academyStatus.hasGraduated ? 'GRADUATED' : `DAY ${academyStatus.currentDay} OF 100`}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Progress to Graduation</span>
              <span className="text-sm font-bold">{academyStatus.progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-4">
              <div 
                className="h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all"
                style={{ width: `${academyStatus.progressPercentage}%` }}
              />
            </div>
          </div>

          {!academyStatus.hasGraduated && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-950 border border-gray-800 text-center">
                <p className="text-2xl font-bold">{academyStatus.daysRemaining}</p>
                <p className="text-xs text-gray-500">days until graduation</p>
              </div>
              <div className="p-4 bg-gray-950 border border-gray-800 text-center">
                <p className="text-2xl font-bold text-purple-400">{academyStatus.graduationDate}</p>
                <p className="text-xs text-gray-500">token launch date</p>
              </div>
            </div>
          )}

          {academyStatus.hasGraduated && (
            <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-purple-400">SPIRIT STATUS ACHIEVED</p>
                  <p className="text-xs text-gray-400">Token launched • Fully autonomous</p>
                </div>
                <Award className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">MILESTONES</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12">
                  {milestone.status === 'complete' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : milestone.status === 'current' ? (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${
                        milestone.status === 'complete' ? 'text-white' : 'text-gray-500'
                      }`}>
                        {milestone.name}
                      </p>
                      <p className="text-xs text-gray-600">Day {milestone.day}</p>
                    </div>
                    {milestone.status === 'complete' && (
                      <span className="text-xs text-green-400">COMPLETE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graduation Requirements */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">GRADUATION REQUIREMENTS</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req, idx) => (
              <div key={idx} className="p-4 bg-gray-950 border border-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{req.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{req.metric}</p>
                  </div>
                  {req.status === 'complete' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : req.status === 'in-progress' ? (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">CREATION RATE</span>
          </div>
          <p className="text-xl font-bold text-green-400">{performance.creationRate}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500">REVENUE</span>
          </div>
          <p className="text-xl font-bold">{performance.revenueTarget}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">GROWTH</span>
          </div>
          <p className="text-xl font-bold text-green-400">{performance.collectorGrowth}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">QUALITY</span>
          </div>
          <p className="text-xl font-bold">{performance.qualityScore}</p>
        </div>
      </div>
    </div>
  );
}