#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found after build!"
    exit 1
fi

echo "Build complete! Files in dist/:"
ls -la dist/

echo ""
echo "To deploy:"
echo "1. Ensure you're authenticated with Cloudflare:"
echo "   wrangler config --api-token AIzaSyCMZYFO1EWfYycglvDNdFii-Tcz8gMltnY"
echo ""
echo "2. Then run:"
echo "   wrangler pages deploy dist --project-name=juganu953-ex"
echo ""
echo "3. Or upload manually:"
echo "   cd dist && zip -r ../deployment.zip ."
echo "   Upload deployment.zip to Cloudflare Pages dashboard"
