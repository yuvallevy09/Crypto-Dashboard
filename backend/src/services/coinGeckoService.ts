import axios from 'axios';
import { CoinData } from '@crypto-dashboard/shared';
import logger from '../config/logger';

interface CoinGeckoConfig {
  baseURL: string;
  apiKey?: string;
  rateLimit: {
    callsPerMinute: number;
    windowMs: number;
  };
}

class RateLimiter {
  private calls: number[] = [];
  private maxCalls: number;
  private windowMs: number;

  constructor(maxCalls: number, windowMs: number) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    // Remove calls outside the window
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    
    if (this.calls.length >= this.maxCalls) {
      const oldestCall = this.calls[0];
      if (oldestCall) {
        const waitTime = this.windowMs - (now - oldestCall);
        logger.warn(`Rate limit reached. Waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.calls.push(now);
  }
}

// Simple in-memory cache for API responses
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export class CoinGeckoService {
  private config: CoinGeckoConfig;
  private rateLimiter: RateLimiter;
  private cache: APICache;
  private axiosInstance: any;

  constructor() {
    this.config = {
      baseURL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
      apiKey: process.env.COINGECKO_API_KEY,
      rateLimit: {
        callsPerMinute: 30, // Demo plan limit
        windowMs: 60000, // 1 minute
      },
    };

    this.rateLimiter = new RateLimiter(
      this.config.rateLimit.callsPerMinute,
      this.config.rateLimit.windowMs
    );

    this.cache = new APICache();

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'x-cg-demo-api-key': this.config.apiKey }),
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 429) {
          logger.error('CoinGecko API rate limit exceeded');
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        if (error.response?.status === 403) {
          logger.error('CoinGecko API key invalid or expired');
          throw new Error('API authentication failed');
        }
        throw error;
      }
    );
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}, cacheKey?: string, cacheTTL: number = 60000): Promise<any> {
    // Check cache first
    if (cacheKey) {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        logger.info(`Cache hit for ${cacheKey}`);
        return cachedData;
      }
    }

    await this.rateLimiter.checkLimit();
    
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      const data = response.data;
      
      // Cache the response
      if (cacheKey) {
        this.cache.set(cacheKey, data, cacheTTL);
        logger.info(`Cached response for ${cacheKey}`);
      }
      
      return data;
    } catch (error: any) {
      logger.error('CoinGecko API request failed:', {
        endpoint,
        error: error.message,
        status: error.response?.status,
      });
      throw error;
    }
  }

  async getTopCoins(limit: number = 10, currency: string = 'usd'): Promise<CoinData[]> {
    try {
      const cacheKey = `top_coins_${limit}_${currency}`;
      const data = await this.makeRequest('/coins/markets', {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: '1h,24h,7d',
      }, cacheKey, 30000); // Cache for 30 seconds

      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
        sparkline_in_7d: coin.sparkline_in_7d,
      }));
    } catch (error) {
      logger.error('Failed to fetch top coins:', error);
      throw error;
    }
  }

  async getTrendingCoins(): Promise<CoinData[]> {
    try {
      const trendingCacheKey = 'trending_coins';
      const data = await this.makeRequest('/search/trending', {}, trendingCacheKey, 60000); // Cache for 1 minute
      
      // Get detailed data for trending coins
      const coinIds = data.coins.map((coin: any) => coin.item.id).join(',');
      const detailedCacheKey = `trending_detailed_${coinIds}`;
      const detailedData = await this.makeRequest('/coins/markets', {
        ids: coinIds,
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '1h,24h,7d',
      }, detailedCacheKey, 30000); // Cache for 30 seconds

      return detailedData.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      }));
    } catch (error) {
      logger.error('Failed to fetch trending coins:', error);
      throw error;
    }
  }

  async getTopGainers(limit: number = 5): Promise<CoinData[]> {
    try {
      const cacheKey = `top_gainers_${limit}`;
      const data = await this.makeRequest('/coins/markets', {
        vs_currency: 'usd',
        order: 'price_change_percentage_24h_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
        price_change_percentage: '1h,24h,7d',
      }, cacheKey, 30000); // Cache for 30 seconds

      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      }));
    } catch (error) {
      logger.error('Failed to fetch top gainers:', error);
      throw error;
    }
  }

  async getGlobalData(): Promise<{
    totalMarketCap: number;
    totalVolume24h: number;
    marketCapChange24h: number;
    volumeChange24h: number;
  }> {
    try {
      const cacheKey = 'global_data';
      const data = await this.makeRequest('/global', {}, cacheKey, 60000); // Cache for 1 minute
      
      return {
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume24h: data.data.total_volume.usd,
        marketCapChange24h: data.data.market_cap_change_percentage_24h_usd,
        volumeChange24h: data.data.total_volume.usd_24h_change,
      };
    } catch (error) {
      logger.error('Failed to fetch global data:', error);
      throw error;
    }
  }

  async getCoinById(coinId: string): Promise<CoinData> {
    try {
      const data = await this.makeRequest(`/coins/${coinId}`, {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true,
      });

      return {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: data.image.large,
        current_price: data.market_data.current_price.usd,
        market_cap: data.market_data.market_cap.usd,
        market_cap_rank: data.market_cap_rank,
        total_volume: data.market_data.total_volume.usd,
        high_24h: data.market_data.high_24h.usd,
        low_24h: data.market_data.low_24h.usd,
        price_change_24h: data.market_data.price_change_24h,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        price_change_percentage_1h_in_currency: data.market_data.price_change_percentage_1h_in_currency?.usd,
        price_change_percentage_7d_in_currency: data.market_data.price_change_percentage_7d_in_currency?.usd,
        sparkline_in_7d: data.market_data.sparkline_7d,
      };
    } catch (error) {
      logger.error(`Failed to fetch coin ${coinId}:`, error);
      throw error;
    }
  }

  async getHistoricalData(coinId: string, days: number, currency: string = 'usd'): Promise<{
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
  }> {
    try {
      const cacheKey = `historical_${coinId}_${days}_${currency}`;
      const data = await this.makeRequest(`/coins/${coinId}/market_chart`, {
        vs_currency: currency,
        days: days.toString(),
      }, cacheKey, 300000); // Cache for 5 minutes (historical data doesn't change as frequently)

      return {
        prices: data.prices,
        market_caps: data.market_caps,
        total_volumes: data.total_volumes,
      };
    } catch (error) {
      logger.error(`Failed to fetch historical data for ${coinId}:`, error);
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.makeRequest('/ping');
      return true;
    } catch (error) {
      logger.error('CoinGecko API ping failed:', error);
      return false;
    }
  }
}

export const coinGeckoService = new CoinGeckoService();
