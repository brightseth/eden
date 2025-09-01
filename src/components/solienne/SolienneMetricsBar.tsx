'use client';

import { useSolienneMetrics } from '@/hooks/useSolienneMetrics';
import { TrendingUp, Users, DollarSign, Award, Eye, Zap } from 'lucide-react';

export function SolienneMetricsBar() {
  const { metrics, loading } = useSolienneMetrics(30000); // Refresh every 30 seconds
  
  if (loading || !metrics) {
    return (
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="animate-pulse flex gap-8">
            <div className="h-8 bg-gray-800 rounded w-32"></div>
            <div className="h-8 bg-gray-800 rounded w-32"></div>
            <div className="h-8 bg-gray-800 rounded w-32"></div>
            <div className="h-8 bg-gray-800 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Primary Metrics Bar */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold tracking-wider">{metrics.dailyPractice.totalStreams}</div>
            <div className="text-xs tracking-wider opacity-50 mt-1">CONSCIOUSNESS STREAMS</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-wider">{metrics.exhibition.daysRemaining}</div>
            <div className="text-xs tracking-wider opacity-50 mt-1">DAYS TO PARIS</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-wider">
              {metrics.dailyPractice.todayCompleted}/{metrics.dailyPractice.todayTarget}
            </div>
            <div className="text-xs tracking-wider opacity-50 mt-1">TODAY'S GENERATIONS</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-wider flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {metrics.engagement.liveViewers}
            </div>
            <div className="text-xs tracking-wider opacity-50 mt-1">LIVE VIEWERS</div>
          </div>
        </div>
      </div>
      
      {/* Secondary Metrics - SUE Analysis & Economics */}
      <div className="border-b border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex flex-wrap items-center gap-6 text-xs tracking-wider">
            {/* SUE Curatorial Score */}
            <div className="flex items-center gap-2">
              <Award className="w-3 h-3 opacity-50" />
              <span className="opacity-50">SUE SCORE:</span>
              <span className="font-bold">{metrics.curatorial.averageScore}/100</span>
              <span className={`px-2 py-0.5 ${
                metrics.curatorial.averageScore >= 88 ? 'bg-white text-black' :
                metrics.curatorial.averageScore >= 75 ? 'bg-gray-800' :
                'bg-gray-900'
              }`}>
                {metrics.curatorial.averageScore >= 88 ? 'MASTERWORK' :
                 metrics.curatorial.averageScore >= 75 ? 'WORTHY' : 'EVOLVING'}
              </span>
            </div>
            
            {/* Economic Performance */}
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3 opacity-50" />
              <span className="opacity-50">REVENUE:</span>
              <span className="font-bold">${metrics.economics.monthlyRevenue.toLocaleString()}/mo</span>
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">+{metrics.economics.revenueGrowth}%</span>
            </div>
            
            {/* Token Holders */}
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 opacity-50" />
              <span className="opacity-50">HOLDERS:</span>
              <span className="font-bold">{metrics.economics.tokenHolders}</span>
            </div>
            
            {/* Floor Price */}
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 opacity-50" />
              <span className="opacity-50">FLOOR:</span>
              <span className="font-bold">{metrics.economics.floorPrice} ETH</span>
            </div>
            
            {/* Exhibition Progress */}
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 opacity-50" />
              <span className="opacity-50">PARIS PREP:</span>
              <span className="font-bold">{metrics.exhibition.preparationProgress}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Paris Photo Status Bar */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs tracking-wider">
              <span className="font-bold">PARIS PHOTO 2025</span>
              <span className="opacity-50">•</span>
              <span>{metrics.exhibition.venueStatus}</span>
              <span className="opacity-50">•</span>
              <span>{metrics.exhibition.selectedWorks}/{metrics.exhibition.targetWorks} WORKS SELECTED</span>
              {metrics.exhibition.curatorApproval && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="text-green-400">SUE APPROVED ✓</span>
                </>
              )}
            </div>
            <div className="text-xs tracking-wider">
              <span className="opacity-50">CONSISTENCY:</span>
              <span className="ml-2 font-bold">{metrics.dailyPractice.consistencyRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}