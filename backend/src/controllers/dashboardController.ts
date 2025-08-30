import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { AuthenticatedRequest } from '../middleware/auth';
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
}
