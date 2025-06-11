
import React from 'react';
import { useCart, DrinkItem } from '@/context/CartContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

type Drink = {
  id: number;
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
  image_url?: string;
};

interface DrinkCardProps {
  drink: Drink;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const { addToCart } = useCart();

  // Use image_url if available, otherwise fallback to image
  const imageUrl = drink.image_url || drink.image || '/placeholder.svg';

  const drinkItem: DrinkItem = {
    id: drink.id,
    name: drink.name,
    price: drink.price,
    description: drink.description,
    image: imageUrl,
    category: drink.category
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={drink.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{drink.name}</h3>
            <p className="text-sm text-muted-foreground">{drink.category}</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg">KES {drink.price?.toLocaleString('en-KE') || 0}</span>
          </div>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{drink.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => addToCart(drinkItem)}
          className="w-full gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DrinkCard;
