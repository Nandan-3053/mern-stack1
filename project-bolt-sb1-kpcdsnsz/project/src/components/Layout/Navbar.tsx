import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Plus, Search, BookOpen, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex-shrink-0 flex items-center ml-2 md:ml-0">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">FlashLearn</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/decks/public"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Explore
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/decks/create')}
                  className="mr-2 hidden sm:inline-flex btn btn-primary"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  <span>New Deck</span>
                </button>
                
                <div className="relative ml-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  </div>
                  
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                        Signed in as <span className="font-medium">{user?.email}</span>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4 inline mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-outline text-primary-500">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;