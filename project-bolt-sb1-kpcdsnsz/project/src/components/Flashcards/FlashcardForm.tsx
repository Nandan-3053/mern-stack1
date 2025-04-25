import { useState } from 'react';
import Button from '../UI/Button';

interface FlashcardFormProps {
  initialFront?: string;
  initialBack?: string;
  onSubmit: (front: string, back: string) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const FlashcardForm = ({
  initialFront = '',
  initialBack = '',
  onSubmit,
  onCancel,
  loading = false,
}: FlashcardFormProps) => {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const [errors, setErrors] = useState({ front: '', back: '' });

  const validate = () => {
    const newErrors = { front: '', back: '' };
    let isValid = true;

    if (!front.trim()) {
      newErrors.front = 'Question is required';
      isValid = false;
    }

    if (!back.trim()) {
      newErrors.back = 'Answer is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(front, back);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <textarea
          id="front"
          rows={3}
          className={`form-input ${errors.front ? 'border-error-300' : ''}`}
          placeholder="Enter the question or front of the card"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        {errors.front && <p className="mt-1 text-sm text-error-500">{errors.front}</p>}
      </div>

      <div>
        <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-1">
          Answer
        </label>
        <textarea
          id="back"
          rows={3}
          className={`form-input ${errors.back ? 'border-error-300' : ''}`}
          placeholder="Enter the answer or back of the card"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        {errors.back && <p className="mt-1 text-sm text-error-500">{errors.back}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          isLoading={loading}
        >
          Save Card
        </Button>
      </div>
    </form>
  );
};

export default FlashcardForm;