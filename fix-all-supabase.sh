#!/bin/bash

echo "Fixing all Supabase imports in API routes..."

# Find all route files with Supabase imports
files=$(grep -r "createClient.*from.*supabase" src/app/api --include="*.ts" | cut -d: -f1 | sort -u)

for file in $files; do
  echo "Processing $file..."
  
  # Add runtime and dynamic exports if not present
  if ! grep -q "export const runtime" "$file"; then
    # Add after imports
    sed -i '' '/^import.*from/a\
\
export const runtime = "nodejs";\
export const dynamic = "force-dynamic";' "$file"
  fi
  
  # Check if lazy loading is already implemented
  if ! grep -q "getSupabase" "$file"; then
    # Add lazy loading function after imports
    sed -i '' '/createClient.*from.*supabase/a\
\
// Lazy load Supabase to avoid bundling issues\
async function getSupabase() {\
  const { createClient } = await import("@/lib/supabase/server");\
  return createClient();\
}' "$file"
    
    # Replace direct createClient() calls
    sed -i '' 's/await createClient()/await getSupabase()/g' "$file"
    sed -i '' 's/createClient()/getSupabase()/g' "$file"
    
    # Remove direct import
    sed -i '' '/import.*createClient.*from.*supabase/d' "$file"
  fi
  
  # Fix any route params that have [id] or other dynamic segments
  if [[ "$file" == *"[id]"* ]]; then
    # Fix GET function
    sed -i '' 's/export async function GET([^,]*, { params }: any/export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    sed -i '' 's/export async function GET([^,]*, { params }: { params: { id: string } }/export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    
    # Fix POST function  
    sed -i '' 's/export async function POST([^,]*, { params }: any/export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    sed -i '' 's/export async function POST([^,]*, { params }: { params: { id: string } }/export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    
    # Fix PUT function
    sed -i '' 's/export async function PUT([^,]*, { params }: any/export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    sed -i '' 's/export async function PUT([^,]*, { params }: { params: { id: string } }/export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    
    # Fix DELETE function
    sed -i '' 's/export async function DELETE([^,]*, { params }: any/export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    sed -i '' 's/export async function DELETE([^,]*, { params }: { params: { id: string } }/export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    
    # Fix PATCH function
    sed -i '' 's/export async function PATCH([^,]*, { params }: any/export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    sed -i '' 's/export async function PATCH([^,]*, { params }: { params: { id: string } }/export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }/g' "$file"
    
    # Add await for params
    if ! grep -q "await params" "$file"; then
      sed -i '' 's/const { id } = params/const { id } = await params/g' "$file"
      sed -i '' 's/const { id: \([^}]*\) } = params/const { id: \1 } = await params/g' "$file"
    fi
  fi
done

echo "All Supabase imports fixed!"