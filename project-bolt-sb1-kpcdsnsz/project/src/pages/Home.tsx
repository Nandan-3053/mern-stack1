import { Link } from 'react-router-dom';
import { BookOpen, Brain, Clock, Users } from 'lucide-react';
import Button from '../components/UI/Button';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master Any Subject with Smart Flashcards
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-primary-100">
                Create, study, and master any topic with our spaced repetition system. Learn efficiently and remember forever.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg" variant="accent">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/decks/public">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                    Explore Decks
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/3 lg:w-2/5">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-accent-500 rounded-lg transform -rotate-6"></div>
                <div className="absolute -top-3 -left-3 w-64 h-64 bg-secondary-500 rounded-lg transform rotate-3"></div>
                <div className="relative w-64 h-64 bg-white rounded-lg shadow-xl p-6 transform rotate-0">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">What is the capital of France?</h3>
                    </div>
                    <div className="mt-4 p-2 bg-gray-100 rounded-md text-gray-800">
                      Paris
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why FlashLearn Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our scientifically-proven system uses spaced repetition to optimize your learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Flashcards</h3>
              <p className="text-gray-600">
                Create custom flashcards with questions and answers tailored to your learning needs.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-secondary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Spaced Repetition</h3>
              <p className="text-gray-600">
                Our system shows you cards at optimal intervals to maximize retention with minimal effort.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-accent-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Study Efficiently</h3>
              <p className="text-gray-600">
                Focus on what you need to learn, spend less time on what you already know.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-success-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share & Collaborate</h3>
              <p className="text-gray-600">
                Share your decks with friends or discover public decks created by others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  <span className="block">Ready to boost your learning?</span>
                  <span className="block">Start creating flashcards today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-secondary-200">
                  Join thousands of students, professionals, and lifelong learners who use FlashLearn to master new subjects.
                </p>
                <Link
                  to="/register"
                  className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-secondary-600 bg-white hover:bg-secondary-50"
                >
                  Sign up for free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;