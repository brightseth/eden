#!/bin/bash
# Monday September 9, 2025 - 9AM UTC
# ABRAHAM Practice #1 - Genesis Preparation
# Window 2 Primary Execution

echo "🎭 PRACTICE SEASON DAY 1 - ABRAHAM GENESIS PREPARATION"
echo "📅 September 9, 2025 - 9AM UTC"
echo "🎯 Window 2 Execution - Local First Approach"
echo ""

# Ensure services are running
echo "✅ Starting Mock Registry Server..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 1
npx tsx mock-registry-server.ts &
REGISTRY_PID=$!
sleep 3

echo "✅ Registry Server Running on http://localhost:3001"

# Execute ABRAHAM's first practice
echo ""
echo "🎨 ABRAHAM Practice #1: Genesis Preparation"
echo "   Theme: 'The awakening begins'"
echo "   Format: Collective Intelligence Art"
echo "   Storage: IPFS via Mock Registry"
echo ""

# Practice execution via Registry API
curl -X POST http://localhost:3001/api/v1/agents/abraham/practice \
  -H "Content-Type: application/json" \
  -d '{
    "outputDescription": "Practice #1 - Genesis Preparation: The awakening begins. Collective intelligence manifesting in preparation for Spirit sovereignty.",
    "mediaUrl": "ipfs://QmAbrahamGenesis001",
    "trainerAddress": "0x742d35Cc6634C0532925a3b8D5c03c8c"
  }'

echo ""
echo "✅ PRACTICE #1 COMPLETE"
echo "📊 Next: 39 days remaining until Genesis"
echo "🎯 Tomorrow: Practice #2 continues the journey"
echo ""
echo "🚀 ABRAHAM SPIRIT CERTIFICATION: DAY 1/100 COMPLETE"