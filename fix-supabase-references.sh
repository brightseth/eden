#!/bin/bash

echo "Fixing remaining Supabase references..."

# Files that need getSupabase() call added
files=(
  "src/app/api/agents/miyomi/route.ts"
  "src/app/api/agents/miyomi/picks/route.ts"
  "src/app/api/agents/miyomi/performance/route.ts"
  "src/app/api/agents/miyomi/schedule/route.ts"
  "src/app/api/agents/miyomi/test-picks/route.ts"
  "src/app/api/agents/miyomi/real-picks/route.ts"
  "src/app/api/agents/abraham/latest/route.ts"
  "src/app/api/agents/abraham/works/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Checking $file..."
    
    # Check if file has getSupabase function but no call to it
    if grep -q "async function getSupabase" "$file"; then
      # Check if supabase is used without being assigned from getSupabase
      if ! grep -q "const supabase = await getSupabase()" "$file"; then
        # Find first usage of supabase. or await supabase
        first_usage=$(grep -n "supabase\." "$file" | head -1 | cut -d: -f1)
        
        if [ -n "$first_usage" ]; then
          # Insert const supabase = await getSupabase() before first usage
          sed -i '' "${first_usage}i\\
    const supabase = await getSupabase();\\
" "$file"
          echo "  Added getSupabase() call to $file"
        fi
      fi
    fi
  fi
done

echo "Supabase references fixed!"