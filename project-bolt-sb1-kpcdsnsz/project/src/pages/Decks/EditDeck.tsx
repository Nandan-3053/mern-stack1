import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DeckForm from '../../components/Decks/DeckForm';
import deckService from '../../services/deckService';
import { Deck } from '../../types/deck';
import Button from '../../components/UI/Button';
import LoadingScreen from '../../components/UI/LoadingScreen';

const EditDeck = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeck = async () => {
      if (!deckId) return;
      
      try {
        setIsLoading(true);
        const deckData = await deckService.getDeck(deckId);
        setDeck(deckData);
      } catch (err) {
        setError('Failed to load deck details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeck();
  }, [deckId]);

  const handleSubmit = async (
    name: string,
    description: string,
    isPublic: boolean,
    tags: string[]
  ) => {
    if (!deckId) return;
    
    try {
      setIsSaving(true);
      setError(null);
      const updatedDeck = await deckService.updateDeck(deckId, {
        name,
        description,
        isPublic,
        tags,
      });
      setDeck(updatedDeck);
      navigate(`/decks/${deckId}`);
    } catch (err) {
      setError('Failed to update deck. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="h-5 w-5" />}
        >
          Back
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Deck</h1>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <DeckForm
          initialName={deck.name}
          initialDescription={deck.description}
          initialIsPublic={deck.isPublic}
          initialTags={deck.tags}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={isSaving}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditDeck;