import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DrinkCard from '@/components/DrinkCard';
import { DrinkItem } from '@/context/CartContext';
import { getDrinkCategories, getDrinks } from '@/service/apiService';

type Drink = {
  id: number;
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

const Categories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const[categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);

  const groupedDrinks = drinks.reduce<Record<string, Drink[]>>((acc, drink) => {
    const category = drink.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(drink);
    return acc;
  }, {});

  useEffect(() => {
    console.log("Testing API connection...");
    fetch('https://barrush-backend.onrender.com/api/drinks/')
      .then(response => {
        console.log("Status code:", response.status);
        return response.json();
      })
      .then(data => {
        console.log("Received data:", data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

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

   // drinks fetch
   const fetchDrinks = async () => {
    try {
      const data = await getDrinks();
      setDrinks(data);
    } catch (err) {
      console.error('Error loading drinks:', err);
    }
  };
  useEffect(() => {
    fetchDrinks();
  }, []);

  const lowerSearch = searchTerm.toLowerCase();

  const categoryDrinks = activeCategory && groupedDrinks[activeCategory]
    ? groupedDrinks[activeCategory]
    : [];

  const filteredDrinks = activeCategory
    ? categoryDrinks.filter(({ name, description }) =>
        name.toLowerCase().includes(lowerSearch) ||
        description.toLowerCase().includes(lowerSearch)
      )
    : Object.values(groupedDrinks)
        .flat()
        .filter(({ name, description }) =>
          name.toLowerCase().includes(lowerSearch) ||
          description.toLowerCase().includes(lowerSearch)
        );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold barrush-gradient-text from-primary to-secondary bg-clip-text text-transparent">
          Browse Categories
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore our wide selection of premium drinks, from craft beers to fine wines, cocktails, spirits, and non-alcoholic options.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drinks by name or description..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {categories.map((category) => {
          const isActive = activeCategory === category.name;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all transform hover:-translate-y-1 ${
                isActive ? 'border-primary shadow-md' : ''
              }`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Badge variant={isActive ? "default" : "outline"}>{category.product_count} items</Badge>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs"
                >
                  {isActive ? 'Selected' : 'View All'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {activeCategory ? `${activeCategory} Selection` : "All Drinks"}
          </h2>
          {activeCategory && (
            <Button variant="outline" onClick={() => setActiveCategory(null)} size="sm">
              View All Categories
            </Button>
          )}
        </div>

        {filteredDrinks.length > 0 ? (
          <div className="drink-card-container">
            {filteredDrinks.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-lg font-medium">No drinks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
