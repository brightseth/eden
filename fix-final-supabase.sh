#!/bin/bash

echo "Fixing final Supabase initialization issues..."

files=(
  "src/app/api/agents/miyomi/picks/route.ts"
  "src/app/api/agents/miyomi/schedule/route.ts"
  "src/app/api/agents/miyomi/works/route.ts"
  "src/app/api/agents/miyomi/route.ts"
  "src/app/api/miyomi/market-stream/route.ts"
  "src/app/api/miyomi/real-picks/route.ts"
  "src/app/api/miyomi/test-picks/route.ts"
  "src/app/api/covenant.disabled/witnesses/route.ts"
  "src/app/api/covenant.disabled/notifications/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    
    # Find the first function that uses supabase
    first_func=$(grep -n "export async function" "$file" | head -1 | cut -d: -f1)
    
    if [ -n "$first_func" ]; then
      # Add const supabase = await getSupabase(); after the function declaration
      next_line=$((first_func + 1))
      
      # Check if it already has getSupabase call
      if ! grep -q "const supabase = await getSupabase()" "$file"; then
        # Check if there's a try block
        if grep -q "try {" "$file"; then
          # Insert after try {
          sed -i '' '/try {/a\
    const supabase = await getSupabase();
' "$file"
        else
          # Insert at the beginning of the function
          sed -i '' "${next_line}a\\
  const supabase = await getSupabase();\\
" "$file"
        fi
      fi
    fi
  fi
done

echo "Final Supabase fixes complete!"