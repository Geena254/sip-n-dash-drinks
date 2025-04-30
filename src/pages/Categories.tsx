
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CupSoda, Package, ShoppingBag, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DrinkCard from '@/components/DrinkCard';
import { DrinkItem } from '@/context/CartContext';

// Sample data for drinks categories
const categories = [
  { id: 1, name: "Beer", icon: CupSoda, count: 24, description: "Craft and commercial beers from around the world" },
  { id: 2, name: "Wine", icon: CupSoda, count: 18, description: "Red, white, and sparkling wines for every occasion" },
  { id: 3, name: "Spirits", icon: Package, count: 32, description: "Premium vodka, whiskey, gin, rum and more" },
  { id: 4, name: "Non-Alcoholic", icon: CupSoda, count: 12, description: "Refreshing options for non-drinkers" }
];

// Sample drinks for each category
const drinks: Record<string, DrinkItem[]> = {
  "Beer": [
    {
      id: 101,
      name: "Craft IPA",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Beer",
      description: "Hoppy IPA with citrus notes from a local craft brewery."
    },
    {
      id: 102,
      name: "Wheat Beer",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Beer",
      description: "Light and refreshing wheat beer with hints of coriander and orange peel."
    },
    {
      id: 103,
      name: "Amber Ale",
      price: 11.49,
      image: "https://images.unsplash.com/photo-1571989569011-0df95aac7159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Beer",
      description: "Balanced amber ale with caramel maltiness and moderate bitterness."
    }
  ],
  "Wine": [
    {
      id: 201,
      name: "Cabernet Sauvignon",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1584916551093-a4ad3392786e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Wine",
      description: "Full-bodied red wine with notes of black cherry and vanilla."
    },
    {
      id: 202,
      name: "Chardonnay",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Wine",
      description: "Medium-bodied white wine with apple, pear and buttery notes."
    }
  ],
  "Spirits": [
    {
      id: 301,
      name: "Premium Vodka",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1614963366795-973eb8748ebb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Spirits",
      description: "Smooth premium vodka, perfect for cocktails or enjoying on the rocks."
    },
    {
      id: 302,
      name: "Japanese Whisky",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Spirits",
      description: "Smooth and complex whisky with hints of smoke and honey."
    }
  ],
  "Non-Alcoholic": [
    {
      id: 401,
      name: "Craft Cola",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Non-Alcoholic",
      description: "Artisanal cola made with natural ingredients and cane sugar."
    },
    {
      id: 402,
      name: "Sparkling Water",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1603394630850-69b3ca8121ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Non-Alcoholic",
      description: "Refreshing sparkling water with natural flavors."
    }
  ]
};

const Categories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  // Filter drinks based on search term and active category
  const filteredDrinks = activeCategory 
    ? drinks[activeCategory].filter(drink => 
        drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drink.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : Object.values(drinks).flat().filter(drink =>
        drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drink.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Browse Categories
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore our wide selection of premium drinks, from craft beers to fine wines, spirits, and non-alcoholic options.
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
                  <category.icon 
                    className={`text-2xl ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
                    size={24} 
                  />
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Badge variant={isActive ? "default" : "outline"}>{category.count} items</Badge>
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
