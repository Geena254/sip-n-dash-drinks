import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, CupSoda } from 'lucide-react';
import DrinkCard from '@/components/DrinkCard';
import { DrinkItem } from '@/context/CartContext';

// Sample data for drinks
const featuredDrinks: DrinkItem[] = [
  {
    id: 1,
    name: "Premium Vodka",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1614963366795-973eb8748ebb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Spirits",
    description: "Smooth premium vodka, perfect for cocktails or enjoying on the rocks."
  },
  {
    id: 2,
    name: "Craft IPA Beer",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Beer",
    description: "Hoppy and flavorful IPA from a local craft brewery."
  },
  {
    id: 3,
    name: "Red Wine Blend",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Wine",
    description: "Medium-bodied red wine with notes of dark fruit and oak."
  },
  {
    id: 4,
    name: "Sparkling Water",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1603394630850-69b3ca8121ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Non-Alcoholic",
    description: "Refreshing sparkling water with natural flavors."
  },
  {
    id: 5,
    name: "Japanese Whisky",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Spirits",
    description: "Smooth and complex whisky with hints of smoke and honey."
  },
  {
    id: 6,
    name: "Craft Cola",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Non-Alcoholic",
    description: "Artisanal cola made with natural ingredients and cane sugar."
  }
];

const categories = [
  { name: "Beer", count: 24, icon: CupSoda },
  { name: "Wine", count: 18, icon: CupSoda },
  { name: "Spirits", count: 32, icon: Package },
  { name: "Non-Alcoholic", count: 12, icon: CupSoda }
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary/90 to-secondary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Premium Drinks Delivered In Minutes
            </h1>
            <p className="text-lg mb-8">
              From craft beers to fine wines, spirits, and non-alcoholic options,
              we've got your beverage needs covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
                Browse Drinks
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                View Offers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.name.toLowerCase()}`} 
              key={category.name}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{category.name}</h3>
                <category.icon className="text-primary" size={24} />
              </div>
              <p className="text-sm text-muted-foreground">{category.count} items</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured drinks section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Drinks</h2>
            <Link to="/all-drinks" className="text-primary font-medium">
              View All
            </Link>
          </div>
          
          <div className="drink-card-container">
            {featuredDrinks.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Fast Delivery In Your Area</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We deliver to most locations within 30-45 minutes. Enter your address to check if we deliver to your area.
            </p>
            <Link to="/checkout">
              <Button className="gap-2">
                <ShoppingCart size={18} />
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
