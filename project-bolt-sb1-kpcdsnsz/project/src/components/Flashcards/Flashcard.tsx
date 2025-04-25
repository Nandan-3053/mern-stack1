import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../types/card';

interface FlashcardProps {
  card: Card;
  onCardFlip?: (isFlipped: boolean) => void;
  showButtons?: boolean;
}

const Flashcard = ({ card, onCardFlip, showButtons = false }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onCardFlip) {
      onCardFlip(!isFlipped);
    }
  };

  return (
    <div className="perspective-1000 w-full">
      <div 
        className="relative w-full h-64 cursor-pointer"
        onClick={handleFlip}
      >
        <motion.div
          className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg shadow-card flex flex-col justify-center p-6"
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            opacity: isFlipped ? 0 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Question</h3>
            <p className="text-gray-700">{card.front}</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg shadow-card flex flex-col justify-center p-6"
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ 
            rotateY: isFlipped ? 0 : 180,
            opacity: isFlipped ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Answer</h3>
            <p className="text-gray-700">{card.back}</p>
          </div>
        </motion.div>
      </div>

      {showButtons && isFlipped && (
        <div className="mt-4 flex justify-center space-x-2">
          <button className="px-4 py-2 bg-error-500 text-white rounded-md">
            Hard
          </button>
          <button className="px-4 py-2 bg-warning-500 text-white rounded-md">
            Medium
          </button>
          <button className="px-4 py-2 bg-success-500 text-white rounded-md">
            Easy
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;