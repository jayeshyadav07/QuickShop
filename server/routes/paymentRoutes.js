import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);

export default router;
