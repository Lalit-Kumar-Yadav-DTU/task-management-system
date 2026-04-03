import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js'; // 1. Import

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes); // 2. Connect

export default router;