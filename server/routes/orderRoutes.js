import express from 'express';
import {
	createOrder,
	getOrders,
	getMyOrders,
	updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/', authenticate, authorize(['admin']), getOrders);
router.put('/:id/status', authenticate, authorize(['admin']), updateOrderStatus);

export default router;
