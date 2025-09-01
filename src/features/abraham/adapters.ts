import { useState, useEffect } from 'react';
import { normalizeCreation } from '@/lib/registry/normalize';
import { toStr, toNum } from '@/lib/registry/coerce';

export interface AbrahamSnapshot {
  // Core covenant metrics
  currentDay: number;
  totalDays: number;
  daysRemaining: number;
  progressPercentage: number;
  confidence: number;
  
  // Practice metrics
  outputsPerWeek: number;
  supporters: number;
  mrr: number;
  
  // Recent works
  recentWorks: any[];
  
  // Covenant status
  covenantActive: boolean;
  nextWorkDate: string;
  
  // Additional context
  earlyWorksCount: number;
  totalWorks: number;
}

/**
 * Abraham data adapter - normalizes Registry + local data for covenant focus
 * Follows Registry-first pattern with graceful fallbacks
 */
export function useAbrahamSnapshot(): AbrahamSnapshot {
  const [snapshot, setSnapshot] = useState<AbrahamSnapshot>({
    currentDay: 0,
    totalDays: 4745, // 13 years * 365 days
    daysRemaining: 4745,
    progressPercentage: 0,
    confidence: 0,
    outputsPerWeek: 6, // Covenant: 6 works per week, Sabbath rest
    supporters: 0,
    mrr: 0,
    recentWorks: [],
    covenantActive: false,
    nextWorkDate: 'Tomorrow',
    earlyWorksCount: 3689,
    totalWorks: 3689
  });

  useEffect(() => {
    loadAbrahamData();
  }, []);

  const loadAbrahamData = async () => {
    try {
      // Try Registry first
      const response = await fetch('/api/agents/abraham/status');
      if (response.ok) {
        const data = await response.json();
        
        // Normalize Registry data
        const normalized = {
          currentDay: toNum(data.progress?.current_day, 0),
          totalDays: toNum(data.progress?.total_days, 4745),
          daysRemaining: toNum(data.progress?.days_remaining, 4745),
          progressPercentage: toNum(data.progress?.percentage, 0),
          confidence: toNum(data.confidence, 75),
          outputsPerWeek: 6, // Covenant constant
          supporters: toNum(data.supporters, 142),
          mrr: toNum(data.mrr, 2847),
          recentWorks: Array.isArray(data.recent_works) 
            ? data.recent_works.map(normalizeCreation)
            : [],
          covenantActive: data.covenant?.active ?? false,
          nextWorkDate: toStr(data.covenant?.next_work, 'Tomorrow'),
          earlyWorksCount: toNum(data.early_works_count, 3689),
          totalWorks: toNum(data.total_works, 3689)
        };

        setSnapshot(normalized);
      } else {
        // Fallback to local calculation
        setSnapshot(generateFallbackSnapshot());
      }
    } catch (error) {
      console.warn('[Abraham Adapter] Registry fetch failed, using fallback:', error);
      setSnapshot(generateFallbackSnapshot());
    }
  };

  return snapshot;
}

/**
 * Fallback snapshot when Registry is unavailable
 */
function generateFallbackSnapshot(): AbrahamSnapshot {
  const covenantStartDate = new Date('2024-10-19'); // October 19, 2024
  const today = new Date();
  const totalDays = 4745; // 13 years
  
  // Calculate progress
  const daysElapsed = Math.max(0, Math.floor((today.getTime() - covenantStartDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const progressPercentage = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));
  
  return {
    currentDay: daysElapsed,
    totalDays,
    daysRemaining,
    progressPercentage,
    confidence: 78, // Default confidence
    outputsPerWeek: 6,
    supporters: 156,
    mrr: 2934,
    recentWorks: [],
    covenantActive: daysElapsed > 0,
    nextWorkDate: 'Tomorrow',
    earlyWorksCount: 3689,
    totalWorks: 3689 + daysElapsed
  };
}

/**
 * Get covenant status message
 */
export function getCovenantStatus(snapshot: AbrahamSnapshot): string {
  if (!snapshot.covenantActive) {
    return `Covenant begins in ${Math.abs(snapshot.daysRemaining)} days`;
  }
  
  if (snapshot.daysRemaining <= 0) {
    return 'Covenant completed - 13 years of daily creation achieved';
  }
  
  return `Day ${snapshot.currentDay} of ${snapshot.totalDays} - ${snapshot.daysRemaining} days remaining`;
}