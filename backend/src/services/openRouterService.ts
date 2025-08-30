import axios from 'axios';
import { AIInsight } from '@crypto-dashboard/shared';
import logger from '../config/logger';

interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
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
        logger.warn(`OpenRouter rate limit reached. Waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.calls.push(now);
  }
}

// Simple in-memory cache for API responses
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 3600000): void { // Default 1 hour cache
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

export class OpenRouterService {
  private config: OpenRouterConfig;
  private rateLimiter: RateLimiter;
  private cache: APICache;
  private axiosInstance: any;

  constructor() {
    this.config = {
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseURL: 'https://openrouter.ai/api/v1',
      rateLimit: {
        callsPerMinute: 20, // Free model limit
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
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': process.env.CORS_ORIGIN || 'http://localhost:3000',
        'X-Title': 'Crypto Dashboard',
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 429) {
          logger.error('OpenRouter API rate limit exceeded');
          throw new Error('AI service rate limit exceeded. Please try again later.');
        }
        if (error.response?.status === 401) {
          logger.error('OpenRouter API key invalid');
          throw new Error('AI service authentication failed');
        }
        if (error.response?.status === 402) {
          logger.error('OpenRouter API insufficient credits');
          throw new Error('AI service temporarily unavailable');
        }
        throw error;
      }
    );
  }

  private async makeRequest(endpoint: string, data: any, cacheKey?: string, cacheTTL: number = 3600000): Promise<any> {
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
      const response = await this.axiosInstance.post(endpoint, data);
      const responseData = response.data;
      
      // Cache the response
      if (cacheKey) {
        this.cache.set(cacheKey, responseData, cacheTTL);
        logger.info(`Cached response for ${cacheKey}`);
      }
      
      return responseData;
    } catch (error: any) {
      logger.error('OpenRouter API request failed:', {
        endpoint,
        error: error.message,
        status: error.response?.status,
      });
      throw error;
    }
  }

  async generateAIInsight(userPreferences?: {
    cryptoInterests?: string[];
    investorType?: string;
    contentPreferences?: string[];
  }): Promise<AIInsight> {
    try {
      // Create a cache key based on user preferences and current date
      const dateKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const preferencesKey = userPreferences ? JSON.stringify(userPreferences) : 'default';
      const cacheKey = `ai_insight_${dateKey}_${preferencesKey}`;

      // Check if we already have an insight for today
      const cachedInsight = this.cache.get(cacheKey);
      if (cachedInsight) {
        logger.info('Using cached AI insight for today');
        return cachedInsight;
      }

      // Build the prompt based on user preferences
      let prompt = 'Provide a brief, insightful analysis of the current cryptocurrency market. Focus on key trends, notable movements, and actionable insights for crypto investors. Keep it concise (2-3 sentences) and engaging.';

      if (userPreferences) {
        const { cryptoInterests, investorType, contentPreferences } = userPreferences;
        
        if (cryptoInterests && cryptoInterests.length > 0) {
          prompt += ` The user is particularly interested in: ${cryptoInterests.join(', ')}.`;
        }
        
        if (investorType) {
          prompt += ` They identify as a ${investorType.toLowerCase().replace('_', ' ')}.`;
        }
        
        if (contentPreferences && contentPreferences.length > 0) {
          prompt += ` They prefer content focused on: ${contentPreferences.join(', ').toLowerCase().replace('_', ' ')}.`;
        }
      }

      const requestData = {
        model: 'google/gemini-2.5-flash-image-preview:free', // Using free model
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable cryptocurrency market analyst. Provide concise, accurate, and helpful insights about the crypto market. Focus on current trends and practical advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150, // Limit response length
        temperature: 0.7, // Balanced creativity
      };

      const response = await this.makeRequest('/chat/completions', requestData, cacheKey, 3600000); // Cache for 1 hour

      const content = response.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content generated from AI model');
      }

      const insight: AIInsight = {
        id: `insight_${Date.now()}`,
        content: content.trim(),
        type: 'MARKET_ANALYSIS',
        confidence: 0.85,
        createdAt: new Date(),
      };

      // Cache the insight
      this.cache.set(cacheKey, insight, 3600000); // Cache for 1 hour

      logger.info('AI insight generated successfully');
      return insight;
    } catch (error: any) {
      logger.error('Failed to generate AI insight:', error);
      
      // Return a fallback insight if API fails
      return {
        id: `fallback_${Date.now()}`,
        content: 'The crypto market continues to show dynamic movements with Bitcoin maintaining its position as the leading cryptocurrency. Market sentiment appears mixed as investors navigate regulatory developments and technological advancements.',
        type: 'MARKET_ANALYSIS',
        confidence: 0.5,
        createdAt: new Date(),
      };
    }
  }

  async checkAPIKeyStatus(): Promise<{
    isValid: boolean;
    usage?: number;
    limit?: number;
    isFreeTier?: boolean;
  }> {
    try {
      const response = await this.axiosInstance.get('/key');
      const data = response.data;
      
      return {
        isValid: true,
        usage: data.data?.usage,
        limit: data.data?.limit,
        isFreeTier: data.data?.is_free_tier,
      };
    } catch (error: any) {
      logger.error('Failed to check API key status:', error);
      return {
        isValid: false,
      };
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.checkAPIKeyStatus();
      return true;
    } catch (error) {
      logger.error('OpenRouter API ping failed:', error);
      return false;
    }
  }
}

export const openRouterService = new OpenRouterService();
