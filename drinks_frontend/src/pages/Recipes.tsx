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

// Sample data for recipe categories
// const categories = [
//     { id: 1, name: "Cocktails", icon: CupSoda, count: 4, description: "Classic and creative mixed drinks" },
//     { id: 2, name: "Mocktails", icon: CupSoda, count: 2, description: "Non-alcoholic alternatives with great flavor" },
//     { id: 3, name: "Wine Drinks", icon: CupSoda, count: 2, description: "Wine-based beverages from sangria to spritzers" },
//     { id: 4, name: "Beer & Rum Mixes", icon: Package, count: 2, description: "Refreshing beer-based and rum-based cocktails" },
//     { id: 5, name: "Coffee & Hot", icon: CupSoda, count: 1, description: "Warm drinks for cozy evenings" }
// ];

// Sample recipes for each category
// const recipes = {
//     "Cocktails": [
//         {
//             id: 101,
//             name: "Classic Mojito",
//             price: null,
//             image: "https://images.pexels.com/photos/4021887/pexels-photo-4021887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//             category: "Cocktails",
//             description: "A refreshing Cuban highball with rum, mint, lime, and sugar",
//             prepTime: "5 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "2 oz white rum",
//                 "1 oz fresh lime juice",
//                 "2 teaspoons sugar",
//                 "6-8 mint leaves",
//                 "Soda water",
//                 "Ice cubes"
//             ],
//             instructions: [
//                 "Muddle mint leaves with sugar and lime juice in a glass",
//                 "Add ice and rum",
//                 "Top with soda water and stir gently",
//                 "Garnish with mint sprig and lime wedge"
//             ]
//         },
//         {
//             id: 102,
//             name: "Dawa Cocktail",
//             price: null,
//             image: "https://cdn.pixabay.com/photo/2016/02/04/14/52/drink-1179309_1280.jpg",
//             category: "Cocktails",
//             description: "A refreshing simple cocktail made with vodka, lime, and honey",
//             prepTime: "5 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "60ml vodka",
//                 "1 lime, cut into quarters",
//                 "2 tablespoons honey",
//                 "Ice cubes"
//             ],
//             instructions: [
//                 "Put honey on a stick (traditionally a dawa stick, but you can use a wooden spoon)",
//                 "Put the lime quarters in a tumbler glass",
//                 "Add crushed ice and vodka",
//                 "Use the honey stick to muddle the limes while mixing in the honey"
//             ]
//         },
//         {
//             id: 103,
//             name: "Whiskey Sour",
//             price: null,
//             image: "https://images.pexels.com/photos/6542666/pexels-photo-6542666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//             category: "Cocktails",
//             description: "A perfectly balanced mix of whiskey, lemon juice, and sugar",
//             prepTime: "5 minutes",
//             servings: 1,
//             difficulty: "Medium",
//             ingredients: [
//                 "2 oz bourbon whiskey",
//                 "3/4 oz fresh lemon juice",
//                 "3/4 oz simple syrup",
//                 "1 egg white (optional)",
//                 "Ice cubes",
//                 "Cherry and orange slice for garnish"
//             ],
//             instructions: [
//                 "Add all ingredients to a shaker with ice",
//                 "Shake vigorously for 15 seconds",
//                 "Strain into a rocks glass over fresh ice",
//                 "Garnish with cherry and orange slice"
//             ]
//         },
//         {
//             id: 104,
//             name: "Margarita",
//             price: null,
//             image: "https://images.pexels.com/photos/29463223/pexels-photo-29463223/free-photo-of-refreshing-margarita-cocktail-with-lime-garnish.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//             category: "Cocktails",
//             description: "A classic tequila cocktail with lime and orange liqueur",
//             prepTime: "3 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "2 oz tequila",
//                 "1 oz fresh lime juice",
//                 "1/2 oz triple sec or Cointreau",
//                 "1/2 oz agave syrup or simple syrup",
//                 "Salt for rim (optional)",
//                 "Lime wheel for garnish"
//             ],
//             instructions: [
//                 "If desired, salt the rim of a glass",
//                 "Fill a shaker with ice and add all ingredients",
//                 "Shake until well-chilled",
//                 "Strain into the prepared glass over fresh ice",
//                 "Garnish with a lime wheel"
//             ]
//         }
//     ],
//     "Mocktails": [
//         {
//             id: 201,
//             name: "Virgin Mojito",
//             price: null,
//             image: "https://images.pexels.com/photos/7376791/pexels-photo-7376791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//             category: "Mocktails",
//             description: "A refreshing non-alcoholic version of the classic mojito",
//             prepTime: "5 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "8-10 mint leaves",
//                 "1 oz fresh lime juice",
//                 "2 teaspoons sugar",
//                 "Soda water",
//                 "Ice cubes"
//             ],
//             instructions: [
//                 "Muddle mint leaves with sugar and lime juice in a glass",
//                 "Add ice cubes",
//                 "Top with soda water and stir gently",
//                 "Garnish with mint sprig and lime wedge"
//             ]
//         },
//         {
//             id: 202,
//             name: "Cucumber Refresher",
//             price: null,
//             image: "https://images.pexels.com/photos/9371644/pexels-photo-9371644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//             category: "Mocktails",
//             description: "A cool, spa-like drink with cucumber, lime, and mint",
//             prepTime: "7 minutes",
//             servings: 2,
//             difficulty: "Easy",
//             ingredients: [
//                 "1/2 cucumber, sliced",
//                 "1 lime, juiced",
//                 "1 tbsp honey or simple syrup",
//                 "8 mint leaves",
//                 "Soda water",
//                 "Ice cubes"
//             ],
//             instructions: [
//                 "Muddle cucumber, lime juice, honey, and mint in a pitcher",
//                 "Strain into glasses filled with ice",
//                 "Top with soda water",
//                 "Garnish with cucumber slice and mint sprig"
//             ]
//         }
//     ],
//     "Wine Drinks": [
//         {
//             id: 301,
//             name: "Classic Sangria",
//             price: null,
//             image: "https://cdn.pixabay.com/photo/2019/09/11/18/36/sangria-4469555_1280.jpg",
//             category: "Wine Drinks",
//             description: "A fruity, Spanish wine punch perfect for parties",
//             prepTime: "15 minutes + 2 hours chill time",
//             servings: 6,
//             difficulty: "Medium",
//             ingredients: [
//                 "1 bottle red wine (preferably Spanish)",
//                 "1/4 cup brandy",
//                 "1/4 cup orange liqueur",
//                 "2 tbsp sugar",
//                 "1 orange, sliced",
//                 "1 lemon, sliced",
//                 "1 apple, diced",
//                 "1 cup club soda"
//             ],
//             instructions: [
//                 "In a large pitcher, combine wine, brandy, orange liqueur, and sugar",
//                 "Stir until sugar dissolves",
//                 "Add sliced fruits and stir gently",
//                 "Refrigerate for at least 2 hours or overnight",
//                 "Add club soda just before serving and stir",
//                 "Serve over ice with fruit pieces in each glass"
//             ]
//         },
//         {
//             id: 302,
//             name: "White Wine Spritzer",
//             price: null,
//             image: "https://media.istockphoto.com/id/185303573/photo/lemonade.jpg?s=1024x1024&w=is&k=20&c=IGPt8QmK2zcft_mm9h95uw0a-O0oNrernAQRcscV1AE=",
//             category: "Wine Drinks",
//             description: "A light, refreshing drink perfect for summer",
//             prepTime: "2 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "3 oz chilled white wine",
//                 "2 oz club soda",
//                 "Lemon or lime twist",
//                 "Ice cubes"
//             ],
//             instructions: [
//                 "Fill a wine glass with ice cubes",
//                 "Pour in the white wine",
//                 "Top with club soda",
//                 "Gently stir and garnish with lemon or lime twist"
//             ]
//         }
//     ],
//     "Beer & Rum Mixes": [
//         {
//             id: 401,
//             name: "Michelada",
//             price: null,
//             image: "https://cdn.pixabay.com/photo/2015/09/05/21/30/michelada-925437_1280.jpg",
//             category: "Beer Mixes",
//             description: "A spicy Mexican beer cocktail with lime and hot sauce",
//             prepTime: "5 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "12 oz Mexican lager beer",
//                 "1 oz lime juice",
//                 "2 dashes hot sauce",
//                 "2 dashes Worcestershire sauce",
//                 "1 dash soy sauce",
//                 "Salt and tajin for rim",
//                 "Ice cubes"
//             ],
//             instructions: [
//                 "Rim a glass with salt and tajin mixture",
//                 "Fill the glass with ice",
//                 "Add lime juice, hot sauce, Worcestershire sauce, and soy sauce",
//                 "Stir gently",
//                 "Slowly pour in the beer",
//                 "Garnish with a lime wedge"
//             ]
//         },
//         {
//             id: 402,
//             name: "Piña Colada",
//             price: null,
//             image: "https://img.freepik.com/premium-photo/rum-based-pina-colada-cocktail-with-pineapple-juice-coconut-milk_157927-1318.jpg?w=740",
//             category: "Beer Mixes",
//             description: "A spicy Mexican beer cocktail with lime and hot sauce",
//             prepTime: "5 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "60ml white rum",
//                 "90ml pineapple juice",
//                 "30ml coconut cream",
//                 "Ice cubes",
//                 "Pineapple slice and cherry for garnish"
//             ],
//             instructions: [
//                 "Add rum, pineapple juice, coconut cream, and ice to a blender",
//                 "Blend until smooth and frothy",
//                 "Pour into a chilled glass",
//                 "Garnish with pineapple slice and cherry"
//             ]
//         }
//     ],
//     "Coffee & Hot": [
//         {
//             id: 501,
//             name: "Espresso Martini",
//             price: null,
//             image: "https://img.freepik.com/premium-photo/espresso-martini-cocktails-with-coffee-beans_82893-18500.jpg?w=740",
//             category: "Coffee & Hot",
//             description: "A classic espresso-based cocktail",
//             prepTime: "5 minutes",
//             servings: 1,
//             difficulty: "Easy",
//             ingredients: [
//                 "2 oz vodka",
//                 "1 oz coffee liqueur",
//                 "1 oz simple syrup",
//                 "1 oz espresso",
//                 "Coffee beans for garnish"
//             ],
//             instructions: [
//                 "Add vodka, coffee liqueur, simple syrup, and espresso to a cocktail shaker",
//                 "Shake vigorously",
//                 "Strain into a chilled cocktail glass",
//                 "Garnish with coffee beans"
//             ]
//         }
//     ]
// };

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
                                    {/* <category.icon
                                        className={`text-2xl ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                                        size={24}
                                    /> */}
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