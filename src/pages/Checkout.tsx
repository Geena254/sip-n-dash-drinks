
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LocationPicker from '@/components/LocationPicker';

const Checkout: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    latitude: 0,
    longitude: 0,
    city: '',
    zipCode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({ 
      ...prev, 
      address,
      latitude: lat,
      longitude: lng
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    const requiredFields = ['name', 'email', 'phone', 'address'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Please fill in all fields",
        description: `Missing: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Process order
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Simulate API call
      clearCart();
      navigate('/confirmation', { 
        state: { 
          orderNumber: Math.floor(100000 + Math.random() * 900000).toString(),
          deliveryTime: '30-45 minutes'
        } 
      });
    }, 1500);
  };
  
  // Calculate delivery fee and tax
  const deliveryFee = 3.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="(555) 123-4567" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Location</Label>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialAddress={formData.address}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || items.length === 0}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
