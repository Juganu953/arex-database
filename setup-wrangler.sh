#!/bin/bash

echo "🔧 Setting up Cloudflare Pages deployment..."

# Build the project
npm run build

# Create _routes.json for SPA
cat > dist/_routes.json << 'ROUTES'
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/assets/*"]
}
ROUTES

echo "✅ Build complete!"
echo ""
echo "📋 To deploy:"
echo ""
echo "1. Get Cloudflare API token from:"
echo "   https://dash.cloudflare.com/profile/api-tokens"
echo ""
echo "2. Authenticate:"
echo "   wrangler config --api-token YOUR_TOKEN"
echo ""
echo "3. Deploy:"
echo "   wrangler pages deploy dist --project-name=juganu953-ex"
echo ""
echo "📦 Alternative: Upload manually at:"
echo "   https://dash.cloudflare.com/?to=/:account/pages"
