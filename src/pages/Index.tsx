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
    name: "White Cap Lager 500ml",
    price: 2.50,
    image: "https://greenspoon.co.ke/wp-content/uploads/2023/02/Greenspoon-Kenya-White-Cap-Can.jpg",
    category: "Beer",
    description: "A refreshing choice for those seeking a balanced and flavorful medium beer experience."
  },
  {
    id: 2,
    name: "Frontera Cabernet Sauvignon",
    price: 12.00,
    image: "https://cdn.shopify.com/s/files/1/0871/2640/9530/files/jcell_cabernet_f_375ml_v20-1707408341712.png?v=1715264982",
    category: "Wine",
    description: "Full-bodied red wine with notes of black cherry and vanilla."
  },
  {
    id: 3,
    name: "Craft Cola",
    price: 0.80,
    image: "https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Mixers & More",
    description: "Artisanal cola made with natural ingredients and cane sugar."
  },
  {
    id: 4,
    name: "Sparkling Water",
    price: 5.99,
    image: "https://plus.unsplash.com/premium_photo-1687354232206-778ddd5d929f?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Non-Alcoholic",
    description: "Refreshing sparkling water with natural flavors."
  },
  {
    id: 501,
    name: "Classic Mojito",
    price: 5.00,
    image: "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
    category: "Cocktails",
    description: "A refreshing and energizing drink made with mint, lime juice, sugar, and soda water."
  },
  {
    id: 6,
    name: "Johnnie Walker Black Label",
    price: 38.00,
    image: "https://media.istockphoto.com/id/458070783/photo/johnnie-walker-black-label-whiskey.jpg?s=612x612&w=0&k=20&c=s01VpwN17K7yH5GUX0FAabraDzXwSKAXCQmimOceHmc=",
    category: "Spirits",
    description: "An iconic blend, recognized as the benchmark for all other deluxe blends."
  },
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
      {/* Hero section with delivery animation */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
        {/* Animated Delivery Person - positioned for all screen sizes */}
        <div className="absolute right-0 top-0 h-full w-full lg:w-1/2 z-0 pointer-events-none">
          <div className="relative h-full w-full opacity-20 md:opacity-80">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute top-0 right-0 h-full w-full object-cover object-center-right"
            >
              <source src="/88242-602915695-small-unscreen.gif" type="video/gif" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        {/* Content overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Text Content - Takes full width on mobile, half on desktop */}
            <div className="w-full lg:w-1/2 animate-fade-in backdrop-blur-sm bg-gradient-to-r from-primary/90 to-primary/30 p-6 rounded-xl">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white mb-4">
                Fast Delivery • 15-45 Minutes
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                Premium Drinks Delivered In Minutes
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/80">
                From craft beers to fine wines, cocktails, spirits, and non-alcoholic options,
                we've got your beverage needs covered with fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/categories">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100 font-medium">
                    Browse Drinks
                  </Button>
                </Link>
                <Link to="/recipes">
                  <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100 font-medium">
                    <Tag className="mr-2 h-5 w-5" />
                    View Recipes
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image - Takes full width on mobile, half on desktop */}
            <div className="w-full lg:w-1/2 animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1603052875460-4f3a2b8c5d7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJlZXJ8ZW58MHx8fHwxNjYyNTQ1NzA5&ixlib=rb-1.2.1&q=80&w=1080"
                alt="Drinks"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
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
            We deliver to most locations within 15-45 minutes. Our app can now automatically detect your location for faster delivery.
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
