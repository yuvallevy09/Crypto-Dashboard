import { prisma } from '../config/database';
import { DashboardData, Feedback, ContentType, FeedbackType } from '@crypto-dashboard/shared';
import logger from '../config/logger';

export class DashboardService {
  async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      // For now, return mock data. This will be replaced with real API calls
      const mockData: DashboardData = {
        marketOverview: {
          totalMarketCap: 3924450308279,
          totalVolume24h: 136604457007,
          marketCapChange24h: -1.8,
          volumeChange24h: -2.1,
        },
        trendingCoins: [
          {
            id: 'pyth-network',
            symbol: 'PYTH',
            name: 'Pyth Network',
            image: 'https://assets.coingecko.com/coins/images/34431/large/pyth.png',
            current_price: 0.2218,
            market_cap: 1234567890,
            market_cap_rank: 45,
            total_volume: 987654321,
            high_24h: 0.25,
            low_24h: 0.20,
            price_change_24h: 0.108,
            price_change_percentage_24h: 95.3,
            price_change_percentage_1h_in_currency: 2.5,
            price_change_percentage_7d_in_currency: 120.5,
          },
          {
            id: 'mitosis',
            symbol: 'MITO',
            name: 'Mitosis',
            image: 'https://assets.coingecko.com/coins/images/12345/large/mito.png',
            current_price: 0.2223,
            market_cap: 987654321,
            market_cap_rank: 67,
            total_volume: 123456789,
            high_24h: 0.23,
            low_24h: 0.18,
            price_change_24h: 0.118,
            price_change_percentage_24h: 113.4,
            price_change_percentage_1h_in_currency: 1.8,
            price_change_percentage_7d_in_currency: 150.2,
          },
          {
            id: 'wormhole',
            symbol: 'W',
            name: 'Wormhole',
            image: 'https://assets.coingecko.com/coins/images/67890/large/wormhole.png',
            current_price: 0.09653,
            market_cap: 567890123,
            market_cap_rank: 89,
            total_volume: 234567890,
            high_24h: 0.10,
            low_24h: 0.08,
            price_change_24h: 0.0158,
            price_change_percentage_24h: 19.6,
            price_change_percentage_1h_in_currency: 0.5,
            price_change_percentage_7d_in_currency: 25.3,
          },
        ],
        topGainers: [
          {
            id: 'uchain',
            symbol: 'UCHAIN',
            name: 'UCHAIN',
            image: 'https://assets.coingecko.com/coins/images/11111/large/uchain.png',
            current_price: 384.37,
            market_cap: 123456789,
            market_cap_rank: 234,
            total_volume: 98765432,
            high_24h: 400,
            low_24h: 200,
            price_change_24h: 359.87,
            price_change_percentage_24h: 1399.5,
            price_change_percentage_1h_in_currency: 5.2,
            price_change_percentage_7d_in_currency: 2000.1,
          },
        ],
        news: [
          {
            id: '1',
            title: 'Hong Kong Firm Allocates HK$450M for Crypto Ventures',
            url: 'https://example.com/news/1',
            source: 'coincu.com',
            publishedAt: new Date(),
            tags: ['NYLA'],
          },
          {
            id: '2',
            title: 'Elon Musk\'s lawyer to chair $200M Dogecoin treasury: Report',
            url: 'https://example.com/news/2',
            source: 'theholycoins.com',
            publishedAt: new Date(Date.now() - 600000), // 10 minutes ago
            tags: ['DOGE', 'BTC'],
          },
          {
            id: '3',
            title: 'Shiba Inu Price Set For 650% Expansion To $0.00009 ATH If This Happens',
            url: 'https://example.com/news/3',
            source: 'cryptonews.com',
            publishedAt: new Date(Date.now() - 1200000), // 20 minutes ago
            tags: ['SHIB', 'ATH'],
          },
        ],
        aiInsight: {
          id: '1',
          content: 'The crypto market is showing signs of consolidation after recent volatility. Bitcoin\'s dominance remains strong while altcoins are experiencing mixed performance. Keep an eye on regulatory developments as they continue to impact market sentiment.',
          type: 'MARKET_ANALYSIS',
          confidence: 0.85,
          createdAt: new Date(),
        },
        meme: {
          id: '1',
          title: 'HODL the line!',
          url: 'https://example.com/memes/hodl.jpg',
          source: 'cryptomemes.com',
          tags: ['HODL', 'BTC', 'FUN'],
        },
        coinPrices: [
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 108265,
            market_cap: 2155855355799,
            market_cap_rank: 1,
            total_volume: 51804376897,
            high_24h: 110000,
            low_24h: 105000,
            price_change_24h: -4150,
            price_change_percentage_24h: -3.7,
            price_change_percentage_1h_in_currency: -0.5,
            price_change_percentage_7d_in_currency: -7.5,
          },
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 4338.47,
            market_cap: 521234567890,
            market_cap_rank: 2,
            total_volume: 12345678901,
            high_24h: 4400,
            low_24h: 4200,
            price_change_24h: -150,
            price_change_percentage_24h: -3.3,
            price_change_percentage_1h_in_currency: -0.3,
            price_change_percentage_7d_in_currency: -5.2,
          },
        ],
      };

      logger.info('Dashboard data retrieved successfully', { userId });
      return mockData;
    } catch (error) {
      logger.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  async submitFeedback(userId: string, contentType: ContentType, contentId: string, rating: FeedbackType): Promise<void> {
    try {
      await prisma.feedback.create({
        data: {
          userId,
          contentType,
          contentId,
          rating,
        },
      });

      logger.info('Feedback submitted successfully', { userId, contentType, contentId, rating });
    } catch (error) {
      logger.error('Error submitting feedback:', error);
      throw error;
    }
  }
}
