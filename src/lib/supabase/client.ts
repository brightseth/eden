// Client-side Supabase helper with lazy loading
let supabaseClient: any = null;

export async function createClient() {
  if (typeof window === 'undefined') {
    // Server-side - use the server client instead
    throw new Error('Use createClient from @/lib/supabase/server on the server side');
  }
  
  if (!supabaseClient) {
    const { createBrowserClient } = await import('@supabase/ssr');
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  return supabaseClient;
}

// Browser-only helper for client components
export async function getBrowserSupabase() {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserSupabase is browser-only - use server createClient for SSR');
  }
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, anon);
}

// For backward compatibility - returns cached client or creates new one
export async function getSupabaseClient() {
  return createClient();
}