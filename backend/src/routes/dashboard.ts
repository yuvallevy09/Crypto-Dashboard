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





// GET /api/dashboard/chart-data/:coinId
router.get('/chart-data/:coinId', authenticateToken, dashboardController.getChartData.bind(dashboardController));

// GET /api/dashboard/meme
router.get('/meme', authenticateToken, dashboardController.getMeme.bind(dashboardController));

// GET /api/dashboard/reddit-status
router.get('/reddit-status', authenticateToken, dashboardController.getRedditStatus.bind(dashboardController));

// GET /api/dashboard/ai-insight
router.get('/ai-insight', authenticateToken, dashboardController.getAIInsight.bind(dashboardController));

// GET /api/dashboard/openrouter-status
router.get('/openrouter-status', authenticateToken, dashboardController.getOpenRouterStatus.bind(dashboardController));

export default router;
