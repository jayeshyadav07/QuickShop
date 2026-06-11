import express from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authenticate, authorize(['admin']), getUsers);

export default router;
