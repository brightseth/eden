#!/bin/bash

echo "Fixing duplicate runtime exports..."

# Find all files with duplicate runtime exports
files=$(grep -r "export const runtime" src/app/api --include="*.ts" | cut -d: -f1 | sort | uniq -d)

for file in $files; do
  echo "Fixing duplicates in $file..."
  
  # Count occurrences
  count=$(grep -c "export const runtime" "$file")
  
  if [ "$count" -gt "1" ]; then
    # Remove all runtime and dynamic exports first
    sed -i '' '/^export const runtime = /d' "$file"
    sed -i '' '/^export const dynamic = /d' "$file"
    
    # Add them back once at the top after imports
    # Find the last import line
    last_import_line=$(grep -n "^import " "$file" | tail -1 | cut -d: -f1)
    
    if [ -n "$last_import_line" ]; then
      # Insert after last import
      sed -i '' "${last_import_line}a\\
\\
export const runtime = 'nodejs';\\
export const dynamic = 'force-dynamic';" "$file"
    else
      # No imports, add at the beginning
      sed -i '' "1i\\
export const runtime = 'nodejs';\\
export const dynamic = 'force-dynamic';\\
" "$file"
    fi
  fi
done

echo "Duplicate exports fixed!"