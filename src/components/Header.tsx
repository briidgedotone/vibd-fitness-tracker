import { Menu as MenuIcon, X as XIcon } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Fitness Tracker</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-primary-200 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-primary-200 transition-colors">Workouts</a>
            <a href="#" className="hover:text-primary-200 transition-colors">Progress</a>
            <a href="#" className="hover:text-primary-200 transition-colors">Settings</a>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-2">
            <a href="#" className="block py-2 hover:text-primary-200 transition-colors">Dashboard</a>
            <a href="#" className="block py-2 hover:text-primary-200 transition-colors">Workouts</a>
            <a href="#" className="block py-2 hover:text-primary-200 transition-colors">Progress</a>
            <a href="#" className="block py-2 hover:text-primary-200 transition-colors">Settings</a>
          </div>
        )}
      </div>
    </header>
  );
}