import { prisma } from '../config/database';
import { DashboardData, ContentType, FeedbackType } from '@crypto-dashboard/shared';
import { coinGeckoService } from './coinGeckoService';
import { cryptoPanicService } from './cryptoPanicService';
import logger from '../config/logger';

export class DashboardService {
  async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      // Get real data from APIs with fallback to mock data
      let marketOverview, trendingCoins, topGainers, coinPrices, news;

      try {
        [marketOverview, trendingCoins, topGainers, coinPrices, news] = await Promise.all([
          coinGeckoService.getGlobalData(),
          coinGeckoService.getTrendingCoins(),
          coinGeckoService.getTopGainers(3),
          coinGeckoService.getTopCoins(25), // Increased from 10 to 25 for more coin options
          cryptoPanicService.getTrendingNews(10), // Get trending news from CryptoPanic
        ]);
      } catch (error) {
        logger.warn('API calls failed, using fallback data:', error);
        // Fallback to mock data if APIs fail
        marketOverview = {
          totalMarketCap: 3924450308279,
          totalVolume24h: 136604457007,
          marketCapChange24h: -1.8,
          volumeChange24h: -2.1,
        };
        trendingCoins = [
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
        ];
        topGainers = [
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
        ];
        coinPrices = [
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
        ];
        news = cryptoPanicService.getFallbackNews();
      }

      const dashboardData: DashboardData = {
        marketOverview,
        trendingCoins,
        topGainers,
        news,
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
        coinPrices,
      };

      logger.info('Dashboard data retrieved successfully', { userId });
      return dashboardData;
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
