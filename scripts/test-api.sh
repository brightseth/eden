#!/bin/bash

# Test script for Operator Playbook APIs
# Run after starting the dev server: npm run dev

AGENT_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
BASE_URL="http://localhost:3000/api/agents"

echo "Testing Operator Playbook APIs..."
echo "================================="

# Test 1: Get Financial Model
echo -e "\n1. Testing GET financial-model..."
curl -s "$BASE_URL/$AGENT_ID/financial-model" | jq '.'

# Test 2: Update Financial Model
echo -e "\n2. Testing POST financial-model..."
curl -s -X POST "$BASE_URL/$AGENT_ID/financial-model" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 7.50,
    "quantity": 15,
    "frequency_per_week": 5,
    "unit_cost": 0.85,
    "platform_fee_pct": 0.12
  }' | jq '.'

# Test 3: Get Daily Practice Entries
echo -e "\n3. Testing GET daily-practice..."
curl -s "$BASE_URL/$AGENT_ID/daily-practice?limit=7" | jq '.'

# Test 4: Save Today's Practice
echo -e "\n4. Testing POST daily-practice..."
curl -s -X POST "$BASE_URL/$AGENT_ID/daily-practice" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "Testing API",
    "creations_count": 5,
    "published_count": 2,
    "views": 150,
    "reactions": 12,
    "collects": 1,
    "cost_usdc": 1.00,
    "revenue_usdc": 5.00,
    "note": "API test successful"
  }' | jq '.'

# Test 5: Increment Published Count
echo -e "\n5. Testing PATCH increment published..."
curl -s -X PATCH "$BASE_URL/$AGENT_ID/daily-practice" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "increment_published"
  }' | jq '.'

# Test 6: Add Blocker
echo -e "\n6. Testing PATCH add blocker..."
curl -s -X PATCH "$BASE_URL/$AGENT_ID/daily-practice" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "add_blocker",
    "blocker": "Test blocker from API"
  }' | jq '.'

# Test 7: Get Metrics
echo -e "\n7. Testing GET metrics..."
curl -s "$BASE_URL/$AGENT_ID/metrics" | jq '.'

# Test 8: Invalid data (should fail validation)
echo -e "\n8. Testing validation (should fail)..."
curl -s -X POST "$BASE_URL/$AGENT_ID/financial-model" \
  -H "Content-Type: application/json" \
  -d '{
    "price": -5,
    "quantity": 0,
    "frequency_per_week": 10
  }' | jq '.'

echo -e "\n================================="
echo "API tests complete!"