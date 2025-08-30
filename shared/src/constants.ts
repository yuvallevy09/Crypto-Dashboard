// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  ONBOARDING: {
    SAVE_PREFERENCES: '/api/onboarding/preferences',
  },
  DASHBOARD: {
    DATA: '/api/dashboard',
    FEEDBACK: '/api/dashboard/feedback',
  },
} as const;

// External API URLs
export const EXTERNAL_APIS = {
  COINGECKO: {
    BASE_URL: 'https://api.coingecko.com/api/v3',
    COINS_MARKET: '/coins/markets',
    GLOBAL_DATA: '/global',
    COIN_DETAILS: '/coins',
  },
  CRYPTOPANIC: {
    BASE_URL: 'https://cryptopanic.com/api/v1',
    NEWS: '/posts',
  },
  OPENROUTER: {
    BASE_URL: 'https://openrouter.ai/api/v1',
    CHAT: '/chat/completions',
  },
} as const;

// Investor Types for onboarding
export const INVESTOR_TYPES = [
  {
    value: 'HODLER',
    label: 'HODLer',
    description: 'Long-term holder who believes in the fundamentals',
    icon: '💎',
  },
  {
    value: 'DAY_TRADER',
    label: 'Day Trader',
    description: 'Active trader looking for short-term opportunities',
    icon: '📈',
  },
  {
    value: 'NFT_COLLECTOR',
    label: 'NFT Collector',
    description: 'Interested in digital art and collectibles',
    icon: '🎨',
  },
  {
    value: 'DEFI_USER',
    label: 'DeFi User',
    description: 'Focused on decentralized finance protocols',
    icon: '🏦',
  },
  {
    value: 'NEWBIE',
    label: 'Newbie',
    description: 'Just getting started with crypto',
    icon: '🌱',
  },
] as const;

// Content Preferences
export const CONTENT_PREFERENCES = [
  {
    value: 'MARKET_NEWS',
    label: 'Market News',
    description: 'Latest crypto market updates and breaking news',
    icon: '📰',
  },
  {
    value: 'CHARTS',
    label: 'Charts & Analysis',
    description: 'Technical charts and price analysis',
    icon: '📊',
  },
  {
    value: 'SOCIAL',
    label: 'Social Sentiment',
    description: 'Community discussions and social media trends',
    icon: '💬',
  },
  {
    value: 'FUN',
    label: 'Fun Content',
    description: 'Memes, jokes, and entertaining crypto content',
    icon: '😂',
  },
  {
    value: 'TECHNICAL_ANALYSIS',
    label: 'Technical Analysis',
    description: 'Deep technical analysis and trading signals',
    icon: '🔬',
  },
  {
    value: 'FUNDAMENTAL_ANALYSIS',
    label: 'Fundamental Analysis',
    description: 'Project fundamentals and long-term analysis',
    icon: '📋',
  },
] as const;

// Popular Cryptocurrencies for onboarding
export const POPULAR_CRYPTOS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', icon: '🟡' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: '₳' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', icon: '✖' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', icon: '●' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', icon: 'Ð' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', icon: '❄' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', icon: '🔗' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '🔷' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', icon: '🦄' },
] as const;

// Default dashboard settings
export const DASHBOARD_DEFAULTS = {
  COINS_PER_PAGE: 10,
  NEWS_PER_PAGE: 5,
  TRENDING_COINS_COUNT: 3,
  TOP_GAINERS_COUNT: 3,
  CHART_DAYS: 7,
  REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
    UNAUTHORIZED: 'You must be logged in to access this resource',
    TOKEN_EXPIRED: 'Session expired, please login again',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    NAME_TOO_LONG: 'Name must be less than 100 characters',
  },
  API: {
    FETCH_FAILED: 'Failed to fetch data',
    RATE_LIMIT: 'Too many requests, please try again later',
    SERVER_ERROR: 'Server error, please try again later',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Successfully logged in',
    REGISTER_SUCCESS: 'Account created successfully',
    LOGOUT_SUCCESS: 'Successfully logged out',
  },
  ONBOARDING: {
    PREFERENCES_SAVED: 'Preferences saved successfully',
  },
  FEEDBACK: {
    SUBMITTED: 'Thank you for your feedback!',
  },
} as const;
