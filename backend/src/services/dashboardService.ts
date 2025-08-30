import { prisma } from '../config/database';
import { DashboardData, ContentType, FeedbackType } from '@crypto-dashboard/shared';
import { coinGeckoService } from './coinGeckoService';
import logger from '../config/logger';

export class DashboardService {
  async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      // Get real data from CoinGecko API
      const [marketOverview, trendingCoins, topGainers, coinPrices] = await Promise.all([
        coinGeckoService.getGlobalData(),
        coinGeckoService.getTrendingCoins(),
        coinGeckoService.getTopGainers(3),
        coinGeckoService.getTopCoins(10),
      ]);

      const dashboardData: DashboardData = {
        marketOverview,
        trendingCoins,
        topGainers,
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
