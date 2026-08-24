import express from 'express';
import {
  signup,
  login,
  getMe,
  logout,
  googleAuth,
  googleAuthCallback,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth endpoints
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Protected endpoint (requires valid Bearer JWT)
router.get('/me', authMiddleware, getMe);

export default router;
