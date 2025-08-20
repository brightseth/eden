'use client';

import { Activity, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

interface OperationsProps {
  agentName: string;
  graduationDate: string;
}

export function Operations({ agentName }: OperationsProps) {
  const isAbraham = agentName === 'ABRAHAM';
  const currentDay = new Date().getDay();
  const isSunday = currentDay === 0;

  const systemHealth = {
    automation: isAbraham && isSunday ? 'paused' : 'active',
    apiStatus: 'operational',
    lastCreation: '2 hours ago',
    nextCreation: isAbraham && isSunday ? 'Monday 12:00 AM UTC' : '12:00 UTC',
    uptime: '99.97%'
  };

  const dailyPractice = {
    streak: isAbraham ? 95 : 88,
    todayStatus: isAbraham && isSunday ? 'rest_day' : 'completed',
    platform: isAbraham ? 'OpenSea' : 'Printify',
    schedule: isAbraham ? '6 days/week' : '7 days/week'
  };

  return (
    <div className="space-y-6">
      {/* System Health */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">SYSTEM HEALTH</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">AUTOMATION</p>
              <div className="flex items-center gap-2">
                {systemHealth.automation === 'active' ? (
                  <Activity className="w-4 h-4 text-green-400" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-400" />
                )}
                <span className={`text-sm font-bold ${
                  systemHealth.automation === 'active' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {systemHealth.automation.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">API STATUS</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-green-400">OPERATIONAL</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">LAST CREATION</p>
              <p className="text-sm font-bold">{systemHealth.lastCreation}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">NEXT CREATION</p>
              <p className="text-sm font-bold">{systemHealth.nextCreation}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">UPTIME</p>
              <p className="text-sm font-bold text-blue-400">{systemHealth.uptime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Practice Tracker */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">DAILY PRACTICE</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">CURRENT STREAK</p>
                  <p className="text-3xl font-bold text-orange-400">{dailyPractice.streak} DAYS</p>
                </div>
                <Zap className="w-8 h-8 text-orange-400" />
              </div>
              
              <div className="space-y-2 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Schedule</span>
                  <span>{dailyPractice.schedule}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform</span>
                  <span>{dailyPractice.platform}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Today\'s Status</span>
                  <span className={`font-bold ${
                    dailyPractice.todayStatus === 'completed' ? 'text-green-400' :
                    dailyPractice.todayStatus === 'rest_day' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {dailyPractice.todayStatus === 'rest_day' ? 'SABBATH' : 'COMPLETED'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-3">WEEK VIEW</p>
              <div className="grid grid-cols-7 gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-xs text-gray-500 mb-2">{day}</p>
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                      isAbraham && idx === 6 ? 'bg-gray-800' :
                      idx < 5 ? 'bg-green-400' : 'bg-gray-800'
                    }`}>
                      {isAbraham && idx === 6 ? (
                        <span className="text-xs">🕊️</span>
                      ) : idx < 5 ? (
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gray-950 border border-gray-800">
                <p className="text-xs text-gray-400">
                  {isAbraham 
                    ? "Abraham observes sabbath on Sundays. No creations are minted on this day."
                    : "Solienne creates daily without breaks. Physical products ship via Printify."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">AUTOMATION CONFIG</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-950 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">AUTO-CREATE</span>
                <div className="w-8 h-4 bg-green-400 rounded-full relative">
                  <div className="absolute right-0 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <p className="text-xs text-gray-400">Autonomous daily creation enabled</p>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">AUTO-LIST</span>
                <div className="w-8 h-4 bg-green-400 rounded-full relative">
                  <div className="absolute right-0 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <p className="text-xs text-gray-400">Automatic marketplace listing</p>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">REVENUE DISTRIBUTION</span>
                <div className="w-8 h-4 bg-green-400 rounded-full relative">
                  <div className="absolute right-0 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <p className="text-xs text-gray-400">Auto-distribute to token holders</p>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">ALERTS</span>
                <div className="w-8 h-4 bg-green-400 rounded-full relative">
                  <div className="absolute right-0 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <p className="text-xs text-gray-400">System notifications enabled</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-yellow-400/10 border border-yellow-400/30">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-yellow-400">
              Full automation activates on Day 100 when {agentName} becomes a Spirit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}