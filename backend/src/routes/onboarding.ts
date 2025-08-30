import { Router } from 'express';
import { OnboardingController } from '../controllers/onboardingController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { OnboardingSchema } from '@crypto-dashboard/shared';

const router = Router();
const onboardingController = new OnboardingController();

// POST /api/onboarding/preferences
router.post('/preferences', authenticateToken, validateBody(OnboardingSchema), onboardingController.savePreferences.bind(onboardingController));

// GET /api/onboarding/preferences
router.get('/preferences', authenticateToken, onboardingController.getPreferences.bind(onboardingController));

// GET /api/onboarding/status
router.get('/status', authenticateToken, onboardingController.checkOnboardingStatus.bind(onboardingController));

export default router;
