import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/config/flags';
import { CreateCollectionSchema, CollectionSchema } from '@/lib/types/curation';

// Mock data for MVP - replace with database operations
const mockCollections = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Genesis Consciousness',
    description: 'First AI consciousness explorations from the Eden ecosystem',
    curatorAgent: 'sue',
    isPublic: true,
    tags: ['consciousness', 'ai-art', 'genesis'],
    workCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Collective Intelligence',
    description: 'Abraham\'s exploration of distributed cognition and group consciousness',
    curatorAgent: 'sue',
    isPublic: true,
    tags: ['collective', 'intelligence', 'abraham'],
    workCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Digital Soliloquies',
    description: 'Solienne\'s internal dialogues made visible',
    curatorAgent: 'nina',
    isPublic: true,
    tags: ['solienne', 'consciousness', 'digital-art'],
    workCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    // Check feature flag
    if (!FEATURE_FLAGS.ART_CURATION_SYSTEM_ENABLED) {
      return NextResponse.json({
        success: false,
        error: 'Art curation system is not enabled'
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const curator = searchParams.get('curator');
    const isPublic = searchParams.get('public') === 'true';
    const tags = searchParams.get('tags')?.split(',') || [];
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    // Filter collections based on parameters
    let filteredCollections = [...mockCollections];

    if (curator) {
      filteredCollections = filteredCollections.filter(c => c.curatorAgent === curator);
    }

    if (isPublic !== undefined) {
      filteredCollections = filteredCollections.filter(c => c.isPublic === isPublic);
    }

    if (tags.length > 0) {
      filteredCollections = filteredCollections.filter(c => 
        tags.some(tag => c.tags.includes(tag))
      );
    }

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCollections = filteredCollections.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      collections: paginatedCollections,
      meta: {
        total: filteredCollections.length,
        page,
        limit,
        totalPages: Math.ceil(filteredCollections.length / limit),
      }
    });

  } catch (error) {
    console.error('[API] Collections GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch collections'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check feature flag
    if (!FEATURE_FLAGS.ART_CURATION_SYSTEM_ENABLED || !FEATURE_FLAGS.COLLECTION_MANAGEMENT_ENABLED) {
      return NextResponse.json({
        success: false,
        error: 'Collection management is not enabled'
      }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = CreateCollectionSchema.parse(body);

    // In a real implementation, this would save to database
    const newCollection = {
      id: `550e8400-e29b-41d4-a716-${Date.now()}`,
      name: validatedData.name,
      description: validatedData.description || '',
      curatorAgent: validatedData.curatorAgent,
      isPublic: validatedData.isPublic || false,
      tags: validatedData.tags || [],
      workCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock collections for this session
    mockCollections.push(newCollection);

    return NextResponse.json({
      success: true,
      data: newCollection
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid collection data',
        details: error.errors
      }, { status: 400 });
    }

    console.error('[API] Collections POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create collection'
    }, { status: 500 });
  }
}