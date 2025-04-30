import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Tag, Grid3X3 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-medium' : 'text-gray-700';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                B
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BarRush
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 ${isActive('/recipes')}`}
            >
              Cocktail Recipes
            </Link>
            <Link 
              to="/categories" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 ${isActive('/categories')}`}
            >
              <Grid3X3 size={16} />
              Shop
            </Link>
            <Link 
              to="/offers" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 ${isActive('/offers')}`}
            >
              <Tag size={16} />
              Offers
            </Link>
            <Link to="/cart" className="ml-4">
              <Button variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-2">
              <Button variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 flex items-center gap-2 ${isActive('/categories')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Grid3X3 size={18} />
              Shop
            </Link>
            <Link 
              to="/categories" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 flex items-center gap-2 ${isActive('/recipes')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Grid3X3 size={18} />
              Cocktail Recipes
            </Link>
            <Link 
              to="/offers" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 flex items-center gap-2 ${isActive('/offers')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Tag size={18} />
              Offers
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
