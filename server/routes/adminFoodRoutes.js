import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { handleSingleImageUpload } from '../middleware/uploadMiddleware.js';
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  updateFoodStatus,
  deleteFood,
  uploadFoodImage,
  removeFoodImage,
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

// Image upload and removal endpoints
router.post('/:id/image', handleSingleImageUpload('image'), uploadFoodImage);
router.delete('/:id/image', removeFoodImage);

export default router;
