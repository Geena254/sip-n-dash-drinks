import React, { useState, useEffect} from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CupSoda, Package, ShoppingBag, Search, ChevronLeft, Clock, Users, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { getCocktails, getCocktailCategories } from '@/service/apiService';

type Drink = {
    id: number;
    title: string;
    price: number | null;
    image: string;
    category: string;
    description: string;
    time: string;
    serve_count: number;
    difficulty: string;
    ingredients: string[];
    instructions: string[];
  };

const RecipeCard = ({ recipe, onClick }) => {
    return (
        <Card
            className="cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md"
            onClick={() => onClick(recipe)}
        >
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                    src={recipe.image}
                    alt={recipe.tittle}
                    className="w-full h-full object-cover"
                />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={16} className="mr-1" />
                    <span>{recipe.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Users size={16} className="mr-1" />
                    <span>Serves {recipe.serve_count}</span>
                </div>
            </CardFooter>
        </Card>
    );
};

const RecipeDetails = ({ recipe, onClose }) => {
    return (
        <Dialog open={!!recipe} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center">
                        <Button variant="ghost" size="sm" className="mr-2" onClick={onClose}>
                            <ChevronLeft size={18} />
                        </Button>
                        {recipe?.title}
                    </DialogTitle>
                    <DialogDescription className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="sm:w-1/2">
                            <img
                                src={recipe?.image}
                                alt={recipe?.title}
                                className="w-full h-48 sm:h-64 object-cover rounded-md"
                            />
                        </div>
                        <div className="sm:w-1/2">
                            <p className="mb-4">{recipe?.description}</p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                                    <Clock size={18} className="mb-1" />
                                    <span className="text-xs font-medium">Prep Time</span>
                                    <span className="text-sm">{recipe?.time}</span>
                                </div>
                                <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                                    <Users size={18} className="mb-1" />
                                    <span className="text-xs font-medium">Servings</span>
                                    <span className="text-sm">{recipe?.serve_count}</span>
                                </div>
                                <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                                    <ChevronsUpDown size={18} className="mb-1" />
                                    <span className="text-xs font-medium">Difficulty</span>
                                    <span className="text-sm">{recipe?.difficulty}</span>
                                </div>
                            </div>
                            <Badge>{recipe?.category}</Badge>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                        <ul className="space-y-2">
                            {recipe?.ingredients.map((ingredient: string, index: number) => (
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
                            {recipe?.instructions.map((step, index) => (
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

const Recipes = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const[categories, setCategories] = useState([]);
    const [drinks, setDrinks] = useState([]);

    const handleRecipeClick = (recipe: Drink) => {
        setSelectedRecipe(recipe);
    };

    const handleCloseRecipe = () => {
        setSelectedRecipe(null);
    };

    const groupedDrinks = drinks.reduce<Record<string, Drink[]>>((acc, drink) => {
      const category = drink.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(drink);
      return acc;
    }, {});

    const handleCategoryClick = (categoryName: string) => {
      setActiveCategory(activeCategory === categoryName ? null : categoryName);
    };

    // drinks category fetch
    const fetchDrinksCategories = async () => {
      try {
        const data = await getCocktailCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading Categories:', err);
      }
    };
    useEffect(() => {
      fetchDrinksCategories();
    }, []);

     // drinks fetch
     const fetchDrinks = async () => {
      try {
        const data = await getCocktails();
        setDrinks(data);
      } catch (err) {
        console.error('Error loading Cocktails:', err);
      }
    };
    useEffect(() => {
      fetchDrinks();
    }, []);

    const lowerSearch = searchTerm.toLowerCase();

    const categoryDrinks = activeCategory && groupedDrinks[activeCategory]
      ? groupedDrinks[activeCategory]
      : [];

    const filteredRecipes = activeCategory
      ? categoryDrinks.filter(({ title, description }) =>
          title.toLowerCase().includes(lowerSearch) ||
          description.toLowerCase().includes(lowerSearch)
        )
      : Object.values(groupedDrinks)
          .flat()
          .filter(({ title, description }) =>
            title.toLowerCase().includes(lowerSearch) ||
            description.toLowerCase().includes(lowerSearch)
          );


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
                                <Badge variant={isActive ? "default" : "outline"}>{category.count} recipe</Badge>
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
            {selectedRecipe && (
                <RecipeDetails
                    recipe={selectedRecipe}
                    onClose={handleCloseRecipe}
                />
            )}
        </div>
    );
};

export default Recipes;