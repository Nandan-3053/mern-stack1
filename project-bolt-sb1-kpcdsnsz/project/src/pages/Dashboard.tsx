import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bookmark, Search, Activity, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import deckService from '../services/deckService';
import { Deck } from '../types/deck';
import DeckCard from '../components/Decks/DeckCard';
import Button from '../components/UI/Button';
import LoadingScreen from '../components/UI/LoadingScreen';

const Dashboard = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setIsLoading(true);
        const decksData = await deckService.getDecks();
        setDecks(decksData);
      } catch (err) {
        setError('Failed to load your decks. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDecks();
  }, []);

  // Filter decks based on search term
  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (deck.tags && deck.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Calculate stats
  const totalCards = decks.reduce((sum, deck) => sum + deck.totalCards, 0);
  const cardsToReview = decks.reduce((sum, deck) => sum + deck.cardsToReview, 0);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/decks/create">
            <Button leftIcon={<Plus className="h-5 w-5" />}>
              Create New Deck
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full">
              <Bookmark className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Decks</p>
              <h3 className="text-2xl font-semibold text-gray-900">{decks.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-secondary-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cards</p>
              <h3 className="text-2xl font-semibold text-gray-900">{totalCards}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-accent-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Due for Review</p>
              <h3 className="text-2xl font-semibold text-gray-900">{cardsToReview}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Decks section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Decks</h2>
          <div className="mt-4 md:mt-0 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search decks..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {filteredDecks.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No decks match your search</h3>
                <p className="text-gray-500">Try a different search term or clear the search</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-1">You don't have any decks yet</h3>
                <p className="text-gray-500 mb-4">Start by creating your first flashcard deck</p>
                <Link to="/decks/create">
                  <Button leftIcon={<Plus className="h-5 w-5" />}>
                    Create New Deck
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;