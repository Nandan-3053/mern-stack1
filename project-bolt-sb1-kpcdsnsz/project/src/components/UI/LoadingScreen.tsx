import { BookOpen } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center">
        <BookOpen className="h-16 w-16 text-primary-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;