
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Add some drinks to get started!</p>
        <Link to="/">
          <Button>Browse Drinks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <Button variant="ghost" onClick={clearCart} className="text-muted-foreground">
          Clear Cart
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="space-y-1">
          {items.map((item) => (
            <CartItem 
              key={item.id} 
              id={item.id} 
              name={item.name} 
              price={item.price} 
              image={item.image} 
              quantity={item.quantity} 
            />
          ))}
        </div>
        
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="font-medium text-lg">Subtotal</span>
            <span className="font-bold text-xl">KES {total}</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link to="/checkout" className="w-full">
              <Button className="w-full gap-2">
                Proceed to Checkout
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
