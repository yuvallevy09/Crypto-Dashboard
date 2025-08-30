// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserPreferences {
  userId: string;
  cryptoInterests: string[];
  investorType: InvestorType;
  contentPreferences: ContentPreference[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Enums
export enum InvestorType {
  HODLER = 'HODLER',
  DAY_TRADER = 'DAY_TRADER',
  NFT_COLLECTOR = 'NFT_COLLECTOR',
  DEFI_USER = 'DEFI_USER',
  NEWBIE = 'NEWBIE'
}

export enum ContentPreference {
  MARKET_NEWS = 'MARKET_NEWS',
  CHARTS = 'CHARTS',
  SOCIAL = 'SOCIAL',
  FUN = 'FUN',
  TECHNICAL_ANALYSIS = 'TECHNICAL_ANALYSIS',
  FUNDAMENTAL_ANALYSIS = 'FUNDAMENTAL_ANALYSIS'
}

export enum FeedbackType {
  THUMBS_UP = 'THUMBS_UP',
  THUMBS_DOWN = 'THUMBS_DOWN'
}

export enum ContentType {
  NEWS = 'NEWS',
  CHART = 'CHART',
  AI_INSIGHT = 'AI_INSIGHT',
  MEME = 'MEME'
}

// API Response types
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: Date | string;
  tags: string[];
  summary?: string;
}

export interface AIInsight {
  id: string;
  content: string;
  type: 'MARKET_ANALYSIS' | 'EDUCATIONAL' | 'PREDICTION' | 'TIPS';
  confidence: number;
  createdAt: Date | string;
}

export interface Meme {
  id: string;
  title: string;
  url: string;
  source: string;
  tags: string[];
}

export interface Feedback {
  id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  rating: FeedbackType;
  createdAt: Date | string;
}

// Dashboard types
export interface DashboardData {
  marketOverview: {
    totalMarketCap: number;
    totalVolume24h: number;
    marketCapChange24h: number;
    volumeChange24h: number;
  };
  trendingCoins: CoinData[];
  topGainers: CoinData[];
  news: NewsItem[];
  aiInsight: AIInsight;
  meme: Meme;
  coinPrices: CoinData[];
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Onboarding types
export interface OnboardingData {
  cryptoInterests: string[];
  investorType: InvestorType;
  contentPreferences: ContentPreference[];
}
