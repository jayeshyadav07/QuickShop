import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', authenticate, authorize(['admin']), getAnalytics);

export default router;
