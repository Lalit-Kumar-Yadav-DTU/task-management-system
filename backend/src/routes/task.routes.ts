import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply middleware to ALL task routes at once
router.use(authenticate);

router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.remove);

export default router;