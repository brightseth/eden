#!/bin/bash

echo "🔍 Checking Registry-First pattern compliance..."

# Check for direct Prisma imports outside Registry API routes
VIOLATIONS=$(find src/app/api -type f -name "*.ts" \
  -not -path "*/registry/*" \
  -not -path "*/agents-test/*" | \
  xargs grep -l "import.*@prisma\|from.*@prisma\|import.*prisma\|from.*prisma" 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "❌ REGISTRY-FIRST VIOLATION: Direct database access detected"
  echo ""
  echo "🏛️ ADR-022 requires all data access through Registry API"
  echo ""
  echo "Files violating Registry-First pattern:"
  for file in $VIOLATIONS; do
    echo "  ❌ $file"
    echo "     $(grep -n "import.*prisma\|from.*prisma" "$file" | head -1)"
  done
  echo ""
  echo "✅ SOLUTION: Use Registry client instead:"
  echo "  import { registryClient } from '@/lib/registry-client'"
  echo "  const data = await registryClient.agents.list()"
  echo ""
  exit 1
else
  echo "✅ Registry-First pattern compliance verified"
fi