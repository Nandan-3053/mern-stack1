import express from 'express';
import {
  getDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  getPublicDecks,
  cloneDeck,
} from '../controllers/deckController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Special routes
router.get('/public', getPublicDecks);
router.post('/:id/clone', cloneDeck);

// Standard CRUD routes
router.route('/')
  .get(getDecks)
  .post(createDeck);

router.route('/:id')
  .get(getDeckById)
  .put(updateDeck)
  .delete(deleteDeck);

export default router;