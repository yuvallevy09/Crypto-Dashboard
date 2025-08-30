import { prisma } from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { RegisterRequest, LoginRequest, User } from '@crypto-dashboard/shared';
import { createError } from '../middleware/errorHandler';
import logger from '../config/logger';

export class AuthService {
  async register(data: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw createError('Email already exists', 400);
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
        },
      });

      // Generate token
      const token = generateToken(user);

      logger.info('User registered successfully', { userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw createError('Invalid email or password', 401);
      }

      // Verify password
      const isValidPassword = await comparePassword(data.password, user.passwordHash);

      if (!isValidPassword) {
        throw createError('Invalid email or password', 401);
      }

      // Generate token
      const token = generateToken(user);

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<User> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      logger.error('Get profile error:', error);
      throw error;
    }
  }
}
