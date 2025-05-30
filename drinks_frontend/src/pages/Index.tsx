import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, CupSoda, Tag, Percent } from 'lucide-react';
import DrinkCard from '@/components/DrinkCard';
import { DrinkItem } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDrinkCategories, getDrinks, getOffers } from '@/service/apiService';
import Lottie from "lottie-react";
import devAnimation from "../images/delivery man.json";

interface Offer {
  id: number;
  title: string;
  description: string;
  category: string;
  discount: string;
  code: string;
}

const Index = () => {
  const [categories, setCategories] = useState([])
  const [drinks, setDrinks] = useState([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  // offers fetch
  const fetchOffers = async () => {
    try {
      const data = await getOffers();
      setOffers(data.slice(0, 3));
    } catch (err) {
      console.error('Error loading Offers:', err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // drinks fetch
  const fetchDrinks = async () => {
    try {
      const data = await getDrinks();
      setDrinks(data.slice(0, 6));
    } catch (err) {
      console.error('Error loading drinks:', err);
    }
  };
  useEffect(() => {
    fetchDrinks();
  }, []);

  // drinks category fetch
  const fetchDrinksCategories = async () => {
    try {
      const data = await getDrinkCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading drinks:', err);
    }
  };
  useEffect(() => {
    fetchDrinksCategories();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero section with simplified clean design */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="text-center max-w-xl">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white mb-4">
                Fast Delivery • 15-45 Minutes
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Premium Drinks Delivered In Minutes
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                From craft beers to fine wines, cocktails, spirits, and non-alcoholic options,
                we've got your beverage needs covered with fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/categories">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100 font-medium">
                    Browse Drinks
                  </Button>
                </Link>
                <Link to="/recipes">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-medium">
                    <Tag className="mr-2 h-5 w-5" />
                    View Recipes
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-150 h-150 mt-10 md:mt-0">
              <Lottie
                animationData={devAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full"
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
                <CardContent className="p-6 bg-rose-50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-lg bg-rose-50">{category.name}</h3>
                    {/* <category.icon className="text-rose-600" size={24} /> */}
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-sm text-muted-foreground">{category.product_count} items</p>
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
            {drinks.map((drink) => (
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
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="bg-gradient-to-br from-rose-100 to-pink-200 p-6 flex flex-col justify-between min-h-[180px]">
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
