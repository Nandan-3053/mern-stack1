import api from './api';
import { Card, CardCreateInput, CardUpdateInput } from '../types/card';

const cardService = {
  // Get all cards for a deck
  getCards: async (deckId: string): Promise<Card[]> => {
    const response = await api.get(`/decks/${deckId}/cards`);
    return response.data;
  },

  // Get a specific card
  getCard: async (deckId: string, cardId: string): Promise<Card> => {
    const response = await api.get(`/decks/${deckId}/cards/${cardId}`);
    return response.data;
  },

  // Create new card
  createCard: async (deckId: string, card: CardCreateInput): Promise<Card> => {
    const response = await api.post(`/decks/${deckId}/cards`, card);
    return response.data;
  },
  
  // Create multiple cards at once
  createCards: async (deckId: string, cards: CardCreateInput[]): Promise<Card[]> => {
    const response = await api.post(`/decks/${deckId}/cards/batch`, { cards });
    return response.data;
  },

  // Update existing card
  updateCard: async (deckId: string, cardId: string, card: CardUpdateInput): Promise<Card> => {
    const response = await api.put(`/decks/${deckId}/cards/${cardId}`, card);
    return response.data;
  },

  // Delete a card
  deleteCard: async (deckId: string, cardId: string): Promise<void> => {
    await api.delete(`/decks/${deckId}/cards/${cardId}`);
  },

  // Update card study stats
  updateCardStats: async (
    deckId: string, 
    cardId: string, 
    stats: { difficulty: number; nextReview?: Date }
  ): Promise<Card> => {
    const response = await api.put(`/decks/${deckId}/cards/${cardId}/stats`, stats);
    return response.data;
  },
};

export default cardService;