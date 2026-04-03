import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js'; // Import your middleware

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// PROTECTED ROUTE - The middleware runs BEFORE the controller
router.get('/me', authenticate, authController.getProfile);

export default router;