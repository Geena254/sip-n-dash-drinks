
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, CupSoda, Tag, Percent } from 'lucide-react';
import DrinkCard from '@/components/DrinkCard';
import { DrinkItem } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  { name: "Beer", count: 24, icon: CupSoda, bgColor: "bg-amber-50", textColor: "text-amber-600" },
  { name: "Wine", count: 18, icon: CupSoda, bgColor: "bg-rose-50", textColor: "text-rose-600" },
  { name: "Spirits", count: 32, icon: Package, bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
  { name: "Non-Alcoholic", count: 12, icon: CupSoda, bgColor: "bg-emerald-50", textColor: "text-emerald-600" }
];

const specialOffers = [
  { title: "20% Off Wine", code: "WINE20", bgColor: "bg-gradient-to-br from-rose-100 to-pink-200" },
  { title: "$10 Off Premium Spirits", code: "SPIRITS10", bgColor: "bg-gradient-to-br from-blue-100 to-indigo-200" },
  { title: "Buy 2 Get 1 Free on Craft Beer", code: "BEER3FOR2", bgColor: "bg-gradient-to-br from-amber-100 to-yellow-200" }
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section with improved design */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="animate-fade-in">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white mb-4">
                Fast Delivery • 30-45 Minutes
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                Premium Drinks Delivered In Minutes
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/80">
                From craft beers to fine wines, spirits, and non-alcoholic options,
                we've got your beverage needs covered with fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100 font-medium">
                  Browse Drinks
                </Button>
                <Link to="/offers">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    <Tag className="mr-2 h-5 w-5" />
                    View Offers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories section with improved UI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/categories" className="text-primary hover:underline font-medium">
            View All Categories
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              to={`/categories`} 
              state={{ category: category.name }}
              key={category.name}
              className="group"
            >
              <Card className="h-full overflow-hidden border-0 shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
                <CardContent className={`p-6 ${category.bgColor}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`font-medium text-lg ${category.textColor}`}>{category.name}</h3>
                    <category.icon className={`${category.textColor}`} size={24} />
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                    <span className="text-primary text-sm font-medium">Browse →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured drinks section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Drinks</h2>
            <Link to="/categories" className="text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          
          <div className="drink-card-container">
            {featuredDrinks.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        </div>
      </div>

      {/* Special offers section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Special Offers</h2>
          <Link to="/offers" className="text-primary hover:underline font-medium">
            View All Offers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specialOffers.map((offer, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`${offer.bgColor} p-6 flex flex-col justify-between min-h-[180px]`}>
                <Percent className="h-12 w-12 text-white/40" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Use code: <span className="font-medium">{offer.code}</span></p>
                  <Link to="/offers">
                    <Button className="mt-4" variant="outline" size="sm">
                      Claim Offer
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fast delivery section with improved UI */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Fast Delivery In Your Area</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We deliver to most locations within 30-45 minutes. Our app can now automatically detect your location for faster delivery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/checkout">
              <Button className="gap-2 px-6" size="lg">
                <ShoppingCart size={18} />
                Order Now
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" className="gap-2 px-6" size="lg">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
