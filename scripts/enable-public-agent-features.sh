#!/bin/bash

# Enable Public Agent Features for Eden Academy
# This script configures Vercel environment variables for public agent pages and chat

echo "🚀 Enabling Public Agent Features for Eden Academy"
echo "================================================="

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Verify we're in the right project
echo "🔍 Linking to Vercel project..."
vercel link --yes

echo ""
echo "🎛️ Setting feature flags for public agent access..."

# Enable public agent pages
echo "✅ Enabling public agent pages..."
echo "true" | vercel env add ENABLE_PUBLIC_AGENT_PAGES production

# Enable agent chat
echo "✅ Enabling agent chat..."
echo "true" | vercel env add ENABLE_AGENT_CHAT production

# Configure chat settings
echo "✅ Setting chat rate limiting (default: enabled)..."
echo "true" | vercel env add ENABLE_CHAT_RATE_LIMITING production

echo "✅ Setting chat session management (default: enabled)..."
echo "true" | vercel env add ENABLE_CHAT_SESSION_MANAGEMENT production

# Configure chat parameters
echo "✅ Configuring chat timeout (30 seconds)..."
echo "30000" | vercel env add CHAT_TIMEOUT production

echo "✅ Configuring chat rate limit (10 messages per window)..."
echo "10" | vercel env add CHAT_RATE_LIMIT production

echo "✅ Configuring chat rate window (10 minutes)..."
echo "600000" | vercel env add CHAT_RATE_WINDOW production

echo "✅ Configuring chat session TTL (1 hour)..."
echo "3600000" | vercel env add CHAT_SESSION_TTL production

echo "✅ Configuring max message length (500 characters)..."
echo "500" | vercel env add CHAT_MAX_LENGTH production

echo "✅ Configuring gallery page size (12 works)..."
echo "12" | vercel env add GALLERY_PAGE_SIZE production

echo ""
echo "🎭 All 8 agents will be available at:"
echo "   • https://eden-academy-flame.vercel.app/agents/abraham"
echo "   • https://eden-academy-flame.vercel.app/agents/solienne" 
echo "   • https://eden-academy-flame.vercel.app/agents/citizen"
echo "   • https://eden-academy-flame.vercel.app/agents/bertha"
echo "   • https://eden-academy-flame.vercel.app/agents/miyomi"
echo "   • https://eden-academy-flame.vercel.app/agents/geppetto"
echo "   • https://eden-academy-flame.vercel.app/agents/koru"
echo "   • https://eden-academy-flame.vercel.app/agents/sue"

echo ""
echo "🚀 Triggering production deployment..."
vercel --prod

echo ""
echo "✨ Public agent features are now enabled!"
echo ""
echo "📋 Summary of changes:"
echo "   ✅ Public agent pages enabled"
echo "   ✅ Interactive chat enabled for all 8 agents"
echo "   ✅ Rate limiting configured (10 messages/10 minutes)"
echo "   ✅ Session management enabled"
echo "   ✅ Production deployment triggered"
echo ""
echo "🎯 Next steps:"
echo "   1. Wait for deployment to complete (~2-3 minutes)"
echo "   2. Test agent pages are accessible"
echo "   3. Test chat functionality"
echo "   4. Verify rate limiting works"
echo ""
echo "🔧 If you need to disable features quickly:"
echo "   vercel env add ENABLE_PUBLIC_AGENT_PAGES false production"
echo "   vercel env add ENABLE_AGENT_CHAT false production"
echo "   vercel --prod"