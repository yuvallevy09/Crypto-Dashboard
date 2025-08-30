import { prisma } from '../config/database';
import { OnboardingData, UserPreferences } from '@crypto-dashboard/shared';
import { createError } from '../middleware/errorHandler';
import logger from '../config/logger';

export class OnboardingService {
  async savePreferences(userId: string, data: OnboardingData): Promise<UserPreferences> {
    try {
      const preferences = await prisma.userPreferences.upsert({
        where: { userId },
        update: {
          cryptoInterests: data.cryptoInterests,
          investorType: data.investorType,
          contentPreferences: data.contentPreferences,
          updatedAt: new Date(),
        },
        create: {
          userId,
          cryptoInterests: data.cryptoInterests,
          investorType: data.investorType,
          contentPreferences: data.contentPreferences,
        },
      });

      logger.info('User preferences saved successfully', { userId });

      return {
        userId: preferences.userId,
        cryptoInterests: preferences.cryptoInterests,
        investorType: preferences.investorType as any,
        contentPreferences: preferences.contentPreferences as any,
        createdAt: preferences.createdAt,
        updatedAt: preferences.updatedAt,
      };
    } catch (error) {
      logger.error('Error saving user preferences:', error);
      throw error;
    }
  }

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const preferences = await prisma.userPreferences.findUnique({
        where: { userId },
      });

      if (!preferences) {
        return null;
      }

      return {
        userId: preferences.userId,
        cryptoInterests: preferences.cryptoInterests,
        investorType: preferences.investorType as any,
        contentPreferences: preferences.contentPreferences as any,
        createdAt: preferences.createdAt,
        updatedAt: preferences.updatedAt,
      };
    } catch (error) {
      logger.error('Error getting user preferences:', error);
      throw error;
    }
  }

  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const preferences = await prisma.userPreferences.findUnique({
        where: { userId },
      });

      return !!preferences;
    } catch (error) {
      logger.error('Error checking onboarding status:', error);
      return false;
    }
  }
}
