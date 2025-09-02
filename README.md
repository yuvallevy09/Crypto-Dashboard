# Crypto Dashboard

A personalized crypto investor dashboard that gets to know users through a short onboarding quiz and shows daily AI-curated content tailored to their interests. Users can give feedback (thumbs up/down) to help improve future recommendations. A fun meme is also shown dynamically each time the dashboard updates.

## 🚀 Features

- **Personalized Dashboard**: AI-curated content based on user preferences
- **User Onboarding**: Short quiz to understand user interests and investment style
- **Real-time Data**: Live cryptocurrency prices and market data
- **AI Insights**: Daily AI-generated market insights and analysis
- **Interactive Feedback**: Thumbs up/down system to improve recommendations
- **Fun Memes**: Dynamic crypto memes for entertainment
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (UI state) + TanStack Query (server state)
- **Charts**: Recharts
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT Bearer tokens (Authorization header)
- **Security**: Helmet, CORS, rate limiting (100 req/15m default)
- **Logging**: Pino
- **Deployment**: Railway

### Shared
- **Validation**: Zod schemas
- **Types**: Shared TypeScript interfaces
- **Constants**: Common configuration

### External APIs
- **Crypto Data**: CoinGecko API
- **News**: CryptoPanic API
- **AI**: OpenRouter
- **Memes**: Static JSON (with Reddit fallback)

## 📁 Project Structure

```
Crypto-Dashboard/
├── frontend/          # Next.js 15 application
├── backend/           # Express.js API server
├── shared/            # Shared types, schemas, and constants
├── package.json       # Root package.json for monorepo scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 9+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Crypto-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env

   # Frontend (create file)
   cat > frontend/.env.local << 'EOF'
   NEXT_PUBLIC_API_URL="http://localhost:5001"
   EOF
   ```

4. **Configure database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5001)

## 🔧 Development

### Available Scripts

#### Root (Monorepo)
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages
- `npm run lint` - Run linting for all packages
- `npm run type-check` - Run TypeScript type checking for all packages

#### Frontend
- `npm run dev:frontend` - Start Next.js development server
- `npm run build:frontend` - Build Next.js application
- `npm run lint:frontend` - Run ESLint
- `npm run type-check:frontend` - Run TypeScript type checking

#### Backend
- `npm run dev:backend` - Start Express development server
- `npm run build:backend` - Build Express application
- `npm run lint:backend` - Run ESLint
- `npm run type-check:backend` - Run TypeScript type checking
  - Database utilities:
    - `npm run db:generate` - Generate Prisma client
    - `npm run db:push` - Push schema to database
    - `npm run db:migrate` - Create/apply migrations (dev)
    - `npm run db:studio` - Open Prisma Studio
    - `npm run db:seed` - Seed database

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/crypto_dashboard"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# External APIs
COINGECKO_API_URL="https://api.coingecko.com/api/v3"
COINGECKO_API_KEY="your-coingecko-api-key"
CRYPTOPANIC_API_URL="https://cryptopanic.com/api/developer/v2/posts/"
CRYPTOPANIC_API_KEY="your-cryptopanic-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"

# Reddit API
REDDIT_CLIENT_ID="your-reddit-client-id"
REDDIT_CLIENT_SECRET="your-reddit-client-secret"
REDDIT_USER_AGENT="web:crypto-dashboard:v1.0.0 (by /u/your-reddit-username)"

# Server
PORT=5001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"
```

#### Frontend (.env.local)
```env
# API base URL
NEXT_PUBLIC_API_URL="http://localhost:5001"
```

## 📊 Database Schema (Prisma)

### User (`users`)
- `id` (String, cuid, PK)
- `email` (String, Unique)
- `name` (String)
- `passwordHash` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### UserPreferences (`user_preferences`)
- `id` (String, cuid, PK)
- `userId` (String, Unique, FK -> `User.id`)
- `cryptoInterests` (String[])
- `investorType` (String; one of: HODLER, DAY_TRADER, NFT_COLLECTOR, DEFI_USER, NEWBIE)
- `contentPreferences` (String[])
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Feedback (`feedback`)
- `id` (String, cuid, PK)
- `userId` (String, FK -> `User.id`)
- `contentType` (String; one of: NEWS, CHART, AI_INSIGHT, MEME)
- `contentId` (String)
- `rating` (String; one of: THUMBS_UP, THUMBS_DOWN)
- `createdAt` (DateTime)

Relations: `User` 1—1 `UserPreferences`, `User` 1—N `Feedback`.

Run in `backend/`:
```bash
npx prisma generate
npx prisma db push
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## 📡 API Reference

Base URL: `http://localhost:5001`

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/me` — Get current user (requires Bearer token)
- `POST /api/auth/logout` — Logout

Auth header for protected routes:
```http
Authorization: Bearer <token>
```

### Onboarding
- `POST /api/onboarding/preferences` — Save preferences (auth)
- `GET /api/onboarding/preferences` — Get preferences (auth)
- `GET /api/onboarding/status` — Check onboarding status (auth)

### Dashboard
- `GET /api/dashboard` — Aggregated data (auth)
- `POST /api/dashboard/feedback` — Submit feedback (auth)
- `GET /api/dashboard/chart-data/:coinId?days=7` — Historical chart data (auth)
- `GET /api/dashboard/meme?category=...&tags=tag1,tag2` — Meme (auth)
- `GET /api/dashboard/reddit-status` — Reddit API status (auth)
- `GET /api/dashboard/ai-insight` — AI insight only (auth)
- `GET /api/dashboard/openrouter-status` — OpenRouter status (auth)

### Health
- `GET /health` — Service health, uptime, timestamp

## 🔒 Security & Limits
- **CORS**: Allowed origin via `CORS_ORIGIN` (default `http://localhost:3000`)
- **Rate limiting**: `RATE_LIMIT_MAX_REQUESTS` per `RATE_LIMIT_WINDOW_MS` (defaults: 100 per 15m)
- **Auth**: JWT in `Authorization` header; tokens verified on each request

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com/) for cryptocurrency data
- [CryptoPanic](https://cryptopanic.com/) for crypto news
- [OpenRouter](https://openrouter.ai/) for AI insights
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
