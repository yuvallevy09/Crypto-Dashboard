import { Router } from 'express';
import { prisma } from '../config/database';
import { coinGeckoService } from '../services/coinGeckoService';
import logger from '../config/logger';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      database: 'unknown',
      coinGecko: 'unknown',
    },
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'DEGRADED';
    logger.error('Database health check failed:', error);
  }

  try {
    // Check CoinGecko API
    await coinGeckoService.ping();
    health.services.coinGecko = 'healthy';
  } catch (error) {
    health.services.coinGecko = 'unhealthy';
    health.status = 'DEGRADED';
    logger.error('CoinGecko API health check failed:', error);
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
