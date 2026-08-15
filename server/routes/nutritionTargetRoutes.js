import express from 'express';
import { generateNutritionTarget, getNutritionTarget } from '../controllers/nutritionTargetController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes are protected by JWT authentication middleware
router.post('/generate', authMiddleware, generateNutritionTarget);
router.get('/', authMiddleware, getNutritionTarget);

export default router;
