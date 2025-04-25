import Card from '../models/Card.js';
import Deck from '../models/Deck.js';

// Helper to check if user owns the deck
const checkDeckAccess = async (deckId, userId) => {
  const deck = await Deck.findOne({ _id: deckId, userId });
  if (!deck) {
    throw new Error('Deck not found or access denied');
  }
  return deck;
};

// @desc    Get all cards for a deck
// @route   GET /api/decks/:deckId/cards
// @access  Private
export const getCards = async (req, res, next) => {
  try {
    // Check if user has access to this deck
    await checkDeckAccess(req.params.deckId, req.user.id);
    
    const cards = await Card.find({ deckId: req.params.deckId });
    res.json(cards);
  } catch (error) {
    if (error.message === 'Deck not found or access denied') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// @desc    Get a single card
// @route   GET /api/decks/:deckId/cards/:id
// @access  Private
export const getCardById = async (req, res, next) => {
  try {
    // Check if user has access to this deck
    await checkDeckAccess(req.params.deckId, req.user.id);
    
    const card = await Card.findOne({
      _id: req.params.id,
      deckId: req.params.deckId,
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    if (error.message === 'Deck not found or access denied') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// @desc    Create a new card
// @route   POST /api/decks/:deckId/cards
// @access  Private
export const createCard = async (req, res, next) => {
  try {
    // Check if user has access to this deck
    const deck = await checkDeckAccess(req.params.deckId, req.user.id);
    
    const { front, back } = req.body;

    const card = await Card.create({
      front,
      back,
      deckId: req.params.deckId,
    });

    // Update deck's total cards count
    deck.totalCards += 1;
    deck.cardsToReview += 1;
    await deck.save();

    res.status(201).json(card);
  } catch (error) {
    if (error.message === 'Deck not found or access denied') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// @desc    Create multiple cards at once
// @route   POST /api/decks/:deckId/cards/batch
// @access  Private
export const createCards = async (req, res, next) => {
  try {
    // Check if user has access to this deck
    const deck = await checkDeckAccess(req.params.deckId, req.user.id);
    
    const { cards } = req.body;
    
    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ message: 'No cards provided' });
    }

    // Prepare card objects with deckId
    const cardsToInsert = cards.map(card => ({
      front: card.front,
      back: card.back,
      deckId: req.params.deckId,
    }));

    // Insert all cards
    const insertedCards = await Card.insertMany(cardsToInsert);

    // Update deck's total cards count
    deck.totalCards += insertedCards.length;
    deck.cardsToReview += insertedCards.length;
    await deck.save();

    res.status(201).json(insertedCards);
  } catch (error) {
    if (error.message === 'Deck not found or access denied') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// @desc    Update a card
// @route   PUT /api/decks/:deckId/cards/:id
// @access  Private
export const updateCard = async (req, res, next) => {
  try {
    // Check if user has access to this deck
    await checkDeckAccess(req.params.deckId, req.user.id);
    
    const { front, back } = req.body;

    const card = await Card.findOne({
      _id: req.params.id,
      deckId: req.params.deckId,
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    card.front = front || card.front;
    card.back = back || card.back;

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    if (error.message === 'Deck not found or access denied') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// @desc    Delete a card
// @route   DELETE /api/decks/:deckId/cards/:id
// @access  Private
export const deleteCard = async (req, res, next) => {
  try {
    // Check if user has access to this deck
    const deck = await checkDeckAccess(req.params.deckId, req.user.id);
    
    const card = await Card.findOne({
      _id: req.params.id,
      deckId: req.params.deckId,
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    await card.deleteOne();

    // Update deck's total cards count
    if (deck.totalCards > 0) {
      deck.totalCards -= 1;
    }
    
    // Update cards to review count
    const now = new Date();
    if (card.nextReview <= now && deck.cardsToReview > 0) {
      deck.cardsToReview -= 1;
    }
    
    await deck.save();

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    if (error.message === 'Deck not found or access denied') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// @desc    Update card review statistics
// @route   PUT /api/decks/:deckId/cards/:id/stats
// @access  Private
export const updateCardStats = async (req, res, next) => {
  try {
    // Check if user has access to this deck
    const deck = await checkDeckAccess(req.params.deckId, req.user.id);
    
    const { difficulty, nextReview } = req.body;

    const card = await Card.findOne({
      _id: req.params.id,
      deckId: req.params.deckId,
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Update statistics
    card.reviewCount += 1;
    
    if (difficulty !== undefined) {
      card.difficulty = difficulty;
    }
    
    // Calculate next review date if not provided
    if (nextReview) {
      card.nextReview = nextReview;
    } else {
      // Simple spaced repetition algorithm
      // The worse the difficulty, the sooner we'll review
      const intervalMultiplier = {
        1: 7, // Easy: 7 days
        2: 3, // Medium: 3 days
        3: 1, // Hard: 1 day
      };
      
      const days = intervalMultiplier[difficulty] || 1;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + days);
      
      card.nextReview = nextDate;
    }

    const updatedCard = await card.save();
    
    // Update cards to review count in deck
    await Deck.updateOne(
      { _id: deck._id },
      { $inc: { cardsToReview: -1 } }
    );
    
    res.json(updatedCard);
  } catch (error) {
    if (error.message === 'Deck not found or access denied') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export default {
  getCards,
  getCardById,
  createCard,
  createCards,
  updateCard,
  deleteCard,
  updateCardStats,
};