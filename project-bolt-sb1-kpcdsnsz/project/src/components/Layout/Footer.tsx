import { Heart, Github as GitHub } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-sm mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} FlashLearn. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-600 transition"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-600 transition"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-600 transition"
            >
              Help
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-600 transition flex items-center"
            >
              <GitHub className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;