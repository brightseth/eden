import { mockAbrahamWorks } from '@/data/abrahamData';

const EDEN_API_URL = process.env.NEXT_PUBLIC_EDEN_API_URL || 'https://api.eden.art';
const EDEN_API_KEY = process.env.NEXT_PUBLIC_EDEN_API_KEY || '';
const ABRAHAM_CREATOR_ID = '657926f90a0f725740a93b77';

export interface AbrahamCreation {
  id: string;
  uri: string;
  name: string;
  description?: string;
  createdAt: string;
  config?: {
    model?: string;
    [key: string]: any;
  };
  user?: {
    username?: string;
  };
  task?: {
    name?: string;
  };
}

export async function fetchAbrahamCreations(limit: number = 12, offset: number = 0): Promise<AbrahamCreation[]> {
  try {
    const response = await fetch(
      `${EDEN_API_URL}/creations?userId=${ABRAHAM_CREATOR_ID}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'X-Api-Key': EDEN_API_KEY,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch Abraham creations:', response.status);
      return getFallbackWorks(limit, offset);
    }

    const data = await response.json();
    
    // Filter for images only (Abraham focuses on visual art)
    const imageCreations = data.creations?.filter((creation: any) => {
      const outputUrl = creation.uri || '';
      return outputUrl.includes('.jpg') || 
             outputUrl.includes('.jpeg') || 
             outputUrl.includes('.png') || 
             outputUrl.includes('.gif') ||
             outputUrl.includes('.webp');
    }) || [];

    return imageCreations;
  } catch (error) {
    console.error('Error fetching Abraham creations:', error);
    return getFallbackWorks(limit, offset);
  }
}

export async function fetchAbrahamEarlyWorks(limit: number = 24, offset: number = 0): Promise<any[]> {
  try {
    // Early works are stored in our Supabase database (2,519 works from 2021)
    const response = await fetch(
      `/api/agents/abraham/works?limit=${limit}&offset=${offset}&sort=archive_number`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch Abraham early works from database:', response.status);
      return getFallbackEarlyWorks(limit, offset);
    }

    const data = await response.json();
    
    // Return the works from our database
    return data.works || [];
  } catch (error) {
    console.error('Error fetching Abraham early works:', error);
    return getFallbackEarlyWorks(limit, offset);
  }
}

export async function fetchLatestAbrahamCreation(): Promise<AbrahamCreation | null> {
  try {
    const creations = await fetchAbrahamCreations(1, 0);
    return creations[0] || null;
  } catch (error) {
    console.error('Error fetching latest Abraham creation:', error);
    return null;
  }
}

// Fallback functions using mock data
function getFallbackWorks(limit: number, offset: number): AbrahamCreation[] {
  console.log('Using fallback Abraham works data');
  return mockAbrahamWorks.slice(offset, offset + limit).map(work => ({
    id: work.id,
    uri: work.image,
    name: work.title,
    description: work.description,
    createdAt: work.date,
    config: {
      model: 'collective-synthesis'
    },
    user: {
      username: 'abraham'
    },
    task: {
      name: work.theme
    }
  }));
}

function getFallbackEarlyWorks(limit: number, offset: number): any[] {
  console.log('Using fallback Abraham early works data');
  const startIndex = 2522 - offset;
  
  return Array.from({ length: Math.min(limit, 2522 - offset) }, (_, i) => ({
    id: `early-${startIndex - i}`,
    agent_id: 'abraham',
    archive_type: 'early-works',
    title: `Early Work #${startIndex - i}`,
    image_url: `/abraham/early-works/${startIndex - i}.jpg`,
    archive_url: `/abraham/early-works/${startIndex - i}`,
    created_date: '2021-07-01',
    archive_number: startIndex - i,
    description: 'Community-generated collective intelligence synthesis from Summer 2021',
    metadata: {}
  }));
}

export async function fetchAbrahamStats() {
  try {
    const response = await fetch(
      `${EDEN_API_URL}/stats/user/${ABRAHAM_CREATOR_ID}`,
      {
        headers: {
          'X-Api-Key': EDEN_API_KEY,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Abraham stats');
    }

    const stats = await response.json();
    return {
      totalWorks: stats.totalCreations || 7270,
      earlyWorks: 2522,
      covenantWorks: stats.totalCreations - 2522 || 4748,
      dailyAverage: 1.4,
      lastCreated: stats.lastCreationDate || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Abraham stats:', error);
    return {
      totalWorks: 7270,
      earlyWorks: 2522,
      covenantWorks: 4748,
      dailyAverage: 1.4,
      lastCreated: new Date().toISOString()
    };
  }
}