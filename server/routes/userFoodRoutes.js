import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getFoods,
  getFoodCategories,
  getFoodById,
} from '../controllers/userFoodController.js';

const router = express.Router();

// Public / user food discovery endpoints (protected for logged-in users)
router.get('/', authMiddleware, getFoods);
router.get('/categories', authMiddleware, getFoodCategories);
router.get('/:id', authMiddleware, getFoodById);

export default router;
