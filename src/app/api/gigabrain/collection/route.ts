import { NextResponse } from 'next/server';

// Gigabrain Collection API - Fetches diagrams and visual content from Eden collections
// Allows the CEO dashboard to display Gigabrain's visual outputs

interface CollectionItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  metadata?: {
    type: 'diagram' | 'chart' | 'mindmap' | 'flowchart' | 'architecture';
    tags?: string[];
    prompt?: string;
  };
}

interface CollectionResponse {
  id: string;
  name: string;
  description?: string;
  items: CollectionItem[];
  totalItems: number;
  createdBy?: string;
}

const EDEN_API_BASE = process.env.EDEN_API_URL || 'https://api.eden.art';
const EDEN_API_KEY = process.env.EDEN_API_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId') || '68b47985d10d4706ff134ed2'; // Default to your collection
    const limit = searchParams.get('limit') || '20';
    
    // Fetch collection from Eden API
    const edenResponse = await fetch(`${EDEN_API_BASE}/collections/${collectionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${EDEN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!edenResponse.ok) {
      // Return sample collection data as fallback
      return NextResponse.json(getSampleCollection(collectionId));
    }

    const edenData = await edenResponse.json();
    
    // Transform Eden collection data to our format
    const collection = transformEdenCollection(edenData);
    
    return NextResponse.json(collection);
    
  } catch (error) {
    console.error('Error fetching collection:', error);
    
    // Return sample collection as fallback
    return NextResponse.json(getSampleCollection('68b47985d10d4706ff134ed2'));
  }
}

function transformEdenCollection(edenData: any): CollectionResponse {
  // Transform Eden's collection format to our standardized format
  const items: CollectionItem[] = [];
  
  if (edenData.creations && Array.isArray(edenData.creations)) {
    edenData.creations.forEach((creation: any) => {
      items.push({
        id: creation._id || creation.id,
        title: creation.name || creation.prompt || 'Untitled',
        description: creation.description || creation.prompt,
        imageUrl: creation.uri || creation.imageUrl,
        thumbnailUrl: creation.thumbnailUrl || creation.uri,
        createdAt: creation.createdAt || new Date().toISOString(),
        metadata: {
          type: detectDiagramType(creation.prompt || creation.name || ''),
          tags: creation.tags || extractTags(creation.prompt || ''),
          prompt: creation.prompt
        }
      });
    });
  }
  
  return {
    id: edenData._id || edenData.id,
    name: edenData.name || 'Gigabrain Diagrams',
    description: edenData.description || 'Visual knowledge representations and system architectures',
    items: items,
    totalItems: items.length,
    createdBy: edenData.user?.username || 'Gigabrain'
  };
}

function detectDiagramType(text: string): 'diagram' | 'chart' | 'mindmap' | 'flowchart' | 'architecture' {
  const lowercased = text.toLowerCase();
  
  if (lowercased.includes('architecture') || lowercased.includes('system')) {
    return 'architecture';
  } else if (lowercased.includes('flow') || lowercased.includes('process')) {
    return 'flowchart';
  } else if (lowercased.includes('mind') || lowercased.includes('concept')) {
    return 'mindmap';
  } else if (lowercased.includes('chart') || lowercased.includes('graph')) {
    return 'chart';
  }
  
  return 'diagram';
}

function extractTags(prompt: string): string[] {
  const tags: string[] = [];
  
  // Extract common keywords as tags
  const keywords = ['training', 'agent', 'memory', 'trait', 'curriculum', 'pattern', 'architecture', 'system'];
  keywords.forEach(keyword => {
    if (prompt.toLowerCase().includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  return tags;
}

function getSampleCollection(collectionId: string): CollectionResponse {
  // Sample collection data for demonstration/fallback
  return {
    id: collectionId,
    name: 'Gigabrain Training System Diagrams',
    description: 'Visual representations of agent training patterns, architectures, and workflows',
    items: [
      {
        id: 'diagram_1',
        title: 'Agent Training Pipeline Architecture',
        description: 'Complete overview of the 8-day accelerated training framework',
        imageUrl: 'https://staging.app.eden.art/api/media/placeholder_architecture.png',
        thumbnailUrl: 'https://staging.app.eden.art/api/media/placeholder_architecture_thumb.png',
        createdAt: new Date().toISOString(),
        metadata: {
          type: 'architecture',
          tags: ['training', 'pipeline', 'system'],
          prompt: 'Eden Academy agent training pipeline showing phases from personality calibration through production validation'
        }
      },
      {
        id: 'diagram_2',
        title: 'Nested Token Economics Model',
        description: 'Visual representation of micro-economies within macro-economy',
        imageUrl: 'https://staging.app.eden.art/api/media/placeholder_token.png',
        thumbnailUrl: 'https://staging.app.eden.art/api/media/placeholder_token_thumb.png',
        createdAt: new Date().toISOString(),
        metadata: {
          type: 'flowchart',
          tags: ['token', 'economics', 'nested'],
          prompt: 'Nested token economics showing $SPIRIT network token containing individual agent tokens'
        }
      },
      {
        id: 'diagram_3',
        title: 'Memory Seeding Optimization Chart',
        description: '70% capacity sweet spot visualization',
        imageUrl: 'https://staging.app.eden.art/api/media/placeholder_memory.png',
        thumbnailUrl: 'https://staging.app.eden.art/api/media/placeholder_memory_thumb.png',
        createdAt: new Date().toISOString(),
        metadata: {
          type: 'chart',
          tags: ['memory', 'optimization', 'pattern'],
          prompt: 'Chart showing optimal memory seeding at 70% capacity with success rate correlation'
        }
      },
      {
        id: 'diagram_4',
        title: 'Trait Configuration Matrix',
        description: 'Optimal trait ranges for different agent types',
        imageUrl: 'https://staging.app.eden.art/api/media/placeholder_traits.png',
        thumbnailUrl: 'https://staging.app.eden.art/api/media/placeholder_traits_thumb.png',
        createdAt: new Date().toISOString(),
        metadata: {
          type: 'chart',
          tags: ['trait', 'configuration', 'agent'],
          prompt: 'Matrix showing optimal trait configurations for creative, analytical, and social agent types'
        }
      },
      {
        id: 'diagram_5',
        title: 'Curriculum Generation Flowchart',
        description: 'Automated curriculum generation decision tree',
        imageUrl: 'https://staging.app.eden.art/api/media/placeholder_curriculum.png',
        thumbnailUrl: 'https://staging.app.eden.art/api/media/placeholder_curriculum_thumb.png',
        createdAt: new Date().toISOString(),
        metadata: {
          type: 'flowchart',
          tags: ['curriculum', 'automation', 'training'],
          prompt: 'Decision tree for automated curriculum generation based on agent type and constraints'
        }
      }
    ],
    totalItems: 5,
    createdBy: 'Gigabrain'
  };
}

// POST endpoint to create/save new diagrams
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, type = 'diagram', collectionId } = body;
    
    // Generate diagram using Eden API
    const edenResponse = await fetch(`${EDEN_API_BASE}/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EDEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Create a clear ${type} diagram: ${prompt}`,
        generator: 'create',
        collectionId: collectionId || '68b47985d10d4706ff134ed2'
      })
    });

    if (!edenResponse.ok) {
      throw new Error('Failed to generate diagram');
    }

    const edenData = await edenResponse.json();
    
    return NextResponse.json({
      success: true,
      diagram: {
        id: edenData.id || edenData._id,
        title: prompt,
        imageUrl: edenData.uri || edenData.imageUrl,
        metadata: {
          type,
          prompt,
          createdAt: new Date().toISOString()
        }
      }
    });
    
  } catch (error) {
    console.error('Error creating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to create diagram' },
      { status: 500 }
    );
  }
}