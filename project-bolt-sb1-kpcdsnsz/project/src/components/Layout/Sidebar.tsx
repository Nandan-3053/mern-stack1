import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, Bookmark, Settings, Search, BookOpen, FolderPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { isAuthenticated, user } = useAuth();
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscKey);
      // Add overflow hidden to body to prevent scrolling when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-xl font-bold text-gray-900">FlashLearn</span>
          </div>
          <button
            className="rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="pt-5 pb-4">
          <div className="px-4 mb-5">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="px-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                }`
              }
              onClick={onClose}
            >
              <Home className="mr-3 h-5 w-5 flex-shrink-0" />
              Dashboard
            </NavLink>

            <NavLink
              to="/decks"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                }`
              }
              onClick={onClose}
            >
              <Bookmark className="mr-3 h-5 w-5 flex-shrink-0" />
              My Decks
            </NavLink>

            <NavLink
              to="/decks/create"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                }`
              }
              onClick={onClose}
            >
              <FolderPlus className="mr-3 h-5 w-5 flex-shrink-0" />
              New Deck
            </NavLink>

            <NavLink
              to="/decks/public"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                }`
              }
              onClick={onClose}
            >
              <Search className="mr-3 h-5 w-5 flex-shrink-0" />
              Explore Decks
            </NavLink>

            <div className="mt-10 pt-5 border-t border-gray-200">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                  }`
                }
                onClick={onClose}
              >
                <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                Settings
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;