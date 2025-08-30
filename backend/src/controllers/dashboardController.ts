import { Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { AuthenticatedRequest } from '../middleware/auth';
import { coinGeckoService } from '../services/coinGeckoService';
import { cryptoPanicService } from '../services/cryptoPanicService';
import logger from '../config/logger';

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboardData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const data = await dashboardService.getDashboardData(req.user.id);
      
      res.status(200).json({
        message: 'Dashboard data retrieved successfully',
        data,
      });
    } catch (error: any) {
      logger.error('Get dashboard data controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to get dashboard data',
      });
    }
  }

  async submitFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { contentType, contentId, rating } = req.body;

      await dashboardService.submitFeedback(req.user.id, contentType, contentId, rating);
      
      res.status(200).json({
        message: 'Feedback submitted successfully',
      });
    } catch (error: any) {
      logger.error('Submit feedback controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to submit feedback',
      });
    }
  }

  async testCoinGecko(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Test CoinGecko API connection
      const isAlive = await coinGeckoService.ping();
      const topCoins = await coinGeckoService.getTopCoins(5);
      const globalData = await coinGeckoService.getGlobalData();
      
      res.status(200).json({
        message: 'CoinGecko API test successful',
        data: {
          isAlive,
          topCoins,
          globalData,
        },
      });
    } catch (error: any) {
      logger.error('CoinGecko test controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'CoinGecko API test failed',
      });
    }
  }

  async getChartData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { coinId } = req.params;
      const { days = '7' } = req.query;
      
      const daysNumber = parseInt(days as string, 10);
      if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
        res.status(400).json({ error: 'Days parameter must be between 1 and 365' });
        return;
      }

      const historicalData = await coinGeckoService.getHistoricalData(coinId, daysNumber);
      
      res.status(200).json({
        message: 'Chart data retrieved successfully',
        data: historicalData,
      });
    } catch (error: any) {
      logger.error('Get chart data controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to get chart data',
      });
    }
  }

  async testCryptoPanic(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Test CryptoPanic API connection
      const trendingNews = await cryptoPanicService.getTrendingNews(5);
      const bullishNews = await cryptoPanicService.getBullishNews(3);
      const cacheStats = cryptoPanicService.getCacheStats();
      
      res.status(200).json({
        message: 'CryptoPanic API test successful',
        data: {
          trendingNews,
          bullishNews,
          cacheStats,
        },
      });
    } catch (error: any) {
      logger.error('CryptoPanic test controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'CryptoPanic API test failed',
      });
    }
  }


}
