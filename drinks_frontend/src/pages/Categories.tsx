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
  { id: 4, name: "Cocktails", icon: CupSoda, count: 15, description: "Cocktails and premixed drinks" },
  { id: 5, name: "6 Pack", icon: CupSoda, count: 20, description: "Packs for you and your group" },
  { id: 6, name: "Mixers & More", icon: CupSoda, count: 25, description: "Refreshing options for non-drinkers" }
];

// Sample drinks for each category
const drinks: Record<string, DrinkItem[]> = {
  "Beer": [
    {
      id: 101,
      name: "White Cap Lager 500ml",
      price: 2.50,
      image: "https://greenspoon.co.ke/wp-content/uploads/2023/02/Greenspoon-Kenya-White-Cap-Can.jpg",
      category: "Beer",
      description: "A refreshing choice for those seeking a balanced and flavorful medium beer experience."
    },
    {
      id: 102,
      name: "Tusker Lager 500ml",
      price: 2.30,
      image: "https://greenspoon.co.ke/wp-content/uploads/2023/02/Greenspoon-Kenya-Tusker-Lager-Can.jpg",
      category: "Beer",
      description: "Kenya's iconic lager with a distinctive, refreshing taste that has been enjoyed for generations."
    },
    {
      id: 103,
      name: "Heineken Beer Bottle",
      price: 3.00,
      image: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVpbmVrZW58ZW58MHx8MHx8fDA%3D",
      category: "Beer",
      description: "The first light low-calorie Beer that makes a great substitute for any alcoholic beverage at the bar."
    }
  ],
  "Wine": [
    {
      id: 201,
      name: "Frontera Cabernet Sauvignon",
      price: 12.00,
      image: "https://cdn.shopify.com/s/files/1/0871/2640/9530/files/jcell_cabernet_f_375ml_v20-1707408341712.png?v=1715264982",
      category: "Wine",
      description: "Full-bodied red wine with notes of black cherry and vanilla."
    },
    {
      id: 202,
      name: "Chardonnay",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Wine",
      description: "Medium-bodied white wine with apple, pear and buttery notes."
    }
  ],
  "Spirits": [
    {
      id: 301,
      name: "Johnnie Walker Black Label",
      price: 38.00,
      image: "https://media.istockphoto.com/id/458070783/photo/johnnie-walker-black-label-whiskey.jpg?s=612x612&w=0&k=20&c=s01VpwN17K7yH5GUX0FAabraDzXwSKAXCQmimOceHmc=",
      category: "Spirits",
      description: "An iconic blend, recognized as the benchmark for all other deluxe blends."
    },
    {
      id: 302,
      name: "Jameson Irish Whisky",
      price: 25.99,
      image: "https://media.istockphoto.com/id/534200132/photo/bottle-of-jameson-irish-whiskey.jpg?s=612x612&w=0&k=20&c=3o3FjDtodeL3FPsRbqfFXL79-L8eUfnV33pir4qfYGE=",
      category: "Spirits",
      description: "Smooth and complex whisky with hints of smoke and honey."
    }
  ],
  "6 Pack": [
    {
      id: 401,
      name: "Tusker Lager 500ml 6 Pack",
      price: 19.99,
      image: "https://soys.co.ke/PImages/DEKQE-0.jpg",
      category: "6 Pack",
      description: "A selection of the finest craft beers, perfect for sharing."
    },
    {
      id: 402,
      name: "Heineken Beer 500ml 6 Pack",
      price: 19.99,
      image: "https://asiabrewery.com/cdn/shop/products/Heineken500mlCan_63c22d44-4255-46e7-88d0-76586f707502_800x.png?v=1653537601",
      category: "6 Pack",
      description: "A selection of the finest craft beers, perfect for sharing."
    },
    {
      id: 403,
      name: "Mixed Beer 6 Pack",
      price: 20.00,
      image: "https://www.kegcaskbottle.co.uk/cdn/shop/products/GermanCan6pack_1800x1800.jpg?v=1663868062",
      category: "6 Pack",
      description: "A mix of popular beers for every taste."
    }
  ],
  "Cocktails": [
    {
      id: 501,
      name: "Classic Mojito",
      price: 5.00,
      image: "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
      category: "Cocktails",
      description: "A refreshing and energizing drink made with mint, lime juice, sugar, and soda water."
    },
  ],
  "Mixers & More": [
    {
      id: 601,
      name: "Craft Cola",
      price: 0.80,
      image: "https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29jYSUyMGNvbGF8ZW58MHx8MHx8fDA%3D",
      category: "Mixers & More",
      description: "Artisanal cola made with natural ingredients and cane sugar."
    },
    {
      id: 602,
      name: "Schweppes",
      price: 0.80,
      image: "https://www.coca-cola.com/content/dam/onexp/ng/home-image/brands/schweppes/products/product-images-final/ng_schweppes_prod_virgin%20mojito_750x750.jpg",
      category: "Mixers & More",
      description:"A refreshing and energizing drink."
    },
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
