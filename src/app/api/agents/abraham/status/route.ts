import { NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';
import { featureFlags, FLAGS } from '@/config/flags';

// Calculate time until next creation (midnight UTC)
function calculateTimeUntilNext(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  
  if (diff <= 0) {
    return '00:00:00';
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Calculate current work number
function getCurrentWorkNumber(): number {
  const covenantStartDate = new Date('2025-10-19');
  const today = new Date();
  
  if (today < covenantStartDate) {
    return 2519; // Still on early works
  }
  
  const diffTime = today.getTime() - covenantStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return 2519 + Math.max(0, diffDays + 1);
}

export async function GET() {
  const useRegistry = featureFlags.isEnabled(FLAGS.ENABLE_ABRAHAM_REGISTRY_INTEGRATION);
  
  const currentWorkNumber = getCurrentWorkNumber();
  const timeUntilNext = calculateTimeUntilNext();
  const covenantStartDate = new Date('2025-10-19');
  const today = new Date();
  const isCovenantActive = today >= covenantStartDate;
  
  // Default status data
  let statusData = {
    currentWork: {
      number: currentWorkNumber,
      title: `Knowledge Synthesis #${currentWorkNumber}`,
      status: isCovenantActive ? 'creating' : 'preparing',
      phase: isCovenantActive ? 'covenant' : 'early-works'
    },
    nextWork: {
      number: currentWorkNumber + 1,
      title: `Knowledge Synthesis #${currentWorkNumber + 1}`,
      timeUntil: timeUntilNext,
      status: 'scheduled'
    },
    liveMetrics: {
      viewers: Math.floor(Math.random() * 200) + 800, // 800-1000 range
      todayViews: Math.floor(Math.random() * 1000) + 2000,
      recentCollections: Math.floor(Math.random() * 5) + 2
    },
    covenant: {
      active: isCovenantActive,
      phase: !isCovenantActive ? 'launching' : 'active',
      dailyCommitment: 'Knowledge synthesis and collective intelligence documentation'
    }
  };

  if (useRegistry) {
    try {
      console.log('[Abraham Status API] Using Registry integration');
      
      // Get Abraham's latest creations from Registry
      const creations = await registryApi.getAgentCreations('abraham', 'PUBLISHED');
      
      if (creations && creations.length > 0) {
        // Sort by creation date to get the latest
        const sortedCreations = creations.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        
        const latestCreation = sortedCreations[0];
        
        // Update current work based on Registry data
        if (latestCreation) {
          statusData.currentWork = {
            number: latestCreation.metadata?.dayNumber || currentWorkNumber,
            title: latestCreation.title || statusData.currentWork.title,
            status: latestCreation.status === 'PUBLISHED' ? 'completed' : 'creating',
            phase: (latestCreation.metadata?.dayNumber && latestCreation.metadata.dayNumber > 2519) ? 'covenant' : 'early-works'
          };
        }
        
        // Calculate aggregate metrics from Registry
        const totalViews = creations.reduce((acc, creation) => 
          acc + (creation.metadata?.views || 0), 0
        );
        const avgViews = Math.floor(totalViews / Math.max(1, creations.length));
        
        statusData.liveMetrics = {
          viewers: Math.floor(Math.random() * 200) + 800,
          todayViews: avgViews,
          recentCollections: creations.filter(c => 
            c.metadata?.collected && 
            new Date(c.createdAt || '').getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
          ).length
        };
      }
      
    } catch (error) {
      console.error('[Abraham Status API] Registry fetch failed, using defaults:', error);
    }
  }

  return NextResponse.json({
    ...statusData,
    timestamp: new Date().toISOString(),
    source: useRegistry ? 'registry' : 'calculated'
  });
}