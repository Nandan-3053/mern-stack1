import { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { Tag, Plus, X } from 'lucide-react';

interface DeckFormProps {
  initialName?: string;
  initialDescription?: string;
  initialIsPublic?: boolean;
  initialTags?: string[];
  onSubmit: (name: string, description: string, isPublic: boolean, tags: string[]) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
}

const DeckForm = ({
  initialName = '',
  initialDescription = '',
  initialIsPublic = false,
  initialTags = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Create Deck',
}: DeckFormProps) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '' });

  const validate = () => {
    const newErrors = { name: '', description: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Deck name is required';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(name, description, isPublic, tags);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Deck Name"
          id="name"
          placeholder="Enter deck name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className={`form-input ${errors.description ? 'border-error-300' : ''}`}
          placeholder="Enter a description for your deck"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="mt-1 text-sm text-error-500">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex items-center">
          <Input
            id="tagInput"
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            leftIcon={<Tag className="h-4 w-4 text-gray-500" />}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addTag}
            className="ml-2"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add
          </Button>
        </div>
        
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isPublic"
          type="checkbox"
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
          Make this deck public (Others can view and copy it)
        </label>
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
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default DeckForm;