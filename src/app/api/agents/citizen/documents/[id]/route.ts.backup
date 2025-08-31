import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk/registry-api';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Retrieve individual documents via Registry Creation system
// Following Registry-as-Protocol pattern (ADR-022)
// Fallback to local filesystem when Registry unavailable

const DOCS_DIR = join(process.cwd(), 'data', 'citizen-documents');

interface DocumentMetadata {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  contentType: string;
  accessLevel: 'public' | 'internal';
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
  const { id } = params;

    if (!id) {
  const params = await props.params;
  return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    let document: any = null;
    let content = '';
    let source = 'registry';

    try {
      // Try Registry first
      const citizen = await registryApi.getAgent('citizen');
      
      // Get all creations and find the document
      const creations = await registryApi.getAgentCreations(citizen.id!);
      document = creations.find(c => 
        c.id === id && c.metadata?.type === 'document'
      );

      if (document) {
        // Decode content from base64 data URI
        if (document.mediaUri?.startsWith('data:text/markdown;base64,')) {
          const base64Content = document.mediaUri.replace('data:text/markdown;base64,', '');
          content = Buffer.from(base64Content, 'base64').toString('utf-8');
        }
      }
    } catch (registryError) {
      console.warn('Registry unavailable, using fallback storage:', registryError);
      source = 'fallback';
      
      // Fallback to local storage
      const metadataPath = join(DOCS_DIR, `${id}.meta.json`);
      const contentPath = join(DOCS_DIR, `${id}.md`);
      
      if (existsSync(metadataPath) && existsSync(contentPath)) {
        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8')) as DocumentMetadata;
        content = readFileSync(contentPath, 'utf-8');
        
        document = {
          id: metadata.id,
          title: metadata.title,
          status: metadata.status,
          metadata: {
            description: metadata.description,
            tags: metadata.tags,
            contentType: metadata.contentType,
            accessLevel: metadata.accessLevel
          },
          createdAt: metadata.createdAt,
          updatedAt: metadata.updatedAt
        };
      }
    }

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check access level
    const isPublic = document.status === 'PUBLISHED' && 
                    document.metadata?.accessLevel === 'public';
    
    if (!isPublic) {
      // For now, allow internal access. In future, add authentication check
      console.log('Serving internal document:', id);
    }

    // Get Accept header to determine response format
    const acceptHeader = request.headers.get('accept') || '';
    
    if (acceptHeader.includes('text/markdown') || acceptHeader.includes('text/plain')) {
      // Return raw markdown
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        }
      });
    }

    // Return JSON metadata with content
    return NextResponse.json({
      success: true,
      source,
      document: {
        id: document.id,
        title: document.title,
        content,
        status: document.status,
        description: document.metadata?.description,
        tags: document.metadata?.tags || [],
        contentType: document.metadata?.contentType || 'text/markdown',
        accessLevel: document.metadata?.accessLevel || 'internal',
        publicUrl: `${request.nextUrl.origin}/api/agents/citizen/documents/${document.id}`,
        registryUrl: source === 'registry' ? 
          `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/v1/agents/citizen/creations/${document.id}` : 
          null,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    console.error('Error retrieving document:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve document' },
      { status: 500 }
    );
  }
}