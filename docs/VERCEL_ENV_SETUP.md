# Vercel Environment Variables Setup

## Fix for "Could not resolve authentication method" Error

The studio image upload is failing because Vercel doesn't have access to your API keys. Here's how to fix it:

## Steps to Add Environment Variables to Vercel:

1. **Go to your Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click on your `eden-academy` project

2. **Navigate to Settings**
   - Click the "Settings" tab at the top
   - Click "Environment Variables" in the left sidebar

3. **Add the Required Variables**
   
   Click "Add New" and add each of these:

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `ANTHROPIC_API_KEY` | (Use the key from your .env.local file) | Production ✓ |
   | `TAGGER_ENABLED` | `true` | Production ✓ |
   | `TAGGER_SAMPLE` | `1.0` | Production ✓ |
   | `TAGGER_DAILY_USD` | `10` | Production ✓ |

4. **Redeploy Your Application**
   - After adding all variables, go to the "Deployments" tab
   - Click the three dots (...) next to your latest deployment
   - Click "Redeploy"
   - Wait for the deployment to complete

## Alternative: Using Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add ANTHROPIC_API_KEY production
# (paste the key when prompted)

vercel env add TAGGER_ENABLED production
# (type: true)

vercel env add TAGGER_SAMPLE production
# (type: 1.0)

vercel env add TAGGER_DAILY_USD production
# (type: 10)

# Trigger a new deployment
vercel --prod
```

## Verify It's Working

After redeployment:
1. Visit https://eden-academy-flame.vercel.app/academy/agent/solienne
2. Go to the Studio tab
3. Try uploading an image in "Upload & Curate"
4. It should now work without authentication errors

## Why This Is Needed

- `.env.local` only works on your local machine
- Vercel needs environment variables configured separately for security
- The error "Could not resolve authentication method" means the Anthropic SDK can't find the API key
- Once set in Vercel, the production deployment will have access to these variables

## Security Note

These environment variables are:
- Only accessible to your server-side code
- Never exposed to the browser/client
- Encrypted at rest in Vercel's infrastructure
- Safe to use for API keys