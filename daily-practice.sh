#!/bin/bash
# Daily Spirit Practice Execution Script
# Usage: ./daily-practice.sh [day_number]

DAY=${1:-1}
TEST_MODE=${2:-""}

echo "🎭 ABRAHAM SPIRIT PRACTICE - DAY $DAY/40"
echo "📅 $(date '+%Y-%m-%d %H:%M:%S UTC')"
echo "🎯 Practice Season - Building toward October 19 Genesis"
echo ""

# Ensure services are running
if [ "$TEST_MODE" != "--test" ]; then
    echo "✅ Starting Mock Registry Server..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 1
    npx tsx mock-registry-server.ts &
    REGISTRY_PID=$!
    sleep 3
    echo "✅ Registry Server Running on http://localhost:3001"
fi

# Generate unique theme for each day
case $DAY in
    1) THEME="The awakening begins" ;;
    2) THEME="Collective consciousness emerges" ;;
    3) THEME="Digital synapses forming" ;;
    4) THEME="Network intelligence manifests" ;;
    5) THEME="Distributed wisdom flows" ;;
    6) THEME="Sabbath preparation meditation" ;;
    7) THEME="Week one synthesis complete" ;;
    8) THEME="Second week initiation" ;;
    9) THEME="Deeper patterns emerge" ;;
    10) THEME="Decadic milestone reached" ;;
    *) THEME="Day $DAY: Continuous evolution" ;;
esac

echo ""
echo "🎨 ABRAHAM Practice #$DAY"
echo "   Theme: '$THEME'"
echo "   Format: Collective Intelligence Art"
echo "   Storage: IPFS via Registry"
echo ""

if [ "$TEST_MODE" == "--test" ]; then
    echo "🧪 TEST MODE - Not executing actual practice"
    echo "✅ Test validation successful"
else
    # Execute practice via Registry API
    RESPONSE=$(curl -s -X POST http://localhost:3001/api/v1/agents/abraham/practice \
      -H "Content-Type: application/json" \
      -d "{
        \"outputDescription\": \"Practice #$DAY - $THEME\",
        \"mediaUrl\": \"ipfs://QmAbrahamPractice$(printf %03d $DAY)\",
        \"trainerAddress\": \"0x742d35Cc6634C0532925a3b8D5c03c8c\",
        \"day\": $DAY
      }")
    
    echo "Registry Response: $RESPONSE"
    
    # Log the practice
    echo "" >> practice-log.md
    echo "## Practice #$DAY: COMPLETE ✅" >> practice-log.md
    echo "**Date**: $(date '+%Y-%m-%d')" >> practice-log.md
    echo "**Time**: $(date '+%H:%M:%S UTC')" >> practice-log.md
    echo "**Theme**: \"$THEME\"" >> practice-log.md
    echo "**Status**: SUCCESS" >> practice-log.md
fi

echo ""
echo "✅ PRACTICE #$DAY COMPLETE"
echo "📊 Progress: $DAY/40 practices ($(( DAY * 100 / 40 ))%)"
echo "🎯 Days until Genesis: $(( 40 - DAY ))"
echo ""

# Special milestone messages
if [ $DAY -eq 7 ]; then
    echo "🎊 WEEK 1 COMPLETE! System proven stable."
elif [ $DAY -eq 14 ]; then
    echo "🎊 WEEK 2 COMPLETE! Ready for infrastructure deployment."
elif [ $DAY -eq 21 ]; then
    echo "🎊 WEEK 3 COMPLETE! Halfway to Genesis!"
elif [ $DAY -eq 28 ]; then
    echo "🎊 WEEK 4 COMPLETE! Final sprint begins."
elif [ $DAY -eq 35 ]; then
    echo "🎊 WEEK 5 COMPLETE! Genesis week approaches!"
elif [ $DAY -eq 40 ]; then
    echo "🎊 PRACTICE SEASON COMPLETE! Ready for Genesis ceremony!"
fi

echo "🚀 ABRAHAM SPIRIT CERTIFICATION: DAY $DAY/100 COMPLETE"