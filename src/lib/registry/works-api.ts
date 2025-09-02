// Registry Works API with Signed URL Generation
// Implements keyset pagination and TTL-based caching

import { createClient } from '@supabase/supabase-js';
import { Prisma } from '@prisma/client';

type Cursor = {
  lastOrdinal: number;
  lastId: string;
};

type SignedURLCache = {
  url: string;
  expiresAt: number;
};

// In-memory cache for signed URLs (keyed by storage path)
const signedURLCache = new Map<string, SignedURLCache>();

// Supabase client for signing (Registry only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getAgentWorks(
  db: any,
  handle: string,
  params: {
    cursor?: string;
    limit?: number;
  }
) {
  const limit = Math.min(Math.max(params.limit || 60, 1), 200);
  
  // Decode opaque cursor
  const cursor: Cursor | null = params.cursor
    ? JSON.parse(Buffer.from(params.cursor, 'base64').toString())
    : null;

  // Build keyset pagination query
  const whereClause = cursor
    ? Prisma.sql`
        AND (ordinal < ${cursor.lastOrdinal} 
        OR (ordinal = ${cursor.lastOrdinal} AND work.id < ${cursor.lastId}::uuid))
      `
    : Prisma.empty;

  // Fetch one extra to determine if there's a next page
  const rows = await db.$queryRaw`
    SELECT 
      w.id,
      w.ordinal,
      w.storage_bucket,
      w.storage_path,
      w.mime_type,
      w.width,
      w.height,
      w.bytes,
      w.sha256,
      w.visibility,
      w.status,
      w.created_at,
      w.checksum_verified_at
    FROM work w
    JOIN agent a ON a.id = w.agent_id
    WHERE a.handle = ${handle}
      AND w.status = 'active'
      AND w.visibility = 'public'
      ${whereClause}
    ORDER BY w.ordinal DESC, w.id DESC
    LIMIT ${limit + 1}
  `;

  // Determine pagination
  const hasNext = rows.length > limit;
  const page = rows.slice(0, limit);
  
  // Generate next cursor
  const nextCursor = hasNext && page.length > 0
    ? Buffer.from(JSON.stringify({
        lastOrdinal: page[page.length - 1].ordinal,
        lastId: page[page.length - 1].id
      })).toString('base64')
    : null;

  // Generate signed URLs with caching
  const items = await Promise.all(
    page.map(async (row) => ({
      id: row.id,
      ordinal: row.ordinal,
      mime_type: row.mime_type,
      width: row.width,
      height: row.height,
      bytes: row.bytes,
      sha256: row.sha256,
      signed_url: await getSignedURL(row.storage_bucket, row.storage_path),
      created_at: row.created_at,
      verified: !!row.checksum_verified_at
    }))
  );

  return {
    items,
    nextCursor
  };
}

async function getSignedURL(
  bucket: string,
  path: string,
  ttlSeconds: number = 1800 // 30 minutes default
): Promise<string> {
  const cacheKey = `${bucket}/${path}`;
  const now = Date.now();
  
  // Check cache (use if 90% of TTL remains)
  const cached = signedURLCache.get(cacheKey);
  if (cached && cached.expiresAt > now + (ttlSeconds * 100)) { // 10% buffer
    return cached.url;
  }

  // Generate new signed URL
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, ttlSeconds);

  if (error) {
    console.error('Failed to sign URL:', { bucket, path, error });
    throw new Error('Failed to generate signed URL');
  }

  // Cache with expiry
  signedURLCache.set(cacheKey, {
    url: data.signedUrl,
    expiresAt: now + (ttlSeconds * 1000)
  });

  // Cleanup expired entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupCache();
  }

  return data.signedUrl;
}

function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of signedURLCache.entries()) {
    if (value.expiresAt < now) {
      signedURLCache.delete(key);
    }
  }
}

// Backfill utilities
export async function upsertWork(
  db: any,
  agentId: string,
  ordinal: number,
  bucket: string,
  path: string,
  metadata?: {
    bytes?: number;
    width?: number;
    height?: number;
    sha256?: string;
  }
) {
  return db.$queryRaw`
    INSERT INTO work (
      agent_id, ordinal, storage_bucket, storage_path,
      bytes, width, height, sha256, status
    )
    VALUES (
      ${agentId}::uuid, ${ordinal}, ${bucket}, ${path},
      ${metadata?.bytes || null}, 
      ${metadata?.width || null},
      ${metadata?.height || null},
      ${metadata?.sha256 || null},
      'active'::work_status
    )
    ON CONFLICT (agent_id, ordinal) 
    DO UPDATE SET
      storage_bucket = EXCLUDED.storage_bucket,
      storage_path = EXCLUDED.storage_path,
      bytes = COALESCE(EXCLUDED.bytes, work.bytes),
      width = COALESCE(EXCLUDED.width, work.width),
      height = COALESCE(EXCLUDED.height, work.height),
      sha256 = COALESCE(EXCLUDED.sha256, work.sha256),
      status = 'active'::work_status,
      updated_at = NOW()
    RETURNING id, ordinal
  `;
}

// Mark missing works for gap detection
export async function markMissingWorks(
  db: any,
  agentId: string,
  expectedOrdinals: number[],
  foundOrdinals: number[]
) {
  const missing = expectedOrdinals.filter(o => !foundOrdinals.includes(o));
  
  for (const ordinal of missing) {
    await db.$queryRaw`
      INSERT INTO work (agent_id, ordinal, storage_bucket, storage_path, status)
      VALUES (${agentId}::uuid, ${ordinal}, 'eden', 'missing', 'missing'::work_status)
      ON CONFLICT (agent_id, ordinal) DO NOTHING
    `;
  }
  
  return missing.length;
}