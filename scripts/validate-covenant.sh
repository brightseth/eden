#!/bin/bash

# Abraham Covenant - Production Validation Script
# Run this anytime to validate covenant infrastructure health
# Usage: ./scripts/validate-covenant.sh [production|staging|local]

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Determine environment
ENV=${1:-production}
case $ENV in
  production)
    ACADEMY_URL="https://academy.eden2.io"
    ;;
  staging)
    ACADEMY_URL="https://eden-academy.vercel.app"
    ;;
  local)
    ACADEMY_URL="http://localhost:3000"
    ;;
  *)
    echo "Usage: $0 [production|staging|local]"
    exit 1
    ;;
esac

echo "======================================"
echo "  ABRAHAM COVENANT VALIDATION"
echo "======================================"
echo "Environment: $ENV"
echo "URL: $ACADEMY_URL"
echo "Date: $(date)"
echo ""

# Track overall status
OVERALL_STATUS=0

# Function to check endpoint
check_endpoint() {
  local name=$1
  local url=$2
  local expected=$3
  
  echo -n "Checking $name... "
  
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  
  if [ "$STATUS" = "$expected" ]; then
    echo -e "${GREEN}✓${NC} ($STATUS)"
  else
    echo -e "${RED}✗${NC} (Expected: $expected, Got: $STATUS)"
    OVERALL_STATUS=1
  fi
}

# Function to check JSON response
check_json() {
  local name=$1
  local url=$2
  
  echo -n "Checking $name JSON... "
  
  if curl -s "$url" | jq '.' >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} (Valid JSON)"
  else
    echo -e "${RED}✗${NC} (Invalid JSON)"
    OVERALL_STATUS=1
  fi
}

echo "🔍 API Health Checks"
echo "--------------------"
check_endpoint "Witnesses API" "$ACADEMY_URL/api/covenant/witnesses" "200"
check_endpoint "Notifications API" "$ACADEMY_URL/api/covenant/notifications" "200"
check_endpoint "Covenant Page" "$ACADEMY_URL/academy/abraham/covenant" "200"
check_endpoint "Registry Health" "$ACADEMY_URL/api/registry/health" "200"
check_endpoint "Academy Home" "$ACADEMY_URL/" "200"
echo ""

echo "📊 Data Validation"
echo "------------------"
check_json "Witnesses List" "$ACADEMY_URL/api/covenant/witnesses"

# Count witnesses
WITNESS_COUNT=$(curl -s "$ACADEMY_URL/api/covenant/witnesses" 2>/dev/null | jq '. | length' 2>/dev/null || echo "Error")
echo "Total Witnesses: $WITNESS_COUNT"
echo ""

echo "📅 Countdown Status"
echo "------------------"
LAUNCH_DATE="2025-10-19"
TODAY=$(date +%Y-%m-%d)

# Calculate days remaining (cross-platform compatible)
if date --version >/dev/null 2>&1; then
  # GNU date (Linux)
  LAUNCH_EPOCH=$(date -d "$LAUNCH_DATE" +%s)
  TODAY_EPOCH=$(date +%s)
else
  # BSD date (macOS)
  LAUNCH_EPOCH=$(date -j -f "%Y-%m-%d" "$LAUNCH_DATE" +%s 2>/dev/null || echo "0")
  TODAY_EPOCH=$(date +%s)
fi

if [ "$LAUNCH_EPOCH" != "0" ]; then
  DAYS_REMAINING=$(( ($LAUNCH_EPOCH - $TODAY_EPOCH) / 86400 ))
  
  if [ $DAYS_REMAINING -gt 0 ]; then
    echo -e "Days to Launch: ${YELLOW}$DAYS_REMAINING days${NC}"
  elif [ $DAYS_REMAINING -eq 0 ]; then
    echo -e "${GREEN}🚀 LAUNCH DAY!${NC}"
  else
    DAYS_SINCE=$(( -$DAYS_REMAINING ))
    echo -e "Covenant Active: ${GREEN}Day $DAYS_SINCE${NC}"
  fi
else
  echo "Days to Launch: Unable to calculate"
fi
echo ""

echo "🔒 Contract Validation"
echo "---------------------"
echo -n "Checking witness schema... "
WITNESS_RESPONSE=$(curl -s "$ACADEMY_URL/api/covenant/witnesses?limit=1" 2>/dev/null || echo "{}")
if echo "$WITNESS_RESPONSE" | jq 'type == "array"' >/dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} (Array response)"
else
  echo -e "${RED}✗${NC} (Unexpected response type)"
  OVERALL_STATUS=1
fi
echo ""

echo "======================================"
if [ $OVERALL_STATUS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo "Covenant infrastructure is healthy!"
else
  echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
  echo "Please investigate the failures above."
fi
echo "======================================"

# Quick test witness registration (optional, requires flag)
if [ "$2" = "--test-register" ]; then
  echo ""
  echo "🧪 Test Witness Registration"
  echo "----------------------------"
  
  TEST_ADDRESS="0x$(openssl rand -hex 20)"
  echo "Test address: $TEST_ADDRESS"
  
  RESPONSE=$(curl -s -X POST "$ACADEMY_URL/api/covenant/witnesses" \
    -H "Content-Type: application/json" \
    -d "{
      \"address\": \"$TEST_ADDRESS\",
      \"email\": \"test-$(date +%s)@example.com\",
      \"transaction_hash\": \"0x$(openssl rand -hex 32)\",
      \"block_number\": $RANDOM,
      \"notification_preferences\": {
        \"dailyAuctions\": true,
        \"milestones\": true,
        \"emergency\": true
      }
    }" 2>/dev/null)
  
  if echo "$RESPONSE" | jq '.success' 2>/dev/null | grep -q true; then
    WITNESS_NUM=$(echo "$RESPONSE" | jq '.witness_number' 2>/dev/null)
    echo -e "${GREEN}✓${NC} Test registration successful (Witness #$WITNESS_NUM)"
  else
    echo -e "${RED}✗${NC} Test registration failed"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  fi
fi

exit $OVERALL_STATUS