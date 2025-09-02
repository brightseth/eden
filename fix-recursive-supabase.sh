#!/bin/bash

echo "Fixing recursive getSupabase calls..."

# Find all files with the recursive getSupabase issue
files=$(grep -r "return getSupabase()" src/app/api --include="*.ts" | cut -d: -f1 | sort -u)

for file in $files; do
  echo "Fixing $file..."
  
  # Fix the recursive call - should return createClient() not getSupabase()
  sed -i '' 's/return getSupabase()/return createClient()/g' "$file"
  
  # Also remove any old createClient imports or declarations that might conflict
  sed -i '' '/^const supabase = createClient(/,/^);$/d' "$file"
  sed -i '' '/^import.*createClient.*from.*@supabase/d' "$file"
done

echo "Recursive calls fixed!"