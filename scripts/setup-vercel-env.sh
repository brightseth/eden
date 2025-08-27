#!/bin/bash

# Setup Vercel production environment variables for MIYOMI

echo "Setting up MIYOMI production environment variables..."

# Core Eden and MIYOMI configuration
vercel env add EDEN_API_KEY production <<< "db10962875d98d2a2dafa8599a89c850766f39647095c002"
vercel env add EDEN_BASE_URL production <<< "https://eden-academy-iezgyswav-edenprojects.vercel.app"
vercel env add INTERNAL_API_TOKEN production <<< "miyomi-prod-2025-secure"

# Registry configuration (using existing values from .env.local)
vercel env add REGISTRY_BASE_URL production <<< "https://registry.eden.art/api/v1"
vercel env add REGISTRY_API_KEY production <<< "registry-upload-key-v1"

# Payment processing placeholders (replace with actual keys when available)
vercel env add COINBASE_COMMERCE_API_KEY production <<< "pending_coinbase_key"
vercel env add COINBASE_COMMERCE_WEBHOOK_SECRET production <<< "pending_webhook_secret"

# Market API placeholders (replace with actual keys when available)
vercel env add KALSHI_API_KEY production <<< "pending_kalshi_key"
vercel env add MELEE_API_KEY production <<< "pending_melee_key"

echo "Environment variables set! Now redeploy with: vercel --prod"
echo ""
echo "Note: Remember to replace the pending_* values with actual API keys when available."