#!/bin/bash

# Sue Production Launch Script
# Set your API key below and run: ./launch-sue.sh

echo "🎨 SUE PRODUCTION LAUNCH SCRIPT"
echo "================================"
echo ""

# IMPORTANT: Replace with your actual API key
read -p "Enter your Anthropic API Key: " API_KEY
echo ""

if [ -z "$API_KEY" ]; then
    echo "❌ Error: API key cannot be empty"
    exit 1
fi

echo "🔑 API Key configured"
echo "🚀 Launching Sue in production..."
echo ""

# Export the API key and run the deployment
ANTHROPIC_API_KEY="$API_KEY" npx tsx deployments/sue-production-launch.ts

echo ""
echo "✨ Launch script complete!"