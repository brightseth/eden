#!/bin/bash

# Launch Agent Control Dashboard
# Port 7777 - Dedicated for agent control

echo "🚀 Starting Agent Control Dashboard..."
echo "⏳ Initializing agent ecosystem..."

# Check if required dependencies are installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not installed. Please install Node.js first."
    exit 1
fi

# Check if required files exist
if [ ! -f "agent-dashboard-server.ts" ]; then
    echo "❌ agent-dashboard-server.ts not found"
    exit 1
fi

# Create agent-memories directory if it doesn't exist
mkdir -p agent-memories

echo "🧠 Setting up agent memory system..."
echo "🕸️  Initializing knowledge graph..."
echo "🎭 Loading personality evolution..."
echo "⚙️  Preparing workflows..."

# Start the dashboard server
echo ""
echo "🎉 Launching Agent Dashboard on port 7777..."
echo "📱 Open: http://localhost:7777"
echo ""
echo "Press Ctrl+C to stop the dashboard"
echo ""

npm run agent-dashboard