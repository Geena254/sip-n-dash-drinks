import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
    const categoryName = typeof drink.category === 'object' && drink.category !== null 
      ? drink.category.name 
      : typeof drink.category === 'string' 
        ? drink.category 
        : 'Uncategorized';
    
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(drink);
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedDrinks, fetchedCategories] = await Promise.all([
          supabaseAPI.getProducts(),
          supabaseAPI.getCategories()
        ]);
        
        setDrinks(fetchedDrinks);
        
        // Calculate product count for each category based on category_id
        const categoriesWithCount = fetchedCategories.map(category => {
          const productCount = fetchedDrinks.filter(drink => drink.category_id === category.id).length;
          
          return {
            ...category,
            product_count: productCount
          };
        });
        
        setCategories(categoriesWithCount);
      } catch (err) {
        console.error("🔥 Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setCurrentPage(1);
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  const lowerSearch = searchTerm.toLowerCase();

  const categoryDrinks = activeCategory && groupedDrinks[activeCategory]
    ? groupedDrinks[activeCategory]
    : [];

  const filteredDrinks = activeCategory
    ? categoryDrinks.filter(({ name, description }) =>
        name?.toLowerCase().includes(lowerSearch) ||
        description?.toLowerCase().includes(lowerSearch)
      )
    : Object.values(groupedDrinks)
        .flat()
        .filter(({ name, description }) =>
          name?.toLowerCase().includes(lowerSearch) ||
          description?.toLowerCase().includes(lowerSearch)
        );

  const totalPages = Math.ceil(filteredDrinks.length / ITEMS_PER_PAGE);
  const paginatedDrinks = filteredDrinks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaginationDots = () => {
    const dots = [];
    const maxVisibleDots = 5;
    
    if (totalPages <= maxVisibleDots) {
      for (let i = 1; i <= totalPages; i++) {
        dots.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              •
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first dot
      dots.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            •
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        dots.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show dots around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        dots.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              •
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        dots.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last dot
      dots.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            •
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return dots;
  };

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
              setCurrentPage(1);
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
              onClick={() => handleCategoryClick(category.name || '')}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Badge variant={isActive ? "default" : "outline"}>{category.product_count || 0} items</Badge>
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
                  image: drink.image_url || '/placeholder.svg',
                  category:
                    typeof drink.category === 'object' && drink.category !== null
                      ? drink.category.name || 'Uncategorized'
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {renderPaginationDots()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Categories;
