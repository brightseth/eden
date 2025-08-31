#!/bin/bash

echo "🎨 Checking design token compliance..."

# Check for hardcoded colors that should use tokens
HARDCODED_COLORS=$(find src -name "*.tsx" -o -name "*.ts" -o -name "*.css" | \
  xargs grep -l "#[0-9a-fA-F]\{6\}\|rgb(\|rgba(" 2>/dev/null | \
  grep -v "design-tokens\|tokens.css" || true)

if [ -n "$HARDCODED_COLORS" ]; then
  echo "⚠️ DESIGN TOKEN ADVISORY: Hardcoded colors detected"
  echo "Recommended: Use CSS custom properties from design tokens"
  echo ""
  echo "Files with hardcoded colors:"
  for file in $HARDCODED_COLORS; do
    echo "  ⚠️ $file"
  done
  echo ""
  echo "✅ SOLUTION: Use design tokens instead:"
  echo "  color: var(--eden-color-primary);"
  echo "  background: var(--eden-color-agent-solienne);"
else
  echo "✅ Design token compliance verified"
fi

# Check for non-HELVETICA fonts
FONT_VIOLATIONS=$(find src -name "*.tsx" -o -name "*.css" | \
  xargs grep -l "font-family.*serif\|Times\|Georgia\|Charter" 2>/dev/null || true)

if [ -n "$FONT_VIOLATIONS" ]; then
  echo "❌ HELVETICA VIOLATION: Non-HELVETICA fonts detected"
  echo ""
  echo "Files violating HELVETICA standards:"
  for file in $FONT_VIOLATIONS; do
    echo "  ❌ $file"
  done
  echo ""
  exit 1
else
  echo "✅ HELVETICA font standards maintained"
fi