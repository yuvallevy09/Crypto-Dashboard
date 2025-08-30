import { prisma } from '../config/database';
import { DashboardData, ContentType, FeedbackType } from '@crypto-dashboard/shared';
import { coinGeckoService } from './coinGeckoService';
import { cryptoPanicService } from './cryptoPanicService';
import { memeService } from './memeService';
import { openRouterService } from './openRouterService';
import logger from '../config/logger';

export class DashboardService {
  async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      // Get user preferences for personalized AI insight
      let userPreferences;
      try {
        const userPrefs = await prisma.userPreferences.findUnique({
          where: { userId },
        });
        userPreferences = userPrefs ? {
          cryptoInterests: userPrefs.cryptoInterests,
          investorType: userPrefs.investorType,
          contentPreferences: userPrefs.contentPreferences,
        } : undefined;
      } catch (error) {
        logger.warn('Failed to fetch user preferences for AI insight:', error);
        userPreferences = undefined;
      }

      // Get real data from APIs with fallback to mock data
      let marketOverview, trendingCoins, topGainers, coinPrices, news;

      // Fetch data with individual error handling for each service
      try {
        marketOverview = await coinGeckoService.getGlobalData();
      } catch (error) {
        logger.warn('CoinGecko global data failed, using fallback:', error instanceof Error ? error.message : 'Unknown error');
        marketOverview = {
          totalMarketCap: 3924450308279,
          totalVolume24h: 136604457007,
          marketCapChange24h: -1.8,
          volumeChange24h: -2.1,
        };
      }

      try {
        trendingCoins = await coinGeckoService.getTrendingCoins();
      } catch (error) {
        logger.warn('CoinGecko trending coins failed, using fallback:', error instanceof Error ? error.message : 'Unknown error');
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
      }

      try {
        topGainers = await coinGeckoService.getTopGainers(3);
      } catch (error) {
        logger.warn('CoinGecko top gainers failed, using fallback:', error instanceof Error ? error.message : 'Unknown error');
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
      }

      try {
        coinPrices = await coinGeckoService.getTopCoins(25);
      } catch (error) {
        logger.warn('CoinGecko top coins failed, using fallback:', error instanceof Error ? error.message : 'Unknown error');
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
      }

      try {
        news = await cryptoPanicService.getTrendingNews(10);
        logger.info('Successfully fetched news from CryptoPanic');
      } catch (error) {
        logger.warn('CryptoPanic news failed, using fallback:', error instanceof Error ? error.message : 'Unknown error');
        news = cryptoPanicService.getFallbackNews();
      }

      // Get dynamic meme
      let meme;
      try {
        meme = await memeService.getRandomMeme();
        logger.info('Successfully fetched meme from meme service');
      } catch (error) {
        logger.warn('Meme service failed, using fallback:', error instanceof Error ? error.message : 'Unknown error');
        meme = {
          id: 'fallback-1',
          title: 'Crypto Life 🚀',
          url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center',
          source: 'CryptoMemes.com',
          tags: ['CRYPTO', 'LIFE', 'FUN'],
        };
      }

      // Get AI insight
      let aiInsight;
      try {
        aiInsight = await openRouterService.generateAIInsight(userPreferences);
        logger.info('Successfully generated AI insight');
      } catch (error) {
        logger.warn('AI insight generation failed, using fallback:', error instanceof Error ? error.message : 'Unknown error');
        aiInsight = {
          id: 'fallback-1',
          content: 'The crypto market is showing signs of consolidation after recent volatility. Bitcoin\'s dominance remains strong while altcoins are experiencing mixed performance. Keep an eye on regulatory developments as they continue to impact market sentiment.',
          type: 'MARKET_ANALYSIS' as const,
          confidence: 0.5,
          createdAt: new Date(),
        };
      }

      const dashboardData: DashboardData = {
        marketOverview,
        trendingCoins,
        topGainers,
        news,
        aiInsight,
        meme,
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
