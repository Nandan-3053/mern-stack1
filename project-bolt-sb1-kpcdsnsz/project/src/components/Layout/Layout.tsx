import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Routes where we show full-width layout without sidebar
  const fullWidthRoutes = ['/', '/login', '/register', '/404'];
  const isFullWidth = fullWidthRoutes.includes(location.pathname);
  
  // Study mode gets a special minimalist layout
  const isStudyMode = location.pathname.includes('/study');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isStudyMode && <Navbar onMenuClick={() => setSidebarOpen(true)} />}
      
      <div className="flex flex-1">
        {!isFullWidth && !isStudyMode && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        <main className={`flex-1 p-4 sm:p-6 ${isStudyMode ? 'p-0' : ''}`}>
          {children}
        </main>
      </div>
      
      {!isStudyMode && <Footer />}
    </div>
  );
};

export default Layout;