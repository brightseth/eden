#!/bin/bash

echo "🏗️ Validating three-tier architecture..."

# Check agent route structure
AGENT_ROUTES=$(find src/app -path "*/agents/*/page.tsx" | wc -l)
SITE_ROUTES=$(find src/app -path "*/sites/*/page.tsx" | wc -l)
DASHBOARD_ROUTES=$(find src/app -path "*/dashboard/*/page.tsx" | wc -l)

echo "📊 Three-tier architecture status:"
echo "  - Agent profiles: $AGENT_ROUTES"
echo "  - Agent sites: $SITE_ROUTES"
echo "  - Agent dashboards: $DASHBOARD_ROUTES"

# Check for agent extraction attempts (top-level agent directories)
EXTRACTION_ATTEMPTS=$(find . -maxdepth 1 -type d \
  -name "*-agent" -o -name "agent-*" | \
  grep -v node_modules | grep -v src || true)

if [ -n "$EXTRACTION_ATTEMPTS" ]; then
  echo "❌ ADR-033 VIOLATION: Agent extraction detected"
  echo ""
  echo "Attempted extractions:"
  for dir in $EXTRACTION_ATTEMPTS; do
    echo "  ❌ $dir"
  done
  echo ""
  echo "✅ SOLUTION: Use sovereign surfaces within Academy"
  echo "  See: resources/docs/sovereign-surfaces-design.md"
  exit 1
else
  echo "✅ Three-tier architecture preserved"
fi