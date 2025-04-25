import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import deckService from '../../services/deckService';
import cardService from '../../services/cardService';
import { Deck } from '../../types/deck';
import { Card, StudyCard } from '../../types/card';
import Button from '../../components/UI/Button';
import LoadingScreen from '../../components/UI/LoadingScreen';

const StudySession = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState({
    totalCards: 0,
    correct: 0,
    incorrect: 0,
    remaining: 0,
  });

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      if (!deckId) return;
      
      try {
        setIsLoading(true);
        const deckData = await deckService.getDeck(deckId);
        const cardsData = await cardService.getCards(deckId);
        
        // Transform cards for study session
        const studyCards: StudyCard[] = cardsData.map(card => ({
          ...card,
          isFlipped: false,
          isCorrect: null,
        }));

        setDeck(deckData);
        setCards(studyCards);
        setStats({
          totalCards: studyCards.length,
          correct: 0,
          incorrect: 0,
          remaining: studyCards.length,
        });
      } catch (err) {
        setError('Failed to load study session. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [deckId]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCardResult = async (isCorrect: boolean) => {
    if (!deckId || !cards[currentCardIndex]) return;
    
    try {
      // Update card stats
      const difficulty = isCorrect ? 1 : 3; // 1: Easy, 3: Hard
      await cardService.updateCardStats(deckId, cards[currentCardIndex].id, { difficulty });
      
      // Update local state
      const updatedCards = [...cards];
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        isCorrect,
      };
      setCards(updatedCards);
      
      // Update stats
      setStats({
        ...stats,
        correct: isCorrect ? stats.correct + 1 : stats.correct,
        incorrect: isCorrect ? stats.incorrect : stats.incorrect + 1,
        remaining: stats.remaining - 1,
      });
      
      // Move to next card or complete
      if (currentCardIndex < cards.length - 1) {
        moveToNextCard();
      } else {
        setIsCompleted(true);
      }
    } catch (err) {
      setError('Failed to save your answer. Please try again.');
      console.error(err);
    }
  };

  const moveToNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(currentCardIndex + 1);
    }, 300);
  };

  const resetSession = () => {
    setIsFlipped(false);
    setCurrentCardIndex(0);
    setIsCompleted(false);
    
    // Reset all cards
    const resetCards = cards.map(card => ({
      ...card,
      isFlipped: false,
      isCorrect: null,
    }));
    setCards(resetCards);
    
    // Reset stats
    setStats({
      totalCards: resetCards.length,
      correct: 0,
      incorrect: 0,
      remaining: resetCards.length,
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!deck || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {!deck ? 'Deck not found' : 'No cards in this deck'}
        </h3>
        <p className="text-gray-500 mb-4">
          {!deck
            ? "The deck you're looking for doesn't exist or you don't have access to it."
            : 'Add some cards to this deck before starting a study session.'}
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  if (isCompleted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Session Complete!</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCards}</p>
            </div>
            <div className="bg-success-50 p-4 rounded-lg">
              <p className="text-success-500 text-sm">Correct</p>
              <p className="text-3xl font-bold text-success-500">{stats.correct}</p>
            </div>
            <div className="bg-error-50 p-4 rounded-lg">
              <p className="text-error-500 text-sm">Incorrect</p>
              <p className="text-3xl font-bold text-error-500">{stats.incorrect}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button onClick={resetSession} leftIcon={<RefreshCw className="h-5 w-5" />}>
              Restart Session
            </Button>
            <Button variant="outline" onClick={() => navigate(`/decks/${deckId}`)}>
              Back to Deck
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Exit
          </Button>
          
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="font-medium">{currentCardIndex + 1}</span>
              <span className="text-gray-500"> / {cards.length}</span>
            </div>
            <div className="text-sm text-success-500 font-medium">{stats.correct} ✓</div>
            <div className="text-sm text-error-500 font-medium">{stats.incorrect} ✗</div>
          </div>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">{deck.name}</h1>
        </div>

        <div className="perspective-1000 w-full">
          <div className="relative max-w-md mx-auto h-72 sm:h-96" onClick={handleFlip}>
            <motion.div
              className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl shadow-xl flex flex-col p-8"
              animate={{ 
                rotateY: isFlipped ? 180 : 0,
                opacity: isFlipped ? 0 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question</h3>
                <p className="text-xl text-gray-700">{currentCard.front}</p>
              </div>
              <div className="text-center text-gray-500 text-sm mt-4">
                Click to reveal answer
              </div>
            </motion.div>

            <motion.div
              className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl shadow-xl flex flex-col p-8"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ 
                rotateY: isFlipped ? 0 : 180,
                opacity: isFlipped ? 1 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer</h3>
                <p className="text-xl text-gray-700">{currentCard.back}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 text-center max-w-md mx-auto">
          {isFlipped ? (
            <div className="flex justify-center space-x-4">
              <Button
                variant="danger"
                size="lg"
                leftIcon={<X className="h-5 w-5" />}
                onClick={() => handleCardResult(false)}
              >
                I was wrong
              </Button>
              <Button
                variant="success"
                size="lg"
                leftIcon={<Check className="h-5 w-5" />}
                onClick={() => handleCardResult(true)}
              >
                I was right
              </Button>
            </div>
          ) : (
            <Button size="lg" onClick={handleFlip}>
              Show Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySession;