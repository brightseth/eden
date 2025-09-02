#!/bin/bash

# Fix all route handlers for Next.js 15

echo "Fixing route handlers for Next.js 15..."

# List of files that need fixing
files=(
  "src/app/api/v1/registry/test/[category]/route.ts"
  "src/app/api/agents/citizen/documents/[id]/route.ts"
  "src/app/api/agents/[id]/metrics/route.ts"
  "src/app/api/agents/[id]/daily-practice/route.ts"
  "src/app/api/agents/[id]/chat/route.ts"
  "src/app/api/agents/[id]/follow/route.ts"
  "src/app/api/agents/[id]/prompt-patch/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Add runtime and dynamic exports if not present
    if ! grep -q "export const runtime" "$file"; then
      sed -i '' "1s/^/export const runtime = 'nodejs';\nexport const dynamic = 'force-dynamic';\n\n/" "$file"
    fi
    
    # Fix params type - handle both single and multiple params
    if [[ "$file" == *"[category]"* ]]; then
      sed -i '' 's/{ params }: any/{ params }: { params: Promise<{ category: string }> }/g' "$file"
      sed -i '' 's/const { category } = params/const { category } = await params/g' "$file"
    elif [[ "$file" == *"[id]"* ]]; then
      sed -i '' 's/{ params }: any/{ params }: { params: Promise<{ id: string }> }/g' "$file"
      # Add await for params if not present
      if ! grep -q "await params" "$file"; then
        sed -i '' 's/const { id } = params/const { id } = await params/g' "$file"
        sed -i '' 's/const { id: \([^}]*\) } = params/const { id: \1 } = await params/g' "$file"
      fi
    fi
    
    # Fix Supabase imports if present
    if grep -q "import.*createClient.*from.*supabase" "$file"; then
      # Check if lazy loading is already implemented
      if ! grep -q "getSupabase" "$file"; then
        # Add lazy loading function after imports
        sed -i '' '/^import.*supabase/a\
\
// Lazy load Supabase to avoid bundling issues\
async function getSupabase() {\
  const { createClient } = await import("@/lib/supabase/server");\
  return createClient();\
}' "$file"
        
        # Replace createClient() calls with getSupabase()
        sed -i '' 's/await createClient()/await getSupabase()/g' "$file"
        sed -i '' 's/createClient()/getSupabase()/g' "$file"
        
        # Remove direct import
        sed -i '' "/import.*createClient.*from.*supabase/d" "$file"
      fi
    fi
  fi
done

echo "Route handlers fixed!"