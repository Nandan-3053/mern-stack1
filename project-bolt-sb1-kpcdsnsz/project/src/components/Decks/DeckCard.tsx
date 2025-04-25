import { Link } from 'react-router-dom';
import { Book, BookOpen, Clock, Copy, Calendar, Tag } from 'lucide-react';
import { Deck } from '../../types/deck';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface DeckCardProps {
  deck: Deck;
  onClone?: () => void;
  isCloneable?: boolean;
}

const DeckCard = ({ deck, onClone, isCloneable = false }: DeckCardProps) => {
  const formattedDate = new Date(deck.createdAt).toLocaleDateString();
  
  return (
    <Card hoverable className="h-full flex flex-col">
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {deck.name}
          </h3>
          {deck.isPublic && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Public
            </span>
          )}
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{deck.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>
              {deck.totalCards} {deck.totalCards === 1 ? 'card' : 'cards'}
            </span>
          </div>
          
          {deck.cardsToReview > 0 && (
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              <span>{deck.cardsToReview} due for review</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Created on {formattedDate}</span>
          </div>
        </div>
        
        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {deck.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex mt-4 space-x-2">
        <Link to={`/decks/${deck.id}`} className="flex-1">
          <Button fullWidth leftIcon={<Book />}>
            View
          </Button>
        </Link>
        
        {deck.totalCards > 0 && (
          <Link to={`/decks/${deck.id}/study`} className="flex-1">
            <Button fullWidth variant="secondary">
              Study
            </Button>
          </Link>
        )}
        
        {isCloneable && onClone && (
          <Button
            variant="outline"
            leftIcon={<Copy className="h-4 w-4" />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClone();
            }}
          >
            Clone
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DeckCard;