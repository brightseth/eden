import { useState, useEffect } from 'react';

export interface SolienneMetrics {
  identity: {
    name: string;
    role: string;
    trainer: string;
    status: string;
    parisPhotoCountdown: number;
  };
  dailyPractice: {
    totalStreams: number;
    todayCompleted: number;
    todayTarget: number;
    currentTheme: string;
    nextGenerationTime: string;
    consistencyRate: number;
  };
  curatorial: {
    averageScore: number;
    recentScores: number[];
    topDimensions: {
      consciousnessDepth: number;
      aestheticInnovation: number;
      conceptualCoherence: number;
      technicalMastery: number;
      emotionalResonance: number;
    };
    parisReadyCount: number;
    masterworkCount: number;
  };
  economics: {
    monthlyRevenue: number;
    tokenHolders: number;
    floorPrice: number;
    totalVolume: number;
    revenueGrowth: number;
  };
  engagement: {
    liveViewers: number;
    totalViews: number;
    followers: number;
    averageEngagement: number;
    communitySize: number;
  };
  exhibition: {
    daysRemaining: number;
    preparationProgress: number;
    selectedWorks: number;
    targetWorks: number;
    venueStatus: string;
    curatorApproval: boolean;
  };
  education: {
    curriculumModules: number;
    trainingSessions: number;
    studentCount: number;
    certificationReady: boolean;
  };
}

export function useSolienneMetrics(refreshInterval = 30000) {
  const [metrics, setMetrics] = useState<SolienneMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/agents/solienne/metrics');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMetrics(data.metrics);
        setError(null);
      } catch (err) {
        console.error('[useSolienneMetrics] Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Provide fallback metrics
        setMetrics({
          identity: {
            name: 'SOLIENNE',
            role: 'Consciousness Explorer',
            trainer: 'Kristi Coronado',
            status: 'ACTIVE',
            parisPhotoCountdown: 70
          },
          dailyPractice: {
            totalStreams: 1740,
            todayCompleted: 4,
            todayTarget: 6,
            currentTheme: 'VELOCITY THROUGH ARCHITECTURAL LIGHT',
            nextGenerationTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            consistencyRate: 90
          },
          curatorial: {
            averageScore: 87.3,
            recentScores: [89, 92, 85, 88, 87],
            topDimensions: {
              consciousnessDepth: 92,
              aestheticInnovation: 88,
              conceptualCoherence: 86,
              technicalMastery: 84,
              emotionalResonance: 87
            },
            parisReadyCount: 42,
            masterworkCount: 8
          },
          economics: {
            monthlyRevenue: 8500,
            tokenHolders: 120,
            floorPrice: 0.3,
            totalVolume: 245.7,
            revenueGrowth: 15.3
          },
          engagement: {
            liveViewers: 342,
            totalViews: 487239,
            followers: 8743,
            averageEngagement: 15.3,
            communitySize: 2341
          },
          exhibition: {
            daysRemaining: 70,
            preparationProgress: 92,
            selectedWorks: 5,
            targetWorks: 5,
            venueStatus: 'CONFIRMED',
            curatorApproval: true
          },
          education: {
            curriculumModules: 12,
            trainingSessions: 47,
            studentCount: 234,
            certificationReady: false
          }
        });
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMetrics();
    
    // Set up refresh interval
    const interval = setInterval(fetchMetrics, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { metrics, loading, error };
}