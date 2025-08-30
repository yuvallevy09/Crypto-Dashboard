import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  cryptoInterests: z.array(z.string()),
  investorType: z.enum(['HODLER', 'DAY_TRADER', 'NFT_COLLECTOR', 'DEFI_USER', 'NEWBIE']),
  contentPreferences: z.array(z.enum(['MARKET_NEWS', 'CHARTS', 'SOCIAL', 'FUN', 'TECHNICAL_ANALYSIS', 'FUNDAMENTAL_ANALYSIS'])),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Onboarding schemas
export const OnboardingSchema = z.object({
  cryptoInterests: z.array(z.string()).min(1, 'Select at least one crypto interest'),
  investorType: z.enum(['HODLER', 'DAY_TRADER', 'NFT_COLLECTOR', 'DEFI_USER', 'NEWBIE'], {
    required_error: 'Please select your investor type',
  }),
  contentPreferences: z.array(z.enum(['MARKET_NEWS', 'CHARTS', 'SOCIAL', 'FUN', 'TECHNICAL_ANALYSIS', 'FUNDAMENTAL_ANALYSIS'])).min(1, 'Select at least one content preference'),
});

// Feedback schemas
export const FeedbackSchema = z.object({
  contentType: z.enum(['NEWS', 'CHART', 'AI_INSIGHT', 'MEME']),
  contentId: z.string(),
  rating: z.enum(['THUMBS_UP', 'THUMBS_DOWN']),
});

// API Response schemas
export const CoinDataSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string().url(),
  current_price: z.number(),
  market_cap: z.number(),
  market_cap_rank: z.number(),
  total_volume: z.number(),
  high_24h: z.number(),
  low_24h: z.number(),
  price_change_24h: z.number(),
  price_change_percentage_24h: z.number(),
  price_change_percentage_1h_in_currency: z.number().optional(),
  price_change_percentage_7d_in_currency: z.number().optional(),
  sparkline_in_7d: z.object({
    price: z.array(z.number()),
  }).optional(),
});

export const NewsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  publishedAt: z.date(),
  tags: z.array(z.string()),
  summary: z.string().optional(),
});

export const AIInsightSchema = z.object({
  id: z.string(),
  content: z.string(),
  type: z.enum(['MARKET_ANALYSIS', 'EDUCATIONAL', 'PREDICTION', 'TIPS']),
  confidence: z.number().min(0).max(1),
  createdAt: z.date(),
});

export const MemeSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  tags: z.array(z.string()),
});

// Dashboard schema
export const DashboardDataSchema = z.object({
  marketOverview: z.object({
    totalMarketCap: z.number(),
    totalVolume24h: z.number(),
    marketCapChange24h: z.number(),
    volumeChange24h: z.number(),
  }),
  trendingCoins: z.array(CoinDataSchema),
  topGainers: z.array(CoinDataSchema),
  news: z.array(NewsItemSchema),
  aiInsight: AIInsightSchema,
  meme: MemeSchema,
  coinPrices: z.array(CoinDataSchema),
});
