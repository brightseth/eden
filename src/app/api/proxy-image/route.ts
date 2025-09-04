import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Decode the URL
    const decodedUrl = decodeURIComponent(imageUrl);
    
    // Validate it's a Supabase URL we trust
    if (!decodedUrl.includes('ctlygyrkibupejllgglr.supabase.co')) {
      return NextResponse.json({ error: 'Invalid URL domain' }, { status: 400 });
    }

    console.log('Proxying image:', decodedUrl);

    // Fetch the image from Supabase
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Eden-Academy/1.0)',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch image',
        status: response.status,
        statusText: response.statusText,
        url: decodedUrl
      }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ 
      error: 'Proxy failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}