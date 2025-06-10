
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Search, ChevronLeft, Clock, Users, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { supabaseAPI, CocktailRecipe } from '@/service/supabaseService';

interface RecipeCardProps {
  recipe: CocktailRecipe;
  onClick: (recipe: CocktailRecipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <Card
      className="cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md"
      onClick={() => onClick(recipe)}
    >
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={recipe.image_url || '/placeholder.svg'}
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock size={16} className="mr-1" />
          <span>{recipe.prep_time} min</span>
        </div>
        <Badge variant="outline">{recipe.difficulty}</Badge>
      </CardFooter>
    </Card>
  );
};

interface RecipeDetailsProps {
  recipe: CocktailRecipe | null;
  onClose: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  const ingredients = recipe.ingredients.split(',').map(ing => ing.trim());
  const instructions = recipe.instructions.split('.').filter(inst => inst.trim()).map(inst => inst.trim());

  return (
    <Dialog open={!!recipe} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={onClose}>
              <ChevronLeft size={18} />
            </Button>
            {recipe.name}
          </DialogTitle>
          <DialogDescription className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="sm:w-1/2">
              <img
                src={recipe.image_url || '/placeholder.svg'}
                alt={recipe.name}
                className="w-full h-48 sm:h-64 object-cover rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="sm:w-1/2">
              <p className="mb-4">{recipe.description}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                  <Clock size={18} className="mb-1" />
                  <span className="text-xs font-medium">Prep Time</span>
                  <span className="text-sm">{recipe.prep_time} min</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                  <Users size={18} className="mb-1" />
                  <span className="text-xs font-medium">Difficulty</span>
                  <span className="text-sm">{recipe.difficulty}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                  <ChevronsUpDown size={18} className="mb-1" />
                  <span className="text-xs font-medium">Category</span>
                  <span className="text-sm">{recipe.category}</span>
                </div>
              </div>
              <Badge>{recipe.category}</Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary mt-2 mr-2"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <ol className="space-y-3">
              {instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-medium mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Recipes: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<CocktailRecipe | null>(null);
  const [recipes, setRecipes] = useState<CocktailRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await supabaseAPI.getCocktailRecipes();
        setRecipes(data);
      } catch (err) {
        console.error('Error loading cocktail recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeClick = (recipe: CocktailRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
  };

  const groupedRecipes = recipes.reduce<Record<string, CocktailRecipe[]>>((acc, recipe) => {
    const category = recipe.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(recipe);
    return acc;
  }, {});

  const categories = Object.keys(groupedRecipes).map(categoryName => ({
    id: categoryName,
    name: categoryName,
    description: `Delicious ${categoryName.toLowerCase()} cocktail recipes`,
    count: groupedRecipes[categoryName].length
  }));

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  const lowerSearch = searchTerm.toLowerCase();

  const categoryRecipes = activeCategory && groupedRecipes[activeCategory]
    ? groupedRecipes[activeCategory]
    : [];

  const filteredRecipes = activeCategory
    ? categoryRecipes.filter(({ name, description }) =>
        name.toLowerCase().includes(lowerSearch) ||
        (description && description.toLowerCase().includes(lowerSearch))
      )
    : Object.values(groupedRecipes)
        .flat()
        .filter(({ name, description }) =>
          name.toLowerCase().includes(lowerSearch) ||
          (description && description.toLowerCase().includes(lowerSearch))
        );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold barrush-gradient-text from-primary to-secondary bg-clip-text text-transparent">
          Browse Drink Recipes
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore our collection of cocktail and drink recipes. Impress your friends and family with these easy-to-make drinks.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipe by name or description..."
            type="text"
            className="pl-10"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
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
                  <Badge variant={isActive ? "default" : "outline"}>{category.count} recipes</Badge>
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
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {activeCategory ? `${activeCategory} Recipes` : "All Recipes"}
          </h2>
          {activeCategory && (
            <Button variant="outline" onClick={() => setActiveCategory(null)} size="sm">
              View All Categories
            </Button>
          )}
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={handleRecipeClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-lg font-medium">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Recipe Details Modal */}
      <RecipeDetails
        recipe={selectedRecipe}
        onClose={handleCloseRecipe}
      />
    </div>
  );
};

export default Recipes;
