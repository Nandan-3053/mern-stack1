import Deck from '../models/Deck.js';
import Card from '../models/Card.js';
import mongoose from 'mongoose';

// @desc    Get all decks for a user
// @route   GET /api/decks
// @access  Private
export const getDecks = async (req, res, next) => {
  try {
    const decks = await Deck.find({ userId: req.user.id });
    res.json(decks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single deck
// @route   GET /api/decks/:id
// @access  Private
export const getDeckById = async (req, res, next) => {
  try {
    const deck = await Deck.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user.id }, { isPublic: true }],
    });

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    res.json(deck);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new deck
// @route   POST /api/decks
// @access  Private
export const createDeck = async (req, res, next) => {
  try {
    const { name, description, isPublic, tags } = req.body;

    const deck = await Deck.create({
      name,
      description,
      isPublic,
      tags: tags || [],
      userId: req.user.id,
    });

    res.status(201).json(deck);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a deck
// @route   PUT /api/decks/:id
// @access  Private
export const updateDeck = async (req, res, next) => {
  try {
    const { name, description, isPublic, tags } = req.body;

    const deck = await Deck.findOne({ _id: req.params.id, userId: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    deck.name = name || deck.name;
    deck.description = description || deck.description;
    deck.isPublic = isPublic !== undefined ? isPublic : deck.isPublic;
    deck.tags = tags || deck.tags;

    const updatedDeck = await deck.save();
    res.json(updatedDeck);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a deck
// @route   DELETE /api/decks/:id
// @access  Private
export const deleteDeck = async (req, res, next) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, userId: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    // Use a session to delete deck and its cards atomically
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the deck
      await Deck.deleteOne({ _id: req.params.id }, { session });
      
      // Delete all cards in the deck
      await Card.deleteMany({ deckId: req.params.id }, { session });
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    res.status(200).json({ message: 'Deck deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all public decks
// @route   GET /api/decks/public
// @access  Public
export const getPublicDecks = async (req, res, next) => {
  try {
    const publicDecks = await Deck.find({ isPublic: true })
      .sort({ totalCards: -1 })
      .limit(20);
    
    res.json(publicDecks);
  } catch (error) {
    next(error);
  }
};

// @desc    Clone a public deck
// @route   POST /api/decks/:id/clone
// @access  Private
export const cloneDeck = async (req, res, next) => {
  try {
    // Find the source deck
    const sourceDeck = await Deck.findOne({
      _id: req.params.id,
      isPublic: true,
    });

    if (!sourceDeck) {
      return res.status(404).json({ message: 'Public deck not found' });
    }

    // Create a new deck as a clone
    const newDeck = await Deck.create({
      name: `${sourceDeck.name} (Clone)`,
      description: sourceDeck.description,
      isPublic: false, // Default to private
      tags: sourceDeck.tags,
      userId: req.user.id,
    });

    // Find all cards from the source deck
    const sourceCards = await Card.find({ deckId: sourceDeck._id });

    // Create new cards for the cloned deck if there are any
    if (sourceCards.length > 0) {
      const newCards = sourceCards.map(card => ({
        front: card.front,
        back: card.back,
        deckId: newDeck._id,
      }));

      await Card.insertMany(newCards);

      // Update the card count
      newDeck.totalCards = newCards.length;
      await newDeck.save();
    }

    res.status(201).json(newDeck);
  } catch (error) {
    next(error);
  }
};

export default {
  getDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  getPublicDecks,
  cloneDeck,
};