import { Card } from './card';

export interface Deck {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  totalCards: number;
  cardsToReview: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  cards?: Card[];
}

export interface DeckCreateInput {
  name: string;
  description: string;
  isPublic: boolean;
  tags?: string[];
}

export interface DeckUpdateInput {
  name?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface DeckStats {
  totalCards: number;
  newCards: number;
  reviewCards: number;
  masteredCards: number;
  averageScore: number;
}