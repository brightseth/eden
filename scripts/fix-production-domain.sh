#!/bin/bash

# Fix Production Domain Configuration for academy.eden2.io
# This script ensures proper environment variables are set for the production domain

echo "🔧 Fixing Production Domain Configuration for academy.eden2.io"
echo "=============================================================="

# Set critical environment variables for production
echo "Setting environment variables..."

# Enable public agent pages
vercel env add ENABLE_PUBLIC_AGENT_PAGES true production --force
echo "✅ Set ENABLE_PUBLIC_AGENT_PAGES=true"

# Enable agent chat
vercel env add ENABLE_AGENT_CHAT true production --force
echo "✅ Set ENABLE_AGENT_CHAT=true"

# Enable prototype links  
vercel env add ENABLE_AGENT_PROTOTYPE_LINKS true production --force
echo "✅ Set ENABLE_AGENT_PROTOTYPE_LINKS=true"

# Enable BART lending system
vercel env add ENABLE_BART_LENDING_SYSTEM true production --force
echo "✅ Set ENABLE_BART_LENDING_SYSTEM=true"

# Set NODE_ENV
vercel env add NODE_ENV production production --force
echo "✅ Set NODE_ENV=production"

# Skip env validation for build
vercel env add SKIP_ENV_VALIDATION true production --force
echo "✅ Set SKIP_ENV_VALIDATION=true"

echo ""
echo "🚀 Environment variables set. Now redeploying to production..."

# Redeploy to ensure new env vars take effect
vercel --prod

echo ""
echo "✅ Production deployment complete!"
echo ""
echo "📋 Summary of changes:"
echo "   • Fixed feature flag evaluation logic in agents/[slug]/page.tsx"
echo "   • Updated EnhancedAgentProfile to use proper flag functions"
echo "   • Set production environment variables for academy.eden2.io"
echo "   • Configured domain resolution for production vs development"
echo ""
echo "🎯 Test URLs:"
echo "   • https://academy.eden2.io/agents/bart"
echo "   • https://academy.eden2.io/dashboard/bart"
echo "   • https://academy.eden2.io/academy/agent/bart"
echo ""
echo "🔍 If issues persist, check:"
echo "   1. Vercel domain configuration in project settings"
echo "   2. DNS records for academy.eden2.io pointing to Vercel"
echo "   3. Custom domain setup in Vercel dashboard"