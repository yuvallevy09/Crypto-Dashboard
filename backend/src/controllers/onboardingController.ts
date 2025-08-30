import { Request, Response } from 'express';
import { OnboardingService } from '../services/onboardingService';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../config/logger';

const onboardingService = new OnboardingService();

export class OnboardingController {
  async savePreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const preferences = await onboardingService.savePreferences(req.user.id, req.body);
      
      res.status(200).json({
        message: 'Preferences saved successfully',
        data: { preferences },
      });
    } catch (error: any) {
      logger.error('Save preferences controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to save preferences',
      });
    }
  }

  async getPreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const preferences = await onboardingService.getPreferences(req.user.id);
      
      res.status(200).json({
        message: 'Preferences retrieved successfully',
        data: { preferences },
      });
    } catch (error: any) {
      logger.error('Get preferences controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to get preferences',
      });
    }
  }

  async checkOnboardingStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const hasCompleted = await onboardingService.hasCompletedOnboarding(req.user.id);
      
      res.status(200).json({
        message: 'Onboarding status retrieved successfully',
        data: { hasCompletedOnboarding: hasCompleted },
      });
    } catch (error: any) {
      logger.error('Check onboarding status controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to check onboarding status',
      });
    }
  }
}
