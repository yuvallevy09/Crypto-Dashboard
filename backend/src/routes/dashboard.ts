import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { FeedbackSchema } from '@crypto-dashboard/shared';

const router = Router();
const dashboardController = new DashboardController();

// GET /api/dashboard
router.get('/', authenticateToken, dashboardController.getDashboardData.bind(dashboardController));

// POST /api/dashboard/feedback
router.post('/feedback', authenticateToken, validateBody(FeedbackSchema), dashboardController.submitFeedback.bind(dashboardController));

// GET /api/dashboard/test-coingecko (for testing API connection)
router.get('/test-coingecko', authenticateToken, dashboardController.testCoinGecko.bind(dashboardController));

export default router;
