#!/bin/bash

# Script to revert API routes to stable { params } signature
# Per Seth's guidance: Route handlers should use stable format, not async params

echo "Reverting API routes to stable { params } signature..."

# Find all route.ts files in the API directory
API_ROUTES=$(find src/app/api -name "route.ts" -type f)

for file in $API_ROUTES; do
  echo "Processing: $file"
  
  # Check if file contains dynamic params (has [param] in path)
  if echo "$file" | grep -q '\[.*\]'; then
    echo "  - Has dynamic params, needs conversion"
    
    # Create a temporary backup
    cp "$file" "${file}.backup"
    
    # Convert async params pattern to stable format
    # Pattern 1: props: { params: Promise<{ ... }> } to { params }: { params: { ... } }
    sed -i '' 's/props: { params: Promise<{\(.*\)}> }/{ params }: { params: {\1} }/g' "$file"
    
    # Pattern 2: context: { params: Promise<.*> } to { params }: { params: ... }
    sed -i '' 's/context: { params: Promise<\(.*\)> }/{ params }: { params: \1 }/g' "$file"
    
    # Remove await props.params lines
    sed -i '' '/const params = await props\.params/d' "$file"
    sed -i '' '/const params = await context\.params/d' "$file"
    
    # Fix any remaining destructuring issues
    sed -i '' 's/const { \(.*\) } = params;/const { \1 } = params;/g' "$file"
    
    # Clean up double destructuring (if { params } already destructured)
    sed -i '' 's/const { \(.*\) } = { params };/const { \1 } = params;/g' "$file"
    
    echo "  - Converted to stable format"
  fi
done

echo "Conversion complete. Checking for compilation errors..."

# Run TypeScript check on API routes
npx tsc --noEmit --skipLibCheck src/app/api/**/*.ts 2>&1 | head -20

echo "Done. Review the changes and test the build."