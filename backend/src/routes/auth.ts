import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { LoginSchema, RegisterSchema } from '@crypto-dashboard/shared';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', validateBody(RegisterSchema), authController.register.bind(authController));

// POST /api/auth/login
router.post('/login', validateBody(LoginSchema), authController.login.bind(authController));

// GET /api/auth/me
router.get('/me', authenticateToken, authController.getProfile.bind(authController));

// POST /api/auth/logout
router.post('/logout', authController.logout.bind(authController));

export default router;
