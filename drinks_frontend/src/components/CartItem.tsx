
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options: string[];
}

const CartItem: React.FC<CartItemProps> = ({ id, name, price, image, quantity, options }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center py-4 border-b last:border-b-0">
      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="ml-4 flex-1">
        <h3 className="font-medium">{name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold">KES {price}</span>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(id, quantity - 1)}
            >
              <Minus size={14} />
            </Button>

            <span className="w-10 text-center">{quantity}</span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(id, quantity + 1)}
            >
              <Plus size={14} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2 text-red-500"
              onClick={() => removeFromCart(id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
