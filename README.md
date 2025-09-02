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
- **Memes**: Reddit API (OAuth) with curated static fallback

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


### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Configure settings: 
- Root Directory: root
- Build Command: npm run build:backend
- Start Command: cd backend && npm run start
- Providers: Node
3. Set environment variables in Railway dashboard (set CORS_ORGIN temporarily to http://localhost:3000)
4. Deploy automatically on push to main branch
5. After Frontend is set up, change CORS_ORGIN to frontend url

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure settings: 
- Root Directory: frontend
- Install Command: npm install
- Build Command: npm run build
- Output Directory: .next
- Development Command: npm run dev
- Node.js: 20.x
3. Set environment variables in Vercel dashboard (with backend url from Railway)
4. Deploy automatically on push to main branch


### Health
- `GET /health` — Service health, uptime, timestamp

## 🔒 Security & Limits
- **CORS**: Allowed origin via `CORS_ORIGIN` (default `http://localhost:3000`)
- **Rate limiting**: `RATE_LIMIT_MAX_REQUESTS` per `RATE_LIMIT_WINDOW_MS` (defaults: 100 per 15m)
- **Auth**: JWT in `Authorization` header; tokens verified on each request

## 🖼️ Reddit Meme Scraping
- The app fetches crypto memes from Reddit using OAuth via the following subreddits: `r/cryptocurrencymemes`, `r/bitcoinmemes`, `r/cryptomemes`.
- Configure credentials in backend `.env`: `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`.
- If Reddit credentials are missing or Reddit calls fail, the service falls back to a curated static set of memes.
- Filtering: image-only posts (jpg/png/gif/jpeg, `i.redd.it`, `imgur.com`, non-video, non-nsfw/default thumbnails).
- Endpoints: `GET /api/dashboard/meme` returns either a Reddit meme (if available) or a curated meme; `GET /api/dashboard/reddit-status` reports configuration/auth status.


