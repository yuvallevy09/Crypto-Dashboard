# Crypto Dashboard

A personalized cryptocurrency dashboard that provides real-time market data, news, and AI-generated insights. Users complete an onboarding process to customize their experience and can provide feedback on content to improve future recommendations.

## Features

### User Management
- User registration and authentication with JWT
- Secure password handling with bcrypt
- User preferences storage and management

### Onboarding Process
- Multi-step questionnaire to understand user interests
- Crypto asset selection from popular cryptocurrencies
- Investor type classification (HODLER, DAY_TRADER, NFT_COLLECTOR, DEFI_USER, NEWBIE)
- Content preference selection (Market News, Charts, Social, Fun, Technical Analysis, Fundamental Analysis)

### Dashboard Components
- **Market Overview**: Global market statistics and trends
- **Coin Prices**: Real-time cryptocurrency price data with 24h changes
- **News Feed**: Latest crypto news from CryptoPanic API
- **AI Insights**: Daily AI-generated market analysis using OpenRouter
- **Interactive Charts**: Price charts for selected cryptocurrencies
- **Crypto Memes**: Entertainment content with Reddit integration
- **Feedback System**: Thumbs up/down voting on content

### Technical Features
- Real-time data fetching with automatic fallbacks
- Responsive design for desktop and mobile
- Error handling and loading states
- Rate limiting and security middleware

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, Zustand for UI state
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Pino for structured logging

### External APIs
- **CoinGecko**: Cryptocurrency price and market data
- **CryptoPanic**: Crypto news and market sentiment
- **OpenRouter**: AI-generated market insights
- **Reddit**: Meme content (with fallback to static data)

### Infrastructure
- **Validation**: Shared Zod schemas across frontend and backend
- **Types**: Shared TypeScript interfaces
- **Deployment**: Vercel (frontend), Railway (backend)

## Project Structure

```
Crypto-Dashboard/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # UI components
│   │   └── lib/             # Utilities and configurations
│   └── package.json
├── backend/                  # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic and external API integration
│   │   └── config/          # Configuration files
│   ├── prisma/              # Database schema
│   └── package.json
├── shared/                   # Shared types and schemas
│   ├── src/
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── schemas.ts       # Zod validation schemas
│   │   └── constants.ts     # Shared constants
│   └── package.json
└── package.json             # Root monorepo configuration
```

## Getting Started

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
   cp backend/env.example backend/.env
   cp frontend/env.production.example frontend/.env.local
   ```

4. **Configure the backend environment** (`backend/.env`)
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/crypto_dashboard"
   JWT_SECRET="your-jwt-secret"
   COINGECKO_API_KEY="your-coingecko-api-key"
   CRYPTOPANIC_API_KEY="your-cryptopanic-api-key"
   OPENROUTER_API_KEY="your-openrouter-api-key"
   PORT=5000
   NODE_ENV=development
   ```

5. **Configure the frontend environment** (`frontend/.env.local`)
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000"
   ```

6. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

7. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Development

### Available Scripts

**Root (Monorepo)**
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both for production
npm run install:all      # Install all dependencies
npm run lint             # Lint all packages
npm run type-check       # TypeScript check all packages
```

**Frontend**
```bash
npm run dev:frontend     # Start Next.js dev server
npm run build:frontend   # Build for production
npm run lint:frontend    # Run ESLint
```

**Backend**
```bash
npm run dev:backend      # Start Express dev server
npm run build:backend    # Build for production
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
```

## API Endpoints

### Authentication
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/logout       # User logout
GET    /api/auth/me           # Get current user
```

### Onboarding
```
POST   /api/onboarding/preferences  # Save user preferences
GET    /api/onboarding/status       # Check onboarding status
```

### Dashboard
```
GET    /api/dashboard              # Get dashboard data
POST   /api/dashboard/feedback     # Submit user feedback
GET    /api/dashboard/chart-data/:coinId  # Get chart data
GET    /api/dashboard/meme         # Get meme content
GET    /api/dashboard/ai-insight   # Get AI insight
```

### Health Check
```
GET    /health                     # API health status
```

## Database Schema

### Users
```sql
users (
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  passwordHash  String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
)
```

### User Preferences
```sql
user_preferences (
  id                 String   @id @default(cuid())
  userId             String   @unique
  cryptoInterests    String[] # Array of crypto IDs
  investorType       String   # HODLER, DAY_TRADER, NFT_COLLECTOR, DEFI_USER, NEWBIE
  contentPreferences String[] # Array of content preferences
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
)
```

### Feedback
```sql
feedback (
  id          String   @id @default(cuid())
  userId      String
  contentType String   # NEWS, CHART, AI_INSIGHT, MEME
  contentId   String
  rating      String   # THUMBS_UP, THUMBS_DOWN
  createdAt   DateTime @default(now())
)
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables
4. Deploy automatically on push to main branch

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Add PostgreSQL database service
3. Configure environment variables including `DATABASE_URL`
4. Deploy automatically on push to main branch

## Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Input validation with Zod schemas
- SQL injection protection via Prisma ORM

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [CoinGecko](https://coingecko.com/) for cryptocurrency data
- [CryptoPanic](https://cryptopanic.com/) for crypto news
- [OpenRouter](https://openrouter.ai/) for AI insights
- [shadcn/ui](https://ui.shadcn.com/) for UI components
