import api from './api';
import { Deck, DeckCreateInput, DeckUpdateInput } from '../types/deck';

const deckService = {
  // Get all decks for current user
  getDecks: async (): Promise<Deck[]> => {
    const response = await api.get('/decks');
    return response.data;
  },

  // Get a specific deck by id
  getDeck: async (id: string): Promise<Deck> => {
    const response = await api.get(`/decks/${id}`);
    return response.data;
  },

  // Create new deck
  createDeck: async (deck: DeckCreateInput): Promise<Deck> => {
    const response = await api.post('/decks', deck);
    return response.data;
  },

  // Update existing deck
  updateDeck: async (id: string, deck: DeckUpdateInput): Promise<Deck> => {
    const response = await api.put(`/decks/${id}`, deck);
    return response.data;
  },

  // Delete a deck
  deleteDeck: async (id: string): Promise<void> => {
    await api.delete(`/decks/${id}`);
  },

  // Get all public decks
  getPublicDecks: async (): Promise<Deck[]> => {
    const response = await api.get('/decks/public');
    return response.data;
  },

  // Clone a public deck
  cloneDeck: async (id: string): Promise<Deck> => {
    const response = await api.post(`/decks/${id}/clone`);
    return response.data;
  },
};

export default deckService;