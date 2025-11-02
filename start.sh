#!/bin/bash
# Simple launcher for Balance Agent
# Just runs: npm run dev

echo "🚀 Starting Balance Agent..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating one from .env.example..."
    cp .env.example .env
    echo "✅ Created .env - Please add your OPENAI_API_KEY and run again"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "apps/server/node_modules" ] || [ ! -d "apps/client/node_modules" ]; then
    echo "📦 Installing dependencies (first time only)..."
    npm install
    cd apps/server && npm install && cd ../..
    cd apps/client && npm install && cd ../..
    echo "✅ Dependencies installed!"
fi

echo "🎯 Starting both servers..."
npm run dev
