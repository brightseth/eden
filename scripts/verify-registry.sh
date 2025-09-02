#!/bin/bash
set -euo pipefail

REGISTRY_BASE="https://eden-genesis-registry.vercel.app"

echo "🔍 Verifying Registry deployment..."
echo "=================================="

# Check if new Works API exists
echo "1. Checking Works API endpoint..."
RESPONSE=$(curl -s "$REGISTRY_BASE/api/v1/agents/solienne/works?limit=1")

if echo "$RESPONSE" | grep -q '"items"'; then
  echo "✅ New Works API is deployed (has 'items' field)"
elif echo "$RESPONSE" | grep -q '"works"'; then
  echo "❌ Old API still deployed (has 'works' field)"
  echo "Response: $RESPONSE"
  exit 1
else
  echo "❌ Unexpected response format"
  echo "Response: $RESPONSE"
  exit 1
fi

# Test POST endpoint with auth
echo ""
echo "2. Testing POST endpoint auth..."
POST_RESPONSE=$(curl -s -X POST "$REGISTRY_BASE/api/v1/agents/solienne/works" \
  -H "Content-Type: application/json" \
  -H "x-registry-service: registry-service-key-2025-eden-solienne-works" \
  -d '{"works":[{"ordinal":1,"storagePath":"test"}]}')

if echo "$POST_RESPONSE" | grep -q "Unauthorized"; then
  echo "⚠️ Auth still failing - env vars may not be set"
  echo "Response: $POST_RESPONSE"
elif echo "$POST_RESPONSE" | grep -q "created"; then
  echo "✅ POST endpoint working with auth"
else
  echo "❓ Unexpected POST response"
  echo "Response: $POST_RESPONSE"
fi

echo ""
echo "3. Checking for signed URLs..."
WORKS_RESPONSE=$(curl -s "$REGISTRY_BASE/api/v1/agents/solienne/works?limit=1")
if echo "$WORKS_RESPONSE" | grep -q "signed_url"; then
  echo "✅ Response includes signed_url field"
else
  echo "⚠️ No signed_url field in response"
fi

echo ""
echo "=================================="
echo "Deployment verification complete"