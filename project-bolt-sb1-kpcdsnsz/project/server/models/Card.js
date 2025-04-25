import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      required: [true, 'Please provide content for the front of the card'],
      trim: true,
    },
    back: {
      type: String,
      required: [true, 'Please provide content for the back of the card'],
      trim: true,
    },
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck',
      required: true,
    },
    nextReview: {
      type: Date,
      default: Date.now,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: Number,
      default: 2.5, // 0: Very Hard, 5: Very Easy
    },
  },
  { timestamps: true }
);

// Index for faster queries
cardSchema.index({ deckId: 1 });
cardSchema.index({ nextReview: 1 });

const Card = mongoose.model('Card', cardSchema);

export default Card;