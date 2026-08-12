import express from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected endpoint (requires valid Bearer JWT)
router.get('/me', authMiddleware, getMe);

export default router;
