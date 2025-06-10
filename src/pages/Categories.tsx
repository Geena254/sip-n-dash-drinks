import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DrinkCard from '@/components/DrinkCard';
import { supabaseAPI, Category, Product } from '@/service/supabaseService';

const ITEMS_PER_PAGE = 24;

const Categories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [drinks, setDrinks] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const groupedDrinks = drinks.reduce<Record<string, Product[]>>((acc, drink) => {
    const category = drink.category?.name ?? 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(drink);
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedDrinks, fetchedCategories] = await Promise.all([
        supabaseAPI.getProducts(),
        supabaseAPI.getCategories()
      ]);
      setDrinks(fetchedDrinks);
      setCategories(fetchedCategories);
    };

    fetchData().catch((err) => {
      console.error("🔥 Error fetching data:", err.message);
    });
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setCurrentPage(1); // reset pagination when category changes
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

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

  const totalPages = Math.ceil(filteredDrinks.length / ITEMS_PER_PAGE);
  const paginatedDrinks = filteredDrinks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset pagination on search
            }}
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
              className={`cursor-pointer transition-all transform hover:-translate-y-1 ${isActive ? 'border-primary shadow-md' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Badge variant={isActive ? "default" : "outline"}>{category.product_count} items</Badge>
                <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="text-xs">
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

        {paginatedDrinks.length > 0 ? (
          <div className="drink-card-container">
            {paginatedDrinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={{
                  ...drink,
                  category:
                    typeof drink.category === 'object' && drink.category !== null
                      ? drink.category.name
                      : typeof drink.category === 'string'
                        ? drink.category
                        : 'Uncategorized'
                }}
              />
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
