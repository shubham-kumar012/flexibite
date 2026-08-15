import express from 'express';
import { createOrUpdateProfile, getProfile } from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected profile endpoints
router.post('/', authMiddleware, createOrUpdateProfile);
router.get('/', authMiddleware, getProfile);

export default router;
