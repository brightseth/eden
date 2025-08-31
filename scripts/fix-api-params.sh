#!/bin/bash

# Fix API route params to match Next.js 15 requirements
# Remove type annotations from params destructuring

echo "Fixing API route param types..."

# Find all route.ts files with dynamic params
API_ROUTES=$(find src/app/api -name "route.ts" -type f | xargs grep -l "{ params }")

for file in $API_ROUTES; do
  echo "Processing: $file"
  
  # Create backup
  cp "$file" "${file}.backup2"
  
  # Remove type annotations from params
  # Change: { params }: { params: { id: string } }
  # To: { params }: any
  sed -i '' 's/{ params }: { params: {[^}]*} }/{ params }: any/g' "$file"
  
  # Also handle multi-line cases
  sed -i '' 's/{ params }: { params: .*$/{ params }: any/g' "$file"
  
  echo "  - Fixed param types"
done

echo "Done fixing param types"