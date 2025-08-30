import { Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { AuthenticatedRequest } from '../middleware/auth';
import { coinGeckoService } from '../services/coinGeckoService';
import { cryptoPanicService } from '../services/cryptoPanicService';
import { memeService } from '../services/memeService';
import { redditService } from '../services/redditService';
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

  async getMeme(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { category, tags } = req.query;
      let meme;

      if (category && typeof category === 'string') {
        meme = await memeService.getMemeByCategory(category as any);
      } else if (tags && typeof tags === 'string') {
        const tagArray = tags.split(',').map(tag => tag.trim());
        meme = await memeService.getMemeByTags(tagArray);
      } else {
        meme = await memeService.getRandomMeme();
      }

      res.status(200).json({
        message: 'Meme retrieved successfully',
        data: meme,
      });
    } catch (error: any) {
      logger.error('Get meme controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to get meme',
      });
    }
  }

  async getRedditStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const status = redditService.getStatus();
      
      res.status(200).json({
        message: 'Reddit service status retrieved successfully',
        data: status,
      });
    } catch (error: any) {
      logger.error('Get Reddit status controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to get Reddit status',
      });
    }
  }

}
