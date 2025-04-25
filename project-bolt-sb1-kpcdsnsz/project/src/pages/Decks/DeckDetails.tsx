import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, BookOpen } from 'lucide-react';
import deckService from '../../services/deckService';
import cardService from '../../services/cardService';
import { Deck } from '../../types/deck';
import { Card } from '../../types/card';
import Button from '../../components/UI/Button';
import LoadingScreen from '../../components/UI/LoadingScreen';
import Flashcard from '../../components/Flashcards/Flashcard';
import FlashcardForm from '../../components/Flashcards/FlashcardForm';

const DeckDetails = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      if (!deckId) return;
      
      try {
        setIsLoading(true);
        const deckData = await deckService.getDeck(deckId);
        const cardsData = await cardService.getCards(deckId);
        
        setDeck(deckData);
        setCards(cardsData);
      } catch (err) {
        setError('Failed to load deck details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [deckId]);

  const handleAddCard = async (front: string, back: string) => {
    if (!deckId) return;
    
    try {
      setIsAddingCard(true);
      const newCard = await cardService.createCard(deckId, { front, back });
      setCards([...cards, newCard]);
      setShowAddCard(false);
      
      // Update deck's total cards count
      if (deck) {
        setDeck({
          ...deck,
          totalCards: deck.totalCards + 1
        });
      }
    } catch (err) {
      setError('Failed to add card. Please try again.');
      console.error(err);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!deckId || !window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deckService.deleteDeck(deckId);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete deck. Please try again.');
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!deck) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Deck not found</h3>
        <p className="text-gray-500 mb-4">The deck you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="h-5 w-5" />}
        >
          Back
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{deck.name}</h1>
            <p className="text-gray-600 mt-1">{deck.description}</p>
            
            {deck.tags && deck.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {deck.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Link to={`/decks/${deckId}/edit`}>
              <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
                Edit Deck
              </Button>
            </Link>
            <Button 
              variant="danger" 
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={handleDeleteDeck}
            >
              Delete
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 mb-4">
          <div className="flex items-center">
            <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              {deck.totalCards} {deck.totalCards === 1 ? 'card' : 'cards'}
            </div>
            {deck.isPublic && (
              <div className="ml-2 bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                Public
              </div>
            )}
          </div>
          
          {deck.totalCards > 0 && (
            <Link to={`/decks/${deckId}/study`}>
              <Button leftIcon={<BookOpen className="h-5 w-5" />}>
                Study Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Flashcards</h2>
          <Button 
            onClick={() => setShowAddCard(!showAddCard)}
            leftIcon={<Plus className="h-5 w-5" />}
          >
            Add Card
          </Button>
        </div>

        {showAddCard && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Flashcard</h3>
            <FlashcardForm
              onSubmit={handleAddCard}
              onCancel={() => setShowAddCard(false)}
              loading={isAddingCard}
            />
          </div>
        )}

        {cards.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No flashcards yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first flashcard to this deck</p>
            <Button 
              onClick={() => setShowAddCard(true)}
              leftIcon={<Plus className="h-5 w-5" />}
            >
              Add First Card
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Flashcard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckDetails;