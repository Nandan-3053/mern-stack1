export interface Card {
  id: string;
  front: string;
  back: string;
  deckId: string;
  nextReview: string | null;
  reviewCount: number;
  difficulty: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardCreateInput {
  front: string;
  back: string;
}

export interface CardUpdateInput {
  front?: string;
  back?: string;
}

export interface StudyCard extends Card {
  isFlipped: boolean;
  isCorrect: boolean | null;
}