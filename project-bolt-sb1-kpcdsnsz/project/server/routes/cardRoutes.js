import express from 'express';
import {
  getCards,
  getCardById,
  createCard,
  createCards,
  updateCard,
  deleteCard,
  updateCardStats,
} from '../controllers/cardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// Apply auth middleware to all routes
router.use(protect);

// Batch card creation
router.post('/batch', createCards);

// Card stats update
router.put('/:id/stats', updateCardStats);

// Standard CRUD routes
router.route('/')
  .get(getCards)
  .post(createCard);

router.route('/:id')
  .get(getCardById)
  .put(updateCard)
  .delete(deleteCard);

export default router;