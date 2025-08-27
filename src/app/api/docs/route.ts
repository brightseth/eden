import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * OpenAPI documentation endpoint
 * Returns the OpenAPI specification in JSON format
 */
export async function GET() {
  try {
    const openApiPath = path.join(process.cwd(), 'docs', 'api', 'openapi.yaml');
    
    if (!fs.existsSync(openApiPath)) {
      return NextResponse.json(
        { error: 'OpenAPI specification not found' },
        { status: 404 }
      );
    }

    const yamlContent = fs.readFileSync(openApiPath, 'utf8');
    const openApiSpec = yaml.load(yamlContent);

    return NextResponse.json(openApiSpec, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error loading OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'Failed to load OpenAPI specification' },
      { status: 500 }
    );
  }
}