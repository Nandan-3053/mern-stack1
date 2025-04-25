import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a deck name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    totalCards: {
      type: Number,
      default: 0,
    },
    cardsToReview: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
deckSchema.index({ userId: 1 });
deckSchema.index({ isPublic: 1 });
deckSchema.index({ tags: 1 });

const Deck = mongoose.model('Deck', deckSchema);

export default Deck;