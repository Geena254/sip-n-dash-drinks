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
};

interface DrinkCardProps {
  drink: Drink;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={drink.image}
          alt={drink.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{drink.name}</h3>
            <p className="text-sm text-muted-foreground">{drink.category}</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg">KES {drink.price.toLocaleString('en-KE')}</span>
          </div>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{drink.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => addToCart(drink)}
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
