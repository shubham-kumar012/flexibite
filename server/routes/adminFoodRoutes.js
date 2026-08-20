import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  updateFoodStatus,
  deleteFood,
} from '../controllers/adminFoodController.js';

const router = express.Router();

// Apply authMiddleware (protect) and adminOnly middleware to all routes
router.use(authMiddleware, adminOnly);

// Route definitions for Admin Food Management
router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', createFood);
router.put('/:id', updateFood);
router.patch('/:id/status', updateFoodStatus);
router.delete('/:id', deleteFood);

export default router;
