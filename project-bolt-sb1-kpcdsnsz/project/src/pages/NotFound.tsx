import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/UI/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold text-primary-500">404</h1>
      <h2 className="text-3xl font-semibold text-gray-900 mt-6 mb-4">Page not found</h2>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg" leftIcon={<Home className="h-5 w-5" />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;