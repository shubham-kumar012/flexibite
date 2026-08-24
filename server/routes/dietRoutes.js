import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addDietEntry,
  getTodayDiet,
  updateDietEntry,
  deleteDietEntry,
} from '../controllers/dietController.js';

const router = express.Router();

// Protect all diet routes using existing JWT authentication middleware
router.use(authMiddleware);

// Diet API endpoints
router.post('/', addDietEntry);
router.get('/today', getTodayDiet);
router.put('/:id', updateDietEntry);
router.delete('/:id', deleteDietEntry);

export default router;
