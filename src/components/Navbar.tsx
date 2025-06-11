import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Tag, Grid3X3 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [logoHoverTimer, setLogoHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300';
  };

  const handleLogoMouseEnter = () => {
    const timer = setTimeout(() => {
      setShowAdminLink(true);
    }, 3000); // Show admin link after hovering for 3 seconds
    setLogoHoverTimer(timer);
  };

  const handleLogoMouseLeave = () => {
    if (logoHoverTimer) {
      clearTimeout(logoHoverTimer);
      setLogoHoverTimer(null);
    }
    // Keep admin link visible for a short period after mouse leaves
    setTimeout(() => {
      setShowAdminLink(false);
    }, 1000);
  };

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (logoHoverTimer) {
        clearTimeout(logoHoverTimer);
      }
    };
  }, [logoHoverTimer]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="relative" onMouseEnter={handleLogoMouseEnter} onMouseLeave={handleLogoMouseLeave}>
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full barrush-gradient-bg flex items-center justify-center text-white font-bold text-lg">
                  B
                </div>
                <span className="text-xl font-bold barrush-gradient-text">
                  BarRush
                </span>
              </Link>
              {showAdminLink && (
                <Link 
                  to="/admin" 
                  className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 py-1 px-2 text-xs text-primary shadow-md rounded transition-opacity duration-300 opacity-100 hover:font-bold"
                >
                  Admin Access
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">            
            <Link 
              to="/categories" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 ${isActive('/categories')}`}
            >
              <Grid3X3 size={16} />
              Shop
            </Link>
            <Link 
              to="/recipes" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 ${isActive('/recipes')}`}
            >
              Cocktail Recipes
            </Link>
            <Link 
              to="/offers" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 ${isActive('/offers')}`}
            >
              <Tag size={16} />
              Offers
            </Link>
            <Link 
              to="/delivery-services" 
              className={`px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 ${isActive('/categories')}`}
            >
              <Grid3X3 size={16} />
              Delivery Services
            </Link>

            <Link to="/cart" className="ml-1">
              <Button variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-2">
              <Button variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
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
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 rounded-b-lg animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/categories" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${isActive('/categories')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Grid3X3 size={18} />
              Shop Now
            </Link>
            <Link 
              to="/recipes" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${isActive('/recipes')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Cocktail Recipes
            </Link>
            <Link 
              to="/offers" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${isActive('/offers')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Tag size={18} />
              Offers
            </Link>
            <Link 
              to="/delivery-services"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${isActive('/delivery-services')}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Delivery Services
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
