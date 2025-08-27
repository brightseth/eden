#!/bin/bash

# MIYOMI Production Deployment Script
echo "🎯 Deploying MIYOMI Prediction Agent..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from project root"
    exit 1
fi

# 1. Run database migration
echo "📊 Setting up MIYOMI database tables..."
npx supabase db push --file supabase/migrations/014_miyomi_launch.sql

# 2. Set environment variables for production
echo "🔐 Configuring production environment..."

# Core Eden configuration
vercel env add EDEN_API_KEY production <<< "${EDEN_API_KEY:-db10962875d98d2a2dafa8599a89c850766f39647095c002}"
vercel env add EDEN_BASE_URL production <<< "https://eden-academy-flame.vercel.app"
vercel env add INTERNAL_API_TOKEN production <<< "miyomi-internal-2025-prod"

# Market API Keys (use placeholder values if not set)
vercel env add KALSHI_API_KEY production <<< "${KALSHI_API_KEY:-pending_kalshi_key}"
vercel env add POLYMARKET_API_KEY production <<< "${POLYMARKET_API_KEY:-pending_polymarket_key}" 
vercel env add MANIFOLD_API_KEY production <<< "${MANIFOLD_API_KEY:-pending_manifold_key}"
vercel env add MELEE_API_KEY production <<< "${MELEE_API_KEY:-pending_melee_key}"

# Anthropic for analysis
vercel env add ANTHROPIC_API_KEY production <<< "${ANTHROPIC_API_KEY:-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}"

# Cron secret for scheduled runs
CRON_SECRET=$(openssl rand -hex 32)
vercel env add CRON_SECRET production <<< "$CRON_SECRET"

# 3. Create Vercel cron job configuration
echo "⏰ Setting up automated scheduler..."
cat > vercel.json << 'EOF'
{
  "crons": [
    {
      "path": "/api/agents/miyomi/schedule",
      "schedule": "0 */4 * * *"
    }
  ],
  "functions": {
    "src/app/api/agents/miyomi/schedule/route.ts": {
      "maxDuration": 60
    },
    "src/app/api/agents/miyomi/picks/route.ts": {
      "maxDuration": 30
    }
  }
}
EOF

# 4. Deploy to production
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ MIYOMI deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Replace placeholder API keys with real ones in Vercel dashboard"
echo "2. Test the scheduler endpoint: /api/agents/miyomi/schedule"
echo "3. Monitor picks at: /sites/miyomi"
echo "4. Check performance at: /api/agents/miyomi/performance"
echo ""
echo "🔑 Cron Secret: $CRON_SECRET"
echo "(Save this for manual trigger testing)"