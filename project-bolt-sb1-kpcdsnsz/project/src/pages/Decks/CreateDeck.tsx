import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DeckForm from '../../components/Decks/DeckForm';
import deckService from '../../services/deckService';
import Button from '../../components/UI/Button';

const CreateDeck = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (
    name: string,
    description: string,
    isPublic: boolean,
    tags: string[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const newDeck = await deckService.createDeck({
        name,
        description,
        isPublic,
        tags,
      });
      navigate(`/decks/${newDeck.id}`);
    } catch (err) {
      setError('Failed to create deck. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Deck</h1>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <DeckForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={isLoading}
          submitLabel="Create Deck"
        />
      </div>
    </div>
  );
};

export default CreateDeck;