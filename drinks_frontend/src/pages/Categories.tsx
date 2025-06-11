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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching categories and products...");
        
        const [fetchedCategories, fetchedDrinks] = await Promise.all([
          supabaseAPI.getCategories(),
          supabaseAPI.getProducts()
        ]);
        
        console.log("Fetched categories:", fetchedCategories);
        console.log("Fetched drinks:", fetchedDrinks);
        
        setDrinks(fetchedDrinks);
        
        // Calculate product count for each category
        const categoriesWithCount = fetchedCategories.map(category => {
          const productCount = fetchedDrinks.filter(drink => drink.category_id === category.id).length;
          console.log(`Category ${category.name} has ${productCount} products`);
          
          return {
            ...category,
            product_count: productCount
          };
        });
        
        setCategories(categoriesWithCount);
      } catch (err) {
        console.error("🔥 Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setCurrentPage(1);
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  const lowerSearch = searchTerm.toLowerCase();

  // Group drinks by category name
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

  console.log("Grouped drinks:", groupedDrinks);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading categories and products...</p>
        </div>
      </div>
    );
  }

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

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
        {categories.map((category) => {
          const isActive = activeCategory === category.name;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all transform hover:-translate-y-1 ${isActive ? 'border-primary shadow-md' : ''} p-2`}
              onClick={() => handleCategoryClick(category.name || '')}
            >
              <CardHeader className="pb-1">
                <CardTitle className="text-base font-medium">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center">
                <Badge variant={isActive ? "default" : "outline"} className="text-[10px]">
                  {category.product_count || 0} items
                </Badge>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  className="h-6 w-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
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
