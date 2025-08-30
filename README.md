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
- **Framework**: Next.js 14 (App Router)
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
- **Authentication**: JWT with httpOnly cookies
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: Railway

### Shared
- **Validation**: Zod schemas
- **Types**: Shared TypeScript interfaces
- **Constants**: Common configuration

### External APIs
- **Crypto Data**: CoinGecko API
- **News**: CryptoPanic API
- **AI**: OpenRouter or Hugging Face Inference API
- **Memes**: Static JSON (with Reddit fallback)

## 📁 Project Structure

```
Crypto-Dashboard/
├── frontend/          # Next.js 14 application
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
   # Copy example environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
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

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000)

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

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/crypto_dashboard"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# External APIs
COINGECKO_API_KEY="your-coingecko-api-key"
CRYPTOPANIC_API_KEY="your-cryptopanic-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env.local)
```env
# API
NEXT_PUBLIC_API_URL="http://localhost:5000"

# External APIs (if needed on frontend)
NEXT_PUBLIC_COINGECKO_API_KEY="your-coingecko-api-key"
```

## 📊 Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `password_hash` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### User Preferences
- `user_id` (UUID, Foreign Key)
- `crypto_interests` (String Array)
- `investor_type` (Enum)
- `content_preferences` (String Array)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Feedback
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `content_type` (Enum)
- `content_id` (String)
- `rating` (Enum: THUMBS_UP/THUMBS_DOWN)
- `created_at` (DateTime)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

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
