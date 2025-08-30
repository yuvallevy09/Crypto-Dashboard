import axios from 'axios';
import { NewsItem } from '@crypto-dashboard/shared';
import logger from '../config/logger';

interface CryptoPanicPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  published_at: string;
  created_at: string;
  kind: string;
}

interface CryptoPanicResponse {
  results: CryptoPanicPost[];
  count: number;
  next: string | null;
  previous: string | null;
}

export class CryptoPanicService {
  private readonly baseUrl = 'https://cryptopanic.com/api/developer/v2/posts/';
  private readonly apiKey: string;
  private readonly cache = new Map<string, { data: NewsItem[]; timestamp: number }>();
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    this.apiKey = process.env.CRYPTOPANIC_API_KEY;
    if (!this.apiKey) {
      logger.warn('CRYPTOPANIC_API_KEY not found in environment variables');
    }
  }

  private transformPost(post: CryptoPanicPost): NewsItem {
    // Extract source from slug or use a default
    const source = this.extractSourceFromSlug(post.slug);
    
    // Extract tags from title and description
    const tags = this.extractTagsFromContent(post.title, post.description);
    
    return {
      id: post.id.toString(),
      title: post.title,
      url: `https://cryptopanic.com/news/${post.slug}/`,
      source: source,
      publishedAt: new Date(post.published_at),
      tags: tags,
      dataSource: 'cryptopanic', // Indicate this is real API data
    };
  }

  private extractSourceFromSlug(slug: string): string {
    // Try to extract source from slug, fallback to a default
    const slugParts = slug.split('-');
    if (slugParts.length > 0) {
      // Use the first part as a potential source indicator
      return slugParts[0].toUpperCase();
    }
    return 'cryptopanic.com';
  }

  private extractTagsFromContent(title: string, description: string): string[] {
    const content = `${title} ${description}`.toLowerCase();
    const tags: string[] = [];
    
    // Common crypto terms to look for
    const cryptoTerms = [
      'bitcoin', 'btc', 'ethereum', 'eth', 'cardano', 'ada', 'solana', 'sol',
      'polkadot', 'dot', 'chainlink', 'link', 'uniswap', 'uni', 'dogecoin', 'doge',
      'shiba', 'shib', 'ripple', 'xrp', 'litecoin', 'ltc', 'defi', 'nft', 'dao',
      'etf', 'institutional', 'regulation', 'sec', 'fed', 'central bank'
    ];
    
    cryptoTerms.forEach(term => {
      if (content.includes(term)) {
        tags.push(term.toUpperCase());
      }
    });
    
    // Add some generic tags based on content
    if (content.includes('price') || content.includes('market')) {
      tags.push('MARKET');
    }
    if (content.includes('adoption') || content.includes('institutional')) {
      tags.push('ADOPTION');
    }
    if (content.includes('regulation') || content.includes('sec')) {
      tags.push('REGULATION');
    }
    
    return tags.slice(0, 5); // Limit to 5 tags
  }

  private getCacheKey(params: Record<string, any>): string {
    return JSON.stringify(params);
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTTL;
  }

  async getNews(params: {
    filter?: 'hot' | 'rising' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol';
    currencies?: string[];
    regions?: string[];
    kind?: 'news' | 'media';
    limit?: number;
  } = {}): Promise<NewsItem[]> {
    const cacheKey = this.getCacheKey(params);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      logger.info('Returning cached CryptoPanic news data');
      return cached.data;
    }

    if (!this.apiKey) {
      logger.warn('CryptoPanic API key not available, returning fallback data');
      return this.getFallbackNews();
    }



    try {
      const queryParams = new URLSearchParams({
        auth_token: this.apiKey,
        ...(params.filter && { filter: params.filter }),
        ...(params.currencies && { currencies: params.currencies.join(',') }),
        ...(params.regions && { regions: params.regions.join(',') }),
        ...(params.kind && { kind: params.kind }),
        ...(params.limit && { limit: params.limit.toString() }),
      });

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      
      logger.info('Fetching news from CryptoPanic API', { 
        url: url.replace(this.apiKey, '[REDACTED]'),
        params 
      });

      const response = await axios.get<CryptoPanicResponse>(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'CryptoDashboard/1.0',
        },
      });

      const newsItems = response.data.results.map(post => this.transformPost(post));
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: newsItems,
        timestamp: Date.now(),
      });

      logger.info('Successfully fetched news from CryptoPanic', { 
        count: newsItems.length,
        remainingRequests: this.getRemainingRequests(response.headers)
      });

      return newsItems;
    } catch (error) {
      logger.error('Error fetching news from CryptoPanic API:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        stack: error.stack
      });
      
      // Return fallback data on error
      return this.getFallbackNews();
    }
  }

  async getTrendingNews(limit: number = 10): Promise<NewsItem[]> {
    return this.getNews({ filter: 'hot', limit });
  }

  async getNewsByCurrencies(currencies: string[], limit: number = 10): Promise<NewsItem[]> {
    return this.getNews({ currencies, limit });
  }

  async getBullishNews(limit: number = 10): Promise<NewsItem[]> {
    return this.getNews({ filter: 'bullish', limit });
  }

  async getBearishNews(limit: number = 10): Promise<NewsItem[]> {
    return this.getNews({ filter: 'bearish', limit });
  }

  private getRemainingRequests(headers: any): string {
    // CryptoPanic might include rate limit headers
    return headers['x-ratelimit-remaining'] || 'unknown';
  }

  getFallbackNews(): NewsItem[] {
    return [
      {
        id: 'fallback-1',
        title: 'Hong Kong Firm Allocates HK$450M for Crypto Ventures',
        url: 'https://coincu.com/news/hong-kong-firm-allocates-hk450m-for-crypto-ventures/',
        source: 'coincu.com',
        publishedAt: new Date(),
        tags: ['NYLA', 'HONG KONG', 'VENTURE CAPITAL'],
        dataSource: 'fallback', // Indicate this is fallback data
      },
              {
          id: 'fallback-2',
          title: 'Elon Musk\'s lawyer to chair $200M Dogecoin treasury: Report',
          url: 'https://theholycoins.com/news/elon-musk-lawyer-dogecoin-treasury/',
          source: 'theholycoins.com',
          publishedAt: new Date(Date.now() - 600000), // 10 minutes ago
          tags: ['DOGE', 'BTC', 'ELON MUSK'],
          dataSource: 'fallback',
        },
              {
          id: 'fallback-3',
          title: 'Shiba Inu Price Set For 650% Expansion To $0.00009 ATH If This Happens',
          url: 'https://cryptonews.com/news/shiba-inu-price-prediction-650-expansion/',
          source: 'cryptonews.com',
          publishedAt: new Date(Date.now() - 1200000), // 20 minutes ago
          tags: ['SHIB', 'ATH', 'PRICE PREDICTION'],
          dataSource: 'fallback',
        },
              {
          id: 'fallback-4',
          title: 'Bitcoin ETF Inflows Continue as Institutional Adoption Grows',
          url: 'https://cryptonews.com/news/bitcoin-etf-inflows-institutional-adoption/',
          source: 'cryptonews.com',
          publishedAt: new Date(Date.now() - 1800000), // 30 minutes ago
          tags: ['BTC', 'ETF', 'INSTITUTIONAL'],
          dataSource: 'fallback',
        },
              {
          id: 'fallback-5',
          title: 'Ethereum Layer 2 Solutions See Record Growth in TVL',
          url: 'https://defipulse.com/news/ethereum-layer2-tvl-growth/',
          source: 'defipulse.com',
          publishedAt: new Date(Date.now() - 2400000), // 40 minutes ago
          tags: ['ETH', 'LAYER2', 'DEFI', 'TVL'],
          dataSource: 'fallback',
        },
    ];
  }

  // Method to clear cache (useful for testing or manual cache invalidation)
  clearCache(): void {
    this.cache.clear();
    logger.info('CryptoPanic cache cleared');
  }

  // Method to get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cryptoPanicService = new CryptoPanicService();
