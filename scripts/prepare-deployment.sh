#!/bin/bash

echo "🚀 Preparing Crypto Dashboard for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm run install:all

echo "🔍 Running type checks..."
npm run type-check

echo "🧹 Running linter..."
npm run lint

echo "🏗️ Building applications..."
npm run build

echo "✅ Build completed successfully!"

echo ""
echo "🎯 Next steps for deployment:"
echo "1. Deploy backend to Railway:"
echo "   - Create new Railway project"
echo "   - Connect to GitHub repository"
echo "   - Set backend directory as source"
echo "   - Add PostgreSQL database"
echo "   - Configure environment variables"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   - Import GitHub repository"
echo "   - Set frontend directory as root"
echo "   - Configure environment variables"
echo "   - Deploy"
echo ""
echo "3. Update CORS settings:"
echo "   - Update Railway backend with Vercel frontend URL"
echo "   - Redeploy backend"
echo ""
echo "📋 Environment variables needed:"
echo "Backend (Railway):"
echo "- DATABASE_URL (auto-set by Railway)"
echo "- JWT_SECRET (generate secure key)"
echo "- JWT_EXPIRES_IN=7d"
echo "- PORT=5001"
echo "- NODE_ENV=production"
echo "- CORS_ORIGIN (Vercel URL after deployment)"
echo "- All API keys (CoinGecko, CryptoPanic, OpenRouter, Reddit)"
echo ""
echo "Frontend (Vercel):"
echo "- NEXT_PUBLIC_API_URL (Railway backend URL)"
echo ""
echo "🔗 Useful URLs:"
echo "- Railway Dashboard: https://railway.app/dashboard"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Health Check: https://your-app.railway.app/health"

echo ""
echo "✨ Deployment preparation complete!"
