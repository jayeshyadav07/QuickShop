import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
} from '../controllers/productController.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', authenticate, authorize(['admin']), upload.array('images', 5), createProduct);
router.put('/:id', authenticate, authorize(['admin']), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct);

export default router;
