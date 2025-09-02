#!/bin/bash
# CI Guardrail: Ensure no public Supabase storage URLs in source code
# This should be run in CI to prevent accidental exposure of public URLs

echo "Checking for public storage URLs in source code..."

# Search for public storage patterns
if grep -R --line-number -E 'storage/v1/object/public' ./src 2>/dev/null; then
  echo "❌ ERROR: Found public storage URLs in source code!"
  echo "All storage access must go through signed URLs via the Registry API."
  exit 1
fi

echo "✅ No public storage URLs found in source code"
exit 0