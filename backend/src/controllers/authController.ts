import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../config/logger';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      logger.error('Registration controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Registration failed',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      
      res.status(200).json({
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      logger.error('Login controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Login failed',
      });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = await authService.getProfile(req.user.id);
      
      res.status(200).json({
        message: 'Profile retrieved successfully',
        data: { user },
      });
    } catch (error: any) {
      logger.error('Get profile controller error:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to get profile',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // For JWT tokens, we don't need to do anything server-side
      // The client should remove the token
      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error: any) {
      logger.error('Logout controller error:', error);
      res.status(500).json({
        error: 'Logout failed',
      });
    }
  }
}
