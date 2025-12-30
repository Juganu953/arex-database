#!/bin/bash

# Setup script for AREX Database Project

echo "=== AREX Database Setup ==="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set. Please set it first:"
    echo "export DATABASE_URL=\"your_postgres_url_here\""
    exit 1
fi

echo "1. Installing dependencies..."
npm install

echo "2. Generating Prisma Client..."
npx prisma generate

echo "3. Running database summary..."
npm run db:summary

echo "4. Starting development server..."
echo ""
echo "To start the server manually: npm run dev"
echo "API will be available at: http://localhost:3000"
echo ""
echo "Available endpoints:"
echo "  GET /api/health      - Health check"
echo "  GET /api/users       - List all users"
echo "  GET /api/plans       - List all plans"
echo "  POST /api/users      - Create new user"
echo ""
echo "=== Setup Complete ==="
