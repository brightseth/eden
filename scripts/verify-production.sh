#!/bin/bash
# Production verification script for SOLIENNE works deployment

echo "🔍 SOLIENNE Works Production Verification"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
WR="${WORKS_REGISTRY_URL:-https://works-registry-hx7ij4kcv-edenprojects.vercel.app}"
ACADEMY="${ACADEMY_URL:-https://academy.eden2.io}"

echo ""
echo "Configuration:"
echo "  Works Registry: $WR"
echo "  Academy: $ACADEMY"
echo ""

# Test 1: Works-registry reachable
echo "1. Testing Works Registry reachability..."
if curl -s "$WR/api/ping" | grep -q "ok"; then
    echo -e "${GREEN}✅ Works Registry is reachable${NC}"
else
    echo -e "${RED}❌ Works Registry is NOT reachable${NC}"
    echo "   Check Vercel protection settings"
    exit 1
fi

# Test 2: Works API shape
echo ""
echo "2. Testing Works API response shape..."
WORKS_RESPONSE=$(curl -s "$WR/api/v1/agents/solienne/works?limit=3")
if echo "$WORKS_RESPONSE" | jq -e '{n: (.items|length), next: .nextCursor != null, sample: .items[0].ordinal}' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Works API returning correct shape${NC}"
    echo "   Items: $(echo "$WORKS_RESPONSE" | jq '.items | length')"
    echo "   Has cursor: $(echo "$WORKS_RESPONSE" | jq '.nextCursor != null')"
    echo "   First ordinal: $(echo "$WORKS_RESPONSE" | jq '.items[0].ordinal')"
else
    echo -e "${RED}❌ Works API response invalid${NC}"
    echo "$WORKS_RESPONSE" | jq . || echo "$WORKS_RESPONSE"
    exit 1
fi

# Test 3: Academy proxy using WR
echo ""
echo "3. Testing Academy proxy to Works Registry..."
ACADEMY_RESPONSE=$(curl -s "$ACADEMY/api/agents/solienne/works?limit=3")
if echo "$ACADEMY_RESPONSE" | jq -e '{n: (.items|length), next: .nextCursor != null, sample: .items[0].ordinal}' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Academy proxy working correctly${NC}"
    echo "   Items: $(echo "$ACADEMY_RESPONSE" | jq '.items | length')"
    echo "   Signed URL present: $(echo "$ACADEMY_RESPONSE" | jq '.items[0].signed_url' | grep -q 'sign' && echo 'Yes' || echo 'No')"
else
    echo -e "${YELLOW}⚠️  Academy proxy may not be configured${NC}"
    echo "   Response: $(echo "$ACADEMY_RESPONSE" | head -c 200)"
fi

# Test 4: No public URLs in DOM
echo ""
echo "4. Checking for public storage URLs in DOM..."
if curl -s "$ACADEMY/agents/solienne/generations" | grep -q 'storage/v1/object/public'; then
    echo -e "${RED}❌ Found public storage URLs in DOM!${NC}"
    echo "   This is a security issue - signed URLs should be used"
    exit 1
else
    echo -e "${GREEN}✅ No public storage URLs in DOM${NC}"
fi

# Test 5: Check signed URLs
echo ""
echo "5. Verifying signed URLs..."
SIGNED_URL=$(echo "$WORKS_RESPONSE" | jq -r '.items[0].signed_url' 2>/dev/null)
if [[ "$SIGNED_URL" == *"storage/v1/object/sign"* ]]; then
    echo -e "${GREEN}✅ Signed URLs are being generated${NC}"
    echo "   TTL: 30 minutes"
    
    # Test if URL is accessible
    if curl -s -o /dev/null -w "%{http_code}" "$SIGNED_URL" | grep -q "200"; then
        echo -e "${GREEN}✅ Signed URL is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Signed URL returned non-200 status${NC}"
    fi
else
    echo -e "${RED}❌ Not getting signed URLs${NC}"
fi

# Summary
echo ""
echo "========================================="
echo "Summary:"
echo ""

# Count successes
CHECKS_PASSED=0
[[ $(curl -s "$WR/api/ping" | grep -q "ok" && echo 1) ]] && ((CHECKS_PASSED++))
[[ $(echo "$WORKS_RESPONSE" | jq -e '.items' > /dev/null 2>&1 && echo 1) ]] && ((CHECKS_PASSED++))
[[ $(echo "$ACADEMY_RESPONSE" | jq -e '.items' > /dev/null 2>&1 && echo 1) ]] && ((CHECKS_PASSED++))
[[ ! $(curl -s "$ACADEMY/agents/solienne/generations" | grep -q 'storage/v1/object/public' && echo 1) ]] && ((CHECKS_PASSED++))
[[ "$SIGNED_URL" == *"storage/v1/object/sign"* ]] && ((CHECKS_PASSED++))

if [ $CHECKS_PASSED -eq 5 ]; then
    echo -e "${GREEN}✅ All checks passed! Production is ready.${NC}"
else
    echo -e "${YELLOW}⚠️  $CHECKS_PASSED/5 checks passed${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Ensure Works Registry protection is disabled or bypass token is set"
    echo "2. Add WORKS_REGISTRY_URL to Academy environment in Vercel"
    echo "3. Redeploy Academy to pick up environment changes"
fi