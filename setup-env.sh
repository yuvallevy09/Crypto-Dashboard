#!/bin/bash

# Crypto Dashboard Environment Setup Script
echo "🚀 Setting up Crypto Dashboard environment variables..."

# Check if backend/.env exists, if not copy from example
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env from example..."
    cp backend/env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "ℹ️  Backend .env file already exists"
fi

# Check if frontend/.env.local exists, if not create it
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend/.env.local..."
    cat > frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:5001"

# External APIs (if needed on frontend)
NEXT_PUBLIC_COINGECKO_API_KEY=""
EOF
    echo "✅ Frontend .env.local file created"
else
    echo "ℹ️  Frontend .env.local file already exists"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Edit backend/.env and add your CryptoPanic API key:"
echo "   CRYPTOPANIC_API_KEY=\"720051df664e283b15046db74a19facb5f7b4d11\""
echo ""
echo "2. Update other environment variables as needed:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - JWT_SECRET (random secret for JWT tokens)"
echo "   - Other API keys (CoinGecko, OpenRouter, etc.)"
echo ""
echo "3. Install dependencies:"
echo "   npm run install:all"
echo ""
echo "4. Set up the database:"
echo "   cd backend && npx prisma db push"
echo ""
echo "5. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🎯 Test the CryptoPanic integration:"
echo "   - Visit http://localhost:3000/test-cryptopanic"
echo "   - Check the dashboard for real news data"
echo ""
echo "⚠️  Remember: Your API key is already at 53/100 requests used!"
echo "   The service includes caching to minimize API calls."
