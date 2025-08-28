import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk/registry-api';
import { randomUUID } from 'crypto';
import { writeFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Store and retrieve documents via Registry Creation system
// Following Registry-as-Protocol pattern (ADR-022)
// Fallback to local filesystem when Registry unavailable

const DOCS_DIR = join(process.cwd(), 'data', 'citizen-documents');

// Ensure docs directory exists
if (!existsSync(DOCS_DIR)) {
  mkdirSync(DOCS_DIR, { recursive: true });
}

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, description, tags = [], isPublic = true } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const docId = randomUUID();
    const now = new Date().toISOString();
    
    const metadata: DocumentMetadata = {
      id: docId,
      title,
      description,
      tags,
      contentType: 'text/markdown',
      accessLevel: isPublic ? 'public' : 'internal',
      status: isPublic ? 'PUBLISHED' : 'DRAFT',
      createdAt: now,
      updatedAt: now
    };

    try {
      // Try Registry first
      const citizen = await registryApi.getAgent('citizen');
      
      // Create document as a CITIZEN creation in Registry
      const document = await registryApi.createAgentCreation(citizen.id!, {
        title,
        mediaUri: `data:text/markdown;base64,${Buffer.from(content).toString('base64')}`,
        status: isPublic ? 'PUBLISHED' : 'DRAFT',
        metadata: {
          type: 'document',
          description,
          tags,
          contentType: 'text/markdown',
          createdFor: 'brightmoments-team-overview',
          accessLevel: isPublic ? 'public' : 'internal'
        }
      });

      return NextResponse.json({
        success: true,
        source: 'registry',
        document: {
          id: document.id,
          title: document.title,
          status: document.status,
          publicUrl: `${request.nextUrl.origin}/api/agents/citizen/documents/${document.id}`,
          registryUrl: `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/v1/agents/${citizen.id}/creations/${document.id}`,
          createdAt: document.createdAt
        }
      });
    } catch (registryError) {
      console.warn('Registry unavailable, using fallback storage:', registryError);
      
      // Fallback to local storage
      const metadataPath = join(DOCS_DIR, `${docId}.meta.json`);
      const contentPath = join(DOCS_DIR, `${docId}.md`);
      
      writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      writeFileSync(contentPath, content);
      
      return NextResponse.json({
        success: true,
        source: 'fallback',
        document: {
          id: docId,
          title: metadata.title,
          status: metadata.status,
          publicUrl: `${request.nextUrl.origin}/api/agents/citizen/documents/${docId}`,
          registryUrl: null, // Not available in fallback
          createdAt: metadata.createdAt
        }
      });
    }
  } catch (error) {
    console.error('Error storing document:', error);
    return NextResponse.json(
      { error: 'Failed to store document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    try {
      // Try Registry first
      const citizen = await registryApi.getAgent('citizen');
      
      // Get all document-type creations
      const creations = await registryApi.getAgentCreations(citizen.id!);
      const documents = creations
        .filter(c => c.metadata?.type === 'document')
        .map(doc => ({
          id: doc.id,
          title: doc.title,
          status: doc.status,
          description: doc.metadata?.description,
          tags: doc.metadata?.tags || [],
          publicUrl: `${request.nextUrl.origin}/api/agents/citizen/documents/${doc.id}`,
          registryUrl: `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/v1/agents/${citizen.id}/creations/${doc.id}`,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        }));

      return NextResponse.json({
        success: true,
        source: 'registry',
        documents,
        count: documents.length
      });
    } catch (registryError) {
      console.warn('Registry unavailable, using fallback storage:', registryError);
      
      // Fallback to local storage
      if (!existsSync(DOCS_DIR)) {
        return NextResponse.json({
          success: true,
          source: 'fallback',
          documents: [],
          count: 0
        });
      }
      
      const files = readdirSync(DOCS_DIR);
      const metaFiles = files.filter(f => f.endsWith('.meta.json'));
      
      const documents = metaFiles.map(metaFile => {
        const metadataPath = join(DOCS_DIR, metaFile);
        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8')) as DocumentMetadata;
        
        return {
          id: metadata.id,
          title: metadata.title,
          status: metadata.status,
          description: metadata.description,
          tags: metadata.tags,
          publicUrl: `${request.nextUrl.origin}/api/agents/citizen/documents/${metadata.id}`,
          registryUrl: null,
          createdAt: metadata.createdAt,
          updatedAt: metadata.updatedAt
        };
      });

      return NextResponse.json({
        success: true,
        source: 'fallback',
        documents,
        count: documents.length
      });
    }
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve documents' },
      { status: 500 }
    );
  }
}